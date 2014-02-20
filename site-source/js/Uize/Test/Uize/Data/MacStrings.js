/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Data.MacStrings Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 1
	codeCompleteness: 5
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Data.MacStrings= module defines a suite of unit tests for the =Uize.Data.MacStrings= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Data.MacStrings',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Uize.Data.MacStrings Module Test',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Data.MacStrings'),
				Uize.Test.staticMethodsTest ([
					['Uize.Data.MacStrings.from',[
						['Test that parsing an empty string produces an empty strings object',
							'',
							{}
						],
						['Test that parsing a single line strings text block produces a strings object with a single string entry',
							'"foo" = "bar";',
							{
								foo:'bar'
							}
						],
						['Test that parsing a multi-line strings text block produces a strings object with multiple string entries',
							[
								'"foo" = "bar";',
								'"baz" = "qux";',
								'"hello" = "world";'
							].join ('\n'),
							{
								foo:'bar',
								baz:'qux',
								hello:'world'
							}
						],
						['Test that parsing a multi-line strings text block where the carriage return character is used for line endings is handled correctly',
							[
								'"foo" = "bar";',
								'"baz" = "qux";',
								'"hello" = "world";'
							].join ('\r'),
							{
								foo:'bar',
								baz:'qux',
								hello:'world'
							}
						],
						['Test that parsing a multi-line strings text block where a combination of carriage return and linebreak characters is used for line endings is handled correctly',
							[
								'"foo" = "bar";',
								'"baz" = "qux";',
								'"hello" = "world";'
							].join ('\r\n'),
							{
								foo:'bar',
								baz:'qux',
								hello:'world'
							}
						],
						['Test that parsing a strings text block where either the keys or values for string entries contain escaped characters is handled correctly and the escaped characters are unescaped',
							[
								'"f\\"o\\no" = "bar";',
								'"baz" = "q\\"u\\nx";',
								'"h\\"e\\nllo" = "w\\"o\\nrld";'
							].join ('\n'),
							{
								'f"o\no':'bar',
								baz:'q"u\nx',
								'h"e\nllo':'w"o\nrld'
							}
						],
						['Test that parsing a strings text block that contains single line comments is handled correctly',
							[
								'"foo" = "bar";',
								'// this is a comment',
								'"baz" = "qux"; // this is a comment',
								'"hello" = "world";'
							].join ('\n'),
							{
								foo:'bar',
								baz:'qux',
								hello:'world'
							}
						],
						['Test that parsing a strings text block that contains multi-line comments is handled correctly',
							[
								'"foo" = "bar";',
								'/* this is a comment */',
								'"baz" = "qux"; /* this is a comment',
								'that spans multiple lines */ "hello" = "world";'
							].join ('\n'),
							{
								foo:'bar',
								baz:'qux',
								hello:'world'
							}
						]
					]],
					['Uize.Data.MacStrings.to',[
						['Test that serializing an empty strings object produces an empty string as a result',
							{},
							''
						],
						['Test that serializing a strings object with a single string entry produces a single line string as a result',
							{
								foo:'bar'
							},
							'"foo" = "bar";'
						],
						['Test that serializing a strings object with multiple string entries produces a multi-line string as a result',
							{
								foo:'bar',
								baz:'qux',
								hello:'world'
							},
							[
								'"foo" = "bar";',
								'"baz" = "qux";',
								'"hello" = "world";'
							].join ('\n')
						],
						['Test that, when either the key or value for a string entry contains special characters, the special characters are escaped correctly',
							{
								'f"o\no':'bar',
								baz:'q"u\nx',
								'h"e\nllo':'w"o\nrld'
							},
							[
								'"f\\"o\\no" = "bar";',
								'"baz" = "q\\"u\\nx";',
								'"h\\"e\\nllo" = "w\\"o\\nrld";'
							].join ('\n')
						]
					]]
				])
			]
		});
	}
});

