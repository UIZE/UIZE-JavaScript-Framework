/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.Xml.TagAttribute Class
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
		The =Uize.Parse.Xml.TagAttribute= module provides methods for parsing and serializing individual tag attributes of XML tags.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parse.Xml.TagAttribute',
	superclass:'Uize.Parse.Base',
	required:[
		'Uize.Str.Whitespace',
		'Uize.Parse.Xml.TagOrAttributeName',
		'Uize.Parse.Xml.TagAttributeValue'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Performance Optimization ***/
				_Uize_Util_Xml_TagOrAttributeName = Uize.Parse.Xml.TagOrAttributeName,
				_Uize_Util_Xml_TagAttributeValue = Uize.Parse.Xml.TagAttributeValue,
				_indexOfNonWhitespace = Uize.Str.Whitespace.indexOfNonWhitespace
		;

		return _superclass.subclass ({
			constructor:function () {
				var m = this;
				m.name = new _Uize_Util_Xml_TagOrAttributeName;
				m.value = new _Uize_Util_Xml_TagAttributeValue;
				_superclass.apply (m,arguments);
			},

			instanceMethods:{
				parse:function (_source,_index) {
					function _eatWhitespace () {
						_index = (_indexOfNonWhitespace (_source,_index) + 1 || _sourceLength + 1) - 1;
					}
					var
						m = this,
						_sourceLength = (m.source = _source).length
					;
					m.index = _index || (_index = 0);
					m.name.parse (_source,_index);
					if (m.name.isValid) {
						_index += m.name.length;
						_eatWhitespace ();
						if (_source.charAt (_index) == "=") {
							_index++;
							_eatWhitespace ();
							m.value.parse (_source,_index);
							_index += m.value.length;
						}
					}
					m.isValid = !!(m.length = _index - m.index);
				},

				serialize:function () {
					return this.isValid ? this.name.serialize () + '=' + this.value.serialize () : '';
				}
			}
		});
	}
});

