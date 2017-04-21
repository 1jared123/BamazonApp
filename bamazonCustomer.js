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

var toChoose = [];

var start = function() {
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
				var array = [res[i].item_id, res[i].product_name, res[i].price];
				toChoose.push(array);
			}
		}

		inquirer
			.prompt([
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
				if (answer.choice === 0) {
					console.log("better luck next time then...");
					connection.end();
				} else {
					connection.query("SELECT * from products WHERE item_id =" + answer.choice, function(err, res) {
							if (err) {
								console.log("ANOTHER ERROR!");
							} else {
								var haveIt = res[0].stock_quantity;
								var requested = parseFloat(answer.quantity);
								var price = res[0].price;
								var numLeft = haveIt - requested
								if (haveIt > requested) {
									console.log("There is enough");
									console.log("Ammount left: " + numLeft);
									console.log("Total = " +(requested * price).toFixed(2));

									connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?", [numLeft, answer.choice] , function(err, res) {
										console.log(res);

									});
									connection.end();
								} else {
									console.log("Insufficient quantity!");
									connection.end();
								}
							}
						}
					);
				}
			});
	});
};

start();

/*
// function to handle posting new items up for auction
var displayProducts = function() {
  // prompt for info about the item being put up for auction
  inquirer.prompt([{
    name: "item",
    type: "input",
    message: "What is the item you would like to submit?"
  }, {
    name: "category",
    type: "input",
    message: "What category would you like to place your auction in?"
  }, {
    name: "startingBid",
    type: "input",
    message: "What would you like your starting bid to be?",
    validate: function(value) {
      if (isNaN(value) === false) {
        return true;
      }
      return false;
    }
  }]).then(function(answer) {
    // when finished prompting, insert a new item into the db with that info
    connection.query("INSERT INTO auctions SET ?", {
      item_name: answer.item,
      category: answer.category,
      starting_bid: answer.startingBid,
      highest_bid: answer.startingBid
    }, function(err) {
      if (err) throw err;
      console.log("Your auction was created successfully!");
      // re-prompt the user for if they want to bid or post
      start();
    });
  });
};

// function to get all items available for bidding, and allow you to place a bid
var bidAuction = function() {
  // query the database for all items being auctioned
  connection.query("SELECT * FROM auctions", function(err, results) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer.prompt([
      {
        name: "choice",
        type: "rawlist",
        choices: function() {
          var choiceArray = [];
          for (var i = 0; i < results.length; i++) {
            choiceArray.push(results[i].item_name);
          }
          return choiceArray;
        },
        message: "What auction would you like to place a bid in?"
      },
      {
        name: "bid",
        type: "input",
        message: "How much would you like to bid?"
      }
    ]).then(function(answer) {
      // get the information of the chosen item
      var chosenItem;
      for (var i = 0; i < results.length; i++) {
        if (results[i].item_name === answer.choice) {
          chosenItem = results[i];
        }
      }

      // determine if bid was high enough
      if (chosenItem.highest_bid < parseInt(answer.bid)) {
        // bid was high enough, so update db, let the user know, and start over
        connection.query("UPDATE auctions SET ? WHERE ?", [{
          highest_bid: answer.bid
        }, {
          id: chosenItem.id
        }], function(error) {
          if (error) throw err;
          console.log("Bid placed successfully!");
          start();
        });
      }
      else {
        // bid wasn't high enough, so apologize and start over
        console.log("Your bid was too low. Try again...");
        start();
      }
    });
  });
};

// run the start function when the file is loaded to prompt the user
start();
*/
