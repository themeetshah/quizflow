<?php
// Database connection
include('db_connection.php');

// Fetch quiz title
$quiz_id = isset($_GET['quiz_id']) ? intval($_GET['quiz_id']) : 1; // Get the quiz ID from the URL (default to 1)
$sql = "SELECT title FROM quizzes WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $quiz_id);
$stmt->execute();
$stmt->bind_result($quiz_title);
$stmt->fetch();
$stmt->close();
$conn->close();

// Return the quiz title as a JSON response
header('Content-Type: application/json');
echo json_encode(['title' => $quiz_title]);
