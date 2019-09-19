// BUDGET CONTROLLER
var budgetController = (function() {
    
    // function contructors for creating new expense/income instances
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // calculate totals function
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });

        data.totals[type] = sum;
    };

    // data structure to hold all our data
    var data = {
        
        allItems: {
            exp: [],
            inc: []
        },
        
        totals: {
            exp: 0,
            inc: 0
        },

        budget: 0,
        percentage: -1

        
    };

    // public method
    return {
        addItem: function(type, des, val) {
            
            var newItem, ID;
            
            // create new ID

            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length -1].id + 1;
            } else {
                ID = 0;
            }

            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // push it into our data structure 
            data.allItems[type].push(newItem);

            // return the new element so it can be used by other modules
            return newItem;
        },

        // method that calculates the budget
        calculateBudget: function() {

            // calculate total income and expenses

            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget: income - expenses

            data.budget = data.totals.inc - data.totals.exp;

            // calculate percentages

            if (data.totals.inc > 0) {

                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);

            } else  {
                data.percentage = -1;
            }

        },

        // returns budget
        getBudget: function() {

            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }

        },


        // public testing method used to view our data structure in the console
        testing: function() {
            console.log(data);
        }
    };

})();


// UI CONTROLLER
var UIController = (function() {


    // object that holds all the html selector names for easy access by other modules
    // this allows us to pass in the DOMstrings object to other functions instead of having to write out the selector every time
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn:  '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    };

    return {

        getInput: function() {

            return {
                type: document.querySelector(DOMstrings.inputType).value, // will either be inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: function(obj, type) {
            var html, newHtml, element;

            // crate html string with text 

            if (type === 'inc') {
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            };

            // replace the placeholder text with actual data

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            
            // insert into the DOM

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        // clear input fields 

        clearFields: function() {
            var fields, fieldsArr;

            // returns a "list" not an array - will need to comvert this to an array using the slice() method
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            // .slice() method is in array.prototype we can access it here and then pass in fields as the argument using the .call() method!
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
                
            });

            fieldsArr[0].focus();

        },

        displayBudget: function(obj) {

            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;

            // only show percentage if the result is > 0
            if (obj.percentage > 0) {

                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';

            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';

            }
        },

        getDOMstrings: function() {

            return DOMstrings;
        }
    };

})();

// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function() {

        var DOM = UICtrl.getDOMstrings();
        
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {

            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    }

    var updateBudget = function() {

        // 1. Calculate the budget

        budgetCtrl.calculateBudget();

        // 2. method that returns the budget

        // needs to be stored in a variable because the method "returns" something 
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI

        UICtrl.displayBudget(budget);

    };    

    var ctrlAddItem = function() {

        var input, newItem;

        // 1. Get field input data

        input = UICtrl.getInput();
        
        if (input.description !== "" && !isNaN(input.value) && input.value > 0 ) {

            // 2. Add the item to the budget controller

            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the new item to the UI

            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the input fields

            UICtrl.clearFields();

            // 5. calculate and update budget

            updateBudget();

        }

    };

    var ctrlDeleteItem = function(event) {

        var itemID, splitID, type, ID;

        // traverse the DOM up the the parent elelment that contains the ID
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        // do NOT fire the function unless there is an item ID

        if (itemID) {

            // split the id by the " - "
            splitID = itemID.split('-');
            // type = income or expense
            type = splitIT[0];
            // ID = the ID
            ID = splitID[1];
        }

    };

    return {
        init: function() {
            console.log('Application has started.');

            // reset UI 
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });

            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();