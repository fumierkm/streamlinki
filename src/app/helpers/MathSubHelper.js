import { Helper } from "ember";


function mathSub( valueA, valueB ) {
	return valueA - valueB;
}


export default Helper.helper(function( params ) {
	return params.reduce( mathSub );
});
