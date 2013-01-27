/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Node Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 8
	codeCompleteness: 1
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Node= module defines a suite of unit tests for the =Uize.Node= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Node',
	builder:function () {
		'use strict';

		return Uize.Test.declare ({
			title:'Test for Uize.Node Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Node')
			]
		});
	}
});

