$(document).ready(() => {
    const APIKey = "9ddf30e43c5a4cc697a9fc839fec69b2";
    const sbiBtn = $(".sbiBtn");
    const sbrBtn = $(".sbrBtn");
    const modal = $("#advModal");
    const advBtn = $(".advModalOpen");
    const span = $(".close");
    const advSearchBtn = $(".advSearch");
    

    //function with the ajax request inside
    const sbiAjax = (queryURL) => {
        $.ajax({
            url: queryURL,
            METHOD: "GET"
        }).then(function(response){
            console.log(response);
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
        // sbiAjax(queryURL);
    });

    //on click event to search by recipe name
    sbrBtn.on("click", event => {
        event.preventDefault();
        let recipe = $(".searchByRecipe").val();
        let queryURL = "https://api.spoonacular.com/recipes/search?apiKey="+APIKey+"&query="+recipe;
        console.log(queryURL);
        // sbiAjax(queryURL);
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
        
        let resultNum = $("#numberOfResults").val();
        let queryURL = "https://api.spoonacular.com/recipes/complexSearch?apiKey="+APIKey+"&includeIngredients="+ingredients+"&number="+resultNum+"&instructionsRequired=true&fillIngredients=true&addRecipeInformation=true";

        for(let x=1; x<7; x++) {
            $("#ingredient"+x).val("");
                
        }
        modal.css("display", "none");
        console.log(queryURL);
        // sbiAjax(queryURL);
    });
});