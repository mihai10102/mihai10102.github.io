<?php
// Get book_id, user_id, and quantity from POST data
$bookId = $_POST["book_id"];
$userId = $_POST["user_id"];
$quantity = $_POST["quantity"];

// Connect to database (replace with your own database connection code)
$conn = mysqli_connect("localhost", "", "", "book_shop");

// Update cart item quantity
$stmt = mysqli_prepare($conn, "UPDATE cart_items SET quantity = ? WHERE book_id = ? AND user_id = ?");
mysqli_stmt_bind_param($stmt, "iii", $quantity, $bookId, $userId);
mysqli_stmt_execute($stmt);
?>
