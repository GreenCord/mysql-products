DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE product_list (
  product_id INT NOT NULL,
  quantity INT NULL,
  product_sales DECIMAL(10,2) NULL,
  PRIMARY KEY (product_id)
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
  department_overhead DECIMAL(10,2) NULL,
  PRIMARY KEY (department_id)
);