// ✅ Firebase imports
import { auth } from "./firebase.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const logoutBtn = document.querySelector(".logout");
const loginBtn = document.querySelector(".login");

// ✅ Create toast function
function showToast(message, isError = false) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.fontFamily = "Arial";
  toast.display = "flex";
  toast.style.position = "fixed";
  toast.style.top = "100px";
  toast.style.right = "21px";
  toast.style.padding = "12px 18px";
  toast.style.background = isError ? "#ff4d4d" : "#4CAF50";
  toast.style.color = "#fff";
  toast.style.fontSize = "20px";
  toast.style.fontWeight = "600";
  toast.style.borderRadius = "8px";
  toast.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
  toast.style.zIndex = "9999";
  toast.style.opacity = "0";
  toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
  toast.style.transform = "translateX(20px)";

  document.body.appendChild(toast);

  // 🔥 Animate in
  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(0)";
  }, 50);

  // ⏳ Remove after 2s
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(20px)";
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// ✅ Auto check user state
onAuthStateChanged(auth, (user) => {
  if (user) {
    if (loginBtn) loginBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "flex";
  } else {
    if (loginBtn) loginBtn.style.display = "flex";
    if (logoutBtn) logoutBtn.style.display = "none";
  }
});

// ✅ Logout button handler
if (logoutBtn) {
  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      showToast("Logged out successfully");
      setTimeout(() => {
        // window.location.href = "authentication.html";
      }, 1500);
    } catch (err) {
      showToast("Logout failed. Try again.", true);
    }
  });
}