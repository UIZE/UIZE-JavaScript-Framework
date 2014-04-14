/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Str.Limit Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2014 UIZE
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
		The =Uize.Test.Uize.Str.Limit= module defines a suite of unit tests for the =Uize.Str.Limit= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Str.Limit',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.Str.Limit Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Str.Limit'),
				Uize.Test.staticMethodsTest ([
					['Uize.Str.Limit.joinUsingSuffixPriority',[
						['Test when max length is greater than combined lengths of prefix and suffix',
							['prefix',' - suffix',20],
							'prefix - suffix'
						],
						['Test when max length is equal to combined lengths of prefix and suffix',
							['prefix',' - suffix',15],
							'prefix - suffix'
						],
						['Test when max length is less than combined lengths of prefix and suffix',
							['prefix',' - suffix',12],
							'pre - suffix'
						],
						['Test when max length is equal to length of suffix',
							['prefix',' - suffix',9],
							' - suffix'
						],
						['Test when max length is less than length of suffix',
							['prefix',' - suffix',6],
							' - suf'
						],
						['Test when max length is zero',
							['prefix',' - suffix',0],
							''
						],
						['Test when max length is negative',
							['prefix',' - suffix',-1],
							''
						]
					]],
					['Uize.Str.Limit.limitLength',[
						['A max length of zero produces empty string',
							['0123456789',0],
							''
						],
						['A negative max length produces empty string',
							['0123456789',-1],
							''
						],
						['A max length greater than the source string length produces the source string',
							['0123456789',15],
							'0123456789'
						],
						['A max length equal to the source string length produces the source string',
							['0123456789',10],
							'0123456789'
						],
						['A max length less than the source string length produces a truncated version of the source string',
							['0123456789',9],
							'012345...'
						],
						['A max length equal to the continuation string length produces just a truncated source string with no continuation characters',
							['0123456789',3],
							'012'
						],
						['A max length less than the continuation string length produces just a truncated source string with no continuation characters',
							['0123456789',1],
							'0'
						]
					]]
				])
			]
		});
	}
});

