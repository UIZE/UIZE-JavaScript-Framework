/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.JavaProperties.PropertyName Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Parse.JavaProperties.PropertyName= module provides methods for parsing and serializing property names in [[http://en.wikipedia.org/wiki/.properties][Java properties]] files.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parse.JavaProperties.PropertyName',
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
				_isNonWhitespace = Uize.Str.Whitespace.isNonWhitespace,

			/*** General Variables ***/
				_terminatingCharsLookup = _charsLookup (' :='),
				_escapedCharsLookup = {
					'\\':'\\\\',
					':':'\\:',
					'=':'\\=',
					' ':'\\ ',
					'\t':'\\\t'
				},
				_parserUnescaper = Uize.Str.Replace.replacerByLookup (Uize.reverseLookup (_escapedCharsLookup)),
				_serializerEscaper = Uize.Str.Replace.replacerByLookup (_escapedCharsLookup)
		;

		/*** Utility Functions ***/
			function _charsLookup (_charsStr) {
				return Uize.lookup (_charsStr.split (''));
			}

		return _superclass.subclass ({
			instanceProperties:{
				name:''
			},

			instanceMethods:{
				unicodeEscape:Uize.Parse.JavaProperties.UnicodeEscaped.to,
				unicodeUnescape:Uize.Parse.JavaProperties.UnicodeEscaped.from,

				parse:function (_source,_index) {
					var
						m = this,
						_sourceLength = (m.source = _source).length
					;
					m.index = _index || (_index = 0);
					m.isValid = false;
					if (_isNonWhitespace (_source.charAt (_index))) {
						m.isValid = true;
						_index++;
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
						m.name = m.unicodeUnescape (_parserUnescaper (_source.slice (m.index,_index)));
						m.length = _index - m.index;
					}
				},

				serialize:function () {
					var m = this;
					return m.isValid ? m.unicodeEscape (_serializerEscaper (m.name)) : '';
				}
			}
		});
	}
});

