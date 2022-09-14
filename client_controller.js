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
        this.imdbScoreMovies = [];
        this._intializeImdbScoreMovies();
    }

    _intializeImdbScoreMovies() {
        const emptyElement = {id: 0, imdbScore: 0, imageUrl: ''}
        if (this.genre == 'All') { var elementsNumber = 8; } else { var elementsNumber = 7; }
        for (let i = 0; i < elementsNumber; i++) {
            this.imdbScoreMovies.push(emptyElement);
        }
    }
}


/* Controller */


/* import { Category } from "./client_model"; */

const categories = [ new Category('All'), new Category('Action'), new Category('Family'), new Category('Comedy') ];
const titlesUrl = "http://localhost:8000/api/v1/titles/";
const firstUrls = [ titlesUrl + "?page=17150", titlesUrl + "?genre=Action&page=2570",
                    titlesUrl + "?genre=Family&page=770", titlesUrl + "?genre=Comedy&page=5850" ];

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

function rankBestMovies(index, movies) {
    for (let movie of movies) {
        for (let i in categories[index].imdbScoreMovies) {
            if (movie.imdb_score > categories[index].imdbScoreMovies[i].imdbScore) {
                let newElement = {id: movie.id, imdbScore: movie.imdb_score, imageUrl: movie.image_url};
                categories[index].imdbScoreMovies.splice(i, 0, newElement);
                categories[index].imdbScoreMovies.splice(categories[index].imdbScoreMovies.length-1);
                break;
            }
        }
    }
}

async function searchImdbScoresMax(genreIndex, firstUrl, lastUrl = null) {
    let nextUrl = firstUrl;
    while (nextUrl != lastUrl) {
        try {
            let value = await getMoviesData(nextUrl);
            rankBestMovies(genreIndex, value.results);
            nextUrl = value.next;
        } catch (error) {
            console.log(error);
            break;
        }
    }
}

async function storeMovieData(id) {
    let idUrl = titlesUrl + id;
    try {
        const value = await getMoviesData(idUrl);
        return new Movie(value.id, value.image_url, value.title, value.genres, value.year, value.rated,
                         value.imdbScore, value.directors, value.actors, value.duration, value.countries,
                         value.worldwide_gross_income, value.long_description);
    } catch (error) {
        console.log(error);
    }
}

function main() {
    Promise.all([searchImdbScoresMax(0, firstUrls[0]), searchImdbScoresMax(1, firstUrls[1]),
                searchImdbScoresMax(2, firstUrls[2]), searchImdbScoresMax(3, firstUrls[3])])
    .then(async () => {
        const topMovie = await storeMovieData(categories[0].imdbScoreMovies[0].id);
        console.log(topMovie.title);
        for (let categorie of categories) {
            console.log(categorie.genre);
            for (let movie of categorie.imdbScoreMovies) {
                console.log(`${movie.id} ${movie.imdbScore} ${movie.imageUrl}`);
            }
        }
    })
    .catch(function(error) {
        console.log(error);
    });
}

main()
