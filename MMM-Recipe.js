/* Magic Mirror
   * Module: MMM-Recipe
   *
   * By cowboysdude
   * 
   */
  var $;
  
  Module.register("MMM-Recipe", {

      // Module config defaults.
      defaults: {
          updateInterval: 180 * 60 * 1000, // every 3 hours
          animationSpeed: 1000,
          initialLoadDelay: 1130, // 0 seconds delay
          retryDelay: 2500,
          header: "",
          maxWidth: "220px",
          video: true
      },

      // Define required scripts.
      getScripts: function() {
          return ["moment.js", "jquery.js","lity.js"];
      },

      getStyles: function() {
          return ["MMM-Recipe.css", "lity.css"];
      },

      // Define start sequence.
      start: function() {
          var info = this.data;
          var moduleInfo = JSON.parse(JSON.stringify(info));
          Log.info("Starting module: " + this.name);

          // Set locale.
          moment.locale(config.language);

          this.today = "";
          this.recipe = [];
		  this.list = [];
		  this.image = "";
          this.scheduleUpdate();
      },

      getDom: function() {

          var mixins = this.recipe; 
		  var list = this.list;
		   
          var wrapper = document.createElement("div");
          wrapper.id = "flex-container";
		  
		  

          var x = document.createElement("div");
          x.classList.add("video");
          if (this.config.video != false) {
			  var vidID = mixins.videoId;
			  var vid  = mixins.video;
              var image = this.image;			  
              x.innerHTML = '<a class="btn" href="//www.youtube.com/watch?v=' + vidID + '&rel=0" data-lity><img class ="click" src=' + image + ' width=136px; height=137px;></a>';
          } else {
              x.innerHTML = `<img class= thumbs src="${image}">`;
          }
          wrapper.appendChild(x); 

          var top = document.createElement("div");
          top.classList.add("flex-item", "title");
          top.innerHTML = `${mixins.recipeName}<br>Nationality: ${mixins.nation}<br>Category: ${mixins.category}<br>
		                        <BR><BR><label for="o">Instructions</label>
			<input class="checker" type="checkbox" id="o" hidden>
				<div class="modal">
				<div class="modal-body">
				<div class="modal-content">Instructions:<br>${mixins.instruction}</div>
				<div class="modal-footer">
				<label for="o">close</label>
				</div>
			  </div>
			</div> `;
		  
		  wrapper.appendChild(top);
          var ingred = document.createElement("ul");
          ingred.classList.add("flex-item", "ingreid"); 
          for (i = 0; i < list.length; i++) { 
          ingred.innerHTML += `<li>${list[i].ingredient}</li>`
          }
          wrapper.appendChild(ingred);

          return wrapper;
      },

      processRecipe: function(data) {
          this.today = data.Today;
          this.recipe = data;
		  this.list = data.ingredients;
		  this.image = data.thumb;
          console.log(this.image);
          this.loaded = false;
      },

      scheduleUpdate: function() {
          setInterval(() => {
              this.getRecipe();
          }, this.config.updateInterval);

          this.getRecipe(this.config.initialLoadDelay);
      },

      getRecipe: function() {
          this.sendSocketNotification('GET_RECIPE');
      },

      socketNotificationReceived: function(notification, payload) {
          if (notification === "RECIPE_RESULT") {
              this.processRecipe(payload);
              this.updateDom(this.config.fadeSpeed);
          }
          this.updateDom(this.config.initialLoadDelay);
      },

  });