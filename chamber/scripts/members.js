const hamburgerBtn = document.querySelector('.hamburger');
const nav = document.querySelector('.nav');
const darkModeToggle = document.querySelector('.dark-mode-toggle');
const keynoteBtn = document.querySelector('.keynote-btn');

function toggleMobileNav() {
    nav.classList.toggle('active');
    hamburgerBtn.classList.toggle('active');
    
    const spans = hamburgerBtn.querySelectorAll('span');
    spans.forEach((span, index) => {
        if (hamburgerBtn.classList.contains('active')) {
            if (index === 0) span.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            if (index === 1) span.style.opacity = '0';
            if (index === 2) span.style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            span.style.transform = 'none';
            span.style.opacity = '1';
        }
    });
}


function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');

    const isDarkMode = document.body.classList.contains('dark-mode');
    darkModeToggle.textContent = isDarkMode ? '☀️' : '🌙';
    
    localStorage.setItem('darkMode', isDarkMode);
}


function initializeDarkMode() {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
    }
}

function handleKeynoteClick() {
    alert('Keynote ticket information will be available soon!');
}

function updateWeather() {
    const weatherIcon = document.querySelector('.weather-icon');
    const weatherTemp = document.querySelector('.weather-temp');
    const weatherDesc = document.querySelector('.weather-desc');
    

    const weatherData = {
        temp: Math.floor(Math.random() * 30) + 60, 
        conditions: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 4)],
        icons: ['☀️', '⛅', '☁️', '🌧️']
    };
    
    const iconIndex = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'].indexOf(weatherData.conditions);
    
    weatherIcon.textContent = weatherData.icons[iconIndex];
    weatherTemp.textContent = `${weatherData.temp}° F`;
    weatherDesc.textContent = weatherData.conditions;
}


function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}


function handleResize() {
    if (window.innerWidth > 768) {

        nav.classList.remove('active');
        hamburgerBtn.classList.remove('active');
        
        const spans = hamburgerBtn.querySelectorAll('span');
        spans.forEach(span => {
            span.style.transform = 'none';
            span.style.opacity = '1';
        });
    }
}


function validateForm(formData) {
    const errors = [];
    
    if (!formData.name || formData.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!formData.message || formData.message.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
    }
    
    return errors;
}


function initializePage() {

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', toggleMobileNav);
    }
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
    
    if (keynoteBtn) {
        keynoteBtn.addEventListener('click', handleKeynoteClick);
    }
    

    window.addEventListener('resize', handleResize);

    initializeDarkMode();
    

    updateWeather();
    
    setInterval(updateWeather, 300000);
    
    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {

            if (link.getAttribute('href').startsWith('#')) {
            e.preventDefault();
        }
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            if (nav.classList.contains('active')) {
                toggleMobileNav();
            }
        });
    });
    
    const businessCards = document.querySelectorAll('.business-card');
    businessCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

const darkModeStyles = `
    .dark-mode {
        background-color: #1a1a1a;
        color: #e0e0e0;
    }
    
    .dark-mode .header {
        background-color: #2d2d2d;
        border-bottom-color: #444;
    }
    
    .dark-mode .nav a {
        color: #e0e0e0;
    }
    
    .dark-mode .nav a:hover,
    .dark-mode .nav a.active {
        background-color: #444;
    }
    
    .dark-mode .hero {
        background: linear-gradient(135deg, #2d2d2d 0%, #3d3d3d 100%);
        border-color: #444;
    }
    
    .dark-mode .hero-text {
        color: #ccc;
    }
    
    .dark-mode .content-section {
        background-color: #2d2d2d;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }
    
    .dark-mode .section-content {
        background-color: #333;
    }
    
    .dark-mode .business-card {
        background-color: #2d2d2d;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }
    
    .dark-mode .footer {
        background-color: #2d2d2d;
        border-top-color: #444;
    }
    
    .dark-mode .page-title {
        color: #e0e0e0;
    }
    
    .dark-mode .weather-temp,
    .dark-mode .forecast-temp,
    .dark-mode .business-name {
        color: #e0e0e0;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = darkModeStyles;
document.head.appendChild(styleSheet);

document.addEventListener('DOMContentLoaded', initializePage);

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        updateWeather();
    }
});

window.ChamberApp = {
    toggleMobileNav,
    toggleDarkMode,
    updateWeather,
    validateForm,
    smoothScroll
};