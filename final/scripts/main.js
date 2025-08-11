// main.js - ES Module with enhanced functionality
import { allQuotes, fetchExternalQuotes } from './quotesData.js';

// Global variables
let combinedQuotes = [...allQuotes]; // Start with local quotes
let currentQuoteIndex = -1;

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize the application
    await initializeApp();
    
    // Set up common functionality
    setupCommonFunctionality();
    
    // Set up page-specific functionality
    const currentPage = getCurrentPage();
    switch (currentPage) {
        case 'index':
            setupHomePage();
            break;
        case 'quotes':
            setupQuotesPage();
            break;
        case 'submit':
            setupSubmitPage();
            break;
        default:
            break;
    }
});

// Initialize app with external data
async function initializeApp() {
    try {
        // Fetch external quotes and combine with local ones
        const externalQuotes = await fetchExternalQuotes();
        combinedQuotes = [...allQuotes, ...externalQuotes];
        
        console.log(`Loaded ${combinedQuotes.length} quotes (${allQuotes.length} local, ${externalQuotes.length} external)`);
    } catch (error) {
        console.error('Error initializing app:', error);
        // Continue with local quotes only
        combinedQuotes = [...allQuotes];
    }
}

// Get current page from URL
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('quotes.html')) return 'quotes';
    if (path.includes('submit.html')) return 'submit';
    if (path.includes('form-success.html')) return 'success';
    return 'index';
}

// Set up common functionality for all pages
function setupCommonFunctionality() {
    // Update copyright year
    const currentYearSpan = document.getElementById('currentyear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Update last modified date
    const lastModifiedPara = document.getElementById('lastModified');
    if (lastModifiedPara) {
        lastModifiedPara.textContent = `Last Modified: ${document.lastModified}`;
    }

    // Set up video demo link
    const videoDemoLink = document.getElementById('video-demo-link');
    if (videoDemoLink) {
        videoDemoLink.href = 'https://vimeo.com/1109039616/f0c8a8b61c?ts=192000&share=copy';
        videoDemoLink.target = '_blank';
        videoDemoLink.rel = 'noopener';
    }

    // Lazy loading for images
    setupLazyLoading();
    
    setupModalFunctionality();
}

// homepage functionality
function setupHomePage() {
    const quoteTextElement = document.getElementById('quote-text');
    const quoteAuthorElement = document.getElementById('quote-author');
    const newQuoteBtn = document.getElementById('new-quote-btn');
    const favoriteQuoteBtn = document.getElementById('favorite-quote-btn');
    const quoteDetailsBtn = document.getElementById('quote-details-btn');

    function getRandomQuote() {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * combinedQuotes.length);
        } while (randomIndex === currentQuoteIndex && combinedQuotes.length > 1);

        currentQuoteIndex = randomIndex;
        return combinedQuotes[randomIndex];
    }

    function displayQuote(quoteObj, index) {
        if (quoteTextElement && quoteAuthorElement) {
            quoteTextElement.textContent = `"${quoteObj.quote}"`;
            quoteAuthorElement.textContent = `- ${quoteObj.author}`;
            if (favoriteQuoteBtn) {
                favoriteQuoteBtn.dataset.quoteIndex = index;
                updateFavoriteButtonState(index);
            }
        }
    }

    function generateNewQuote() {
        const randomQuote = getRandomQuote();
        displayQuote(randomQuote, currentQuoteIndex);
    }

    if (newQuoteBtn) {
        newQuoteBtn.addEventListener('click', generateNewQuote);
        generateNewQuote();
    }

    if (favoriteQuoteBtn) {
        favoriteQuoteBtn.addEventListener('click', () => {
            const indexToFavorite = parseInt(favoriteQuoteBtn.dataset.quoteIndex);
            toggleFavorite(indexToFavorite);
        });
    }

    if (quoteDetailsBtn) {
        quoteDetailsBtn.addEventListener('click', () => {
            if (currentQuoteIndex >= 0) {
                showQuoteModal(combinedQuotes[currentQuoteIndex]);
            }
        });
    }
}

