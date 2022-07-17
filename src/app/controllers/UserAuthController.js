define( [ "ember", "text!/oauth.json" ], function( Ember, OAuth ) {

	var	get = Ember.get,
		set = Ember.set,
		reURI = /^([a-z]+):\/\/([\w-]+(?:\.\w+)*)(\/.+)?$/;

	OAuth = JSON.parse( OAuth );


	return Ember.ObjectController.extend({
		needs: [ "application" ],

		nwGuiBinding: "controllers.application.nwGui",
		configBinding: "controllers.application.content.package.config",
		windowOptions: get( OAuth, "window" ),
		redirectEnabled: false,

		previousTransition: null,

		auth_win: null,
		auth_failure: false,

		auth_url: function() {
			return get( this, "config.twitch-oauth-base-uri" )
				.replace( "{client-id}", get( this, "config.twitch-oauth-client-id" ) )
				.replace( "{redirect-uri}", get( this, "config.twitch-oauth-redirect-uri" ) )
				.replace( "{scope}", get( this, "config.twitch-oauth-scope" ).join( "+" ) );
		}.property( "config" ),


		enableRedirect: function() {
			if ( get( this, "redirectEnabled" ) ) { return; }

			var	src	= reURI.exec( get( this, "config.twitch-oauth-base-uri" ) ),
				dst	= reURI.exec( get( this, "config.twitch-oauth-redirect-uri" ) );

			if ( !src || !dst ) {
				throw new Error( "Invalid oauth parameters" );
			}

			// enable the redirect from https://api.twitch.tv to app://livestreamer-twitch-gui
			get( this, "nwGui" ).App.addOriginAccessWhitelistEntry( src[0], dst[1], dst[2], true );
			set( this, "redirectEnabled", true );
		},


		loadUserRecord: function() {
			var	self = this,
				store = this.store;

			return store.find( "auth", 1 )
				.then(function( record ) {
					// tell the twitch adapter to use the token from now on
					self.updateAdapter( get( record, "access_token" ) );

					// validate token
					return store.findAll( "twitchToken", null )
						.then(function( record ) {
							record = record.objectAt( 0 );
							if ( !get( record, "valid" ) || !get( record, "user_name" ) ) {
								twitchAdapter.set( "access_token", null );
								throw new Error( "Invalid access token" );
							}

							set( self, "model", record );
						});
				});
		},

		updateAdapter: function( token ) {
			var adapter = this.container.lookup( "adapter:application" );
			if ( !adapter ) {
				throw new Error( "Adapter not found" );
			}

			set( adapter, "access_token", token );
		},


		actions: {
			"signin": function() {
				if ( get( this, "auth_win" ) ) { return; }

				set( this, "auth_failure", false );

				var	url = get( this, "auth_url" ),
					opt = get( this, "windowOptions" ),
					scope_expected = get( this, "config.twitch-oauth-scope" ).join( "+" ),
					store = this.store,
					win;

				function callback( hash ) {
					var	params = hash.split( "&" ).reduce(function( obj, elem ) {
							var split = elem.split( "=" );
							obj[ split.splice( 0, 1 ) ] = split.join( "=" );
							return obj;
						}, {} ),
						data;

					if ( !params[ "access_token" ] || params[ "scope" ] !== scope_expected ) {
						set( this, "auth_failure", true );

					} else {
						data = {
							access_token: params[ "access_token" ],
							scope: params[ "scope" ],
							date: new Date()
						};

						// save the token
						store.find( "auth", 1 )
							.then(function( record ) {
								record.setProperties( data ).save();
							}, function() {
								data.id = 1;
								store.createRecord( "auth", data ).save();
							})

							// update adapter and fetch user record
							.then( this.loadUserRecord.bind( this ) )

							// user is logged in! return to previous route
							.then(function() {
								var previousTransition = get( this, "previousTransition" );
								if ( previousTransition ) {
									set( this, "previousTransition", null );
									previousTransition.retry();
								} else {
									this.transitionToRoute( "user.index" );
								}
							}.bind( this ) )

							// something stupid happened
							.catch(function() {
								set( this, "auth_failure", true );
							}.bind( this ) );
					}

					win.close();
				}

				function onClose() {
					set( this, "auth_win", null );
					delete window.OAUTH_CALLBACK;
				}

				// add to the global namespace
				window.OAUTH_CALLBACK = callback.bind( this );

				// open window
				this.enableRedirect();
				win = get( this, "nwGui" ).Window.open( url, opt );
				win.on( "closed", onClose.bind( this ) );
				set( this, "auth_win", win );
			},

			"signout": function() {
				set( this, "model", null );
				this.store.find( "auth", 1 ).then(function( record ) {
					this.updateAdapter( null );
					record.destroyRecord();
				}.bind( this ) );
			}
		}
	});

});
