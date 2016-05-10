/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.Xml.TagAttributeValue Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 4
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Parse.Xml.TagAttributeValue= module provides methods for parsing and serializing tag attribute values for tag attributes of XML tags.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parse.Xml.TagAttributeValue',
	superclass:'Uize.Parse.Base',
	required:[
		'Uize.Util.Html.Encode',
		'Uize.Str.Whitespace'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize_Util_Html_Encode = Uize.Util.Html.Encode,

			/*** Variables for Performance Optimization ***/
				_htmlEncode = _Uize_Util_Html_Encode.encode,
				_htmlDecode = _Uize_Util_Html_Encode.decode,
				_indexOfWhitespace = Uize.Str.Whitespace.indexOfWhitespace
		;

		return _superclass.subclass ({
			instanceProperties:{
				value:''
			},

			instanceMethods:{
				parse:function (_source,_index) {
					var
						m = this,
						_sourceLength = (m.source = _source).length
					;
					m.index = _index || (_index = 0);
					var
						_currentChar = _source.charAt (_index),
						_currentCharIsQuote = _currentChar == '"' || _currentChar == '\'';
					;
					_index = _currentCharIsQuote
						? _source.indexOf (_currentChar,_index + 1)
						: Math.min (
							((_indexOfWhitespace (_source,_index) + 1) || _sourceLength + 1) - 1,
							((_source.indexOf ('>',_index) + 1) || _sourceLength + 1) - 1
						)
					;
					if (_index > -1) {
						m.value = _htmlDecode (_source.slice (m.index + _currentCharIsQuote,_index));
						m.length = _index + _currentCharIsQuote - m.index;
						m.isValid = true;
					} else {
						m.value = '';
						m.length = 0;
						m.isValid = false;
					}
				},

				serialize:function () {
					return this.isValid ? '"' + _htmlEncode (this.value) + '"' : '';
				}
			}
		});
	}
});

