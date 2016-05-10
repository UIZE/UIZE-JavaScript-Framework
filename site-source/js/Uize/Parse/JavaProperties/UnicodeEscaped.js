/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.JavaProperties.UnicodeEscaped Package
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
	docCompleteness: 10
*/

/*?
	Introduction
		The =Uize.Parse.JavaProperties.UnicodeEscaped= module provides methods for converting to and from Java Unicode-escaped strings.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parse.JavaProperties.UnicodeEscaped',
	builder:function () {
		'use strict';

		var
			/*** General Variables ***/
				_leadingZeros = '000000',
				_sacredEmptyObject = {}
		;

		return Uize.package ({
			from:function (_toUnescape) {
				return (_toUnescape + '').replace (
					/\\u([0-9a-fA-F]{4})/g,
					function (_match,_hexDigits) {
						return String.fromCharCode (+('0x' + _hexDigits));
					}
				);
				/*?
					Static Methods
						Uize.Parse.JavaProperties.UnicodeEscaped.from
							Returns an unescaped version of the specified Unicode-escaped string.

							SYNTAX
							.................................................................................
							unescapedSTR = Uize.Parse.JavaProperties.UnicodeEscaped.from (unicodeEscapedSTR);
							.................................................................................

							NOTES
							- see the companion =Uize.Parse.JavaProperties.UnicodeEscaped.to= static method
				*/
			},

			to:function (_toEscape,_encodingOptions) {
				_encodingOptions || (_encodingOptions = _sacredEmptyObject);
				var
					_escapingThreshold = Uize.toNumber (_encodingOptions.escapingThreshold,256),
					_chunks = []
				;
				for (
					var
						_charNo = -1,
						_toEscapeLength = (_toEscape += '').length,
						_chunksLength = 0,
						_lastUnicodeCharPos = -1,
						_charCode
					;
					++_charNo <= _toEscapeLength;
				) {
					if (_charNo == _toEscapeLength || (_charCode = _toEscape.charCodeAt (_charNo)) >= _escapingThreshold) {
						_chunks [_chunksLength++] = _toEscape.slice (_lastUnicodeCharPos + 1,_charNo);
						_lastUnicodeCharPos = _charNo;
						if (_charNo < _toEscapeLength) {
							var _hexValue = _charCode.toString (16).toUpperCase ();
							_chunks [_chunksLength++] =
								'\\u' + _leadingZeros.slice (0,Math.max (4 - _hexValue.length,0)) + _hexValue
							;
						}
					}
				}
				return _chunks.join ('');
				/*?
					Static Methods
						Uize.Parse.JavaProperties.UnicodeEscaped.from
							Returnsa a Unicode-escaped version of the specified unescaped string.

							SYNTAX
							...............................................................................
							unicodeEscapedSTR = Uize.Parse.JavaProperties.UnicodeEscaped.to (unescapedSTR);
							...............................................................................

							NOTES
							- see the companion =Uize.Parse.JavaProperties.UnicodeEscaped.from= static method
				*/
			}
		});
	}
});

