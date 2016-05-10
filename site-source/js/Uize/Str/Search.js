/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Str.Search Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 70
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

		var
			/*** References to Methods Used Internally ***/
				_getCharPosObject
		;

		return Uize.package ({
			getLineAndChar:_getCharPosObject = function (_text,_charPos) {
				var
					_linesUpToChar = Uize.Str.Lines.split (_text.slice (0,_charPos + 1)),
					_line = _linesUpToChar.length - 1,
					_lineChar = _linesUpToChar [_line].length - 1
				;
				if (_lineChar < 0)
					_lineChar = _linesUpToChar [--_line].length - 1
				;
				return {
					line:_line,
					lineChar:_lineChar,
					char:_charPos
				};
			},

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
					var _matchIndex = _match.index;
					_match.start = _getCharPosObject (_sourceStr,_matchIndex);
					_match.end = _getCharPosObject (_sourceStr,_matchIndex + _match [0].length - 1);
					_matches [_matchesLength++] = _match;
				}
				return _matches;
				/*?
					Static Methods
						Uize.Str.Search.search
							Returns an array, containing search result array objects for the zero or more matches of the specified matcher regular expression.

							SYNTAX
							......................................................................
							searchResultsARRAY = Uize.Str.Search.search (sourceSTR,matcherREGEXP);
							......................................................................

							The =Uize.Str.Search.search= method always returns an array, regardless of whether or not there are matches. When the search produces no results, the returned array will be empty.

							Result Objects
								Each element of the returned search results array is a match array, containing elements for all the captures of the match along with the following additional custom properties...

								- =start= - a `character position object`, describing the start position of the match segment within the source string
								- =end= - a `character position object`, describing the end position of the match segment within the source string

								Character Position Object
									A character position object is an object that describes a character position within a string in terms of line number, line character position, and absolute character position.

									STRUCTURE
									..............................................................................
									{
										line:lineINT,          // the line number within the string
										lineChar:lineCharINT,  // the character position within the line
										char:charINT           // the absolute character position within the string
									}
									..............................................................................
				*/
			}
		});
	}
});

