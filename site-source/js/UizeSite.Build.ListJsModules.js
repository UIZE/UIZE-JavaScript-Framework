/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.ListJsModules Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	testCompleteness: 0
	docCompleteness: 4
*/

/*?
	Introduction
		The =UizeSite.Build.ListJsModules= package writes out a log file containing a list of all the JavaScript modules for the UIZE JavaScript Framework and the UIZE Web site.

		This information might be useful when doing audits. This build script was first used when starting the initiative of updating all the modules in the codebase to use strict mode, so it was a useful way to seed a task list. The list of JavaScript modules is written out to the log file "all-js-modules.log" in the "logs" folder that is at the root of the UIZE project.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeSite.Build.ListJsModules',
	required:'Uize.Services.FileSystem',
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var _package = function () {};

		/*** Public Static Methods ***/
			_package.perform = function (_params) {
				var
					_fileSystem = Uize.Services.FileSystem.singleton (),
					_jsModuleExtensionRegExp = /\.js(\.jst)?$/
				;
				_fileSystem.writeFile ({
					path:'logs/all-js-modules.log',
					contents:
						_fileSystem.getFiles ({
							path:_params.sourcePath,
							recursive:true,
							pathMatcher:_jsModuleExtensionRegExp,
							pathTransformer:function (_path) {return _path.replace (_jsModuleExtensionRegExp,'.js')}
						}).join ('\n')
				});
			};

		return _package;
	}
});

