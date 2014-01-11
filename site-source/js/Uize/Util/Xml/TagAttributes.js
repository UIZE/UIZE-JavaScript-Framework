/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.Xml.TagAttributes Package
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
		The =Uize.Util.Xml.TagAttributes= module provides methods for parsing and serializing tag attributes lists of XML tags.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Util.Xml.TagAttributes',
	requires:'Uize.Util.Xml.TagAttribute',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				// ...

			/*** Variables for Performance Optimization ***/
				_Uize_Util_Xml_TagAttribute = Uize.Util.Xml.TagAttribute

			/*** General Variables ***/
				// ...
		;

		return Uize.copyInto (
			function () {
				var m = this;
				m._attributes = m.attributes = [];
			},

			prototype:{
				source:'',
				index:0,
				length:0,
				isValid:false,

				parse:function (_source,_index) {
				},

				serialize:function () {
					return this.isValid ? Uize.map (this._attributes,'value.serialize ()').join (' ') : '';
				}
			}
		);
	}
});

