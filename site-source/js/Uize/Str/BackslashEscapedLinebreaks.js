/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Str.BackslashEscapedLinebreaks Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Str.BackslashEscapedLinebreaks= module provides methods for converting to and from backslash-escaped linebreaks.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Str.BackslashEscapedLinebreaks',
	required:'Uize.Str.Replace',
	builder:function () {
		'use strict';

		var
			/*** General Variables ***/
				_escaper = Uize.Str.Replace.replacerByLookup ({
					'\\':'\\\\',
					'\r':'\\r',
					'\n':'\\n'
				}),

				_linebreakCodeToLinebreakLookup = {
					n:'\n',  // new line
					r:'\r'   // carriage return
				}
		;

		return Uize.package ({
			from:function (_toDecode) {
				return (
					_toDecode &&
					_toDecode.replace (
						/(\\*)([^\\]|$)/g,
						function (_match,_backslashes,_charAfterBackslashes) {
							var _backslashesLength = _backslashes.length;
							return (
								_backslashes.slice (0,Math.floor (_backslashesLength / 2)) +
								(
									(_backslashesLength % 2)
										? _linebreakCodeToLinebreakLookup [_charAfterBackslashes] || _charAfterBackslashes
										: _charAfterBackslashes
								)
							);
						}
					)
				);
			},

			to:function (_toEncode) {
				return _toEncode && _escaper (_toEncode);
			}
		});
	}
});

