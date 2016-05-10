/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Str.BackslashEscapedLinebreaks Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
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
		The =Uize.Test.Uize.Str.BackslashEscapedLinebreaks= module defines a suite of unit tests for the =Uize.Str.BackslashEscapedLinebreaks= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Str.BackslashEscapedLinebreaks',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Uize.Str.BackslashEscapedLinebreaks Module Test',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Str.BackslashEscapedLinebreaks'),
				Uize.Test.staticMethodsTest ([
					['Uize.Str.BackslashEscapedLinebreaks.from',[
						['A backslash-escaped new line at the start of the string is unescaped to a new line character',
							'\\nfoo bar',
							'\nfoo bar'
						],
						['A backslash-escaped new line at the end of the string is unescaped to a new line character',
							'foo bar\\n',
							'foo bar\n'
						],
						['A backslash-escaped new line in the middle of the string is unescaped to a new line character',
							'foo\\nbar',
							'foo\nbar'
						],
						['A backslash-escaped carriage return is unescaped to a carriage return character',
							'\\rfoo\\rbar\\r',
							'\rfoo\rbar\r'
						],
						['An "n" or "r" with an even number of preceding backslash characters is not escaped to a new line or carriage return, but is left as an "n" or "r" character, and the preceding backslash characters are treated as backslash-escaped backslashes',
							'\\\\\\\\n \\\\\\\\r',
							'\\\\n \\\\r'
						],
						['An "n" or "r" with an odd number of preceding backslash characters is escaped to a new line or carriage return, and the preceding backslash characters minus the immediately preceding backslash character are treated as backslash-escaped backslashes',
							'\\\\\\\\\\n \\\\\\\\\\r',
							'\\\\\n \\\\\r'
						],
						['A character following an escaping backslash but that is neither an "n" nor an "r" is left as is',
							'\\\\\\.',
							'\\.'
						],
						['An escaping backslash that is at the end of the string and that is not paired with an escape character code is ignored',
							'foo\\',
							'foo'
						]
					]],
					['Uize.Str.BackslashEscapedLinebreaks.to',[
						['New line characters are backslash-escaped',
							'\nfoo\nbar\n',
							'\\nfoo\\nbar\\n'
						],
						['Carriage return characters are backslash-escaped',
							'\rfoo\rbar\r',
							'\\rfoo\\rbar\\r'
						],
						['Backslash characters are backslash-escaped',
							'\\red \\\\nut',
							'\\\\red \\\\\\\\nut'
						]
					]]
				])
			]
		});
	}
});

