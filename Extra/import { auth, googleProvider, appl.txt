import { auth, googleProvider, appleProvider } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  fetchSignInMethodsForEmail
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// ---------- EMAIL/PASSWORD SIGNUP ----------
const signupForm = document.getElementById("signup-form");
signupForm?.querySelector(".submit-button")?.addEventListener("click", async (e) => {
  e.preventDefault();
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;

  if (!name || !email || !password) return alert("Please fill all fields");

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    alert("Signup successful!");
    window.location.href = "authentication.html";
  } catch (error) {
    alert(error.message);
  }
});

// ---------- EMAIL/PASSWORD LOGIN ----------
const loginForm = document.getElementById("login-form");
loginForm?.querySelector(".submit-button")?.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  if (!email || !password) return alert("Please enter email and password");

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful!");
    window.location.href = "index.html";
  } catch (error) {
    alert(error.message);
  }
});

// ---------- GOOGLE SIGNUP & LOGIN ----------
async function handleGoogleAuth(isSignup) {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const methods = await fetchSignInMethodsForEmail(auth, user.email);

    if (isSignup) {
      if (methods.includes("google.com")) {
        alert("You already have an account. Please login instead.");
        await auth.signOut();
        return;
      }
      alert("Signup with Google successful!");
    } else {
      if (!methods.includes("google.com")) {
        alert("No account found with this Google email. Please sign up first.");
        await auth.signOut();
        return;
      }
      alert("Login with Google successful!");
    }
    window.location.href = "index.html";
  } catch (error) {
    alert(error.message);
  }
}

document.getElementById("google-login")?.addEventListener("click", (e) => { e.preventDefault(); handleGoogleAuth(false); });
document.getElementById("google-login-signup")?.addEventListener("click", (e) => { e.preventDefault(); handleGoogleAuth(true); });

// ---------- APPLE SIGNUP & LOGIN ----------
async function handleAppleAuth(isSignup) {
  try {
    const result = await signInWithPopup(auth, appleProvider);
    const user = result.user;

    const methods = await fetchSignInMethodsForEmail(auth, user.email);

    if (isSignup) {
      if (methods.includes("apple.com")) {
        alert("You already have an account. Please login instead.");
        await auth.signOut();
        return;
      }
      alert("Signup with Apple successful!");
    } else {
      if (!methods.includes("apple.com")) {
        alert("No account found with this Apple email. Please sign up first.");
        await auth.signOut();
        return;
      }
      alert("Login with Apple successful!");
    }

    window.location.href = "index.html";
  } catch (error) {
    alert(error.message);
  }
}

document.getElementById("apple-login")?.addEventListener("click", (e) => { e.preventDefault(); handleAppleAuth(false); });
document.getElementById("apple-login-signup")?.addEventListener("click", (e) => { e.preventDefault(); handleAppleAuth(true); });

// ---------- FORGOT PASSWORD ----------
const forgotForm = document.getElementById("forgot-password-form");
forgotForm?.querySelector(".submit-button")?.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.getElementById("forgot-email").value.trim();
  if (!email) return alert("Enter your email");

  try {
    await sendPasswordResetEmail(auth, email);

    // Show modal instead of alert
    document.getElementById("successModal").style.display = "flex";
    document.querySelector("#successModal p").textContent = `Password reset link has been sent to ${email}.`;

  } catch (error) {
    alert(error.message);
  }
});

// ---------- PASSWORD MODAL HANDLERS ----------
window.showSuccessModal = function() {
  document.getElementById("successModal").style.display = "flex";
};

window.closeModal = function() {
  document.getElementById("successModal").style.display = "none";
  window.location.href = "authentication.html";
};