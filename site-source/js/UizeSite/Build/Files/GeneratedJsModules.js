/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.Files.GeneratedJsModules Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	docCompleteness: 30
*/

/*?
	Introduction
		The =UizeSite.Build.Files.GeneratedJsModules= package provides a method for building all the purely generated JavaScript modules for the UIZE Web site.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeSite.Build.Files.GeneratedJsModules',
	required:'Uize.Build.Util',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticMethods:{
				determineFilesToBuild:function (_params) {
					var
						m = this,
						_modulesFolder = _params.modulesFolder
					;

					function _modulePath (_moduleName) {
						return _modulesFolder + '/' + Uize.modulePathResolver (_moduleName) + '.js';
					}

					/*** add URLs for all the module info modules ***/
						m.addFiles (
							Uize.map (
								Uize.Build.Util.getJsModules (_params),
								function (_moduleName) {return _modulePath ('UizeSite.ModuleInfo.' + _moduleName)}
							)
						);

					/*** add URLs for other miscellaneous generated JavaScript modules ***/
						m.addFiles (
							_modulePath ('UizeSite.Sotu')
						);
				}
			}
		});
	}
});

