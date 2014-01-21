/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Loc.CldrPluralRuleParser Class
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
		The =Uize.Test.Uize.Loc.CldrPluralRuleParser= module defines a suite of unit tests for the =Uize.Loc.CldrPluralRuleParser= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Loc.CldrPluralRuleParser',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.Loc.CldrPluralRuleParser Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Loc.CldrPluralRuleParser'),
				Uize.Test.staticMethodsTest ([
					['Uize.Loc.CldrPluralRuleParser.toJsExpression',[
						['',
							'n % 10 = 3..4,9 and n % 100 != 10..19,70..79,90..99',
							''
						],
						['',
							'v = 0 and i % 10 = 1 and i % 100 != 11 or f % 10 = 1 and f % 100 != 11 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, … @decimal 0.1, 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 10.1, 100.1, 1000.1, …',
							''
						]
					]]
				])
			]
		});
	}
});

