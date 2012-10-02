/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.AutoScruncher Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 8
	codeCompleteness: 100
	testCompleteness: 0
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Build.AutoScruncher= package provides a method to recurse a folder structure and scrunch (minify / compress) and obfuscate JavaScript source.

		*DEVELOPERS:* `Chris van Rensburg`

		The =Uize.Build.AutoScruncher= module is designed specifically to run in the context of Windows Script Host.
*/

Uize.module ({
	name:'Uize.Build.AutoScruncher',
	required:[
		'Uize.Wsh',
		'Uize.Build.Util',
		'Uize.Build.Scruncher',
		'Uize.Date',
		'Uize.String',
		'Uize.String.Lines',
		'Uize.Util.Oop'
	],
	builder:function () {
		/*** Variables for Scruncher Optimization ***/
			var _package = function () {};

		/*** Public Static Methods ***/
			_package.getScrunchedFolderPath = function (_folderPath,_buildFolderPath,_sourceFolderName) {
				var _sourceFolderNameLength = _sourceFolderName ? _sourceFolderName.length : 0;
				return (
					_sourceFolderNameLength
						? (
							_folderPath.slice (-_sourceFolderNameLength) == _sourceFolderName
								? _folderPath.slice (0,-_sourceFolderNameLength - 1)
								: null
						)
						: Uize.Build.Util.resolveBuiltFolderPath (_folderPath,_buildFolderPath)
				);
			};

			_package.perform = function (_params) {
				var
					_buildDate = Uize.Date.toIso8601 (),
					_endsWidthDotJsRegExp = /\.js$/,
					_buildScriptName = WScript.ScriptName,
					_scrunchedHeadComments = _params.scrunchedHeadComments || {},
					_scruncherPrefixChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
					_currentFolderPath,
					_fullModuleFolderPath = Uize.Wsh.getScriptFolderPath () + '\\' + _params.moduleFolderPath
				;
				function _targetFolderPathCreator (_folderPath) {
					return _package.getScrunchedFolderPath (
						_currentFolderPath = _folderPath,
						_params.buildFolderPath,
						_params.sourceFolderName
					);
				}

				/*** scrunch eligible JavaScript files ***/
					Uize.Wsh.buildFiles (
						Uize.copyInto (
							{
								logFileName:_buildScriptName.replace (_endsWidthDotJsRegExp,'-js-files.log'),
								targetFolderPathCreator:_targetFolderPathCreator,
								targetFilenameCreator:function (_sourceFileName) {
									return _endsWidthDotJsRegExp.test (_sourceFileName) ? _sourceFileName : null;
								},
								fileBuilder:function (_sourceFileName,_sourceFileText) {
									var
										_moduleName = _sourceFileName.replace (_endsWidthDotJsRegExp,''),
										_scruncherSettings = {},
										_headComment =
											_scrunchedHeadComments [_sourceFileName.slice (0,_sourceFileName.indexOf ('.'))],
										_keepHeadComment = _headComment == undefined
									;
									if (!_keepHeadComment)
										_scruncherSettings.KEEPHEADCOMMENT = 'FALSE'
									;
									if (_currentFolderPath == _fullModuleFolderPath)
										Uize.require (
											_moduleName,
											function (_module) {
												var _inheritanceDepth = Uize.Util.Oop.getInheritanceChain (_module).length;
												_scruncherSettings.MAPPINGS =
													'=' +
													(_inheritanceDepth ? _scruncherPrefixChars.charAt (_inheritanceDepth - 1) : '') +
													',' + _moduleName.replace (/\./g,'_')
												;
											}
										)
									;
									var _scruncherResult = Uize.Build.Scruncher.scrunch (_sourceFileText,_scruncherSettings);
									return {
										outputText:
											(
												_keepHeadComment
													? ''
													: Uize.substituteInto (
														_headComment,
														{buildDate:_buildDate,moduleName:_moduleName},
														'{KEY}'
													)
											) + _scruncherResult.scrunchedCode,
										logDetails:Uize.String.Lines.indent (_scruncherResult.report,2) + '\n'
									};
								}
							},
							_params
						)
					);

				/*** build .library.js files ***/
					var
						_contentsCommentRegExp = /\/\*\s*Library\s*Contents/i,
						_lineStartsWithIdentifierCharRegExp = /^[a-zA-Z_$]/,
						_scrunchedModuleFolderPath = _targetFolderPathCreator (_fullModuleFolderPath),
						_libraryUsesUizeModulesHeader =
							'/*______________\n' +
							'|       ______  |   B U I L T     O N     U I Z E     F R A M E W O R K\n' +
							'|     /      /  |   ---------------------------------------------------\n' +
							'|    /    O /   |   This JavaScript application is developed using the object\n' +
							'|   /    / /    |   oriented UIZE JavaScript framework as its foundation.\n' +
							'|  /    / /  /| |\n' +
							'| /____/ /__/_| |    ONLINE : http://www.uize.com\n' +
							'|          /___ |   LICENSE : Available under MIT License or GNU General Public License\n' +
							'|_______________|             http://www.uize.com/license.html\n' +
							'*/\n\n'
					;
					Uize.Wsh.buildFiles (
						Uize.copyInto (
							{
								targetFolderPathCreator:_targetFolderPathCreator,
								targetFilenameCreator:function (_sourceFileName) {
									return /\.library.js$/.test (_sourceFileName) ? _sourceFileName : null;
								},
								fileBuilder:function (_sourceFileName,_sourceFileText) {
									function _stripModuleHeaderComment (_moduleText) {
										var _moduleHeaderCommentPos = _moduleText.indexOf ('/*');
										return (
											_moduleHeaderCommentPos > -1
												? (
													_moduleText.slice (0,_moduleHeaderCommentPos) +
													_moduleText.slice (_moduleText.indexOf ('*/',_moduleHeaderCommentPos + 2) + 2)
												)
												: _moduleText
										);
									}
									var
										_libraryContentsChunks = [],
										_libraryUsesUizeModules
									;
									for (
										var
											_moduleNo = -1,
											_contentsCommentStartPos = _sourceFileText.search (_contentsCommentRegExp),
											_contentsCommentEndPos = _sourceFileText.indexOf ('*/',_contentsCommentStartPos),
											_modules = Uize.String.Lines.split (
												_contentsCommentStartPos > -1
													?
														_sourceFileText.slice (_contentsCommentStartPos,_contentsCommentEndPos)
															.replace (_contentsCommentRegExp,'')
													: _sourceFileText
											),
											_modulesLength = _modules.length
										;
										++_moduleNo < _modulesLength;
									) {
										var _moduleName = Uize.String.trim (_modules [_moduleNo]);
										if (_moduleName && _lineStartsWithIdentifierCharRegExp.test (_moduleName)) {
											if (!_libraryUsesUizeModules)
												_libraryUsesUizeModules = Uize.String.startsWith (_moduleName,'Uize')
											;
											_libraryContentsChunks.push (
												'\n' +
												_stripModuleHeaderComment (
													Uize.Wsh.readFile (
														_scrunchedModuleFolderPath + '\\' + _moduleName +
														(_endsWidthDotJsRegExp.test (_moduleName) ? '' : '.js')
													)
												)
											);
										}
									}
									return {
										outputText:
											(_libraryUsesUizeModules ? _libraryUsesUizeModulesHeader : '') +
											_sourceFileText.slice (0,_contentsCommentStartPos) +
											_libraryContentsChunks.join ('\n') +
											_sourceFileText.slice (_contentsCommentEndPos + 2)
									};
								}
							},
							_params,
							{
								alwaysBuild:true,
								logFileName:_buildScriptName.replace (_endsWidthDotJsRegExp,'-libraries.log')
							}
						)
					);
				};

		return _package;
	}
});

