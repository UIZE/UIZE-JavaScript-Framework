/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.Util Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 2
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Build.Util= package provides various utility methods to facilitate building of pages for a Web site project.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Build.Util',
	required:[
		'Uize.Url',
		'Uize.Template',
		'Uize.Data.Simple',
		'Uize.Str.Repeat',
		'Uize.Str.Has',
		'Uize.Str.Lines',
		'Uize.Json',
		'Uize.Array.Sort',
		'Uize.Services.FileSystem',
		'Uize.Util.ModuleNaming'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,
				_Uize_Util_ModuleNaming = Uize.Util.ModuleNaming,

			/*** General Variables ***/
				_fileSystem = Uize.Services.FileSystem.singleton (),
				_compiledJstFilesByPath = {},
				_package,
				_jsModuleExtensions = ['.js','.js.jst','.csst','.htmlt','.loc'],
				_jsModuleExtensionRegExp = new RegExp (
					'(' + Uize.map (_jsModuleExtensions,'Uize.escapeRegExpLiteral (value)').join ('|') + ')$'
				)
		;

		/*** Utility Functions ***/
			function _moduleNameFromModulePath (_modulePath,_removeExtension) {
				var _modulePathParts =
					(_removeExtension ? _modulePath.replace (_jsModuleExtensionRegExp,'') : _modulePath).split ('/')
				;
				_modulePathParts [0] = _modulePathParts [0].replace (/_/g,'.');
				return _modulePathParts.join ('.');
			}

		return _package = Uize.package ({
			/*** Public Static Properties ***/
				jsModuleExtensions:_jsModuleExtensions,
					/*?
						Static Properties
							Uize.Build.Util.jsModuleExtensions
								An array, containing a list of the file extensions for the source files from which JavaScript modules are built.

								This list includes the string elements...

								- ='.js'= - for regular JavaScript source files
								- ='.js.jst'= - for JavaScript template source files
								- ='.csst'= - for CSS template source files
								- ='.loc'= - for locale strings source files

								NOTES
								- see also the companion =Uize.Build.Util.jsModuleExtensionRegExp= static property
					*/

				jsModuleExtensionRegExp:_jsModuleExtensionRegExp,
					/*?
						Static Properties
							Uize.Build.Util.jsModuleExtensionRegExp
								A regular expression that is used in determining source files for JavaScript modules.

								This regular expression matches files with any of the file extensions contained in the =Uize.Build.Util.jsModuleExtensions= array.

								NOTES
								- see also the companion =Uize.Build.Util.jsModuleExtensions= static property
					*/

			/*** Public Static Methods ***/
				moduleNameFromModulePath:_moduleNameFromModulePath,
					/*?
						Static Methods
							Uize.Build.Util.moduleNameFromModulePath
								Returns a string, representing the module name of the module located at the specified path.

								SYNTAX
								.........................................................................
								moduleNameSTR = Uize.Build.Util.moduleNameFromModulePath (modulePathSTR);
								.........................................................................

								This method removes the file extension and replaces slashes and underscores with periods to address the way that module paths are constructed for folder organizated modules.

								EXAMPLE
								.............................................................................
								Uize.Build.Util.moduleNameFromModulePath ('Uize/Widgets/Button/Html.js.jst');
								.............................................................................

								In the above example, the value ='Uize.Widgets.Button.Html'= would be returned.
					*/

				getPathToRoot:function (_path) {
					return Uize.Str.Repeat.repeat ('../',_path.length - _path.replace (/[\/\\]/g,'').length);
					/*?
						Static Methods
							Uize.Build.Util.getPathToRoot
								Returns a string, containing zero or more "../" (back folder) path segments, representing a relative path from the specified relative path back to the root.

								SYNTAX
								................................................................
								pathToRootSTR = Uize.Build.Util.getPathToRoot (relativePathSTR);
								................................................................

								This method is used by build scripts that build pages for nested sections of a site that may have links that are root-absolute and need to be converted to paths that are relative to the document being built. The implementation is very basic (ie. non-robust) and simply counts all the slashes in the specified path and builds a prefix with that many "../" (back folder) segments.

								EXAMPLES
								...............................................................................
								Uize.Build.Util.getPathToRoot ('foo.html');              // returns ''
								Uize.Build.Util.getPathToRoot ('foo/bar.html');          // returns '../'
								Uize.Build.Util.getPathToRoot ('foo/bar/baz.html');      // returns '../../'
								Uize.Build.Util.getPathToRoot ('foo/bar/baz/qux.html');  // returns '../../../'
								...............................................................................

					*/
				},

				getTitleFromFilename:function (_filename) {
					return (
						_filename
							.match (/(.*)\.[^\.]*$/) [1]  // lost the extension
							.replace (/-/g,' ')  // dashes become spaces
							.replace (/(^|\s)[a-z]/g,function (_match) {return _match.toUpperCase ()})  // capitalize words
					);
					/*?
						Static Methods
							Uize.Build.Util.getTitleFromFilename
								Returns a string, being a title that is generated from the specified filename.

								SYNTAX
								..............................................................
								titleSTR = Uize.Build.Util.getTitleFromFilename (filenameSTR);
								..............................................................

								This method is used by build scripts that build HTML pages from a source format, where a title is needed for the HTML page but no pretty title is provided in the source file (such as in metadata, if the source format supports this). In such cases, a title can be derived from the filename using this method.

								The method performs the following transformation on the specified filename...

								- removes the file extension
								- converts hyphens / dashes to spaces
								- capitalizes all the words

								EXAMPLE
								.................................................................................
								Uize.Build.Util.getTitleFromFilename ('javascript-animation-and-effects.simple');
								.................................................................................

								In the above example, the value ='Javascript Animation And Effects'= would be returned.
					*/
				},

				getHtmlFileInfo:function (_filePath,_titleExtractor) {
					var
						_fileText = _fileSystem.readFile ({path:_filePath}),
						_keywordsMatch = _fileText.match (/<meta name="keywords" content="(.*?)"\/>/),
						_descriptionMatch = _fileText.match (/<meta name="description" content="(.*?)"\/>/),
						_imageSrcMatch = _fileText.match (/<link rel="image_src" href="(.*?)"\/>/)
					;
					return {
						path:_filePath,
						title:(_titleExtractor || Uize.returnX) (_fileText.match (/<title>(.*?)<\/title>/) [1]),
						keywords:_keywordsMatch ? _keywordsMatch [1] : '',
						description:_descriptionMatch ? _descriptionMatch [1] : '',
						imageSrc:_imageSrcMatch ? _imageSrcMatch [1] : ''
					};
					/*?
						Static Methods
							Uize.Build.Util.getHtmlFileInfo
								Returns an object, providing information about the specified HTML file.

								SYNTAX
								...................................................................................
								htmlFileInfoOBJ = Uize.Build.Util.getHtmlFileInfo (filePathSTR,titleExtractorFUNC);
								...................................................................................

								This method returns an object containing the following properties...

								- =path= - the value specified for the =filePathSTR= parameter (echoed as a convenience)
								- =title= - the value of the =title= tag of the document, modified by the function specified by the =titleExtractorFUNC= parameter
								- =keywords= - the value of the =keywords= meta tag of the document (an empty string if the tag is not present)
								- =description= - the value of the =description= meta tag of the document (an empty string if the tag is not present)
								- =imageSrc= - the value of the =image_src= link tag of the document (an empty string if the tag is not present)

								NOTES
								- see also the related =Uize.Build.Util.getHtmlFilesInfo= static method
					*/
				},

				getHtmlFilesInfo:function (_folderToIndex,_titleExtractor) {
					return Uize.Array.Sort.sortBy (
						Uize.map (
							_fileSystem.getFiles ({
								path:_folderToIndex,
								pathMatcher:function (_path) {
									var _urlParts = Uize.Url.from (_path);
									return _urlParts.fileType == 'html' && !Uize.Str.Has.hasPrefix (_urlParts.file,'~');
								}
							}),
							function (_path) {
								var _htmlFileInfo = _package.getHtmlFileInfo (
									_folderToIndex + '/' + Uize.Url.from (_path).file,
									_titleExtractor
								);
								if (_htmlFileInfo.imageSrc)
									_htmlFileInfo.imageSrc = Uize.Url.toAbsolute (_folderToIndex,_htmlFileInfo.imageSrc)
								;
								return _htmlFileInfo;
							}
						),
						'value.title.toLowerCase ()'
					);
					/*?
						Static Methods
							Uize.Build.Util.getHtmlFilesInfo
								Returns an array of objects, representing the file info for all the HTML files in the specified folder.

								SYNTAX
								................................................................................................
								htmlFilesInfoARRAY = Uize.Build.Util.getHtmlFilesInfo (folderToIndexPathSTR,titleExtractorFUNC);
								................................................................................................

								The returned array is sorted by the titles of the files, as represented by the =title= property of the file info objects and lowercased so that the sort is case-insensitive. This method uses the related =Uize.Build.Util.getHtmlFileInfo= method in its implementation to generate the info object for each file, so you can refer to the documentation for that method for more info on the contents of the file info objects.

								Files are only considered to be HTML files if their filenames have a =.html= file extension. Files whose filenames begin with a "~" (tilde) character are excluded from the list, as this prefix is used to indicate files that are not yet ready for prime time and that should be ignored by certain build processes.

								NOTES
								- see also the related =Uize.Build.Util.getHtmlFileInfo= static method
					*/
				},

				getTestModuleName:_Uize_Util_ModuleNaming.getTestModuleName,
					/*?
						Static Methods
							Uize.Build.Util.getTestModuleName
								This method has been deprecated *(DEPRECATED 2014-02-02)* in favor of the newer =Uize.Util.ModuleNaming.getTestModuleName= method of the =Uize.Util.ModuleNaming= module.
					*/

				getJsModules:function (_params) {
					var
						_modulesPath = _params.sourcePath + '/' + _params.modulesFolder,
						_trueFlag = {},
						_modulesLookup = {},
						_moduleName,
						_modules = _fileSystem.getFiles ({
							path:_modulesPath,
							recursive:true,
							pathMatcher:_jsModuleExtensionRegExp,
							pathTransformer:function (_filePath) {
								_modulesLookup [_moduleName = _moduleNameFromModulePath (_filePath,true)] = _trueFlag;
								return _moduleName;
							}
						})
					;
					_fileSystem.getFolders ({
						path:_modulesPath,
						recursive:true,
						pathTransformer:function (_filePath) {
							if (_modulesLookup [_moduleName = _moduleNameFromModulePath (_filePath)] != _trueFlag)
								_modules.push (_moduleName)
							;
						}
					});
					return _modules.sort ();
					/*?
						Static Methods
							Uize.Build.Util.getJsModules
								Returns an array, containing the names of all the UIZE modules.

								SYNTAX
								..........................................................
								jsModulesARRAY = Uize.Build.Util.getJsModules (paramsOBJ);
								..........................................................

								The array of module names returned by this method will include modules that are built from various non-JavaScript source files (such as CSS template files with the =.csst= file extension). For a comprehensive list of such source file types, consult the reference for the =Uize.Build.Util.jsModuleExtensions= static property.

								Params
									The =paramsOBJ= object should have the following properties...

									- =sourcePath= - a string, specifying the path where the source files of the project are located
									- =modulesFolder= - a string, specifying the name of the folder containing the modules for the project (relative to the source path)

									These two properties of the params object correspond to the same named properties of the UIZE config. Therefore, if your code has a reference to the UIZE config object, you can pass it as the =paramsOBJ= parameter to this method.
					*/
				},

				getJsModuleTodos:function (_params) {
					var _todoExtensionRegExp = /\.todo$/;

					return _fileSystem.getFiles ({
						path:_params.sourcePath + '/' + _params.modulesFolder,
						recursive:true,
						pathMatcher:_todoExtensionRegExp,
						pathTransformer:function (_path) {
							return _moduleNameFromModulePath (_path.replace (_todoExtensionRegExp,''));
						}
					});
					/*?
						Static Methods
							Uize.Build.Util.getJsModuleTodos
								Returns a string array, containing the module names of all the TODO files (files with a =.todo= file extension) under the modules folder of the project.

								SYNTAX
								..................................................................
								jsModuleTodosARRAY = Uize.Build.Util.getJsModuleTodos (paramsOBJ);
								..................................................................
					*/
				},

				getModuleNamespace:_Uize_Util_ModuleNaming.getNamespace,
					/*?
						Static Methods
							Uize.Build.Util.getModuleNamespace
								This method has been deprecated *(DEPRECATED 2014-02-02)* in favor of the newer =Uize.Util.ModuleNaming.getNamespace= method of the =Uize.Util.ModuleNaming= module.
					*/

				readSimpleDataFile:function (_simpleDataFilePath) {
					return Uize.Data.Simple.parse ({
						simple:_fileSystem.readFile ({path:_simpleDataFilePath}),
						collapseChildren:true
					});
					/*?
						Static Methods
							Uize.Build.Util.readSimpleDataFile
								Returns an object that is parsed from the specified simple data file, with the children collapsed using the =collapseChildren= option of the SimpleData parser.

								SYNTAX
								...........................................................................
								simpleDataOBJ = Uize.Build.Util.readSimpleDataFile (simpleDataFilePathSTR);
								...........................................................................
					*/
				},

				compileJstFile:function (_jstTemplatePath) {
					var _template = _compiledJstFilesByPath [_jstTemplatePath];
					if (!_template) {
						if (!_fileSystem.fileExists ({path:_jstTemplatePath})) return;
						_template = _compiledJstFilesByPath [_jstTemplatePath] = Uize.Template.compile (
							_fileSystem.readFile ({path:_jstTemplatePath}),
							{result:'full'}
						);
						Uize.require (_template.required);
					}
					return _template.templateFunction;
					/*?
						Static Methods
							Uize.Build.Util.compileJstFile
								Returns a template function, compiled from the specified JST (=.jst=) template file.

								SYNTAX
								...................................................................
								templateFUNC = Uize.Build.Util.compileJstFile (jstTemplatePathSTR);
								...................................................................

								This method caches the compiled template function so that, if multiple requests are made to compile the same template file, the file is only read and the template compiled once. Any modules that are required by the template, using the =@required= template directive, are required so that the template function returned by this method is safe to call. If the specified JST template file does not exist, then the method returns the value =undefined=.
					*/
				},

				processJstFile:function (_jstTemplatePath,_input) {
					var _template = _package.compileJstFile (_jstTemplatePath);
					_template &&
						_fileSystem.writeFile ({path:_jstTemplatePath.replace (/\.jst$/,''),contents:_template (_input)})
					;
					/*?
						Static Methods
							Uize.Build.Util.processJstFile
								Compiles the specified JST template file, uses the compiled template function to process the specified input, and writes the result as a new file.

								SYNTAX
								.....................................................................
								Uize.Build.Util.processJstFile (jstTemplatePathSTR,templateInputOBJ);
								.....................................................................

								This method writes the result as a file alongside the JST template file, where the name of the written file is the same as the template file but with the =.jst= suffix stripped off. So, for example, if the JST template file being processed were named *"homepage.html.jst"*, then the written file would be named *"homepage.html"*.

								NOTES
								- see also the related =Uize.Build.Util.compileJstFile= static method
					*/
				},

				runUnitTests:function (_unitTestsClass,_silent,_logFilePath) {
					function _runUnitTests (_unitTestsClass) {
						var
							_unitTests = new _unitTestsClass,
							_logChunks = []
						;
						_unitTests.wire ({
							Start:
								function (_event) {
									_logChunks.push (
										Uize.Str.Repeat.repeat ('\t',_event.source.getDepth ()) + _event.source.get ('title')
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
											Uize.Str.Repeat.repeat ('\t',_test.getDepth () + 1) +
											(
												_test.get ('result')
													? ('PASSED!!! (duration: ' + _test.get ('duration') + 'ms)')
													: ('*** FAILED *** ' + (_reasonForFailure || ''))
											)
										);
										_reasonForFailure && _logChunks.push ('','',_test.getSynopsis ());

									/*** finish up if the test fails or if unit tests complete ***/
										if (_test == _unitTests || !_test.get ('result')) {
											_silent || console.log (_test.getSynopsis ());
											_logFilePath &&
												_fileSystem.writeFile ({path:_logFilePath,contents:_logChunks.join ('\n')})
											;
											_test.get ('result') || WScript.Quit (1);
										}
								}
						});
						_unitTests.run ();
					}
					typeof _unitTestsClass == 'string'
						? Uize.require (Uize.Util.ModuleNaming.getTestModuleName (_unitTestsClass),_runUnitTests)
						: _runUnitTests (_unitTestsClass)
					;
					/*?
						Static Methods
							Uize.Build.Util.runUnitTests
								Runs the specified unit tests class, optionally outputting the results to a specified log file.

								SYNTAX
								..................................................................................
								Uize.Build.Util.runUnitTests (unitTestsClassSTRorCLASS,silentBOOL,logFilePathSTR);
								..................................................................................

								Parameters
									This method supports the following parameters...

									- =unitTestsClassSTRorCLASS= - either a string, specifying the name of a unit tests module, or a reference to a unit tests module
									- =silentBOOL= - a boolean, specifing whether or not the test runner should be silent (unless the value =true= is specified, the test runner will output a synopsis to the console)
									- =logFilePathSTR= - a string, optionally specifying the path for where a log file should be written (if not specified, no log file will be written)
					*/
				},

				moduleAsText:function (_moduleDefinition) {
					_moduleDefinition = Uize.copy (_moduleDefinition);
					var
						_builder = _moduleDefinition.builder,
						_builderPlaceholder = typeof _builder == 'string' ? '[BUILDER_PLACEHOLDER_' + Uize.now () + ']' : ''
					;
					if (_builderPlaceholder)
						_moduleDefinition.builder = _builderPlaceholder
					;
					if (Uize.isEmpty (_moduleDefinition.required))
						delete _moduleDefinition.required
					;
					var _moduleText =
						'Uize.module (' +
							Uize.Json.to (
								Uize.keys (_moduleDefinition) == 'name' ? _moduleDefinition.name : _moduleDefinition
							) +
						');'
					;
					if (_builderPlaceholder) {
						var _builderPlaceholderPos = _moduleText.indexOf (_builderPlaceholder);
						_moduleText =
							_moduleText.slice (0,_builderPlaceholderPos - 1) +
							Uize.Str.Lines.indent (_builder,1,'\t',false) +
							_moduleText.slice (_builderPlaceholderPos + _builderPlaceholder.length + 1)
						;
					}
					return _moduleText;
					/*?
						Static Methods
							Uize.Build.Util.moduleAsText
								Returns a string, being the module specified by a module definition object serialized to its string form.

								SYNTAX
								...................................................................
								moduleTextSTR = Uize.Build.Util.moduleAsText (moduleDefinitionOBJ);
								...................................................................

								If a string value is specified for the =builder= property of the module definition (rather than a builder function, in other words), then this value will be substituted as is for the builder in the serialized module. This allows us to provide the exact code for a module's builder, complete with comments and formatting that you wish to preserve in the serialized text version of the module. This can be useful in some build processes that generate modules.
					*/
				},

				dataAsModule:function (_moduleName,_moduleData) {
					return _package.moduleAsText ({
						name:_moduleName,
						builder:[
							'function () {',
							'	return function () {',
							'		return ' + Uize.Str.Lines.indent (Uize.Json.to (_moduleData),2,'\t',false) + ';',
							'	};',
							'}'
						].join ('\n')
					});
					/*?
						Static Methods
							Uize.Build.Util.dataAsModule
								Returns a string, being the text for a data module wrapper for the specified data.

								SYNTAX
								...............................................................................
								moduleTextSTR = Uize.Build.Util.dataAsModule (moduleNameSTR,moduleDataANYTYPE);
								...............................................................................

								This method first serializes the data specified by the =moduleDataANYTYPE= parameter, after which it wraps this serialized data in the form of a data module and then returns the text serialization of this module. If this text were then to be written to a file under the modules folder of a project, then it could be required by the name specified in the =moduleNameSTR= parameter.

								NOTES
								- see also the related =Uize.Build.Util.moduleAsText= and =Uize.Build.Util.writeDataModule= static methods
					*/
				},

				writeDataModule:function (_modulesFolderPath,_moduleName,_moduleData) {
					_fileSystem.writeFile ({
						path:_modulesFolderPath + '/' + Uize.modulePathResolver (_moduleName) + '.js',
						contents:_package.dataAsModule (_moduleName,_moduleData)
					});
					/*?
						Static Methods
							Uize.Build.Util.writeDataModule
								Wraps the specified data in a data module wrapper of the specified module name and writes the module under the specified modules folder path.

								SYNTAX
								.......................................................................................
								Uize.Build.Util.writeDataModule (modulesFolderPathSTR,moduleNameSTR,moduleDataANYTYPE);
								.......................................................................................

								This method uses the =Uize.Build.Util.dataAsModule= static method to wrap the data specified by the =moduleDataANYTYPE= parameter as a data module of the name specified by the =moduleNameSTR= parameter and then writes the module under the modules folder path specified by the =modulesFolderPathSTR= parameter.

								NOTES
								- see also the related =Uize.Build.Util.dataAsModule= static method
					*/
				},

				buildFiles:function (_params) {
					var
						_alwaysBuild = _params.alwaysBuild,
						_dryRun = _params.dryRun,
						_doNotEnter = _params.doNotEnter,
						_logFilePath = _params.logFilePath,
						_logChunks = []
					;
					if (Uize.isArray (_doNotEnter))
						_doNotEnter = new RegExp ('^(' + _doNotEnter.join ('|') + ')$')
					;
					function _processFolder (_folderPath) {
						var _targetFolderPath = _doNotEnter && _doNotEnter.test (_folderPath)
							? false
							: _params.targetFolderPathCreator (_folderPath)
						;
						if (typeof _targetFolderPath == 'string') {
							Uize.forEach (
								_fileSystem.getFiles ({path:_folderPath}),
								function (_sourceFileName) {
									var
										_sourceFilePath = _folderPath + (_folderPath && '/') + _sourceFileName,
										_targetFileName = _params.targetFilenameCreator (_sourceFileName)
									;
									if (_targetFileName) {
										var
											_targetFilePath = _targetFolderPath + '/' + _targetFileName,
											_buildReason = _alwaysBuild
												? 'ALWAYS BUILD'
												: (
													_fileSystem.fileExists ({path:_targetFilePath})
														? (
															_fileSystem.getModifiedDate ({path:_sourceFilePath}) >
															_fileSystem.getModifiedDate ({path:_targetFilePath})
																? 'WAS OUT OF DATE'
																: ''
														)
														: 'DIDN\'T EXIST'
												)
											,
											_buildDuration,
											_logDetails = ''
										;
										if (_buildReason) {
											var
												_timeBeforeBuild = Uize.now (),
												_processingResult = _params.fileBuilder (
													_sourceFileName,
													_fileSystem.readFile ({path:_sourceFilePath})
												),
												_outputText = _processingResult.outputText
											;
											_logDetails = _processingResult.logDetails || '';
											!_dryRun && _outputText != _undefined &&
												_fileSystem.writeFile ({path:_targetFilePath,contents:_outputText})
											;
											_buildDuration = Uize.since (_timeBeforeBuild);
										}
										_logChunks.push (
											(_buildReason ? '***** ' : '') + _sourceFilePath + '\n' +
												'\tTARGET FILE: ' + _targetFilePath + '\n' +
												'\t' +
													(
														_buildReason
															? (
																'BUILT (' + _buildReason + '), BUILD DURATION: ' + _buildDuration + 'ms'
															)
															: 'no action, file is current'
													) + '\n' +
												_logDetails +
											'\n'
										);
									}
								}
							);
						}
						_targetFolderPath !== false &&
							Uize.forEach (
								_fileSystem.getFolders ({path:_folderPath}),
								function (_folderName) {_processFolder (_folderPath + (_folderPath && '/') + _folderName)}
							)
						;
					}
					_processFolder (_params.rootFolderPath);
					_logFilePath && _fileSystem.writeFile ({path:_logFilePath,contents:_logChunks.join ('')});
					/*?
						Static Methods
							Uize.Build.Util.buildFiles
								Facilitates iterating through a folder hierarchy, processing specific files, and writing the results of processing to a specified log file.

								SYNTAX
								....................................................................
								Uize.Build.Util.buildFiles ({
									targetFolderPathCreator:targetFolderPathCreatorFUNC,  // REQUIRED
									targetFilenameCreator:targetFilenameCreatorFUNC,      // REQUIRED
									fileBuilder:fileBuilderFUNC,                          // REQUIRED

									rootFolderPath:rootFolderPathSTR,                     // optional
									alwaysBuild:alwaysBuildBOOL,                          // optional
									doNotEnter:doNotEnterARRAYorREGEXP,                   // optional
									logFilePath:logFilePathSTR                            // optional
								});
								....................................................................

								This method starts iterating through files in the folder that contains the build script being executed and then recursively iterates through subfolders.

								targetFolderPathCreator
									A function reference, specifying a function that should be used to create a target folder path for the output of the files being built.

									The function specified by this parameter should expect to receive one string parameter, being the folder path of the files being built. The function should return a string, being the path of the target folder where the built versions of the files should be written.

									In a special case, if the function returns a boolean, then the files in the current folder being processed will not be built, and the boolean value will determine if the method recurses deeper into the current folder's subfolders. This provides a way to skip building the files in the current folder but recurse deeper, or to ignore a particular folder and all its contents - files *and* subfolders.

								targetFilenameCreator
									A function reference, specifying a function that should be used to create the target filenames for the output of the files being built.

									The function specified by this parameter should expect to receive one string parameter, being the filename of the file being built. The function should return a string, being the target filename for where the built version of the file should be written. If the source file is not to be built, based upon interrogating the source filename (perhaps it's not a type of file that should be built), then the function should return an empty string or the value =false=.

								fileBuilder
									A function reference, specifying a function that should be used for processing the source file to create output that should be written as the target file.

									The function specified by this parameter should expect to receive two string parameters, being the filename of the source file being built and the text contents of that file. The function should return an object containing the property =outputText=, being the output text for the built version of the file, and an optional =logDetails= property that can be used to specify any extra log information to summarize or describe how the file was built.

									When a file is built, the output of the function specified by the =fileBuilder= parameter will be written as a file of the name determined by the =targetFilenameCreator= function, into a folder of the path determined by the =targetFolderPathCreator= function.

								rootFolderPath
									A string, specifying the path of a folder to serve as the root folder from which to start building files.

								alwaysBuild
									An optional boolean, indicating whether or not eligible files should always be built, or whether the need to build should be determined automatically.

									For any file within the folder hierarchy that would be processed by the =Uize.Build.Util.buildFiles= method (given the configuration of this method by all its parameter values), a decision to build the file will normally be made automatically by this method, based upon the target file either not existing or having an older modified date than the source file. This is the behavior for the optional =alwaysBuild= parameter's default value of =false=. When the value =true= is specified, then the file will always be built, even if it is considered to have been previously built and up-to-date.

								doNotEnter
									An optional array or regular expression, specifying a folder (or folders) that should not be entered when recursing through the folder hierarchy.

									Any folders specified by this parameter will terminate recursion at that point in the folder tree, and any folders contained inside these dead end folders will not be processed. If a regular expression is specified for this parameter, then this regular expression will be tested against the folder name currently being processed by the =Uize.Build.Util.buildFiles= method. If the regular expression matches, then the method will not enter the folder.

									This parameter is useful for build scripts that should ignore files generated by the build script (or other build scripts) and that are stored in a special build directory. Your site project may also contain a folder of build scripts, and you may not wish any build script using the =Uize.Build.Util.buildFiles= method to process any of the files contained therein.

								logFilePath
									An optional string, specifying the filename of a file within the same folder as the build script that should be used for writing out the log of the build process.

									Basic information is automatically placed into the log file by the =Uize.Build.Util.buildFiles= method, but additional information for each built file can be added by returning text for the optional =logDetails= property of your =fileBuilder= function's return object.

									NOTES
									- If no =logFilePath= parameter is specified, or if it's value is an empty string, =null=, or =undefined=, then the filename for the log file will be derived from the filename of the build script, with the ".js" file extension replaced with the extension ".log".
					*/
				}
		});
	}
});

