let ingredientString;
let stepDetails;
let stepIngredients;
let steps;
let thingsToMake;


// Fetches the data for a specific recipe
function testFunction () {
    fetch('https://api.spoonacular.com/recipes/324694/analyzedInstructions?apiKey=6bcf2249e71b4f518c9bc66ffb045b87')
        .then(function (response) {
        return response.json();
    })
        .then(function (data) {
        console.log(data);
        console.log(data[0].steps);
        thingsToMake = data.length
        steps = data[0].steps;
        goThroughSteps();
    });
}

// Goes through each of the steps for a recipe
function goThroughSteps () {
    for (let i = 0; i < steps.length; i++) {
        stepDetails = steps[i].step;
        if (stepDetails[i].ingredients !== null) {
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
        console.log(ingredientString);
    }
}

testFunction();