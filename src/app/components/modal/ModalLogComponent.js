import Ember from "Ember";
import layout from "templates/components/modal/ModalLogComponent.hbs";


	var scheduleOnce = Ember.run.scheduleOnce;


	export default Ember.Component.extend({
		layout: layout,

		tagName: "section",
		classNames: [ "modal-log" ],

		log: function() {
			return [];
		}.property(),

		_logObserver: function() {
			scheduleOnce( "afterRender", this, "scrollToBottom" );
		}.observes( "log.[]" ),

		scrollToBottom: function() {
			var elem = this.element;
			if ( !elem ) { return; }
			elem.scrollTop = Math.max( 0, elem.scrollHeight - elem.clientHeight );
		}.on( "didInsertElement" )
	});
