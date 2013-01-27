/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Template Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 5
	codeCompleteness: 0
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Template= module defines a suite of unit tests for the =Uize.Template= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Template',
	builder:function () {
		'use strict';

		return Uize.Test.declare ({
			title:'Test for Uize.Template Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Template'),
				Uize.Test.staticMethodsTest ([
					['Uize.Template.encode',[
					]],
					['Uize.Template.decode',[
					]],
					['Uize.Template.defineStandardEncoding',[
					]],
					['Uize.Template.compile',[
					]]
				])
			]
		});
	}
});

