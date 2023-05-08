var books = [];
var initialBookIds = [];
var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    var data = JSON.parse(this.responseText);
    books = data;
    books.forEach((book) => initialBookIds.push(book.id));
    console.log(data);

    displayBooks();
  }
};

xhttp.open("GET", "getbooks.php", true);
xhttp.send();

// Book data

// Function to display the list of books
function displayBooks() {
  const table = document.querySelector("#book-table");
  table.innerHTML = "";

  for (let i = 0; i < books.length; i++) {
    const book = books[i];

    // Create table row
    const row = document.createElement("tr");

    // Add book name
    const nameCell = document.createElement("td");
    nameCell.textContent = book.name;
    row.appendChild(nameCell);

    // Add book author
    const authorCell = document.createElement("td");
    authorCell.textContent = book.author;
    row.appendChild(authorCell);

    // Add book price
    const priceCell = document.createElement("td");
    priceCell.textContent = "$" + book.price;
    row.appendChild(priceCell);

    // Add book description
    const descriptionCell = document.createElement("td");
    descriptionCell.textContent = book.description;
    row.appendChild(descriptionCell);

    // Add edit button
    const editCell = document.createElement("td");
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {
      editBook(i);
    });
    editCell.appendChild(editButton);
    row.appendChild(editCell);

    // Add delete button
    const deleteCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      deleteBook(i);
    });
    deleteCell.appendChild(deleteButton);
    row.appendChild(deleteCell);

    // Add row to table
    table.appendChild(row);
  }
}

// Function to edit a book
function editBook(index) {
  const table = document.querySelector("#book-table");
  table.style.display = "none";
  const book = books[index];

  // Show edit form
  const form = document.querySelector("#edit-form");
  form.style.display = "block";

  // Fill form with current book data
  form.elements["name"].value = book.name;
  form.elements["author"].value = book.author;
  form.elements["price"].value = book.price;
  form.elements["description"].value = book.description;

  // Handle form submission
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Update book data
    book.name = form.elements["name"].value;
    book.author = form.elements["author"].value;
    book.price = form.elements["price"].value;
    book.description = form.elements["description"].value;

    // Hide edit form
    form.style.display = "none";

    const table = document.querySelector("#book-table");
    table.style.display = "block";

    // Update book list
    displayBooks();
  });
}

// Function to delete a book
function deleteBook(index) {
  const bookId = books[index].id;
  console.log(bookId);
  books.splice(index, 1);
  displayBooks();

  removeBook(bookId);
}

//
// document.addEventListener("DOMContentLoaded", function () {
//   displayBooks();
// });

function cancelEdit() {
  const table = document.querySelector("#book-table");
  table.style.display = "block";

  const form = document.querySelector("#edit-form");
  form.style.display = "none";
}

function handleSaveChanges() {
  const xhr = new XMLHttpRequest();

  xhr.open("POST", "update_books.php");

  xhr.setRequestHeader("Content-Type", "application/json");

  // Set a callback function to handle the response
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        // The request was successful, handle the response here
        console.log(xhr.responseText);
      } else {
        // There was an error, handle it here
        console.log("Error: " + xhr.status);
      }
    }
  };

  xhr.send(JSON.stringify(books));
}

function removeBook(id) {
  // Send a POST request to the PHP script with the ID of the book to be deleted
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "delete_book.php");
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onload = function () {
    if (xhr.status === 200) {
      // Book was deleted successfully, reload the page
      console.log(xhr.responseText);
      // location.reload();
    } else {
      // Handle errors as necessary
      console.error(xhr.statusText);
    }
  };
  xhr.send("id=" + encodeURIComponent(id));
}

function showAddBookForm() {
  const table = document.querySelector("#book-table");
  table.style.display = "none";

  const form = document.querySelector("#add-book-form");
  form.style.display = "block";

  const dragArea = document.querySelector(".drag-area");
  dragArea.style.display = "block";
}

function cancelAddBook() {
  const table = document.querySelector("#book-table");
  table.style.display = "block";

  const form = document.querySelector("#add-book-form");
  form.style.display = "none";
}

function addBook() {
  const name = document.getElementById("ab-name").value;
  const author = document.getElementById("ab-author").value;
  const price = document.getElementById("ab-price").value;
  const description = document.getElementById("ab-description").value;
  const file_path = `src/assets/${file.name}`;
  console.log(file_path);

  const params = `name=${name}&author=${author}&price=${price}&description=${description}&file_path=${file_path}`;
  console.log(params);

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "add_book.php", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      console.log(xhr.responseText);
      const table = document.querySelector("#book-table");
      table.style.display = "block";

      const form = document.querySelector("#add-book-form");
      form.style.display = "none";

      const dragArea = document.querySelector(".drag-area");
      dragArea.style.display = "none";
    }
  };

  xhr.send(params);
}

// UPLOAD FILE
const dropArea = document.querySelector(".drag-area"),
  dragText = dropArea.querySelector("header"),
  button = dropArea.querySelector("button"),
  input = dropArea.querySelector("input");
let file;

button.onclick = () => {
  input.click();
};

input.addEventListener("change", function () {
  file = this.files[0];
  dropArea.classList.add("active");
  showFile();
});

dropArea.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropArea.classList.add("active");
  dragText.textContent = "Release to Upload File";
});

dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("active");
  dragText.textContent = "Drag & Drop to Upload File";
});

dropArea.addEventListener("drop", (event) => {
  event.preventDefault();
  file = event.dataTransfer.files[0];
  showFile();
});

function showFile() {
  let fileType = file.type;
  let validExtensions = ["image/jpeg", "image/jpg", "image/png"];
  console.log(fileType);
  if (validExtensions.includes(fileType)) {
    let fileReader = new FileReader();
    fileReader.onload = () => {
      let fileURL = fileReader.result;
      dropArea.classList.remove("active");
      dragText.textContent = "The file is successfully uploaded.";
      setTimeout(() => {
        dragText.textContent = "Drag & Drop to Upload File";
      }, 5000);
    };
    fileReader.readAsDataURL(file);
  } else {
    alert("This is not an valid file!");
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File";
  }
}
