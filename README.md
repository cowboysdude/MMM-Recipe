# MMM-Recipe
Daily recipe for MagicMirror2


This module shows a menu daily on the MagicMirror2

To customize size use the custom.css file like this:

Example:

If in your config.js you use 'bottom_bar', 'middle_center'...etc then add this to your custom.css file:

.MMM-Recipe .wrapper {
	width: 100%;
	float: right;
	display: inline;
}
.MMM-Recipe .recipeLogo {
	width: 5%;
	height: 5%;
	float: left;
	border: 20px solid #000;

This will give you the entire bottom bar area with the recipe.

If you want to use it in positions such as 'top_left', 'top_right', 'lower_right', 'lower_left'... no changes need to be made :)
