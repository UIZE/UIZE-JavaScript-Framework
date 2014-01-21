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
						/*
						['Test that max length of zero produces empty string',
							['0123456789',0],
							''
						]
						*/
					]]
				])
			]
		});
	}
});

