/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Loc.FileFormats.MacStrings Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
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
		The =Uize.Test.Uize.Loc.FileFormats.MacStrings= module defines a suite of unit tests for the =Uize.Loc.FileFormats.MacStrings= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Loc.FileFormats.MacStrings',
	builder:function () {
		'use strict';

		var
			/*** no strings ***/
				_stringsNoStrings = {},
				_fileNoStrings = '',

			/*** one string ***/
				_stringsOneString = {
					foo:'bar'
				},
				_fileOneString = '"foo" = "bar";',

			/*** multiple strings ***/
				_stringsMultipleStrings = {
					foo:'bar',
					baz:'qux',
					hello:'world'
				},
				_fileMultipleStrings =
					'"foo" = "bar";\n' +
					'"baz" = "qux";\n' +
					'"hello" = "world";',

			/*** special characters ***/
				_stringsSpecialCharacters = {
					'f"o\no':'bar',
					baz:'q"u\nx',
					'h"e\nllo':'w"o\nrld'
				},
				_fileSpecialCharacters =
					'"f\\"o\\no" = "bar";\n' +
					'"baz" = "q\\"u\\nx";\n' +
					'"h\\"e\\nllo" = "w\\"o\\nrld";'
		;

		return Uize.Test.resolve ({
			title:'Uize.Loc.FileFormats.MacStrings Module Test',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Loc.FileFormats.MacStrings'),
				Uize.Test.staticMethodsTest ([
					['Uize.Loc.FileFormats.MacStrings.from',[
						['Parsing an empty string produces an empty strings object',
							_fileNoStrings,
							Uize.clone (_stringsNoStrings)
						],
						['Parsing a single line strings text block produces a strings object with a single string entry',
							_fileOneString,
							Uize.clone (_stringsOneString)
						],
						['Parsing a multi-line strings text block produces a strings object with multiple string entries',
							_fileMultipleStrings,
							Uize.clone (_stringsMultipleStrings)
						],
						['Test that parsing a strings text block where either the keys or values for string entries contain escaped characters is handled correctly and the escaped characters are unescaped',
							_fileSpecialCharacters,
							Uize.clone (_stringsSpecialCharacters)
						],

						/*** test support for different linebreak characters ***/
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

						/*** test support for comments ***/
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
					['Uize.Loc.FileFormats.MacStrings.to',[
						['Serializing an empty strings object produces an empty string as a result',
							Uize.clone (_stringsNoStrings),
							_fileNoStrings
						],
						['Serializing a strings object with a single string entry produces a single line string as a result',
							Uize.clone (_stringsOneString),
							_fileOneString
						],
						['Serializing a strings object with multiple string entries produces a multi-line string as a result',
							Uize.clone (_stringsMultipleStrings),
							_fileMultipleStrings
						],
						['When either the key or value for a string entry contains special characters, the special characters are escaped correctly',
							Uize.clone (_stringsSpecialCharacters),
							_fileSpecialCharacters
						]
					]]
				])
			]
		});
	}
});

