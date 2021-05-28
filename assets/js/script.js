let cuisineDropdown = document.querySelector("#cuisineDropdown");
let cuisineImgPlaceholder = document.querySelector("#cuisineImgPlaceholder");
let cuisineOnlyButton = document.querySelector("#cuisineShBtn");
let cuisinePicture = document.querySelector("#cuisinePicture");
let ingredientString;
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
let userSelectedCuisine = "";


// Fetches the data for a specific recipe
function getRecipeDetails (recipeIdentifier) {
    fetch('https://api.spoonacular.com/recipes/' + recipeIdentifier + '/analyzedInstructions?apiKey=6bcf2249e71b4f518c9bc66ffb045b87')
        .then(function (response) {
        return response.json();
    })
        .then(function (data) {
        console.log(data);
        console.log(data[0].steps);
        thingsToMake = data.length
        steps = data[0].steps;
        goThroughRecipeSteps();
    });
}

// Takes in the user specified search criteria and uses it to find them a random recipe matching that criteria
function getRandomRecipe (recipeRequestLink) {
    fetch(recipeRequestLink)
        .then(function (response) {
        return response.json();
    })
        .then(function (data) {
        recipeIdentifier = data.results[0].id;
        recipeImageLink = data.results[0].image;
        recipeTitle = data.results[0].title;
        recipeTitleArea.innerHTML = recipeTitle;
        cuisinePicture.setAttribute("src", recipeImageLink);
        cuisineImgPlaceholder.setAttribute("class", "image is-3by4");
        getRecipeDetails(recipeIdentifier);
    });
}

// Gets the user selected cuisine from the cuisine dropdown and creates a link to be fetched from
function getCuisineSelection () {
    if (userSelectedCuisine === ""){
        console.log("this");
        randomRecipeRequest = 'https://api.spoonacular.com/recipes/complexSearch?number=1&sort=random&type=main course&apiKey=6bcf2249e71b4f518c9bc66ffb045b87';
    } else {
        console.log(userSelectedCuisine);
        randomRecipeRequest = 'https://api.spoonacular.com/recipes/complexSearch?number=1&sort=random&type=main course&cuisine=' + userSelectedCuisine + '&apiKey=6bcf2249e71b4f518c9bc66ffb045b87';
        console.log(randomRecipeRequest);
    }
    getRandomRecipe(randomRecipeRequest);
}

// Goes through each of the steps for a recipe
function goThroughRecipeSteps () {
    for (let i = 0; i < steps.length; i++) {
        stepDetails = steps[i].step;
        let listItem = document.createElement("LI");
        listItem.innerHTML = stepDetails;
        orderedListForRecipe.appendChild(listItem);
        console.log(stepDetails);
        if (steps[i].ingredients.length !== 0) {
            stepIngredients = steps[i].ingredients;
            parseIngredientsIntoString();
        }
    }
}

// Goes through each step and grabs all of the required ingredients and puts them into one string
function parseIngredientsIntoString () {
    ingredientString = "";
    if( stepIngredients !== null) {
        for (let i = 0; i < stepIngredients.length; i++) {
            ingredient = stepIngredients[i].name;
            if(ingredientString === "") {
                ingredientString = ingredient; 
            }else {
                ingredientString = ingredientString.concat(', ', ingredient);
            }
        }
        let postedIngredientString = document.createElement("P");
        postedIngredientString.innerHTML = '- Ingredients Needed: ' + ingredientString;
        orderedListForRecipe.appendChild(postedIngredientString);
        console.log(ingredientString);
    }
}

// Clears out the area containing recipe information so it can be populated cleanly
function clearRecipeArea () {
    do{
        orderedListForRecipe.removeChild(orderedListForRecipe.childNodes[0]);
    }while(orderedListForRecipe.firstChild);
}

// When user selects a type of cuisine it is saved as a variable
function setUserCuisineChoice (event) {
    event.preventDefault();
    userSelectedCuisine = event.target; 
    userSelectedCuisine = userSelectedCuisine.innerHTML.trim();
}

cuisineDropdown.addEventListener("click", setUserCuisineChoice);
cuisineOnlyButton.addEventListener("click", getCuisineSelection);