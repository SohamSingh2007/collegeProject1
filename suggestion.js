document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('feedbackForm');
    const successMessage = document.getElementById('successMessage');
    const closeSuccessMessageBtn = document.getElementById('closeSuccessMessage');
    const starRatingContainer = document.getElementById('starRating');
    const stars = starRatingContainer.querySelectorAll('.fa-star');
    const ratingValueInput = document.getElementById('ratingValue');

    // --- Star Rating Logic ---
    let currentRating = 0;

    // Function to update star colors based on rating
    const updateStars = (rating) => {
        stars.forEach(star => {
            if (parseInt(star.dataset.value) <= rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    };

    // Handle star click
    starRatingContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('fa-star')) {
            currentRating = parseInt(e.target.dataset.value);
            ratingValueInput.value = currentRating;
            updateStars(currentRating);
        }
    });

    // Handle mouse over
    starRatingContainer.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('fa-star')) {
            const hoverRating = parseInt(e.target.dataset.value);
            updateStars(hoverRating);
        }
    });

    // Handle mouse out
    starRatingContainer.addEventListener('mouseout', () => {
        updateStars(currentRating); // Revert to the selected rating
    });


    // --- Form Submission Logic ---
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default browser submission

        // Basic validation
        const message = document.getElementById('message');
        let isValid = true;

        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));

        if (message.value.trim() === '') {
            showError(message, 'Feedback message cannot be empty.');
            isValid = false;
        }
        if (ratingValueInput.value === '0') {
            showError(starRatingContainer, 'Please provide a rating.');
            isValid = false;
        }

        if (isValid) {
            // In a real application, you would send this data to a server
            // using fetch() or another method.
            console.log('Form Submitted Successfully!');
            console.log({
                type: document.getElementById('feedbackType').value,
                rating: ratingValueInput.value,
                message: message.value
            });

            // Show success message
            successMessage.classList.remove('hidden');
            form.reset();
            currentRating = 0;
            ratingValueInput.value = '0';
            updateStars(0);
        }
    });

    // Function to display error messages
    function showError(field, message) {
        field.classList.add('has-error');
        const error = document.createElement('p');
        error.className = 'error-message';
        error.textContent = message;
        // For star rating, place error after the container
        if (field.id === 'starRating') {
            field.parentNode.appendChild(error);
        } else {
            field.parentNode.insertBefore(error, field.nextSibling);
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