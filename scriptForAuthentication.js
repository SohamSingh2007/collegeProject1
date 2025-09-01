const forms = document.querySelectorAll(".form");
const emailTimeouts = {};

function hideAllForms() {
    forms.forEach((form) => {
    form.style.display = "none";
    });
}


// go to login page
function showLogin() {
    hideAllForms();
    document.getElementById("login-form").style.display = "block";
}


// go to signup page
function showSignup() {
    hideAllForms();
    document.getElementById("signup-form").style.display = "block";
}


// go to forgot password page
function showForgotPassword() {
    hideAllForms();
    document.getElementById("forgot-password-form").style.display = "block";
}


// check the email is valid or not
function validateEmail(id) {
    const emailInput = document.getElementById(id);
    const warningMsg = document.getElementById(id + "-warning");
    const checkIcon = document.getElementById(id + "-check");

    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|net|in)$/;

    if (emailInput.value.trim() === "") {
    warningMsg.style.display = "none";
    checkIcon.style.display = "none";
    return;
    }

    if (emailRegex.test(emailInput.value)) {
    warningMsg.style.display = "none";
    checkIcon.style.display = "block";
    } else {
    warningMsg.innerText = "⚠ Please enter a valid email address.";
    warningMsg.style.display = "block";
    checkIcon.style.display = "none";
    }
}


//show error when email is not valid
function debouncedValidateEmail(id) {
    clearTimeout(emailTimeouts[id]);
    emailTimeouts[id] = setTimeout(() => {
    validateEmail(id);
    }, 500);
}

function handleEmailInput(id) {
    const warningMsg = document.getElementById(id + "-warning");
    const checkIcon = document.getElementById(id + "-check");

    warningMsg.style.display = "none";
    checkIcon.style.display = "none";

    debouncedValidateEmail(id);
}


// password show and hide
function togglePasswordVisibility(inputId, iconElement) {
    const input = document.getElementById(inputId);

    if (input.type === "password") {
        input.type = "text";
        iconElement.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
    } else {
        input.type = "password";
        iconElement.innerHTML = '<i class="fa-solid fa-eye"></i>';
    }
}


// change the color of the button when all details are filled
function checkFormFilled(formId) {
  const form = document.getElementById(formId);
  const button = form.querySelector(".submit-button");
  const inputs = form.querySelectorAll("input");

  let allFilled = true;
  inputs.forEach(input => {
    if (input.type !== "hidden" && input.value.trim() === "") {
      allFilled = false;
    }
  });

  // Change button style using JS
  if (allFilled) {
    button.style.backgroundColor = "white";
    button.style.cursor = "pointer";
    button.style.color = "black";
  } else {
    button.style.backgroundColor = "gray";
    button.style.cursor = "not-allowed";
    button.style.color = "white";
  }
}

// Attach event listener to all inputs
document.querySelectorAll(".form input").forEach(input => {
  input.addEventListener("input", () => {
    checkFormFilled("login-form");
    checkFormFilled("signup-form");
    checkFormFilled("forgot-password-form");
  });
});