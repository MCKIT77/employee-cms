const inquirer = require('inquirer');

const mysql = require('mysql2');

const express = require('express');

const PORT = 3307 || process.env.PORT;

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'jkmm',
        database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
);

function mainMenu() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role']
            }
        ])
        .then((answers) => {
            let choiceArray = answers.action.split(' ');

            let choiceMain = choiceArray[choiceArray.length - 1];
            let choice = choiceMain;
            if (choiceArray.includes('view')) {
                let choice = choiceMain.slice(0, -1)

                getTable(choice);

            } else if (choiceArray.includes('add')) {
                addData(choice);
            } else {
                let choice = choiceArray[2];
                updateData(choice);
            }
        })
}


function getTable(tableName) {
    if (tableName === 'employee') {
        const employeeDataQuery = `
            SELECT e.id AS employee_id,
                   e.first_name,
                   e.last_name,
                   r.title AS job_title,
                   d.name AS department,
                   r.salary,
                   CONCAT(m.first_name, ' ', m.last_name) AS manager
            FROM employee e
            LEFT JOIN role r ON e.role_id = r.id
            LEFT JOIN department d ON r.department_id = d.id
            LEFT JOIN manager m ON r.department_id = m.managing_department_id
                                  AND r.department_name = m.managing_department_name
        `;

        db.query(employeeDataQuery, (err, rows) => {
            if (err) {
                console.error('Error fetching employee data:', err);
                mainMenu();
                return;
            }

            console.log('\nEmployee Data:');
            console.table(rows);
            mainMenu();
            return;
        });
    } else {
        db.query(`SELECT * FROM ${tableName}`, (err, rows) => {
            if (err) {
                console.error(err);
                mainMenu();
                return;
            } else {
                console.log(`\nData fetched from the ${tableName} table:`);
                console.table(rows);
                mainMenu();
                return;
            }
        });
    }
}
// function getTable(tableName) {
//     db.query(`SELECT * FROM ${tableName}`, (err, rows) => {
//         if (err) {
//             console.error(err);
//             mainMenu();
//             return;
//         } else {
//             console.log(`\nData fetched from the ${tableName} table:`);
//             console.table(rows);
//             mainMenu();
//             return;
//         }

//     })


// }

function addData(choice) {
    // Based on the extracted choice, call the corresponding add function
    switch (choice) {
        case 'department':
            addDepartment();
            break;
        case 'role':
            addRole();
            break;
        case 'employee':
            addEmployee();
            break;
        default:
            console.error('Invalid choice');
            mainMenu();
    }
}

function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'departmentName',
                message: 'Enter the name of the department:',
            },
        ])
        .then((answers) => {
            const departmentName = answers.departmentName;

            // Perform the database insertion for the new department
            const query = 'INSERT INTO department (name) VALUES (?)';
            db.query(query, [departmentName], (err, result) => {
                if (err) {
                    console.error('Error adding department:', err);
                } else {
                    console.log(`Successfully added department: ${departmentName}`);
                }
                mainMenu(); // Continue with the prompt
            });
        })
        .catch((error) => {
            console.error('Error occurred:', error);
            process.exit(1); // Exit with an error code
        });
}

function addRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'roleTitle',
                message: 'Enter the title of the role:',
            },
            {
                type: 'number',
                name: 'roleSalary',
                message: 'Enter the salary for the role:',
            },
            {
                type: 'number',
                name: 'departmentId',
                message: 'Enter the department ID for the role:',
            },
        ])
        .then((answers) => {
            const roleTitle = answers.roleTitle;
            const roleSalary = answers.roleSalary;
            const departmentId = answers.departmentId;

            // Perform the database insertion for the new role
            const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
            db.query(query, [roleTitle, roleSalary, departmentId], (err, result) => {
                if (err) {
                    console.error('Error adding role:', err);
                } else {
                    console.log(`Successfully added role: ${roleTitle}`);
                }
                mainMenu(); // Continue with the prompt
            });
        })
        .catch((error) => {
            console.error('Error occurred:', error);
            process.exit(1); // Exit with an error code
        });
}

