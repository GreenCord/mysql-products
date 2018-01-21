DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE product_list (
  item_id INT NOT NULL,
  product_id INT NULL,
  quantity INT NULL,
  PRIMARY KEY (item_id)
);

CREATE TABLE products (
  product_id INT NOT NULL,
  department_id INT NULL,
  product_name VARCHAR(75) NULL,
  product_desc VARCHAR(255) NULL,
  price DECIMAL(10,2) NULL,
  PRIMARY KEY (product_id)
);

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(75) NULL,
  department_desc VARCHAR(255) NULL,
  PRIMARY KEY (department_id)
);