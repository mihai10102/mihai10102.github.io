<?php
// Get book_id, user_id, and quantity from POST data
$bookId = $_POST["book_id"];
$userId = $_POST["user_id"];
$quantity = $_POST["quantity"];

// Connect to database (replace with your own database connection code)
$conn = new mysqli("localhost", "", "", "book_shop");

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Insert new cart item
$stmt = $conn->prepare("INSERT INTO cart_items (book_id, user_id, quantity) VALUES (?, ?, ?)");
$stmt->bind_param("iii", $bookId, $userId, $quantity);
$stmt->execute();

// Close connection
$stmt->close();
$conn->close();
?>