function setupQuotesPage() {
    const categorySelect = document.getElementById('category-select');
    const quotesContainer = document.getElementById('quotes-container');
    const currentCategoryTitle = document.getElementById('current-category-title');
    const favoriteQuotesContainer = document.getElementById('favorite-quotes-container');

    function renderQuotes(category = 'all') {
        if (!quotesContainer) return;

        const filteredQuotes = category === 'all'
            ? combinedQuotes
            : combinedQuotes.filter(quote => quote.category === category);

        quotesContainer.innerHTML = '';

        if (filteredQuotes.length === 0) {
            quotesContainer.innerHTML = `<p class="no-quotes-message">No quotes found for "${category}" category.</p>`;
            return;
        }

        filteredQuotes.forEach((quoteObj, filteredIndex) => {
            const originalIndex = combinedQuotes.findIndex(q => 
                q.quote === quoteObj.quote && q.author === quoteObj.author
            );

            const quoteItem = document.createElement('div');
            quoteItem.classList.add('quote-item');
            quoteItem.innerHTML = `
                <blockquote>"${quoteObj.quote}"</blockquote>
                <p class="quote-author">- ${quoteObj.author}</p>
                <div class="quote-actions">
                    <button class="btn favorite-btn browse-favorite-btn" data-quote-index="${originalIndex}">
                        <span class="heart-icon">${isQuoteFavorited(originalIndex) ? '&#9829;' : '&#9825;'}</span> Favorite
                    </button>
                    <button class="btn details-btn" data-quote-index="${originalIndex}">Details</button>
                </div>
            `;
            quotesContainer.appendChild(quoteItem);
        });

        quotesContainer.querySelectorAll('.browse-favorite-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const indexToFavorite = parseInt(event.currentTarget.dataset.quoteIndex);
                toggleFavorite(indexToFavorite);
                updateFavoriteButtonStateForBrowse(event.currentTarget, indexToFavorite);
                renderFavoriteQuotes();
            });
        });

        quotesContainer.querySelectorAll('.details-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const quoteIndex = parseInt(event.currentTarget.dataset.quoteIndex);
                showQuoteModal(combinedQuotes[quoteIndex]);
            });
        });
    }

    function renderFavoriteQuotes() {
        if (!favoriteQuotesContainer) return;

        const favoriteIndices = getFavoriteQuotes();
        favoriteQuotesContainer.innerHTML = '';

        if (favoriteIndices.length === 0) {
            favoriteQuotesContainer.innerHTML = `<p class="no-favorites">No favorite quotes yet. Click the heart icon on a quote to add it!</p>`;
            return;
        }

        favoriteIndices.forEach(index => {
            const quoteObj = combinedQuotes[index];
            if (quoteObj) {
                const quoteItem = document.createElement('div');
                quoteItem.classList.add('quote-item');
                quoteItem.innerHTML = `
                    <blockquote>"${quoteObj.quote}"</blockquote>
                    <p class="quote-author">- ${quoteObj.author}</p>
                    <div class="quote-actions">
                        <button class="btn favorite-btn browse-favorite-btn" data-quote-index="${index}">
                            <span class="heart-icon">&#9829;</span> Remove Favorite
                        </button>
                        <button class="btn details-btn" data-quote-index="${index}">Details</button>
                    </div>
                `;
                favoriteQuotesContainer.appendChild(quoteItem);
            }
        });

        favoriteQuotesContainer.querySelectorAll('.browse-favorite-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const indexToRemove = parseInt(event.currentTarget.dataset.quoteIndex);
                removeFavoriteQuote(indexToRemove);
                renderFavoriteQuotes();
                renderQuotes(categorySelect?.value || 'all');
            });
        });

        favoriteQuotesContainer.querySelectorAll('.details-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const quoteIndex = parseInt(event.currentTarget.dataset.quoteIndex);
                showQuoteModal(combinedQuotes[quoteIndex]);
            });
        });
    }
    if (categorySelect) {
        const lastCategory = getLastViewedCategory();
        categorySelect.value = lastCategory;
        if (currentCategoryTitle) {
            currentCategoryTitle.textContent = categorySelect.options[categorySelect.selectedIndex].text.replace(' Categories', '');
        }

        renderQuotes(lastCategory);
        renderFavoriteQuotes();

        categorySelect.addEventListener('change', (event) => {
            const selectedCategory = event.target.value;
            renderQuotes(selectedCategory);
            saveLastViewedCategory(selectedCategory);
            if (currentCategoryTitle) {
                currentCategoryTitle.textContent = categorySelect.options[categorySelect.selectedIndex].text.replace(' Categories', '');
            }
        });
    }
}

function setupSubmitPage() {
    const quoteSubmissionForm = document.getElementById('quote-submission-form');
    const formMessage = document.getElementById('form-message');
    const submitModal = document.getElementById('submit-modal');
    const confirmSubmitBtn = document.getElementById('confirm-submit');
    const cancelSubmitBtn = document.getElementById('cancel-submit');

    if (quoteSubmissionForm) {
        quoteSubmissionForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            const formData = new FormData(quoteSubmissionForm);
            const quoteData = {
                quoteText: formData.get('quoteText').trim(),
                quoteAuthor: formData.get('quoteAuthor').trim() || 'Unknown',
                yourName: formData.get('yourName').trim() || 'Anonymous',
                quoteCategory: formData.get('quoteCategory')
            };

            if (!quoteData.quoteText || !quoteData.quoteCategory) {
                showFormMessage('Please fill in the Quote Text and select a Category.', 'error');
                return;
            }
            showSubmissionModal(quoteData);
        });
    }

    if (confirmSubmitBtn) {
        confirmSubmitBtn.addEventListener('click', () => {
            submitForm();
        });
    }

    if (cancelSubmitBtn) {
        cancelSubmitBtn.addEventListener('click', () => {
            closeModal('submit-modal');
        });
    }

    function showSubmissionModal(quoteData) {
        const previewContent = document.getElementById('preview-content');
        if (previewContent) {
            previewContent.innerHTML = `
                <div class="quote-preview">
                    <blockquote>"${quoteData.quoteText}"</blockquote>
                    <p><strong>Author:</strong> ${quoteData.quoteAuthor}</p>
                    <p><strong>Category:</strong> ${quoteData.quoteCategory}</p>
                    <p><strong>Submitted by:</strong> ${quoteData.yourName}</p>
                </div>
            `;
        }
        
        window.tempSubmissionData = quoteData;
        openModal('submit-modal');
    }

    function submitForm() {
        const data = window.tempSubmissionData;
        
        Object.keys(data).forEach(key => {
            localStorage.setItem(`lastSubmitted${key.charAt(0).toUpperCase() + key.slice(1)}`, data[key]);
        });

        // Create URL with parameters
        const params = new URLSearchParams(data);
        window.location.href = `form-success.html?${params.toString()}`;
    }

    function showFormMessage(message, type) {
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.classList.remove('hidden', 'success', 'error');
            formMessage.classList.add(type);
        }
    }
}

