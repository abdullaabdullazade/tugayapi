const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.login");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
const signupLink = document.querySelector("form .signup-link a");
const BASE_URL = "http://localhost:3000";

signupBtn.onclick = () => {
  loginForm.style.marginLeft = "-50%";
  loginText.style.marginLeft = "-50%";
};
loginBtn.onclick = () => {
  loginForm.style.marginLeft = "0%";
  loginText.style.marginLeft = "0%";
};
signupLink.onclick = () => {
  signupBtn.click();
  return false;
};

const login = () => {
  const passwordInput = loginForm.querySelector("input[type='password']");
  const email = document.querySelector("input[type='text']");
  if (!passwordInput) {
    console.error("Password input not found");
    return;
  }

  const data = {
    email: email.value,
    password: passwordInput.value,
  };

  console.log(data)

  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", `Bearer secret_key`);

  fetch(BASE_URL + "/login", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Server Response:", data);
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
};

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  login();
});
