import { get } from "Ember";
import InputBtnComponent from "components/form/InputBtnComponent";


export default InputBtnComponent.extend({
	classNames: [ "check-box-component" ],

	click: function() {
		if ( get( this, "disabled" ) ) { return; }
		this.toggleProperty( "checked" );
	}
});
