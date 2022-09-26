/* Controller */


import { Movie, Category } from "./client_model";
import { initialiseBannerData, initialiseCarouselImages, moveCarouselImages,
         manageDropdownMenu, openModalWindow } from "./client_view";
// API url to access all the movies (five movies by web page).
const titlesUrl = "http://localhost:8000/api/v1/titles/";
// Search movies from these API urls (to the last page by default) => short search time here...
/*const firstUrls = {
    all:    `${titlesUrl}?page=17160`,
    action: `${titlesUrl}?genre=Action&page=2570`,
    family: `${titlesUrl}?genre=Family&page=770`,
    comedy: `${titlesUrl}?genre=Comedy&page=5850`
};*/
// A longer search time here...
const firstUrls = {
    all:    `${titlesUrl}?page=16950`,
    action: `${titlesUrl}?genre=Action&page=2450`,
    family: `${titlesUrl}?genre=Family&page=650`,
    comedy: `${titlesUrl}?genre=Comedy&page=5750`
};

// The max search time (from the full database).
/*const firstUrls = {
    all:    `${titlesUrl}`,
    action: `${titlesUrl}?genre=Action`,
    family: `${titlesUrl}?genre=Family`,
    comedy: `${titlesUrl}?genre=Comedy`
};*/

export const categories = {
    all: new Category('all'),
    action: new Category('action'),
    family: new Category('family'),
    comedy: new Category('comedy')
};

// Got movies data from the API url
async function getMoviesData(url) {
    const result = await fetch(url);
    const value = await result.json();
    return value;
}

// Store the movie data, got from the API, in a movie object and add it to his category.
async function storeMovieData(id, category) {
    // API url to access all the necessary movie data.
    let idUrl = titlesUrl + id;
    try {
        const value = await getMoviesData(idUrl);
        const movie = new Movie(value.id, value.image_url, value.title, value.genres, value.year,
                                value.rated, value.imdb_score, value.directors, value.actors, value.duration,
                                value.countries, value.worldwide_gross_income, value.long_description);
        category.addMovie(movie);
        return movie;
    } catch (error) {
        console.log(error);
    }
}

// Use the "imdbScoreMovies" array to rank in descending order and store the best movies.
function rankBestMovies(category, movies) {
    for (let movie of movies) {
        for (let i in category.imdbScoreMovies) {
            if (movie.imdb_score > category.imdbScoreMovies[i].imdbScore) {
                let newElement = {id: movie.id, imdbScore: movie.imdb_score, imageUrl: movie.image_url};
                category.imdbScoreMovies.splice(i, 0, newElement);
                category.imdbScoreMovies.splice(category.imdbScoreMovies.length-1);
                break;
            }
        }
    }
}

// Search for the best movies in each category and initialise the website home page.
async function searchTopMovies(category, firstUrl, lastUrl = null) {
    let nextUrl = firstUrl;
    // Fecth, in each category, all the API pages from the "firstUrl" url to the last API url by default.
    while (nextUrl != lastUrl) {
        try {
            let value = await getMoviesData(nextUrl);
            rankBestMovies(category, value.results);
            nextUrl = value.next;
        } catch (error) {
            console.log(error);
            break;
        }
    }
    // Initialise the home page banner from the top movie data all categories together.
    if (category.genre == 'all') {
        const bestMovie = await storeMovieData(categories.all.imdbScoreMovies[0].id, categories.all);
        /* Delete the first element (the top movie) of these two arrays below
           to keep the following seven movies (like the others categories). */
        categories.all.imdbScoreMovies.shift();
        categories.all.movies.shift();
        initialiseBannerData(bestMovie);
        openModalWindow(bestMovie);
    }
    initialiseCarouselImages(category);
}

async function getAllDataForModalWindows() {
    for (let catKey in categories) {
        for (let movie of categories[catKey].imdbScoreMovies) {
            await storeMovieData(movie.id, categories[catKey]);
        }
    }
}

async function getAllDataForHomePage() {
    return Promise.all([searchTopMovies(categories.all, firstUrls.all),
                        searchTopMovies(categories.action, firstUrls.action),
                        searchTopMovies(categories.family, firstUrls.family),
                        searchTopMovies(categories.comedy, firstUrls.comedy)]);
}

function main() {
    getAllDataForHomePage()
    .then(async () => {
        moveCarouselImages();
        await getAllDataForModalWindows();
        openModalWindow();
    })
    .catch((error) => {
        console.log(error);
    });
    manageDropdownMenu();
}

main()
