/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Loc.Plurals.RuleParser Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
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
				Uize.Test.requiredModulesTest ([
					'Uize.Loc.Plurals.RuleParser',
					'Uize.Loc.Plurals.Util'
				]),
				Uize.Test.staticMethodsTest ([
					['Uize.Loc.Plurals.RuleParser.ruleToJs',[
						['When a plural rule contains an "=" operator, it is compiled to an "==" (equals) JavaScript operator',
							'v = 0',
							'v == 0'
						],
						['Value samples at the end of a CLDR plural rule expression are ignored',
							'n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000',
							'n == 1'
						],
						['A plural rule may contain multiple parts separated by the "or" operator, which is compiled to a "||" JavaScript operator',
							'n = 1 or n = 2 or n = 3',
							'n == 1 || n == 2 || n == 3'
						],
						['A plural rule may contain multiple parts separated by the "and" operator, which is compiled to a "&&" JavaScript operator',
							'v = 0 and i % 10 = 1 and i % 100 != 11',
							'v == 0 && i % 10 == 1 && i % 100 != 11'
						],
						['A plural rule may contain a combination of "or" and "and" operators',
							'n % 10 = 2 and n % 100 = 30 or n % 1000 = 200 and n % 10000 = 3000',
							'n % 10 == 2 && n % 100 == 30 || n % 1000 == 200 && n % 10000 == 3000'
						],

						/*** test support for range comparisons ***/
							['A plural rule may contain a range comparison, which is compiled to a call to a local "within" JavaScript function',
								'n = 1..10',
								'within (n,[[1,10]])'
							],
							['A plural rule may contain a compound range comparison, which is compiled to a call to a local "within" JavaScript function that contains an array argument specifying the sub-ranges',
								'n = 1..10,20..25,50..100',
								'within (n,[[1,10],[20,25],[50,100]])'
							],
							['A compound range comparison in a plural rule may contain point sub-ranges',
								'n = 1..10,30,40,50..100,200',
								'within (n,[[1,10],30,40,[50,100],200])'
							],
							['The left operand in a range comparison is passed as the first argument in the call to the local "within" JavaScript function',
								'n % 10 = 30,40,50',
								'within (n % 10,[30,40,50])'
							],
							['When a range comparison is inverted using a "!=" operator, it is compiled to a call to the local "within" JavaScript function that is prefixed with a "!" (Boolean not) operator',
								'n != 1..10,30,40,50..100,200',
								'!within (n,[[1,10],30,40,[50,100],200])'
							]
					]],
					['Uize.Loc.Plurals.RuleParser.rulesToJs',[
						['A CLDR rules object, containing rules for the various plural categories supported by the language, can be compiled to a single JavaScript expression',
							{
							  zero:'n = 0 @integer 0 @decimal 0.0, 0.00, 0.000, 0.0000',
							  one:'n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000',
							  two:'n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000',
							  few:'n % 100 = 3..10 @integer 3~10, 103~110, 1003, … @decimal 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 103.0, 1003.0, …',
							  many:'n % 100 = 11..99 @integer 11~26, 111, 1011, … @decimal 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 17.0, 18.0, 111.0, 1011.0, …',
							  other:' @integer 100~102, 200~202, 300~302, 400~402, 500~502, 600, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.1, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …'
							},
							'n == 0 ? \'zero\' : n == 1 ? \'one\' : n == 2 ? \'two\' : within (n % 100,[[3,10]]) ? \'few\' : within (n % 100,[[11,99]]) ? \'many\' : \'other\''
						]
					]],
					['Uize.Loc.Plurals.RuleParser.rulesToJsFunctionStr',[
						['A CLDR rules object, containing rules for the various plural categories supported by the language, can be compiled to a JavaScript function string',
							{
							  zero:'n = 0 @integer 0 @decimal 0.0, 0.00, 0.000, 0.0000',
							  one:'n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000',
							  two:'n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000',
							  few:'n % 100 = 3..10 @integer 3~10, 103~110, 1003, … @decimal 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 103.0, 1003.0, …',
							  many:'n % 100 = 11..99 @integer 11~26, 111, 1011, … @decimal 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 17.0, 18.0, 111.0, 1011.0, …',
							  other:' @integer 100~102, 200~202, 300~302, 400~402, 500~502, 600, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.1, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …'
							},
							'function (n,i,f,t,v,w,within) {\n	return n == 0 ? \'zero\' : n == 1 ? \'one\' : n == 2 ? \'two\' : within (n % 100,[[3,10]]) ? \'few\' : within (n % 100,[[11,99]]) ? \'many\' : \'other\';\n}\n'
						]
					]],
					['Uize.Loc.Plurals.RuleParser.rulesToJsFunction',[
						{
							title:'A CLDR rules object, containing rules for the various plural categories supported by the language, can be compiled to a JavaScript function',
							test:function () {
								var
									_rulesFunction = Uize.Loc.Plurals.RuleParser.rulesToJsFunction ({
									  zero:'n = 0 @integer 0 @decimal 0.0, 0.00, 0.000, 0.0000',
									  one:'n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000',
									  two:'n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000',
									  few:'n % 100 = 3..10 @integer 3~10, 103~110, 1003, … @decimal 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 103.0, 1003.0, …',
									  many:'n % 100 = 11..99 @integer 11~26, 111, 1011, … @decimal 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 17.0, 18.0, 111.0, 1011.0, …',
									  other:' @integer 100~102, 200~202, 300~302, 400~402, 500~502, 600, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.1, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …'
									}),
									_within = Uize.Loc.Plurals.Util.within
								;
								return (
									this.expectFunction (_rulesFunction) &&
									this.expect ('zero',_rulesFunction (0,0,0,0,0,0,_within)) &&
									this.expect ('one',_rulesFunction (1,1,0,0,0,0,_within)) &&
									this.expect ('two',_rulesFunction (2,2,0,0,0,0,_within)) &&
									this.expect ('few',_rulesFunction (5,5,0,0,0,0,_within)) &&
									this.expect ('many',_rulesFunction (20,20,0,0,0,0,_within)) &&
									this.expect ('other',_rulesFunction (100,100,0,0,0,0,_within))
								);
							}
						}
					]]
				])
			]
		});
	}
});

