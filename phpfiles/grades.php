<?php
// Include the database connection file
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
// header("Access-Control-Allow-Headers: Content-Type, Authorization");

include('db_connection.php');

// Get the user_id from the URL
$username = $_GET['username'];

// Check if the user_id is set and is a valid integer
if (!isset($username)) {
    echo json_encode(["error" => "Invalid user ID"]);
    exit;
}

// echo ("user ID" . $username);
// Query to fetch quiz results along with the quiz name from the quizzes table
$query = "
    SELECT quizzes.title, quiz_results.score, quiz_results.timestamp, quizzes.created_by, quizzes.id as quizId 
    FROM quiz_results INNER JOIN quizzes ON quiz_results.quiz_id = quizzes.id WHERE quiz_results.username = ?
    ORDER BY quiz_results.timestamp DESC
";

// Prepare the statement
$stmt = $conn->prepare($query);

// Bind the user_id parameter to the query
$stmt->bind_param("s", $username);

// Execute the query
$stmt->execute();

// Get the result
$result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

// Close the statement and the connection
$stmt->close();
$conn->close();

// Return the results as a JSON response
echo json_encode($result);
