# Bamazon Fresh - Online Grocery Store

Shop fresh. Shop at home. No need to even wear pants. You do need node.js installed, and a local MySQL database spinning.

## Three Applications support Customers and Employees of Bamazon Fresh.

### bamazonCustomer.js

* List products from Bamazon Fresh. Place your order for whatever you want!

### bamazonManager.js

Manage products for Bamazon Fresh. You can view:

* All Products for Sale
* All Products Low in Inventory (less than 5 in stock)
* Replenish inventory
* Add new products

### bamazonSupervisor.js
* Profit! View profit by departments, or add a whole new department.

## Installing

1. Once you clone the repo, do ```npm install``` to get all the necessary packages. (The code packages, not the food packages. Sorry, Bamazon Fresh doesn't actually have real inventory. If you need food, please order from the real Amazon. Or put on pants and go to the real store.)
1. Set up the database using the provided ```databaseSchema.sql```.
1. Populate the ```products``` table with ```productsSeed.csv```.
1. Populate the ```product_list``` table with ```product_listSeed.csv```.
1. Create a .env file with your SQL password in a variable: ```SQLPW = Y0UrAw3S0mePas5w0rd!``` 
1. Now your ready to shop! Run one of the following commands to begin:

```node bamazonCustomer.js```

```node bamazonManager.js```

```node bamazonSupervisor.js```

Enjoy!
