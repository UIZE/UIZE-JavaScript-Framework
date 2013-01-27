/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Services.FileSystem Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2013 UIZE
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
		The =Uize.Test.Uize.Services.FileSystem= module defines a suite of unit tests for the =Uize.Services.FileSystem= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Services.FileSystem',
	builder:function () {
		'use strict';

		return Uize.Test.declare ({
			title:'Test for Uize.Services.FileSystem Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Services.FileSystem')
			]
		});
	}
});

