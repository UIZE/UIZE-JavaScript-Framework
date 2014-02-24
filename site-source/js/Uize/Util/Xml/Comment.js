/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.Xml.Comment Package
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
		The =Uize.Util.Xml.Comment= module provides methods for parsing and serializing comments of XML documents.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Util.Xml.Comment',
	builder:function () {
		'use strict';

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
					comment:'',

					parse:function (_source,_index) {
						var
							m = this,
							_sourceLength = (m.source = _source = _source || '').length
						;
						m.index = _index || (_index = 0);
						if (m.isValid = _source.substr (_index,4) == '<!--') {
							var _endPos = ((_source.indexOf ('-->',_index += 4)) + 1 || _sourceLength + 1) - 1;
							m.comment = _source.slice (_index,_endPos);
							m.length = _endPos - _index + 7;
						} else {
							m.comment = '';
							m.length = 0;
						}
					},

					serialize:function () {
						return this.isValid ? '<!--' + this.comment + '-->' : '';
					}
				}
			}
		);
	}
});

