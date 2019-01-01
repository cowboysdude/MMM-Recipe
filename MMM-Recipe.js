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
          maxWidth: "400px",
      },

      // Define required scripts.
      getScripts: function() {
          return ["moment.js"];
      },

      getStyles: function() {
          return ["MMM-Recipe.css", "font-awesome.css"];
      },

      // Define start sequence.
      start: function() {
          Log.info("Starting module: " + this.name);

          // Set locale.
          moment.locale(config.language);

          this.today = "";
          this.recipe = [];
          this.url = "http://www.themealdb.com/api/json/v1/1/random.php";
          this.scheduleUpdate();
      },

      getDom: function() {

          // Just some TESTING.
          var meals = this.recipe.meals;  //returns array
          var meal = meals[0]; // returns object

          // Start here to rename keys and match them to the ingredients.
          const newArray = meals.reduce((array, meal) => {
              // Rather than iterate over ALL of the keys, just 
              // do this, basically 50% of the keys. 
              const subArray = Object.keys(meal).filter(key => key.indexOf('strIngredient' == -1));
              console.log(subArray);
              // Basically add some ojects to the array.
              subArray.forEach(key => {
                  const int = key.replace(/\D/g, '');
                  const measureKey = `strMeasure${int}`;
                  const ingredientKey = `strIngredient${int}`;

                  const obj = {
                      ingredient: meal[ingredientKey],
                      measure: meal[measureKey]
                  };
                  console.log(obj);
                  array.push(obj);
              });

              // Make sure to return the array.
              return array;

          }, []);

          // Now just print the resuts, and make sure that you know 
          // and alert that the app has finished. 
          console.log(newArray, "FINISHED");

          //this.loaded = true;
          var wrapper = document.createElement("div");
          wrapper.className = "wrapper";
          wrapper.style.maxWidth = this.config.maxWidth;


          if (!this.loaded) {
              wrapper.innerHTML = "Mixing ingrediants...";
              wrapper.className = "bright light small";
              return wrapper;
          }
          if (this.config.header != "") {
              var header = document.createElement("header");
              header.className = "header";
              header.innerHTML = this.config.header;
              wrapper.appendChild(header);
          }

          var top = document.createElement("div");
          top.classList.add("content");

          var newsLogo = document.createElement("div");
          var newsIcon = document.createElement("img");
          newsIcon.src = "";
          newsIcon.classList.add("imgDes");
          newsLogo.appendChild(newsIcon);
          top.appendChild(newsLogo);

          var title = document.createElement("h3");
          title.classList.add("small");
          //title.className = "medium bright";
          title.innerHTML = "  ~  Dish: ";
          top.appendChild(title);


          var des = document.createElement("p");
          //des..classList.add("dimmed", "light", "small");
          des.classList.add("xsmall", "bright");
          //var str = recipe.strInstructions;
          //if(str.length > 10) str = str.substring(0,190);
          des.innerHTML = "";
          //des.innerHTML = str + "...";
          top.appendChild(des);

          wrapper.appendChild(top);
          return wrapper;

      },

      processRecipe: function(data) {
          //	console.log(data);
          this.today = data.Today;
          this.recipe = data;
          this.loaded = false;
      },

      scheduleUpdate: function() {
          setInterval(() => {
              this.getRecipe();
          }, this.config.updateInterval);

          this.getRecipe(this.config.initialLoadDelay);
      },


      getRecipe: function() {
          this.sendSocketNotification('GET_RECIPE', this.url);
      },

      socketNotificationReceived: function(notification, payload) {
          if (notification === "RECIPE_RESULT") {
              this.processRecipe(payload);
              this.updateDom(this.config.fadeSpeed);
          }
          this.updateDom(this.config.initialLoadDelay);
      },

  });
