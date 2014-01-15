/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Str.Trim Class
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
						['Test that leading whitespace is detected as padding',
							'   leading whitespace',
							true
						],
						['Test that trailing whitespace is detected as padding',
							'trailing whitespace     ',
							true
						],
						['Test that leading and trailing whitespace is detected as padding',
							'   leading and trailing whitespace   ',
							true
						],
						['Test that padding is not detected in a string that has no padding',
							'noPadding',
							false
						],
						['Test that whitespace only in the middle is not detected as padding',
							'no         padding',
							false
						],
						['Test that a string that is only whitespace is treated as having padding',
							'                ',
							true
						],
						['Test that an empty string is not considered to have padding',
							'',
							false
						]
					]],
					['Uize.Str.Trim.trim',[
						['Test that trimming empty string produces empty string','',''],
						['Test that trimming string with no padding returns the same string','hello','hello'],
						['Test that trimming string with leading spaces works','   hello','hello'],
						['Test that trimming string with trailing spaces works','hello   ','hello'],
						['Test that trimming string with leading and trailing spaces works','   hello   ','hello'],
						['Test that trimming does not affect inner whitesapce',' hello \t there ','hello \t there'],
						['Test that trimming string with tab padding works','\t\thello\t\t','hello'],
						['Test that left-trimming can be performed by specifying -1 for the optional side parameter',
							['   hello   ',-1],
							'hello   '
						],
						['Test that right-trimming can be performed by specifying 1 for the optional side parameter',
							['   hello   ',1],
							'   hello'
						],
						['Test that trimming on both sides can be performed by specifying 0 for the optional side parameter',
							['   hello   ',0],
							'hello'
						]
					]],
					['Uize.Str.Trim.trimLeft',[
						['Test that left-trimming empty string produces empty string','',''],
						['Test that left-trimming string with no padding returns the same string','hello','hello'],
						['Test that left-trimming string with leading spaces works','   hello','hello'],
						['Test that left-trimming string with trailing spaces works','hello   ','hello   '],
						['Test that left-trimming string with leading and trailing spaces works','   hello   ','hello   '],
						['Test that left-trimming does not affect inner whitesapce',' hello \t there ','hello \t there '],
						['Test that left-trimming string with tab padding works','\t\thello\t\t','hello\t\t']
					]],
					['Uize.Str.Trim.trimRight',[
						['Test that right-trimming empty string produces empty string','',''],
						['Test that right-trimming string with no padding returns the same string','hello','hello'],
						['Test that right-trimming string with leading spaces works','   hello','   hello'],
						['Test that right-trimming string with trailing spaces works','hello   ','hello'],
						['Test that right-trimming string with leading and trailing spaces works','   hello   ','   hello'],
						['Test that right-trimming does not affect inner whitesapce',' hello \t there ',' hello \t there'],
						['Test that right-trimming string with tab padding works','\t\thello\t\t','\t\thello']
					]]
				])
			]
		});
	}
});

