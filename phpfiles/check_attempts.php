<?php
include 'db_connection.php';

$username = $_GET['username'];
$quizId = $_GET['quizId'];

// Query to check if the user has attempted the quiz
$sql = "SELECT * FROM quiz_results WHERE quiz_id = ? AND username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $quizId, $username);
$stmt->execute();
$result = $stmt->get_result();

// Return 'true' if the user has already attempted the quiz, 'false' otherwise
if ($result->num_rows > 0) {
    echo 'true';
} else {
    echo 'false';
}

$stmt->close();
$conn->close();
