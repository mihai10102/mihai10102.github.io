<?php
// Replace with your own database connection details
$servername = "localhost";
$username = "";
$password = "";
$dbname = "book_shop";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Extract form data
$name = $_POST['name'];
$author = $_POST['author'];
$price = $_POST['price'];
$description = $_POST['description'];
$file_path = $_POST['file_path'];

$sql = "INSERT INTO books (name, author, price, description, file_path) VALUES ('$name', '$author', '$price', '$description', '$file_path')";

if ($conn->query($sql) === TRUE) {
  // Book added successfully
  echo $price;
} else {
  // Handle errors as necessary
}


// // Execute SQL statement
// if ($stmt->execute() === TRUE) {
// } else {
//   // Handle errors as necessary
// }

// $stmt->close();
// $conn->close();
?>
