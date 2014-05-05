/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.JavaProperties.PropertyValue Object
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Object
	importance: 1
	codeCompleteness: 80
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Parse.JavaProperties.PropertyValue= module provides methods for parsing and serializing property values in [[http://en.wikipedia.org/wiki/.properties][Java properties]] files.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parse.JavaProperties.PropertyValue',
	required:[
		'Uize.Str.Whitespace',
		'Uize.Str.Replace',
		'Uize.Parse.JavaProperties.UnicodeEscaped'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Performance Optimization ***/
				_isWhitespace = Uize.Str.Whitespace.isWhitespace,
				_unicodeUnescape = Uize.Parse.JavaProperties.UnicodeEscaped.from,
				_unicodeEscape = Uize.Parse.JavaProperties.UnicodeEscaped.to,

			/*** General Variables ***/
				_terminatingCharsLookup = _charsLookup ('\n\r'),
				_parserUnescaper = Uize.Str.Replace.replacerByLookup ({
					'\\b':'\b',
					'\\t':'\t',
					'\\n':'\n',
					'\\f':'\f',
					'\\r':'\r',
					'\\"':'"',
					'\\\'':'\'',
					'\\\\':'\\'
				}),
				_serializerEscaper = Uize.Str.Replace.replacerByLookup ({
					'\b':'\\b',
					'\t':'\\t',
					'\n':'\\n',
					'\f':'\\f',
					'\r':'\\r',
					'\\':'\\\\'
				})
		;

		/*** Utility Functions ***/
			function _charsLookup (_charsStr) {
				return Uize.lookup (_charsStr.split (''));
			}

		return Uize.mergeInto (
			function (_source,_index) {
				this.parse (_source,_index);
			},
			{
				prototype:{
					source:'',
					index:0,
					length:0,
					isValid:false,
					value:'',

					parse:function (_source,_index) {
						var
							m = this,
							_sourceLength = (m.source = _source = _source || '').length
						;
						m.index = _index || (_index = 0);
						m.isValid = true;
						var
							_inEscape = false,
							_char
						;
						while (
							_index < _sourceLength &&
							(_inEscape || !_terminatingCharsLookup [_char = _source.charAt (_index)])
						) {
							_inEscape = !_inEscape && _char == '\\';
							_index++;
						}
						m.value = _unicodeUnescape (_parserUnescaper (_source.slice (m.index,_index)));
						m.length = _index - m.index;
					},

					serialize:function () {
						return this.isValid ? _unicodeEscape (_serializerEscaper (this.value)) : '';
					}
				}
			}
		);
	}
});

