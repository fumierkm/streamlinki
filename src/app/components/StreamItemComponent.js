define([
	"Ember",
	"components/ListItemComponent",
	"text!templates/components/stream.html.hbs"
], function( Ember, ListItemComponent, template ) {

	var get = Ember.get;
	var alias = Ember.computed.alias;
	var and = Ember.computed.and;
	var bool = Ember.computed.bool;

	return ListItemComponent.extend({
		layout: Ember.HTMLBars.compile( template ),
		classNameBindings: [
			":stream-component",
			"_showGame:show-game",
			"showFlag:show-flag",
			"faded:faded"
		],

		action: "openLivestreamer",

		channel: alias( "content.channel" ),

		showGame: false,
		_showGame: and( "showGame", "channel.game" ),

		showFlag: bool( "settings.gui_flagsvisible" ),

		faded: function() {
			var filter = get( this, "settings.gui_langfilter" );
			var clang  = get( this, "content.channel.language" );
			var blang  = get( this, "content.channel.broadcaster_language" );

			// a channel language needs to be set
			return clang
				&& (
					// fade out if
					// no broadcaster language is set and channel language is filtered out
					   !blang && filter[ clang ] === false
					// OR broadcaster language is set and filtered out (ignore channel language)
					||  blang && filter[ blang ] === false
				);
		}.property(
			"settings.gui_langfilter",
			"content.channel.language",
			"content.channel.broadcaster_language"
		),

		actions: {
			"startStream": function() {
				this.sendAction( "action", get( this, "content" ) );
			}
		}
	});

});
