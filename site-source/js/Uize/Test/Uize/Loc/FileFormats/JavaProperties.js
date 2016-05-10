/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Loc.FileFormats.JavaProperties Class
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
		The =Uize.Test.Uize.Loc.FileFormats.JavaProperties= module defines a suite of unit tests for the =Uize.Loc.FileFormats.JavaProperties= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Loc.FileFormats.JavaProperties',
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
				_fileOneString = 'foo=bar',

			/*** multiple strings ***/
				_stringsMultipleStrings = {
					foo:'bar',
					baz:'qux',
					hello:'world'
				},
				_fileMultipleStrings =
					'foo=bar\n' +
					'baz=qux\n' +
					'hello=world',

			/*** special characters ***/
				_stringsSpecialCharacters = {
					Submit:'[Šûƀɱîţ_]',
					Cancel:'[Çåñçéļ_]'
				},
				_fileSpecialCharacters =
					'Submit=[\\u0160û\\u0180\\u0271î\\u0163_]\n' +
					'Cancel=[Çåñçé\\u013C_]'
		;

		return Uize.Test.resolve ({
			title:'Uize.Loc.FileFormats.JavaProperties Module Test',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Loc.FileFormats.JavaProperties'),
				Uize.Test.staticMethodsTest ([
					['Uize.Loc.FileFormats.JavaProperties.from',[
						['Parsing an empty string produces an empty strings object',
							_fileNoStrings,
							Uize.clone (_stringsNoStrings)
						],
						['Parsing a Java properties file containing a single property produces a strings object with just a single entry for that property',
							_fileOneString,
							Uize.clone (_stringsOneString)
						],
						['Parsing a Java properties file containing multiple properties produces a strings object with string entries for all of those properties',
							_fileMultipleStrings,
							Uize.clone (_stringsMultipleStrings)
						],
						['Non-ASCII characters that are Unicode-escaped inside property values are unescaped correctly when producing the parsed strings object',
							_fileSpecialCharacters,
							Uize.clone (_stringsSpecialCharacters)
						],

						/*** test support for comments ***/
							['A Java properties file may contain single line comments that start with a "#" character, and these comments are ignored during parsing when producing the strings object',
								[
									'# comment 1',
									'foo=bar',
									'# comment 2',
									'baz=qux',
									'hello=world',
									'# comment 3'
								].join ('\n'),
								{
									foo:'bar',
									baz:'qux',
									hello:'world'
								}
							],
							['A Java properties file may contain a mixture of different styles of single line comments, some starting with a "#" character and some starting with a "!" character',
								[
									'# comment 1',
									'foo=bar',
									'! comment 2',
									'baz=qux',
									'# comment 3',
									'hello=world',
									'! comment 4'
								].join ('\n'),
								{
									foo:'bar',
									baz:'qux',
									hello:'world'
								}
							],

						/*** test support for whitespace handling ***/
							['When parsing a Java properties file, whitespace padding around the name-value delimiter is ignored and is not included in either the names or values',
								[
									'foo \t=bar',
									'baz=\t qux',
									'hello \t = \t world'
								].join ('\n'),
								{
									foo:'bar',
									baz:'qux',
									hello:'world'
								}
							],
							['Lines of a Java properties file may be separated using a mixture of different types of linebreak characters',
								'foo=bar\n' +
								'baz=qux\r' +
								'hello=world\r\n' +
								'apple=orange',
								{
									foo:'bar',
									baz:'qux',
									hello:'world',
									apple:'orange'
								}
							],
							['Extra blank lines between property entries in a Java properties file are ignored',
								'foo=bar\n\n\n\n' +
								'baz=qux\n\n\n' +
								'hello=world',
								{
									foo:'bar',
									baz:'qux',
									hello:'world'
								}
							],
							['Names of properties inside a Java properties file may contain spaces if those spaces are backslash-escaped',
								'foo\\ bar\\ baz=qux',
								{
									'foo bar baz':'qux'
								}
							],
							['Values of properties inside a Java properties file may span multiple lines, if the linebreaks that break the value over multiple lines are backslash-escaped, and leading whitespace on the continuation lines is ignored',
								'foo=bar\\\n   baz\\\n\t \tqux',
								{
									'foo':'barbazqux'
								}
							]
					]],
					['Uize.Loc.FileFormats.JavaProperties.to',[
						['Serializing an empty strings object produces an empty string as a result',
							Uize.clone (_stringsNoStrings),
							_fileNoStrings
						],
						['Serializing a strings object containing just a single string produces a Java properties file containing just one entry for that sring',
							Uize.clone (_stringsOneString),
							_fileOneString
						],
						['Serializing a strings object containing multiple strings produces a Java properties file containing property entries for all of those strings',
							Uize.clone (_stringsMultipleStrings),
							_fileMultipleStrings
						],
						['Non-ASCII characters inside strings values are Unicode-escaped when serialized as properties inside a Java properties file',
							Uize.clone (_stringsSpecialCharacters),
							_fileSpecialCharacters
						]
					]]
				])
			]
		});
	}
});

