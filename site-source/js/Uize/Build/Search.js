/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.Search Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2016 UIZE
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
		'Uize.Str.Search',
		'Uize.Str.SegmentHighlighter',
		'Uize.Services.FileSystem'
	],
	builder:function () {
		'use strict';

		return Uize.package ({
			perform:function (_params) {
				function _resolveMatcher (_matcher,_resolveArrayToAnd) {
					_resolveArrayToAnd = _resolveArrayToAnd == undefined || !!_resolveArrayToAnd;
					if (Uize.isArray (_matcher)) {
						var
							_subMatchers = Uize.map (_matcher,_resolveMatcher),
							_subMatchersLength = _subMatchers.length
						;
						return function (_value) {
							for (var _subMatcherNo = -1; ++_subMatcherNo < _subMatchersLength;) {
								if (_subMatchers [_subMatcherNo] (_value) != _resolveArrayToAnd)
									return !_resolveArrayToAnd
								;
							}
							return _resolveArrayToAnd;
						}
					} else {
						return Uize.resolveMatcher (_matcher);
					}
				}
				var
					_preset = _params.preset,
					_searchParams = ((_params.moduleConfigs || {}) ['Uize.Build.Search']).presets [_preset],
					_matcher = _searchParams.matcher,
					_pathMatcher = _resolveMatcher (_searchParams.pathMatcher,true),
					_pathFilter = _resolveMatcher (_searchParams.pathFilter || Uize.returnFalse,false),
					_logChunks = [],
					_currentFolderPath,
					_fileSystem = Uize.Services.FileSystem.singleton (),
					_totalFilesWithMatches = 0,
					_totalMatches = 0,
					_sourcePath = _params.rootFolderPath || _params.sourcePath,
					_segmentHighlighter = Uize.Str.SegmentHighlighter ({
						contextLines:Uize.toNumber (_params.contextLines,5)
					});
				;
				function _log (_logChunk) {
					_logChunks.push (_logChunk);
					console.log (_logChunk);
				}
				_fileSystem.getFiles ({
					path:_sourcePath,
					pathMatcher:function (_filePath) {return _pathMatcher (_filePath) && !_pathFilter (_filePath)},
					pathTransformer:function (_filePath) {
						var
							_sourceFilePath = _sourcePath + '/' + _filePath,
							_sourceFileText = _fileSystem.readFile ({path:_sourceFilePath}),
							_matches = Uize.Str.Search.search (_sourceFileText,_matcher),
							_matchesLength = _matches.length
						;
						if (_matchesLength) {
							_totalFilesWithMatches++;
							_totalMatches += _matchesLength;
							_segmentHighlighter.set ({string:_sourceFileText});
							_log (
								_sourceFilePath + '\n' +
								Uize.Str.Lines.indent (
									'MATCHES IN THIS FILE: ' + _matches.length + '\n' +
									'\n' +
									Uize.map (
										_matches,
										function (_match) {return _segmentHighlighter.getSegmentHighlight (_match)}
									).join ('\n'),
									1
								)
							);
						}
					},
					recursive:true
				});
				_log ('SUMMARY: ' + _totalMatches + ' matches in ' + _totalFilesWithMatches + ' files');
				_fileSystem.writeFile ({path:(_params.logsPath || 'logs') + '/search-' + _preset + '.log',contents:_logChunks.join ('\n')});
			}
		});
	}
});

