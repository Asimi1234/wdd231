// quotesData.js - ES Module
export const allQuotes = [
    {
        quote: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
        category: "Motivation"
    },
    {
        quote: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt",
        category: "Inspiration"
    },
    {
        quote: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt",
        category: "Inspiration"
    },
    {
        quote: "It is during our darkest moments that we must focus to see the light.",
        author: "Aristotle",
        category: "Wisdom"
    },
    {
        quote: "Strive not to be a success, but rather to be of value.",
        author: "Albert Einstein",
        category: "Success"
    },
    {
        quote: "The mind is everything. What you think you become.",
        author: "Buddha",
        category: "Wisdom"
    },
    {
        quote: "The best way to predict the future is to create it.",
        author: "Abraham Lincoln",
        category: "Creativity"
    },
    {
        quote: "Happiness is not something ready made. It comes from your own actions.",
        author: "Dalai Lama XIV",
        category: "Happiness"
    },
    {
        quote: "The only limit to our realization of tomorrow will be our doubts of today.",
        author: "Franklin D. Roosevelt",
        category: "Courage"
    },
    {
        quote: "Innovation distinguishes between a leader and a follower.",
        author: "Steve Jobs",
        category: "Creativity"
    },
    {
        quote: "Life is what happens when you're busy making other plans.",
        author: "John Lennon",
        category: "Life"
    },
    {
        quote: "The unexamined life is not worth living.",
        author: "Socrates",
        category: "Knowledge"
    },
    {
        quote: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
        author: "Winston Churchill",
        category: "Courage"
    },
    {
        quote: "To live is the rarest thing in the world. Most people exist, that is all.",
        author: "Oscar Wilde",
        category: "Life"
    },
    {
        quote: "The beautiful thing about learning is that no one can take it away from you.",
        author: "B.B. King",
        category: "Knowledge"
    },
    {
        quote: "Do not go where the path may lead, go instead where there is no path and leave a trail.",
        author: "Ralph Waldo Emerson",
        category: "Inspiration"
    },
    {
        quote: "The purpose of our lives is to be happy.",
        author: "Dalai Lama XIV",
        category: "Happiness"
    },
    {
        quote: "If you want to lift yourself up, lift up someone else.",
        author: "Booker T. Washington",
        category: "Wisdom"
    },
    {
        quote: "Change your thoughts and you change your world.",
        author: "Norman Vincent Peale",
        category: "Motivation"
    },
    {
        quote: "Imagination is more important than knowledge.",
        author: "Albert Einstein",
        category: "Creativity"
    }
];

// External API integration function
export async function fetchExternalQuotes() {
  try {
    const response = await fetch('https://dummyjson.com/quotes?limit=50');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();

    const externalQuotes = data.quotes.map(item => ({
      quote: item.quote,
      author: item.author,
      category: 'General'  
    }));

    return externalQuotes;
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return [];
  }
}


function categorizeQuote(tags) {
    const tagCategories = {
        'inspirational': 'Inspiration',
        'motivational': 'Motivation', 
        'wisdom': 'Wisdom',
        'success': 'Success',
        'happiness': 'Happiness',
        'life': 'Life',
        'creativity': 'Creativity',
        'courage': 'Courage',
        'knowledge': 'Knowledge'
    };

    for (const tag of tags) {
        if (tagCategories[tag.toLowerCase()]) {
            return tagCategories[tag.toLowerCase()];
        }
    }
    
    return 'Inspiration';
}