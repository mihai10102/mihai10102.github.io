var books = [];

var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    var data = JSON.parse(this.responseText);
    books = data;

    loadBookDataOnPage();

    const posts = document.querySelectorAll(".post");

    // Show only the first two posts
    for (let i = 0; i < posts.length; i++) {
      if (i < 2) {
        posts[i].style.display = "block";
      } else {
        posts[i].style.display = "none";
      }
    }

    // Add click event listener to the "Show more..." button
    const showMoreButton = document.querySelector("#show-more");
    const showLessButton = document.querySelector("#show-less");
    showMoreButton.addEventListener("click", function () {
      if (showMoreButton.style.display === "none") return;
      // Show the remaining posts
      for (let i = 2; i < posts.length; i++) {
        posts[i].style.display = "block";
        posts[i].style.display = "row";
      }
      // Hide the "Show more..." button
      showMoreButton.style.display = "none";
      showLessButton.style.display = "block";
    });

    showLessButton.addEventListener("click", function () {
      if (showLessButton.style.display === "none") return;
      // Show the remaining posts
      for (let i = 2; i < posts.length; i++) {
        posts[i].style.display = "none";
      }
      // Hide the "Show more..." button
      showMoreButton.style.display = "block";
      showLessButton.style.display = "none";
    });
  }
};

xhttp.open("GET", "getbooks.php", true);
xhttp.send();

function loadBookDataOnPage() {
  const resultsContainer = document.querySelector(".results-container");
  resultsContainer.innerHTML = ""; // clear previous results

  books.forEach((book) => {
    // create new post div
    const postDiv = document.createElement("div");
    postDiv.classList.add("post");
    postDiv.onclick = function () {
      const queryParams =
        "id=" +
        encodeURIComponent(book.id) +
        "&name=" +
        encodeURIComponent(book.name) +
        "&author=" +
        encodeURIComponent(book.author) +
        "&price=" +
        encodeURIComponent(book.price) +
        "&description=" +
        encodeURIComponent(book.description) +
        "&file_path=" +
        encodeURIComponent(book.file_path);

      window.location.href = `../book/book.html?${queryParams}`;
    };

    // add image
    const img = document.createElement("img");
    img.src = `../../../../../${book.file_path}`;
    img.alt = "";
    postDiv.appendChild(img);

    // add title
    const title = document.createElement("h1");
    title.classList.add("posts-title");
    title.textContent = book.name;
    postDiv.appendChild(title);

    // append post div to results container
    resultsContainer.appendChild(postDiv);
  });
}

// // Define an array of book objects
// const books = [
//   { name: "The Great Gatsby", author: "F. Scott Fitzgerald", price: "$10.99" },
//   { name: "To Kill a Mockingbird", author: "Harper Lee", price: "$8.99" },
//   { name: "1984", author: "George Orwell", price: "$7.99" },
//   { name: "Brave New World", author: "Aldous Huxley", price: "$6.99" },
// ];

// // Get a reference to the table
// const table = document
//   .getElementById("bookTable")
//   .getElementsByTagName("tbody")[0];

// // Loop through the books array and add a row to the table for each book
// for (let i = 0; i < books.length; i++) {
//   const book = books[i];

//   // Create a new row
//   const row = table.insertRow(i);

//   // Add cells for each book property
//   const nameCell = row.insertCell(0);
//   nameCell.innerHTML = book.name;

//   const authorCell = row.insertCell(1);
//   authorCell.innerHTML = book.author;

//   const priceCell = row.insertCell(2);
//   priceCell.innerHTML = book.price;

//   const buttonCell = row.insertCell(3);
//   const button = document.createElement("button");
//   button.innerHTML = "&#128722";
//   button.style = `border: none; color: black; background-color: transparent; font-size: 24px; cursor: pointer`;
//   buttonCell.appendChild(button);
// }

// FILTERING
$("#search").on("input", function () {
  const val = $(this).val().toUpperCase();
  $(".post").each(function () {
    if ($(this).html().toUpperCase().indexOf(val) !== -1) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
});

// // UPLOAD FILE
// const dropArea = document.querySelector(".drag-area"),
//   dragText = dropArea.querySelector("header"),
//   button = dropArea.querySelector("button"),
//   input = dropArea.querySelector("input");
// let file;

// button.onclick = () => {
//   input.click();
// };

// input.addEventListener("change", function () {
//   file = this.files[0];
//   dropArea.classList.add("active");
//   showFile();
// });

// dropArea.addEventListener("dragover", (event) => {
//   event.preventDefault();
//   dropArea.classList.add("active");
//   dragText.textContent = "Release to Upload File";
// });

// dropArea.addEventListener("dragleave", () => {
//   dropArea.classList.remove("active");
//   dragText.textContent = "Drag & Drop to Upload File";
// });

// dropArea.addEventListener("drop", (event) => {
//   event.preventDefault();
//   file = event.dataTransfer.files[0];
//   showFile();
// });

// function showFile() {
//   let fileType = file.type;
//   let validExtensions = [
//     "image/jpeg",
//     "image/jpg",
//     "image/png",
//     "application/pdf",
//     ".doc",
//     ".docx",
//     ".xml",
//     "application/msword",
//     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//   ];
//   console.log(fileType);
//   if (validExtensions.includes(fileType)) {
//     let fileReader = new FileReader();
//     fileReader.onload = () => {
//       let fileURL = fileReader.result;
//       dropArea.classList.remove("active");
//       dragText.textContent = "The file is successfully uploaded.";
//       setTimeout(() => {
//         dragText.textContent = "Drag & Drop to Upload File";
//       }, 5000);
//     };
//     fileReader.readAsDataURL(file);
//   } else {
//     alert("This is not an valid file!");
//     dropArea.classList.remove("active");
//     dragText.textContent = "Drag & Drop to Upload File";
//   }
// }
