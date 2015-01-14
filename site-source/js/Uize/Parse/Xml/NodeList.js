/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.Xml.NodeList Object
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Object
	importance: 4
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Parse.Xml.NodeList= module provides methods for parsing and serializing XML nodes.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parse.Xml.NodeList',
	required:[
		'Uize.Parse.Items',
		'Uize.Parse.Xml.Tag',
		'Uize.Parse.Xml.Cdata',
		'Uize.Parse.Xml.Comment',
		'Uize.Parse.Xml.Text'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_superclass = Uize.Parse.Items,
				_Uize_Parse_Xml = Uize.Parse.Xml,

			/*** General Variables ***/
				_class = function (_source,_index) {
					var m = this;
					_superclass.call (m,_source,_index);
					m.nodes = m.items;
				}
		;

		_class.itemTypes = {
			tag:_Uize_Parse_Xml.Tag,
			cdata:_Uize_Parse_Xml.Cdata,
			comment:_Uize_Parse_Xml.Comment,
			text:_Uize_Parse_Xml.Text
		};

		Uize.copyInto (_class.prototype,_superclass.prototype);

		return _class;
	}
});

