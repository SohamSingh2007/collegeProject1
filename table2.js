import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, collection, doc, getDoc, getDocs, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC64IVQh13WplDDX-clQ1RjaUg_X1MJvcE",
  authDomain: "fieldproject-21f1d.firebaseapp.com",
  projectId: "fieldproject-21f1d",
  storageBucket: "fieldproject-21f1d.appspot.com",
  messagingSenderId: "211444513819",
  appId: "1:211444513819:web:28b909dc140cac64944cbe"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const adminKeyInput = document.getElementById("adminKeyInput");
const adminSubmit = document.getElementById("adminSubmit");
const message = document.getElementById("message");
const userTable = document.getElementById("userTable");
const userTableBody = document.getElementById("userTableBody");

let editUserId = null;

// 1️⃣ Admin key verification
adminSubmit.addEventListener("click", async () => {
  const key = adminKeyInput.value;
  if(!key){ message.innerText="Enter key"; message.style.color="red"; return; }

  try {
    const adminDocSnap = await getDoc(doc(db,"config","admin"));
    if(adminDocSnap.exists() && key === adminDocSnap.data().key){
      message.innerText="Access Granted";
      message.style.color="limegreen";
      sessionStorage.setItem("isAdmin","true");
      loadUsers();
    } else {
      message.innerText="Access Denied";
      message.style.color="red";
    }
  } catch(err){
    console.error(err);
    message.innerText="Error verifying key";
    message.style.color="red";
  }
});

// 2️⃣ Load users
async function loadUsers(){
  userTable.classList.remove("hidden");
  const usersCol = collection(db,"users");
  const snapshot = await getDocs(usersCol);
  userTableBody.innerHTML = "";
  if(snapshot.empty){
    userTableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No users found</td></tr>';
    return;
  }

  let srNo = 1;
  snapshot.forEach(docSnap=>{
    const data = docSnap.data();
    const lastLogin = data.lastLogin?.toDate ? data.lastLogin.toDate().toLocaleString() : "N/A";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${srNo++}</td>
      <td>${data.name || "N/A"}</td>
      <td>${data.email || "N/A"}</td>
      <td>${lastLogin}</td>
      <td>${data.provider || "N/A"}</td>
      <td>
        <button class="edit-btn" data-id="${docSnap.id}">Edit</button>
        <button class="delete-btn" data-id="${docSnap.id}">Delete</button>
      </td>
    `;
    userTableBody.appendChild(tr);
  });
}

// 3️⃣ Table button actions
userTableBody.addEventListener("click", async (e)=>{
  const btn = e.target.closest("button");
  if(!btn) return;

  const id = btn.dataset.id;
  if(btn.classList.contains("delete-btn")){
    if(confirm("Delete this user?")) await deleteDoc(doc(db,"users",id));
    loadUsers();
  }

  if(btn.classList.contains("edit-btn")){
    editUserId = id;
    const docSnap = await getDoc(doc(db,"users",id));
    if(docSnap.exists()){
      document.getElementById("editName").value = docSnap.data().name || "";
      document.getElementById("editEmail").value = docSnap.data().email || "";
      document.getElementById("editModal").classList.remove("hidden");
    }
  }
});

// 4️⃣ Edit modal
document.getElementById("cancelEdit").addEventListener("click", ()=>{
  document.getElementById("editModal").classList.add("hidden");
  editUserId = null;
});

document.getElementById("saveEdit").addEventListener("click", async ()=>{
  if(!editUserId) return;
  const name = document.getElementById("editName").value;
  const email = document.getElementById("editEmail").value;
  if(!name || !email) return alert("Fill both fields");
  await updateDoc(doc(db,"users",editUserId), { name, email });
  document.getElementById("editModal").classList.add("hidden");
  editUserId=null;
  loadUsers();
});
