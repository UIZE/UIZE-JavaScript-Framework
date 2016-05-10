/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Parse.Po.Value Class
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
		The =Uize.Test.Uize.Parse.Po.Value= module defines a suite of unit tests for the =Uize.Parse.Po.Value= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Parse.Po.Value',
	superclass:'Uize.Test.ParserTest',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticProperties:{parserClass:'Uize.Parse.Po.Value'},

			set:{
				title:'Test for Uize.Parse.Po.Value Module',
				test:[
					Uize.Test.requiredModulesTest ('Uize.Parse.Po.Value'),
					{
						title:'A value can be parsed',
						test:[
							Uize.Test.ParserTest.parserTest (
								'A value can be specified as a C-style string literal',
								['"foo"'],
								{
									value:'foo',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A value can be specified as multiple consecutive C-style string literals, separated by optional whitespace, which are treated as multiple parts of the same value and are concatenated together',
								['"foo" " bar"" baz " \n\n\n"qux"\n\n\n  '],
								{
									value:'foo bar baz qux',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A value must start with a quote character',
								['\n"foo"'],
								{
									value:'',
									isValid:false
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A value does not consume the trailing whitespace after the last part',
								['"foo"\n" bar"\n" baz"\n\n\n    \t\t\t  \r'],
								{
									value:'foo bar baz',
									isValid:true,
									length:19
								}
							)
						]
					},
					{
						title:'A value can be serialized',
						test:[
							Uize.Test.ParserTest.serializerTest (
								'A value is serialized as a C-style string literal',
								{
									value:'foo',
									isValid:true
								},
								'"foo"'
							),
							Uize.Test.ParserTest.serializerTest (
								'Special characters inside a value are escaped with a backslash',
								{
									value:'foo "bar" \n\r baz',
									isValid:true
								},
								'"foo \\"bar\\" \\n\\r baz"'
							)
						]
					}
				]
			}
		});
	}
});

