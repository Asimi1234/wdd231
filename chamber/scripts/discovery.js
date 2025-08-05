// Discover Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    updateCopyrightYear();
    updateLastModified();
    handleVisitMessage();
    loadAttractions();
    setupMobileMenu();
    setupDarkMode();
});

// Update copyright year in footer
function updateCopyrightYear() {
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
}

// Update last modified date
function updateLastModified() {
    const lastModifiedElement = document.getElementById('lastModified');
    if (lastModifiedElement) {
        lastModifiedElement.textContent = `Last Modification: ${document.lastModified}`;
    }
}

// Handle visit message using localStorage
function handleVisitMessage() {
    const visitMessageElement = document.getElementById('visitMessage');
    if (!visitMessageElement) return;

    const now = Date.now();
    const lastVisit = localStorage.getItem('timbuktu-discover-last-visit');
    
    let message = '';
    
    if (!lastVisit) {
        // First visit
        message = 'Welcome! Let us know if you have any questions.';
    } else {
        const daysDifference = Math.floor((now - parseInt(lastVisit)) / (1000 * 60 * 60 * 24));
        
        if (daysDifference < 1) {
            // Same day visit
            message = 'Back so soon! Awesome!';
        } else {
            // Multiple days
            const dayText = daysDifference === 1 ? 'day' : 'days';
            message = `You last visited ${daysDifference} ${dayText} ago.`;
        }
    }
    
    // Store current visit
    localStorage.setItem('timbuktu-discover-last-visit', now.toString());
    
    // Display message
    visitMessageElement.textContent = message;
    visitMessageElement.classList.add('show');
}

// Load attractions from JSON and create cards
async function loadAttractions() {
    try {
        const response = await fetch('data/attractions.json');
        const data = await response.json();
        createAttractionCards(data.attractions);
    } catch (error) {
        console.error('Error loading attractions:', error);
        // Fallback: create cards with placeholder data
        createFallbackCards();
    }
}

// Create attraction cards
function createAttractionCards(attractions) {
    const gridContainer = document.getElementById('discoverGrid');
    if (!gridContainer) return;

    gridContainer.innerHTML = '';
    
    attractions.forEach((attraction, index) => {
        const card = createCard(attraction, index + 1);
        gridContainer.appendChild(card);
    });
}

// Create individual card element
function createCard(attraction, index) {
    const card = document.createElement('section');
    card.className = 'discover-card';
    card.style.gridArea = `card${index}`;
    
    card.innerHTML = `
        <h2 class="card-title">${attraction.name}</h2>
        <figure class="card-figure">
            <img src="${attraction.image}" alt="${attraction.name}" class="card-image" loading="lazy">
        </figure>
        <address class="card-address">${attraction.address}</address>
        <p class="card-description">${attraction.description}</p>
        <button class="card-button">Learn More</button>
    `;
    
    return card;
}

// Fallback cards if JSON fails to load
function createFallbackCards() {
    const fallbackData = [
        {
          "id": 1,
          "name": "Great Mosque of Sankore",
          "address": "Sankore Quarter, Timbuktu, Mali",
          "description": "The legendary Sankore Mosque and University was one of the world's first universities and a center of Islamic learning. Built in the 15th century, it housed over 25,000 students and 180 schools of Quranic learning.",
          "image": "images/sankore.jpg",
          "category": "historical"
        },
        {
          "id": 2,
          "name": "Djinguereber Mosque",
          "address": "Central Timbuktu, Mali",
          "description": "Built around 1327 CE, this iconic mosque is one of the oldest in West Africa and a UNESCO World Heritage site. Its distinctive mud-brick architecture represents the pinnacle of Sudano-Sahelian architectural style.",
          "image": "images/djinguereber.jpg",
          "category": "historical"
        },
        {
          "id": 3,
          "name": "Ahmed Baba Institute",
          "address": "University of Timbuktu, Mali",
          "description": "Home to over 700,000 ancient manuscripts covering subjects from astronomy to poetry. This modern institute preserves and digitizes Timbuktu's incredible literary heritage dating back to the 12th century.",
          "image": "images/ahmed.jpg",
          "category": "cultural"
        },
        {
          "id": 4,
          "name": "Timbuktu Manuscripts",
          "address": "Various Private Libraries, Timbuktu",
          "description": "Discover the hidden treasure of Africa - hundreds of thousands of ancient manuscripts that prove Timbuktu was a center of learning when Europe was in the Dark Ages. Many are still held by local families.",
          "image": "images/timbuku-manuscript.jpg",
          "category": "cultural"
        },
        {
          "id": 5,
          "name": "Flame of Peace Monument",
          "address": "Peace Square, Timbuktu, Mali",
          "description": "This striking monument commemorates the 1996 peace ceremony where over 3,000 weapons were burned to mark the end of the Tuareg rebellion. It stands as a symbol of reconciliation and hope.",
          "image": "images/flame-of-peace.jpg",
          "category": "modern"
        },
        {
          "id": 6,
          "name": "Niger River Port",
          "address": "Kabara Port, 8km south of Timbuktu",
          "description": "The historic port of Kabara connects Timbuktu to the Niger River. During flood season, boats arrive laden with goods from across West Africa, continuing a trading tradition that spans over 1,000 years.",
          "image": "images/niger-port.jpg",
          "category": "natural"
        },
        {
          "id": 7,
          "name": "Traditional Salt Mines",
          "address": "Taghaza Region, Northern Mali",
          "description": "Visit the ancient salt mines of Taghaza, where salt has been extracted for over 500 years. The famous salt caravans that made Timbuktu wealthy still operate, carrying precious salt across the Sahara.",
          "image": "images/salt-mine.jpg",
          "category": "natural"
        },
        {
          "id": 8,
          "name": "Desert Camel Treks",
          "address": "Sahara Desert, Timbuktu Region",
          "description": "Experience the Sahara as traders have for centuries. Join guided camel treks into the golden dunes surrounding Timbuktu, where you can witness stunning sunsets and sleep under countless stars.",
          "image": "images/desert-trek.jpg",
          "category": "adventure"
        }
    ];
    
    createAttractionCards(fallbackData);
}

// Setup mobile menu functionality
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');
    
    if (hamburger && nav) {
        hamburger.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !nav.contains(event.target)) {
                nav.classList.remove('active');
            }
        });
    }
}

// Setup dark mode functionality
function setupDarkMode() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    
    if (darkModeToggle) {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('timbuktu-theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            darkModeToggle.textContent = '☀️';
        }
        
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            // Update button icon and save preference
            if (document.body.classList.contains('dark-mode')) {
                darkModeToggle.textContent = '☀️';
                localStorage.setItem('timbuktu-theme', 'dark');
            } else {
                darkModeToggle.textContent = '🌙';
                localStorage.setItem('timbuktu-theme', 'light');
            }
        });
    }
}

// Handle button clicks (placeholder for future functionality)
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('card-button')) {
        const cardTitle = event.target.closest('.discover-card').querySelector('.card-title').textContent;
        alert(`More information about ${cardTitle} coming soon!`);
    }
});