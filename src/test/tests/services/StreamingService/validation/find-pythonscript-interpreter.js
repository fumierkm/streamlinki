import {
	module,
	test
} from "qunit";
import readLinesInjector from "inject-loader?fs!utils/node/fs/readLines";
import findPythonscriptInterpreterInjector
	from "inject-loader!services/StreamingService/validation/find-pythonscript-interpreter";
import { EventEmitter } from "events";
import {
	posix,
	win32
} from "path";


const { dirname: dirnamePosix } = posix;
const { dirname: dirnameWin32 } = win32;

class ReadStream extends EventEmitter {
	close() {}
}


module( "services/StreamingService/validation/find-pythonscript-interpreter" );


test( "Invalid content", async assert => {

	assert.expect( 4 );

	const readStream = new ReadStream();

	const readLines = readLinesInjector({
		fs: {
			createReadStream( file ) {
				assert.strictEqual( file, "/foo/bar", "Reads the correct file" );
				return readStream;
			}
		}
	})[ "default" ];

	const findPythonscriptInterpreter = findPythonscriptInterpreterInjector({
		"utils/node/fs/readLines": readLines,
		"utils/node/fs/whichFallback": function() {},
		"path": {
			dirname: dirnamePosix
		}
	})[ "default" ];

	try {
		const promise = findPythonscriptInterpreter( "/foo/bar", "exec" );
		readStream.emit( "end" );
		await promise;
	} catch ( data ) {
		assert.ok( true, "Throws an error on missing file content" );
	}

	try {
		const promise = findPythonscriptInterpreter( "/foo/bar", "exec" );
		readStream.emit( "data", "foo\n" );
		readStream.emit( "end" );
		await promise;
	} catch ( data ) {
		assert.ok( true, "Throws an error on invalid file content" );
	}

});


test( "Pythonscript shebang Posix", async assert => {

	assert.expect( 5 );

	const readStream = new ReadStream();
	const readLines = readLinesInjector({
		fs: {
			createReadStream( file ) {
				assert.strictEqual( file, "foo", "Reads the correct file" );
				return readStream;
			}
		}
	})[ "default" ];

	const findPythonscriptInterpreter = findPythonscriptInterpreterInjector({
		"utils/node/fs/readLines": readLines,
		"utils/node/fs/whichFallback": function( execName, fallbackPaths, check, fallbackOnly ) {
			assert.strictEqual( execName, "exec", "Looks up correct exec name" );
			assert.strictEqual( fallbackPaths, "/foo/bar", "Uses correct fallback path" );
			assert.ok( fallbackOnly, "Only uses fallback paths" );

			return `${fallbackPaths}/${execName}`;
		},
		"path": {
			dirname: dirnamePosix
		}
	})[ "default" ];

	let promise;
	let result;

	promise = findPythonscriptInterpreter( "foo", "exec" );
	readStream.emit( "data", "#!/foo/bar/baz\n" );
	readStream.emit( "end" );
	result = await promise;
	assert.propEqual( result, { exec: "/foo/bar/exec" }, "Returns the correct exec path" );

});


test( "Pythonscript shebang Win32", async assert => {

	assert.expect( 5 );

	const readStream = new ReadStream();
	const readLines = readLinesInjector({
		fs: {
			createReadStream( file ) {
				assert.strictEqual( file, "foo", "Reads the correct file" );
				return readStream;
			}
		}
	})[ "default" ];

	const findPythonscriptInterpreter = findPythonscriptInterpreterInjector({
		"utils/node/fs/readLines": readLines,
		"utils/node/fs/whichFallback": function( execName, fallbackPaths, check, fallbackOnly ) {
			assert.strictEqual( execName, "exec", "Looks up correct exec name" );
			assert.strictEqual( fallbackPaths, "C:\\foo\\bar", "Uses correct fallback path" );
			assert.ok( fallbackOnly, "Only uses fallback paths" );

			return `${fallbackPaths}\\${execName}`;
		},
		"path": {
			dirname: dirnameWin32
		}
	})[ "default" ];

	let promise;
	let result;

	promise = findPythonscriptInterpreter( "foo", "exec" );
	readStream.emit( "data", "#!\"C:\\foo\\bar\\baz\"\n" );
	readStream.emit( "end" );
	result = await promise;
	assert.propEqual( result, { exec: "C:\\foo\\bar\\exec" }, "Returns the correct exec path" );

});


