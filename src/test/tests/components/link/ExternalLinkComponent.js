import { moduleForComponent, test } from "ember-qunit";
import { buildResolver, hbs } from "test-utils";
import Service from "@ember/service";
import $ from "jquery";
import sinon from "sinon";

import externalLinkComponentInjector
	from "inject-loader?-utils/getStreamFromUrl!components/link/ExternalLinkComponent";


moduleForComponent( "components/link/ExternalLinkComponent", {
	integration: true,
	resolver: buildResolver({}),
	beforeEach() {
		this.clipboardSetStub = sinon.stub();
		this.openBrowserStub = sinon.stub();
		this.menuItemsStub = sinon.stub();
		this.menuPopupStub = sinon.stub();
		this.transitionToStub = sinon.stub();

		const { default: ExternalLinkComponent } = externalLinkComponentInjector({
			"nwjs/Clipboard": {
				set: this.clipboardSetStub
			},
			"nwjs/Shell": {
				openBrowser: this.openBrowserStub
			},
			"nwjs/Menu": {
				create: () => ({
					items: {
						pushObjects: this.menuItemsStub
					},
					popup: this.menuPopupStub
				})
			}
		});
		const RoutingService = Service.extend({
			transitionTo: this.transitionToStub
		});

		this.registry.register( "component:external-link", ExternalLinkComponent );
		this.registry.register( "service:-routing", RoutingService );
	}
});


test( "Internal URL", function( assert ) {

	let event;

	this.set( "url", "https://twitch.tv/foo" );
	this.set( "text", "foo" );
	this.render( hbs`{{#external-link url=url}}{{text}}{{/external-link}}` );
	const $component = this.$( ".external-link-component" );

	assert.ok( $component.get( 0 ) instanceof HTMLAnchorElement, "Component renders" );
	assert.strictEqual( $component.text(), "foo", "Component has the correct content" );
	assert.notOk( $component.hasClass( "external-link" ), "Twitch channel links are not external" );
	assert.notOk( $component.prop( "title" ), "Internal links don't have a title" );
	assert.strictEqual( $component.attr( "href" ), "#", "Has the correct href attr" );

	// trigger click event
	event = $.Event( "click" );
	$component.trigger( event );
	assert.ok( event.isDefaultPrevented(), "Default event action is prevented" );
	assert.ok( event.isImmediatePropagationStopped(), "Event doesn't propagate" );
	assert.notOk( this.openBrowserStub.called, "Doesn't open browser" );
	assert.propEqual( this.transitionToStub.args, [ [ "channel", "foo" ] ], "Opens channel page" );

	// doesn't have a context menu
	event = $.Event( "contextmenu" );
	$component.trigger( event );
	assert.notOk( event.isDefaultPrevented(), "Default event action is not prevented" );
	assert.notOk( event.isImmediatePropagationStopped(), "Event propagates" );
	assert.notOk( this.menuItemsStub.called, "Doesn't create context menu items" );
	assert.notOk( this.menuPopupStub.called, "Doesn't open a context menu" );

});


test( "External URL", function( assert ) {

	let event;

	this.set( "url", "https://bar.com/" );
	this.set( "text", "foo" );
	this.render( hbs`{{#external-link url=url}}{{text}}{{/external-link}}` );
	const $component = this.$( ".external-link-component" );

	assert.ok( $component.get( 0 ) instanceof HTMLAnchorElement, "Component renders" );
	assert.strictEqual( $component.text(), "foo", "Component has the correct content" );
	assert.ok( $component.hasClass( "external-link" ), "Is an external link" );
	assert.strictEqual( $component.prop( "title" ), "https://bar.com/", "Has a title" );
	assert.strictEqual( $component.attr( "href" ), "#", "Has the correct href attr" );

	// trigger click event
	event = $.Event( "click" );
	$component.trigger( event );
	assert.ok( event.isDefaultPrevented(), "Default event action is prevented" );
	assert.ok( event.isImmediatePropagationStopped(), "Event doesn't propagate" );
	assert.propEqual( this.openBrowserStub.args, [ [ "https://bar.com/" ] ], "Opens browser" );
	assert.notOk( this.transitionToStub.called, "Does not transition to different route" );

	this.openBrowserStub.resetHistory();

	// has a context menu
	event = $.Event( "contextmenu" );
	$component.trigger( event );
	assert.ok( event.isDefaultPrevented(), "Default event action is prevented" );
	assert.ok( event.isImmediatePropagationStopped(), "Event doesn't propagate" );
	assert.propEqual( this.menuItemsStub.args, [ [
		[
			{
				label: "Open in browser",
				click() {}
			},
			{
				label: "Copy link address",
				click() {}
			}
		]
	] ], "Creates context menu items" );
	assert.strictEqual( this.menuPopupStub.args[0][0], event, "Opens the context menu" );

	assert.notOk( this.openBrowserStub.called, "Browser hasn't been opened yet" );
	assert.notOk( this.clipboardSetStub.called, "Set clipboard hasn't been called yet" );

	this.menuItemsStub.args[0][0][0].click();
	assert.propEqual( this.openBrowserStub.args, [ [ "https://bar.com/" ] ], "Opens browser" );

	this.menuItemsStub.args[0][0][1].click();
	assert.propEqual( this.clipboardSetStub.args, [ [ "https://bar.com/" ] ], "Sets clipboard" );

});
