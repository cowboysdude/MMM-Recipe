    /* Magic Mirror
   * Module: MMM-Recipe
   *
   * By cowboysdude
   * 
   */
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
          return ["moment.js", "mediabox.js"];
      },

      getStyles: function() {
          return ["MMM-Recipe.css", "modal.css"];
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
          this.scheduleUpdate();
      },

      getDom: function() { 
	  
	      var mixins = this.recipe;
          
          var wrapper = document.createElement("table");
		  
          var top = document.createElement("th");
	  top.className = "rName";
          top.innerHTML= `${mixins.recipeName}`; 

          var title = document.createElement("tr");
          title.classList.add("ingred");
          title.innerHTML = `<br>Nationality: ${mixins.nation}  <br>Category: ${mixins.category}`;
          top.appendChild(title);
		  wrapper.appendChild(top);
		  
		  var x = document.createElement("td");
          if (this.config.video != false) {
              x.innerHTML =
                  `<a href="${mixins.video}" class="mediabox"><img class= thumbs src="${mixins.thumb}"></a>`;
          } else {
              x.innerHTML = `<img class= thumbs src="${mixins.thumb}">`
          }
          top.appendChild(x); 
		  
		  var ingred = document.createElement("td");
          ingred.classList.add("title");
          for (i = 0; i < mixins.ingredients.length; i++) { 
              ingred.innerHTML += mixins.ingredients[i].ingredient + "<br>";
          }
          top.appendChild(ingred);
		  wrapper.appendChild(top);

           var des = document.createElement("div");
          des.classList.add("boxinst"); 
          des.innerHTML = `
		  <label for="o">Instructions</label>
			<input class="checker" type="checkbox" id="o" hidden>
				<div class="modal">
				<div class="modal-body">
				<div class="modal-content">Instructions:<br>${mixins.instruction}</div>
				<div class="modal-footer">
				<label for="o">close</label>
				</div>
			  </div>
			</div>`;
          top.appendChild(des);  
		  

           

          MediaBox('.mediabox'); 
          wrapper.appendChild(top);

          return wrapper;

      },

      processRecipe: function(data) {
          //	console.log(data);
          this.today = data.Today;
          this.recipe = data;
          console.log(this.recipe);
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