test( "Bash wrapper script", async assert => {

	assert.expect( 8 );

	const contents = {
		"/foo/bar": "#!/bin/bash\nPYTHONPATH=\"foobar\" exec \"/baz/qux\" \"$@\"\n",
		"/bar/foo": "#!/usr/bin/env bash\nPYTHONPATH=\"foobar\" exec \"/baz/qux\" \"$@\"\n",
		"/baz/qux": "#!/one/two/three\n"
	};

	const readStreams = {
		"/foo/bar": new ReadStream(),
		"/bar/foo": new ReadStream(),
		"/baz/qux": new ReadStream()
	};

	const readLines = readLinesInjector({
		fs: {
			createReadStream( file ) {
				return readStreams[ file ];
			}
		}
	})[ "default" ];

	const findPythonscriptInterpreter = findPythonscriptInterpreterInjector({
		"utils/node/fs/readLines": async function( file, ...args ) {
			const promise = readLines( file, ...args );

			readStreams[ file ].emit( "data", contents[ file ] );
			readStreams[ file ].emit( "end" );

			return await promise;
		},
		"utils/node/fs/whichFallback": function( execName, fallbackPaths, check, fallbackOnly ) {
			assert.strictEqual( execName, "exec", "Looks up correct exec name" );
			assert.strictEqual( fallbackPaths, "/one/two", "Uses correct fallback path" );
			assert.ok( fallbackOnly, "Only uses fallback paths" );

			return `${fallbackPaths}/${execName}`;
		},
		"path": {
			dirname: dirnamePosix
		}
	})[ "default" ];

	const resultA = await findPythonscriptInterpreter( "/foo/bar", "exec" );
	assert.propEqual(
		resultA,
		{
			exec: "/one/two/exec",
			pythonscript: "/baz/qux",
			env: {
				PYTHONPATH: "foobar"
			}
		},
		"Returns the correct exec object (explicit shebang)"
	);

	const resultB = await findPythonscriptInterpreter( "/bar/foo", "exec" );
	assert.propEqual(
		resultB,
		{
			exec: "/one/two/exec",
			pythonscript: "/baz/qux",
			env: {
				PYTHONPATH: "foobar"
			}
		},
		"Returns the correct exec object (env shebang)"
	);

});


test( "Chained bash wrapper scripts", async assert => {

	assert.expect( 1 );

	const readStream = new ReadStream();

	const readLines = readLinesInjector({
		fs: {
			createReadStream() {
				return readStream;
			}
		}
	})[ "default" ];

	const findPythonscriptInterpreter = findPythonscriptInterpreterInjector({
		"utils/node/fs/readLines": async function() {
			const promise = readLines( ...arguments );
			// emit the same file content twice
			readStream.emit(
				"data",
				"#!/bin/bash\nPYTHONPATH=\"foobar\" exec \"/foo/bar\" \"$@\"\n"
			);
			readStream.emit( "end" );

			return await promise;
		},
		"utils/node/fs/whichFallback": function() {},
		"path": {
			dirname: dirnamePosix
		}
	})[ "default" ];

	try {
		await findPythonscriptInterpreter( "/foo/bar", "exec" );
	} catch ( e ) {
		assert.strictEqual(
			e.message,
			"Couldn't validate python script of the selected streaming provider",
			"Throws an error on chained bash wrapper scripts"
		);
	}

});