// Modal functionality
function setupModalFunctionality() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                closeModal(modal.id);
            });
        }

        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const openModal = document.querySelector('.modal[aria-hidden="false"]');
            if (openModal) {
                closeModal(openModal.id);
            }
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Focus management
        const firstFocusable = modal.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

function showQuoteModal(quoteObj) {
    const modal = document.getElementById('quote-modal');
    if (!modal || !quoteObj) return;

    // Populate modal with quote details
    const modalQuoteText = document.getElementById('modal-quote-text');
    const modalQuoteAuthor = document.getElementById('modal-quote-author');
    const modalQuoteCategory = document.getElementById('modal-quote-category');
    const modalQuoteLength = document.getElementById('modal-quote-length');
    const modalQuoteWords = document.getElementById('modal-quote-words');

    if (modalQuoteText) modalQuoteText.textContent = `"${quoteObj.quote}"`;
    if (modalQuoteAuthor) modalQuoteAuthor.textContent = `Author: ${quoteObj.author}`;
    if (modalQuoteCategory) modalQuoteCategory.textContent = `Category: ${quoteObj.category}`;
    if (modalQuoteLength) modalQuoteLength.textContent = `Characters: ${quoteObj.quote.length}`;
    if (modalQuoteWords) modalQuoteWords.textContent = `Words: ${quoteObj.quote.split(' ').length}`;

    openModal('quote-modal');
}

// Favorite quotes functionality
function getFavoriteQuotes() {
    const favorites = localStorage.getItem('favoriteQuotes');
    return favorites ? JSON.parse(favorites) : [];
}

function saveFavoriteQuotes(favoritesArray) {
    localStorage.setItem('favoriteQuotes', JSON.stringify(favoritesArray));
}

function isQuoteFavorited(quoteIndex) {
    const favorites = getFavoriteQuotes();
    return favorites.includes(quoteIndex);
}

function addFavoriteQuote(quoteIndex) {
    const favorites = getFavoriteQuotes();
    if (!favorites.includes(quoteIndex)) {
        favorites.push(quoteIndex);
        saveFavoriteQuotes(favorites);
        return true;
    }
    return false;
}

function removeFavoriteQuote(quoteIndex) {
    let favorites = getFavoriteQuotes();
    favorites = favorites.filter(index => index !== quoteIndex);
    saveFavoriteQuotes(favorites);
}

function toggleFavorite(quoteIndex) {
    if (isQuoteFavorited(quoteIndex)) {
        removeFavoriteQuote(quoteIndex);
    } else {
        addFavoriteQuote(quoteIndex);
    }
    updateFavoriteButtonState(quoteIndex);
}

function updateFavoriteButtonState(index) {
    const favoriteBtn = document.getElementById('favorite-quote-btn');
    if (favoriteBtn) {
        const heartIcon = favoriteBtn.querySelector('.heart-icon');
        if (isQuoteFavorited(index)) {
            favoriteBtn.classList.add('favorited');
            if (heartIcon) heartIcon.innerHTML = '&#9829;';
        } else {
            favoriteBtn.classList.remove('favorited');
            if (heartIcon) heartIcon.innerHTML = '&#9825;';
        }
    }
}

function updateFavoriteButtonStateForBrowse(buttonElement, index) {
    const heartIcon = buttonElement.querySelector('.heart-icon');
    if (isQuoteFavorited(index)) {
        buttonElement.classList.add('favorited');
        if (heartIcon) heartIcon.innerHTML = '&#9829;';
    } else {
        buttonElement.classList.remove('favorited');
        if (heartIcon) heartIcon.innerHTML = '&#9825;';
    }
}

// Category persistence
function saveLastViewedCategory(category) {
    localStorage.setItem('lastViewedCategory', category);
}

function getLastViewedCategory() {
    return localStorage.getItem('lastViewedCategory') || 'all';
}

// Lazy loading functionality
function setupLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    img.classList.add('loaded');
                    lazyLoadObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            lazyLoadObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
            img.classList.add('loaded');
        });
    }
}