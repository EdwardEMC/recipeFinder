$(document).ready(() => {
    const APIKey = "9ddf30e43c5a4cc697a9fc839fec69b2";
    const sbiBtn = $(".sbiBtn");
    const sbrBtn = $(".sbrBtn");
    const modal = $("#advModal");
    const advBtn = $(".advModalOpen");
    const span = $(".close");
    const advSearchBtn = $(".advSearch");
    const saved = $(".savedSearches");
    const display = $(".recipeDisplayArea");
    
    //ajax request and button functions----------------------------------------------------------------------------------------
    //ajax function to finder recipe buttons and find id's for recipe information
    const sAjax = (queryURL) => {
        $.ajax({
            url: queryURL,
            METHOD: "GET"
        }).then(function(response){
            console.log(response);
            if(response.number===1) { //displays the recipe if only 1 result is selected from the advanced search area
                bAjax(response.results[0].id);
            }
            else {
                recipeButton(response);
            }
        });
    }

    //ajax function to find complete recipes using the id's from sAjax
    const bAjax = identification => {
        $.ajax({
            url: "https://api.spoonacular.com/recipes/"+identification+"/information?apiKey="+APIKey,
            METHOD: "GET"
        }).then(function(response){
            console.log(response);
            displayData(response);
        });
    }

    //on click to open the advanced search modal
    advBtn.on("click", () => modal.css("display", "block"));

    //clicking the x button will close the modal
    span.on("click", () => modal.css("display", "none"));

    //on click event to search by ingredient
    sbiBtn.on("click", event => {
        event.preventDefault();
        let ingredient = $(".searchByIngredient").val();
        let queryURL = "https://api.spoonacular.com/recipes/findByIngredients?apiKey="+APIKey+"&ingredients="+ingredient+"&number=10";
        console.log(queryURL);
        sAjax(queryURL);
    });

    //on click event to search by recipe name
    sbrBtn.on("click", event => {
        event.preventDefault();
        let recipe = $(".searchByRecipe").val().trim();
        let queryURL = "https://api.spoonacular.com/recipes/search?apiKey="+APIKey+"&query="+recipe;
        console.log(queryURL);
        sAjax(queryURL);
    });

    //on click event for advanced search
    advSearchBtn.on("click", event => {
        event.preventDefault();
        let ingredients = [];
        for(let x=1; x<7; x++) {
            if($("#ingredient"+x).val()!=="") {
                ingredients.push($("#ingredient"+x).val());
            }
        }
        let resultNum = $("#numberOfResults").val(); //---change to drop down eventually
        let queryURL = "https://api.spoonacular.com/recipes/complexSearch?apiKey="+APIKey+"&includeIngredients="+ingredients+"&number="+resultNum+"&instructionsRequired=true&fillIngredients=true&addRecipeInformation=true";
        for(let x=1; x<7; x++) {
            $("#ingredient"+x).val("");
                
        }
        modal.css("display", "none");
        console.log(queryURL);
        sAjax(queryURL);
    });

    //on click event for recipe buttons
    saved.on("click", event => {
        let identification = event.target.value;
        if(identification!==""&&identification!==undefined) {
            bAjax(identification);
        }
    });

    //on click to go back to searches --- currently not working
    // display.on("click", event => {
    //     let confirm = event.target.value;
    //     if(confirm!=="button") {
    //         console.log(confirm);
    //     }
    //     else {
    //         location.reload;
    //     }
    // });

    //displaying the results to the page----------------------------------------------------------------------------------------
    //function to check what type of search is done
    const searchCheck = response => {
        if(response.results) {
            searchData = response.results;
        }
        else {
            searchData = response;
        }  
        return searchData;
    }

    //function to display results as buttons
    const recipeButton = response => {
        searchCheck(response);
        for(x=0; x<searchData.length; x++) {
            let button = $("<button>");
            button.text(searchData[x].title);
            button.val(searchData[x].id);
            button.attr("id", "button"+x);
            saved.append(button);
        }
    }

    //function to get the response data and display to page
    const displayData = response => {
        display,saved.empty();
        let div = $("<div>").addClass("recipeDisplay");
        let img = $("<img>").addClass("recipeImage container");
        let title = $("<h3>").text(response.title);
        let information = $("<p>").html("Preparation: " + response.preparationMinutes + " minutes" + "<br/>" + "Cooking time: " + response.cookingMinutes + " minutes" + "<br/>" + "Servings: " + response.servings);
        let ingredients = $("<h3>").text("Ingredients");
        let ingList = $("<ul>");
        let instructions = $("<h3>").text("Instructions");
        let instList = $("<p>").text(response.instructions);
        let button = $("<button>").addClass("btn btn-info");

        img.attr("src", response.image);
        img.attr("alt", "Recipe Image");
        img.attr("style", "float:right; margin:0 10px 10px 0; max-width:300px; max-height:300px;");
        button.attr("style", "float:right;");
        button.text("Back to Search");
        button.val("button");
        
        ingredientList(response, ingList);
        div.append(img, title, information, ingredients, ingList, instructions, instList, button);
        display.append(div);
    }

    //function to display the ingredient list
    const ingredientList = (response, ingList) => {
        let res = response.extendedIngredients;
        for(x=0; x<res.length; x++) {
            let li = $("<li>").text(res[x].name + " - " + res[x].amount + " " + res[x].unit);
            ingList.append(li);
        }
        return ingList;
    }
});