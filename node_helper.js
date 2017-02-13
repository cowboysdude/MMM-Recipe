/* Magic Mirror
    * Module: MMM-Recipe
    *
    * By Cowboysdude/ node_helper written by: strawberry 3.141
    * 
    */
const NodeHelper = require('node_helper');
const request = require('request');
const fs = require('fs');

module.exports = NodeHelper.create({

    start: function() {
        this.recipe = {
            timestamp: null,
            data: null
        };
        this.path = "modules/MMM-Recipe/recipe.json";
        if (fs.existsSync(this.path)) {
            var temp = JSON.parse(fs.readFileSync(this.path, 'utf8'));
            if (temp.timestamp === this.getDate()) {
                this.recipe = temp;
            }
            //console.log(temp);
        }

    },

    getRecipe: function(url) {
        request({
            url: url,
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body).meals[0];
                this.sendSocketNotification('RECIPE_RESULT', result);
                this.recipe.timestamp = this.getDate();
                this.recipe.data = result;
                this.fileWrite();
            }
        });
    },

    fileWrite: function() {
        fs.writeFile(this.path, JSON.stringify(this.recipe), function(err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    },

    getDate: function() {
        return (new Date()).toLocaleDateString();
    },

    //Subclass socketNotificationReceived received.
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_RECIPE') {
            if (this.recipe.timestamp === this.getDate() && this.recipe.data !== null) {
                this.sendSocketNotification('RECIPE_RESULT', this.recipe.data);
            } else {
                this.getRecipe(payload);
            }
        }
    }

});