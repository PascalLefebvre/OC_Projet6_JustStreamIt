/* View */


import { categories } from "./client_controller";

const numberOfImagesByCarousel = 4;

// Load the best movie data (all categories).
export function initialiseBannerData(bestMovie) {
    document.querySelector("#film_banner img").src = bestMovie.imageUrl;
    document.querySelector("#film_banner h3").textContent = bestMovie.title;
    document.querySelector("#film_banner p").textContent = bestMovie.abstract;
}

// Load all the images from all the movies categories.
export function initialiseCarouselImages(category) {
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

export function moveCarouselImages() {
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
export function openModalWindow(bestMovie = null) {
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
export function manageDropdownMenu() {
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