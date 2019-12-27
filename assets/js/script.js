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
    const random = $(".randomBtn");
    const pastSearch = $("#pastSearchBtn");
    
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

    //ajax function to find a random recipe
    const rAjax = queryURL => {
        $.ajax({
            url: queryURL,
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
        sAjax(queryURL);
    });

    //on click event to search by recipe name
    sbrBtn.on("click", event => {
        event.preventDefault();
        let recipe = $(".searchByRecipe").val().trim();
        let queryURL = "https://api.spoonacular.com/recipes/search?apiKey="+APIKey+"&query="+recipe;
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
        sAjax(queryURL);
    });

    //on click event for random recipe
    random.on("click", ()=> {
        let queryURL = "https://api.spoonacular.com/recipes/random?apiKey="+APIKey+"&number=1";
        rAjax(queryURL);
    });

    //on click event for recipe buttons
    saved.on("click", event => {
        let identification = event.target.value;
        let recipeName = event.target.innerText;
        if(identification!==""&&identification!==undefined) {
            saveBtns(recipeName, identification);
            bAjax(identification);
        }
    });

    //on click event for past searches
    pastSearch.on("click", () => {
        display,saved.empty(); //does not clear recipe if one already loaded
        searchDisplay();
    });

    //displaying the results to the page----------------------------------------------------------------------------------------
    //function to check what type of search is done
    const searchCheck = response => {
        if(response.results) {
            searchData = response.results;
        }
        else if(response.recipes) {
            searchData = response.recipes[0];
        }
        else {
            searchData = response;
        }  
        return searchData;
    }

    //function to save recipes to local storage and check if it already exists
    const saveBtns = (recipeName, identification) => {
        let btns = [];
        let y = 0;
        while(localStorage.getItem("recipe"+y)) {
            let key = JSON.parse(localStorage.getItem("recipe"+y));
            btns.push(key.recipeName);
            y++;
        }
        if(!btns.includes(recipeName)){
            recipeTracker();
            let identity = JSON.stringify({recipeName, identification});
            localStorage.setItem("recipe"+z, identity);
            z++;
            localStorage.setItem("recipeTracker", z);
        }
    }

    //function to set recipe tracker
    const recipeTracker = () => {
        let tracker = localStorage.getItem("recipeTracker");
        if(tracker) {
            z =  tracker;
        }
        else {
            z = 0;
        }
        return z;
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
        searchCheck(response);
        display,saved.empty();
        let div = $("<div>").addClass("recipeDisplay");
        let img = $("<img>").addClass("recipeImage container");
        let title = $("<h3>").text(searchData.title);
        let information = $("<p>").html("Preparation: " + searchData.preparationMinutes + " minutes" + "<br/>" + "Cooking time: " + searchData.cookingMinutes + " minutes" + "<br/>" + "Servings: " + searchData.servings);
        let ingredients = $("<h3>").text("Ingredients");
        let ingList = $("<ul>");
        let instructions = $("<h3>").text("Instructions");
        let instList = $("<p>").text(searchData.instructions);

        img.attr("src", searchData.image);
        img.attr("alt", "Recipe Image");
        img.attr("style", "float:right; margin:0 10px 10px 0; max-width:400px; max-height:300px;");
    
        ingredientList(response, ingList);
        div.append(img, title, information, ingredients, ingList, instructions, instList);
        display.append(div);
    }

    //function to display the ingredient list
    const ingredientList = (response, ingList) => {
        searchCheck(response);
        let res = searchData.extendedIngredients;
        for(x=0; x<res.length; x++) {
            let li = $("<li>").text(res[x].name + " - " + res[x].amount + " " + res[x].unit);
            ingList.append(li);
        }
        return ingList;
    }

    //function to display the past searches
    const searchDisplay = () => {
        let y = 0;
        while(localStorage.getItem("recipe"+y)) {
            let key = JSON.parse(localStorage.getItem("recipe"+y));
            let button = $("<button>").text(key.recipeName);
            let cancel = $("<button>").text("X");
            button.val(key.identification);
            cancel.attr("style", "background-color:red; color:black;");
            saved.append(button,cancel);
            y++;
        }
    }
});