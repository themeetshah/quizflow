<?php
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
// header("Access-Control-Allow-Headers: Content-Type, Authorization");

session_start();

require 'db_connection.php'; // Ensure the database connection is correct

// Ensure that quiz_id, user_id, and responses are available in the URL and POST data
if (isset($_GET['quizId'], $_GET['username'], $_POST['responses'])) {
    $quiz_id = $_GET['quizId'];  // Access quiz_id from URL
    $username = $_GET['username'];  // Access user_id from URL
    $responses = json_decode($_POST['responses'], true);  // Decode responses

    // Initialize total score
    $totalScore = 0;
    $total = 0;

    // Check if score was passed as zero (in case of tab switching or other scenarios)
    if (isset($_GET['score']) && $_GET['score'] == 0) {
        // No need to calculate score, we just store 0
        $totalScore = 0;
    } else {
        // Fetch correct answers from the database
        $stmt = $conn->prepare("SELECT question_id, correct_option FROM questions WHERE quiz_id = ?");
        $stmt->bind_param("i", $quiz_id);
        $stmt->execute();
        $result = $stmt->get_result();

        echo '<pre>' . print_r($responses, true) . '</pre>';

        // Check answers and calculate total score
        while ($question = $result->fetch_assoc()) {
            $question_id = $question['question_id'];
            $correct_answer = $question['correct_option'];
            $total += 1;
            // Debugging: Check each question's response
            echo "Checking question_id: " . $question_id . " with correct_option: " . $correct_answer . "<br>";

            // If the user selected the correct answer, increment the total score
            if (isset($responses[$question_id]) && $responses[$question_id] === $correct_answer) {
                echo "Correct answer for question_id: " . $question_id . " " . $responses[$question_id] . "<br>"; // Debugging
                $totalScore++;  // Increment the score for each correct answer
            } else {
                echo "Incorrect answer for question_id: " . $question_id . " " . $responses[$question_id] .  "<br>"; // Debugging
            }
        }

        // Debugging: Check the total score after calculation
        echo "Total score calculated: " . $totalScore . "<br>";
    }

    $final_score = $totalScore . "/" . $total;
    // Store or update the total score in the database for the user and quiz
    $updateScoreQuery = $conn->prepare("INSERT INTO quiz_results (username, quiz_id, score) VALUES (?, ?, ?)");
    $updateScoreQuery->bind_param("sss", $username, $quiz_id, $final_score); // 'ssii' for string, string, int, int

    // Debugging: Print SQL query for review
    echo "SQL Query: " . $updateScoreQuery->error . "<br>";  // To see if there is any SQL error

    if ($updateScoreQuery->execute()) {
        $_SESSION['score'] = $totalScore;  // Store the total score in session for later use
        echo "Score submitted successfully for user: " . $username . " with total score: " . $totalScore;
    } else {
        echo "Failed to update score! Error: " . $updateScoreQuery->error; // Display query error if any
    }

    // Redirect to the exams page after successful submission
    header("Location: ../dashboard/exams.html");
    exit();
} else {
    echo "Missing required data.";  // Handle missing query data
}
