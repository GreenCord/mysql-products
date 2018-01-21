var mysql = require("mysql");
var inquirer = require('inquirer');
require('dotenv').config();

var connection = mysql.createConnection({
	  host: "localhost",
	  port: 3306,

	  // Your username
	  user: "root",

	  // Your password
	  password: process.env.SQLPW,
	  database: "bamazon"
	});

connection.connect(function(err) {
  if (err) throw err;
  start();
});


function start() {
	// inquirer message - choose department
	// promise returned - list products from department & go to placeOrder
}

function placeOrder() {
	// inquirer message - get user's input for item_id and quantity to purchase
	// promise returned - check database quantities, if insufficient - error to user, else update db and display order total
	// go back to start
}

// function start() {
// 	var queryall = 'SELECT product_list.product_id, quantity, product_name, product_desc, price, departments.department_name ';
// 	queryall += 'FROM product_list ';
// 	queryall += 'INNER JOIN products ON (product_list.product_id = products.product_id) ';
// 	queryall += 'LEFT JOIN departments ON (products.department_id = departments.department_id)';
// 	connection.query(queryall, (err,res) => {
// 		if (err) throw err;
// 		console.log('ID | Price | Name');
// 		console.log('___________________________________________________________');
// 		for (var i = 0; i < res.length; i++) {
// 			var line = '';
// 			if (res[i].product_id <= 9) {
// 				line += ' ' + res[i].product_id;
// 			} else {
// 				line += res[i].product_id;
// 			}
// 			line += ' | ';
// 			if (res[i].price < 10) {
// 				line += '$ ' + res[i].price.toFixed(2);
// 			} else {
// 				line += '$' + res[i].price.toFixed(2);
// 			}
// 			line += ' | ' + res[i].product_name;
// 			console.log(line);
// 		}
// 	});
// }

// var bamazonCustomer = function(id,name) {
//   this.id = id;
//   this.name = name;
//   this.connection = mysql.createConnection({
// 	  host: "localhost",
// 	  port: 3306,

// 	  // Your username
// 	  user: "root",

// 	  // Your password
// 	  password: process.env.SQLPW,
// 	  database: "bamazon"
// 	});
// };

// bamazonCustomer.prototype.buy = function(){
// 		inquirer
// 			.prompt([
// 				{
// 					name: 'id',
// 					type: 'input',
// 					message: 'Enter the item ID of the product you wish to buy:'
// 				}
// 			]).then((ans)=>{});
	
// };

// bamazonCustomer.prototype.start = function(){
// 	this.connection.connect((err)=>{
// 	  if (err) throw err;
// 	  console.log("connected as id " + this.connection.threadId);
// 	});

// 	var queryall = 'SELECT product_list.product_id, quantity, product_name, product_desc, price, departments.department_name ';
// 	queryall += 'FROM product_list ';
// 	queryall += 'INNER JOIN products ON (product_list.product_id = products.product_id) ';
// 	queryall += 'LEFT JOIN departments ON (products.department_id = departments.department_id)';
// 	this.connection.query(queryall, (err,res) => {
// 		if (err) throw err;
// 		console.log('ID | Price | Name');
// 		console.log('___________________________________________________________');
// 		for (var i = 0; i < res.length; i++) {
// 			var line = '';
// 			if (res[i].product_id <= 9) {
// 				line += ' ' + res[i].product_id;
// 			} else {
// 				line += res[i].product_id;
// 			}
// 			line += ' | ';
// 			if (res[i].price < 10) {
// 				line += '$ ' + res[i].price.toFixed(2);
// 			} else {
// 				line += '$' + res[i].price.toFixed(2);
// 			}
// 			line += ' | ' + res[i].product_name;
// 			console.log(line);
// 		}
// 	});

// 	// inquirer.prompt({}).then(function(){});
// };



// module.exports = bamazonCustomer;