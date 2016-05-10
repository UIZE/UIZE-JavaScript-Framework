/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.Base Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Parse.Base= module implements an abstract base class for lightweight parser class modules.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parse.Base',
	superclass:'Uize.Oop.BasicClass',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			constructor:function (_source,_index) {this.parse (_source || '',_index)},

			instanceProperties:{
				source:'',
				index:0,
				length:0,
				isValid:false
			},

			instanceMethods:{
				parse:Uize.nop,
				serialize:function () {return ''}
			}
		});
	}
});

