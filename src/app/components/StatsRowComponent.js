define([
	"Ember",
	"hbs!templates/components/StatsRowComponent.html"
], function(
	Ember,
	layout
) {

	return Ember.Component.extend({
		layout: layout,
		tagName: "div",
		classNameBindings: [ ":stats-row", "class" ],

		withFlag: true
	});

});
