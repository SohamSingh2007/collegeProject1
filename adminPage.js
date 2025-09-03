import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyC64IVQh13WplDDX-clQ1RjaUg_X1MJvcE",
    authDomain: "fieldproject-21f1d.firebaseapp.com",
    projectId: "fieldproject-21f1d",
    storageBucket: "fieldproject-21f1d.firebasestorage.app",
    messagingSenderId: "211444513819",
    appId: "1:211444513819:web:28b909dc140cac64944cbe"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

if (!sessionStorage.getItem("isAdmin")) {
    window.location.replace("adminKey.html"); 
}

// Dropdown toggle
const dropdownBtn = document.getElementById("dropdownBtn");
const dropdownMenu = document.getElementById("dropdownMenu");
dropdownBtn.addEventListener("click", () => {
    dropdownMenu.style.display = dropdownMenu.style.display === "flex" ? "none" : "flex";
});

// Modal
const modal = document.getElementById("modal");
const changeKeyBtn = document.getElementById("changeKeyBtn");
const saveKeyBtn = document.getElementById("saveKeyBtn");
const status = document.getElementById("status");

changeKeyBtn.addEventListener("click", () => {
    modal.style.display = "flex";
    dropdownMenu.style.display = "none";
});

window.onclick = (e) => {
    if (e.target === modal) {
    modal.style.display = "none";
    status.innerText = "";
    }
};

saveKeyBtn.addEventListener("click", async () => {
    const newKey = document.getElementById("newKey").value;
    if (!newKey) {
    status.style.color = "red";
    status.innerText = "Please enter a key!";
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

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem("isAdmin"); 
    window.location.replace("index.html");
});

// SPA navigation
const mainContent = document.getElementById("mainContent");
const links = document.querySelectorAll('.sidebar nav a[data-page]');
const pages = {
    dashboard: `<h1>Dashboard</h1><p>Dashboard content goes here.</p>`,
    complains: `<h1>Complains</h1><p>All complaints will be shown here.</p>`,
    users: `<h1>Users</h1><p>Manage users from this page.</p>`,
    other: `<h1>Other</h1><p>Other settings or pages.</p>`
};

links.forEach(link => {
    link.addEventListener('click', e => {
    e.preventDefault();
    const page = link.getAttribute('data-page');
    mainContent.innerHTML = pages[page] || `<h1>Page not found</h1>`;
    });
});

// Highlight active sidebar item
const sidebarItems = document.querySelectorAll('.sidebar nav a[data-page], .sidebar nav button');
sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
    sidebarItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    });
});

// Prevent cache/back
window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
    sessionStorage.removeItem("isAdmin");
    window.location.replace("adminKey.html");
    }
});