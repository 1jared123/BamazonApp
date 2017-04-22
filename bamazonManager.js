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
	//give them the options to choose from.
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
    //now we ask what's the id of the item they'd like to add, then ask how many they are adding.
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
					message: "Adding how many?",
					default: 1
				}
			]).then(function(answer) {
        //if they didn't specify something then this shows.
				if (answer.choice === 0) {
					console.log("Ok not this time...");
					connection.end();
				} else {
					connection.query("SELECT * from products WHERE item_id =?", [answer.choice], function(err, res) {
						if (err) {
							console.log("ANOTHER ERROR!");
						} else {
							var haveIt = res[0].stock_quantity;
							var requested = parseFloat(answer.quantity);
							var newTotal = haveIt + requested
								connection.query("UPDATE products SET stock_quantity=? WHERE item_id =?", [newTotal, answer.choice], function(err, res) {
									if (err) {
										console.log("Stupid ERRORS!");
									} else {						
										console.log("You added " + newTotal + "worth of product");
									}
								});
								connection.end();
							}							
					});
				}
			});
	});
};

function newProduct() {
	//input info for new product
	inquirer.prompt([
		{
			name: "item",
			type: "input",
			message: "Name of Product.",
			default: 0
		},

		{
			name: "department",
			type: "input",
			message: "Department",
			default: "Food"
		},

		{
			name: "price",
			type: "input",
			message: "Cost of Product.",
			default: 1
		},

		{
			name: "stock",
			type: "input",
			message: "How many in stock?",
			default: 10
		}

	]).then(function(answer) {
		//if they didn't give us a name we won't go any further.
		if (answer.item === 0) {
			console.log("Ok not this time...");
			connection.end();
		} else {
 			 //here we adding the info
			connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUE (?, ?, ?, ?)", [answer.item, answer.department, answer.price, answer.stock], function(err, res) {
					if (err) {
						console.log("ANOTHER ERROR!");
					} else {						
						console.log("You added a new product!");
						connection.end();								
					}
				}
			);
		}
	});
};


