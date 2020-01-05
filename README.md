# MMM-Recipe

 STILL BEING TESTED AND MMM-voice has conflicts with it at the moment..........working on it.
 
Daily recipe for MagicMirror2  ALL NEW FOR 2019
This is a positional module.....bottom_bar
If you try to put it in other positions you will have to fix the css ..... I built this to work in one position and the reason for that is the list of ingredients vary from recipe to recipe and at times the entire bottom_bar space will be needed!

#Examples:

Simple recipe
![](examples/recipe1.png)

Example showing video
![](examples/recipe2.png)


![](examples/recipe3.png)

This module shows a menu daily on the MagicMirror2

You can decide whether or not you want to have access to the video by using the config (see example config below)

   #Example:
           ```{
           module: 'MMM-Recipe',
           position: 'bottom_bar',
           config: {
	    video:  true //default is true if you want to be able to play video of recipe
	    updateInterval: 180 * 60 * 1000, // every 3 hours Suggest you don't do it more often then this.
                 }
              }, ``` 
 
