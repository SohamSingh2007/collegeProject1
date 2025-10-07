import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- Firebase Config ---
const firebaseConfig = {
  apiKey: "AIzaSyC64IVQh13WplDDX-clQ1RjaUg_X1MJvcE",
  authDomain: "fieldproject-21f1d.firebaseapp.com",
  projectId: "fieldproject-21f1d",
  storageBucket: "fieldproject-21f1d.firebasestorage.app",
  messagingSenderId: "211444513819",
  appId: "1:211444513819:web:28b909dc140cac64944cbe",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- DOM Elements ---
const loginModal = document.getElementById("loginModal");
const loginBtn = document.getElementById("loginBtn");
const adminKeyInput = document.getElementById("adminKeyInput");
const errorText = document.getElementById("message");
const navbar = document.getElementById("navbar");
const content = document.getElementById("content");
const toggleEye = document.getElementById("toggleEye");
const refreshBtn = document.getElementById("refreshBtn");

// --- Password Toggle ---
if (toggleEye && adminKeyInput) {
  toggleEye.addEventListener("click", () => {
    if (adminKeyInput.type === "password") {
      adminKeyInput.type = "text";
      toggleEye.classList.replace("fa-eye", "fa-eye-slash");
    } else {
      adminKeyInput.type = "password";
      toggleEye.classList.replace("fa-eye-slash", "fa-eye");
    }
  });
}

// --- Change Key Password Toggle ---
const toggleNewKey = document.getElementById("toggleNewKey");
const newKeyInput = document.getElementById("newKey");
if (toggleNewKey && newKeyInput) {
  toggleNewKey.addEventListener("click", () => {
    if (newKeyInput.type === "password") {
      newKeyInput.type = "text";
      toggleNewKey.classList.replace("fa-eye", "fa-eye-slash");
    } else {
      newKeyInput.type = "password";
      toggleNewKey.classList.replace("fa-eye-slash", "fa-eye");
    }
  });
}

// --- SPA Pages ---
const pages = {
  dashboard: `<iframe src="/complainForm/form.html" style="width:100%;height:calc(100vh - 80px);border:none;"></iframe>`,
  complains: `<iframe src="showComplain.html" style="width:100%;height:calc(100vh - 70px);border:none;"></iframe>`,
  suggestion: `<iframe src="suggestion.html" style="width:100%;height:calc(100vh - 75px);border:none;"></iframe>`,
  users: `<h1>Users</h1><p>Coming soon...</p>`,
};

// --- Load Page Function ---
function loadPage(page) {
  content.innerHTML = pages[page] || "<h2>404 - Page not found</h2>";
  document.querySelectorAll("nav a[data-page]").forEach(link => link.classList.remove("active"));
  const activeLink = document.querySelector(`nav a[data-page="${page}"]`);
  if (activeLink) activeLink.classList.add("active");
  sessionStorage.setItem("currentPage", page); // save current page
}

// --- Nav Link Clicks ---
document.querySelectorAll("nav a[data-page]").forEach(link => {
  link.addEventListener("click", () => loadPage(link.getAttribute("data-page")));
});

// --- Show Dashboard ---
function showDashboard() {
  loginModal.style.display = "none";
  navbar.style.display = "flex";

  const savedPage = sessionStorage.getItem("currentPage") || "dashboard";
  loadPage(savedPage);
}

// --- Login Check ---
if (sessionStorage.getItem("adminAuth") === "true") {
  showDashboard();
} else {
  loginModal.style.display = "flex";
}

// --- Login Button ---
loginBtn.addEventListener("click", async () => {
  const inputKey = adminKeyInput.value.trim();
  if (!inputKey) return (errorText.innerText = "Please enter the admin key.");

  try {
    const docRef = doc(db, "config", "admin");
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists() || docSnap.data().key !== inputKey) {
      errorText.innerText = "Incorrect key! Access denied.";
      return;
    }

    sessionStorage.setItem("adminAuth", "true");
    errorText.innerText = "";
    showDashboard();
  } catch (err) {
    console.error(err);
    errorText.innerText = "Error validating key.";
  }
});

// --- Logout ---
document.getElementById("logoutBtn").addEventListener("click", () => {
  sessionStorage.removeItem("adminAuth");
  sessionStorage.removeItem("currentPage");
  location.reload();
});

// --- Settings Dropdown & Change Key ---
const settingsBtn = document.getElementById("settingsBtn");
const dropdownMenu = document.getElementById("dropdownMenu");
const modal = document.getElementById("modal");
const changeKeyBtn = document.getElementById("changeKeyBtn");
const saveKeyBtn = document.getElementById("saveKeyBtn");
const status = document.getElementById("status");

settingsBtn.addEventListener("click", () => {
  dropdownMenu.style.display = dropdownMenu.style.display === "flex" ? "none" : "flex";
});

changeKeyBtn.addEventListener("click", () => {
  modal.style.display = "flex";
  dropdownMenu.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    status.innerText = "";
  }
});

saveKeyBtn.addEventListener("click", async () => {
  const newKey = document.getElementById("newKey").value.trim();
  if (!newKey) {
    status.style.color = "red";
    status.innerText = "Please enter a new key!";
    return;
  }

  try {
    const docRef = doc(db, "config", "admin");
    await updateDoc(docRef, { key: newKey });
    status.style.color = "green";
    status.innerText = "✅ Key updated successfully!";
  } catch (error) {
    console.error(error);
    status.style.color = "red";
    status.innerText = "❌ Error updating key!";
  }
});

// --- Refresh Button ---
if (refreshBtn) {
  refreshBtn.addEventListener("click", () => {
    const currentPage = sessionStorage.getItem("currentPage") || "dashboard";
    loadPage(currentPage);
  });
}

// --- Back/Forward Navigation ---
window.addEventListener("pageshow", () => {
  if (performance.getEntriesByType("navigation")[0]?.type === "back_forward") {
    sessionStorage.removeItem("adminAuth");
    sessionStorage.removeItem("currentPage");
    location.reload();
  }
});