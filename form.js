// Import Firebase (for browser use)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyC64IVQh13WplDDX-clQ1RjaUg_X1MJvcE",
  authDomain: "fieldproject-21f1d.firebaseapp.com",
  projectId: "fieldproject-21f1d",
  storageBucket: "fieldproject-21f1d.firebasestorage.app",
  messagingSenderId: "211444513819",
  appId: "1:211444513819:web:28b909dc140cac64944cbe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- DOM Ready ---
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('complaintForm');
  const successMessage = document.getElementById('successMessage');
  const closeSuccessMessageBtn = document.getElementById('closeSuccessMessage');
  const anonymousCheckbox = document.getElementById('anonymousCheckbox');
  const personalInfoSection = document.getElementById('personalInfoSection');

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const incidentDateInput = document.getElementById('incidentDate');
  const detailsInput = document.getElementById('details');
  const fieldsToValidate = [nameInput, emailInput, subjectInput, incidentDateInput, detailsInput];

  // --- Anonymous Toggle ---
  anonymousCheckbox.addEventListener('change', function () {
    if (this.checked) {
      personalInfoSection.classList.add('hidden');
      nameInput.value = '';
      emailInput.value = '';
      clearError(nameInput);
      clearError(emailInput);
    } else {
      personalInfoSection.classList.remove('hidden');
    }
  });

  // --- Real-time Error Clearing ---
  fieldsToValidate.forEach(field => {
    field.addEventListener('input', () => {
      if (field.value.trim() !== '') {
        clearError(field);
      }
    });
  });

  // --- Form Submit ---
  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    let isValid = true;
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));

    // Validation
    if (!anonymousCheckbox.checked) {
      if (nameInput.value.trim() === '') {
        showError(nameInput, 'Full name is required.');
        isValid = false;
      }
      if (emailInput.value.trim() === '' || !/^\S+@\S+\.\S+$/.test(emailInput.value)) {
        showError(emailInput, 'A valid email address is required.');
        isValid = false;
      }
    }

    if (subjectInput.value.trim() === '') {
      showError(subjectInput, 'Subject is required.');
      isValid = false;
    }
    if (incidentDateInput.value === '') {
      showError(incidentDateInput, 'Please select the date of the incident.');
      isValid = false;
    }
    if (detailsInput.value.trim() === '') {
      showError(detailsInput, 'Please provide details about your complaint.');
      isValid = false;
    }

    if (!isValid) return;

    // --- Prepare Data ---
    const formData = {
      Email: anonymousCheckbox.checked ? "Anonymous" : emailInput.value,
      Name: anonymousCheckbox.checked ? "Anonymous" : nameInput.value,
      subject: subjectInput.value,
      dateOfIncident: new Date(incidentDateInput.value),
      details: detailsInput.value,
      type: anonymousCheckbox.checked ? "anonymous" : "normal",
      createdAt: serverTimestamp()
    };

    try {
      // --- Store in Firestore ---
      await addDoc(collection(db, "complain"), formData);
      console.log("Complaint stored successfully:", formData);

      // Show Success Message
      successMessage.classList.remove('hidden');
      form.reset();
      personalInfoSection.classList.remove('hidden');
    } catch (error) {
      console.error("Error adding complaint:", error);
      alert("Error submitting complaint. Try again later.");
    }
  });

  // --- Error Handling Helpers ---
  function showError(field, message) {
    field.classList.add('has-error');
    const error = document.createElement('p');
    error.className = 'error-message';
    error.textContent = message;
    field.parentNode.appendChild(error);
  }

  function clearError(field) {
    field.classList.remove('has-error');
    const error = field.parentNode.querySelector('.error-message');
    if (error) error.remove();
  }

  // --- Modal Close ---
  closeSuccessMessageBtn.addEventListener('click', function () {
    successMessage.classList.add('hidden');
  });

  successMessage.addEventListener('click', function (e) {
    if (e.target === successMessage) {
      successMessage.classList.add('hidden');
    }
  });
});

const dateInput = document.getElementById("incidentDate");

  // Open calendar popup when clicking anywhere in the input field
  dateInput.addEventListener("click", () => {
    dateInput.showPicker(); // built-in browser method
  });

  // (Optional) Also open when input gets focus (e.g. via Tab key)
  dateInput.addEventListener("focus", () => {
    dateInput.showPicker();
  });

  dateInput.addEventListener("focus", () => dateInput.showPicker());