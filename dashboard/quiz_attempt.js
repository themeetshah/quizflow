// Function to trigger fullscreen mode
function openFullscreen() {
    console.log("Fullscreen");
    const elem = document.documentElement;  // Full screen on the entire page
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {  // For Firefox
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {  // For Chrome, Safari, and Opera
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {  // For IE/Edge
        elem.msRequestFullscreen();
    }
}

// Function to show the modal using Bootstrap 5's modal API (no jQuery needed)
function showModal() {
    var myModal = new bootstrap.Modal(document.getElementById('examStartModal'), {
        keyboard: false  // Optional: You can disable closing the modal with the keyboard
    });
    myModal.show();  // Show the modal
}

// Function to start the quiz logic
function startQuiz() {
    openFullscreen(); // Enter fullscreen mode
    startQuizLogic(); // Function to start quiz logic (questions, timer, etc.)

    // Hide the modal after starting the quiz
    var myModal = bootstrap.Modal.getInstance(document.getElementById('examStartModal')); // Get modal instance
    myModal.hide(); // Hide the modal
}

// Show the modal when the page loads
window.addEventListener('load', function () {
    showModal(); // Show the modal as soon as the page is loaded

    // Wait for the start button click before starting the quiz logic
    document.getElementById('startButton').addEventListener('click', function () {
        startQuiz();
    });
});

// Start the quiz logic only after the modal is closed
function startQuizLogic() {
    // Ensure DOM elements exist before adding event listeners
    const nextButton = document.getElementById('nextQuestionButton');
    const submitButton = document.getElementById('submitQuizButton');
    const timerDisplay = document.getElementById('timerDisplay');

    if (!nextButton || !submitButton || !timerDisplay) {
        console.error('Required DOM elements are missing!');
        return;
    }

    // Extract quizId and userId from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('quizId');
    const username = urlParams.get('username');

    let currentQuestionIndex = 0;
    let questions = [];
    let quizTimerDuration = 0;  // Variable to store timer duration
    let responses = {}; // Object to store the user's responses
    let isSubmitting = false;  // Flag to track if the form is being submitted

    // Fetch quiz questions
    if (quizId && username) {
        fetchQuestions(quizId)
            .then(fetchedData => {
                questions = fetchedData.questions;
                quizTimerDuration = fetchedData.timer;  // Set the timer duration from DB
                displayQuestion(questions[currentQuestionIndex]);
                startTimer(quizTimerDuration); // Example: 60-seconds timer
            })
            .catch(error => {
                console.error('Error loading quiz questions:', error);
            });
    } else {
        console.error('Missing quizId or username in the URL');
    }

    window.addEventListener('visibilitychange', function () {
        console.log("Visibility changed: " + window.hidden);
        if (!isSubmitting) {
            // If the user switches the tab, submit the quiz with a score of 0
            isSubmitting = true
            alert('You have switched tabs, the quiz will be submitted with a score of 0.');
            responses = {};  // Clear responses

            const form = document.getElementById('quizForm');
            form.action = `http://localhost/QuizFlow/phpfiles/submit_quiz.php?quizId=${quizId}&username=${username}`;
            form.submit();
        }
    });

    document.addEventListener('fullscreenchange', function () {
        isFullscreen = !!document.fullscreenElement; // Update fullscreen state
        console.log("Fullscreen state:", isFullscreen);
        if (!isSubmitting && !isFullscreen) {
            // If the user switches the tab, submit the quiz with a score of 0
            isSubmitting = true
            alert('Fullscreen change, the quiz will be submitted with a score of 0.');
            responses = {};  // Clear responses

            const form = document.getElementById('quizForm');
            form.action = `http://localhost/QuizFlow/phpfiles/submit_quiz.php?quizId=${quizId}&username=${username}`;
            form.submit();
        }
    });

    document.addEventListener('keydown', function (event) {
        // If Escape key is pressed and we are in fullscreen mode
        if (event.key === 'Escape' && isFullscreen && !isSubmitting) {
            // Prevent the default behavior (exit fullscreen)
            event.preventDefault();

            // Manually exit fullscreen
            exitFullscreen();

            // Submit the quiz with score 0
            isSubmitting = true;
            alert('Escape pressed, exiting fullscreen and submitting the quiz with a score of 0.');
            responses = {};  // Clear responses

            const form = document.getElementById('quizForm');
            form.action = `http://localhost/QuizFlow/phpfiles/submit_quiz.php?quizId=${quizId}&username=${username}`;
            form.submit();
        }
        if (event.key === 'Escape' || event.key == 'Tab' || event.key == 'Alt') {
            console.log(event.key)
            // If the user switches the tab, submit the quiz with a score of 0
            isSubmitting = true
            alert('You have pressed keys, the quiz will be submitted with a score of 0.');
            responses = {};  // Clear responses

            const form = document.getElementById('quizForm');
            form.action = `http://localhost/QuizFlow/phpfiles/submit_quiz.php?quizId=${quizId}&username=${username}`;
            form.submit();
        }
    });

    function fetchQuestions(quizId) {
        return fetch(`http://localhost/QuizFlow/phpfiles/qetQuizQuestions.php?quizId=${quizId}`)
            .then(response => response.json());
    }

    function displayQuestion(question) {
        const questionDisplay = document.getElementById('questionDisplay');
        const optionsDisplay = document.getElementById('optionsDisplay');

        if (!questionDisplay || !optionsDisplay) {
            console.error('Missing question display elements!');
            return;
        }

        questionDisplay.innerHTML = `<p>Question: ${question.question_text}</p>`;
        optionsDisplay.innerHTML = `
        <label><input type="radio" name="answer_${question.question_id}" value="a"> ${question.option_a}</label><br>
        <label><input type="radio" name="answer_${question.question_id}" value="b"> ${question.option_b}</label><br>
        <label><input type="radio" name="answer_${question.question_id}" value="c"> ${question.option_c}</label><br>
        <label><input type="radio" name="answer_${question.question_id}" value="d"> ${question.option_d}</label><br>
        `;
    }

    nextButton.addEventListener('click', function () {
        // Collect the response for the current question
        collectResponse(questions[currentQuestionIndex]);

        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            displayQuestion(questions[currentQuestionIndex]);
            if (currentQuestionIndex === questions.length - 1) {
                nextButton.style.display = 'none';
                submitButton.style.display = 'block';
            }
        }
    });

    submitButton.addEventListener('click', function () {
        isSubmitting = true;  // Set the flag to true when submitting

        collectResponse(questions[currentQuestionIndex]);
        collectResponses();

        // Submit the form
        const form = document.getElementById('quizForm');
        form.action = `http://localhost/QuizFlow/phpfiles/submit_quiz.php?quizId=${quizId}&username=${username}`;
        form.submit();
    });

    function collectResponse(question) {
        const selectedOption = document.querySelector(`input[name="answer_${question.question_id}"]:checked`);
        if (selectedOption) {
            responses[question.question_id] = selectedOption.value;  // Store the answer for this question
        }
    }

    function collectResponses() {
        console.log('All responses collected:', responses);
        document.getElementById('responses').value = JSON.stringify(responses);  // Send all responses to the server
    }

    function startTimer(duration) {
        let timer = duration, minutes, seconds;
        const timerInterval = setInterval(function () {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            timerDisplay.textContent = minutes + ":" + seconds;

            if (--timer < 0) {
                clearInterval(timerInterval);
                isSubmitting = true;
                alert('Time is up!');
                collectResponse(questions[currentQuestionIndex]);
                collectResponses();
                const form = document.getElementById('quizForm');
                form.action = `http://localhost/QuizFlow/phpfiles/submit_quiz.php?quizId=${quizId}&username=${username}`;
                form.submit();
            }
        }, 1000);
    }
}

// Close functionality for the "goBack" button
document.getElementById('goBack').addEventListener('click', function () {
    window.location.href = 'exams.html';  // Go back to the previous page
});
// Fetch quiz title from the server
function fetchQuizTitle() {
    // Get quizId from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search); // Initialize URLSearchParams
    const quizId = urlParams.get('quizId'); // Extract the 'quizId' parameter

    // Validate that quizId exists
    if (!quizId) {
        console.error('Quiz ID is missing in the URL.');
        document.getElementById('quizTitle').innerHTML = `<h2>Quiz ID not provided</h2>`;
        return;
    }

    // Fetch the quiz title from the server
    fetch(`http://localhost/QuizFlow/phpfiles/fetch_quiz_title.php?quiz_id=${quizId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.title) {
                document.getElementById('quizTitle').innerHTML = `<h2>${data.title}</h2>`;
            } else {
                document.getElementById('quizTitle').innerHTML = `<h2>Quiz Title Not Found</h2>`;
            }
        })
        .catch(error => {
            console.error('Error fetching quiz title:', error);
            document.getElementById('quizTitle').innerHTML = `<h2>Error loading quiz title</h2>`;
        });
}

// Call the function when the page loads
window.onload = fetchQuizTitle;
