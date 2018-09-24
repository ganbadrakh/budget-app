// Budget Controller
const budgetControler = (function() {
  // some code
})();

// UI Controller
const UIController = (function() {
  const DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
  };
  return {
    getInput() {
      return {
        type: document.querySelector(DOMStrings.inputType).value, // will be either ins or exp
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value,
      };
    },

    getDOMStrings() {
      return DOMStrings;
    },
  };
})();

// Global App Controller
const controller = (function(budgetCtrl, UICtrl) {
  const DOM = UICtrl.getDOMStrings();

  const setupEventListeners = function() {
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', event => {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  const ctrlAddItem = function() {
    // 1. Get the  filled input data
    const input = UICtrl.getInput();

    // 2. Add the item to the budget controller
    // Add the item to the UI
    // 4. Calculate the budget
    // 5. Display the budget on the UI
  };

  return {
    init() {
      console.log('works');
      setupEventListeners();
    },
  };
})(budgetControler, UIController);

controller.init();
