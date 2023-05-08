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
$sql = "SELECT * FROM cart_items";
$result = $conn->query($sql);

// Return data as JSON
echo json_encode($result->fetch_all(MYSQLI_ASSOC));

// Close connection
$conn->close();
?>
