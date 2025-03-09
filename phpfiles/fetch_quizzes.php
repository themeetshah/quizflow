<?php
// Database connection
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
// header("Access-Control-Allow-Headers: Content-Type, Authorization");

include('db_connection.php');
header('Content-Type: application/json');

// Read JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!isset($data['loggedInUsername']) || !isset($data['loggedInRole'])) {
    echo json_encode(['error' => 'Missing required data']);
    exit;
}

$loggedInUsername = $data['loggedInUsername'];
$loggedInRole = $data['loggedInRole'];

try {
    if ($loggedInRole == 'professor') {
        $stmt = $conn->prepare("SELECT * FROM quizzes WHERE created_by = ?");
        $stmt->bind_param("s", $loggedInUsername);
    } else {
        $stmt = $conn->prepare("SELECT * FROM quizzes");
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $quizzes = array();
    while ($row = $result->fetch_assoc()) {
        $quizzes[] = $row;
    }

    echo json_encode($quizzes);
} catch (Exception $e) {
    echo json_encode(['error' => 'Failed to fetch quizzes', 'message' => $e->getMessage()]);
}

$stmt->close();
$conn->close();
