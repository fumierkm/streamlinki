import Ember from "Ember";
import FormButtonComponent from "components/button/FormButtonComponent";


var get = Ember.get;
var set = Ember.set;


export default FormButtonComponent.extend({
	settings: Ember.inject.service(),

	"class": function() {
		return "btn-neutral" + ( get( this, "isHomepage" ) ? " active" : "" );
	}.property( "isHomepage" ),

	title: "Set as homepage",

	icon: "fa-home",
	iconanim: true,

	action: "setHomepage",

	url: function() {
		return get( this, "targetObject.target.location" ).getURL();
	}.property( "targetObject.target.location" ).volatile(),

	isHomepage: function() {
		return get( this, "url" ) === get( this, "settings.gui_homepage" );
	}.property( "url", "settings.gui_homepage" ),


	actions: {
		"setHomepage": function( success, failure ) {
			var settings = get( this, "settings.content" );
			var value    = get( this, "url" );
			if ( !settings || !value ) {
				return failure();
			}

			set( settings, "gui_homepage", value );
			settings.save()
				.then( success, failure )
				.catch();
		}
	}
});
