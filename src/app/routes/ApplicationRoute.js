define( [ "ember" ], function( Ember ) {

	return Ember.Route.extend({
		beforeModel: function() {
			// Load Settings records
			this.store.find( "settings" ).then(function( records ) {
				if ( !records.content.length ) {
					// Create initial Settings record
					this.store.createRecord( "settings", { id: 1 } ).save();
				}
			}.bind( this ) );
		},

		model: function() {
			return Ember.$.getJSON( "metadata.json" );
		},

		afterModel: function( resolvedModel ) {
			this.controllerFor( "versioncheck" ).check( resolvedModel );
		},


		actions: {
			"history": function( action ) {
				window.history.go( +action );
			},

			"refresh": function() {
				var routeName = this.controller.currentRouteName;
				if ( routeName !== "error" ) {
					this.container.lookup( "route:" + routeName ).refresh();
				}
			},

			"goto": function() {
				this.transitionTo.apply( this, arguments );
			},

			"openBrowser": function( url ) {
				this.get( "controller.nwGui" ).Shell.openExternal( url );
			},

			"openLivestreamer": function( stream ) {
				this.get( "controller.controllers.livestreamer" ).send( "start", stream );
			},

			"openModal": function( head, body, controls ) {
				this.send( "updateModal", head, body, controls );

				return this.render( "modal", {
					into		: "application",
					outlet		: "modal"
				});
			},

			"updateModal": function( head, body, controls ) {
				var modal = this.controllerFor( "modal" );
				if (     head !== undefined ) { modal.set(     "head",     head ); }
				if (     body !== undefined ) { modal.set(     "body",     body ); }
				if ( controls !== undefined ) { modal.set( "controls", controls ); }
			},

			"closeModal": function() {
				return this.disconnectOutlet({
					parentView	: "application",
					outlet		: "modal"
				});
			}
		}
	});

});
