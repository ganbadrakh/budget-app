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

  const calculateTotal = function(type) {
    let sum = 0;
    data.allItems[type].forEach(cur => {
      sum += cur.value;
    });
    data.totals[type] = sum;
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
    budget: 0,
    percentage: -1,
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

    calculateBudget() {
      // calculate total income and expenses
      calculateTotal('inc');
      calculateTotal('exp');

      // Calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      // Calculate the percentage of income that we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    getBudget() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.Exp,
        percentage: data.percentage,
      };
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
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    dateLabel: '.budget__title--month',
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

    displayBudget(obj) {
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = `${obj.percentage} %`;
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
      }
    },

    displayMonth() {
      let now;
      let months;
      let month;
      let year;

      now = new Date();

      months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      month = now.getMonth();
      year = now.getFullYear();

      document.querySelector(DOMstrings.dateLabel).textContent = `${months[month]} ${year}`;
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
      budgetCtrl.calculateBudget();

      // 2. Return the budget
      const budget = budgetCtrl.getBudget();

      // 3. Display the budget on the UI
      UICtrl.displayBudget(budget);
    };

    const ctrlAddItem = function() {
      let input;
      let newItem;

      // 1. Get the field input data
      input = UICtrl.getInput();

      if (input.description !== '' && !Number.isNaN(input.value) && input.value > 0) {
        // 2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // 3. Add the item to the UI
        UICtrl.addListItem(newItem, input.type);

        // 4. Clear the fields
        UICtrl.clearFields();

        // 5. Calculate and update budget
        updateBudget();
      }
    };

    const ctrlDeleteItem = function(event) {
      let itemID;
      let splitID;
      let type;
      let ID;

      itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    };

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    if (itemID) {
      // inc-1
      splitID = itemID.split('-');
      type = splitID[0];
      ID = splitID[1];

      // 1. delete the item from the data structure

      // 2. Delete the item from the UI

      // 3. Update and show the new budget
    }

    document.addEventListener('keypress', event => {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
  };

  return {
    init() {
      console.log('Application has started');
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      });
      setupEventListeners();
    },
  };
})(budgetController, UIController);

controller.init();
