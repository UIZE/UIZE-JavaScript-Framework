/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Str.Trim Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2015 UIZE
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
		The =Uize.Test.Uize.Str.Trim= module defines a suite of unit tests for the =Uize.Str.Trim= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Str.Trim',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.Str.Trim Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Str.Trim'),
				Uize.Test.staticMethodsTest ([
					['Uize.Str.Trim.hasPadding',[
						['Leading whitespace is detected as padding',
							'   leading whitespace',
							true
						],
						['Trailing whitespace is detected as padding',
							'trailing whitespace     ',
							true
						],
						['Leading and trailing whitespace is detected as padding',
							'   leading and trailing whitespace   ',
							true
						],
						['Padding is not detected in a string that has no padding',
							'noPadding',
							false
						],
						['Whitespace only in the middle is not detected as padding',
							'no         padding',
							false
						],
						['A string that is only whitespace is considered to have padding',
							'                ',
							true
						],
						['An empty string is not considered to have padding',
							'',
							false
						]
					]],
					['Uize.Str.Trim.trim',[
						['Trimming empty string produces empty string','',''],
						['Trimming a string with no padding returns the same string','hello','hello'],
						['Test that trimming string with leading spaces works','   hello','hello'],
						['Test that trimming string with trailing spaces works','hello   ','hello'],
						['Test that trimming string with leading and trailing spaces works','   hello   ','hello'],
						['Trimming does not affect inner whitesapce',' hello \t there ','hello \t there'],
						['Test that trimming string with tab padding works','\t\thello\t\t','hello'],
						['Left-trimming can be performed by specifying -1 for the optional side parameter',
							['   hello   ',-1],
							'hello   '
						],
						['Right-trimming can be performed by specifying 1 for the optional side parameter',
							['   hello   ',1],
							'   hello'
						],
						['Trimming on both sides can be performed by specifying 0 for the optional side parameter',
							['   hello   ',0],
							'hello'
						]
					]],
					['Uize.Str.Trim.trimLeft',[
						['Left-trimming empty string produces empty string','',''],
						['Left-trimming a string with no padding returns the same string','hello','hello'],
						['Test that left-trimming string with leading spaces works','   hello','hello'],
						['Test that left-trimming string with trailing spaces works','hello   ','hello   '],
						['Test that left-trimming string with leading and trailing spaces works','   hello   ','hello   '],
						['Left-trimming does not affect inner whitesapce',' hello \t there ','hello \t there '],
						['Test that left-trimming string with tab padding works','\t\thello\t\t','hello\t\t']
					]],
					['Uize.Str.Trim.trimRight',[
						['Right-trimming empty string produces empty string','',''],
						['Right-trimming a string with no padding returns the same string','hello','hello'],
						['Test that right-trimming string with leading spaces works','   hello','   hello'],
						['Test that right-trimming string with trailing spaces works','hello   ','hello'],
						['Test that right-trimming string with leading and trailing spaces works','   hello   ','   hello'],
						['Right-trimming does not affect inner whitesapce',' hello \t there ',' hello \t there'],
						['Test that right-trimming string with tab padding works','\t\thello\t\t','\t\thello']
					]]
				])
			]
		});
	}
});

