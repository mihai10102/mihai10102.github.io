<?php
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

// Retrieve data from mytable
$sql = "SELECT 
    cart_items.user_id, cart_items.book_id, cart_items.quantity, 
    books.name, books.author, books.price, books.description, books.file_path 
    FROM cart_items 
    INNER JOIN books ON cart_items.book_id = books.id;
";
$result = $conn->query($sql);

// Return data as JSON
echo json_encode($result->fetch_all(MYSQLI_ASSOC));

// Close connection
$conn->close();
?>
