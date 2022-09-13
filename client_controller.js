/* Model */


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

    /* addMovie(movie) {
        this.imdbScoreMovies.push(movie);
    } */
}


/* Controller */


/* import { Category } from "./client_model"; */

const categories = [ new Category('All'), new Category('Action'), new Category('Family'), new Category('Comedy') ];
const titlesUrl = "http://localhost:8000/api/v1/titles/";
const firstUrls = [ titlesUrl + "?page=17150", titlesUrl + "?genre=Action&page=2570",
                    titlesUrl + "?genre=Family&page=770", titlesUrl + "?genre=Comedy&page=5850" ];

async function getMoviesTitlesData(url) {
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
            let value = await getMoviesTitlesData(nextUrl);
            rankBestMovies(genreIndex, value.results);
            nextUrl = value.next;
        } catch (error) {
            console.log(error);
            break;
        }
    }
    /* for (let movie of categories[0].imdbScoreMovies) {
        console.log(`${movie.id} ${movie.imdbScore} ${movie.imageUrl}`);
    } */
}

function main() {
    Promise.all([searchImdbScoresMax(0, firstUrls[0]), searchImdbScoresMax(1, firstUrls[1]),
                searchImdbScoresMax(2, firstUrls[2]), searchImdbScoresMax(3, firstUrls[3])])
    .then(() => {
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
