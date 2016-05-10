/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Runner Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 2
	codeCompleteness: 80
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Test.Runner= package module provides a way to dynamically produce a test runner instance that can act as a wrapper for running tests for one or more modules.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Runner',
	required:[
		'Uize.Str.Repeat',
		'Uize.Test',
		'Uize.Data.Matches',
		'Uize.Util.ModuleNaming',
		'Uize.Util.Matchers.ModuleNameMatcher'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize = Uize,
				_Uize_Util_ModuleNaming = _Uize.Util.ModuleNaming,
				_Uize_Test = _Uize.Test,
				_repeat = _Uize.Str.Repeat.repeat,
				_matchingValues = _Uize.Data.Matches.values
		;

		return _Uize.package ({
			resolve:function (_params,_getJsModules,_moduleExists,_consoleLog,_onDone,_callback) {
				var
					_module = _params.module || '*',
					_console = (_params.silent == 'true' ? 'silent' : _params.console) || 'summary'
				;

				function _createTestRunnerInstanceAndCallCallback (_TestClass) {
					var
						_testInstance = new _TestClass,
						_logChunks = []
					;
					function _log (_logChunk) {
						_console == 'verbose' && _consoleLog (_logChunk);
						_logChunks.push (_logChunk);
					}
					_testInstance.wire ({
						Start:
							function (_event) {
								_log (_repeat ('   ',_event.source.getDepth ()) + _event.source.get ('title'));
							},
						Done:
							function (_event) {
								var
									_test = _event.source,
									_reasonForFailure = _test.get ('reasonForFailure')
								;
								/*** add to log ***/
									_log (
										_repeat ('   ',_test.getDepth () + 1) +
										(
											_test.get ('result')
												? ('PASSED!!! (duration: ' + _test.get ('duration') + 'ms)')
												: ('*** FAILED *** ' + (_reasonForFailure || ''))
										)
									);

								/*** finish up if the test fails or if unit tests complete ***/
									if (_test == _testInstance || !_test.get ('result')) {
										var _synopsis = _test.getSynopsis ();
										(_console != 'silent' || _reasonForFailure) && _consoleLog (_synopsis);
										_logChunks.push (_synopsis);
										_onDone && _onDone (_reasonForFailure,_logChunks);
										_test.get ('result') || (_Uize.global().WScript && WScript.Quit (1));
									}
							}
					});
					_callback (_testInstance);
				}

				if (typeof _module == 'string') {
					/*** determine modules to test ***/
						var _modulesToTest;
						if (_Uize_Util_ModuleNaming.isModuleName (_module)) {
							_modulesToTest = [_Uize_Util_ModuleNaming.getModuleNameFromTestModuleName (_module)];
						} else {
							var
								_moduleNameMatcher = _Uize.Util.Matchers.ModuleNameMatcher.resolve (_module),
								_libraryModuleSuffixRegExp = /\.library$/i,
								_modulesExcludingLibraryModules = _matchingValues (
									_getJsModules ().sort (),
									function (_moduleName) {
										return !_libraryModuleSuffixRegExp.test (_moduleName); // ignore .library modules
									}
								),
								_modulesLookup = _Uize.lookup (_modulesExcludingLibraryModules)
							;
							_modulesToTest = _matchingValues (
								_modulesExcludingLibraryModules,
								function (_moduleName) {
									return (
										!/^[a-zA-Z_\$][a-zA-Z0-9_\$]*\.Test($|\.)/.test (_moduleName) && // ignore test modules
										_moduleNameMatcher (_moduleName) // only include modules from module name matcher
									);
								}
							);
						}

					/*** resolve modules to test to test class and run tests ***/
						var _testModuleName;
						if (_modulesToTest.length == 1) {
							var _moduleToTest = _modulesToTest [0];
							_testModuleName = _Uize_Util_ModuleNaming.getTestModuleName (_moduleToTest);
							if (_moduleExists (_testModuleName)) {
								_Uize.require (_testModuleName,_createTestRunnerInstanceAndCallCallback);
							} else {
								_createTestRunnerInstanceAndCallCallback (
									_Uize_Test.requiredModulesTest (
										_Uize_Util_ModuleNaming.getModuleNameFromTestModuleName (_moduleToTest)
									)
								);
							}
						} else {
							_createTestRunnerInstanceAndCallCallback (
								_Uize_Test.resolve ({
									title:'Unit Tests Suite',
									test:_Uize.map (
										_modulesToTest,
										function (_moduleName) {
											return (
												_modulesLookup [
													_testModuleName = _Uize_Util_ModuleNaming.getTestModuleName (_moduleName)
												]
													? _Uize_Test.testModuleTest (_testModuleName)
													: _Uize_Test.requiredModulesTest (_moduleName)
											);
										}
									)
								})
							);
						}
				} else {
					_createTestRunnerInstanceAndCallCallback (_module);
				}
			}
		});
	}
});

