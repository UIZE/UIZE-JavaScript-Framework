/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.RunUnitTests Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 3
	codeCompleteness: 100
	testCompleteness: 0
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
		'Uize.Wsh',
		'Uize.Test',
		'Uize.Build.Util'
	],
	builder:function () {
		/*** Variables for Scruncher Optimization ***/
			var _package = function () {};

		/*** Utility Functions ***/
			function _getFilenameFromPath (_filePath) {
				return Uize.Url.from (_filePath).fileName;
			}

			function _match (_sourceStr,_regExp,_startPos) {
				(
					_regExp = new RegExp (
						_regExp.source,
						'g' + (_regExp.multiline ? 'm' : '') + (_regExp.ignoreCase ? 'i' : '')
					)
				).lastIndex = _startPos || 0;
				return _regExp.exec (_sourceStr);
			}

		/*** Public Static Methods ***/
			_package.perform = function (_params) {
				var
					_dotJsRegExp = /\.js$/i,
					_dotLibraryDotJsRegExp = /\.library\.js$/i,
					_testModuleRegExp = /^[a-zA-Z_\$][a-zA-Z0-9_\$]*\.Test($|\.)/,
					_modules = Uize.Wsh.getFiles (
						_params.moduleFolderPath,
						function (_filePath) {
							return _dotJsRegExp.test (_filePath) && !_dotLibraryDotJsRegExp.test (_filePath)
						},
						_getFilenameFromPath
					).sort (),
					_modulesLookup = Uize.lookup (_modules)
				;

				/*** build list of modules in dependency order ***/
					var
						_modulesProcessed = {},
						_modulesInDependencyOrder = []
					;
					function _addModuleAndDependencies (_moduleName) {
						if (!_modulesProcessed [_moduleName]) {
							_modulesProcessed [_moduleName] = 1;
							if (_moduleName) {
								var _moduleText;
								try {
									Uize.moduleLoader (
										_moduleName,
										function (_loadedModuleText) {_moduleText = _loadedModuleText}
									);
								} catch (_error) {
									// if a module cannot be loaded because it is missing, ignore it
								}
								if (_moduleText) {
									/* Example Module Declaration
										.........................
										Uize.module ({
											name:'',
											required:[],
											superclass:'',
											builder:function () {
												// builder code here
											}
										});
										.........................
									*/
									var
										_host = _moduleName.substr (0,_moduleName.lastIndexOf ('.')),
										_moduleDeclarationRegExp = new RegExp (
											'Uize\\s*\\.\\s*module\\s*\\(\\s*\\{\\s*name\\s*:\\s*([\'"])' +
											Uize.escapeRegExpLiteral (_moduleName) +
											'\\1'
										),
										_moduleDeclarationMatch = _match (_moduleText,_moduleDeclarationRegExp)
									;
									_host && _addModuleAndDependencies (_host);
									if (_moduleDeclarationMatch) {
										var
											_currentPos = _moduleDeclarationMatch.index + _moduleDeclarationMatch [0].length,
											_superclassRegExp = /superclass\s*:\s*(['"])([^'"]*)\1/,
											_superclassMatch = _match (_moduleText,_superclassRegExp,_currentPos),
											_requiredRegExp = /required\s*:\s*((['"])([^'"]*)\2|(\[[^\]]*\]))/,
											_requiredMatch = _match (_moduleText,_requiredRegExp,_currentPos)
										;
										_superclassMatch && _addModuleAndDependencies (_superclassMatch [2]);
										if (_requiredMatch) {
											if (_requiredMatch [4]) {
												var _required = [];
												try {_required = eval ('(' + _requiredMatch [4] + ')')} catch (_error) {}
												Uize.forEach (_required,_addModuleAndDependencies);
											} else {
												_addModuleAndDependencies (_requiredMatch [3]);
											}
										}
									}
									_modulesInDependencyOrder.push (_moduleName);
								}
							}
						}
					}
					Uize.forEach (
						_modules,
						function (_moduleName) { // ignore test modules
							_testModuleRegExp.test (_moduleName) || _addModuleAndDependencies (_moduleName);
						}
					);

				/*** build unit test suite ***/
					var
						_correspondingTestModuleName,
						_unitTestSuite = Uize.Test.declare ({
							title:'Unit Tests Suite',
							test:Uize.map (
								_modulesInDependencyOrder,
								function (_moduleName) {
									return (
										_modulesLookup [
											_correspondingTestModuleName =
												_moduleName.match (/([^\.]*)(\.|$)/) [1] + '.Test.' + _moduleName
										]
											? Uize.Test.testModuleTest (_correspondingTestModuleName)
											: Uize.Test.requiredModulesTest (_moduleName)
									);
								}
							)
						})
					;

				Uize.Build.Util.runUnitTests (_unitTestSuite,_params.silent == 'true');
			};

		return _package;
	}
});

