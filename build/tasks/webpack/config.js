const { resolve: r } = require( "path" );
const { pRoot, pApp, pImages, pTest, pDependencies } = require( "./paths" );


const resolveModuleDirectories = [
	"web_modules",
	"node_modules"
];
const resolveLoaderModuleDirectories = [
	"web_loaders",
	...resolveModuleDirectories
];


// default target config which each target is based on
module.exports = {
	target: "node-webkit",

	mode: "development",

	context: pRoot,
	entry: "main",

	resolve: {
		alias: {
			// directory aliases
			"root": pRoot,
			"img": pImages,

			// app aliases
			"shim": r( pRoot, "shim" ),
			"config": r( pApp, "config" ),
			"data": r( pApp, "data" ),
			"init": r( pApp, "init" ),
			"locales": r( pApp, "locales" ),
			"nwjs": r( pApp, "nwjs" ),
			"services": r( pApp, "services" ),
			"ui": r( pApp, "ui" ),
			"utils": r( pApp, "utils" )
		},
		extensions: [ ".wasm", ".mjs", ".js", ".json", ".ts" ],
		modules: [
			...resolveModuleDirectories
		]
	},

	resolveLoader: {
		modules: [
			pRoot,
			...resolveLoaderModuleDirectories
		]
	},

	module: {
		rules: [],
		noParse: []
	},

	plugins: [],


	output: {
		// name each file by their entry module name
		filename: "[name].js",
		// don't use the webpack:// protocol in sourcemaps
		devtoolModuleFilenameTemplate: "/[resource-path]"
	},

	optimization: {
		runtimeChunk: true,
		splitChunks: {
			chunks: "all",
			cacheGroups: {
				vendors: {
					name: "vendor",
					test: pDependencies
				},
				template: {
					name: "template",
					test: /\.hbs$/
				},
				test: {
					name: "test",
					test: pTest
				}
			}
		}
	},


	cache: true,
	performance: {
		hints: "warning",
		maxEntrypointSize: Infinity,
		maxAssetSize: Infinity
	},

	stats: {
		modules: false,
		chunks: false,
		chunkModules: false,
		children: false,
		timings: true,
		warnings: true
	}
};
