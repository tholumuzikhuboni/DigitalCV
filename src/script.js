document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');
    const statusDiv = document.getElementById('form-status');
    let statusTimeout; // Variable to hold the timer

    // List of disallowed email domains
    const disallowedDomains = [
        'gmail.com',
        'yahoo.com',
        'outlook.com',
        'hotmail.com',
        'aol.com',
        'icloud.com'
    ];

    async function handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        const email = data.get('email').toLowerCase();
        const domain = email.split('@')[1];

        // --- Email Domain Validation ---
        if (disallowedDomains.includes(domain)) {
            showStatus('Please use a work email address.', 'error');
            return;
        }

        // --- Formspree Submission ---
        try {
            const response = await fetch('https://formspree.io/f/movwjdyv', {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                showStatus('Thanks! I will get back to you soon.', 'success');
                form.reset();
            } else {
                // Handle server-side errors from Formspree
                const responseData = await response.json();
                const errorMessage = responseData.errors ? responseData.errors.map(error => error.message).join(', ') : 'Oops! There was a problem submitting your form.';
                showStatus(errorMessage, 'error');
            }
        } catch (error) {
            // Handle network errors
            showStatus('Network error. Please try again later.', 'error');
        }
    }

    function showStatus(message, type) {
        // Clear any existing timer
        clearTimeout(statusTimeout);

        // Display the new message
        statusDiv.textContent = message;
        statusDiv.className = type;

        // Set a new timer to clear the message after 5 seconds
        statusTimeout = setTimeout(() => {
            statusDiv.textContent = '';
            statusDiv.className = '';
        }, 5000); 
    }

    form.addEventListener('submit', handleSubmit);
});