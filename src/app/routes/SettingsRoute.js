define( [ "Ember", "utils/ember/ObjectBuffer" ], function( Ember, ObjectBuffer ) {

	var get = Ember.get;

	return Ember.Route.extend({
		settings: Ember.inject.service(),

		model: function() {
			var settings = get( this, "settings.content" );
			return ObjectBuffer.create({
				content: settings.toJSON()
			});
		},

		actions: {
			willTransition: function( transition ) {
				// if the user has changed any values
				if ( get( this.controller, "model.isDirty" ) ) {
					// stay here...
					transition.abort();

					// and let the user decide
					this.send( "openModal", "settingsModal", this.controller, {
						modalHead: "Please confirm",
						modalBody: "Do you want to apply your changes?",
						previousTransition: transition
					});
				}
			}
		}
	});

});
