const express = require('express');
const mysql = require('mysql2');
const path = require("path");
const cors = require('cors');

const app = express();
app.use(cors());
const PORT =  3003;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "signup")));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,"signup","frontend.html"));
});

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: "",
  database: 'signin_page',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0

});

connection.connect((error) => {
  if (error) {
    console.error('Database connection failed:', error);
  } else {
    console.log('Connected to the database');
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.post('/signup', (req, res) => {
  const { username, email, dob, number, password } = req.body;

  const query = `INSERT INTO User (username, email, dob, number, password) VALUES (?, ?, ?, ?, ?)`;

  connection.query(query, [username, email, dob, number, password], (error, results) => {
    if (error) {
      console.error('Error while signing up:', error);
      res.status(500).json({ message: 'Error while signing up' });
    } else {
      console.log('User signed up successfully');
      res.status(200).json({ message: 'User signed up successfully' });
    }
  });
});

app.get('/users', (req, res) => {
  const query = 'SELECT * FROM User';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Error fetching users' });
    } else {
      res.status(200).json(results);
    }
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
