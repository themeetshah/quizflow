document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const loginForm = document.getElementById('loginForm');
    const signUpForm = document.getElementById('signUpForm');
    const errorMessage = document.getElementById('errorMessage');
    const signUpErrorMessage = document.getElementById('signUpErrorMessage');
    // const signInBtn = document.getElementById('signInBtn');
    const loginLink = document.querySelector('.signInLink');
    const registerLink = document.querySelector('.signupLink');

    // Toggle between Login and Signup forms
    registerLink.addEventListener('click', () => {
        container.classList.add('active');
        errorMessage.classList.add('d-none');
        signUpErrorMessage.classList.add('d-none');
    });

    loginLink.addEventListener('click', () => {
        container.classList.remove('active');
        errorMessage.classList.add('d-none');
        signUpErrorMessage.classList.add('d-none');
    });

    // Sign-Up Form Submission
    signUpForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const newUsername = document.getElementById('newUsername').value.trim();
        const newPassword = document.getElementById('newPassword').value.trim();
        const newEmail = document.getElementById('newEmail').value.trim();
        const role = document.querySelector('input[name="role"]:checked')?.value.toLowerCase();

        // Send POST request to the signup.php script to create the account
        fetch('http://localhost/QuizFlow/phpfiles/signup.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `username=${newUsername}&password=${newPassword}&email=${newEmail}&role=${role}`
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Account created successfully! Please log in.');
                    container.classList.remove('active');  // Switch back to login form
                } else {
                    signUpErrorMessage.textContent = 'Username already exists.';
                    signUpErrorMessage.classList.remove('d-none');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });

    // Login Form Submission
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        fetch('http://localhost/QuizFlow/phpfiles/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `username=${username}&password=${password}`,  // Send 'username' and 'password'
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(`Welcome, ${username}!`);
                    localStorage.setItem('loggedInUsername', username);  // Store username in localStorage
                    localStorage.setItem('loggedInRole', data.role);  // Store role in localStorage
                    window.location.href = '../dashboard/dashboard.html';  // Redirect to dashboard
                } else {
                    errorMessage.textContent = 'Invalid username or password.';
                    errorMessage.classList.remove('d-none');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
});
