import { get } from "Ember";
import InputBtnComponent from "components/form/InputBtnComponent";


export default InputBtnComponent.extend({
	classNames: [ "radio-btn-component" ],

	click: function() {
		if ( get( this, "disabled" ) ) { return; }
		// notify RadioBtnsComponent that the current RadioBtnComponent is the selection now
		get( this, "onClick" )( this );
	}
});
