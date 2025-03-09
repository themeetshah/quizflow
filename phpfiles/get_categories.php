<?php
// Database connection
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
// header("Access-Control-Allow-Headers: Content-Type, Authorization");

include('db_connection.php');

// Query to fetch categories
$sql = "SELECT category FROM quizzes";
$result = $conn->query($sql);

$categories = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $categories[] = $row['category'];
    }
}

$conn->close();

// Return categories as JSON
echo json_encode($categories);
