/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.Xml.TagAttribute Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 4
	codeCompleteness: 1
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Util.Xml.TagAttribute= module provides methods for parsing and serializing individual tag attributes of XML tags.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Util.Xml.TagAttribute',
	requires:[
		'Uize.Util.Xml.TagAttributeName',
		'Uize.Util.Xml.TagAttributeValue'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Performance Optimization ***/
				_Uize_Util_Xml_TagAttributeName = Uize.Util.Xml.TagAttributeName,
				_Uize_Util_Xml_TagAttributeValue = Uize.Util.Xml.TagAttributeValue

			/*** General Variables ***/
				// ...
		;

		/*** Utility Functions ***/
			// ...

		return Uize.copyInto (
			function () {
				var m = this;
				m.name = new _Uize_Util_Xml_TagAttributeName;
				m.value = new _Uize_Util_Xml_TagAttributeValue;
			},

			prototype:{
				source:'',
				index:0,
				length:0,
				isValid:false,

				parse:function (_source,_index) {
					/*
						expect name
						if whitespace
							eat whitespace
							expect possible value
					*/
				},

				serialize:function () {
					return this.isValid ? this.name.serialize () + ' ' + this.value.serialize () : '';
				}
			}
		);
	}
});

