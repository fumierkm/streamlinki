define([
	"Ember",
	"mixins/InfiniteScrollRouteMixin",
	"mixins/LanguageFilterMixin",
	"utils/preload"
], function(
	Ember,
	InfiniteScrollRouteMixin,
	LanguageFilterMixin,
	preload
) {

	var get = Ember.get;
	var set = Ember.set;

	return Ember.Route.extend( InfiniteScrollRouteMixin, LanguageFilterMixin, {
		itemSelector: ".stream-component",

		model: function( params ) {
			if ( arguments.length > 0 ) {
				set( this, "game", get( params || {}, "game" ) );
			}

			return this.store.findQuery( "twitchStream", {
				game                : get( this, "game" ),
				offset              : get( this, "offset" ),
				limit               : get( this, "limit" ),
				broadcaster_language: get( this, "broadcaster_language" )
			})
				.then(function( data ) { return data.toArray(); })
				.then( preload( "@each.preview.@each.medium_nocache" ) );
		},

		setupController: function( controller ) {
			this._super.apply( this, arguments );

			set( controller, "game", get( this, "game" ) );
		}
	});

});
