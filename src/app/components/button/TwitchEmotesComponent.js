import { get } from "@ember/object";
import {
	and,
	or
} from "@ember/object/computed";
import {
	inject as service
} from "@ember/service";
import { twitch } from "config";
import { openBrowser } from "nwjs/Shell";
import FormButtonComponent from "./FormButtonComponent";
import HotkeyMixin from "../mixins/hotkey";


const { "emotes-url": twitchEmotesUrl } = twitch;


export default FormButtonComponent.extend( HotkeyMixin, {
	settings: service(),

	showButton: false,
	isEnabled: or( "showButton", "settings.streams.twitchemotes" ),
	isVisible: and( "isEnabled", "channel.partner" ),

	classNames: [ "btn-neutral" ],
	icon: "fa-smile-o",
	iconanim: true,
	title: "Show available channel emotes",

	hotkeys: [
		{
			code: "KeyE",
			action() {
				this.click();
			}
		}
	],

	action() {
		let url = twitchEmotesUrl;
		let channel = get( this, "channel.name" );

		return openBrowser( url, {
			channel
		});
	}
});
