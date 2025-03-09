<?php
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
// header("Access-Control-Allow-Headers: Content-Type, Authorization");

session_start();

// Database connection
include('db_connection.php');

$username = $_POST['username'];
$password = $_POST['password'];

// Check if the user exists
$stmt = $conn->prepare("SELECT * FROM users WHERE username = ? AND password = ?");
$stmt->bind_param("ss", $username, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // User found, fetch the user's role
    $user = $result->fetch_assoc();
    $_SESSION['loggedInUsername'] = $user['username'];
    $_SESSION['loggedInRole'] = $user['role'];

    // Respond with success and user role
    echo json_encode([
        'success' => true,
        'role' => $user['role']
    ]);
} else {
    // User not found
    echo json_encode(['success' => false]);
}

$stmt->close();
$conn->close();
