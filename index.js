// var mysql = require("mysql");
// var inquirer = require('inquirer');
// require('dotenv').config();
// var Customer = require('./bamazonCustomer');


// function runCustomer(id,name){
//   var customer = new Customer(0,'Shopper');
//   console.log('Welcome, ' + customer.name);
//   customer.start();
// }

// inquirer
//   .prompt({
//     name: 'app',
//     type: 'list',
//     message: 'Which application do you want to use?',
//     choices: ['Customer', 'Quit']
//   })
//   .then(function(ans) {
//     switch (ans.app.toUpperCase()) {
//       case 'CUSTOMER':
//         runCustomer(0,'Shopper');
//       break;
//       default:
//       console.log('BYE');
//     }
//   });


console.log('Applications run separately.');
console.log('--> node bamazonCustomer.js');
console.log('--> node bamazonManager.js');
console.log('--> node bamazonSupervisor.js');