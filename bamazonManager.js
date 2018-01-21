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


function viewInventory(where){
	var queryall  = 'SELECT product_list.product_id, quantity, product_name, product_desc, price, departments.department_name ';
			queryall += 'FROM product_list ';
			// queryall += where;
			queryall += 'INNER JOIN products ON (product_list.product_id = products.product_id) ';
			queryall += 'LEFT JOIN departments ON (products.department_id = departments.department_id) ';
			queryall += where;
			queryall += 'ORDER BY products.department_id, products.product_id;';

	connection.query(queryall, (err,res) => {
		if (err) throw err;
		console.log('  ID |  Price | Quantity | Name');
		console.log('___________________________________________________________');
		for (var i = 0; i < res.length; i++) {
			var line = '';
			if (res[i].product_id <= 9) {
				line += ' ' + res[i].product_id;
			} else {
				line += res[i].product_id;
			}
			line += ' | ';
			if (res[i].price < 10) {
				line += '$ ' + res[i].price.toFixed(2);
			} else {
				line += '$' + res[i].price.toFixed(2);
			}
			if (res[i].quantity < 10) {
				line += ' |        ' + res[i].quantity;	
			} else if (res[i].quantity < 100) {
				line += ' |       ' + res[i].quantity;
			} else {
				line += ' |      ' + res[i].quantity;
			}
			line += ' | ' + res[i].department_name + '/' + res[i].product_name;
			console.log('  ' + line);
		}
		start();
	});
}

function replenishProduct(){}

function addNewProduct(){}

function start(){
	inquirer
		.prompt({
			name: 'action',
			type: 'list',
			message: 'Hello, manager. Choose an option:',
			choices: [
				'View Products for Sale',
				'View Low Inventory',
				'Add to Inventory',
				'Add New Product',
				'Exit Application'
			]
		})
		.then((ans)=>{
			switch (ans.action) {
				case 'View Products for Sale':
					viewInventory('');
				break;

				case 'View Low Inventory':
					viewInventory('WHERE quantity < 5 ');
				break;

				case 'Add to Inventory':
					replenishProduct();
				break;

				case 'Add New Product':
					addNewProduct();
				break;

				case 'Exit Application':
					console.log('Thank you for managing Bamazon. Bye.');
					connection.end();
				break;

				default: 
				console.log('Sorry, that is not an option. Try again.');
				start();
			}
		});
}