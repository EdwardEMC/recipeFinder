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
    const shoppingCart = $("#shoppingCart");
    
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
        let resultNum = $("select").val(); //---change to drop down eventually
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
        if(identification!==""&&
        identification!==undefined&&
        identification!=="deleteBtn"&&
        identification!==" "&& //find a way to fix this mess
        identification!=="1"&&
        identification!=="2"&&
        identification!=="3"&&
        identification!=="4"&&
        identification!=="5"&&
        identification!=="6"&&
        identification!=="7"&&
        identification!=="8"&&
        identification!=="9"&&
        identification!=="10") {
            saveBtns(recipeName, identification);
            bAjax(identification);
        }
        else if(identification==="deleteBtn") {
            deleteBtn(event);
        }
    });

    //on click event to display past searches
    pastSearch.on("click", () => {
        display,saved.empty(); 
        $(".recipeDisplay").remove();
        searchDisplay();
    });

    //on click event for Add button to see what ingredients are checked/unchecked
    $(document).on("click", ".recipeDisplay .exportIngredients", () => {
        exported();
    });

    //on click event for Shopping Cart
    shoppingCart.on("click", () => {
        display,saved.empty(); 
        $(".recipeDisplay").remove();
        shopping();
    });

    //on click event for clearing shopping cart list
    $(document).on("click",".savedSearches .listDisplay .clearList", () => {
        localStorage.removeItem("shoppingList");
        location.reload();
    });

    //on click event to clear all past searches/recipe tracker
    $(document).on("click",".savedSearches .clearSearches", () => {
        for(let y=0; y<parseInt(localStorage.getItem("recipeTracker")); y++) {
            let key = JSON.parse(localStorage.getItem("recipe"+y));
            if(key) {
                localStorage.removeItem("recipe"+y);
            }
        }
        localStorage.removeItem("recipeTracker");
        location.reload();
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
        for(let x=0; x<parseInt(localStorage.getItem("recipeTracker")); x++) {
            let key = JSON.parse(localStorage.getItem("recipe"+x));
            if(key) {
                btns.push(key.recipeName);
            }
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
        $(".buttonDisplayArea").remove();
        let div = $("<div>").addClass("buttonDisplayArea");
        for(x=0; x<searchData.length; x++) {
            let button = $("<button>");
            button.text(searchData[x].title);
            button.val(searchData[x].id);
            button.attr("id", "button"+x);
            div.append(button);
        }
        saved.append(div);
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
        let exportBtn = $("<button>").text("Add");
        let ingList = $("<ul>");
        let instructions = $("<h3>").text("Instructions");
        let instList = $("<p>").text(searchData.instructions);

        exportBtn.attr({
            class: "exportIngredients btn btn-sm btn-success",
            style: "margin-left:10px;"
        });

        img.attr({
            src: searchData.image,
            alt: "Recipe Image",
            style: "float:right; margin:0 10px 10px 0; max-width:400px; max-height:300px;"
        });
    
        ingredientList(response, ingList);

        ingredients.append(exportBtn);
        div.append(img, title, information, ingredients, ingList, instructions, instList);
        display.append(div);
    }

    //function to display the ingredient list
    const ingredientList = (response, ingList) => {
        searchCheck(response);
        let res = searchData.extendedIngredients;
        for(x=0; x<res.length; x++) {
            let li = $("<li>").attr("style", "list-style-type:none;");
            let checkbox = $("<input>").attr({
                type:"checkbox",
                id: "cb"+x
            });
            let text = $("<label>").text(res[x].name + " - " + res[x].amount + " " + res[x].unit);
            li.append(checkbox, text);
            ingList.append(li);
        }
        return ingList;
    }

    //function to display the past searches
    const searchDisplay = () => {
        if(localStorage.getItem("recipeTracker")) {
            let button = $("<button>").addClass("clearSearches");
            button.text("Clear All Searches");
            button.attr("style", "margin-bottom:5px;");
            saved.append(button);
        }
        for(let y=0; y<parseInt(localStorage.getItem("recipeTracker")); y++) {
            let key = JSON.parse(localStorage.getItem("recipe"+y));
            if(key) {
                let div = $("<div>");
                let button = $("<button>").text(key.recipeName);
                let cancel = $("<button>").text("X");

                button.val(key.identification);
                cancel.attr({
                    style: "background-color:red; color:black; margin-left:5px;",
                    id: "recipe"+y
                });
                cancel.val("deleteBtn");
                div.attr("style", "margin-bottom:5px;");
                div.append(button,cancel);
                saved.append(div);
            }
        }
    }

    //function to delete past search recipes
    const deleteBtn = event => {
        let item = event.target.parentNode;
        localStorage.removeItem(event.target.id);
        item.remove();
    }

    //function to save exported ingredients
    const exported = () => {
        const shoppingList = [];
        let x = 0;
        while($("#cb"+x).length!==0){
            let cb = $("#cb"+x);
            if(cb[0].checked) {
                let item = cb.parent()[0].innerText;
                shoppingList.push(item.split(" -").shift());
            }
            x++;
        }
        $("#cartNumber").text(shoppingList.length);
        //add something to add different recipe ingredients to the object instead of overwriting the first ones ??????????
        if(shoppingList.length!==0) {
            let recipeTitle = searchData.title;
            let list = JSON.stringify({recipeTitle,shoppingList});
            localStorage.setItem("shoppingList", list);
        }
    }

    //function to display shopping list
    const shopping = () => {
        let list = JSON.parse(localStorage.getItem("shoppingList"));
        if(list) {
            let button = $("<button>").addClass("clearList");
            let div = $("<div>").addClass("listDisplay");
            let title = $("<h3>").text("Meal: " + list.recipeTitle);
            let p = $("<p>").text("Ingredients to buy:");
            button.text("Clear List");
            div.append(button, title, p);
            for(let x=0; x<list.shoppingList.length; x++) {
                let li = $("<li>").text(list.shoppingList[x]);
                li.val(x);
                div.append(li);
            }
            saved.append(div);
        //add function to allow deletion of all items or just one ????????????
        }
    }

    //function to display shopping cart item number
    const cartNum = () => {
        let list = JSON.parse(localStorage.getItem("shoppingList"));
        if(list) {
            $("#cartNumber").text(list.shoppingList.length);
        }
        else {
            $("#cartNumber").text("0");
        }
    }
    cartNum();
});