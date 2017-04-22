var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "IronMan",
	database: "BamazonDB"
});

connection.connect(function(err) {
	if (err) {
		console.log(err);
	}
});

function start() {
	inquirer.prompt([

				{
					name: "choice",
					type: "list",
					message: "Welcome, pls select what you'd like to do.",
					choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
					default: "'I'm just looking'"
				},
			])
			.then(function(answer) {

				switch (answer.choice) {
			      case "View Products for Sale":
			        viewProducts();
			        break;

			      case "View Low Inventory":
			        lowInventory();
			        break;

			      case "Add to Inventory":
			        addInventory();
			        break;

			      case "Add New Product":
			        newProduct();
			        break;
			    }
				
			});
}

start();

function viewProducts() {
	//lets display the products!!
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) {
			console.log("there was an error");
		} else {
			for (var i = 0; i < res.length; i++) {
				console.log(
					"Product ID: " +
						res[i].item_id +
						"\nName: " +
						res[i].product_name +
						"\nPrice: $" +
						res[i].price +
						"\nQuantity: " +
						res[i].stock_quantity +
						"\n"
				);
			};
		connection.end();
		};
	});
};

function lowInventory() {
	connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
		if (err) {
			console.log("there was an error");
		} else {
			for (var i = 0; i < res.length; i++) {
				console.log(
					"Product ID: " +
						res[i].item_id +
						"\nName: " +
						res[i].product_name +
						"\nPrice: $" +
						res[i].price +
						"\nQuantity: " +
						res[i].stock_quantity +
						"\n"
				);
			};
		connection.end();
		};
	});
};

function addInventory() {
	var query = "SELECT * FROM products";

	connection.query(query, function(err, res) {
		if (err) {
			console.log("there was an error");
		} else {
			for (var i = 0; i < res.length; i++) {
				console.log(
					"Product ID: " +
						res[i].item_id +
						"\nName: " +
						res[i].product_name +
						"\nDepartment: " +
						res[i].department_name +
						"\nPrice: $" +
						res[i].price +
						"\nQuantity: " +
						res[i].stock_quantity +
						"\n"
				);
			}
		}
    //now we ask what's the id of the item they'd like to buy, then ask how many.
		inquirer.prompt([
				{
					name: "choice",
					type: "input",
					message: "Adding more of what product? Pls input the Id number.",
					default: 0
				},

				{
					name: "quantity",
					type: "input",
					message: "How many you adding? you like to buy?",
					default: 1
				}
			]).then(function(answer) {
        //now we going to do something what they said. 
        //if they didn't specify something then this shows.
				if (answer.choice === 0) {
					console.log("Ok not this time...");
					connection.end();
				} else {
          //if they did choose something we run this and see if they're's enough of what they want. 
					connection.query("UPDATE products SET stock_quantity=? WHERE item_id =?," [answer.quantity, answer.choice], function(err, res) {
							if (err) {
								console.log("ANOTHER ERROR!");
							} else {						
								console.log("You added " +answer.quantity + "worth of products");
								connection.end();								
							}
						}
					);
				}
			});
	});
};

function newProduct() {

};


