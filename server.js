const express = require('express');
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');

app.use(express.json());
app.use(cors());
dotenv.config();

// Connect to the database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Check if db connection works
db.connect((err) => {
    if (err) {
        return console.log("Error connecting to the MySQL DB:", err);
    }
    // Yes, connection is good
    console.log("Connected to MySQL successfully as id:", db.threadId);
});

// Setup view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Question 1: Retrieve all patients
app.get('/data', (req, res) => {
    // Retrieve data from the database
    db.query('SELECT * FROM patients', (err, results) => { 
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving data');
        } else {
            // Display the record on the browser
            res.render('data', {results: results});
        }  
    });
});

// Question 2: Retrieve all providers
app.get('/providers', (req, res) => {
    db.query('SELECT first_name, last_name, provider_specialty FROM providers', (err, results) => { 
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving providers');
        } else {
            res.render('providers', { results: results });
        }
    });
});

// Question 3: Filter patients by first name
app.get('/patients', (req, res) => {
    const firstName = req.query.first_name;
    db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?', [firstName], (err, results) => { 
        if (err) {
            console.error(err);
            res.status(500).send('Error filtering patients by first name');
        } else {
            res.render('data', { results: results });
        }
    });
});

// Question 4: Retrieve all providers by their specialty
app.get('/providers/specialty', (req, res) => {
    const specialty = req.query.provider_specialty;
    db.query('SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?', [specialty], (err, results) => { 
        if (err) {
            console.error(err);
            res.status(500).send('Error filtering providers by specialty');
        } else {
            res.render('providers', { results: results });
        }
    });
});

// Define a route
app.get('/', (req, res) => {
    res.send('Server started successfully!');
});

// listen to the server
const PORT = 3000
app.listen(PORT, () => {
  console.log(`server is runnig on http://localhost:${PORT}`)
});
