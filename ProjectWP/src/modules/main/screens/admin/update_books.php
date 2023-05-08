<?php
// Get the JSON data from the request body
$json = file_get_contents('php://input');

// Convert the JSON data to a PHP array
$books = json_decode($json, true);

// Connect to the database using mysqli
$mysqli = new mysqli('localhost', '', '', 'book_shop');

// Check for errors
if ($mysqli->connect_errno) {
  echo "Failed to connect to MySQL: " . $mysqli->connect_error;
  exit();
}

// Loop through the books array and update the database
foreach ($books as $book) {
  $id = $book['id'];
  $name = $mysqli->real_escape_string($book['name']);
  $author = $mysqli->real_escape_string($book['author']);
  $price = $book['price'];
  $description = $mysqli->real_escape_string($book['description']);

  $sql = "UPDATE books SET name='$name', author='$author', price=$price, description='$description' WHERE id=$id";

  if (!$mysqli->query($sql)) {
    echo "Error updating record: " . $mysqli->error;
  }
}

// Close the database connection
$mysqli->close();

// Return a response indicating success
echo "Books updated successfully";
?>
