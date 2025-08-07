<?php

// Email configuration
$address = "pierrele0102@gmail.com";
if (!defined("PHP_EOL")) define("PHP_EOL", "\r\n");

// Security: Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo 'ERROR!';
    exit;
}

$error = false;
$fields = array('mail', 'phone', 'message');

// Validate required fields
foreach ($fields as $field) {
    if (empty($_POST[$field]) || trim($_POST[$field]) == '') {
        $error = true;
    }
}

// Additional validation
if (!$error) {
    $mail = trim($_POST['mail']);
    $phone = trim($_POST['phone']);
    $message = trim($_POST['message']);
    
    // Validate email format
    if (!filter_var($mail, FILTER_VALIDATE_EMAIL)) {
        $error = true;
    }
    
    // Basic spam protection - check message length
    if (strlen($message) < 10 || strlen($message) > 2000) {
        $error = true;
    }
    
    // Basic spam protection - check phone length
    if (strlen($phone) < 5 || strlen($phone) > 20) {
        $error = true;
    }
}

if (!$error) {
    // Sanitize form data
    $mail = stripslashes($mail);
    $phone = stripslashes($phone);
    $message = stripslashes($message);

    // Email subject
    $e_subject = 'New Contact Form Submission from ' . $mail;

    // Email body
    $e_body = "You have been contacted by: $mail" . PHP_EOL . PHP_EOL;
    $e_body .= "Phone: $phone" . PHP_EOL . PHP_EOL;
    $e_body .= "Message:" . PHP_EOL . $message . PHP_EOL . PHP_EOL;
    $e_body .= "This email was sent from your portfolio contact form.";

    // Email headers
    $headers = "From: $mail" . PHP_EOL;
    $headers .= "Reply-To: $mail" . PHP_EOL;
    $headers .= "Content-Type: text/plain; charset=UTF-8" . PHP_EOL;
    $headers .= "X-Mailer: PHP/" . phpversion();

    // Send email
    if (mail($address, $e_subject, $e_body, $headers)) {
        // Email sent successfully
        echo 'Success';
    } else {
        // Email failed to send
        echo 'ERROR!';
    }
} else {
    // Validation failed
    echo 'ERROR!';
}

?>