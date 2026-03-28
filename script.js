// === NAVIGATION LOGIC ===
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-menu a');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
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

const villaInventories = {
    "The Cliff Villas": [6, 7],
    "The Crown Villas": [3, 4, 5, 6, 7],
    "The Royal Villas": [3, 4, 5, 6, 7],
    "Villa Park": [4, 5, 6]
};

const today = new Date();
const minDate = new Date(today);
minDate.setDate(today.getDate() + 7);
const minDateStr = minDate.toISOString().split('T')[0];

checkInInput.min = minDateStr;
checkInInput.addEventListener('change', () => {
    checkOutInput.min = checkInInput.value;
});

accommodationSelect.addEventListener('change', (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const groupLabel = selectedOption.parentNode.label;
    const villaName = selectedOption.value;
    
    bedroomSelect.innerHTML = '<option value="" disabled selected>Number of Bedrooms Required</option>';

    if (groupLabel === "Villas" && villaInventories[villaName]) {
        bedroomField.style.display = 'block';
        bedroomSelect.required = true;
        
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

inquiryForm.addEventListener('submit', async (e) => {
    e.preventDefault();

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

// === REVIEW CAROUSEL LOGIC ===
const slides = document.querySelectorAll('.review-slide');
let currentSlide = 0;

if (slides.length > 0) {
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 6000);
}

// === LEGAL MODAL LOGIC ===
const modal = document.getElementById("legalModal");
const modalBody = document.getElementById("modal-content");
const closeBtn = document.querySelector(".close-modal");

const legalContent = {
    terms: `<h2>Summary of Terms of Service</h2>
            <p>Last Updated: March 28, 2026. By submitting an inquiry, you explicitly agree to the following key terms:</p>
            <h2>1. Brokerage Role & Accommodations</h2><p>Elite Gold Escapes acts solely as a private broker. We guarantee total bedroom counts, but reserve the right to fulfill large requests via a combination of units (e.g., a 7-bedroom request fulfilled as a 3-bedroom and 4-bedroom villa). Specific villa locations cannot be guaranteed.</p>
            <h2>2. Financial & Anti-Chargeback</h2><p>All payments are 100% NON-REFUNDABLE. Unwarranted credit card chargebacks will incur a $500 penalty and legal recovery fees.</p>
            <h2>3. Force Majeure & Weather</h2><p>No refunds are provided for weather-related incidents, hurricanes, pandemics, or flight cancellations. Travel insurance is strictly mandated.</p>
            <h2>4. Dominican Republic Specifics</h2><p>The Agency assumes zero liability for municipal power outages, non-potable tap water, local insects, Sargassum seaweed, or third-party excursions. Local hospitals require upfront cash for medical emergencies.</p>
            <h2>5. Arbitration</h2><p>All disputes are subject to mandatory, binding arbitration in Austin, Texas. Class action lawsuits are strictly waived.</p>
            <br>
            <p><a href="terms.html" style="color: var(--gold-champagne); text-decoration: underline; font-weight: bold; font-size: 0.8rem; text-transform: uppercase;">CLICK HERE TO READ THE EXHAUSTIVE, FULL TERMS OF SERVICE</a></p>`,
    
    privacy: `<h2>Privacy Policy</h2><p>We collect names and contact info solely to facilitate travel itineraries. Data is processed through Formspree and Vercel. We never sell or trade your data to third-party marketing entities.</p>`
};

document.getElementById("open-terms").onclick = () => {
    modalBody.innerHTML = legalContent.terms;
    modal.style.display = "block";
};

document.getElementById("open-privacy").onclick = () => {
    modalBody.innerHTML = legalContent.privacy;
    modal.style.display = "block";
};

closeBtn.onclick = () => modal.style.display = "none";
window.addEventListener('click', (e) => { 
    if (e.target == modal) modal.style.display = "none"; 
});

// === IMMERSIVE GALLERY LOGIC (AUTO-PLAY, ARRAYS, COUNTER) ===
const lightbox = document.getElementById("galleryModal");
const activeImg = document.getElementById("active-image");
const counterEl = document.getElementById("lightbox-counter");

function generateImageArray(basePath, prefix, count) {
    let images = [];
    for (let i = 1; i <= count; i++) {
        images.push(`${basePath}/${prefix}${i}.jpg`);
    }
    return images;
}

const propertyGalleries = {
    "The Cliff Villas": generateImageArray("images/villas/cliff-villas", "cliff-", 27),
    "The Crown Villas": generateImageArray("images/villas/crown-villas", "crown-", 25),
    "The Royal Villas": generateImageArray("images/villas/royal-villas", "Royal-", 17),
    "Villa Park": generateImageArray("images/villas/villa-park", "park-", 21),
    
    "Presidential Suites": ["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200"],
    "Sunrise Suites": ["https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200"],
    "The Royal Suites": ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200"],
    "Crown & Residence Suites": ["https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200"],
    "Cofresi Palm Beach Resort": ["https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200"],
    "Tropical Resort": ["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200"]
};

let currentPhotos = [];
let photoIndex = 0;
let slideshowTimer;

function updateCounter() {
    if (counterEl) {
        counterEl.textContent = `${photoIndex + 1} / ${currentPhotos.length}`;
    }
}

function startSlideshow() {
    clearInterval(slideshowTimer); 
    slideshowTimer = setInterval(() => {
        if (currentPhotos.length > 1) {
            photoIndex = (photoIndex + 1) % currentPhotos.length;
            activeImg.src = currentPhotos[photoIndex];
            updateCounter();
        }
    }, 3500); 
}

function stopSlideshow() {
    clearInterval(slideshowTimer);
}

document.querySelectorAll('.gallery-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        
        const titleElement = trigger.parentElement.querySelector('.display-info h3');
        if (!titleElement) return;
        
        const activeTitle = titleElement.textContent.trim();
        currentPhotos = propertyGalleries[activeTitle] || [];
        
        if (currentPhotos.length > 0) {
            photoIndex = 0;
            activeImg.src = currentPhotos[photoIndex];
            updateCounter();
            lightbox.style.display = "flex"; // Properly triggers the flex layout only when clicked
            startSlideshow(); 
        } else {
            alert("Gallery imagery is currently being curated for " + activeTitle + ". Check back soon!");
        }
    });
});

document.getElementById("next-photo").onclick = () => {
    stopSlideshow(); 
    if (currentPhotos.length > 1) {
        photoIndex = (photoIndex + 1) % currentPhotos.length;
        activeImg.src = currentPhotos[photoIndex];
        updateCounter();
    }
};

document.getElementById("prev-photo").onclick = () => {
    stopSlideshow(); 
    if (currentPhotos.length > 1) {
        photoIndex = (photoIndex - 1 + currentPhotos.length) % currentPhotos.length;
        activeImg.src = currentPhotos[photoIndex];
        updateCounter();
    }
};

document.querySelector(".close-lightbox").onclick = () => {
    lightbox.style.display = "none";
    stopSlideshow(); 
};

window.addEventListener('click', (e) => {
    if (e.target == lightbox) {
        lightbox.style.display = "none";
        stopSlideshow(); 
    }
});