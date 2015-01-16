/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.FileBuilders.ModuleInfoModules Package
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
		The =UizeSite.Build.FileBuilders.ModuleInfoModules= module defines a file builder for the generated module info modules under the =UizeSite.ModuleInfo= namespace.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'UizeSite.Build.FileBuilders.ModuleInfoModules',
	required:[
		'Uize.Build.Util',
		'Uize.Str.Has'
	],
	builder:function () {
		'use strict';

		var
			_moduleInfoModulesNamespace = 'UizeSite.ModuleInfo' + '.',
			_moduleInfoModulesNamespaceLength = _moduleInfoModulesNamespace.length,
			_jsModuleExtensionRegExp = Uize.Build.Util.jsModuleExtensionRegExp
		;

		function _moduleNameFromBuiltPath (m,_path) {
			return m.moduleNameFromPath (_path,'built');
		}

		return Uize.package ({
			description:'Generated module info modules under built',
			urlMatcher:function (_urlParts) {
				var _pathname = _urlParts.pathname;
				return (
					this.isBuiltUrl (_pathname) &&
					_jsModuleExtensionRegExp.test (_pathname) &&
					Uize.Str.Has.hasPrefix (_moduleNameFromBuiltPath (this,_pathname),_moduleInfoModulesNamespace)
				);
			},
			builderInputs:function (_urlParts) {
				var
					m = this,
					_moduleName = _moduleNameFromBuiltPath (m,_urlParts.pathname).slice (_moduleInfoModulesNamespaceLength),
					_moduleUrl = m.getModuleUrl (_moduleName)
				;
				return {
					reference:m.builtUrl ('reference/' + _moduleName + '.html'),
					metaData:m.memoryUrl (_moduleUrl + '.metadata'),
					builtSize:m.memoryUrl (_moduleUrl + '.builtsize'),
					directDependencies:m.memoryUrl (_moduleUrl + '.deps')
				};
			},
			builder:function (_inputs,_urlParts) {
				var m = this;
				return Uize.Build.Util.dataAsModule (
					_moduleNameFromBuiltPath (m,_urlParts.pathname),
					{
						description:Uize.Build.Util.getHtmlFileInfo (_inputs.reference).description,
						metaData:m.readFile ({path:_inputs.metaData}),
						builtSize:m.readFile ({path:_inputs.builtSize}),
						directDependencies:m.readFile ({path:_inputs.directDependencies})
					}
				);
			}
		});
	}
});

