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

// Get book ID from the request parameters
$id = $_POST['id'];

// Prepare the SQL statement to delete the book
$sql = "DELETE FROM books WHERE id = '$id'";

// Execute the SQL statement
if ($conn->query($sql) === TRUE) {
  // Book successfully deleted
  echo "Book with ID $id deleted successfully.";
} else {
  // Error deleting book
  echo "Error deleting book with ID $id: " . $conn->error;
}

// Close the database connection
$conn->close();
?>
