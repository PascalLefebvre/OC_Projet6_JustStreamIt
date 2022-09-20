/* Controller */


import { Movie, Category } from "./client_model";
import { updateHomePageData, openModalWindow } from "./client_view";

const titlesUrl = "http://localhost:8000/api/v1/titles/";
const firstUrls = {
    all:    `${titlesUrl}?page=17160`,
    action: `${titlesUrl}?genre=Action&page=2570`,
    family: `${titlesUrl}?genre=Family&page=770`,
    comedy: `${titlesUrl}?genre=Comedy&page=5850`
};
export const categories = {
    all: new Category('all'),
    action: new Category('action'),
    family: new Category('family'),
    comedy: new Category('comedy')
};

async function storeMovieData(id, category) {
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

async function getMoviesData(url) {
    const result = await fetch(url);
    const value = await result.json();
    return value;
}

async function getAllDataForModalWindows() {
    for (let catKey in categories) {
        for (let movie of categories[catKey].imdbScoreMovies) {
            await storeMovieData(movie.id, categories[catKey]);
        }
    }
}

async function searchImdbScoresMax(category, firstUrl, lastUrl = null) {
    let nextUrl = firstUrl;
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
}

function getAllDataForHomePage() {
    Promise.all([searchImdbScoresMax(categories.all, firstUrls.all),
                searchImdbScoresMax(categories.action, firstUrls.action),
                searchImdbScoresMax(categories.family, firstUrls.family),
                searchImdbScoresMax(categories.comedy, firstUrls.comedy)])
    .then(async () => {
        const bestMovie = await storeMovieData(categories.all.imdbScoreMovies[0].id, categories.all);
        //categories.all.deleteBestMovie;
        categories.all.imdbScoreMovies.shift();
        categories.all.movies.shift();
        updateHomePageData(bestMovie);
        await getAllDataForModalWindows();
        openModalWindow(bestMovie);
    })
    .catch((error) => {
        console.log(error);
    });
}

function main() {
    getAllDataForHomePage();
}

main()
