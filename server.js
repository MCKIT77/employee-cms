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

    })


}

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

function updateEmployeeRole() {
    inquirer
        .prompt([
            {
                type: 'number',
                name: 'employeeId',
                message: "Enter the ID of the employee whose role you want to update:",
            },
            {
                type: 'number',
                name: 'newRoleId',
                message: "Enter the ID of the new role for the employee:",
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
}



app.use((req, res) => {
    res.status(404).end();
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

mainMenu();