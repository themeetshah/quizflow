document.addEventListener('DOMContentLoaded', function () {
    // Get the user ID from the URL (you can also set this from session or wherever appropriate)
    const username = localStorage.getItem("loggedInUsername");

    if (!username) {
        alert("User ID is missing from the URL!");
        return;
    }

    // Fetch quiz results for the specific user
    fetch(`http://localhost/QuizFlow/phpfiles/grades.php?username=${username}`)
        .then(response => response.json())
        .then(data => {
            console.log("Received data:", data);  // Log the received data
            const tableBody = document.getElementById('grades-table-body');

            // Ensure that data is an array before looping
            if (Array.isArray(data)) {
                if (data.length > 0) {
                    data.forEach(result => {
                        const row = document.createElement('tr');
                        // console.log(result);  // Log the received data
                        row.innerHTML = `
                        <td>${result.title}</td>
                        <td>${result.score}</td>
                        <td>${result.timestamp}</td>
                        <td>${result.created_by}</td>
                        <td><a href="http://localhost/QuizFlow/phpfiles/certificate.php?username=${username}&quizId=${result.quizId}" target="_blank" class="download-certificate" name="${`certificate_${username}_${result.title}.png`}">Download Certificate</a></td>
                        `;
                        tableBody.appendChild(row);
                    });
                } else {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                    <td colspan="5" style="text-align: center;">No quiz attempted yet!</td>
                    `;
                    tableBody.appendChild(row);
                }
            } else {
                console.error('Expected an array but received:', data);
            }
        })
        .catch(error => {
            console.error('Error fetching grades:', error);
        });
});

// Logout functionality
document.getElementById('confirmLogout').addEventListener('click', function () {
    window.location.href = '../index/index.html';
});