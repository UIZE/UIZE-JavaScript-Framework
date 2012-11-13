/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.BuildJsModules Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 5
	codeCompleteness: 100
	testCompleteness: 0
	docCompleteness: 4
*/

/*?
	Introduction
		The =UizeSite.Build.BuildJsModules= package builds all the JavaScript modules needed by the UIZE Web site.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeSite.Build.BuildJsModules',
	required:[
		'UizeSite.Build.File',
		'Uize.Services.FileSystem'
	],
	builder:function () {
		/*** Variables for Scruncher Optimization ***/
			var _package = function () {};

		/*** Public Static Methods ***/
			_package.perform = function (_params) {
				var
					_urlsToBuild = [],
					_modulesFolder = 'js'
				;

				/*** add URLs for generated JavaScript modules ***/
					_urlsToBuild.push (
						_modulesFolder + '/UizeSite.ModulesTree.js',
						_modulesFolder + '/UizeSite.Examples.js',
						_modulesFolder + '/UizeSite.ExamplesInfoForSiteMap.js'
					);

				/*** add URLs for all JavaScript files (modules and otherwise) ***/
					var _jsModuleExtensionRegExp = /\.js(\.jst)?$/;
					_urlsToBuild.push.apply (
						_urlsToBuild,
						Uize.Services.FileSystem.singleton ().getFiles ({
							path:_params.sourcePath,
							recursive:true,
							pathMatcher:_jsModuleExtensionRegExp,
							pathTransformer:function (_path) {return _path.replace (_jsModuleExtensionRegExp,'.js')}
						})
					);

				/*** now build all the pages ***/
					UizeSite.Build.File.perform (Uize.copyInto ({url:_urlsToBuild},_params));
			};

		return _package;
	}
});

