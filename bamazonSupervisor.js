var mysql = require("mysql");
var inquirer = require('inquirer');
var cTable = require('console.table');
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


function viewSalesByDept(){
	var query  = 'SELECT department_id, department_name, department_overhead, ';
			query += 'FORMAT(COALESCE(SUM(product_list.product_sales),0),2) AS product_sales, ';
			query += 'FORMAT((COALESCE(SUM(products.price*product_list.quantity),0) - department_overhead),2) AS total_profit ';
			query += 'FROM departments ';
			query += 'LEFT JOIN products USING(department_id) ';
			query += 'LEFT JOIN product_list ON (products.product_id = product_list.product_id) ';
			query += 'GROUP BY department_id;';

		connection.query(query,(err,res)=>{
			console.table(res);
			start();
		});

}

function createDept(){
	console.log('Coming soon.');
	var query  = 'SELECT * FROM departments';
	connection.query(query,(err,res)=>{
		if (err) throw err;
		inquirer
		.prompt([
			{
				name: 'name',
				type: 'input',
				message: 'Enter the name of the new department:',
			},
			{
				name: 'desc',
				type: 'input',
				message: 'Enter the new department\'s description:',
			},
			{
				name: 'overhead',
				type: 'input',
				message: 'Enter the overhead costs of the new department:',
				validate: function(value){
					var isok = /^\d*$/.test(value);
					if (isok) {
						return true;
					}
					return 'Please enter a dollar amount, including cents.';
				}
			}
		])
		.then((ans)=>{
			console.log('Adding a new department:');
			console.log('Name:',ans.name);
			console.log('Description:',ans.desc);
			console.log('Overhead Costs:',ans.overhead);
			var updateQuery = 'INSERT INTO departments SET ?';
			var updateQueryVars = 
				{
					department_name: ans.name,
					department_desc: ans.desc,
					department_overhead: ans.overhead,
				};
			connection.query(updateQuery,updateQueryVars,(err,res)=>{
				if (err) {
					console.log(err);
					start();
				}
				console.log(res.message);
				viewSalesByDept();
			});
		});
	});
}


function start(){


	inquirer
		.prompt({
			name: 'action',
			type: 'list',
			message: 'Hello, supervisor. Choose an option:',
			choices: [
				'View Product Sales by Department',
				'Create Department',
				'Exit Application'
			]
		})
		.then((ans)=>{
			switch (ans.action) {
				case 'View Product Sales by Department':
				  viewSalesByDept();
				break;

				case 'Create Department':
					createDept();
				break;

				case 'Exit Application':
					console.log('Thank you for supervising Bamazon. Bye.');
					connection.end();
				break;

				default: 
				console.log('Sorry, that is not an option. Try again.');
				start();
			}
		});
}