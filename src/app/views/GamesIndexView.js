define([
	"Ember",
	"mixins/InfiniteScrollViewMixin",
	"text!templates/games/index.html.hbs"
], function( Ember, InfiniteScrollViewMixin, template ) {

	return Ember.View.extend( InfiniteScrollViewMixin, {
		template: Ember.HTMLBars.compile( template ),
		tagName: "main",
		classNames: [ "content", "content-games" ]
	});

});
