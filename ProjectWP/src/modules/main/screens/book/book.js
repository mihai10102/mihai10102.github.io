// Get the modal
var modal = document.getElementById("myModal");

// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementById("myImg");
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");
img.onclick = function () {
  modal.style.display = "block";
  modalImg.src = this.src;
  captionText.innerHTML = this.alt;
};

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

const urlSearchParams = new URLSearchParams(window.location.search);

const bookId = urlSearchParams.get("id");

const name = urlSearchParams.get("name");
var titleHeader = document.getElementById("book-title");
titleHeader.innerText = name;

const author = urlSearchParams.get("author");
var authorP = document.getElementById("author");
authorP.innerText = author;

const description = urlSearchParams.get("description");
var descriptionP = document.getElementById("description");
descriptionP.innerText = description;

const price = urlSearchParams.get("price");
var priceP = document.getElementById("price");
priceP.innerText = `${price}$`;

const file_path = `../../../../../${urlSearchParams.get("file_path")}`;
var image = document.getElementById("myImg");
image.src = file_path;

const addToCartBtn = document.getElementById("cart-btn");
addToCartBtn.addEventListener("click", function () {
  console.log("add to cart");
  const userId = parseInt(window.localStorage.getItem("connectedUserId"));

  // Send AJAX request to server to check if book_id and user_id already exist in cart_items table
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var cartItem = null;
      const cartItems = JSON.parse(xhr.responseText);
      console.log(cartItems);

      if (cartItems.length > 0) {
        cartItems.forEach((item) => {
          if (item.user_id == userId && item.book_id == bookId) {
            cartItem = item;
          }
        });
      }

      if (cartItem) {
        // Book is already in cart, increment quantity by 1
        const quantity = parseInt(cartItem.quantity) + 1;
        updateCartItem(bookId, userId, quantity);
      } else {
        // Book is not yet in cart, add new cart item with quantity of 1
        const quantity = 1;
        addCartItem(bookId, userId, quantity);
      }
    }
  };

  xhr.open("GET", `check_cart_item.php?book_id=${bookId}&user_id=${userId}`);
  xhr.send();
});

function updateCartItem(bookId, userId, quantity) {
  console.log("update");
  // Send AJAX request to server to update cart item quantity
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "update_cart_item.php");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send(`book_id=${bookId}&user_id=${userId}&quantity=${quantity}`);
}

function addCartItem(bookId, userId, quantity) {
  console.log("add item");
  // Send AJAX request to server to add new cart item
  const xhr = new XMLHttpRequest();
  // xhr.onreadystatechange = function () {
  //   if (xhr.readyState === 4 && xhr.status === 200) {
  //     const response = JSON.parse(xhr.responseText);
  //     console.log(response);
  //   }
  // };
  xhr.open("POST", "add_cart_item.php");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  console.log(bookId, userId, quantity);
  xhr.send(`book_id=${bookId}&user_id=${userId}&quantity=${quantity}`);
}
