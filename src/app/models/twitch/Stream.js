define( [ "Ember", "EmberData", "Moment" ], function( Ember, DS, Moment ) {

	var get = Ember.get;
	var attr = DS.attr;
	var belongsTo = DS.belongsTo;

	return DS.Model.extend({
		average_fps: attr( "number" ),
		channel: belongsTo( "twitchChannel" ),
		created_at: attr( "date" ),
		game: attr( "string" ),
		preview: belongsTo( "twitchImage" ),
		video_height: attr( "number" ),
		viewers: attr( "number" ),


		title_created_at: function() {
			var created_at = get( this, "created_at" );
			var moment     = new Moment( created_at );
			var diff       = moment.diff( new Date(), "days" );
			var formatted  = moment.format( diff === 0 ? "LTS" : "llll" );
			return "Online since %@".fmt( formatted );
		}.property( "created_at" ),

		title_viewers: function() {
			var viewers = get( this, "viewers" );
			var numerus = viewers === 1 ? "person is" : "people are";
			return "%@ %@ watching".fmt( viewers, numerus );
		}.property( "viewers" )

	}).reopenClass({
		toString: function() { return "kraken/streams"; }
	});

});
