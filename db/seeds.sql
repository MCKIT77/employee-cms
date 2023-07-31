USE company_db;
INSERT INTO department(name)
VALUES ('sales'),
    ('development'),
    ('human resources'),
    ('customer service'),
    ('quality assurance');
INSERT INTO role(title, salary, department_id, department_name)
VALUES ('sales rep', 100000, 1, 'sales'),
    ('web dev', 150000, 2, 'development'),
    ('hr specialist', 80000, 3, 'human resources'),
    (
        'patient support specialist',
        90000,
        4,
        'customer service'
    ),
    (
        'employee auditor',
        120000,
        5,
        'quality assurance'
    );
INSERT INTO employee(first_name, last_name, role_id)
VALUES ('John', 'Smith', 1),
    ('Jimmy', 'John', 2),
    ('Brandi', 'Otis', 3),
    ('Becca', 'Doe', 4),
    ('Ryan', 'Tight', 5);
INSERT INTO manager (
        first_name,
        last_name,
        managing_department_id,
        managing_department_name,
        full_name
    )
VALUES (
        'Derek',
        'Costa',
        4,
        'customer service',
        CONCAT(first_name, ' ', last_name)
    ),
    (
        'Chakema',
        'Parker',
        5,
        'quality assurance',
        CONCAT(first_name, ' ', last_name)
    ),
    (
        'Jim',
        'Panela',
        3,
        'human resources',
        CONCAT(first_name, ' ', last_name)
    ),
    (
        'Kadrian',
        'Merckle',
        2,
        'development',
        CONCAT(first_name, ' ', last_name)
    ),
    (
        'Jacob',
        'McKitrick',
        1,
        'sales',
        CONCAT(first_name, ' ', last_name)
    );