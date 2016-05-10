/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Loc.FileFormats.Po Class
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
		The =Uize.Test.Uize.Loc.FileFormats.Po= module defines a suite of unit tests for the =Uize.Loc.FileFormats.Po= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Loc.FileFormats.Po',
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
				_fileOneString = [
					'msgid "foo"',
					'msgstr "bar"'
				].join ('\n'),

			/*** multiple strings ***/
				_stringsMultipleStrings = {
					foo:'bar',
					baz:'qux',
					hello:'world'
				},
				_fileMultipleStrings = [
					'msgid "foo"',
					'msgstr "bar"',
					'',
					'msgid "baz"',
					'msgstr "qux"',
					'',
					'msgid "hello"',
					'msgstr "world"'
				].join ('\n'),

			/*** strings with plural variants ***/
				_stringsPluralVariants = {
					"foo":"bar",
					"baz":[
						"qux",
						"quxes"
					],
					"hello":"world"
				},
				_filePluralVariants = [
					'msgid "foo"',
					'msgstr "bar"',
					'',
					'msgid_plural "baz"',
					'msgstr[0] "qux"',
					'msgstr[1] "quxes"',
					'',
					'msgid "hello"',
					'msgstr "world"'
				].join ('\n')
		;

		return Uize.Test.resolve ({
			title:'Uize.Loc.FileFormats.Po Module Test',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Loc.FileFormats.Po'),
				Uize.Test.staticMethodsTest ([
					['Uize.Loc.FileFormats.Po.from',[
						['Parsing an empty string produces an empty strings object',
							_fileNoStrings,
							Uize.clone (_stringsNoStrings)
						],
						['Parsing a file that contains only a single string entry produces a strings object with an entry for just that string',
							_fileOneString,
							Uize.clone (_stringsOneString)
						],
						['Parsing a file that contains multiple string entries produces a strings object with entries for all the strings',
							_fileMultipleStrings,
							Uize.clone (_stringsMultipleStrings)
						],
						['Parsing a file that contains string entries using the PO format\'s approach for representing plural forms produces a strings object where the entries for the strings with plural variants have array values containing all the plural variants',
							_filePluralVariants,
							Uize.clone (_stringsPluralVariants)
						],

						/*** test support for comments ***/
							['A PO file may contain any number of single line comments that start with a pound character, and these are essentially ignored',
								[
									'# message 1',
									'',
									'msgid "foo"',
									'msgstr "bar"',
									'',
									'# message 2',
									'',
									'msgid "baz"',
									'msgstr "qux"',
									'',
									'# message 3',
									'',
									'msgid "hello"',
									'msgstr "world"'
								].join ('\n'),
								{
									foo:'bar',
									baz:'qux',
									hello:'world'
								}
							],

						/*** test support for mixed linebreaks and whitespace ***/
							['A PO file may contain arbitrary whitespace separating the name-value pairs that form the message specifiers',
								[
									'',
									'',
									'msgid "foo"',
									'msgstr "bar"',
									'\t\t',
									'msgid "baz"',
									'   ',
									'msgstr "qux"',
									'msgid "hello"',
									'  \t\t \r',
									'msgstr "world"',
									'',
									'   '
								].join ('\n'),
								{
									foo:'bar',
									baz:'qux',
									hello:'world'
								}
							]

					]],
					['Uize.Loc.FileFormats.Po.to',[
						['Serializing an empty strings object produces an empty string as a result',
							Uize.clone (_stringsNoStrings),
							_fileNoStrings
						],
						['A strings object containing only a single string can be serialized',
							Uize.clone (_stringsOneString),
							_fileOneString
						],
						['A strings object containing multiple strings can be serialized',
							Uize.clone (_stringsMultipleStrings),
							_fileMultipleStrings
						],
						['A strings object may contain string values that are arrays, and these values are treated as plural variants and serialized using the PO format\'s approach for representing plural forms',
							Uize.clone (_stringsPluralVariants),
							_filePluralVariants
						]
					]]
				])
			]
		});
	}
});

