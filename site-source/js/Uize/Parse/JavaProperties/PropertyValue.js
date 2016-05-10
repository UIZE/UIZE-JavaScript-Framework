/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.JavaProperties.PropertyValue Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
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
	superclass:'Uize.Parse.Base',
	required:[
		'Uize.Str.Whitespace',
		'Uize.Str.Replace',
		'Uize.Parse.JavaProperties.UnicodeEscaped'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Performance Optimization ***/
				_indexOfNonWhitespace = Uize.Str.Whitespace.indexOfNonWhitespace,

			/*** General Variables ***/
				_terminatingCharsLookup = _charsLookup ('\n\r'),
				_linebreakLookup = _charsLookup ('\n\r\f'),
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

		return _superclass.subclass ({
			instanceProperties:{
				value:''
			},

			instanceMethods:{
				unicodeEscape:Uize.Parse.JavaProperties.UnicodeEscaped.to,
				unicodeUnescape:Uize.Parse.JavaProperties.UnicodeEscaped.from,

				parse:function (_source,_index) {
					function _eatWhitespace () {
						_index = (_indexOfNonWhitespace (_source,_index) + 1 || _sourceLength + 1) - 1;
					}
					var
						m = this,
						_sourceLength = (m.source = _source).length
					;
					m.index = _index || (_index = 0);
					m.isValid = true;
					var
						_inEscape = false,
						_char,
						_chunks = [],
						_chunksLength = 0,
						_chunkStartPos = _index
					;
					while (_index < _sourceLength) {
						_char = _source.charAt (_index);
						if (_inEscape) {
							if (_linebreakLookup [_char]) {
								_chunks [_chunksLength++] = _source.slice (_chunkStartPos,_index - 1);
								_eatWhitespace ();
								_chunkStartPos = _index;
							} else {
								_index++;
							}
							_inEscape = false;
						} else {
							if (_terminatingCharsLookup [_char]) {
								break;
							} else {
								_inEscape = _char == '\\';
								_index++;
							}
						}
					}
					m.value =
						m.unicodeUnescape (_parserUnescaper (_chunks.join ('') + _source.slice (_chunkStartPos,_index)))
					;
					m.length = _index - m.index;
				},

				serialize:function () {
					var m = this;
					return m.isValid ? m.unicodeEscape (_serializerEscaper (m.value)) : '';
				}
			}
		});
	}
});

