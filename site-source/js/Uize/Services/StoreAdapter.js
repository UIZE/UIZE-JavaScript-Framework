/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Services.StoreAdapter Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 2
	codeCompleteness: 0
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Services.StoreAdapter= module defines an abstract base class for adapters for the store service (=Uize.Services.Store=).

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Services.StoreAdapter',
	superclass:'Uize.Service.Adapter',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ();
	}
});

