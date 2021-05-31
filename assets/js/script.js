let cuisineDropdown = document.querySelector("#cuisineDropdown");
let cuisineImgPlaceholder = document.querySelector("#cuisineImgPlaceholder");
let cuisineOnlyButton = document.querySelector("#cuisineShBtn");
let cuisinePicture = document.querySelector("#cuisinePicture");
let ingredientString;
let listOfIngredients;
let movieOnlyButton = document.querySelector("#movieShBtn");
let orderedListForRecipe = document.querySelector("#orderedListForRecipe");
let pastCuisineArea = document.querySelector("#pastCuisineHistory");
let pickBothButton = document.querySelector("#bothShBtn");
let randomRecipeRequest;
let recipeIdentifier;
let recipeImageLink;
let recipeTextArea;
let recipeTitle;
let recipeTitleArea = document.querySelector("#recipeTitle");
let stepDetails;
let stepIngredients;
let steps;
let typeOfCuisineText = document.querySelector("#selectedTypeOfCuisineField");
let unorderedIngredientList = document.querySelector("#listForIngredients");
let userSelectedCuisine = "";
let userSelectedMovie = "";
let movieDropdown = document.querySelector("#movieDropdown");
let typeOfMovieText = document.querySelector("#selectedTypeOfMovieField")
let movieImgPlaceholder = document.querySelector("#movieImgPlaceholder");
let userSelectedMovieGenre = "";
let queryString;


    let api_key = 'd748f076b1e977b08676c44b46816848';
    let mainURL = `http://api.themoviedb.org/3/discover/movie/?api_key=${api_key}&language=en-US&sort_by=popularity.desc&include_adult=false&with_genres=`;

    //listener to movie button
    function createMovieQueryURL() {
        if (userSelectedMovieGenre === "") {
            queryURL =
                `${mainURL}` + '&page=' + [Math.floor(Math.random() * 9 + 1)] + '/';
        } else {
            queryURL =
                `${mainURL}` + userSelectedMovieGenre + '&page=' + [Math.floor(Math.random() * 9 + 1)] + '/';
        }
        ajaxMovieCall(queryURL);
    }
    
