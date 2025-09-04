import { auth, googleProvider, appleProvider, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// ---------- SAVE USER DATA ----------
async function saveUserData(user, name = null, isSignup = false) {
  const userRef = doc(db, "users", user.uid);

  if (isSignup) {
    await setDoc(userRef, {
      uid: user.uid,
      name: name || user.displayName || "",
      email: user.email,
      provider: user.providerData[0]?.providerId || "email",
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });
  } else {
    await updateDoc(userRef, {
      lastLogin: serverTimestamp(),
    });
  }
}

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
    await saveUserData(userCredential.user, name, true);

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
    const result = await signInWithEmailAndPassword(auth, email, password);
    await saveUserData(result.user, null, false);

    alert("Login successful!");
    window.location.href = "index.html";
  } catch (error) {
    alert(error.message);
  }
});

// ---------- GOOGLE SIGNUP ----------
async function handleGoogleSignup() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      alert("Account already exists. Please login instead.");
      window.location.href = "authentication.html";
      return;
    }

    await saveUserData(user, user.displayName, true);
    alert("Signup with Google successful!");
    window.location.href = "index.html";
  } catch (error) {
    alert(error.message);
  }
}

// ---------- GOOGLE LOGIN ----------
async function handleGoogleLogin() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("This Google account is not registered. Please sign up first.");
      return;
    }

    await saveUserData(user, null, false);
    alert("Login with Google successful!");
    window.location.href = "index.html";
  } catch (error) {
    alert(error.message);
  }
}

document.getElementById("google-login")?.addEventListener("click", (e) => { 
  e.preventDefault(); 
  handleGoogleLogin(); 
});

document.getElementById("google-login-signup")?.addEventListener("click", (e) => { 
  e.preventDefault(); 
  handleGoogleSignup(); 
});

// ---------- FORGOT PASSWORD ----------
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const forgotForm = document.getElementById("forgot-password-form");
forgotForm?.querySelector(".submit-button")?.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.getElementById("forgot-email").value.trim();
  if (!email) return alert("Enter your email");

  try {
    // 🔍 Check if email exists in Firestore
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      alert("This email is not registered in our system.");
      return;
    }

    // ✅ Email exists, send reset link
    await sendPasswordResetEmail(auth, email);
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