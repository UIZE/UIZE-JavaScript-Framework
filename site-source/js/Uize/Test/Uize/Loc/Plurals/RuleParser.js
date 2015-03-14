/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Loc.Plurals.RuleParser Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2015 UIZE
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
		The =Uize.Test.Uize.Loc.Plurals.RuleParser= module defines a suite of unit tests for the =Uize.Loc.Plurals.RuleParser= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Loc.Plurals.RuleParser',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.Loc.Plurals.RuleParser Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Loc.Plurals.RuleParser'),
				Uize.Test.staticMethodsTest ([
					['Uize.Loc.Plurals.RuleParser.ruleToJs',[
						['',
							'n % 10 = 3..4,9 and n % 100 != 10..19,70..79,90..99',
							'within (n % 10,[[3,4],9]) && !within (n % 100,[[10,19],[70,79],[90,99]])'
						]/*,
						['',
							'v = 0 and i % 10 = 1 and i % 100 != 11 or f % 10 = 1 and f % 100 != 11 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, … @decimal 0.1, 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 10.1, 100.1, 1000.1, …',
							''
						]
						*/
					]]
					/*
					['Uize.Loc.Plurals.RuleParser.rulesToJsFunction',[
						['',
							{
							  zero:'n = 0 @integer 0 @decimal 0.0, 0.00, 0.000, 0.0000',
							  one:'n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000',
							  two:'n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000',
							  few:'n % 100 = 3..10 @integer 3~10, 103~110, 1003, … @decimal 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 103.0, 1003.0, …',
							  many:'n % 100 = 11..99 @integer 11~26, 111, 1011, … @decimal 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 17.0, 18.0, 111.0, 1011.0, …',
							  other:' @integer 100~102, 200~202, 300~302, 400~402, 500~502, 600, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.1, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …'
							},
							''
						]
					]]
					*/
				])
			]
		});
	}
});

