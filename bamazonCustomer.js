var mysql = require("mysql");
var inquirer = require("inquirer");

//Here we connect to the server
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

//function to run everything
var start = function() {

  //here we pull everything from the database and display the items. 
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
					message: "What product would you like to buy? Pls input the Id number.",
					default: 0
				},

				{
					name: "quantity",
					type: "input",
					message: "How many would you like to buy?",
					default: 1
				}
			])
			.then(function(answer) {
        //now we going to do something what they said. 
        //if they didn't specify something then this shows.
				if (answer.choice === 0) {
					console.log("better luck next time then...");
					connection.end();
				} else {
          //if they did choose something we run this and see if they're's enough of what they want. 
					connection.query("SELECT * from products WHERE item_id =?", [answer.choice], function(err, res) {
							if (err) {
								console.log("ANOTHER ERROR!");
							} else {
								var haveIt = res[0].stock_quantity;
								var requested = parseFloat(answer.quantity);
								var price = res[0].price;
								var numLeft = haveIt - requested
								if (haveIt > requested) {
                  //if we have enough then we tell them there is enough and show the total and ammount left after all that's over.
									console.log("There is enough");
									console.log("Ammount left: " + numLeft);
									console.log("Total = $" +(requested * price).toFixed(2));
                  //then we update DB
									connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?", [numLeft, answer.choice] , function(err, res) {
										console.log("Updated!");

									});
									connection.end();
								} else {
									console.log("Insufficient quantity!");
									connection.end();
								}
							}
					});
				}
			});
	});
};

//here we start the process of money making and extortion. 
start();