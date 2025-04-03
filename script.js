const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const movieResults = document.getElementById('movie-results');

searchButton.addEventListener('click', searchMovies);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchMovies();
});

async function searchMovies() {
    const query = searchInput.value.trim();
    if (!query) {
        movieResults.innerHTML = '<p>Please Enter a Movie Title.</p>';
        return;
    }

    movieResults.innerHTML = '<p>Loading.....</p>';
    console.log('Starting Search for:', query);
    
    try {
        const url = `http://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=2788aa23`;
        console.log('Fetching URL:', url);
        const response = await fetch(url)
        console.log('Response received. Status:', response.status);

        if (!response.ok) {
            throw new Error (`HTTP error! Status:, ${response.status}`);
        }

        const data = await response.json();
        console.log('API data:', data);

        if (data.Response === 'True') {
            console.log('Movies found:', data.Search);
            displayMovies(data.Search);
        } else {
            movieResults.innerHTML = `<p>${data.Error || 'No Movies Found.'}</p>`;
            console.log('API error message:', data.Error);
        }
    } catch (error) {
        movieResults.innerHTML = '<p>Something Went Wrong. Check the console for details.</p>';
        console.error('Fetch error:', error);
    }
}

function displayMovies(movies) {
    movieResults.innerHTML = '';
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150'}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
        `;
         movieResults.appendChild(movieCard);
    });
    observeMovies(); 
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        } else {
            entry.target.classList.remove('visible');
        }
    });
}, { threshold: 0.3 });

function observeMovies() {
    const elementsToAnimate = [
        document.querySelector('.search-bar'),
        ...document.querySelectorAll('.movie-card')
    ];
    elementsToAnimate.forEach(element => observer.observe(element));
}
observeMovies();