/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.JavaProperties.PropertyName Object
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Object
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
	required:[
		'Uize.Str.Whitespace',
		'Uize.Str.Replace',
		'Uize.Parse.JavaProperties.UnicodeEscaped'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Performance Optimization ***/
				_isNonWhitespace = Uize.Str.Whitespace.isNonWhitespace,

			/*** General Variables ***/
				_terminatingCharsLookup = _charsLookup (' :='),
				_serializerEscaper = Uize.Str.Replace.replacerByLookup ({
					'\\':'\\\\',
					':':'\\:',
					'=':'\\=',
					' ':'\\ '
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
					name:'',

					unicodeEscape:Uize.Parse.JavaProperties.UnicodeEscaped.to,
					unicodeUnescape:Uize.Parse.JavaProperties.UnicodeEscaped.from,

					parse:function (_source,_index) {
						var
							m = this,
							_sourceLength = (m.source = _source = _source || '').length
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
							m.name = _source.slice (m.index,_index).replace (/\\(.)/g,'$1');
							m.length = _index - m.index;
						}
					},

					serialize:function () {
						var m = this;
						return m.isValid ? m.unicodeEscape (_serializerEscaper (m.name)) : '';
					}
				}
			}
		);
	}
});

