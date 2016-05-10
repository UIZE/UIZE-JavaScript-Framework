/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.Xml.NodeList Class
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
		The =Uize.Parse.Xml.NodeList= module provides methods for parsing and serializing XML nodes.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parse.Xml.NodeList',
	superclass:'Uize.Parse.Items',
	required:[
		'Uize.Parse.Xml.Tag',
		'Uize.Parse.Xml.Cdata',
		'Uize.Parse.Xml.Comment',
		'Uize.Parse.Xml.Text'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			constructor:function () {
				_superclass.apply (this,arguments);
				this.nodes = this.items;
			},
			staticProperties:{
				itemTypes:{
					tag:Uize.Parse.Xml.Tag,
					cdata:Uize.Parse.Xml.Cdata,
					comment:Uize.Parse.Xml.Comment,
					text:Uize.Parse.Xml.Text
				}
			}
		});
	}
});

