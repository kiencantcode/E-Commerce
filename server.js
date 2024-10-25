const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON request bodies
app.use(express.json());

// Route for the root URL ('/')
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to save user registration data
app.post('/register', (req, res) => {
  const { email, password } = req.body;
  
  // Format data as text
  const userData = `Email: ${email}, Password: ${password}\n`;
  
  // Append data to users.txt file
  fs.appendFile('users.txt', userData, (err) => {
    if (err) {
      console.error('Error writing to file', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.send('Registration successful!');
  });
});

// Endpoint to handle login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  fs.readFile('users.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Check if email and password match
    const users = data.split('\n').map(line => line.split(', '));
    const userFound = users.some(user => user[0] === `Email: ${email}` && user[1] === `Password: ${password}`);
    
    if (userFound) {
      res.send('Login successful!');
    } else {
      res.status(401).send('Invalid email or password');
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
