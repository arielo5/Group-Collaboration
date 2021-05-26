let cuisineDropdown;
let ingredientString;
let orderedListForRecipe = document.querySelector("#forRecipe");
let randomRecipeRequest;
let recipeTextArea;
let stepDetails;
let stepIngredients;
let steps;
let thingsToMake;
let userSelectedCuisine;


// Fetches the data for a specific recipe
function getRecipeDetails () {
    fetch('https://api.spoonacular.com/recipes/324694/analyzedInstructions?apiKey=6bcf2249e71b4f518c9bc66ffb045b87')
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
        console.log(data);
    });
}

// Gets the user selected cuisine from the cuisine dropdown
function getCuisineSelection () {
    userSelectedCuisine = cuisineDropdown.value;
    if (userSelectedCuisine === "Default"){
        randomRecipeRequest = 'https://api.spoonacular.com/recipes/random?number=1&apiKey=6bcf2249e71b4f518c9bc66ffb045b87';
    } else {
        randomRecipeRequest = 'https://api.spoonacular.com/recipes/random?number=1&tags=' + userSelectedCuisine + '&apiKey=6bcf2249e71b4f518c9bc66ffb045b87';
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

//getRecipeDetails();