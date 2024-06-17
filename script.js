const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const container = document.querySelector('.container');
const movieDetailsContent = document.querySelector('.movie-details-content');
const movieCloseBtn = document.querySelector('.movie-close-btn');

const fetchMovies = async (query) => {
    container.innerHTML = "<h2>Fetching Movies...</h2>";
    try {
        const data = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=f09cb618`);
        const response = await data.json();

        container.innerHTML = "";
        response.Search.forEach(movie => {
            const movieDiv = document.createElement('div');
            movieDiv.classList.add('movie');
            
            // Capitalize the first letter of each word in the type
            const type = movie.Type.split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            movieDiv.innerHTML = `
                <img src="${movie.Poster}">
                <h3>${movie.Title}</h3>
                <p>Year: <span>${movie.Year}</span></p>
                <p>Type: <span>${type}</span></p>
            `;
            const button = document.createElement('button');
            button.textContent = "View Details";
            movieDiv.appendChild(button);

            // Movie Button
            button.addEventListener('click', async () => {
                const movieData = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=f09cb618`);
                const movieDetails = await movieData.json();
                openMoviePopup(movieDetails);
            });
            container.appendChild(movieDiv);
        });
    } catch (error) {
        container.innerHTML = "<h2>Error in Fetching Movies...</h2>";
    }
}

const openMoviePopup = (movie) => {
    movieDetailsContent.innerHTML = `
        <h2 class="movieName">${movie.Title}</h2>
        <p class="plot">${movie.Plot}</p>
        <h3>Director: ${movie.Director}</h3>
        <p>Actors: ${movie.Actors}</p>
        <p>Genre: ${movie.Genre}</p>
        <p>Released: ${movie.Released}</p>
        <p>Runtime: ${movie.Runtime}</p>
        <p>IMDB Rating: ${movie.imdbRating}</p>
    `;

    movieDetailsContent.parentElement.style.display = "block";
}

searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if (!searchInput) {
        container.innerHTML = `<h2>Type the movie in the search box</h2>`;
        return;
    }
    fetchMovies(searchInput);
});

movieCloseBtn.addEventListener('click', () => {
    movieDetailsContent.parentElement.style.display = "none";
});
