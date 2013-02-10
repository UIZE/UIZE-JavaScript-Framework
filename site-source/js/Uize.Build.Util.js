/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.Util Package
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
		The =Uize.Build.Util= package provides various utility methods to facilitate building of pages for a Web site project.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Build.Util',
	required:[
		'Uize.Url',
		'Uize.Template',
		'Uize.Data.Simple',
		'Uize.String',
		'Uize.String.Lines',
		'Uize.Json',
		'Uize.Array.Sort',
		'Uize.Services.FileSystem'
	],
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var _undefined;

		/*** General Variables ***/
			var
				_fileSystem = Uize.Services.FileSystem.singleton (),
				_compiledJstFilesByPath = {},
				_package
			;

		return _package = {
			/*** Public Static Properties ***/
				jsModuleExtensionRegExp:/(\.js|\.js\.jst)$/,

			/*** Public Static Methods ***/
				forEachNumberedProperty:function (_object,_propertyNamePrefix,_handler) {
					var
						_propertyNo = -1,
						_propertyName,
						_propertyValue
					;
					while ((_propertyValue = _object [_propertyName = _propertyNamePrefix + ++_propertyNo]) != undefined)
						_handler (_propertyValue,_propertyName)
					;
				},

				getPathToRoot:function (_path) {
					return Uize.String.repeat ('../',_path.length - _path.replace (/[\/\\]/g,'').length);
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
						title:_titleExtractor (_fileText.match (/<title>(.*?)<\/title>/) [1]),
						keywords:_keywordsMatch ? _keywordsMatch [1] : '',
						description:_descriptionMatch ? _descriptionMatch [1] : '',
						imageSrc:_imageSrcMatch ? Uize.Url.toAbsolute (_folderToIndex,_imageSrcMatch [1]) : ''
					};
				},

				getHtmlFilesInfo:function (_folderToIndex,_titleExtractor) {
					if (!_titleExtractor) _titleExtractor = Uize.returnX;
					return Uize.Array.Sort.sortBy (
						Uize.map (
							_fileSystem.getFiles ({
								path:_folderToIndex,
								pathMatcher:function (_path) {
									var _urlParts = Uize.Url.from (_path);
									return _urlParts.fileType == 'html' && !Uize.String.startsWith (_urlParts.file,'~');
								}
							}),
							function (_path) {
								return _package.getHtmlFileInfo (
									_folderToIndex + '/' + Uize.Url.from (_path).file,
									_titleExtractor
								);
							}
						),
						'value.title.toLowerCase ()'
					);
				},

				getTestModuleName:function (_moduleName) {
					return _moduleName.match (/([^\.]*)(\.|$)/) [1] + '.Test.' + _moduleName;
				},

				readSimpleDataFile:function (_simpleDataFilePath) {
					return Uize.Data.Simple.parse ({
						simple:_fileSystem.readFile ({path:_simpleDataFilePath}),
						collapseChildren:true
					});
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
				},

				processJstFile:function (_jstTemplatePath,_input) {
					var _template = _package.compileJstFile (_jstTemplatePath);
					_template &&
						_fileSystem.writeFile ({path:_jstTemplatePath.replace (/\.jst$/,''),contents:_template (_input)})
					;
				},

				exec:function (_commands) {
					var _error;
					if (!Uize.isArray (_commands)) _commands = [_commands];
					for (
						var
							_commandNo = -1,
							_commandsLength = _commands.length,
							_wshShell = new ActiveXObject ('WScript.Shell'),
							_errorCode
						;
						++_commandNo < _commandsLength && !_error;
					)
						if (_errorCode = _wshShell.Run (_commands [_commandNo],0,true))
							_error = {
								script:_commands [_commandNo],
								errorCode:_errorCode
							}
					;
					return _error;
				},

				runScripts:function (_scripts) {
					return _package.exec (
						Uize.map (Uize.isArray (_scripts) ? _scripts : [_scripts],'\'WScript \' + value')
					);
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
											_silent || alert (_test.getSynopsis ());
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
						? Uize.require (_unitTestsClass,_runUnitTests)
						: _runUnitTests (_unitTestsClass)
					;
				},

				dataAsModule:function (_moduleName,_moduleData) {
					return [
						'Uize.module ({',
						'	name:\'' + _moduleName + '\',',
						'	superclass:\'\',',
						'	builder:function () {',
						'		return function () {',
						'			return ' + Uize.String.Lines.indent (Uize.Json.to (_moduleData),3,'\t',false) + ';',
						'		};',
						'	}',
						'});'
					].join ('\n');
				},

				writeDataModule:function (_moduleFolderPath,_moduleName,_moduleData) {
					_fileSystem.writeFile ({
						path:_moduleFolderPath + '/' + _moduleName + '.js',
						contents:_package.dataAsModule (_moduleName,_moduleData)
					});
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
											_buildDuration = Uize.now () - _timeBeforeBuild;
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
		};
	}
});

