// Navigation Interactivity
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

// Form Logic and Elements
const inquiryForm = document.getElementById('inquiryForm');
const checkInInput = document.getElementById('checkIn');
const checkOutInput = document.getElementById('checkOut');
const accommodationSelect = document.getElementById('accommodation');
const bedroomField = document.getElementById('bedroomField');
const bedroomSelect = document.getElementById('bedrooms');
const travelersInput = document.getElementById('travelers');
const submitBtn = document.getElementById('submit-btn');
const successMsg = document.getElementById('success-message');
const formInstruction = document.getElementById('form-instruction');

// 1. Set minimum date to 7 days from today (March 27, 2026)
const today = new Date();
const minDate = new Date(today);
minDate.setDate(today.getDate() + 7);
const minDateStr = minDate.toISOString().split('T')[0];

checkInInput.min = minDateStr;
checkInInput.addEventListener('change', () => {
    checkOutInput.min = checkInInput.value; // Checkout must be after check-in
});

// 2. Show/Hide Bedrooms specifically for "Villas"
accommodationSelect.addEventListener('change', (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const groupLabel = selectedOption.parentNode.label;
    
    if (groupLabel === "Villas") {
        bedroomField.style.display = 'block';
        bedroomSelect.required = true;
    } else {
        bedroomField.style.display = 'none';
        bedroomSelect.required = false;
        bedroomSelect.value = "";
    }
});

// 3. AJAX Submission with Formspree
inquiryForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Capacity Validation (Max 2 per bedroom)
    if (bedroomField.style.display === 'block') {
        const beds = parseInt(bedroomSelect.value);
        const guests = parseInt(travelersInput.value);
        if (guests > (beds * 2)) {
            alert(`Capacity limit exceeded. A ${beds}-bedroom villa accommodates a maximum of ${beds * 2} guests.`);
            return;
        }
    }

    // Submit via AJAX
    submitBtn.innerText = "SENDING...";
    submitBtn.disabled = true;

    const formData = new FormData(inquiryForm);

    try {
        const response = await fetch(inquiryForm.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            // Success! Hide form and show success message
            inquiryForm.style.display = "none";
            formInstruction.style.display = "none";
            successMsg.style.display = "block";
            window.scrollTo({ top: successMsg.offsetTop - 150, behavior: 'smooth' });
        } else {
            alert("Oops! There was a problem submitting your inquiry. Please try again.");
            submitBtn.innerText = "SUBMIT INQUIRY";
            submitBtn.disabled = false;
        }
    } catch (error) {
        alert("Connectivity issue. Please check your internet and try again.");
        submitBtn.innerText = "SUBMIT INQUIRY";
        submitBtn.disabled = false;
    }
});