/* Magic Mirror
 * Module: MMM-Recipe
 *
 * By Cowboysdude
 * 
 */
const NodeHelper = require('node_helper');
const request = require('request'); 

module.exports = NodeHelper.create({

    start: function() {
        console.log('starting Node_helper for ' + this.name +" "+ this.data); 
    },

    getRecipe: function(url) {
        request({
            url: "http://www.themealdb.com/api/json/v1/1/random.php",
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body);
                //console.log(result); 
                // Just setting it all up to start.
                var meals = result.meals; //returns array
                var meal = meals[0]; // returns object
                //console.log(meal);
                // Start here to rename keys and match them to the ingredients.
				//result.meals.forEach(meal => Object.keys(meal).forEach(key => console.log(meal[key])));
                const newArray = meals.reduce((array, meal) => {
                    // Rather than iterate over ALL of the keys, just 
                    // do this, basically 50% of the keys. 
                    const subArray = Object.keys(meal).filter(key => key.indexOf('strIngredient' == -1));
                    // console.log(subArray);
                    // Basically add some ojects to the array.
                    subArray.forEach(key => {
                        const int = key.replace(/\D/g, '');
                        const measureKey = `strMeasure${int}`;
                        const ingredientKey = `strIngredient${int}`;  
					//console.log(ingredientKey);
                        const obj = {
                            measure: meal[measureKey],
                            ingredient: meal[ingredientKey]
                        };
                         // console.log(obj);  //Testing data before
                         
						if (obj.measure && obj.ingredient != 'undefined' || undefined || '' || null) {
                         array.push(obj);
                              console.log(array);  //Testing data after
                        }
                    });

                    const recipeName = meal.strMeal;
                    const instruction = meal.strInstructions;
                    const video = meal.strYoutube;
                    const thumb = meal.strMealThumb;
                    const nation = meal.strArea;
                    const category = meal.strCategory;

                    const recipe = {instructions: {
                        recipeName,
                        instruction,
                        video,
                        thumb,
                        nation,
                        category
                    } };
                    array.push(recipe);
                    //console.log(recipe);  Testing full array

                    // Make sure to return the array.
                    return array;

                }, []);

                // Now just print the resuts, and make sure that you know 
                // and alert that the app has finished.


                //console.log(newArray, "FINISHED");

                this.sendSocketNotification('RECIPE_RESULT', newArray);
            }
        });
    },

    //Subclass socketNotificationReceived received.
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_RECIPE') {

            this.getRecipe(payload);
        }
    }


});
