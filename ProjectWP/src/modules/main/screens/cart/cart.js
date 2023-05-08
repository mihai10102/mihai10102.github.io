var books = [];

var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    var data = JSON.parse(this.responseText);

    const userId = window.localStorage.getItem("currentUserId");
    books = data.filter((item) => item.user_id != userId);

    const tbody = document.querySelector("table.cart tbody");

    updateTotalPrice();

    // Iterate over the books array and add a row for each book
    books.forEach((book) => {
      console.log(book);
      // Create a new table row
      const row = document.createElement("tr");

      // Add the book title
      const titleCell = document.createElement("td");
      titleCell.textContent = book.title;
      row.appendChild(titleCell);

      // Add the book author
      const authorCell = document.createElement("td");
      authorCell.textContent = book.author;
      row.appendChild(authorCell);

      // Add the book price
      const priceCell = document.createElement("td");
      priceCell.textContent = book.price;
      row.appendChild(priceCell);

      // Add the book quantity
      const quantityCell = document.createElement("td");
      const quantityInput = document.createElement("input");
      quantityInput.setAttribute("type", "number");
      quantityInput.setAttribute("min", 1);
      quantityInput.setAttribute("value", book.quantity);
      quantityInput.addEventListener("change", () => {
        book.quantity = parseInt(quantityInput.value);
        updateTotalPrice();
      });
      quantityCell.appendChild(quantityInput);
      row.appendChild(quantityCell);

      // Add the book total
      // const totalCell = document.createElement("td");
      // totalCell.classList.add("total-cell");
      // const totalPrice = book.price * book.quantity;
      // totalCell.textContent = totalPrice.toFixed(2);
      // row.appendChild(totalCell);

      // Add the delete button
      const deleteCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => {
        const index = books.indexOf(book);
        books.splice(index, 1);
        tbody.removeChild(row);
        updateTotalPrice();
      });
      deleteCell.appendChild(deleteButton);
      row.appendChild(deleteCell);

      // Add the row to the table body
      tbody.appendChild(row);
    });
  }
};

xhttp.open("GET", "get_cart_items.php", true);
xhttp.send();

// const books = [
//   {
//     id: 1,
//     title: "The Great Gatsby",
//     author: "F. Scott Fitzgerald",
//     price: 10.99,
//     quantity: 1,
//   },
//   {
//     id: 2,
//     title: "To Kill a Mockingbird",
//     author: "Harper Lee",
//     price: 12.99,
//     quantity: 2,
//   },
//   {
//     id: 3,
//     title: "1984",
//     author: "George Orwell",
//     price: 9.99,
//     quantity: 1,
//   },
// ];

// Get the table body
const tbody = document.querySelector("table.cart tbody");

// Calculate and display the total price
function updateTotalPrice() {
  const totalPrice = books.reduce(
    (acc, book) => acc + book.price * book.quantity,
    0
  );
  document.querySelector("#total-price").textContent = totalPrice.toFixed(2);
}
updateTotalPrice();

// Iterate over the books array and add a row for each book
books.forEach((book) => {
  // Create a new table row
  const row = document.createElement("tr");

  // Add the book title
  const titleCell = document.createElement("td");
  titleCell.textContent = book.title;
  row.appendChild(titleCell);

  // Add the book author
  const authorCell = document.createElement("td");
  authorCell.textContent = book.author;
  row.appendChild(authorCell);

  // Add the book price
  const priceCell = document.createElement("td");
  priceCell.textContent = book.price.toFixed(2);
  row.appendChild(priceCell);

  // Add the book quantity
  const quantityCell = document.createElement("td");
  const quantityInput = document.createElement("input");
  quantityInput.setAttribute("type", "number");
  quantityInput.setAttribute("min", 1);
  quantityInput.setAttribute("value", book.quantity);
  quantityInput.addEventListener("change", () => {
    book.quantity = parseInt(quantityInput.value);
    updateTotalPrice();
  });
  quantityCell.appendChild(quantityInput);
  row.appendChild(quantityCell);

  // Add the book total
  // const totalCell = document.createElement("td");
  // totalCell.classList.add("total-cell");
  // const totalPrice = book.price * book.quantity;
  // totalCell.textContent = totalPrice.toFixed(2);
  // row.appendChild(totalCell);

  // Add the delete button
  const deleteCell = document.createElement("td");
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    const index = books.indexOf(book);
    books.splice(index, 1);
    tbody.removeChild(row);
    updateTotalPrice();
  });
  deleteCell.appendChild(deleteButton);
  row.appendChild(deleteCell);

  // Add the row to the table body
  tbody.appendChild(row);
});

function handleCheckout() {
  books = [];

  // Create a new XMLHttpRequest object
  const xhr = new XMLHttpRequest();

  // Set the Content-Type header to indicate that we're sending form data

  // Define the callback function to handle the response
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log(xhr.responseText);
    }
  };

  // Send the request with the user_id parameter as form data
  xhr.open(
    "GET",
    `empty_cart.php?user_id=${window.localStorage.getItem("connectedUserId")}`,
    true
  );
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send();

  const table = document.querySelector("table.cart tbody");
  updateTotalPrice();

  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }

  alert("Order placed successfully");
}
