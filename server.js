const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { exec } = require('child_process');
const app = express();
const PORT = 3000;
const products = [
  { id: 'product1', name: 'Burgundy Mercury', image: '.\\public\\assets\\images\\product-01.jpg' },
  { id: 'product2', name: 'Olive Mercury', image: '.\\public\\assets\\images\\product-02.jpg' },
  { id: 'product3', name: 'Sage Mercury', image: '.\\public\\assets\\images\\product-03.jpg' },
  { id: 'product4', name: 'Pink Mercury', image: '.\\public\\assets\\images\\product-04.jpg' },
  { id: 'product5', name: 'Reddish-brown Mercury', image: '.\\public\\assets\\images\\product-05.jpg' },
  { id: 'product6', name: 'Brick-Red Mercury', image: '.\\public\\assets\\images\\product-06.jpg' },
  { id: 'product7', name: 'Neon Mercury', image: '.\\public\\assets\\images\\product-07.jpg' },
  { id: 'product8', name: 'Gray Mercury', image: '.\\public\\assets\\images\\product-08.jpg' },
  { id: 'product9', name: 'Yellow Mercury', image: '.\\public\\assets\\images\\product-09.jpg' },
  { id: 'product10', name: 'Black Mercury', image: '.\\public\\assets\\images\\product-10.jpg' },
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath); // Create the folder if it doesn't exist
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({ storage: storage });

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON request bodies
app.use(express.json());

// Route for the root URL ('/')
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for the offer page
app.get('/offer.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'offer.html'));
});

// Endpoint to get products
app.get('/products', (req, res) => {
  res.json(products);
});

// Endpoint to save user registration data
app.post('/register', (req, res) => {
  const { email, password } = req.body;
  
  // Format data as text
  const userData = `Email: ${email}, Password: ${password}\n`;
  
  // Append data to users.txt file, create the file if it doesn't exist
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

app.post('/upload-image', upload.single('image'), (req, res) => {
  if (req.file) {
    const productChoice = req.body.productChoice;
    const imageName = req.file.filename;

    // Find the selected product's image path from the products array
    const product = products.find(p => p.name === productChoice);
    const productImagePath = product ? product.image : null;

    if (!productImagePath) {
      return res.status(400).send('Selected product not found');
    }

    const newEntry = { productImagePath, image: imageName }; // Save the product image path and uploaded image name
    const offerFilePath = path.join(__dirname, 'offer.json');

    // Read existing data, append the new entry, and write back to offer.json
    fs.readFile(offerFilePath, 'utf8', (err, data) => {
      let jsonData = [];
      if (!err && data) {
        jsonData = JSON.parse(data);
      }
      jsonData.push(newEntry);

      fs.writeFile(offerFilePath, JSON.stringify(jsonData, null, 2), (writeErr) => {
        if (writeErr) {
          console.error('Error writing to offer.json', writeErr);
          return res.status(500).send('Internal Server Error');
        }

        // Run the preview.py script with the latest entry as an argument
        exec(`python preview.py "${productImagePath}" "${imageName}"`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing preview.py: ${error.message}`);
            return res.status(500).send('Error generating preview');
          }
          if (stderr) {
            console.error(`stderr: ${stderr}`);
          }
          console.log(`stdout: ${stdout}`);
          res.send(`Image uploaded and preview generated successfully: ${req.file.path}`);
        });
      });
    });
  } else {
    res.status(400).send('No image uploaded');
  }
});





// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
