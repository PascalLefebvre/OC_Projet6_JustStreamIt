/* Models */

export class Movie {
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


export class Category {
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
