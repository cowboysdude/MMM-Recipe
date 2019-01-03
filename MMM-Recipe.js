  /* Magic Mirror
   * Module: MMM-Recipe
   *
   * By cowboysdude
   * 
   */
  Module.register("MMM-Recipe", {

      // Module config defaults.
      defaults: {
          updateInterval: 120000, // every 10 minutes
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
          return ["MMM-Recipe.css", "font-awesome.css"];
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



          //this.loaded = true;
          var wrapper = document.createElement("div");
          wrapper.className = "wrapper";
          wrapper.style.maxWidth = this.config.maxWidth;



          var top = document.createElement("div");
          top.classList.add("clearfix");

          var mixins = this.recipe;
          console.log(mixins.ingredients);

          var title = document.createElement("p");
          title.classList.add("title");
          title.innerHTML = `~  Dish: ${mixins.recipeName}  <br>~  Nationality: ${mixins.nation}  ~  Category: ${mixins.category}`;
          top.appendChild(title);
		  
          var ingred = document.createElement("div");
          ingred.classList.add("box", "title");
          for (i = 0; i < mixins.ingredients.length; i++) {
              var ing = mixins.ingredients[i].ingredient;
              console.log(ing);
              ingred.innerHTML += ing + "<br>";
          }
          top.appendChild(ingred);


          var des = document.createElement("p");
          des.classList.add("boxinst");
          const truncate = (str, len) => str.substring(0, (str + ' ').lastIndexOf(' ', len));
          des.innerHTML = truncate(mixins.instruction, 154) + "<div class='tooltip'>...read more mouse over this <span class='tooltiptext'>"+mixins.instruction+"</span></div>";
          top.appendChild(des); 
		  
		  var x = document.createElement(null);
          if (this.config.video != false) {
              x.innerHTML =
                  `<a href="${mixins.video}" class="mediabox"><img class= thumbs src="${mixins.thumb}"></a>`;
          } else {
              x.innerHTML = `<img class= thumbs src="${mixins.thumb}">`
          }
          wrapper.appendChild(x);

          MediaBox('.mediabox');
          wrapper.appendChild(top);

          return wrapper;

      },

      processRecipe: function(data) {
          //	console.log(data);
          this.today = data.Today;
          this.recipe = data;
          console.log(this.recipe);
          this.loaded = true;
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
