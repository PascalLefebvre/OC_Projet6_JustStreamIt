/* View */


import { numberOfMoviesByCategory } from "./client_model";
import { categories } from "./client_controller";

export function updateHomePageData(bestMovie) {
    // Load the best movie data (all categories)
    document.querySelector("#banniere_film img").src = bestMovie.imageUrl;
    document.querySelector("#banniere_film h3").textContent = bestMovie.title;
    document.querySelector("#banniere_film p").textContent = bestMovie.abstract;
    // Load the top movies images by category
    const categoryImages = document.querySelectorAll(".category img");
    let i = 0;
    for (const category in categories) {
        for (let j = 0; j < numberOfMoviesByCategory; j++) {
            categoryImages[i].src = categories[category].imdbScoreMovies[j].imageUrl;
            categoryImages[i].setAttribute('id', categories[category].imdbScoreMovies[j].id);
            i++;
        }
    }
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
    /*document.querySelector('#button_top1').addEventListener('click', () => {
        console.log('toto');
    });*/
    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var btn = document.getElementById("button_top1");

    // Get the images that opens the modal
    var images = document.querySelectorAll(".category img");

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
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    } 
}

