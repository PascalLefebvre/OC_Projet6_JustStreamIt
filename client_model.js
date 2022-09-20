/* Models */


export const numberOfMoviesByCategory = 7;

export class Movie {
    constructor(id, imageUrl, title, genre, releaseDate, rated, imdbScore,
                directors, actors, duration, countries, boxOfficeResult, abstract) {
        this.id = id;
        this.imageUrl = imageUrl;
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


export class Category {
    constructor(genre) {
        this.genre = genre;
        this.movies = [];
        this.imdbScoreMovies = [];
        this._intializeImdbScoreMovies();
    }

    _intializeImdbScoreMovies() {
        const emptyElement = {id: 0, imdbScore: 0, imageUrl: ''}
        if (this.genre == 'all') {
            for (let i = 0; i < numberOfMoviesByCategory+1; i++) {
                this.imdbScoreMovies.push(emptyElement);
            }
        } else {
            for (let i = 0; i < numberOfMoviesByCategory; i++) {
                this.imdbScoreMovies.push(emptyElement);
            }
        }
    }

    addMovie(movie) {
        this.movies.push(movie);
    }

    findCorrespondingMovie(id) {
        for (var index in this.imdbScoreMovies) {
            if (this.imdbScoreMovies[index].id == id) {
                return this.movies[index];
            }
        }
        return null;
    }
}