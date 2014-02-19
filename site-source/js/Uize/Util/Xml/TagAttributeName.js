/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.Xml.TagAttributeName Package
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
		The =Uize.Util.Xml.TagAttributeName= module provides methods for parsing and serializing tag attribute names for tag attributes of XML tags.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Util.Xml.TagAttributeName',
	builder:function () {
		'use strict';

		/*** Utility Functions ***/
			// ...

		return Uize.mergeInto (
			function () {
			},

			{
				prototype:{
					source:'',
					index:0,
					length:0,
					isValid:false,
					name:'',

					parse:function (_source,_index) {
					},

					serialize:function () {
						return this.name;
					}
				}
			}
		);
	}
});

