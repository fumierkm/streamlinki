define([
	"Ember",
	"text!templates/search.html.hbs"
], function( Ember, template ) {

	return Ember.View.extend({
		template: Ember.HTMLBars.compile( template ),
		tagName: "main",
		classNames: [ "content", "content-search" ]
	});

});
