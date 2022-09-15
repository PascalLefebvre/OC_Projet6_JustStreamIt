/* Model */


class Movie {
    constructor(id, image, title, genre, releaseDate, rated, imdbScore,
                directors, actors, duration, countries, boxOfficeResult, abstract) {
        this.id = id;
        this.image = image;
        this.title = title;
        this.genre = genre;
        this.releaseDate = releaseDate;
        this.rated = rated;
        this.imdbScore = imdbScore;
        this.directors = directors;
        this.actors = actors;
        this.duration = duration;
        this.countries = countries;
        this.boxOfficeResult = boxOfficeResult;
        this.abstract = abstract;
    }
}


class Category {
    constructor(genre) {
        this.genre = genre;
        this.movies = [];
        this.imdbScoreMovies = [];
        this._intializeImdbScoreMovies();
    }

    _intializeImdbScoreMovies() {
        const emptyElement = {id: 0, imdbScore: 0, imageUrl: ''}
        if (this.genre == 'all') { var elementsNumber = numberOfMoviesByCategory + 1 } else { var elementsNumber = numberOfMoviesByCategory }
        for (let i = 0; i < elementsNumber; i++) {
            this.imdbScoreMovies.push(emptyElement);
        }
    }

    addMovie(movie) {
        this.movies.push(movie);
    }
}


/* View */


function updateHomePageData() {
    // Load top movie data all categories
    document.querySelector("#banniere_film img").src = categories.all.movies[0].image;
    document.querySelector("#banniere_film h3").textContent = categories.all.movies[0].title;
    document.querySelector("#banniere_film p").textContent = categories.all.movies[0].abstract;
    //
    const categoryImages = document.querySelectorAll(".category img");
    let i = 0;
    for (const category in categories) {
        if (category == 'all') {
            for (let j = 1; j < numberOfMoviesByCategory+1; j++) {
                categoryImages[i].src = categories[category].imdbScoreMovies[j].imageUrl;
                i++;
            }
        } else {
            for (let j = 0; j < numberOfMoviesByCategory; j++) {
                categoryImages[i].src = categories[category].imdbScoreMovies[j].imageUrl;
                i++;
            }
        }
    }
    /*for (let catIndex in genres) {
        if (catIndex == 0) { var i = 1 } else { var i = 0 };
        var categoryImages = document.querySelectorAll(categoryHtmlId[catIndex]);
        while (i < categories.genres[catIndex].imdbScoreMovies.length) {
            categoryImages[i].src = categories.all.imdbScoreMovies[i].imageUrl;
            i++;
        }
    }*/
}


/* Controller */


/* import { Category } from "./client_model"; */

//const categoryHtmlId = [ "#top_rated img", "#action_top_rated img", "#family_top_rated img", "#comedy_top_rated img"];
const numberOfMoviesByCategory = 7;
const titlesUrl = "http://localhost:8000/api/v1/titles/";
const firstUrls = {
    all:    `${titlesUrl}?page=17160`,
    action: `${titlesUrl}?genre=Action&page=2570`,
    family: `${titlesUrl}?genre=Family&page=770`,
    comedy: `${titlesUrl}?genre=Comedy&page=5850`
};
const categories = {
    all: new Category('all'),
    action: new Category('action'),
    family: new Category('family'),
    comedy: new Category('comedy')
};

async function getMoviesData(url) {
    try {
        const result = await fetch(url);
        const value = await result.json();
        return value;
    } catch (error) {
        // Une erreur est survenue
        throw error;
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

async function storeMovieData(id, category) {
    let idUrl = titlesUrl + id;
    try {
        const value = await getMoviesData(idUrl);
        const movie = new Movie(value.id, value.image_url, value.title, value.genres, value.year,
                                value.rated, value.imdbScore, value.directors, value.actors, value.duration,
                                value.countries, value.worldwide_gross_income, value.long_description);
        category.addMovie(movie);
    } catch (error) {
        console.log(error);
    }
}

function getAllDataForHomePage() {
    Promise.all([searchImdbScoresMax(categories.all, firstUrls.all),
                searchImdbScoresMax(categories.action, firstUrls.action),
                searchImdbScoresMax(categories.family, firstUrls.family),
                searchImdbScoresMax(categories.comedy, firstUrls.comedy)])
    .then(async () => {
        /* for (let catKey in categories) {
            console.log(categories[catKey].genre);
            for (let movie of categories[catKey].imdbScoreMovies) {
                console.log(`${movie.id} ${movie.imdbScore} ${movie.imageUrl}`);
            }
        } */
        await storeMovieData(categories.all.imdbScoreMovies[0].id, categories.all);
        updateHomePageData();
    })
    .catch((error) => {
        console.log(error);
    });
}

function main() {
    getAllDataForHomePage();
}

main()
