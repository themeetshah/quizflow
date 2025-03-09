<?php
// Set CORS headers to allow access from the specified origin
// header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
// header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
// header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Handle preflight requests (OPTIONS method)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once 'db_connection.php';

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to connect to the database.']);
    exit;
}

// Validate and sanitize the quizId parameter
$quizId = $_GET['quizId'];
// if (!$quizId) {
//     http_response_code(400);
//     echo json_encode(['error' => 'Invalid quiz ID']);
//     exit;
// }

try {
    // First, fetch quiz details to get the timer duration
    $quizStmt = $conn->prepare("SELECT timer FROM quizzes WHERE id = ?");
    $quizStmt->bind_param("i", $quizId);  // Bind quizId as integer parameter
    $quizStmt->execute();
    $quizResult = $quizStmt->get_result();

    if ($quizResult->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['error' => `Quiz not found $quizStmt`]);
        exit;
    }

    // Fetch the timer duration
    $quizData = $quizResult->fetch_assoc();
    $timerDuration = $quizData['timer'];

    // Prepare and execute the SQL query
    $stmt = $conn->prepare("SELECT question_id, question_text, option_a, option_b, option_c, option_d, correct_option FROM questions WHERE quiz_id = ?");
    $stmt->bind_param("i", $quizId); // Bind quizId as integer parameter
    $stmt->execute();
    $result = $stmt->get_result();

    // Fetch the questions
    $questions = [];
    while ($row = $result->fetch_assoc()) {
        $questions[] = $row;
    }

    // Return questions in JSON format
    echo json_encode([
        'timer' => $timerDuration,  // Include timer duration
        'questions' => $questions
    ]);

    // Close the statement and connection
    $quizStmt->close();
    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch quiz questions.']);
}
