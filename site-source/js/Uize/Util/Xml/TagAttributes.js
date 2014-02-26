/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.Xml.TagAttributes Object
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Object
	importance: 4
	codeCompleteness: 1
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Util.Xml.TagAttributes= module provides methods for parsing and serializing tag attributes lists of XML tags.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Util.Xml.TagAttributes',
	required:[
		'Uize.Str.Whitespace',
		'Uize.Util.Xml.TagAttribute'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Performance Optimization ***/
				_Uize_Util_Xml_TagAttribute = Uize.Util.Xml.TagAttribute,
				_indexOfNonWhitespace = Uize.Str.Whitespace.indexOfNonWhitespace
		;

		return Uize.mergeInto (
			function (_source,_index) {
				var m = this;
				m._attributes = m.attributes = [];
				m.parse (_source,_index);
			},

			{
				prototype:{
					source:'',
					index:0,
					length:0,
					isValid:true,

					parse:function (_source,_index) {
						function _eatWhitespace () {
							_index = (_indexOfNonWhitespace (_source,_index) + 1 || _sourceLength + 1) - 1;
						}
						var
							m = this,
							_attributes = m._attributes,
							_attribute,
							_sourceLength = (m.source = _source = _source || '').length
						;
						m.index = _index || (_index = 0);
						_attributes.length = 0;
						while (_index < _sourceLength) {
							_eatWhitespace ();
							if (_index < _sourceLength) {
								if ((_attribute = new _Uize_Util_Xml_TagAttribute (_source,_index)).isValid) {
									_attributes.push (_attribute);
									_index += _attribute.length;
								} else {
									break;
								}
							}
						}
						m.length = _index - m.index;
					},

					serialize:function () {
						return this.isValid ? Uize.map (this._attributes,'value.serialize ()').join (' ') : '';
					}
				}
			}
		);
	}
});

