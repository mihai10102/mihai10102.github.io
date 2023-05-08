const orders = document.querySelectorAll(".order");

orders.forEach((order) => {
  const books = order.querySelector(".books");
  const header = order.querySelector(".order-header");

  header.addEventListener("click", () => {
    const dysplay = books.style.display;
    books.style.display = dysplay === "block" ? "none" : "block";
    // books.classList.toggle("show-books");
  });
});

// TODO: add orders from db
