const profileForm = document.getElementById("profile-form");

function handleUpdateProfile() {
  const name = profileForm.querySelector('input[id="name"]').value;
  const email = profileForm.querySelector('input[id="email"]').value;
  const password = profileForm.querySelector('input[id="password"]').value;

  if (name.length < 5) return alert("Name must be at least 5 characters long!");
  if (email === "") return alert("Email field is required!");
  if (password.length < 5)
    return alert("Password must be at least 5 characters long!");

  atIndex = email.indexOf("@");
  dotIndex = email.indexOf(".");
  if (atIndex === -1 || dotIndex === -1 || dotIndex < atIndex) {
    return alert("Invalid email format!");
  }

  // TODO: update profile in  db
  return alert("Update successful!");
}
