import {
	module,
	test
} from "qunit";
import sinon from "sinon";
import chatProviderInjector
	from "inject-loader?-utils/parameters/Parameter!services/ChatService/providers/-provider";
import chatProviderBasicInjector
// eslint-disable-next-line max-len
	from "inject-loader?-utils/parameters/ParameterCustom&-utils/parameters/Substitution!services/ChatService/providers/-basic";
import chatProviderChromiumInjector
	from "inject-loader?./-basic!services/ChatService/providers/chromium";


module( "services/ChatService/providers/chromium", {
	beforeEach() {
		this.launch = sinon.stub();
		this.whichFallback = sinon.stub();

		const { default: ChatProvider } = chatProviderInjector({
			"config": {
				"twitch": {
					"chat-url": "https://twitch.tv/{channel}/chat"
				}
			},
			"../launch": this.launch
		});

		const { default: ChatProviderBasic } = chatProviderBasicInjector({
			"./-provider": ChatProvider,
			"utils/node/fs/whichFallback": this.whichFallback
		});

		const { default: ChatProviderChromium } = chatProviderChromiumInjector({
			"./-basic": ChatProviderBasic
		});

		this.subject = ChatProviderChromium;
	}
});


test( "Default attributes", async function( assert ) {

	this.launch.resolves();
	this.whichFallback.resolves( "/foo/chromium" );

	/** @type ChatProviderChromium */
	const provider = new this.subject();
	await provider.setup({
		exec: "chromium",
		fallback: "/foo"
	}, {} );
	await provider.launch({
		name: "baz"
	}, {} );

	assert.propEqual(
		this.whichFallback.getCall(0).args,
		[ "chromium", "/foo" ],
		"Resolves default executable path"
	);
	assert.propEqual(
		this.launch.getCall(0).args,
		[
			"/foo/chromium",
			[
				"--app=https://twitch.tv/baz/chat"
			]
		],
		"Spawns correct executable with default parameters"
	);

});


test( "User attributes", async function( assert ) {

	this.launch.resolves();
	this.whichFallback.resolves( "/bar/chromium-unstable" );

	/** @type ChatProviderChromium */
	const provider = new this.subject();
	await provider.setup({
		exec: "chromium",
		fallback: "/foo",
		attributes: [
			{ name: "exec" },
			{ name: "args" }
		]
	}, {
		exec: "chromium-unstable",
		args: "\"--user-data-dir=/qux/{channel}\""
	});
	await provider.launch({
		name: "baz"
	}, {} );

	assert.propEqual(
		this.whichFallback.getCall(0).args,
		[ "chromium-unstable" ],
		"Resolves user executable path"
	);
	assert.propEqual(
		this.launch.getCall(0).args,
		[
			"/bar/chromium-unstable",
			[
				"--app=https://twitch.tv/baz/chat",
				"--user-data-dir=/qux/baz"
			]
		],
		"Spawns correct executable with user parameters"
	);

});
