-- First, drop the database if it exists
DROP DATABASE IF EXISTS company_db;
-- Create the database
CREATE DATABASE company_db;
-- Switch to the newly created database
USE company_db;
-- Create the department table
CREATE TABLE department(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100),
    PRIMARY KEY (id)
);
-- Create the role table
CREATE TABLE role(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(100),
    salary DECIMAL,
    department_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE
    SET NULL
);
-- Create the manager table
CREATE TABLE manager(
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    managing_department_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (managing_department_id) REFERENCES department(id) ON DELETE
    SET NULL
);
-- Create the employee table
CREATE TABLE employee(
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE
    SET NULL,
        FOREIGN KEY (manager_id) REFERENCES manager(id) ON DELETE
    SET NULL
);