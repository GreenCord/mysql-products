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


function viewSalesByDept(){

}

function createDept(){
	
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