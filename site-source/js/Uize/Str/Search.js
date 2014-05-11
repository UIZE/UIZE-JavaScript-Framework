/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Str.Search Package
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
		The =Uize.Str.Search= package lets you search for all occurrences of a match in a multi-line string, providing information such as start and end line number and character position for each of the search results.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Str.Search',
	required:'Uize.Str.Lines',
	builder:function () {
		'use strict';

		/*** Utility Functions ***/
			function _getLineAndChar (_text,_charPos) {
				var
					_linesUpToChar = Uize.Str.Lines.split (_text.slice (0,_charPos + 1)),
					_line = _linesUpToChar.length - 1,
					_char = _linesUpToChar [_line].length - 1
				;
				if (_char < 0)
					_char = _linesUpToChar [--_line].length - 1
				;
				return {line:_line,char:_char};
			}

		return Uize.package ({
			search:function (_sourceStr,_matcher) {
				_matcher = new RegExp (
					_matcher.source,
					'g' + (_matcher.ignoreCase ? 'i' : '') + (_matcher.multiline ? 'm' : '')
				);
				var
					_matches = [],
					_matchesLength = 0,
					_match
				;
				while (_match = _matcher.exec (_sourceStr)) {
					var
						_startChar = _match.index,
						_endChar = _startChar + _match [0].length - 1
					;
					_match.startChar = _startChar;
					_match.endChar = _endChar;
					_match.start = _getLineAndChar (_sourceStr,_startChar);
					_match.end = _getLineAndChar (_sourceStr,_endChar);
					_matches [_matchesLength++] = _match;
				}
				return _matches;
			}
		});
	}
});

