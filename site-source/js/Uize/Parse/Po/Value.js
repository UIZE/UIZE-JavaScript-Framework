/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.Po.Value Object
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
		The =Uize.Parse.Po.Value= module provides methods for parsing and serializing values in GNU gettext [[https://www.gnu.org/software/gettext/manual/html_node/PO-Files.html][PO files]].

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parse.Po.Value',
	required:[
		'Uize.Str.Whitespace',
		'Uize.Parse.Code.StringLiteral'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Performance Optimization ***/
				_indexOfNonWhitespace = Uize.Str.Whitespace.indexOfNonWhitespace,

			/*** General Variables ***/
				_stringLiteralParser = new Uize.Parse.Code.StringLiteral,
				_terminatingCharsLookup = _charsLookup ('\n\r'),
				_linebreakLookup = _charsLookup ('\n\r\f')
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
						function _eatWhitespace () {
							_index = (_indexOfNonWhitespace (_source,_index) + 1 || _sourceLength + 1) - 1;
						}
						var
							m = this,
							_sourceLength = (m.source = _source = _source || '').length
						;
						m.index = _index || (_index = 0);
						m.isValid = true;
						var
							_parts = [],
							_char,
							_indexBeforeEatingWhitespace = _index
						;
						while (_index < _sourceLength) {
							_stringLiteralParser.parse (_source,_index);
							if (_stringLiteralParser.isValid) {
								_parts.push (_stringLiteralParser.value);
								_indexBeforeEatingWhitespace = (_index += _stringLiteralParser.length);
								_eatWhitespace ();
							} else {
								break;
							}
						}
						m.value = _parts.join ('');
						m.isValid = !!(m.length = _indexBeforeEatingWhitespace - m.index);
					},

					serialize:function () {
						_stringLiteralParser.value = this.value;
						_stringLiteralParser.isValid = true;
						return _stringLiteralParser.serialize ();
					}
				}
			}
		);
	}
});

