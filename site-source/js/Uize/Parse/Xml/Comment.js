/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.Xml.Comment Class
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
		The =Uize.Parse.Xml.Comment= module provides methods for parsing and serializing comments of XML documents.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parse.Xml.Comment',
	superclass:'Uize.Parse.Base',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			instanceProperties:{
				comment:''
			},

			instanceMethods:{
				parse:function (_source,_index) {
					var
						m = this,
						_sourceLength = (m.source = _source).length
					;
					m.comment = '';
					m.length = 0;
					m.index = _index || (_index = 0);
					if (_source.substr (_index,4) == '<!--') {
						var _endPos = _source.indexOf ('-->',_index += 4);
						if (_endPos > -1) {
							m.comment = _source.slice (_index,_endPos);
							m.length = _endPos - _index + 7;
						}
					}
					m.isValid = !!m.length;
				},

				serialize:function () {
					return this.isValid ? '<!--' + this.comment + '-->' : '';
				}
			}
		});
	}
});

