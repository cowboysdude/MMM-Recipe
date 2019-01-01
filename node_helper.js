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
       console.log('starting Node_helper for '+this.name);

    },

    getRecipe: function(url) {
        request({
            url: url,
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) { 
                var result = JSON.parse(body);  
				//console.log(result);
				this.sendSocketNotification('RECIPE_RESULT', result);
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
