/* Models */

export class Movie {
    constructor(image, title, genre, releaseDate, rated, imdbScore,
                directors, actors, duration, countries, boxOfficeResult, abstract) {
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
    }

    addMovie(movie) {
        this.movies.push(movie);
    }
}
