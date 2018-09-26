// Budget Controller
const budgetController = (function() {
  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
  };

  return {
    addItem(type, des, val) {
      let newItem;
      let ID;
      // Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Create new item based on type 'exp' or 'inc'
      if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }

      // Push it into our data structure
      data.allItems[type].push(newItem);

      // Return the new element
      return newItem;
    },
  };
})();

// UI Controller
const UIController = (function() {
  const DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
  };
  return {
    getInput() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // will be either ins or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
      };
    },

    addListItem(obj, type) {
      let html;
      let newHtml;
      let element;
      // Create HTML string with placeholder text
      if (type === 'inc') {
        element = DOMstrings.incomeContainer;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = DOMstrings.expensesContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      // Replace the placeholder text with some actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    clearFields() {
      let fields;
      let fieldsArr;

      fields = document.querySelectorAll(`${DOMstrings.inputDescription}, ${DOMstrings.inputValue}`);

      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach((current, index, array) => {
        current.value = '';
      });

      fieldsArr[0].focus();
    },

    getDOMstrings() {
      return DOMstrings;
    },
  };
})();

// Global App Controller
const controller = (function(budgetCtrl, UICtrl) {
  const setupEventListeners = function() {
    const DOM = UICtrl.getDOMstrings();

    const updateBudget = function() {
      // 1. Calculate the budget
      // 2. Return the budget
      // 3. Display the budget on the UI
    };

    const ctrlAddItem = function() {
      let input;
      let newItem;

      // 1. Get the field input data
      input = UICtrl.getInput();

      if (input.description !== '' && !Number.isNaN(input.value) && input.value > 0) {
        // 2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // Add the item to the UI
        UICtrl.addListItem(newItem, input.type);

        // 4. Clear the fields
        UICtrl.clearFields();

        // 5. Update und calculate budget
        updateBudget();
      }
    };

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', event => {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  return {
    init() {
      console.log('Application has started');
      setupEventListeners();
    },
  };
})(budgetController, UIController);

controller.init();
