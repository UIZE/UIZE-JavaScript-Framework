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
		'Uize.Services.FileSystem',
		'UizeSite.Build.File',
		'Uize.Wsh'
	],
	builder:function () {
		/*** Variables for Scruncher Optimization ***/
			var _package = function () {};

		/*** Public Static Methods ***/
			_package.perform = function (_params) {
				var
					_modulesFolder = 'js',
					_fileSystem = Uize.Services.FileSystem.singleton (),
					_moduleExtensionRegExp = /(\.js|\.js\.jst)$/,
					_modules = Uize.map (
						_fileSystem.getFiles ({
							path:_params.sourcePath + '/' + _modulesFolder,
							pathMatcher:_moduleExtensionRegExp
						}),
						function (_fileName) {return _fileName.replace (_moduleExtensionRegExp,'')}
					)
				;
				_modules.push (
					'UizeSite.ModulesTree',
					'UizeSite.ExamplesInfoForSiteMap'
				);
				Uize.forEach (
					_modules.sort (),
					function (_moduleName) {
						UizeSite.Build.File.perform (
							Uize.copyInto ({url:_modulesFolder + '/' + _moduleName + '.js'},_params)
						);
					}
				);
			};

		return _package;
	}
});

