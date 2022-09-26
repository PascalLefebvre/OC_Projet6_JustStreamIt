/* Models */


export const numberOfMoviesByCategory = 7;

export class Movie {
    constructor(id, imageUrl, title, genres, releaseDate, rated, imdbScore,
                directors, actors, duration, countries, boxOfficeResult, abstract) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.title = title;
        this.genres = genres;
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


export class Category {
    constructor(genre) {
        this.genre = genre;
        this.movies = []; // Store the movie object.
        this.imdbScoreMovies = []; // Store the 'id', 'imdb score' and 'image url' of the movie.
        this._intializeImdbScoreMovies();
    }

    _intializeImdbScoreMovies() {
        const emptyElement = {id: 0, imdbScore: 0, imageUrl: ''}
        if (this.genre == 'all') {
            /* Create an array of eight elements because we have eight movies in this category :
               the top movie and the other seven displayed in the all category carousel. */
            for (let i = 0; i < numberOfMoviesByCategory+1; i++) {
                this.imdbScoreMovies.push(emptyElement);
            }
        } else {
            // Create an array of seven elements otherwise.
            for (let i = 0; i < numberOfMoviesByCategory; i++) {
                this.imdbScoreMovies.push(emptyElement);
            }
        }
    }

    addMovie(movie) {
        this.movies.push(movie);
    }

    findCorrespondingMovie(id) {
        for (let index in this.imdbScoreMovies) {
            if (this.imdbScoreMovies[index].id == id) {
                return this.movies[index];
            }
        }
        return null;
    }
}