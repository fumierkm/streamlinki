define(function( require ) {

	var Ember = require( "Ember" );
	var DS    = require( "EmberData" );

	require( "initializers/initializers" );


	return Ember.Application.create({

		// Configuration
		rootElement: document.documentElement,


		// Resolver
		Resolver: require( "resolver" ),


		// Routing
		Router: require( "router" ),


		// Store
		ApplicationStore: DS.Store.extend(),
		ApplicationAdapter: require( "store/TwitchAdapter" ),


		// Models: memory
		Livestreamer: require( "models/Livestreamer" ),
		LivestreamerAdapter: DS.Adapter,


		// Models: localstorage
		Window: require( "models/localstorage/Window" ),
		WindowAdapter: DS.LSAdapter.extend({ namespace: "window" }),
		WindowSerializer: DS.LSSerializer,
		Settings: require( "models/localstorage/Settings" ),
		SettingsAdapter: DS.LSAdapter.extend({ namespace: "settings" }),
		SettingsSerializer: DS.LSSerializer,
		Versioncheck: require( "models/localstorage/Versioncheck" ),
		VersioncheckAdapter: DS.LSAdapter.extend({ namespace: "versioncheck" }),
		VersioncheckSerializer: DS.LSSerializer,
		Auth: require( "models/localstorage/Auth" ),
		AuthAdapter: DS.LSAdapter.extend({ namespace: "auth" }),
		AuthSerializer: DS.LSSerializer,
		Search: require( "models/localstorage/Search" ),
		SearchAdapter: DS.LSAdapter.extend({ namespace: "search" }),
		SearchSerializer: DS.LSSerializer,
		ChannelSettings: require( "models/localstorage/ChannelSettings" ),
		ChannelSettingsAdapter: DS.LSAdapter.extend({ namespace: "channelsettings" }),
		ChannelSettingsSerializer: DS.LSSerializer,


		// Models: github
		GithubReleases: require( "models/github/Releases" ),
		GithubReleasesAdapter: require( "store/GithubAdapter" ),
		GithubReleasesSerializer: require( "models/github/ReleasesSerializer" ),


		// Models: twitch
		TwitchToken: require( "models/twitch/Token" ),
		TwitchTokenSerializer: require( "models/twitch/TokenSerializer" ),

		TwitchGame: require( "models/twitch/Game" ),
		TwitchGameSerializer: require( "models/twitch/GameSerializer" ),
		TwitchStream: require( "models/twitch/Stream" ),
		TwitchStreamSerializer: require( "models/twitch/StreamSerializer" ),
		TwitchChannel: require( "models/twitch/Channel" ),
		TwitchChannelSerializer: require( "models/twitch/ChannelSerializer" ),
		TwitchTeam: require( "models/twitch/Team" ),
		TwitchTeamSerializer: require( "models/twitch/TeamSerializer" ),
		TwitchImage: require( "models/twitch/Image" ),
		TwitchImageSerializer: require( "models/twitch/ImageSerializer" ),

		TwitchGamesTop: require( "models/twitch/GamesTop" ),
		TwitchGamesTopSerializer: require( "models/twitch/GamesTopSerializer" ),
		TwitchStreamsSummary: require( "models/twitch/StreamsSummary" ),
		TwitchStreamsSummarySerializer: require( "models/twitch/StreamsSummarySerializer" ),
		TwitchStreamsFeatured: require( "models/twitch/StreamsFeatured" ),
		TwitchStreamsFeaturedSerializer: require( "models/twitch/StreamsFeaturedSerializer" ),

		TwitchStreamsFollowed: require( "models/twitch/StreamsFollowed" ),
		TwitchStreamsFollowedSerializer: require( "models/twitch/StreamsFollowedSerializer" ),
		TwitchChannelsFollowed: require( "models/twitch/ChannelsFollowed" ),
		TwitchChannelsFollowedSerializer: require( "models/twitch/ChannelsFollowedSerializer" ),
		TwitchGamesFollowed: require( "models/twitch/GamesFollowed" ),
		TwitchGamesFollowedSerializer: require( "models/twitch/GamesFollowedSerializer" ),

		TwitchSearchGame: require( "models/twitch/SearchGame" ),
		TwitchSearchGameSerializer: require( "models/twitch/SearchGameSerializer" ),
		TwitchSearchStream: require( "models/twitch/SearchStream" ),
		TwitchSearchStreamSerializer: require( "models/twitch/SearchStreamSerializer" ),
		TwitchSearchChannel: require( "models/twitch/SearchChannel" ),
		TwitchSearchChannelSerializer: require( "models/twitch/SearchChannelSerializer" ),

		TwitchUserFollowsChannel: require( "models/twitch/UserFollowsChannel" ),
		TwitchUserFollowsChannelSerializer: require( "models/twitch/UserFollowsChannelSerializer" ),
		TwitchUserSubscription: require( "models/twitch/UserSubscription" ),
		TwitchUserSubscriptionSerializer: require( "models/twitch/UserSubscriptionSerializer" ),

		TwitchTicket: require( "models/twitch/Ticket" ),
		TwitchTicketSerializer: require( "models/twitch/TicketSerializer" ),
		TwitchProduct: require( "models/twitch/Product" ),
		TwitchProductSerializer: require( "models/twitch/ProductSerializer" ),
		TwitchProductEmoticon: require( "models/twitch/ProductEmoticon" ),
		TwitchProductEmoticonSerializer: require( "models/twitch/ProductEmoticonSerializer" ),


		// Ember additions/changes/fixes
		BooleanTransform: require( "store/BooleanTransform" ),
		LinkView: require( "views/LinkView" ),
		SelectView: require( "views/SelectView" ),


		// Services
		MetadataService: require( "services/MetadataService" ),
		SettingsService: require( "services/SettingsService" ),
		AuthService: require( "services/AuthService" ),
		NotificationService: require( "services/NotificationService" ),


		// Application
		ApplicationRoute: require( "routes/ApplicationRoute" ),
		ApplicationController: require( "controllers/ApplicationController" ),
		ApplicationView: require( "views/ApplicationView" ),

		LoadingRoute: require( "routes/LoadingRoute" ),
		LoadingView: require( "views/LoadingView" ),

		ErrorRoute: require( "routes/ErrorRoute" ),
		ErrorView: require( "views/ErrorView" ),

		IndexRoute: require( "routes/IndexRoute" ),

		ModalView: require( "views/ModalView" ),

		QuitModalTemplate: require( "text!templates/modals/quit.html.hbs" ),

		VersioncheckController: require( "controllers/VersioncheckController" ),
		VersioncheckModalTemplate: require( "text!templates/modals/versioncheck.html.hbs" ),

		LivestreamerController: require( "controllers/LivestreamerController" ),
		LivestreamerModalView: require( "views/LivestreamerModalView" ),
		LivestreamerModalTemplate: require( "text!templates/modals/livestreamer.html.hbs" ),


		// Components
		FormButtonComponent: require( "components/FormButtonComponent" ),
		SearchBarComponent: require( "components/SearchBarComponent" ),
		SettingsBarComponent: require( "components/SettingsBarComponent" ),
		ExternalLinkComponent: require( "components/ExternalLinkComponent" ),
		LivestreamerDocsComponent: require( "components/LivestreamerDocsComponent" ),
		CheckBoxComponent: require( "components/CheckBoxComponent" ),
		RadioButtonComponent: require( "components/RadioButtonComponent" ),
		RadioButtonsComponent: require( "components/RadioButtonsComponent" ),
		FileSelectComponent: require( "components/FileSelectComponent" ),
		GameItemComponent: require( "components/GameItemComponent" ),
		StreamItemComponent: require( "components/StreamItemComponent" ),
		ChannelItemComponent: require( "components/ChannelItemComponent" ),
		SubscriptionItemComponent: require( "components/SubscriptionItemComponent" ),
		InfiniteScrollComponent: require( "components/InfiniteScrollComponent" ),
		EmbeddedLinksComponent: require( "components/EmbeddedLinksComponent" ),
		FlagIconComponent: require( "components/FlagIconComponent" ),
		StatsRowComponent: require( "components/StatsRowComponent" ),
		LangFilterComponent: require( "components/LangFilterComponent" ),


		// Content
		FeaturedRoute: require( "routes/FeaturedRoute" ),
		FeaturedController: require( "controllers/FeaturedController" ),
		FeaturedView: require( "views/FeaturedView" ),

		WatchingRoute: require( "routes/WatchingRoute" ),
		WatchingController: require( "controllers/WatchingController" ),
		WatchingView: require( "views/WatchingView" ),

		SearchRoute: require( "routes/SearchRoute" ),
		SearchController: require( "controllers/SearchController" ),
		SearchView: require( "views/SearchView" ),

		GamesLoadingRoute: require( "routes/LoadingRoute" ),
		GamesLoadingView: require( "views/LoadingView" ),
		GamesIndexRoute: require( "routes/GamesIndexRoute" ),
		GamesIndexController: require( "controllers/GamesIndexController" ),
		GamesIndexView: require( "views/GamesIndexView" ),
		GamesGameRoute: require( "routes/GamesGameRoute" ),
		GamesGameController: require( "controllers/GamesGameController" ),
		GamesGameView: require( "views/GamesGameView" ),

		ChannelsLoadingRoute: require( "routes/LoadingRoute" ),
		ChannelsLoadingView: require( "views/LoadingView" ),
		ChannelsRoute: require( "routes/ChannelsRoute" ),
		ChannelsController: require( "controllers/ChannelsController" ),
		ChannelsView: require( "views/ChannelsView" ),

		ChannelRoute: require( "routes/ChannelRoute" ),
		ChannelController: require( "controllers/ChannelController" ),
		ChannelView: require( "views/ChannelView" ),
		ChannelLoadingRoute: require( "routes/LoadingRoute" ),
		ChannelLoadingView: require( "views/LoadingView" ),
		ChannelIndexRoute: require( "routes/ChannelIndexRoute" ),
		ChannelIndexController: require( "controllers/ChannelIndexController" ),
		ChannelIndexView: require( "views/ChannelIndexView" ),
		ChannelSettingsRoute: require( "routes/ChannelSettingsRoute" ),
		ChannelSettingsController: require( "controllers/ChannelSettingsController" ),
		ChannelSettingsView: require( "views/ChannelSettingsView" ),

		UserLoadingRoute: require( "routes/LoadingRoute" ),
		UserLoadingView: require( "views/LoadingView" ),
		UserIndexRoute: require( "routes/UserIndexRoute" ),
		UserIndexController: require( "controllers/UserIndexController" ),
		UserIndexView: require( "views/UserIndexView" ),
		UserAuthRoute: require( "routes/UserAuthRoute" ),
		UserAuthController: require( "controllers/UserAuthController" ),
		UserAuthView: require( "views/UserAuthView" ),
		UserSubscriptionsRoute: require( "routes/UserSubscriptionsRoute" ),
		UserSubscriptionsView: require( "views/UserSubscriptionsView" ),
		UserFollowedStreamsRoute: require( "routes/UserFollowedStreamsRoute" ),
		UserFollowedStreamsView: require( "views/UserFollowedStreamsView" ),
		UserFollowedChannelsRoute: require( "routes/UserFollowedChannelsRoute" ),
		UserFollowedChannelsView: require( "views/UserFollowedChannelsView" ),
		UserFollowedGamesRoute: require( "routes/UserFollowedGamesRoute" ),
		UserFollowedGamesView: require( "views/UserFollowedGamesView" ),

		SettingsRoute: require( "routes/SettingsRoute" ),
		SettingsController: require( "controllers/SettingsController" ),
		SettingsView: require( "views/SettingsView" ),
		SettingsModalTemplate: require( "text!templates/modals/settings.html.hbs" ),

		AboutView: require( "views/AboutView" ),


		// ready event
		ready: function ready() {
			var nwWindow = require( "nwjs/nwWindow" );

			// wait for the SettingsService to load
			var settings = this.__container__.lookup( "service:settings" );
			settings.addObserver( "content", function() {
				if ( !settings.get( "content" ) ) { return; }
				nwWindow.emit( "ready", settings );
			});
		},

		toString: function() { return "App"; }

	});

});
