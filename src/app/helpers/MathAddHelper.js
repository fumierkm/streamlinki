import { Helper } from "Ember";


function mathAdd( valueA, valueB ) {
	return valueA + valueB;
}


export default Helper.helper(function( params ) {
	return params.reduce( mathAdd );
});
