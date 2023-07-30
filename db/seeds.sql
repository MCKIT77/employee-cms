USE company_db;
INSERT INTO department(name)
VALUES ('sales'),
    ('development'),
    ('human resources'),
    ('customer service'),
    ('quality assurance');
INSERT INTO role(title, salary, department_id)
VALUES ('sales rep', 100000, 1),
    ('web dev', 150000, 2),
    ('hr specialist', 80000, 3),
    ('patient support specialist', 90000, 4),
    ('employee auditor', 120000, 5);
INSERT INTO employee(first_name, last_name, role_id)
VALUES ('John', 'Smith', 1),
    ('Jimmy', 'John', 2),
    ('Brandi', 'Otis', 3),
    ('Becca', 'Doe', 4),
    ('Ryan', 'Tight', 5);
INSERT INTO manager(first_name, last_name, managing_department_id)
VALUES ('Derek', 'Costa', 4),
    ('Chakema', 'Parker', 5),
    ('Jim', 'Panela', 3),
    ('Kadrian', 'Merckle', 2),
    ('Jacob', 'McKitrick', 1);