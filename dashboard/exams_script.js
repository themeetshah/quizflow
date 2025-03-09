const grades = document.getElementById('grades-tab-li')
const role = localStorage.getItem('loggedInRole');
if (role == 'professor') {
    grades.style.display = 'none';
} else {
    grades.style.display = 'block';
}

// Function to load exams from the server (PHP)
function loadExams() {
    const examsList = document.getElementById('examsList');
    if (!examsList) {
        console.error('Exams list element not found');
        return;
    }

    const loggedInUsername = localStorage.getItem('loggedInUsername');
    const loggedInRole = localStorage.getItem('loggedInRole');

    if (!loggedInUsername || !loggedInRole) {
        console.error('User data not found in localStorage');
        return;
    }

    examsList.innerHTML = ''; // Clear previous exams

    fetch('http://localhost/QuizFlow/phpfiles/fetch_quizzes.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            loggedInUsername: loggedInUsername,
            loggedInRole: loggedInRole
        })
    })
        .then(response => response.json())
        .then(quizzes => {

            quizzes.forEach(exam => {
                const filterCategory = document.getElementById('filterCategory')?.value?.toLowerCase() || '';
                const searchExams = document.getElementById('searchExams')?.value?.toLowerCase() || '';

                if ((loggedInRole === 'professor' && exam.created_by !== loggedInUsername) ||
                    (filterCategory && !exam.category.toLowerCase().includes(filterCategory)) ||
                    (searchExams && !exam.title.toLowerCase().includes(searchExams) && !exam.description.toLowerCase().includes(searchExams))) {
                    return;
                }

                const examDate = new Date(exam.exam_date).getTime();
                const creationDate = new Date(exam.created_at).getTime();
                const now = new Date().getTime();

                const totalTime = examDate - creationDate;
                const timeLeft = examDate - now;
                const isExpired = timeLeft <= 0;

                const examCard = document.createElement('div');
                examCard.classList.add('col-md-4', 'mb-4');
                examCard.innerHTML = `
                <div class="card exam-card" data-quiz-id="${exam.id}">
                    <div class="card-body">
                        <h5 class="card-title">${exam.title}</h5>
                        <div class="d-flex justify-content-between">
                            <span class="badge ${exam.difficulty === 'easy' ? 'bg-success' : exam.difficulty === 'medium' ? 'bg-warning' : 'bg-danger'}">
                                ${exam.difficulty.charAt(0).toUpperCase() + exam.difficulty.slice(1)}
                            </span>
                            <span class="badge bg-secondary">
                                Created by: ${exam.created_by}
                            </span>
                        </div>
                        <p class="card-text exam-desc mt-3">${exam.description}</p>
                        <p class="text-muted countdown" id="countdown-${exam.id}"></p>
                        <div class="progress mt-3 mb-3">
                            <div class="progress-bar bg-primary" id="progress-${exam.id}" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">Time Left</div>
                        </div>
                        ${loggedInRole === 'student' ? ` 
                            <button class="btn btn-primary mt-2 ${isExpired ? 'disabled' : ''}"  
                                    onclick="showExamRules('${exam.id}')">
                                ${isExpired ? 'Expired' : 'Attempt'}
                            </button>
                        ` : ` 
                            <a href="#" class="btn btn-info mt-2" onclick="viewResults('${exam.id}')">View Results</a>
                        `}
                    </div>
                </div>
            `;

                examsList.appendChild(examCard);

                const countdownElement = document.getElementById(`countdown-${exam.id}`);
                const progressBarElement = document.getElementById(`progress-${exam.id}`);

                if (countdownElement && progressBarElement) {
                    const interval = setInterval(() => {
                        const now = new Date().getTime();
                        const distance = examDate - now;

                        if (distance < 0) {
                            clearInterval(interval);
                            countdownElement.innerHTML = "EXPIRED";
                            progressBarElement.style.width = '0%';
                            progressBarElement.setAttribute('aria-valuenow', '0');
                            progressBarElement.innerHTML = 'Expired';
                            const takeExamButton = examCard.querySelector('.btn-primary');
                            if (takeExamButton) {
                                takeExamButton.classList.add('disabled');
                                takeExamButton.innerHTML = 'Expired';
                            }
                            return;
                        }

                        const timeLeftPercentage = (distance / totalTime) * 100;
                        progressBarElement.style.width = `${timeLeftPercentage}%`;
                        progressBarElement.setAttribute('aria-valuenow', timeLeftPercentage);

                        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                        countdownElement.innerHTML = `Time left: ${days}d ${hours}h ${minutes}m ${seconds}s`;
                    }, 1000);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching exams:', error);
        });
}

// Function to adjust the date for the local timezone (e.g., IST)
function getLocalTimeISOString(date) {
    if (!(date instanceof Date) || isNaN(date)) {
        throw new TypeError("Invalid Date object");
    }
    let offset = date.getTimezoneOffset() * 60000;
    let localTime = new Date(date.getTime() - offset);
    return localTime.toISOString().slice(0, 19).replace('T', ' ');
}

// Function to handle exam rules modal and start the exam
function fetchQuestions(quizId) {
    // return fetch(`http://localhost/QuizFlow/phpfiles/getQuizQuestions.php?quizId=${quizId}`)
    return fetch(`http://localhost/QuizFlow/phpfiles/qetQuizQuestions.php?quizId=${quizId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
            throw error;
        });
}

function viewResults(quizId) {
    const username = localStorage.getItem('loggedInUsername');
    window.location.href = `view_grades.html?quizId=${quizId}&username=${username}`;
}

function showExamRules(quizId) {
    console.log('Button clicked');
    console.log('Quiz ID to store:', quizId);  // Check the value of quizId
    localStorage.setItem('quizId', quizId);
    console.log('Stored quizId:', localStorage.getItem('quizId'));  // Check what was stored
    const storedQuizId = localStorage.getItem('quizId');
    console.log('Retrieved quizId:', storedQuizId);  // Check the stored value
    const username = localStorage.getItem('loggedInUsername');

    // Check if quizId and username are valid
    if (quizId && username) {
        // Check if the user has already attempted the quiz
        fetch(`http://localhost/QuizFlow/phpfiles/check_attempts.php?quizId=${quizId}&username=${username}`)
            .then(response => response.text())
            .then(attempts => {
                console.log(attempts)
                if (attempts === 'true') {
                    alert("You have already attempted this quiz.");
                    return;
                    // window.location.href = "quiz_results.html";  // Redirect to a results or other page
                } else {
                    // Redirect to the quiz attempt page
                    fetchQuestions(quizId)
                        .then(questions => {
                            window.questions = questions; // Store questions globally
                            // Manually show the modal
                            const modalElement = document.getElementById('examRulesModal');
                            const modal = new bootstrap.Modal(modalElement);
                            modal.show();
                            // document.getElementById('examRulesModal').style.display = 'block';
                        })
                        .catch(error => {
                            console.error('Failed to show exam rules:', error);
                        });
                }
            })
            .catch(error => {
                console.error("Error checking quiz attempt:", error);
                alert("An error occurred. Please try again later.");
            });
    } else {
        console.error('Quiz ID or Username is missing');
    }

    // window.currentQuizId = quizId; // Store quizId globally
}

// Function to handle the "Proceed" button click
document.getElementById('proceedButton').onclick = function () {
    var modalElement = document.getElementById('examRulesModal');
    var modal = new bootstrap.Modal(modalElement);
    modal.hide();  // Hide the modal

    // Redirect to the quiz attempt page with quizId and userId as query parameters
    const quizId = localStorage.getItem('quizId'); // Assuming you store the quiz ID globally
    const username = localStorage.getItem('loggedInUsername');

    console.log("Fullscreen")
    if (quizId && username) {
        window.location.href = `quiz_attempt.html?quizId=${quizId}&username=${username}`;
    } else {
        console.error('Quiz ID or User ID is missing');
    }
};

function createQuizForm() {
    const role = localStorage.getItem('loggedInRole');
    if (role == 'professor') {
        const modal = new bootstrap.Modal(document.getElementById('createQuizModal'));
        modal.show();
    } else {
        alert("You are not authorized to create a quiz.");
    }
}

document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost/QuizFlow/phpfiles/get_categories.php')
        .then(response => response.json())
        .then(categories => {
            const filterCategory = document.getElementById('filterCategory');
            filterCategory.innerHTML = '<option value="">All Categories</option>';
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.toLowerCase();
                option.textContent = category;
                filterCategory.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching categories:', error));

    const searchExamsInput = document.getElementById('searchExams');
    const filterCategorySelect = document.getElementById('filterCategory');

    searchExamsInput.addEventListener('input', loadExams);
    filterCategorySelect.addEventListener('change', loadExams);

    // loadExams();
});

document.addEventListener('DOMContentLoaded', function () {
    const createQuizButton = document.getElementById('createQuizBtn');
    if (createQuizButton) {
        createQuizButton.addEventListener('click', createQuizForm);
    }
});

// Handle form submission for creating a quiz
document.getElementById('createQuizForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Collect quiz details
    const quizTitle = document.getElementById('quizTitle').value;
    const quizDescription = document.getElementById('quizDescription').value;
    const quizDifficulty = document.getElementById('quizDifficulty').value;
    const quizCategory = document.getElementById('quizCategory').value;
    const quizDateInput = document.getElementById('quizDate').value;
    const quizTimer = document.getElementById('quizTimer').value;  // Capture the timer input
    const quizDate = new Date(quizDateInput);
    const now = new Date(); // Current date and time
    // Collect dates and adjust for local timezone
    const adjustedQuizDate = getLocalTimeISOString(quizDate);
    const adjustedNow = getLocalTimeISOString(now);

    // Collect questions
    const questions = [];
    document.querySelectorAll('.question').forEach((questionElement, index) => {
        const questionText = questionElement.querySelector('.questionText').value;
        const optionA = questionElement.querySelector('.optionA').value;
        const optionB = questionElement.querySelector('.optionB').value;
        const optionC = questionElement.querySelector('.optionC').value;
        const optionD = questionElement.querySelector('.optionD').value;
        const correctOption = questionElement.querySelector('.correctOption').value;

        questions.push({
            question_text: questionText,
            option_a: optionA,
            option_b: optionB,
            option_c: optionC,
            option_d: optionD,
            correct_option: correctOption
        });
    });

    // Send data to the backend using FormData
    const formData = new FormData();
    formData.append('quizTitle', quizTitle);
    formData.append('quizDescription', quizDescription);
    formData.append('quizDifficulty', quizDifficulty);
    formData.append('quizCategory', quizCategory);
    formData.append('quizDate', adjustedQuizDate);
    formData.append('quizTimer', quizTimer);  // Send the quiz timer value
    formData.append('now', adjustedNow);
    formData.append('createdBy', localStorage.getItem('loggedInUsername'));
    formData.append('questions', JSON.stringify(questions));  // Send questions as JSON

    // Make an AJAX request
    fetch('http://localhost/QuizFlow/phpfiles/create_quiz.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.text())
        .then(data => {
            alert(data);  // Handle server response
            // Clear the form
            document.getElementById('createQuizForm').reset();
            // Close the modal
            document.getElementById('createQuizModal').style.display = 'none';

            document.querySelectorAll('.modal-backdrop').forEach(function (backdrop) {
                backdrop.parentNode.removeChild(backdrop);
            });
        })
        .catch(error => console.error('Error:', error));
});

// Add more questions dynamically
document.getElementById('addQuestionBtn').addEventListener('click', function () {
    const questionSection = document.getElementById('questionsSection');

    const questionCount = questionSection.querySelectorAll('.question').length + 1;
    const newQuestionHTML = `
            <div class="question mb-3">
                <label for="question${questionCount}" class="form-label">Question ${questionCount}</label>
                <input type="text" class="form-control questionText" placeholder="Enter question" required><br>
                <input type="text" class="form-control optionA" placeholder="Option A" required><br>
                <input type="text" class="form-control optionB" placeholder="Option B" required><br>
                <input type="text" class="form-control optionC" placeholder="Option C" required><br>
                <input type="text" class="form-control optionD" placeholder="Option D" required><br>
                <select class="form-select correctOption" required>
                    <option value="a">Option A</option>
                    <option value="b">Option B</option>
                    <option value="c">Option C</option>
                    <option value="d">Option D</option>
                </select><br><br>
            </div>
        `;
    questionSection.insertAdjacentHTML('beforeend', newQuestionHTML);
});

// Logout functionality
document.getElementById('confirmLogout').addEventListener('click', function () {
    window.location.href = '../index/index.html';
});

window.onload = loadExams;
document.getElementById('searchExams').addEventListener('input', loadExams);
document.getElementById('filterCategory').addEventListener('change', loadExams);