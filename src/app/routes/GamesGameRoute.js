import {
	get,
	set,
	Route
} from "ember";
import InfiniteScrollMixin from "./mixins/infinite-scroll";
import LanguageFilterMixin from "mixins/LanguageFilterMixin";
import RefreshRouteMixin from "mixins/RefreshRouteMixin";
import { toArray } from "utils/ember/recordArrayMethods";
import preload from "utils/preload";


export default Route.extend( InfiniteScrollMixin, LanguageFilterMixin, RefreshRouteMixin, {
	itemSelector: ".stream-item-component",

	modelName: "twitchStream",

	model( params ) {
		if ( arguments.length > 0 ) {
			set( this, "game", get( params || {}, "game" ) );
		}

		return get( this, "store" ).query( this.modelName, {
			game                : get( this, "game" ),
			offset              : get( this, "offset" ),
			limit               : get( this, "limit" ),
			broadcaster_language: get( this, "broadcaster_language" )
		})
			.then( toArray() )
			.then( preload( "preview.mediumLatest" ) );
	},

	setupController( controller ) {
		this._super( ...arguments );

		set( controller, "game", get( this, "game" ) );
	}
});
