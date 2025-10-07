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

// ✅ Protect admin page
if (!sessionStorage.getItem("isAdmin")) {
  window.location.replace("adminKey.html"); 
}

/* ------------------- Dropdown ------------------- */
const dropdownBtn = document.getElementById("dropdownBtn");
const dropdownMenu = document.getElementById("dropdownMenu");

dropdownBtn.addEventListener("click", () => {
  dropdownMenu.style.display = dropdownMenu.style.display === "flex" ? "none" : "flex";
});

/* ------------------- Modal (Change Key) ------------------- */
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

/* ------------------- Logout ------------------- */
document.getElementById("logoutBtn").addEventListener("click", () => {
  sessionStorage.removeItem("isAdmin"); 
  window.location.replace("index.html");
});

/* ------------------- SPA Loader ------------------- */
async function loadPage(page) {
  try {
    const response = await fetch(`${page}.html`);
    const data = await response.text();
    document.getElementById("content").innerHTML = data;

    // Highlight active link
    document.querySelectorAll(".sidebar nav a").forEach(link => {
      link.classList.remove("active");
      if (link.dataset.route === page) {
        link.classList.add("active");
      }
    });

  } catch (error) {
    document.getElementById("content").innerHTML = "<h2>Page not found</h2>";
  }
}

function handleRoute() {
  const hash = window.location.hash.substring(1) || "dashboard"; 
  loadPage(hash);
}

window.addEventListener("hashchange", handleRoute);
window.addEventListener("load", handleRoute);

/* ------------------- Prevent cache/back ------------------- */
window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    sessionStorage.removeItem("isAdmin");
    window.location.replace("adminKey.html");
  }
});


if (!sessionStorage.getItem("isAdmin")) {
  window.location.replace("adminKey.html");
  throw new Error("Access denied");
}





// adminPage.js

async function loadUserTable() {
  const userTableBody = document.getElementById('userTableBody');
  // Firebase initialization
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  signInAnonymously(auth).catch(console.error);

  onAuthStateChanged(auth, user => {
    if (!user) return;
    const usersCollection = collection(db, "users");

    onSnapshot(usersCollection, snapshot => {
      const loading = document.getElementById('loadingState');
      if (loading) loading.remove();

      userTableBody.innerHTML = '';
      if (snapshot.empty) {
        userTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--gray-400);">No users found.</td></tr>`;
        return;
      }

      let srNo = 1;
      snapshot.docs.forEach(docSnap => {
        const userData = docSnap.data();
        const lastLogin = userData.lastLogin?.toDate ? userData.lastLogin.toDate().toLocaleString() : 'N/A';
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${srNo++}</td>
          <td>${userData.name || 'N/A'}</td>
          <td>${userData.email || 'N/A'}</td>
          <td>${lastLogin}</td>
          <td>${userData.provider || 'N/A'}</td>
          <td>
            <div class="actions-cell">
              <button data-id="${docSnap.id}" class="edit-btn">Edit</button>
              <button data-id="${docSnap.id}" class="delete-btn">Delete</button>
            </div>
          </td>`;
        userTableBody.appendChild(tr);
      });
    });
  });
}

// After injecting table.html
loadUserTable();
