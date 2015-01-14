/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Json.MultiLineStringLiteral Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2015 UIZE
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
		The =Uize.Json.MultiLineStringLiteral= module provides a method for serializing multi-line text strings to multi-line JavaScript string literal expressions using string concatenation.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Json.MultiLineStringLiteral',
	required:[
		'Uize.Str.Lines',
		'Uize.Json',
		'Uize.Str.Repeat'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Performance Optimization ***/
				_toJson = Uize.Json.to
		;

		return Uize.package ({
			serialize:function (_sourceStr,_encodingOptions) {
				_encodingOptions || (_encodingOptions = {});

				function _getDefaultedOption (_optionName,_defaultValue) {
					var _optionValue = _encodingOptions [_optionName];
					return _optionValue != undefined ? _optionValue : _defaultValue;
				}

				var
					_linebreakChars = _getDefaultedOption ('linebreakChars','\n'),
					_jsonEncodingOptions = {quoteChar:_encodingOptions.quoteChar},
					_indentStr = Uize.Str.Repeat.repeat (
						_getDefaultedOption ('indentChars','\t'),
						_getDefaultedOption ('indentLevel',0)
					),
					_lines = Uize.Str.Lines.split (_sourceStr),
					_lastLineNo = _lines.length - 1
				;
				return Uize.map (
					_lines,
					function (_line,_lineNo) {
						return (
							_indentStr +
							_toJson (_line + _linebreakChars,_jsonEncodingOptions) +
							(_lineNo < _lastLineNo ? ' +' : '')
						);
					}
				).join (_linebreakChars)
			}
		});
	}
});

