import { get } from "Ember";
import UserIndexRoute from "routes/UserIndexRoute";
import InfiniteScrollMixin from "mixins/InfiniteScrollMixin";
import ModelMetadataMixin from "mixins/ModelMetadataMixin";
import toArray from "utils/ember/toArray";
import mapBy from "utils/ember/mapBy";
import preload from "utils/preload";


export default UserIndexRoute.extend( InfiniteScrollMixin, ModelMetadataMixin, {
	itemSelector: ".stream-item-component",

	modelName: "twitchStreamsFollowed",

	model() {
		return get( this, "store" ).query( this.modelName, {
			offset: get( this, "offset" ),
			limit : get( this, "limit" )
		})
			.then( toArray )
			.then( mapBy( "stream" ) )
			.then( preload( "preview.medium_nocache" ) );
	}
});
