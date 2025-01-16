const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.login");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
const signForm = document.querySelector("form.signup");

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
  const email = loginForm.querySelector("input[type='text']");
  if (!passwordInput) {
    console.error("Password input not found");
    return;
  }

  const data = {
    email: email.value,
    password: passwordInput.value,
  };

  console.log(data);

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  fetch(BASE_URL + "/login", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      location.reload();

      console.log("Login Response:", data);
    })
    .catch((error) => {
      console.error("Login Error:", error.message);
    });
};

const signup = () => {
  console.log("signup", signForm);
  const passwordInput = signForm.querySelector("input[type='password']");
  const email = signForm.querySelector("input[type='text']");
  const confirmPassword = signForm.querySelector(
    "input[type='password']:nth-of-type(1)"
  );
  console.log(passwordInput, confirmPassword, email);

  if (passwordInput != confirmPassword) return;

  console.log(confirmPassword);
  const data = {
    email: email.value,
    password: passwordInput.value,
  };

  console.log(data);

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  fetch(BASE_URL + "/signup", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        console.log(`HTTP error! Status: ${response.status}`);
      }
      //return response.json();
    })
    .then((data) => {
      console.log("Signup Response:", data);
      alert("register oldun kisi")
      location.reload();
    })
    .catch((error) => {
      console.error("Signup Error:", error.message);
    });
};

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const isLoginForm =
    loginForm.querySelector("button[type='submit']").textContent === "Login";
  if (isLoginForm) {
    login();
  } else {
    signup();
  }
});
