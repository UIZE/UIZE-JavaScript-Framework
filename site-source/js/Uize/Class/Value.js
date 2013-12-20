/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Class.Value Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Class.Value= class is a simple class that merely implements the `value interface` (ie. it declares a =value= state property).

		*DEVELOPERS:* `Chris van Rensburg`

		Methods of a number of different UIZE modules implement special handling for parameter values that are instances of =Uize.Class= subclasses that support the `value interface`. The =Uize.Class.Value= class is intended primarily for use in various unit tests that test the behavior of such methods.
*/

Uize.module ({
	name:'Uize.Class.Value',
	superclass:'Uize.Class',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({stateProperties:{_value:'value'}});
	}
});

