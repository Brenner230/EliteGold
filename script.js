// === NAVIGATION LOGIC ===
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

// === INTERACTIVE CATALOGUE LOGIC ===
const btnVillas = document.getElementById('btn-villas');
const btnSuites = document.getElementById('btn-suites');
const catalogueVillas = document.getElementById('villas-catalogue');
const catalogueSuites = document.getElementById('suites-catalogue');

function switchCategory(showVillas) {
    if (showVillas) {
        btnVillas.classList.add('active');
        btnSuites.classList.remove('active');
        catalogueVillas.classList.add('active');
        catalogueSuites.classList.remove('active');
    } else {
        btnSuites.classList.add('active');
        btnVillas.classList.remove('active');
        catalogueSuites.classList.add('active');
        catalogueVillas.classList.remove('active');
    }
}

btnVillas.addEventListener('click', () => switchCategory(true));
btnSuites.addEventListener('click', () => switchCategory(false));

function setupCatalogue(containerId, imageId, titleId, bedsId, descId) {
    const container = document.getElementById(containerId);
    const items = container.querySelectorAll('.catalogue-item');
    const displayImg = document.getElementById(imageId);
    const displayTitle = document.getElementById(titleId);
    const displayBeds = document.getElementById(bedsId);
    const displayDesc = document.getElementById(descId);

    items.forEach(item => {
        item.addEventListener('click', () => {
            items.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            displayImg.style.backgroundImage = `url('${item.getAttribute('data-image')}')`;
            displayTitle.innerText = item.getAttribute('data-title');
            displayBeds.innerText = item.getAttribute('data-beds');
            displayDesc.innerText = item.getAttribute('data-desc');
        });
    });
}

setupCatalogue('villas-catalogue', 'villas-image', 'villas-title', 'villas-beds', 'villas-desc');
setupCatalogue('suites-catalogue', 'suites-image', 'suites-title', 'suites-beds', 'suites-desc');


// === FORM VALIDATION AND DYNAMIC BEDROOMS ===
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

// Define exactly what is available at each property
const villaInventories = {
    "The Cliff Villas": [6, 7],
    "The Crown Villas": [3, 4, 5, 6, 7],
    "The Royal Villas": [3, 4, 5, 6, 7],
    "Villa Park": [4, 5, 6]
};

// 1. Set minimum date to 7 days from today
const today = new Date();
const minDate = new Date(today);
minDate.setDate(today.getDate() + 7);
const minDateStr = minDate.toISOString().split('T')[0];

checkInInput.min = minDateStr;
checkInInput.addEventListener('change', () => {
    checkOutInput.min = checkInInput.value;
});

// 2. Dynamic Bedroom Dropdown based on Villa Selection
accommodationSelect.addEventListener('change', (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const groupLabel = selectedOption.parentNode.label;
    const villaName = selectedOption.value;
    
    // Clear out existing options
    bedroomSelect.innerHTML = '<option value="" disabled selected>Number of Bedrooms Required</option>';

    if (groupLabel === "Villas" && villaInventories[villaName]) {
        bedroomField.style.display = 'block';
        bedroomSelect.required = true;
        
        // Loop through the specific villa's inventory and build the dropdown options
        villaInventories[villaName].forEach(bedCount => {
            const maxGuests = bedCount * 2;
            const newOption = document.createElement('option');
            newOption.value = bedCount;
            newOption.innerText = `${bedCount}-Bedroom Villa (${maxGuests} people)`;
            bedroomSelect.appendChild(newOption);
        });
    } else {
        bedroomField.style.display = 'none';
        bedroomSelect.required = false;
    }
});

// 3. AJAX Submission with Formspree
inquiryForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Final Capacity Validation check
    if (bedroomField.style.display === 'block') {
        const beds = parseInt(bedroomSelect.value);
        const guests = parseInt(travelersInput.value);
        if (guests > (beds * 2)) {
            alert(`Capacity limit exceeded. A ${beds}-bedroom villa accommodates a maximum of ${beds * 2} guests.`);
            return;
        }
    }

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