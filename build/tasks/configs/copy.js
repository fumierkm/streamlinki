module.exports = {
	dev: {
		expand: true,
		dest  : "build/tmp/dev",
		cwd   : "src",
		src   : [
			"package.json",
			"index.html"
		]
	},

	prod: {
		expand: true,
		dest  : "build/tmp/prod",
		cwd   : "src",
		src   : [
			"package.json",
			"index.html"
		]
	},

	test: {
		files: [
			{
				src : "src/test/index.html",
				dest: "build/tmp/test/index.html"
			},
			{
				src : "src/vendor/qunit/qunit/qunit.css",
				dest: "build/tmp/test/vendor/qunit/qunit/qunit.css"
			}
		]
	},

	win32scripts: {
		expand : true,
		flatten: true,
		src    : "build/resources/windows/*",
		dest   : "build/releases/<%= package.name %>/win32/"
	},
	win64scripts: {
		expand : true,
		flatten: true,
		src    : "build/resources/windows/*",
		dest   : "build/releases/<%= package.name %>/win64/"
	},

	linux32scripts: {
		options: { mode: 493 }, // 0755 (js strict mode)
		expand : true,
		flatten: true,
		src    : "build/resources/linux/*.sh",
		dest   : "build/releases/<%= package.name %>/linux32/"
	},
	linux64scripts: {
		options: { mode: 493 }, // 0755 (js strict mode)
		expand : true,
		flatten: true,
		src    : "build/resources/linux/*.sh",
		dest   : "build/releases/<%= package.name %>/linux64/"
	},

	linux32icons: {
		expand : true,
		flatten: true,
		src    : "build/resources/icons/*.png",
		dest   : "build/releases/<%= package.name %>/linux32/icons/"
	},
	linux64icons: {
		expand : true,
		flatten: true,
		src    : "build/resources/icons/*.png",
		dest   : "build/releases/<%= package.name %>/linux64/icons/"
	}
};
