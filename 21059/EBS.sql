CREATE DATABASE ebs;
USE ebs;
SHOW TABLES;
CREATE TABLE login(meter_no varchar(20), username varchar(20), name varchar(20), password varchar(20), user varchar(20), question varchar(100), answer varchar(100));
DESCRIBE login;
SELECT * from login;
Truncate login;

CREATE TABLE customer(name varchar(20), meter_no varchar (20), address varchar(50), city varchar(30), state varchar(30), email varchar(40), phone varchar(20));
DESCRIBE customer;
SELECT * from customer;
Truncate customer;

CREATE TABLE meter_info(meter_no varchar(20), meter_location varchar(20), meter_type varchar(20), phase_code varchar(20), bill_type varchar(20), days varchar(20));
DESCRIBE meter_info;
SELECT * from meter_info;
Truncate meter_info;

CREATE TABLE tax(cost_per_unit varchar(20), meter_rent varchar(20), service_charge varchar(20), service_tax varchar(20), swacch_bharat_cess varchar(20), fixed_tax varchar(20));
DESCRIBE tax;
SELECT * from tax;
INSERT INTO tax VALUES('9','47','22','57','6','18');

CREATE TABLE bill(meter_no varchar(20), month varchar(30), units varchar(20), totalbill varchar(20), status varchar(20));
DESCRIBE bill;
SELECT * from bill;
Truncate bill;