function updateData(choice) {
    console.log(choice);
    let action = choice;

    // Based on the extracted action, call the corresponding update function
    switch (action) {
        case 'employee':
            updateEmployeeRole();
            break;
        case 'other':
            // Implement other update actions here if needed
            break;
        default:
            console.error('Invalid choice');
            mainMenu();
    }
}
function addEmployee() {
    // Fetch roles and departments from the database
    const roleQuery = 'SELECT id, title FROM role';
    const departmentQuery = 'SELECT id, name FROM department';

    db.query(roleQuery, (err, roles) => {
        if (err) {
            console.error('Error fetching roles:', err);
            mainMenu();
            return;
        }

        db.query(departmentQuery, (err, departments) => {
            if (err) {
                console.error('Error fetching departments:', err);
                mainMenu();
                return;
            }

            const roleChoices = roles.map((role) => ({
                name: role.title,
                value: role.id,
            }));

            const departmentChoices = departments.map((department) => ({
                name: department.name,
                value: department.id,
            }));

            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'firstName',
                        message: 'Enter the first name of the employee:',
                    },
                    {
                        type: 'input',
                        name: 'lastName',
                        message: 'Enter the last name of the employee:',
                    },
                    {
                        type: 'list',
                        name: 'roleId',
                        message: 'Select the role for the employee:',
                        choices: roleChoices,
                    },
                    {
                        type: 'list',
                        name: 'departmentId',
                        message: "Select the employee's department:",
                        choices: departmentChoices,
                    },
                ])
                .then((answers) => {
                    const firstName = answers.firstName;
                    const lastName = answers.lastName;
                    const roleId = answers.roleId;
                    const departmentId = answers.departmentId;

                    // Fetch the manager for the selected department
                    const managerQuery = 'SELECT id FROM manager WHERE managing_department_id = ? LIMIT 1';
                    db.query(managerQuery, [departmentId], (err, managers) => {
                        if (err) {
                            console.error('Error fetching manager for the department:', err);
                            mainMenu();
                            return;
                        }

                        const managerId = managers.length > 0 ? managers[0].id : null;

                        // Perform the database insertion for the new employee
                        const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
                        db.query(query, [firstName, lastName, roleId, managerId], (err, result) => {
                            if (err) {
                                console.error('Error adding employee:', err);
                            } else {
                                console.log(`Successfully added employee: ${firstName} ${lastName}`);
                            }
                            mainMenu(); // Continue with the prompt
                        });
                    });
                })
                .catch((error) => {
                    console.error('Error occurred:', error);
                    process.exit(1); // Exit with an error code
                });
        });
    });
}

function updateEmployeeRole() {
    // Fetch all employees and their roles from the database
    const employeeRoleQuery = `
      SELECT employee.id AS employee_id, 
             CONCAT(employee.first_name, ' ', employee.last_name) AS employee_name, 
             role.id AS role_id,
             role.title AS role_title
      FROM employee
      INNER JOIN role ON employee.role_id = role.id
    `;

    db.query(employeeRoleQuery, (err, results) => {
        if (err) {
            console.error('Error fetching employee roles:', err);
            mainMenu();
            return;
        }

        const employeeChoices = results.map((employee) => ({
            name: `${employee.employee_name} - ${employee.role_title}`,
            value: employee.employee_id,
        }));

        const roleChoices = results.map((role) => ({
            name: role.role_title,
            value: role.role_id,
        }));

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'employeeId',
                    message: 'Select the employee whose role you want to update:',
                    choices: employeeChoices,
                },
                {
                    type: 'list',
                    name: 'newRoleId',
                    message: 'Select the new role for the employee:',
                    choices: roleChoices,
                },
            ])
            .then((answers) => {
                const employeeId = answers.employeeId;
                const newRoleId = answers.newRoleId;

                // Perform the database update for the employee's role
                const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
                db.query(query, [newRoleId, employeeId], (err, result) => {
                    if (err) {
                        console.error('Error updating employee role:', err);
                    } else {
                        console.log(`Successfully updated employee's role with ID ${employeeId}`);
                    }
                    mainMenu(); // Continue with the prompt
                });
            })
            .catch((error) => {
                console.error('Error occurred:', error);
                process.exit(1); // Exit with an error code
            });
    });
}



app.use((req, res) => {
    res.status(404).end();
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

mainMenu();