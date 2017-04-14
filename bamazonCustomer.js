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
})

connection.query("SELECT products.product_name FROM products ", function(error, response) {
	if (error) {
		console.log(error);
	} else {
		for (var i = 0; i <response.length; i++) {
			 
		}
		return response;
	}
}) 
