window.onload = function () {
    // Get the logged-in username from localStorage
    const loggedInUsername = localStorage.getItem('loggedInUsername');

    if (loggedInUsername) {
        // Send GET request to fetch user profile data
        fetch(`http://localhost/QuizFlow/phpfiles/getProfile.php?username=${loggedInUsername}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const user = data.user;
                    console.log('User profile fetched:', user);
                    // Set the user data to the page
                    document.getElementById('username').textContent = user.username || "Not Set";
                    document.getElementById('role').textContent = user.role.toUpperCase() || "Not Set";
                    document.getElementById('email').textContent = user.email || "Not Set";
                } else {
                    console.error('Error fetching user profile:', data.message);
                    // Set fallback text if no data found
                    document.getElementById('username').textContent = "No Data";
                    document.getElementById('role').textContent = "No Data";
                    document.getElementById('email').textContent = "No Data";
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    } else {
        console.error('No logged-in username found.');
        // Set fallback text if no username found
        document.getElementById('username').textContent = "No Data";
        document.getElementById('role').textContent = "No Data";
        document.getElementById('email').textContent = "No Data";
    }
};

// Prefill the modal with user data when it opens
document.getElementById('editProfileModal').addEventListener('show.bs.modal', function () {
    const loggedInUsername = localStorage.getItem('loggedInUsername');

    if (loggedInUsername) {
        // Send GET request to fetch user profile data
        fetch(`http://localhost/QuizFlow/phpfiles/getProfile.php?username=${loggedInUsername}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const user = data.user;
                    document.getElementById('editUsername').value = user.username || '';
                    document.getElementById('editEmail').value = user.email || '';
                    document.getElementById('editPassword').value = ''; // Leave password empty for security
                } else {
                    console.error('Error fetching user profile:', data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
});

// Update user profile in the database
document.getElementById('editProfileForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission

    // Get updated values from the form fields
    const username = document.getElementById('editUsername').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const password = document.getElementById('editPassword').value.trim();

    // Get the logged-in username from localStorage
    const loggedInUsername = localStorage.getItem('loggedInUsername');

    // Send the updated data to the PHP server to update the database
    fetch('http://localhost/QuizFlow/phpfiles/updateProfile.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${loggedInUsername}&newUsername=${username}&newEmail=${email}&newPassword=${password}`
    })
        .then(response => response.text())  // Use .text() to get raw response
        .then(data => {
            console.log('Raw server response:', data); // Log the raw response for debugging

            try {
                const jsonResponse = JSON.parse(data);  // Attempt to parse as JSON
                if (jsonResponse.success) {
                    // If the update was successful, also update in localStorage
                    let users = JSON.parse(localStorage.getItem('users')) || [];
                    const userIndex = users.findIndex(user => user.username === loggedInUsername);

                    if (userIndex !== -1) {
                        // Update the user's profile data in localStorage
                        users[userIndex].username = username;
                        users[userIndex].email = email;
                        users[userIndex].password = password;

                        // Save updated users list back to localStorage
                        localStorage.setItem('users', JSON.stringify(users));
                        localStorage.setItem('loggedInUsername', username);
                    }

                    // Notify user about successful update
                    alert('Profile updated successfully!');
                    location.reload(); // Reload to show updated data
                } else {
                    alert('Error updating profile. Please try again.');
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
                alert('Failed to update profile. Invalid response from server.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to update profile. Please try again later.');
        });

    // Close the modal after successful submission
    toggleModal();
});


// Logout functionality
document.getElementById('confirmLogout').addEventListener('click', function () {
    window.location.href = '../index/index.html';
});

const toggleModal = () => {
    const bodyClassList = document.body.classList;

    if (bodyClassList.contains("open")) {
        bodyClassList.remove("open");
        bodyClassList.add("closed");
    } else {
        bodyClassList.remove("closed");
        bodyClassList.add("open");
    }
};
