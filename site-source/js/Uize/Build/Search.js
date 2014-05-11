/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.Search Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2014 UIZE
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

		USAGE
		...............................................................................................................
		node build.js Uize.Build.Search preset=[presetName] rootFolderPath=[rootFolderPath] contextLines=[contextLines]
		...............................................................................................................
*/

Uize.module ({
	name:'Uize.Build.Search',
	required:[
		'Uize.Build.Util',
		'Uize.Str.Lines',
		'Uize.Str.Repeat',
		'Uize.Str.Search',
		'Uize.Services.FileSystem'
	],
	builder:function () {
		'use strict';

		var _repeat = Uize.Str.Repeat.repeat;

		/*** Utility Functions ***/
			function _resolveMatcher (_matcher) {
				if (Uize.isArray (_matcher)) {
					var
						_subMatchers = Uize.map (_matcher,_resolveMatcher),
						_subMatchersLength = _subMatchers.length
					;
					return function (_value) {
						for (var _subMatcherNo = -1; ++_subMatcherNo < _subMatchersLength;) {
							if (!_subMatchers [_subMatcherNo] (_value))
								return false
							;
						}
						return true;
					}
				} else {
					return Uize.resolveMatcher (_matcher);
				}
			}

		return Uize.package ({
			perform:function (_params) {
				var
					_preset = _params.preset,
					_searchParams = ((_params.moduleConfigs || {}) ['Uize.Build.Search']).presets [_preset],
					_matcher = _searchParams.matcher,
					_pathMatcher = _resolveMatcher (_searchParams.pathMatcher),
					_pathFilter = _resolveMatcher (_searchParams.pathFilter || Uize.returnFalse),
					_contextLines = Uize.toNumber (_params.contextLines,5),
					_outputChunks = [],
					_currentFolderPath,
					_fileSystem = Uize.Services.FileSystem.singleton (),
					_totalFilesWithMatches = 0,
					_totalMatches = 0
				;
				Uize.Build.Util.buildFiles ({
					targetFolderPathCreator:function (_folderPath) {
						return _currentFolderPath = _folderPath;
					},
					targetFilenameCreator:function (_sourceFileName) {
						var _sourceFilePath = _currentFolderPath + '/' + _sourceFileName;
						return _pathMatcher (_sourceFilePath) && !_pathFilter (_sourceFilePath) ? _sourceFileName : null;
					},
					fileBuilder:function (_sourceFileName,_sourceFileText) {
						var
							_matches = Uize.Str.Search.search (_sourceFileText,_matcher),
							_matchesLength = _matches.length
						;
						if (_matchesLength) {
							_totalFilesWithMatches++;
							_totalMatches += _matchesLength;
							var
								_sourceFileLines = Uize.Str.Lines.split (_sourceFileText),
								_sourceFileLinesDeTabbed = []
							;
							_outputChunks.push (
								_currentFolderPath + '/' + _sourceFileName + '\n' +
								Uize.Str.Lines.indent (
									'MATCHES IN THIS FILE: ' + _matches.length + '\n' +
									'\n' +
									Uize.map (
										_matches,
										function (_match) {
											var
												_matchStart = _match.start,
												_matchEnd = _match.end,
												_matchStartLine = _matchStart.line,
												_matchEndLine = _matchEnd.line,
												_startLine = Math.max (_matchStartLine - _contextLines,0),
												_endLine = Math.min (_matchEndLine + _contextLines,_sourceFileLines.length - 1),
												_matchStartChar = Math.max (_matchStart.char,0),
												_matchEndChar = Math.max (_matchEnd.char,0)
											;
											for (var _lineNo = _startLine - 1; ++_lineNo < _endLine + 1;) {
												if (!_sourceFileLinesDeTabbed [_lineNo]) {
													_sourceFileLinesDeTabbed [_lineNo] = 1;
													_sourceFileLines [_lineNo] = _sourceFileLines [_lineNo].replace (/\t/g,'    ');
												}
											}
											var
												_lines = _sourceFileLines.slice (_startLine,_endLine + 1),
												_maxMatchedLineLength = Uize.max (
													Uize.map (
														_sourceFileLines.slice (_matchStartLine,_matchEndLine + 1),
														'value.length'
													)
												),
												_maxShownLineLength = Uize.max (Uize.map (_lines,'value.length')),
												_endLineDisplayLength = (_endLine + '').length,
												_separator =
													_repeat (' ',_endLineDisplayLength + 2) + '+' +
													_repeat ('-',_matchStartChar) +
													_repeat ('#',_matchEndChar - _matchStartChar + 1) +
													_repeat ('-',_maxShownLineLength - (_matchStartChar + _matchEndChar - _matchStartChar + 1)) +
													'\n'
											;
											return (
												'LINE ' + _matchStartLine + ' (CHAR ' + _matchStart.char + ') -> LINE ' + _matchEndLine + ' (CHAR ' + _matchEnd.char + ')\n' +
												'\n' +
												_separator +
												Uize.map (
													_lines,
													function (_line,_lineNo) {
														var _displayLineNo = _lineNo + _startLine + '';
														return (
															_repeat (' ',_endLineDisplayLength - _displayLineNo.length) +
															_displayLineNo + ' ' +
															(
																Uize.inRange (
																	_lineNo,
																	_matchStartLine - _startLine,
																	_matchEndLine - _startLine
																)
																	? '>'
																	: ' '
															) + '|' +
															_line
														);
													}
												).join ('\n') + '\n' +
												_separator
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
				_outputChunks.unshift (
					'SUMMARY: ' + _totalMatches + ' matches in ' + _totalFilesWithMatches + ' files',
					''
				);
				var _output = _outputChunks.join ('\n');
				_fileSystem.writeFile ({path:'logs/search-' + _preset + '.log',contents:_output});
				console.log (_output);
			}
		});
	}
});

