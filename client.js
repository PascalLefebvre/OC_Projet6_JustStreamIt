/* Models */


const numberOfMoviesByCategory = 7;

class Movie {
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


class Category {
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

// API url to access all the movies (five movies by web page).
const titlesUrl = "http://localhost:8000/api/v1/titles/";
// Search movies from these API urls (to the last page by default) => short search time here...
const firstUrls = {
    all:    `${titlesUrl}?page=16950`,
    action: `${titlesUrl}?genre=Action&page=2450`,
    family: `${titlesUrl}?genre=Family&page=650`,
    comedy: `${titlesUrl}?genre=Comedy&page=5750`
};

const categories = {
    all: new Category('all'),
    action: new Category('action'),
    family: new Category('family'),
    comedy: new Category('comedy')
};

const numberOfImagesByCarousel = 4;

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


/* View */

// Load the best movie data (all categories).
function initialiseBannerData(bestMovie) {
    document.querySelector("#film_banner img").src = bestMovie.imageUrl;
    document.querySelector("#film_banner h3").textContent = bestMovie.title;
    document.querySelector("#film_banner p").textContent = bestMovie.abstract;
}

// Load all the images from all the movies categories.
function initialiseCarouselImages(category) {
    // Hide the left arrow (useless at the beginning of the carousel).
    const arrowId = `left_${category.genre}`;
    document.getElementById(arrowId).style.display = 'none';
    
    const carouselImages = document.querySelectorAll(`#${category.genre} img`);
    let i = 0;
        for (let j = 0; j < numberOfImagesByCarousel; j++) {
            carouselImages[i].src = category.imdbScoreMovies[j].imageUrl;
            carouselImages[i].setAttribute('id', category.imdbScoreMovies[j].id);
            i++;
        }
}

function displayCarouselImages(category, firstMovieClass, leftArrow, rightArrow) {
/* 'category'        : movies category of the carousel ;
   'firstMovieClass' : the class (a number) of the first element 'img' of the carousel
                       "0" = start of the carousel, "3" = end of the carousel;
   'leftArrow'       : left arrow of the carousel;
   'rightArrow'      : right arrow of the carousel;
*/
    const carouselImages = document.querySelectorAll(`#${category.genre} img`);
    var j = firstMovieClass;
    for (let i = 0; i < 4; i++) {
        carouselImages[i].src = category.imdbScoreMovies[j].imageUrl;
        /* Assign the movie id to the html element id. It will be used to retrieve the
           movie data to fill the corresponding modal window. */
        carouselImages[i].setAttribute('id', category.imdbScoreMovies[j].id);
        j++;
    }
    switch (firstMovieClass) {
        // Located at the begining of the carousel.
        case 0:
            leftArrow.style.display = 'none';
            break;
        // Located at the end of the carousel.
        case 3:
            rightArrow.style.display = 'none';
            break;
        // Others locations in the carousel.
        default:
            leftArrow.style.display = 'block';
            rightArrow.style.display = 'block';
    }
    // Modify the class of the first element 'img' of the carousel.
    carouselImages[0].className = `${firstMovieClass}`;
}

function moveCarouselImages() {
    // Get the arrows images that moves the carousel
    var arrows = document.querySelectorAll(".arrow img");

    // When the user clicks on the arrow, the images move
    arrows.forEach((arrow) => {
        arrow.onclick = function () {
            // arrow id attribute = "<left|right>_<category genre>".
            var arrowClass = arrow.getAttribute('id');
            const keyWords = arrowClass.split('_');
            const directionArrow = keyWords[0];
            const categoryGenre = keyWords[1];
            const firstImageClass = document.querySelector(`#${categoryGenre} img`);
            switch (directionArrow) {
                case 'left':
                    var rightArrow = document.querySelector(`#right_${categoryGenre}`);
                    displayCarouselImages(categories[categoryGenre], parseInt(firstImageClass.className)-1,
                                          arrow, rightArrow);
                    break;
                case 'right':
                    var leftArrow = document.querySelector(`#left_${categoryGenre}`);
                    displayCarouselImages(categories[categoryGenre], parseInt(firstImageClass.className)+1,
                                          leftArrow, arrow);
                    break;
            }
            
        }
    });
}

function fillModalWindow(movie) {
    var modalImage = document.querySelector('.modal-content img');
    var modalContent = document.querySelector('.modal-content p');
    let boxOfficeResult = (movie.boxOfficeResult != null) ? movie.boxOfficeResult : "non renseigné";
    modalImage.src = movie.imageUrl;
    modalContent.innerHTML = `<p>Titre : ${movie.title}<br>Genre(s) : ${movie.genres}
        <br>Date de sortie : ${movie.releaseDate}<br>Note (rated) : ${movie.rated}<br>Score Imdb : ${movie.imdbScore}
        <br>Réalisateur(s) : ${movie.directors}<br>Acteurs : ${movie.actors}<br>Durée (mn) : ${movie.duration}
        <br>Pays d'origine : ${movie.countries}<br>Résultat au Box Office : ${boxOfficeResult}
        <br><br>Résumé : ${movie.abstract}</p>`;
}

/* Based on "https://www.w3schools.com/howto/howto_css_modals.asp" */
function openModalWindow(bestMovie = null) {
    // Get the modal
    var modal = document.getElementById("myModal");
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user click on an image.
    if (bestMovie == null) {
        // Get the images that opens the modal
        var images = document.querySelectorAll(".carousel img");
        // When the user clicks on the image, open the modal
        images.forEach((image) => {
            image.onclick = function () {
                modal.style.display = "block";
                var idMovie = image.getAttribute('id');
                for (let catKey in categories) {
                    var movie = categories[catKey].findCorrespondingMovie(idMovie);
                    if (movie != null) {
                        fillModalWindow(movie);
                        break;
                    }
                }
                if (movie == null) {
                    console.log(`Pas de film correspondant à l'identifiant ${idMovie}`);
                }
            };
        });
    }
    // When the user click on the banner button.
    else {
        // Get the button that opens the modal
        var btn = document.getElementById("button_top1");
        // When the user clicks on the button, open the modal
        btn.onclick = function() {
            modal.style.display = "block";
            fillModalWindow(bestMovie);
        }
    }
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }); 
}

/* Based on "https://www.w3schools.com/howto/howto_js_dropdown.asp" */
function manageDropdownMenu() {
    /* When the user clicks on the button, toggle between hiding and showing the dropdown content */
    const dropdownButton = document.querySelector('.btn_menu');
    dropdownButton.onclick = () => {
        document.querySelector(".categories_list").classList.toggle("show");
    }
    // Close the dropdown menu if the user clicks outside of it
    window.addEventListener('click', function(event) {
        if (!event.target.matches('.btn_menu')) {
            var dropdownMenu = document.querySelector(".categories_list");
            if (dropdownMenu.classList.contains('show')) {
                dropdownMenu.classList.remove('show');
            }            
        }
    });
}


/* Controller */

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
        manageDropdownMenu();
    })
    .catch((error) => {
        console.log(error);
    });
}

main()
