<?php
// Add CORS headers
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
// header("Access-Control-Allow-Headers: Content-Type, Authorization");

// // Handle preflight requests (OPTIONS method)
// if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
//     header('Access-Control-Allow-Origin: *');
//     header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
//     header('Access-Control-Allow-Headers: Content-Type');
//     exit(0);
// }

// Include your database connection here
include('db_connection.php');

// Get data from the POST request
$username = $_POST['username'];
$newUsername = $_POST['newUsername'];
$newEmail = $_POST['newEmail'];
$newPassword = $_POST['newPassword'];

// Validate input (this is an example, you may need to add more validation)
if (empty($newUsername) || empty($newEmail)) {
    echo json_encode(['success' => false, 'message' => 'Username and email are required']);
    exit();
}

// Update the user's profile in the database
$query = "UPDATE users SET username = '$newUsername', email = '$newEmail', password = '$newPassword' WHERE username = '$username'";
$result = mysqli_query($conn, $query);

if ($result) {
    // Send success response
    echo json_encode(['success' => true, 'message' => 'Profile updated successfully']);
} else {
    // Send error response if query fails
    echo json_encode(['success' => false, 'message' => 'Error updating profile']);
}

// Close the database connection
mysqli_close($conn);
