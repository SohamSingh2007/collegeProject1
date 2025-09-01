
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('complaintForm');
    const successMessage = document.getElementById('successMessage');
    const closeSuccessMessageBtn = document.getElementById('closeSuccessMessage');
    const anonymousCheckbox = document.getElementById('anonymousCheckbox');
    const personalInfoSection = document.getElementById('personalInfoSection');

    // --- Get all form fields that need validation ---
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const incidentDateInput = document.getElementById('incidentDate');
    const detailsInput = document.getElementById('details');
    const fieldsToValidate = [nameInput, emailInput, subjectInput, incidentDateInput, detailsInput];

    // --- Anonymous Toggle Logic ---
    anonymousCheckbox.addEventListener('change', function () {
        if (this.checked) {
            personalInfoSection.classList.add('hidden');
            // Clear values and any existing errors when hiding
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
            // Check if there's content to clear the error
            if (field.value.trim() !== '') {
                clearError(field);
            }
        });
    });

    // --- Form Submission Logic ---
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default browser submission

        let isValid = true;

        // Clear all previous errors
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));

        // Validation checks
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

        if (isValid) {
            // In a real application, you would send this data to a server
            console.log('Complaint Form Submitted Successfully!');
            const formData = {
                isAnonymous: anonymousCheckbox.checked,
                name: anonymousCheckbox.checked ? 'Anonymous' : nameInput.value,
                email: anonymousCheckbox.checked ? 'Anonymous' : emailInput.value,
                subject: subjectInput.value,
                incidentDate: incidentDateInput.value,
                details: detailsInput.value
            };
            console.log(formData);

            // Show success message
            successMessage.classList.remove('hidden');
            form.reset();
            // Ensure personal info section is visible again after reset
            personalInfoSection.classList.remove('hidden');
        }
    });

    // Function to display error messages
    function showError(field, message) {
        field.classList.add('has-error');
        const error = document.createElement('p');
        error.className = 'error-message';
        error.textContent = message;
        field.parentNode.appendChild(error);
    }

    // Function to clear a single field's error
    function clearError(field) {
        field.classList.remove('has-error');
        const error = field.parentNode.querySelector('.error-message');
        if (error) {
            error.remove();
        }
    }

    // --- Success Message Modal Logic ---
    closeSuccessMessageBtn.addEventListener('click', function () {
        successMessage.classList.add('hidden');
    });

    // Close modal if clicking outside of it
    successMessage.addEventListener('click', function (e) {
        if (e.target === successMessage) {
            successMessage.classList.add('hidden');
        }
    });
});