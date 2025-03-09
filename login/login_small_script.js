document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.login-container');
    const loginForm = document.getElementById('loginForm-small');
    const signUpForm = document.getElementById('signUpForm-small');
    const errorMessage = document.getElementById('errorMessage-small');
    const signUpErrorMessage = document.getElementById('signUpErrorMessage-small');
    const signUpLink = document.getElementById('signUpLink');
    const loginLink = document.getElementById('loginLink');
    // const signUpFormCon = document.getElementById('signUpFormContainer-small');

    // Toggle between Login and Signup forms
    signUpLink.addEventListener('click', () => {
        // registerLink.classList.add('d-none'); // Show the sign-up form
        loginForm.classList.add('d-none'); // Hide the login form
        signUpForm.classList.remove('d-none'); // Show the sign-up form
        errorMessage.classList.add('d-none');
        signUpErrorMessage.classList.add('d-none');
    });

    // Toggle between Login and Signup forms
    loginLink.addEventListener('click', () => {
        // registerLink.classList.add('d-none'); // Show the sign-up form
        loginForm.classList.remove('d-none'); // Hide the login form
        signUpForm.classList.add('d-none'); // Show the sign-up form
        errorMessage.classList.add('d-none');
        signUpErrorMessage.classList.add('d-none');
    });

    // Sign-Up Form Submission
    signUpForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const newUsername = document.getElementById('newUsername-small').value.trim();
        const newPassword = document.getElementById('newPassword-small').value.trim();
        const newEmail = document.getElementById('newEmail-small').value.trim();
        const role = document.querySelector('input[name="role-small"]:checked')?.value.toLowerCase();

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
                    // Switch to login form after successful sign up
                    signUpForm.classList.add('d-none');
                    loginForm.classList.remove('d-none');
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

        const username = document.getElementById('username-small').value.trim();
        const password = document.getElementById('password-small').value.trim();

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
                    errorMessage.classList.remove('d-none');
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
