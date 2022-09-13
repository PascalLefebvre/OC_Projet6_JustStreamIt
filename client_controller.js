/* Controller */


import { Movie, Category } from "./client_model";

const titlesUrl = "http://localhost:8000/api/v1/titles/?page=17150";

const allCategory = new Category('all');
const actionCategory = new Category('Action');
const familyCategory = new Category('Family');
const comedyCategory = new Category('Comedy');

var imdbScoreMovies = [ {id: 0, imdbScore: 0}, {id: 0, imdbScore: 0}, {id: 0, imdbScore: 0}, {id: 0, imdbScore: 0},
                        {id: 0, imdbScore: 0}, {id: 0, imdbScore: 0}, {id: 0, imdbScore: 0}, {id: 0, imdbScore: 0} ];

function searchImdbScoreMax(url) {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await fetch(url);
            const value = await result.json();
            let movies = value.results;
            for (let movie of movies) {
                for (let i in imdbScoreMovies) {
                    if (movie.imdb_score > imdbScoreMovies[i].imdbScore) {
                        let newElement = {id: movie.id, imdbScore: movie.imdb_score};
                        imdbScoreMovies.splice(i, 0, newElement);
                        imdbScoreMovies.splice(imdbScoreMovies.length-1);
                        break;
                    }
                }
            }
            resolve(value.next);
        } catch (error) {
            // Une erreur est survenue
            reject(error);
        }
    });
}

async function main() {
    let nextUrl = titlesUrl;
    while (nextUrl != null) {
        try {
            nextUrl = await searchImdbScoreMax(nextUrl);
        } catch (error) {
            console.log(error);
        }
    }
    for (let movie of imdbScoreMovies) {
        console.log(movie.id + " " + movie.imdbScore);
    }
}

main()
