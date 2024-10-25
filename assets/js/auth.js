'use strict';

// Helper function to save data to localStorage
const saveToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Helper function to get data from localStorage
const getFromLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

// Registration logic
const registrationForm = document.getElementById('registrationForm');
if (registrationForm) {
  registrationForm.addEventListener('submit', function (event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Check if passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Save user credentials to localStorage
    const user = {
      username: username,
      email: email,
      password: password
    };

    saveToLocalStorage('user', user);

    // Alert for successful registration
    alert('Registration successful! You can now log in.');
    window.location.href = 'login.html'; // Redirect to login page
  });
}

// Login logic
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    // Get stored user credentials from localStorage
    const storedUser = getFromLocalStorage('user');

    if (!storedUser) {
      alert('No user found. Please register first.');
      return;
    }

    // Check if credentials match
    if (storedUser.username === username && storedUser.password === password) {
      alert('Login successful!');
      // You can add a redirection here after successful login if needed
    } else {
      alert('Invalid username or password.');
    }
  });
}
