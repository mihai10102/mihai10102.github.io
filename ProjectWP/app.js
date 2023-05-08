const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

let users = [];

function handleLogin() {
  const email = loginForm.querySelector('input[type="email"]').value;
  const password = loginForm.querySelector('input[type="password"]').value;

  if (email === "") return alert("Email field is required!");
  if (password === "") return alert("Password field is required!");

  atIndex = email.indexOf("@");
  dotIndex = email.indexOf(".");
  if (atIndex === -1 || dotIndex === -1 || dotIndex < atIndex) {
    return alert("Invalid email format!");
  }

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      var data = JSON.parse(xhttp.responseText);

      var isLoggedIn = false;

      for (var i = 0; i < data.length; i++) {
        if (data[i].email === email && data[i].password === password) {
          window.localStorage.setItem("connectedUserId", data[i].id.toString());
          if (data[i].role === "user") {
            window.location.href = "./src/modules/main/screens/home/home.html";
          } else if (data[i].role === "admin") {
            window.location.href =
              "./src/modules/main/screens/admin/admin.html";
          }
          isLoggedIn = true;
        }
      }

      if (!isLoggedIn) {
        alert("Incorrect email or password!");
      }
    }
  };

  xhttp.open("GET", "getdata.php", true);
  xhttp.send();
}

function handleRegister() {
  const name = registerForm.querySelector('input[id="name"]').value;
  const username = registerForm.querySelector('input[id="username"]').value;
  const email = registerForm.querySelector('input[type="email"]').value;
  const password = registerForm.querySelector('input[id="password"]').value;
  const confirmPassword = registerForm.querySelector(
    'input[id="confirm-password"]'
  ).value;

  if (name.length < 5)
    return alert("Name should be at least 5 characters long!");
  if (username.length < 5)
    return alert("Username should be at least 5 characters long!");
  if (email === "") return alert("Email field is required!");
  if (password.length < 5)
    return alert("Password should be at least 5 characters long!");
  if (confirmPassword.length < 5)
    return alert("Confirm Password should be at least 5 characters long!");
  if (password !== confirmPassword) return alert("Passwords do not match!");

  atIndex = email.indexOf("@");
  dotIndex = email.indexOf(".");
  if (atIndex === -1 || dotIndex === -1 || dotIndex < atIndex) {
    return alert("Invalid email format!");
  }

  var isValid = true;

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);

      var validationError = "";
      data.forEach((user) => {
        if (user.username === username) {
          isValid = false;
          validationError = "Username already taken!";
        }
        if (user.email === email) {
          isValid = false;
          validationError = "Email already taken!";
        }
      });

      if (isValid) {
        // Create a new XHR object
        var xhr = new XMLHttpRequest();

        // Set up the request
        xhr.open("POST", "register.php", true);
        xhr.setRequestHeader(
          "Content-type",
          "application/x-www-form-urlencoded"
        );

        // Set up a callback function for when the request is complete
        xhr.onload = function () {
          if (xhr.status === 200) {
            // Handle the response from the server
            console.log(xhr.responseText);
            window.location.href = "../../../main/screens/home/home.html";
          } else {
            console.log("Error: " + xhr.status);
          }
        };

        var data =
          "name=" +
          encodeURIComponent(name) +
          "&username=" +
          encodeURIComponent(username) +
          "&email=" +
          encodeURIComponent(email) +
          "&password=" +
          encodeURIComponent(password);

        xhr.send(data);
      } else {
        alert(validationError);
      }
    }
  };

  xhttp.open("GET", "../../../../../getdata.php", true);
  xhttp.send();
}

function goToRegister() {
  window.location.href =
    "./src/modules/auth/screens/register-screen/register-screen.html";
}

function goToLogin() {
  window.location.href = "../../../../../index.html";
}

function loadData() {
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);
      users = data;
      console.log(data);
    }
  };

  xhttp.open("GET", "getdata.php", true);
  xhttp.send();
}
