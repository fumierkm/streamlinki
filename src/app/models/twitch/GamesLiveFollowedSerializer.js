import GamesTopSerializer from "models/twitch/GamesTopSerializer";


export default GamesTopSerializer.extend({
	modelNameFromPayloadKey: function() {
		return "twitchGamesLiveFollowed";
	}
});
