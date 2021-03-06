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
	  database: "bamazon",
	  insecureAuth: true
	});

connection.connect(function(err) {
  if (err) throw err;
  start();
});

var grandTotal = 0;

function start() {
	console.log('Starting session...');
	console.log('\033c');
	// get departments from db:
	
	connection.query('SELECT department_id, department_name FROM departments',(err,res)=>{
		var depts = [];
		depts.push('0: All Departments');
		for (var i = 0; i < res.length; i++) {
			depts.push(res[i].department_id + ': ' + res[i].department_name);
		}
		depts.push('Q: Quit Shopping');
		// console.log(depts);

		// inquirer message - choose department or quit
		inquirer.prompt({
			name: 'dept',
			type: 'list',
			message: 'Display products from:',
			choices: depts
		}).then((ans)=>{
			var arr = ans.dept.split(':');
			var id = arr[0];
			console.log('Dept chosen:',id);

			switch (id) {
				case '0':
					// pass no where into query
					placeOrder('');
				break;
				case 'Q':
					console.log('\033c');
					console.log('Thank you for shopping bamazon. Goodbye!');
					connection.end();
				break;
				default: 
					// pass id into query
					placeOrder(' WHERE departments.department_id = ' + id + ';');
			}
		});
	// promise returned - go to placeOrder
	});
}

function placeOrder(where) {
	console.log('\033c');
	// list products
	var queryall  = 'SELECT product_list.product_id, product_sales, quantity, product_name, product_desc, price, departments.department_name ';
			queryall += 'FROM product_list ';
			queryall += 'INNER JOIN products ON (product_list.product_id = products.product_id) ';
			queryall += 'LEFT JOIN departments ON (products.department_id = departments.department_id)';
			queryall += where + ';';
	
	connection.query(queryall, (err,res) => {
		if (err) throw err;
		console.log('  ID | Price | Name');
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
			line += ' | ' + res[i].product_name;
			console.log('  ' + line);
			console.log('  ' + res[i].product_desc);
			console.log('___________________________________________________________');

		}
		inquirer
		.prompt([
			{
				name: 'item',
				type: 'input',
				message: 'Enter the ID of the product you want to buy:',
				validate: function(value){
					var isok = /^\d*$/.test(value);
					if (isok) {
						return true;
					}
					return 'Please enter the ID number of the product you want to purchase.';
				}
			},
			{
				name: 'quantity',
				type: 'input',
				message: 'Enter the amount you wish to buy:',
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
			// promise returned - check database quantities, if insufficient - error to user, else update db and display order total
			// get db reference to item no.
			var dbref;
			for (var i = 0; i < res.length; i++) {
				// console.log('Comparing db to ans: ' + ans.item + ':' + res[i].product_id);
				if(res[i].product_id === parseInt(ans.item)) {
					dbref = res[i];
				}
			}
			console.log('You want to buy ' + ans.quantity + ' of ' + dbref.product_name + ' at ' + dbref.price + ' each.');
			// console.log('dbref:',dbref);
			if (parseInt(ans.quantity) < parseInt(dbref.quantity)) {
				var newquantity = parseInt(dbref.quantity) - parseInt(ans.quantity);
				var orderTotal = parseInt(ans.quantity) * parseFloat(dbref.price);
				var productSales = parseFloat(dbref.product_sales) + orderTotal;
				console.log('Debug productSales:',productSales.toFixed(2));
				var updateQuery = 'UPDATE product_list SET ? WHERE ?';
				var updateQueryVars = 
					[
						{
							quantity: newquantity,
							product_sales: productSales
						},
						{
							product_id: dbref.product_id
						}
					];
				connection.query(updateQuery,updateQueryVars,(err,res)=>{
					console.log('Debug res:',res);
					if (err) throw err;
					console.log('Order placed successfully.');
					
					grandTotal += orderTotal;
					console.log('Your total for this order is: $' + orderTotal.toFixed(2));
					console.log('You have spent $' + grandTotal.toFixed(2) + ' on all orders in this session.');
					inquirer
						.prompt({
							name: 'continue',
							type: 'confirm',
							message: 'Continue shopping?'
						})
						.then((ans)=>{
							if (ans.continue) {
								start();
							} else {
								console.log('Thank you for shopping bamazon. Bye.')
								connection.end();
							}
						});
				});
			} else {
				console.log('Sorry, there is not enough of that item to fulfill an order of that quantity.');
				inquirer
					.prompt({
						name: 'continue',
						type: 'confirm',
						message: 'Continue shopping?'
					})
					.then((ans)=>{
						if (ans.continue) {
							start();
						} else {
							connection.end();
						}
					});
			}
			// go back to start
	
		});
	
	});
	// inquirer message - get user's input for item_id and quantity to purchase

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