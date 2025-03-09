<?php
include 'db_connection.php';

// Assume we have recipient_id and quiz_id, you can get them via GET or POST
$username = $_GET['username'];  // Get recipient id (e.g., from URL)
$quizId = $_GET['quizId'];  // Get quiz id (e.g., from URL)

// Fetch data
// Prepared statement to prevent SQL injection
$sql = "SELECT quizzes.created_by AS professor, quiz_results.timestamp, quiz_results.score, quizzes.title AS quiz_name 
        FROM quizzes INNER JOIN quiz_results ON quiz_results.quiz_id = quizzes.id WHERE quiz_results.username = ? AND quizzes.id = ?";

$stmt = $conn->prepare($sql);

if ($stmt === false) {
    // If the SQL preparation fails, output an error
    echo "Error preparing the SQL statement: " . $conn->error;
    exit();
}

$stmt->bind_param("si", $username, $quizId); // "si" means string for $username, integer for $quizId
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $data = $result->fetch_assoc();
    $professor = $data['professor'];
    $quiz_name = $data['quiz_name'];
    $score = $data['score'];
    $issued_on = $data['timestamp'];
} else {
    echo "No data found.";
    exit();
}

// Create an image from the certificate template (ensure the path to your image is correct)
$image = imagecreatefrompng('../certificate_template_img1.png');  // Path to your certificate template image

// Set the colors for the text (black)
$black = imagecolorallocate($image, 0, 0, 0);
$blue = imagecolorallocate($image, 11, 131, 181);

// Add text to the image (you can adjust the coordinates as needed)
imagettftext($image, 150, 0, 735, 1090, $black, 'C:/Windows/Fonts/Gabriola.ttf', $username);  // Recipient name
imagettftext($image, 80, 0, 735, 1400, $black, 'C:/Windows/Fonts/Gabriola.ttf', $quiz_name);        // Quiz name
imagettftext($image, 35, 0, 890, 1633, $blue, 'C:/Windows/Fonts/timesbd.ttf', $score); // Score
imagettftext($image, 35, 0, 1000, 1553, $blue, 'C:/Windows/Fonts/timesbd.ttf', $issued_on);
imagettftext($image, 35, 0, 690, 1913, $black, 'C:/Windows/Fonts/timesbd.ttf', $professor);

// Output the image as a PNG (you can also save it to a file or serve it as a download)
header('Content-Type: image/png');
imagepng($image);  // Output image to browser

// Save the image to the server (optional)
imagepng($image, '../certificate_' . $username . '_' . $quiz_name . '.png');  // Save image to server

// Free memory
imagedestroy($image);
