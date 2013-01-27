/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.RunUnitTests Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2013 UIZE
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
*/

Uize.module ({
	name:'Uize.Build.RunUnitTests',
	required:[
		'Uize.Services.FileSystem',
		'Uize.Test',
		'Uize.Build.Util',
		'Uize.Build.ModuleInfo',
		'Uize.Data.Matches'
	],
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var _package = function () {};

		/*** General Variables ***/
			var _fileSystem = Uize.Services.FileSystem.singleton ();

		/*** Public Static Methods ***/
			_package.perform = function (_params) {
				var
					_dotJsRegExp = /\.js$/i,
					_dotLibraryDotJsRegExp = /\.library\.js$/i,
					_modules = _fileSystem.getFiles ({
						path:_params.moduleFolderPath,
						pathMatcher:function (_filePath) {
							return _dotJsRegExp.test (_filePath) && !_dotLibraryDotJsRegExp.test (_filePath)
						},
						pathTransformer:function (_filePath) {
							return Uize.Url.from (_filePath).fileName;
						}
					}).sort (),
					_modulesLookup = Uize.lookup (_modules),
					_testModuleName,
					_testModuleRegExp = /^[a-zA-Z_\$][a-zA-Z0-9_\$]*\.Test($|\.)/,
					_modulesInDependencyOrder = Uize.Build.ModuleInfo.traceDependencies (
						Uize.Data.Matches.values (
							_modules,
							function (_moduleName) {return !_testModuleRegExp.test (_moduleName)} // ignore test modules
						)
					),
					_unitTestSuite = Uize.Test.declare ({
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
			};

		return _package;
	}
});

