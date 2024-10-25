// Registration logic with POST request to server
const registrationForm = document.getElementById('registrationForm');
if (registrationForm) {
  registrationForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const message = await response.text();
      alert(message);
      if (response.ok) {
        window.location.href = 'login.html';
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  });
}

// Login logic with POST request to server
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const email = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const message = await response.text();
      alert(message); // Show alert for successful or failed login

      if (response.ok) {
        // If login is successful, redirect to homepage (index.html)
        window.location.href = 'index.html';
      } 
      // No need for an else, the alert message will handle showing if the login fails
    } catch (error) {
      console.error('Login failed:', error);
    }
  });
}

