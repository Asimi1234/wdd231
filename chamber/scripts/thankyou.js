// Extract URL parameters and display form data
document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    // Extract form data
    const firstName = urlParams.get('firstName') || '';
    const lastName = urlParams.get('lastName') || '';
    const email = urlParams.get('email') || '';
    const phone = urlParams.get('phone') || '';
    const businessName = urlParams.get('businessName') || '';
    const timestamp = urlParams.get('timestamp') || '';
    
    // Display the data
    displayFormData(firstName, lastName, email, phone, businessName, timestamp);
    
    // Initialize hamburger menu
    initHamburgerMenu();
    
    // Initialize dark mode toggle
    initDarkModeToggle();
});

// Hamburger menu functionality
function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');
    
    if (hamburger && nav) {
        hamburger.addEventListener('click', function() {
            nav.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // Close menu when clicking on a nav link
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
}

// Dark mode toggle functionality
function initDarkModeToggle() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            // Update button text
            if (document.body.classList.contains('dark-mode')) {
                this.textContent = '☀️';
            } else {
                this.textContent = '🌙';
            }
        });
    }
}

function displayFormData(firstName, lastName, email, phone, businessName, timestamp) {
    // Combine first and last name
    const fullName = `${firstName} ${lastName}`.trim();
    
    // Format timestamp to readable date
    let formattedDate = '';
    if (timestamp) {
        try {
            const date = new Date(timestamp);
            formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            formattedDate = 'Invalid date';
        }
    }
    
    // Update DOM elements
    document.getElementById('fullName').textContent = fullName || 'Not provided';
    document.getElementById('emailValue').textContent = email || 'Not provided';
    document.getElementById('phoneValue').textContent = phone || 'Not provided';
    document.getElementById('businessValue').textContent = businessName || 'Not provided';
    document.getElementById('timestampValue').textContent = formattedDate || 'Not provided';
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to info rows
    const infoRows = document.querySelectorAll('.info-row');
    infoRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#e9ecef';
            this.style.transition = 'background-color 0.3s ease';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
        });
    });
    
    // Add click-to-copy functionality for email and phone
    const emailElement = document.getElementById('emailValue');
    const phoneElement = document.getElementById('phoneValue');
    
    [emailElement, phoneElement].forEach(element => {
        if (element && element.textContent !== 'Not provided') {
            element.style.cursor = 'pointer';
            element.title = 'Click to copy';
            
            element.addEventListener('click', function() {
                copyToClipboard(this.textContent);
                showCopyFeedback(this);
            });
        }
    });
});

function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
        document.body.removeChild(textArea);
    }
}

function showCopyFeedback(element) {
    const originalText = element.textContent;
    element.textContent = 'Copied!';
    element.style.color = '#27ae60';
    
    setTimeout(() => {
        element.textContent = originalText;
        element.style.color = '';
    }, 1500);
}