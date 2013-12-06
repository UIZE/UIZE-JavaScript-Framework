/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.Search Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 4
*/

/*?
	Introduction
		The =Uize.Build.Search= package lets you execute one of the regular expression based codebase searches configured for your project.
		
		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Build.Search',
	required:[
		'Uize.Build.Util',
		'Uize.Str.Lines',
		'Uize.Str.Repeat'
	],
	builder:function () {
		'use strict';

		/*** Utility Functions ***/
			function _getLineAndChar (_text,_charPos) {
				var
					_linesUpToChar = Uize.Str.Lines.split (_text.slice (0,_charPos + 1)),
					_lineNo = _linesUpToChar.length - 1
				;
				return [_lineNo,_linesUpToChar [_lineNo].length - 1];
			}

		return Uize.package ({
			perform:function (_params) {
				var
					_searchParams = ((_params.moduleConfigs || {}) ['Uize.Build.Search']).presets [_params.preset],
					_matcher = _searchParams.matcher,
					_contextLines = Uize.toNumber (_params.contextLines,5),
					_outputChunks = [],
					_currentFolderPath
				;
				_matcher = new RegExp (
					_matcher.source,
					'g' + (_matcher.ignoreCase ? 'i' : '') + (_matcher.multiline ? 'm' : '')
				);
				Uize.Build.Util.buildFiles ({
					targetFolderPathCreator:function (_folderPath) {
						return _currentFolderPath = _folderPath;
					},
					targetFilenameCreator:function (_sourceFileName) {
						return /\.js$/.test (_sourceFileName) ? _sourceFileName : null;
					},
					fileBuilder:function (_sourceFileName,_sourceFileText) {
						_matcher.lastIndex = 0;
						var
							_matches,
							_match
						;
						while (_match = _matcher.exec (_sourceFileText)) {
							var _startChar = _match.index;
							(_matches || (_matches = [])).push ({
								startChar:_startChar,
								endChar:_startChar + _match [0].length - 1
							});
						}
						if (_matches) {
							var _sourceFileLines = Uize.Str.Lines.split (
								Uize.Str.Lines.switchIndentType (_sourceFileText,'\t','    ')
							);
							_outputChunks.push (
								_currentFolderPath + '/' + _sourceFileName + '\n' +

								Uize.Str.Lines.indent (
									'TOTAL MATCHES: ' + _matches.length + '\n' +
									'\n' +
									Uize.map (
										_matches,
										function (_match) {
											var
												_startLineAndChar = _getLineAndChar (_sourceFileText,_match.startChar),
												_endLineAndChar = _getLineAndChar (_sourceFileText,_match.endChar),
												_matchStartLine = _startLineAndChar [0],
												_matchEndLine = _endLineAndChar [0],
												_startLine = Math.max (_matchStartLine - _contextLines,0),
												_endLine = Math.min (_matchEndLine + _contextLines,_sourceFileLines.length - 1),
												_lines = _sourceFileLines.slice (_startLine,_endLine + 1),
												_separator = Uize.Str.Repeat.repeat (
													'-',
													Uize.max (Uize.map (_lines,'value.length'))
												)
											;
											return (
												'LINE ' + _matchStartLine + ' (CHAR ' + _startLineAndChar [1] + ') -> LINE ' + _matchEndLine + ' (CHAR ' + _endLineAndChar [1] + ')\n' +
												'\n' +
												'  ' + _separator + '\n' +
												Uize.map (
													_lines,
													function (_line,_lineNo) {
														return (
															(
																Uize.inRange (
																	_lineNo,
																	_matchStartLine - _startLine,
																	_matchEndLine - _startLine
																)
																	? '#|'
																	: ' |'
															) + _line
														); 
													}
												).join ('\n') + '\n' +
												'  ' + _separator + '\n'
											);
										}
									).join ('\n'),
									1
								)
							);
						}
						return {};
					},
					dryRun:true,
					alwaysBuild:true,
					rootFolderPath:_params.rootFolderPath || _params.sourcePath,
					logFilePath:null
				});
				console.log (_outputChunks.join ('\n'));
			}
		});
	}
});

