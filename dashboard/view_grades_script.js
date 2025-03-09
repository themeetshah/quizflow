document.addEventListener('DOMContentLoaded', function () {
    // Get the user ID from the URL (you can also set this from session or wherever appropriate)
    const urlParams = new URLSearchParams(window.location.search);
    const username = localStorage.getItem("loggedInUsername");
    const quizId = urlParams.get('quizId');

    if (!username) {
        alert("User ID is missing from the URL!");
        return;
    }

    // Fetch quiz results for the specific user
    fetch(`http://localhost/QuizFlow/phpfiles/view_grades.php?&quizId=${quizId}&username=${username}`)
        .then(response => response.json())
        .then(data => {
            console.log("Received data:", data);  // Log the received data
            const tableBody = document.getElementById('grades-table-body');

            // Ensure that data is an array before looping
            if (Array.isArray(data)) {
                if (data.length > 0) {
                    const row = document.createElement('tr');
                    data.forEach(result => {
                        // console.log(result);  // Log the received data
                        row.innerHTML = `
                        <td>${result.title}</td>
                        <td>${result.username}</td>
                        <td>${result.score}</td>
                        <td>${result.timestamp}</td>
                        `;
                        tableBody.appendChild(row);
                    });
                } else {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td colspan="4" style="text-align: center;">No quiz attempted yet!</td>
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

document.getElementById('goBackButton').addEventListener('click', function () {
    window.location.href = 'exams.html';
});