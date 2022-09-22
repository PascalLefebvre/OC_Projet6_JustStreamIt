/* View */


import { categories } from "./client_controller";

const numberOfImagesByCarousel = 4;

export function updateHomePageData(bestMovie) {
    var arrows = document.querySelectorAll(".arrow img");
    arrows.forEach((arrow) => {
        if (arrow.getAttribute('id').includes('left')) {
            arrow.style.display = 'none';
        }
    });
    // Load the best movie data (all categories)
    document.querySelector("#banniere_film img").src = bestMovie.imageUrl;
    document.querySelector("#banniere_film h3").textContent = bestMovie.title;
    document.querySelector("#banniere_film p").textContent = bestMovie.abstract;
    // Load the top movies images by category
    const categoryImages = document.querySelectorAll(".carousel img");
    let i = 0;
    for (const category in categories) {
        for (let j = 0; j < numberOfImagesByCarousel; j++) {
            categoryImages[i].src = categories[category].imdbScoreMovies[j].imageUrl;
            categoryImages[i].setAttribute('id', categories[category].imdbScoreMovies[j].id);
            i++;
        }
    }
}

function displayCarouselImages(category, firstIndex, leftArrow, rightArrow) {
    const carouselImages = document.querySelectorAll(`#${category.genre} img`);
    var j = firstIndex;
    for (let i = 0; i < 4; i++) {
        carouselImages[i].src = category.imdbScoreMovies[j].imageUrl;
        carouselImages[i].setAttribute('id', category.imdbScoreMovies[j].id);
        j++;
    }
    switch (firstIndex) {
        case 0:
            leftArrow.style.display = 'none';
            break;
        case 3:
            rightArrow.style.display = 'none';
            break;
        default:
            leftArrow.style.display = 'block';
            rightArrow.style.display = 'block';
    }
    carouselImages[0].className = `${firstIndex}`;
}

export function moveCarouselImages() {
    // Get the arrow images that moves the carousel
    var arrows = document.querySelectorAll(".arrow img");

    // When the user clicks on the arrow, the images move
    arrows.forEach((arrow) => {
        arrow.onclick = function () {
            var arrowClass = arrow.getAttribute('id');
            const keyWords = arrowClass.split('_');
            const firstImageClass = document.querySelector(`#${keyWords[1]} img`);
            switch (keyWords[0]) {
                case 'left':
                    var rightArrow = document.querySelector(`#right_${keyWords[1]}`);
                    displayCarouselImages(categories[keyWords[1]], parseInt(firstImageClass.className)-1,
                                          arrow, rightArrow);
                    break;
                case 'right':
                    var leftArrow = document.querySelector(`#left_${keyWords[1]}`);
                    displayCarouselImages(categories[keyWords[1]], parseInt(firstImageClass.className)+1,
                                          leftArrow, arrow);
                    break;
            }
            
        }
    });
}

function fillModalWindow(movie) {
    var modalImage = document.querySelector('.modal-content img');
    var modalContent = document.querySelector('.modal-content p');
    modalImage.src = movie.imageUrl;
    modalContent.innerHTML = `<p>Titre : ${movie.title}<br>Genre(s) : ${movie.genres}
        <br>Date de sortie : ${movie.releaseDate}<br>Note (rated) : ${movie.rated}<br>Score Imdb : ${movie.imdbScore}
        <br>Réalisateur(s) : ${movie.directors}<br>Acteurs : ${movie.actors}<br>Durée (mn) : ${movie.duration}
        <br>Pays d'origine : ${movie.countries}<br>Résultat au Box Office : ${movie.boxOfficeResult}
        <br><br>Résumé : ${movie.abstract}</p>`;
}

/* Based on "https://www.w3schools.com/howto/howto_css_modals.asp" */
export function openModalWindow(bestMovie) {

    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var btn = document.getElementById("button_top1");

    // Get the images that opens the modal
    var images = document.querySelectorAll(".carousel img");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on the button, open the modal
    btn.onclick = function() {
        modal.style.display = "block";
        fillModalWindow(bestMovie);
    }

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
    })

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

    /* When the user clicks on the button,
       toggle between hiding and showing the dropdown content */
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