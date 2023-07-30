DROP DATABASE IF EXISTS company_db;

CREATE DATABASE company_db;

USE company_db;

CREATE TABLE department(
    id INT NOT NULL,
    name VARCHAR(100),
    PRIMARY KEY (id)
);

CREATE TABLE role(
    id INT NOT NULL,
    title VARCHAR(100),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY(department_id)
    REFERENCES department(id)
    ON DELETE SET NULL
);

CREATE TABLE employee(
    id INT NOT NULL,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    FOREIGN KEY(role_id)
    REFERENCES role(id)
    -- Set the default value of customer_id to NULL if the referenced customer does not exist
    CONSTRAINT fk_manager_id
        FOREIGN KEY (manager_id) REFERENCES manager(id)
        ON DELETE SET NULL -- Optional: This line specifies what happens when the referenced manager is deleted
    
);

CREATE TABLE manager(
    id INT NOT NULL,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    managing_department_id INT,
    FOREIGN KEY(department_id)
    REFERENCES department(id)
    ON DELETE SET NULL
);