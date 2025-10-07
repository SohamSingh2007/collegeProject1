import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, orderBy, query } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// --- Firebase Config (same as before) ---
const firebaseConfig = {
  apiKey: "AIzaSyC64IVQh13WplDDX-clQ1RjaUg_X1MJvcE",
  authDomain: "fieldproject-21f1d.firebaseapp.com",
  projectId: "fieldproject-21f1d",
  storageBucket: "fieldproject-21f1d.firebasestorage.app",
  messagingSenderId: "211444513819",
  appId: "1:211444513819:web:28b909dc140cac64944cbe"
};

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Select Table Body ---
const complaintsBody = document.getElementById("complaintsBody");

// --- Real-time Listener for Firestore ---
const q = query(collection(db, "complain"), orderBy("createdAt", "desc"));
onSnapshot(q, (snapshot) => {
  complaintsBody.innerHTML = ""; // Clear existing rows

  if (snapshot.empty) {
    complaintsBody.innerHTML = `<tr><td colspan="6" class="loading">No complaints found.</td></tr>`;
    return;
  }

  snapshot.forEach((doc) => {
    const data = doc.data();
    const date = data.dateOfIncident?.toDate ? data.dateOfIncident.toDate() : new Date(data.dateOfIncident);
    const formattedDate = date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${data.Name || "N/A"}</td>
      <td>${data.Email || "N/A"}</td>
      <td>${data.subject || "N/A"}</td>
      <td>${formattedDate}</td>
      <td>${data.details || ""}</td>
      <td>${data.type || ""}</td>
    `;
    complaintsBody.appendChild(row);
  });
});