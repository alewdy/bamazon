
var mysql = require("mysql");
var inquirer = require("inquirer");

//Creates connection info for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password:"root",
    database: "bamazon_db"
});

connection.connect(function(err, res){
    if (err) throw err;
    showPorudcts();
    startUp();
});

function showPorudcts() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " $" + " | ");
        }
        console.log("-----------------------------------");
    });
}

function startUp() {
    connection.query("SELECT * FROM products", function (err, res) {
    inquirer.prompt([{
            name: "itemId",
            type: "input",
            message: "Welcome to bamazon! Which product would you like to buy?",
            validate: function (value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }
        }, {
            name: "Quantity",
            type: "input",
            message: "How many would you like to purchase?",
            validate: function (value) {
                if(isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }
        }]).then(function (answer) {
            var chosenId = answer.itemId - 1;
            var chosenProduct = res[chosenId];
            var chosenQuantity = answer.Quantity;
            if (chosenQuantity < res[chosenId].stock_quantity) {
                console.log("Your total for " + "(" + answer.Quantity + ")" + " - " + res[chosenId].product_name + " is: " + res[chosenId].price * chosenQuantity);
                connection.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity: res[chosenId].stock_quantity - chosenQuantity
                }, {
                    id: res[chosenId].id
                }], function(err, res) {
                    startUp();
                });
            } else {
                console.log("Sorry, insufficient Quantity at this time. All we have is " + res[chosenId].stock_quantity + " in our inventory.");
            }
        })
    })
};