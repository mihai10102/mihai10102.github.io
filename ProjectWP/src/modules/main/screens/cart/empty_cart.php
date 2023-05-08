<?php
// Get user_id from GET data
$user_id = $_GET['user_id'];

// Connect to database (replace with your own database connection code)
$mysqli = new mysqli("localhost", "", "", "book_shop");

// Check for connection errors
if ($mysqli->connect_error) {
  die("Connection failed: " . $mysqli->connect_error);
}

// Prepare and execute SQL statement to delete cart items for the given user_id
$sql = "DELETE FROM cart_items WHERE user_id = ?";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();

// Check for errors and display success message
if ($stmt->affected_rows > 0) {
  echo "All cart items for user with ID $user_id have been deleted.";
} else {
  echo "No cart items were found for user with ID $user_id.";
}

// Close statement and database connection
$stmt->close();
$mysqli->close();
?>
