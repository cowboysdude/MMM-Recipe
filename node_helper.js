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
        console.log('starting Node_helper for ' + this.name + " " + this.data);
    },

    getRecipe: function(url) {
        request({
            url: "http://www.themealdb.com/api/json/v1/1/random.php",
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body),
                    meal = result.meals[0];

                function youtube_parser(url) {
                    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
                    var match = url.match(regExp);
                    return (match && match[7].length == 11) ? match[7] : false;
                }

                var recipe = {
                    recipeName: meal.strMeal,
                    instruction: meal.strInstructions,
                    videoId: youtube_parser(meal.strYoutube),
                    video: meal.strYoutube,
                    thumb: meal.strMealThumb,
                    nation: meal.strArea,
                    category: meal.strCategory,
                    ingredients: []
                };

                for (var i = 1; i <= 24; i++) {
                    if (!meal['strIngredient' + i]) {
                        break;
                    }
                    recipe.ingredients.push({
                        ingredient: meal['strMeasure' + i] + " " + meal['strIngredient' + i]
                    });
                }
                
                this.sendSocketNotification('RECIPE_RESULT', recipe);
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
