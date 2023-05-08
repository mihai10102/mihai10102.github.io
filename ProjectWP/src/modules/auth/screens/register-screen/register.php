<?php
// Connect to the database
$servername = "localhost";
$username = "";
$password = "";
$dbname = "book_shop";
// $conn = mysqli_connect($servername, $username, $password, $database);
$conn = new mysqli($servername, $username, $password, $dbname);

// Check for errors
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Get the form data
$name = $_POST['name'];
$username = $_POST['username'];
$email = $_POST['email'];
$password = $_POST['password'];

// Insert the data into the database
$sql = "INSERT INTO users (name, username, email, password, role) VALUES ('$name', '$username', '$email', '$password', 'user')";
if (mysqli_query($conn, $sql)) {
    echo "Registration successful";
} else {
    echo "Error: " . $sql . "<br>" . mysqli_error($conn);
}

// Close the connection
mysqli_close($conn);
?>
