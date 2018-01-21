var mysql = require("mysql");
var inquirer = require('inquirer');
require('dotenv').config();
var bCustomer = require('./bamazonCustomer');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: process.env.SQLPW,
  database: "bamazon"
});


connection.connect((err)=>{
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
});


