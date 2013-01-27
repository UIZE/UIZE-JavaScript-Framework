/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.String.Replace Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Object
	importance: 1
	codeCompleteness: 100
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.String.Replace= module provides methods for working with multi-line strings, supporting indenting, changing linebreaks, modifying lines, etc.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.String.Replace',
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var _package = function () {};

		/*** Static Methods ***/
			_package.replacerByLookup = function (_replacementsLookup) {
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
						Uize.String.Replace.replacerByLookup
							.

							SYNTAX
							............................................................................
							replacerFUNC = Uize.String.Replace.replacerByLookup (replacementsLookupOBJ);
							............................................................................
				*/
			};

			_package.replaceByLookup = function (_sourceStr,_replacementsLookup) {
				return _package.replacerByLookup (_replacementsLookup) (_sourceStr);
				/*?
					Static Methods
						Uize.String.Replace.replaceByLookup
							.

							SYNTAX
							..................................................................................
							resultSTR = Uize.String.Replace.replaceByLookup (sourceSTR,replacementsLookupOBJ);
							..................................................................................
				*/
			};

		return _package;
	}
});

