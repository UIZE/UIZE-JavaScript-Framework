/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Collection.Dynamic.Table Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2011-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 4
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widget.Collection.Dynamic.Table= class thinly extends =Uize.Widget.Collection.Dynamic= by adding support for handling collections of table rows.

		It is assumed that each collection item is represented in markup by a table row (tr).

		*DEVELOPERS:* `Vinson Chuong`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.Collection.Dynamic.Table',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			instanceMethods:{
				processItemTemplate:function (_templateNode) {
					var m = this;
					return function (_input) {
						var _dummyNode = document.createElement ('DIV');
						_dummyNode.innerHTML =
							'<table><tbody>' +
							_superclass.doMy (m,'processItemTemplate',[_templateNode]) (_input) +
							'</tbody></table>'
						;
						return Array.prototype.slice.call(_dummyNode.firstChild.firstChild.childNodes);
					};
				}
			}
		});
	}
});

