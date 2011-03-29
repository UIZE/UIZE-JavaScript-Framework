/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Wsh.BuildUtils Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Package
	importance: 3
	codeCompleteness: 100
	testCompleteness: 0
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Wsh.BuildUtils= package provides various utility methods to facilitate building of pages for a Web site project.

		*DEVELOPERS:* `Chris van Rensburg`

		The =Uize.Wsh.BuildUtils= module is designed specifically to run in the context of Windows Script Host.
*/

Uize.module ({
	name:'Uize.Wsh.BuildUtils',
	required:[
		'Uize.Url',
		'Uize.Template',
		'Uize.Data',
		'Uize.Data.Simple',
		'Uize.String',
		'Uize.String.Lines',
		'Uize.Json',
		'Uize.Array.Sort',
		'Uize.Test'
	],
	builder:function () {
		/*** Variables for Scruncher Optimization ***/
			var _package = function () {};

		/*** Global Variables ***/
			var _compiledJstFilesByPath = {};

		/*** Utility Functions ***/
			function _returnAsIs (_value) {return _value}

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
			_package.getHtmlFilesInfo = function (_folderToIndex,_titleExtractor) {
				var _files = [];
				if (!_titleExtractor) _titleExtractor = _returnAsIs;

				for (
					var
						_fileNo = -1,
						_filesToIndex = Uize.Wsh.getFiles (_folderToIndex),
						_filesToIndexLength = _filesToIndex.length
					;
					++_fileNo < _filesToIndexLength;
				) {
					var
						_filePath = _filesToIndex [_fileNo],
						_fileName = Uize.Url.from (_filePath).file
					;
					if (/\.html$/i.test (_fileName) && _fileName.charAt (0) != '~') {
						var
							_fileText = Uize.Wsh.readFile (_filePath),
							_keywordsMatch = _fileText.match (/<meta name="keywords" content="(.*?)"\/>/),
							_descriptionMatch = _fileText.match (/<meta name="description" content="(.*?)"\/>/),
							_imageSrcMatch = _fileText.match (/<link rel="image_src" href="(.*?)"\/>/)
						;
						_files.push ({
							path:_folderToIndex + '/' + _fileName,
							title:_titleExtractor (_fileText.match (/<title>(.*?)<\/title>/) [1]),
							keywords:_keywordsMatch ? _keywordsMatch [1] : '',
							description:_descriptionMatch ? _descriptionMatch [1] : '',
							imageSrc:_imageSrcMatch ? Uize.Url.toAbsolute (_folderToIndex,_imageSrcMatch [1]) : ''
						});
					}
				}

				/*** sort files in case-insensitive ASCIIbetical order ***/
					Uize.Array.Sort.sortBy (_files,'value.title.toLowerCase ()');

				return _files;
			};

			_package.readSimpleDataFile = function (_simpleDataFilePath) {
				return Uize.Data.Simple.parse ({simple:Uize.Wsh.readFile (_simpleDataFilePath),collapseChildren:true});
			};

			_package.compileJstFile = function (_jstTemplatePath) {
				var _template = _compiledJstFilesByPath [_jstTemplatePath];
				if (!_template) {
					if (!Uize.Wsh.fileExists (_jstTemplatePath)) return;
					_template = _compiledJstFilesByPath [_jstTemplatePath] = Uize.Template.compile (
						Uize.Wsh.readFile (_jstTemplatePath),
						{result:'full'}
					);
					Uize.module ({required:_template.required});
				}
				return _template.templateFunction;
			};

			_package.processJstFile = function (_jstTemplatePath,_input) {
				var _template = _package.compileJstFile (_jstTemplatePath);
				_template && Uize.Wsh.writeFile ({path:_jstTemplatePath.replace (/\.jst$/,''),text:_template (_input)});
			};

			_package.runScripts = function (_scripts) {
				var _error;
				if (!Uize.isArray (_scripts)) _scripts = [_scripts];
				for (
					var
						_scriptNo = -1,
						_scriptsLength = _scripts.length,
						_wshShell = new ActiveXObject ('WScript.Shell'),
						_errorCode
					;
					++_scriptNo < _scriptsLength && !_error;
				)
					if (_errorCode = _wshShell.Run ('WScript ' + _scripts [_scriptNo],0,true))
						_error = {
							script:_scripts [_scriptNo],
							errorCode:_errorCode
						}
				;
				return _error;
			};

			_package.testAllModules = function () {
				var
					_dotJsRegExp = /\.js$/i,
					_dotLibraryDotJsRegExp = /\.library\.js$/i,
					_testModuleRegExp = /^[a-zA-Z_\$][a-zA-Z0-9_\$]*\.Test($|\.)/,
					_modules = Uize.Wsh.getFiles (
						env.moduleFolderPath,
						function (_filePath) {
							return _dotJsRegExp.test (_filePath) && !_dotLibraryDotJsRegExp.test (_filePath)
						},
						_getFilenameFromPath
					).sort (),
					_modulesLookup = Uize.Data.getLookup (_modules)
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
												for (
													var _requireNo = -1, _requiredLength = _required.length;
													++_requireNo < _requiredLength;
												)
													_addModuleAndDependencies (_required [_requireNo])
												;
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
					for (var _moduleNo = -1, _modulesLength = _modules.length, _moduleName; ++_moduleNo < _modulesLength;)
						_testModuleRegExp.test (_moduleName = _modules [_moduleNo]) || // ignore, if module is a test module
							_addModuleAndDependencies (_moduleName)
					;

				/*** build test suite ***/
					var _test = [];
					for (
						var
							_moduleNo = -1,
							_modulesLength = (_modules = _modulesInDependencyOrder).length,
							_moduleName,
							_correspondingTestModuleName
						;
						++_moduleNo < _modulesLength;
					) {
						_moduleName = _modules [_moduleNo];
						_test.push (
							_modulesLookup [
								_correspondingTestModuleName =
									_moduleName.match (/([^\.]*)(\.|$)/) [1] + '.Test.' + _moduleName
							]
								? Uize.Test.testModuleTest (_correspondingTestModuleName)
								: Uize.Test.requiredModulesTest (_moduleName)
						);
					}

				_package.runUnitTests (Uize.Test.declare ({title:'Unit Tests Suite',test:_test}));
			};

			_package.runUnitTests = function (_unitTestsClass) {
				if (typeof _unitTestsClass == 'string') {
					Uize.module ({
						required:_unitTestsClass,
						builder:function () {_package.runUnitTests (eval (_unitTestsClass))}
					});
				} else {
					var
						_unitTests = new _unitTestsClass,
						_logChunks = []
					;
					_unitTests.wire ({
						Start:
							function (_event) {
								_logChunks.push (
									Uize.String.repeat ('\t',_event.source.getDepth ()) + _event.source.get ('title')
								);
							},
						Done:
							function (_event) {
								var
									_test = _event.source,
									_reasonForFailure = _test.get ('reasonForFailure')
								;
								/*** add to log ***/
									_logChunks.push (
										Uize.String.repeat ('\t',_test.getDepth () + 1) +
										(
											_test.get ('result')
												? ('PASSED!!! (duration: ' + _test.get ('duration') + 'ms)')
												: ('*** FAILED *** ' + (_reasonForFailure || ''))
										)
									);
									_reasonForFailure && _logChunks.push ('','',_test.getSynopsis ());

								/*** finish up if the test fails or if unit tests complete ***/
									if (_test == _unitTests || !_test.get ('result')) {
										(WScript.Arguments.Count () && WScript.Arguments.Item (0) == 'silent') ||
											alert (_test.getSynopsis ())
										;
										Uize.Wsh.writeFile ({
											path:WScript.ScriptName.replace (/\.js$/,'.log'),
											text:_logChunks.join ('\n')
										});
										_test.get ('result') || WScript.Quit (1);
									}
							}
					});
					_unitTests.run ();
				}
			};

			_package.writeDataModule = function (_moduleFolderPath,_moduleName,_moduleData) {
				Uize.Wsh.writeFile ({
					path:_moduleFolderPath + '\\' + _moduleName + '.js',
					text:
						'Uize.module ({\n' +
							'\tname:\'' + _moduleName + '\',\n' +
							'\tbuilder:function () {\n' +
								'\t\treturn function () {\n' +
								'\t\t\treturn ' + Uize.String.Lines.indent (Uize.Json.to (_moduleData),3,'\t',false) + ';\n' +
								'\t\t};\n' +
							'\t}\n' +
						'});\n'
				});
			};

		return _package;
	}
});

