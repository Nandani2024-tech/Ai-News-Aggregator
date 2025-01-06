
let category = 'general'; 
const apiKey = '6d852cf50cfd409cbb7f21912510332f'; 


document.getElementById('preferencesForm').addEventListener('submit', function (e) {
    e.preventDefault();
    category = document.getElementById('category').value;
    fetchNews();
});


async function fetchNews() {
    try {
        const apiUrl = `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${apiKey}`;
        console.log(`Fetching news from: ${apiUrl}`);
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        if (data.status !== "ok") {
            throw new Error(data.message || "Failed to fetch news data.");
        }

        displayNews(data.articles);
        performSentimentAnalysis(data.articles);
    } catch (error) {
        console.error('Error fetching news:', error.message);
        alert(`Failed to fetch data: ${error.message}`);
    }
}


function displayNews(articles) {
    const newsList = document.getElementById('news-list');
    newsList.innerHTML = '';

    if (!articles || articles.length === 0) {
        newsList.innerHTML = '<p>No articles available for this category.</p>';
        return;
    }

    articles.forEach(article => {
        const articleDiv = document.createElement('div');
        articleDiv.classList.add('article', 'news-item'); 
        articleDiv.innerHTML = `
            <h3>${article.title}</h3>
            <p>${article.description || 'No description available.'}</p>
            <a href="${article.url}" target="_blank">Read more</a>
        `;
        newsList.appendChild(articleDiv);
    });
}


function performSentimentAnalysis(articles) {
    const sentimentOutput = document.getElementById('sentiment-output');
    sentimentOutput.innerHTML = '';

    if (!articles || articles.length === 0) {
        sentimentOutput.innerHTML = '<p>No articles available for sentiment analysis.</p>';
        return;
    }

    articles.forEach(article => {
        const sentiment = analyzeSentiment(article.description || '');
        const sentimentDiv = document.createElement('div');
        sentimentDiv.classList.add('sentiment');
        sentimentDiv.innerHTML = `
            <p><strong>${article.title}</strong></p>
            <p>Sentiment: ${sentiment}</p>
        `;
        sentimentOutput.appendChild(sentimentDiv);
    });
}


function analyzeSentiment(text) {
    const positiveWords = ['good', 'great', 'excellent', 'positive', 'happy'];
    const negativeWords = ['bad', 'horrible', 'negative', 'sad', 'worst'];

    let sentiment = 'Neutral';
    let positiveCount = 0;
    let negativeCount = 0;

    const words = text.split(' ');

    words.forEach(word => {
        if (positiveWords.includes(word.toLowerCase())) {
            positiveCount++;
        } else if (negativeWords.includes(word.toLowerCase())) {
            negativeCount++;
        }
    });

    if (positiveCount > negativeCount) {
        sentiment = 'Positive';
    } else if (negativeCount > positiveCount) {
        sentiment = 'Negative';
    }

    return sentiment;
}


function animateOnScroll() {
    const sections = document.querySelectorAll('section');

    const observerOptions = {
        root: null, 
        rootMargin: '0px',
        threshold: 0.1, 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    animateOnScroll();
});

// Initial News Fetch
fetchNews();
