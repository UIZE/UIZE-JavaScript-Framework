/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.ListJsModules Package
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
	docCompleteness: 4
*/

/*?
	Introduction
		The =Uize.Build.ListJsModules= package writes out a log file containing a list of all the JavaScript modules for a Web site.

		This information might be useful when doing audits. This build script was first used when starting the initiative of updating all the modules in the codebase to use strict mode, so it was a useful way to seed a task list. The list of JavaScript modules is written out to the log file "all-js-modules.log" in the "logs" folder that is at the root of the UIZE project.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Build.ListJsModules',
	required:[
		'Uize.Services.FileSystem',
		'Uize.Build.Util'
	],
	builder:function () {
		'use strict';

		return {
			perform:function (_params) {
				var
					_fileSystem = Uize.Services.FileSystem.singleton (),
					_jsModuleExtensionRegExp = Uize.Build.Util.jsModuleExtensionRegExp
				;
				_fileSystem.writeFile ({
					path:'logs/all-js-modules.log',
					contents:_fileSystem.getFiles ({
						path:_params.sourcePath,
						recursive:true,
						pathMatcher:_jsModuleExtensionRegExp,
						pathTransformer:function (_path) {return _path.replace (_jsModuleExtensionRegExp,'.js')}
					}).join ('\n')
				});
			}
		};
	}
});

