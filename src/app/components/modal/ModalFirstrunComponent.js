define([
	"Ember",
	"components/ModalDialogComponent",
	"hbs!templates/modal/ModalFirstrun"
], function(
	Ember,
	ModalDialogComponent,
	layout
) {

	var get = Ember.get;


	return ModalDialogComponent.extend({
		versioncheck: Ember.inject.service(),

		layout: layout,
		"class": "modal-firstrun",

		goto: "goto",


		actions: {
			"settings": function() {
				this.sendAction( "goto", "settings" );
				this.send( "start" );
			},

			"start": function() {
				this.send( "close" );
				get( this, "versioncheck" ).checkForNewRelease();
			}
		}
	});

});
