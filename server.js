const inquirer = require('inquirer');

const mysql = require('mysql2');

const express = require('express');

const PORT = process.env.PORT;

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


app.use((req, res) => {
    res.status(404).end();
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});