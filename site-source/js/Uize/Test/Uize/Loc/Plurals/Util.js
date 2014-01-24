/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Loc.Plurals.Util Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 1
	codeCompleteness: 2
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Loc.Plurals.Util= module defines a suite of unit tests for the =Uize.Loc.Plurals.Util= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Loc.Plurals.Util',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.Loc.Plurals.Util Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Loc.Plurals.Util'),
				Uize.Test.staticMethodsTest ([
					['Uize.Loc.Plurals.Util.getNumberInfo',[
						['',
							-123.456,
							{
								n:123.456,
								i:123,
								v:3,
								w:3,
								f:456,
								t:456
							}
						],
						['',
							'1.100',
							{
								n:1.1,
								i:1,
								v:3,
								w:1,
								f:100,
								t:1
							}
						]
					]]
				])
			]
		});
	}
});

