let cuisineDropdown = document.querySelector("#cuisineDropdown");
let cuisineImgPlaceholder = document.querySelector("#cuisineImgPlaceholder");
let cuisineOnlyButton = document.querySelector("#cuisineShBtn");
let cuisinePicture = document.querySelector("#cuisinePicture");
let ingredientString;
let listOfIngredients;
let orderedListForRecipe = document.querySelector("#orderedListForRecipe");
let randomRecipeRequest;
let recipeIdentifier;
let recipeImageLink;
let recipeTextArea;
let recipeTitle;
let recipeTitleArea = document.querySelector("#recipeTitle");
let stepDetails;
let stepIngredients;
let steps;
let thingsToMake;
let typeOfCuisineText = document.querySelector("#selectedTypeOfCuisineField");
let unorderedIngredientList = document.querySelector("#listForIngredients");
let userSelectedCuisine = "";
let userSelectedMovie = "";
let movieDropdown = document.querySelector("#movieDropdown");
let typeOfMovieText = document.querySelector("#selectedTypeOfMovieField")
let movieImgPlaceholder = document.querySelector("#movieImgPlaceholder");
let userSelectedMovieGenre = "";
let queryString;


$(document).ready(function() {
    let api_key = 'd748f076b1e977b08676c44b46816848';
    let mainURL = `http://api.themoviedb.org/3/discover/movie/?api_key=${api_key}&language=en-US&sort_by=popularity.desc&include_adult=false&with_genres=`;

    //listener to movie button
    $('.movie-moods').on('click', function() {

        if (userSelectedMovieGenre === "") {
            queryURL =
                `${mainURL}` + '&page=' + [Math.floor(Math.random() * 9 + 1)] + '/';
        } else {
            queryURL =
                `${mainURL}` + userSelectedMovieGenre + '&page=' + [Math.floor(Math.random() * 9 + 1)] + '/';
        }
        console.log(queryURL);

        ajaxMovieCall(queryURL);
    });
    // call function
    function ajaxMovieCall(queryURL) {
        $.ajax({
            url: queryURL,
            method: 'GET',
            success: function(response) {
                console.log(response);
            },
            error: function(response) {
                console.log(response);
            },
        }).then(function(response) {
            console.log(response);
            console.log(response.results[0].poster_path);
            renderMovies(response, 1);
        });
    }
    //fuction that renders movie
    function renderMovie(movie) {
        let posterImageCode = movie.backdrop_path;
        let posterImageURL = `https://image.tmdb.org/t/p/w500/${posterImageCode}`;
        document.getElementById("picturelink").src = posterImageURL;

        let titleMovie = movie.title;
        document.getElementById("movieT").innerHTML = titleMovie;
        let overviewMovie = movie.overview;
        document.getElementById("overview").innerHTML = "Synopsis: " + overviewMovie;
        let releaseMovie = movie.release_date;
        document.getElementById("release").innerHTML = "Release Date: " + releaseMovie;
        let ratingMovie = movie.vote_average;
        document.getElementById("ratings").innerHTML = "Rating: " + ratingMovie;
        let moviesList = $('#movies-list');
        movieImgPlaceholder.setAttribute("class", "image is-3by4");


        moviesList.append(movieContent);
    }

    function cleanMoviesList(movie) {
        let moviesList = $('#movies-list');
        moviesList.empty();
    }
    //generating random number
    function getRandomMovie(movies) {
        let randomNumber = Math.floor(Math.random() * movies.results.length);
        let movie = movies.results[randomNumber];

        return movie;
    }
    //for loop if user would like to display more than one movie
    function renderMovies(movies, length) {
        cleanMoviesList();

        for (let i = 0; i < length; i++) {
            let randomMovie = getRandomMovie(movies);
            renderMovie(randomMovie);
        }
    }
});

// Fetches the data for a specific recipe
function getRecipeDetails(recipeIdentifier) {
    fetch('https://api.spoonacular.com/recipes/' + recipeIdentifier + '/analyzedInstructions?apiKey=6bcf2249e71b4f518c9bc66ffb045b87')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            console.log(data[0].steps);
            thingsToMake = data.length
            steps = data[0].steps;
            goThroughRecipeSteps();
        });
}

