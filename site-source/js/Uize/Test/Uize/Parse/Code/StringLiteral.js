/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Parse.Code.StringLiteral Class
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
		The =Uize.Test.Uize.Parse.Code.StringLiteral= module defines a suite of unit tests for the =Uize.Parse.Code.StringLiteral= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Parse.Code.StringLiteral',
	superclass:'Uize.Test.ParserTest',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticProperties:{parserClass:'Uize.Parse.Code.StringLiteral'},

			set:{
				title:'Test for Uize.Parse.Code.StringLiteral Module',
				test:[
					Uize.Test.requiredModulesTest ('Uize.Parse.Code.StringLiteral'),
					{
						title:'A string literal can be parsed',
						test:[
							Uize.Test.ParserTest.parserTest (
								'An empty string enclosed in double quotes is an empty string literal',
								['""'],
								{
									isValid:true,
									value:''
								}
							),
							Uize.Test.ParserTest.parserTest (
								'An empty string enclosed in single quotes is an empty string literal',
								['\'\''],
								{
									isValid:true,
									value:''
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A string literal containing some text enclosed in double quotes can be parsed',
								['"foo bar baz qux"'],
								{
									isValid:true,
									value:'foo bar baz qux'
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A string literal containing some text enclosed in double quotes can be parsed',
								['\'foo bar baz qux\''],
								{
									isValid:true,
									value:'foo bar baz qux'
								}
							),
							Uize.Test.ParserTest.parserTest (
								'Text that occurs after the terminating enclosing quote is considered extraneous by the parser',
								['"foo" bar baz qux'],
								{
									isValid:true,
									value:'foo'
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A string literal may contain backslash-escaped linebreak characters, single or double quote characters, and backslash characters, and these escape sequences are unescaped by the parser',
								['"\\\\\\n\\r\\"\\\'"'],
								{
									isValid:true,
									value:'\\\n\r"\''
								}
							),
							Uize.Test.ParserTest.parserTest (
								'Backslash-prefixed characters inside a string literal that are not recognized character escape sequences are left as is by the parser',
								['"\\1\\%\\#"'],
								{
									isValid:true,
									value:'\\1\\%\\#'
								}
							),

							/*** tests for invalid string literals ***/
								Uize.Test.ParserTest.parserTest (
									'An empty string is not a valid string literal',
									[''],
									{
										isValid:false,
										length:0
									}
								),
								Uize.Test.ParserTest.parserTest (
									'Text that is not enclosed in single or double quotes is not a valid string literal',
									['foo bar baz qux'],
									{
										isValid:false,
										length:0
									}
								),
								Uize.Test.ParserTest.parserTest (
									'A string literal may not start with whitespace',
									[' "foo"'],
									{
										isValid:false,
										length:0
									}
								),
								Uize.Test.ParserTest.parserTest (
									'A string literal must start with a single or double quote',
									['foo"bar"'],
									{
										isValid:false,
										length:0
									}
								),
								Uize.Test.ParserTest.parserTest (
									'If a string literal is started with a single quote, it must be terminated with a single quote',
									['\'foo bar" baz qux'],
									{
										isValid:false,
										length:0
									}
								),
								Uize.Test.ParserTest.parserTest (
									'If a string literal is started with a double quote, it must be terminated with a double quote',
									['"foo bar\' baz qux'],
									{
										isValid:false,
										length:0
									}
								)
						]
					},
					{
						title:'A string literal can be serialized',
						test:[
							Uize.Test.ParserTest.serializerTest (
								'An empty string can be serialized',
								{
									isValid:true,
									value:''
								},
								'""'
							),
							Uize.Test.ParserTest.serializerTest (
								'A string containing some text can be serialized',
								{
									isValid:true,
									value:'foo bar baz qux'
								},
								'"foo bar baz qux"'
							),
							Uize.Test.ParserTest.serializerTest (
								'When a string contains linebreak characters, double quote characters, or backslash characters, these characters are backslash-escaped by the serializer',
								{
									isValid:true,
									value:'\\\n\r"'
								},
								'"\\\\\\n\\r\\""'
							)
						]
					}
				]
			}
		});
	}
});

