<?php
// Database connection
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
// header("Access-Control-Allow-Headers: Content-Type, Authorization");

include('db_connection.php');

// Validate and get quiz data from the POST request
$title = $_POST['quizTitle'] ?? null;
$description = $_POST['quizDescription'] ?? null;
$difficulty = $_POST['quizDifficulty'] ?? null;
$category = $_POST['quizCategory'] ?? null;
$exam_date = $_POST['quizDate'];
$quiz_timer = $_POST['quizTimer']; // Capture the quiz timer value
$created_at = $_POST['now'];
$created_by = $_POST['createdBy'] ?? null;  // The professor's username
$questions = json_decode($_POST['questions'] ?? '[]', true);  // Array of questions

// Check for missing fields
if (!$title || !$description || !$difficulty || !$category || !$exam_date || !$created_by || empty($questions) || !$quiz_timer) {
    die('Error: Missing required fields');
}

try {
    // Prepare and bind for quiz insertion
    $stmt = $conn->prepare("INSERT INTO quizzes (title, description, timer, difficulty, category, exam_date, created_at, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssisssss", $title, $description, $quiz_timer, $difficulty, $category, $exam_date, $created_at, $created_by);

    if ($stmt->execute()) {
        $quiz_id = $stmt->insert_id;  // Get the ID of the inserted quiz


        // Insert each question
        foreach ($questions as $question) {
            $question_text = $question['question_text'];
            $option_a = $question['option_a'];
            $option_b = $question['option_b'];
            $option_c = $question['option_c'];
            $option_d = $question['option_d'];
            $correct_option = $question['correct_option'];
            // Prepare and bind for question insertion
            $stmt_question = $conn->prepare("INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt_question->bind_param("issssss", $quiz_id, $question_text, $option_a, $option_b, $option_c, $option_d, $correct_option);

            if (!$stmt_question->execute()) {
                echo "Error inserting question: " . $stmt_question->error;
            }
            $stmt_question->close();
        }

        echo "Quiz and questions created successfully";
    } else {
        echo "Error inserting quiz: " . $stmt->error;
    }
} catch (Exception $e) {
    echo "Exception: " . $e->getMessage();
} finally {
    // Close the statements and connection
    $stmt->close();
    $conn->close();
}
