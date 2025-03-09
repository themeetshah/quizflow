<?php
// CORS Headers: Must be placed before any other output!
header("Access-Control-Allow-Origin: *");  // Allows requests from any origin (for testing, can restrict to a specific domain)
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");  // Allowed methods
header("Access-Control-Allow-Headers: Content-Type");  // Allow headers like Content-Type

// Database credentials
$servername = "localhost";
$username = "root"; // default XAMPP MySQL username
$password = ""; // default XAMPP MySQL password
$dbname = "quizflow"; // Replace with your actual database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
