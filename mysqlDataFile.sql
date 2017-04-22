create database BamazonDB;

use BamazonDB;

create table products (
	item_id INTEGER(11) AUTO_INCREMENT not null,
    product_name VARCHAR(50) not null,
    department_name VARCHAR(50) not null,
    price integer(11) not null,
    stock_quantity INTEGER(11) not null,
    primary key (item_id)
);

INSERT INTO products (
product_name,
department_name,
price,
stock_quantity
) VALUE 
("Poop", "Bathroom", 10, 50),
("Chips", "Food", 2, 100),
("Chicken", "Food", 4, 10),
("Bacon", "Food", 3, 20),
("TP", "Bathroom", 5, 25),
("Computer", "Electronics", 200, 10);


