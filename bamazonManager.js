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


function viewInventory(query){
	
	connection.query(query, (err,res) => {
		if (err) throw err;
		if (res.length > 0) {
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
		} else {
			console.log('No products to list for this option.');
		}
		start();
	});
}

function replenishProduct(query){
	connection.query(query,(err,res)=>{
		inquirer
			.prompt([
				{
					name: 'item',
					type: 'input',
					message: 'Enter the ID of the product you want to replenish:',
					validate: function(value){
						var isok = /^\d*$/.test(value);
						if (isok) {
							return true;
						}
						return 'Please enter the ID number of the product you want to replenish.';
					}
				},
				{
					name: 'quantity',
					type: 'input',
					message: 'Enter the amount of stock you wish to add:',
					validate: function(value){
						var isok = /^\d*$/.test(value);
						if (isok) {
							return true;
						}
						return 'Please enter a numeric value of the quantity you want to buy.';
					}
				}
			])
			.then((ans)=>{
				var dbref;
				for (var i = 0; i < res.length; i++) {
					// console.log('Comparing db to ans: ' + ans.item + ':' + res[i].product_id);
					if(res[i].product_id === parseInt(ans.item)) {
						dbref = res[i];
					}
				}
				console.log('You are adding ' + ans.quantity + ' of ' + dbref.product_name + '.');
				console.log('Old quantity: ' + dbref.quantity);
				if (parseInt(ans.quantity) > 0) {
					var newquantity = parseInt(dbref.quantity) + parseInt(ans.quantity);
					var updateQuery = 'UPDATE product_list SET ? WHERE ?';
					var updateQueryVars = 
						[
							{quantity: newquantity},
							{product_id: dbref.product_id}
						];
					connection.query(updateQuery,updateQueryVars,(err)=>{
						if (err) throw err;
						console.log('Order placed successfully. New quantity: ' + newquantity);
						inquirer
							.prompt({
								name: 'continue',
								type: 'confirm',
								message: 'Continue?'
							})
							.then((ans)=>{
								if (ans.continue) {
									start();
								} else {
									console.log('Thank you for managing Bamazon. Bye.');
									connection.end();
								}
							});
					});
				} else {
					console.log('Detected no quantity to add. No products replenished.');
					start();
				}
			});
		});
}

function addNewProduct(query){}

var where = '';
var query = '';
function updateQuery(where){
  query  = 'SELECT product_list.product_id, quantity, product_name, product_desc, price, departments.department_name ';
	query += 'FROM product_list ';
	query += 'INNER JOIN products ON (product_list.product_id = products.product_id) ';
	query += 'LEFT JOIN departments ON (products.department_id = departments.department_id) ';
	query += where;
	query += 'ORDER BY products.department_id, products.product_id;';
}

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
				  // pass '' for all products
				  updateQuery('');
					viewInventory(query);
				break;

				case 'View Low Inventory':
					// pass WHERE statement for quantities less than a number
					updateQuery('WHERE quantity < 5 ');
					viewInventory(query);
				break;

				case 'Add to Inventory':
					updateQuery('');
					replenishProduct(query);
				break;

				case 'Add New Product':
					updateQuery('');
					addNewProduct(query);
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