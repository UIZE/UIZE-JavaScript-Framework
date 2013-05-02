/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.Wsh Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 7
	codeCompleteness: 80
	docCompleteness: 80
*/

/*?
	Introduction
		The =Uize.Build.Wsh= package is designed to run in the context of Windows Script Host and provides methods for recursing folder structures and building files.

		*DEVELOPERS:* `Chris van Rensburg`

		The =Uize.Build.Wsh= module is used by various build scripts, such as the auto scruncher. It will only be of interest to you if you're writing or modifying build scripts that only run in the Windows Script Host environment.
*/

Uize.module ({
	name:'Uize.Build.Wsh',
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_package = function () {},
				_undefined,
				_wshShell,
				_fileSystemObject
			;

		/*** Utility Functions ***/
			function _getFileSystemObject (_params) {
				return (
					(_params && _params.fileSystemObject) ||
					_fileSystemObject ||
					(_fileSystemObject = new ActiveXObject ('Scripting.FileSystemObject'))
				);
			}

			function _getWshShell () {
				return _wshShell || (_wshShell = new ActiveXObject ('WScript.Shell'));
			}

		/*** Public Static Methods ***/
			var _getScriptFolderPath = _package.getScriptFolderPath = function () {
				return WScript.ScriptFullName.slice (0,-WScript.ScriptName.length - 1);
				/*?
					Static Methods
						Uize.Build.Wsh.getScriptFolderPath
							Returns a string, representing the folder path for the folder from which the current script is being executed.

							SYNTAX
							............................................................
							scriptFolderPathSTR = Uize.Build.Wsh.getScriptFolderPath ();
							............................................................
				*/
			};

			var _readFile = _package.readFile = function (_params) {
				var
					_fileSystemObject = _getFileSystemObject (_params),
					_path = typeof _params == 'string' ? _params : _params.path
				;
				if (_fileSystemObject.GetFile (_path).Size) {
					var
						_file = _fileSystemObject.OpenTextFile (_path,1),
						_text = _file.ReadAll ()
					;
					_file.Close ();
					return _text;
				}
				return '';
				/*?
					Static Methods
						Uize.Build.Wsh.readFile
							Reads the file at the specified file path and returns its entire contents as a string.

							SYNTAX
							....................................................
							fileTextSTR = Uize.Build.Wsh.readFile ({
								path:filePathSTR,
								fileSystemObject:fileSystemObjectOBJ  // optional
							});
							....................................................

							VARIATION
							....................................................
							fileTextSTR = Uize.Build.Wsh.readFile (filePathSTR);
							....................................................

							When a =filePathSTR= parameter is specified in place of an object parameter, then the file will be read at the path specified by this string parameter, and a file system object will be created as needed.

							NOTES
							- the file path, specified in the =path= parameter, can be relative to the folder in which the build script is executing
							- the optional =fileSystemObject= parameter should specify an instance of =Scripting.FileSystemObject=
							- see also the =Uize.Build.Wsh.writeFile= static method
				*/
			};

			var _writeFile = _package.writeFile = function (_params) {
				var
					_path = _params.path,
					_fileSystemObject = _getFileSystemObject (_params)
				;

				/*** make sure path exists (if not, create it) ***/
					var _folderPath = _path.substr (0,_path.lastIndexOf ('\\'));
					if (!_fileSystemObject.FolderExists (_folderPath)) {
						var
							_pathSegments = _folderPath.split ('\\'),
							_currentPath = _pathSegments [0] // this should be a drive letter ... this code might break if it isn't
						;
						for (
							var _pathSegmentNo = 0, _pathSegmentsLength = _pathSegments.length;
							++_pathSegmentNo < _pathSegmentsLength;
						) {
							_currentPath += '\\' + _pathSegments [_pathSegmentNo];
							_fileSystemObject.FolderExists (_currentPath) || _fileSystemObject.CreateFolder (_currentPath);
						}
					}

				/*** write text to file and close ***/
					var _file = _fileSystemObject.CreateTextFile (_path);
					_file.Write (_params.text);
					_file.Close ();

				/*?
					Static Methods
						Uize.Build.Wsh.writeFile
							Writes the specified text string to the specified file path.

							SYNTAX
							....................................................
							Uize.Build.Wsh.writeFile ({
								path:filePathSTR,
								text:fileTextSTR,
								fileSystemObject:fileSystemObjectOBJ  // optional
							});
							....................................................

							If no file exists at the path specified in the =path= parameter, then the file path will be created. This includes creating any folders that may not exist, leading up to the actual file itself. If the file does already exist, it will be overwritten.

							NOTES
							- the file path, specified in the =path= parameter, can be relative to the folder in which the build script is executing
							- the optional =fileSystemObject= parameter should specify an instance of =Scripting.FileSystemObject=
							- see also the =Uize.Build.Wsh.readFile= static method
				*/
			};

			_package.buildFiles = function (_params) {
				var
					_alwaysBuild = _params.alwaysBuild,
					_dryRun = _params.dryRun,
					_fileSystemObject = _getFileSystemObject (_params),
					_buildScriptName = WScript.ScriptName,
					_buildScriptFullName = WScript.ScriptFullName,
					_doNotEnter = _params.doNotEnter,
					_logChunks = []
				;
				if (Uize.isArray (_doNotEnter))
					_doNotEnter = new RegExp ('\\\\(' + _doNotEnter.join ('|') + ')(\\W|$)')
				;
				function _getFileModifiedTime (_filePath) {
					return +new Date (_fileSystemObject.GetFile (_filePath).DateLastModified);
				}
				function _processFolder (_folderPath) {
					var
						_folder = _fileSystemObject.getFolder (_folderPath),
						_subfolders = new Enumerator (_folder.SubFolders),
						_targetFolderPath = _doNotEnter && _doNotEnter.test (_folderPath)
							? false
							: _params.targetFolderPathCreator (_folderPath)
					;
					if (typeof _targetFolderPath == 'string') {
						var _files = new Enumerator (_folder.files);
						while (!_files.atEnd ()) {
							var _sourceFilePath = _files.item ().Path;
							if (_sourceFilePath != _buildScriptFullName) {
								var
									_sourceFileName = _sourceFilePath.substr (_sourceFilePath.lastIndexOf ('\\') + 1),
									_targetFileName = _params.targetFilenameCreator (_sourceFileName)
								;
								if (_targetFileName) {
									var
										_targetFilePath = _targetFolderPath + '\\' + _targetFileName,
										_buildReason = _alwaysBuild
											? 'ALWAYS BUILD'
											: (
												_fileSystemObject.FileExists (_targetFilePath)
													? (
														_getFileModifiedTime (_sourceFilePath) > _getFileModifiedTime (_targetFilePath)
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
											_timeBeforeBuild = new Date,
											_processingResult = _params.fileBuilder (_sourceFileName,_readFile (_sourceFilePath)),
											_outputText = _processingResult.outputText
										;
										_logDetails = _processingResult.logDetails || '';
										!_dryRun && _outputText != _undefined &&
											_writeFile ({path:_targetFilePath,text:_outputText})
										;
										_buildDuration = new Date - _timeBeforeBuild;
									}
									_logChunks.push (
										(_buildReason ? '***** ' : '') + _sourceFilePath + '\n' +
											'\tTARGET FILE: ' + _targetFilePath + '\n' +
											'\t' +
												(
													_buildReason
														? ('BUILT (' + _buildReason + '), BUILD DURATION: ' + _buildDuration + 'ms')
														: 'no action, file is current'
												) + '\n' +
											_logDetails +
										'\n'
									);
								}
							}
							_files.moveNext ();
						}
					}
					if (_targetFolderPath !== false) {
						while (!_subfolders.atEnd ()) {
							_processFolder (_subfolders.item ().Path);
							_subfolders.moveNext ();
						}
					}
				}
				_processFolder (_params.rootFolderPath || _getScriptFolderPath ());
				_writeFile ({
					path:_params.logFilePath || _buildScriptName.replace (/\.js$/,'.log'),
					text:_logChunks.join ('')
				});
				/*?
					Static Methods
						Uize.Build.Wsh.buildFiles
							Facilitates iterating through a folder hierarchy, processing specific files, and writing the results of processing to a specified log file.

							SYNTAX
							....................................................................
							Uize.Build.Wsh.buildFiles ({
								targetFolderPathCreator:targetFolderPathCreatorFUNC,  // REQUIRED
								targetFilenameCreator:targetFilenameCreatorFUNC,      // REQUIRED
								fileBuilder:fileBuilderFUNC,                          // REQUIRED

								rootFolderPath:rootFolderPathSTR,                     // optional
								alwaysBuild:alwaysBuildBOOL,                          // optional
								doNotEnter:doNotEnterARRAYorREGEXP,                   // optional
								fileSystemObject:fileSystemObjectOBJ,                 // optional
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
								An optional string, specifying the path of a folder to serve as the root folder from which to start building files.

								NOTES
								- If no =rootFolderPath= parameter is specified, or if it's value is an empty string, =null=, or =undefined=, then the root folder will be the parent folder of the build script.

							alwaysBuild
								An optional boolean, indicating whether or not eligible files should always be built, or whether the need to build should be determined automatically.

								For any file within the folder hierarchy that would be processed by the =Uize.Build.Wsh.buildFiles= method (given the configuration of this method by all its parameter values), a decision to build the file will normally be made automatically by this method, based upon the target file either not existing or having an older modified date than the source file. This is the behavior for the optional =alwaysBuild= parameter's default value of =false=. When the value =true= is specified, then the file will always be built, even if it is considered to have been previously built and up-to-date.

							doNotEnter
								An optional array or regular expression, specifying a folder (or folders) that should not be entered when recursing through the folder hierarchy.

								Any folders specified by this parameter will terminate recursion at that point in the folder tree, and any folders contained inside these dead end folders will not be processed. If a regular expression is specified for this parameter, then this regular expression will be tested against the folder name currently being processed by the =Uize.Build.Wsh.buildFiles= method. If the regular expression matches, then the method will not enter the folder.

								This parameter is useful for build scripts that should ignore files generated by the build script (or other build scripts) and that are stored in a special build directory. Your site project may also contain a folder of build scripts, and you may not wish any build script using the =Uize.Build.Wsh.buildFiles= method to process any of the files contained therein.

							fileSystemObject
								An optional object reference, specifying an instance of the =Scripting.FileSystemObject= control that should be used in file I/O operations. An instance can be created with the statement =new ActiveXObject ('Scripting.FileSystemObject')=. When no =fileSystemObject= parameter is specified, then a file system object will be created as needed to serve the needs of the build process.

							logFilePath
								An optional string, specifying the filename of a file within the same folder as the build script that should be used for writing out the log of the build process.

								Basic information is automatically placed into the log file by the =Uize.Build.Wsh.buildFiles= method, but additional information for each built file can be added by returning text for the optional =logDetails= property of your =fileBuilder= function's return object.

								NOTES
								- If no =logFilePath= parameter is specified, or if it's value is an empty string, =null=, or =undefined=, then the filename for the log file will be derived from the filename of the build script, with the ".js" file extension replaced with the extension ".log".
				*/
			};

			_package.execute = function (_command) {
				_getWshShell ().Run (_command,0,true);
			};

		return _package;
	}
});

