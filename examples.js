
// Immediately invoked function expressions will be used here to contain all the code and keep it separated private and organized


// budget module - this will contain all the code that controls the budget logic
var budgetController = (function() { // function is declared and called immediately 
    var x = 23;
    var add = function(a) {
        return x + a;
    }

    // this is a closure that has access to the outer functions variables and fuctions

    return {
        publicTest: function(b) {
            return (add(b));
        }
    }
})();


// UI module - this will contain all the code that controls the UI
var UIController = (function() {

    // some code here

})();

// connects the other two modules

var controller = (function(budgetCtrl, UICtrl) {

     var z = budgetCtrl.publicTest(5);

     return {
         anotherPublic: function() {
             console.log(z);
         }
     }

})(budgetController, UIController); // this is how the controller links together with the other tow modules