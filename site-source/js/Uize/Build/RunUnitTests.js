/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.RunUnitTests Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 3
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Build.RunUnitTests= module provides a method for testing all modules of the UIZE JavaScript Framework.

		*DEVELOPERS:* `Chris van Rensburg`

		EXAMPLES
		.....................................................
		node build.js Uize.Build.RunUnitTests useSource=false
		node build.js Uize.Build.RunUnitTests useSource=true
		.....................................................
*/

Uize.module ({
	name:'Uize.Build.RunUnitTests',
	required:[
		'Uize.Test',
		'Uize.Build.Util',
		'Uize.Build.ModuleInfo',
		'Uize.Data.Matches'
	],
	builder:function () {
		'use strict';

		return Uize.package ({
			perform:function (_params) {
				var
					_libraryModuleSuffixRegExp = /\.library$/i,
					_modulesExcludingLibraryModules = Uize.Data.Matches.values (
						Uize.Build.Util.getJsModules (_params),
						function (_moduleName) {
							return !_libraryModuleSuffixRegExp.test (_moduleName); // ignore .library modules
						}
					),
					_modulesLookup = Uize.lookup (_modulesExcludingLibraryModules),
					_testModuleName,
					_testModuleRegExp = /^[a-zA-Z_\$][a-zA-Z0-9_\$]*\.Test($|\.)/,
					_modulesInDependencyOrder = Uize.Build.ModuleInfo.traceDependencies (
						Uize.Data.Matches.values (
							_modulesExcludingLibraryModules,
							function (_moduleName) {
								return !_testModuleRegExp.test (_moduleName); // ignore test modules
							}
						)
					),
					_unitTestSuite = Uize.Test.resolve ({
						title:'Unit Tests Suite',
						test:Uize.map (
							_modulesInDependencyOrder,
							function (_moduleName) {
								return (
									_modulesLookup [_testModuleName = Uize.Build.Util.getTestModuleName (_moduleName)]
										? Uize.Test.testModuleTest (_testModuleName)
										: Uize.Test.requiredModulesTest (_moduleName)
								);
							}
						)
					})
				;
				Uize.Build.Util.runUnitTests (_unitTestSuite,_params.silent == 'true',_params.logFilePath);
			}
		});
	}
});

