/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.Po.NameValue Object
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
		The =Uize.Parse.Po.NameValue= module provides methods for parsing and serializing name-value pairs in GNU gettext [[https://www.gnu.org/software/gettext/manual/html_node/PO-Files.html][PO files]].

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parse.Po.NameValue',
	required:[
		'Uize.Str.Whitespace',
		'Uize.Str.CharClass',
		'Uize.Parse.Po.Name',
		'Uize.Parse.Po.Value'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Performance Optimization ***/
				_Uize_Parse_Po_Name = Uize.Parse.Po.Name,
				_Uize_Parse_Po_Value = Uize.Parse.Po.Value,

			/*** General Variables ***/
				_inlineWhitespaceCharClass = Uize.Str.CharClass (Uize.Str.Whitespace.inlineWhitespaceCharCodes)
		;

		return Uize.mergeInto (
			function (_source,_index) {
				var m = this;
				m.name = new _Uize_Parse_Po_Name;
				m.value = new _Uize_Parse_Po_Value;
				this.parse (_source,_index);
			},
			{
				prototype:{
					source:'',
					index:0,
					length:0,
					isValid:false,

					parse:function (_source,_index) {
						function _eatInlineWhitespace () {
							_index =
								(_inlineWhitespaceCharClass.indexOfNonClassChar (_source,_index) + 1 || _sourceLength + 1) - 1
							;
						}
						var
							m = this,
							_sourceLength = (m.source = _source = _source || '').length
						;
						m.index = _index || (_index = 0);
						m.name.parse (_source,_index);
						if (m.name.isValid) {
							_index += m.name.length;
							_eatInlineWhitespace ();
							m.value.parse (_source,_index);
							_index = m.value.isValid ? _index + m.value.length : m.index;
						}
						m.isValid = !!(m.length = _index - m.index);
					},

					serialize:function () {
						return this.isValid ? this.name.serialize () + ' ' + this.value.serialize () : '';
					}
				}
			}
		);
	}
});