// Takes in the user specified search criteria and uses it to find them a random recipe matching that criteria
function getRandomRecipe(recipeRequestLink) {
    fetch(recipeRequestLink)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            recipeIdentifier = data.results[0].id;
            recipeImageLink = data.results[0].image;
            recipeTitle = data.results[0].title;
            recipeTitleArea.innerHTML = recipeTitle;
            cuisinePicture.setAttribute("src", recipeImageLink);
            cuisineImgPlaceholder.setAttribute("class", "image is-3by4");
            displayIngredientsBetter(recipeIdentifier);
            getRecipeDetails(recipeIdentifier);
        });
}

// Gets the user selected cuisine from the cuisine dropdown and creates a link to be fetched from
function getCuisineSelection() {
    if (userSelectedCuisine === "" || userSelectedCuisine === "Random") {
        randomRecipeRequest = 'https://api.spoonacular.com/recipes/complexSearch?number=1&sort=random&type=main course&apiKey=6bcf2249e71b4f518c9bc66ffb045b87';
    } else {
        randomRecipeRequest = 'https://api.spoonacular.com/recipes/complexSearch?number=1&sort=random&type=main course&cuisine=' + userSelectedCuisine + '&apiKey=6bcf2249e71b4f518c9bc66ffb045b87';
    }
    getRandomRecipe(randomRecipeRequest);
}

// Goes through each of the steps for a recipe
function goThroughRecipeSteps() {
    clearRecipeArea();
    for (let i = 0; i < steps.length; i++) {
        stepDetails = steps[i].step;
        let listItem = document.createElement("LI");
        listItem.innerHTML = stepDetails;
        orderedListForRecipe.appendChild(listItem);
    }
}

// Clears out the area containing recipe information so it can be populated cleanly
function clearRecipeArea() {
    for(let i = 0; i < orderedListForRecipe.children.length; i++){
        orderedListForRecipe.removeChild(orderedListForRecipe.children[i]);
        i--;
    }
}

// Clears out the area containing required ingredients so it can be populated cleanly
function clearIngredientArea() {
    for(let i = 0; i < unorderedIngredientList.children.length; i++){
        unorderedIngredientList.removeChild(unorderedIngredientList.children[i]);
        i--;
    }
}

// When user selects a type of cuisine it is saved as a variable
function setUserCuisineChoice(event) {
    event.preventDefault();
    userSelectedCuisine = event.target;
    userSelectedCuisine = userSelectedCuisine.innerHTML.trim();
    typeOfCuisineText.innerHTML = "Type of Cuisine: " + userSelectedCuisine;
}


function setUserMovieChoice(event) {
    event.preventDefault();
    userSelectedMovie = event.target;
    userSelectedMovieGenre = userSelectedMovie.getAttribute("value");
    userSelectedMovie = userSelectedMovie.innerHTML.trim();
    typeOfMovieText.innerHTML = "Genre of Movie: " + userSelectedMovie;
    console.log(userSelectedMovieGenre);

}

function displayIngredientsBetter (recipeIdentifier) {
    fetch('https://api.spoonacular.com/recipes/' + recipeIdentifier + '/information?includeNutrition=false&apiKey=6bcf2249e71b4f518c9bc66ffb045b87')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            clearIngredientArea()
            listOfIngredients = data.extendedIngredients;
            for(let i = 0; i < listOfIngredients.length; i++){
                console.log(listOfIngredients[i].original);
                let ingredientNeeded = document.createElement("LI");
                ingredientNeeded.innerHTML = listOfIngredients[i].original;
                unorderedIngredientList.appendChild(ingredientNeeded);
            }
        });
}


movieDropdown.addEventListener("click", setUserMovieChoice);
cuisineDropdown.addEventListener("click", setUserCuisineChoice);
cuisineOnlyButton.addEventListener("click", getCuisineSelection);