// call function
function ajaxMovieCall(queryURL) {
    $.ajax({
        url: queryURL,
        method: 'GET',
        success: function (response) {
            console.log(response);
        },
        error: function (response) {
            console.log(response);
        },
    }).then(function (response) {
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
    movieImgPlaceholder.setAttribute("class", "image is-5by3");
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

// Fetches the data for a specific recipe
function getRecipeDetails(recipeIdentifier) {
    fetch('https://api.spoonacular.com/recipes/' + recipeIdentifier + '/analyzedInstructions?apiKey=b7ca7b33f13b41f881b4b3c91ec90189')   //6bcf2249e71b4f518c9bc66ffb045b87  <- Scott T
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            console.log(data[0].steps);
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
            displayRecipeHeaderInfo(recipeIdentifier, recipeImageLink, recipeTitle);
        });
}

// Displays the Recipe header information on the page
function displayRecipeHeaderInfo (recipeIdentifier, recipeImageLink, recipeTitle) {
    addCuisineToHistory(recipeIdentifier, recipeImageLink, recipeTitle);
    recipeTitleArea.innerHTML = recipeTitle;
    cuisinePicture.setAttribute("src", recipeImageLink);
    cuisineImgPlaceholder.setAttribute("class", "image is-5by3");
    displayIngredientsBetter(recipeIdentifier);
    getRecipeDetails(recipeIdentifier);
}

// Gets the user selected cuisine from the cuisine dropdown and creates a link to be fetched from
function getCuisineSelection() {
    if (userSelectedCuisine === "" || userSelectedCuisine === "Random") {
        randomRecipeRequest = 'https://api.spoonacular.com/recipes/complexSearch?number=1&sort=random&type=main course&&apiKey=b7ca7b33f13b41f881b4b3c91ec90189';
    } else {
        randomRecipeRequest = 'https://api.spoonacular.com/recipes/complexSearch?number=1&sort=random&type=main course&cuisine=' + userSelectedCuisine + '&apiKey=b7ca7b33f13b41f881b4b3c91ec90189';
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

// When user selects a type of cuisine it is saved as a variable and updated on the page
function setUserCuisineChoice(event) {
    event.preventDefault();
    userSelectedCuisine = event.target;
    userSelectedCuisine = userSelectedCuisine.innerHTML.trim();
    typeOfCuisineText.innerHTML = "Type of Cuisine: " + userSelectedCuisine;
}

// When user selects a genre of movie it is saved as a variable and updated on the page
function setUserMovieChoice(event) {
    event.preventDefault();
    userSelectedMovie = event.target;
    userSelectedMovieGenre = userSelectedMovie.getAttribute("value");
    userSelectedMovie = userSelectedMovie.innerHTML.trim();
    typeOfMovieText.innerHTML = "Genre of Movie: " + userSelectedMovie;
    console.log(userSelectedMovieGenre);

}

// Fetches and displays the ingredients for the recipe
function displayIngredientsBetter (recipeIdentifier) {
    fetch('https://api.spoonacular.com/recipes/' + recipeIdentifier + '/information?includeNutrition=false&apiKey=b7ca7b33f13b41f881b4b3c91ec90189')
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
        return;
}

// Handles both searches for when the pick both button is pressed
function pickBothHandle() {
    getCuisineSelection();
    createMovieQueryURL();
}

// When a cuisine is searched it is then added to the local storage
function addCuisineToHistory (recipeIdentifier, recipeImageLink, recipeTitle) {
    if (localStorage.getItem('PreviousRecipes') === null){
        let recipeArray = [];
        let recipeObject = {};
        let item = {
            "id": recipeIdentifier,
            "imgLink": recipeImageLink,
            "title": recipeTitle
        }
        recipeObject.items = recipeArray;
        recipeObject.items.unshift(item);
        localStorage.setItem('PreviousRecipes', JSON.stringify(recipeObject));
    }else{
        recipeObject = JSON.parse(localStorage.getItem("PreviousRecipes"));
        for (let i = 0; i < recipeObject.items.length; i++){
            if (recipeObject.items[i].id === recipeIdentifier) {
                recipeObject.items.splice(i,1);
            }
        }
        if(recipeObject.items.length > 2) {
            recipeObject.items.pop();
        }
        let item = {
            "id": recipeIdentifier,
            "imgLink": recipeImageLink,
            "title": recipeTitle
        }
        recipeObject.items.unshift(item);
        localStorage.setItem('PreviousRecipes', JSON.stringify(recipeObject));
    }
    createRecipeButtons();
}

// Creates the buttons on the page for the Recent Recipes Area
function createRecipeButtons () {
    while (pastCuisineArea.firstChild){
        pastCuisineArea.removeChild(pastCuisineArea.firstChild);
    }
    if(localStorage.getItem("PreviousRecipes")!== null) {
        let recentRecipesList = JSON.parse(localStorage.getItem("PreviousRecipes"));
        for (let i = 0; i < recentRecipesList.items.length; i++){
            let newButton = document.createElement("BUTTON");
            newButton.setAttribute("class", "button is-large is-fullwidth recentCuisine");
            newButton.setAttribute("data-id", recentRecipesList.items[i].id);
            pastCuisineArea.appendChild(newButton);
            let newFigure = document.createElement("FIGURE");
            newFigure.setAttribute("class", "image is-48x48 ml-0");
            newButton.appendChild(newFigure);
            let newImg = document.createElement("IMG");
            newImg.setAttribute("src", recentRecipesList.items[i].imgLink);
            newImg.setAttribute("alt", "Cuisine");
            newFigure.appendChild(newImg);
            let newSpan = document.createElement("SPAN");
            newSpan.setAttribute("class", "is-size-4 has-text-weight-bold pl-6");
            newSpan.innerHTML = recentRecipesList.items[i].title;
            newButton.appendChild(newSpan);
        }
    }
}

// Handles when a button is clicked in the Recipe History Area
function handlePastRecipeAreaClick (event) {
    event.preventDefault();
    let newRecipe = event.target;
    if (newRecipe.nodeName === "BUTTON" || newRecipe.nodeName === "FIGURE" || newRecipe.nodeName === "IMG" || newRecipe.nodeName === "SPAN"){
        newRecipe = newRecipe.getAttribute("data-id");
        let recentRecipesList = JSON.parse(localStorage.getItem("PreviousRecipes"));
        for (let i = 0; i < recentRecipesList.items.length; i++){
            if (recentRecipesList.items[i].id == newRecipe) {
                recipeIdentifier = recentRecipesList.items[i].id;
                recipeImageLink = recentRecipesList.items[i].imgLink;
                recipeTitle = recentRecipesList.items[i].title;
                console.log(recipeIdentifier);
                displayRecipeHeaderInfo(recipeIdentifier, recipeImageLink, recipeTitle);
            }
    }
    } else{
        return;
    }

}

cuisineDropdown.addEventListener("click", setUserCuisineChoice);
cuisineOnlyButton.addEventListener("click", getCuisineSelection);
movieDropdown.addEventListener("click", setUserMovieChoice);
movieOnlyButton.addEventListener("click", createMovieQueryURL);
pickBothButton.addEventListener("click", pickBothHandle);
pastCuisineArea.addEventListener("click", handlePastRecipeAreaClick);

createRecipeButtons();