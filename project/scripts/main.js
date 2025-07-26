

document.addEventListener('DOMContentLoaded', () => {
    
    const currentYearSpan = document.getElementById('currentyear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    const lastModifiedPara = document.getElementById('lastModified');
    if (lastModifiedPara) {
        lastModifiedPara.textContent = `Last Modified: ${document.lastModified}`;
    }

    
    const quoteTextElement = document.getElementById('quote-text');
    const quoteAuthorElement = document.getElementById('quote-author');
    const newQuoteBtn = document.getElementById('new-quote-btn');
    const favoriteQuoteBtn = document.getElementById('favorite-quote-btn');

    let currentQuoteIndex = -1; 

    function getRandomQuote() {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * allQuotes.length);
        } while (randomIndex === currentQuoteIndex); 

        currentQuoteIndex = randomIndex;
        return allQuotes[randomIndex];
    }

    function displayQuote(quoteObj, index) {
        if (quoteTextElement && quoteAuthorElement) {
            quoteTextElement.textContent = `"${quoteObj.quote}"`;
            quoteAuthorElement.textContent = `- ${quoteObj.author}`;
            favoriteQuoteBtn.dataset.quoteIndex = index; 
            updateFavoriteButtonState(index);
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

    function updateFavoriteButtonState(index) {
        if (favoriteQuoteBtn) {
            if (isQuoteFavorited(index)) {
                favoriteQuoteBtn.classList.add('favorited');
                favoriteQuoteBtn.querySelector('.heart-icon').innerHTML = '&#9829;'; 
            } else {
                favoriteQuoteBtn.classList.remove('favorited');
                favoriteQuoteBtn.querySelector('.heart-icon').innerHTML = '&#9825;'; 
            }
        }
    }

    if (favoriteQuoteBtn) {
        favoriteQuoteBtn.addEventListener('click', () => {
            const indexToFavorite = parseInt(favoriteQuoteBtn.dataset.quoteIndex);
            if (indexToFavorite !== -1) {
                if (isQuoteFavorited(indexToFavorite)) {
                    removeFavoriteQuote(indexToFavorite);
                } else {
                    addFavoriteQuote(indexToFavorite);
                }
                updateFavoriteButtonState(indexToFavorite);
                
                if (document.body.classList.contains('browse-main')) {
                    renderFavoriteQuotes();
                }
            }
        });
    }

    
    const categorySelect = document.getElementById('category-select');
    const quotesContainer = document.getElementById('quotes-container');
    const currentCategoryTitle = document.getElementById('current-category-title');
    const favoriteQuotesContainer = document.getElementById('favorite-quotes-container');

    function renderQuotes(category = 'all') {
        if (!quotesContainer) return; 

        const filteredQuotes = category === 'all'
            ? allQuotes
            : allQuotes.filter(quote => quote.category === category);

        quotesContainer.innerHTML = ''; 

        if (filteredQuotes.length === 0) {
            quotesContainer.innerHTML = `<p class="no-quotes-message">No quotes found for "${category}" category.</p>`;
            return;
        }

        filteredQuotes.forEach((quoteObj, index) => {
            
            const originalIndex = allQuotes.findIndex(q => q.quote === quoteObj.quote && q.author === quoteObj.author);
            if (originalIndex === -1) return; 

            const quoteItem = document.createElement('div');
            quoteItem.classList.add('quote-item');
            quoteItem.innerHTML = `
                <blockquote>"${quoteObj.quote}"</blockquote>
                <p class="quote-author">- ${quoteObj.author}</p>
                <button class="btn favorite-btn browse-favorite-btn" data-quote-index="${originalIndex}">
                    <span class="heart-icon">${isQuoteFavorited(originalIndex) ? '&#9829;' : '&#9825;'}</span> Favorite
                </button>
            `;
            quotesContainer.appendChild(quoteItem);
        });

        
        quotesContainer.querySelectorAll('.browse-favorite-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const indexToFavorite = parseInt(event.currentTarget.dataset.quoteIndex);
                if (isQuoteFavorited(indexToFavorite)) {
                    removeFavoriteQuote(indexToFavorite);
                } else {
                    addFavoriteQuote(indexToFavorite);
                }
                
                updateFavoriteButtonStateForBrowse(event.currentTarget, indexToFavorite);
                renderFavoriteQuotes(); 
            });
        });
    }

    function updateFavoriteButtonStateForBrowse(buttonElement, index) {
        if (isQuoteFavorited(index)) {
            buttonElement.classList.add('favorited');
            buttonElement.querySelector('.heart-icon').innerHTML = '&#9829;'; 
        } else {
            buttonElement.classList.remove('favorited');
            buttonElement.querySelector('.heart-icon').innerHTML = '&#9825;'; 
        }
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
            const quoteObj = allQuotes[index];
            if (quoteObj) { 
                const quoteItem = document.createElement('div');
                quoteItem.classList.add('quote-item');
                quoteItem.innerHTML = `
                    <blockquote>"${quoteObj.quote}"</blockquote>
                    <p class="quote-author">- ${quoteObj.author}</p>
                    <button class="btn favorite-btn browse-favorite-btn" data-quote-index="${index}">
                        <span class="heart-icon">&#9829;</span> Remove Favorite
                    </button>
                `;
                favoriteQuotesContainer.appendChild(quoteItem);
            }
        });

        
        favoriteQuotesContainer.querySelectorAll('.browse-favorite-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const indexToRemove = parseInt(event.currentTarget.dataset.quoteIndex);
                removeFavoriteQuote(indexToRemove);
                renderFavoriteQuotes(); 
                renderQuotes(categorySelect.value); 
            });
        });
    }

    
    function saveLastViewedCategory(category) {
        localStorage.setItem('lastViewedCategory', category);
    }

    function getLastViewedCategory() {
        return localStorage.getItem('lastViewedCategory') || 'all';
    }

    if (categorySelect) {
        
        const lastCategory = getLastViewedCategory();
        categorySelect.value = lastCategory;
        currentCategoryTitle.textContent = categorySelect.options[categorySelect.selectedIndex].text.replace(' Categories', ''); 

        renderQuotes(lastCategory); 
        renderFavoriteQuotes(); 

        categorySelect.addEventListener('change', (event) => {
            const selectedCategory = event.target.value;
            renderQuotes(selectedCategory);
            saveLastViewedCategory(selectedCategory);
            currentCategoryTitle.textContent = categorySelect.options[categorySelect.selectedIndex].text.replace(' Categories', ''); 
        });
    }


    
    const quoteSubmissionForm = document.getElementById('quote-submission-form');
    const formMessage = document.getElementById('form-message');

    if (quoteSubmissionForm) {
        quoteSubmissionForm.addEventListener('submit', (event) => {
            event.preventDefault(); 

            const quoteTextInput = document.getElementById('quote-text-input').value.trim();
            const quoteAuthorInput = document.getElementById('quote-author-input').value.trim();
            const yourNameInput = document.getElementById('your-name-input').value.trim();
            const quoteCategoryInput = document.getElementById('quote-category-input').value;

            if (!quoteTextInput || !quoteCategoryInput) {
                formMessage.textContent = 'Please fill in the Quote Text and select a Category.';
                formMessage.classList.remove('hidden', 'success');
                formMessage.classList.add('error');
                return;
            }

            
            console.log('Submitted Quote:', {
                quote: quoteTextInput,
                author: quoteAuthorInput || 'Unknown',
                submitter: yourNameInput || 'Anonymous',
                category: quoteCategoryInput
            });

            formMessage.textContent = 'Thank you for your submission! Your quote has been received.';
            formMessage.classList.remove('hidden', 'error');
            formMessage.classList.add('success');

            quoteSubmissionForm.reset(); 
        });
    }

    
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        let lazyLoadObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    let img = entry.target;
                    img.src = img.dataset.src; 
                    img.classList.add('loaded'); 
                    lazyLoadObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            lazyLoadObserver.observe(img);
        });
    } else {
        
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    }
});