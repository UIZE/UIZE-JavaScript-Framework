/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.FileBuilders.InMemoryModuleDirectDependencies Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Build.FileBuilders.InMemoryModuleDirectDependencies= module defines a file builder for the in-memory direct dependencies object for each JavaScript module.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'Uize.Build.FileBuilders.InMemoryModuleDirectDependencies',
	required:'Uize.Build.ModuleInfo',
	builder:function () {
		'use strict';

		var _moduleDepsExtensionRegExp = /\.js\.deps$/;

		return Uize.package ({
			description:'In-memory module direct dependencies object',
			urlMatcher:function (_urlParts) {
				var _pathname = _urlParts.pathname;
				return this.isMemoryUrl (_pathname) && _moduleDepsExtensionRegExp.test (_pathname);
			},
			builderInputs:function (_urlParts) {
				return {
					jsModule:this.tempUrlFromMemoryUrl (_urlParts.pathname.replace (_moduleDepsExtensionRegExp,'.js'))
				};
			},
			builder:function (_inputs,_urlParts) {
				return (
					/* HACK:
						This is needed because the Uize base module is not a module defined using the Uize.module method, and so loading and evaluating its code in the Uize.Build.ModuleInfo.getDefinitionFromCode method results
						in the Uize object being overwritten. Besides this problem, the module is the base module and has no dependencies, anyway. Perhaps a better solution would be to modify the code so that it can be evaluated inside Uize.Build.ModuleInfo.getDefinitionFromCode, and to modify this method so that it returns something in this situation that is acceptable to callers of the method.
					*/
					_inputs.jsModule == this.tempUrl (this.params.modulesFolder + '/Uize.js')
						? []
						: Uize.Build.ModuleInfo.getDefinitionFromCode (this.readFile ({path:_inputs.jsModule})).required
				);
			}
		});
	}
});

