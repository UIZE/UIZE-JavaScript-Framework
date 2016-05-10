/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Str.Replace Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 2
	codeCompleteness: 100
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Str.Replace= module provides methods for replacing substrings in a string by specifying a replacement lookup.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Str.Replace',
	builder:function () {
		'use strict';

		var
			/*** references to static methods used internally ***/
				_replacerByLookup
		;

		return Uize.package ({
			replacerByLookup:_replacerByLookup = function (_replacementsLookup) {
				var
					_regExpPipedSegments = [],
					_singleCharReplacements = []
				;
				Uize.forEach (
					Uize.keys (_replacementsLookup),
					function (_key) {
						if (_key)
							(_key.length > 1 ? _regExpPipedSegments : _singleCharReplacements).push (
								Uize.escapeRegExpLiteral (_key)
							)
						;
					}
				);
				_singleCharReplacements.length &&
					_regExpPipedSegments.unshift ('[' + _singleCharReplacements.join ('') + ']')
				;
				var _replacerRegExp = new RegExp (_regExpPipedSegments.join ('|'),'g');
				return function (_sourceString) {
					return (_sourceString += '') && _sourceString.replace (
						_replacerRegExp,
						function (_match) {return _replacementsLookup [_match]}
					);
				}
				/*?
					Static Methods
						Uize.Str.Replace.replacerByLookup
							.

							SYNTAX
							.........................................................................
							replacerFUNC = Uize.Str.Replace.replacerByLookup (replacementsLookupOBJ);
							.........................................................................
				*/
			},

			replaceByLookup:function (_sourceStr,_replacementsLookup) {
				return _replacerByLookup (_replacementsLookup) (_sourceStr);
				/*?
					Static Methods
						Uize.Str.Replace.replaceByLookup
							.

							SYNTAX
							...............................................................................
							resultSTR = Uize.Str.Replace.replaceByLookup (sourceSTR,replacementsLookupOBJ);
							...............................................................................
				*/
			}
		});
	}
});

