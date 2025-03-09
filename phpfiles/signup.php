<?php
// CORS Headers: Must be placed before any other output!
// header("Access-Control-Allow-Origin: *");  // Allows requests from any origin (for testing, can restrict to a specific domain)
// header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");  // Allowed methods
// header("Access-Control-Allow-Headers: Content-Type");  // Allow headers like Content-Type

// Include database connection
include('db_connection.php');

// Get data from the front-end (POST request)
$username = $_POST['username'];
$password = $_POST['password'];
$email = $_POST['email'];
$role = $_POST['role'];

// Check if username already exists in the database
$query = "SELECT * FROM users WHERE username = '$username'";
$result = mysqli_query($conn, $query);

if (mysqli_num_rows($result) > 0) {
    // Username already exists
    echo json_encode(['success' => false, 'message' => 'Username already exists']);
} else {
    // Insert new user with role 'student' into the database
    $query = "INSERT INTO users (username, password, email, role) VALUES ('$username', '$password', '$email', '$role')";
    if (mysqli_query($conn, $query)) {
        // User successfully registered
        echo json_encode(['success' => true, 'message' => 'User registered successfully']);
    } else {
        // Error registering user
        echo json_encode(['success' => false, 'message' => 'Error registering user']);
    }
}
