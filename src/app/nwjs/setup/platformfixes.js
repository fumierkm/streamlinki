define([
	"os",
	"path"
], function(
	OS,
	PATH
) {

	var reNwjsCacheDirName = /^nw\d+_\d+$/;


	function platformfixes() {
		// Fix CWD, which may be somewhere in the OS's temp dir.
		// Caused by NWjs extracting the compressed app content appended to the executable.
		// Fixes #237
		var cwd = process.cwd();

		// add a NWJSAPPPATH env var to the current process
		// will be required by paths pointing to files inside the NWjs app content folder
		if ( !process.env.NWJSAPPPATH ) {
			process.env.NWJSAPPPATH = cwd;
		}

		var tmpdir = OS.tmpdir();
		var relative = PATH.relative( tmpdir, cwd );

		if ( reNwjsCacheDirName.test( relative ) ) {
			try {
				var newCwd = PATH.dirname( process.execPath );
				process.chdir( newCwd );
			} catch( e ) {}
		}
	}


	return platformfixes;

});
