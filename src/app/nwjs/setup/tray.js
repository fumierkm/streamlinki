define([
	"config",
	"nwjs/nwWindow",
	"nwjs/tray",
	"utils/node/platform",
	"utils/node/resolvePath"
], function(
	config,
	nwWindow,
	tray,
	platform,
	resolvePath
) {

	var displayName = config.main[ "display-name" ];
	var trayIcon    = config.files[ "icons" ][ "tray" ][ platform.platform ];


	function createTrayIcon() {
		var icon = resolvePath( trayIcon );

		// apply a tray icon+menu to the main application window
		nwWindow.tray = tray.create({
			tooltip: displayName,
			icon   : icon,
			items  : [
				{
					label: "Toggle window",
					click: function() {
						nwWindow.tray.click();
					}
				},
				{
					label: "Close application",
					click: function() {
						nwWindow.close();
					}
				}
			]
		});

		// prevent tray icons from stacking up when refreshing the page or devtools
		nwWindow.window.addEventListener( "beforeunload", function() {
			nwWindow.tray.remove();
		}, false );
	}


	return {
		createTrayIcon: createTrayIcon
	};

});
