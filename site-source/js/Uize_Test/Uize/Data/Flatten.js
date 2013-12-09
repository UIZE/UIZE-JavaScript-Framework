/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Data.Flatten Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Data.Flatten= module defines a suite of unit tests for the =Uize.Data.Flatten= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Data.Flatten',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Uize.Data.Flatten Module Test',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Data.Flatten'),
				Uize.Test.staticMethodsTest ([
					['Uize.Data.Flatten.flatten',[
					]],
					['Uize.Data.Flatten.unflatten',[
					]]
				])
			]
		});
	}
});

