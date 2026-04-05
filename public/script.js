function validateForm() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let usernameError = document.getElementById("usernameError");
  let passwordError = document.getElementById("passwordError");
  let isValid = true;

  usernameError.textContent = "";
  passwordError.textContent = "";

  if (username.trim() === "") {
    usernameError.textContent = "Username is required.";
    isValid = false;
  }

  if (password.trim() === "") {
    passwordError.textContent = "Password is required.";
    isValid = false;
  } else if (password.length < 6) {
    passwordError.textContent = "Password must be at least 6 characters long.";
    isValid = false;
  }

  return isValid;
}
