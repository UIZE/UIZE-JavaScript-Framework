/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Parse.Xml.Comment Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 3
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Parse.Xml.Comment= module defines a suite of unit tests for the =Uize.Parse.Xml.Comment= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Parse.Xml.Comment',
	superclass:'Uize.Test.ParserTest',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticProperties:{parserClass:'Uize.Parse.Xml.Comment'},

			set:{
				title:'Test for Uize.Parse.Xml.Comment Module',
				test:[
					Uize.Test.requiredModulesTest ('Uize.Parse.Xml.Comment'),
					{
						title:'A comment section can be parsed',
						test:[
							Uize.Test.ParserTest.parserTest (
								'A comment section can be empty',
								['<!---->'],
								{
									comment:'',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A comment section containing contents can be parsed',
								['<!--some comment content-->'],
								{
									comment:'some comment content',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A comment section must be terminated in order to be valid',
								['<!--foo'],
								{
									comment:'',
									isValid:false
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A comment section is terminated by the first "-->" character sequence',
								['<!--foo-->-->'],
								{
									comment:'foo',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A comment starting character sequence inside a comment section is treated as literal text that is part of the contents of that comment section',
								['<!--foo<!--bar-->'],
								{
									comment:'foo<!--bar',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'XML syntax tags that occur inside a comment section are treated as literal text that is part of the contents of that comment section',
								['<!--<foo><bar>baz</bar></foo>-->'],
								{
									comment:'<foo><bar>baz</bar></foo>',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A comment section may contain linebreaks and other whitespace characters, and such characters are treated as literal text that is part of the contents of that comment section',
								['<!--Line 1\bLine 2\rLine 3\r\n\t\tLine 4-->'],
								{
									comment:'Line 1\bLine 2\rLine 3\r\n\t\tLine 4',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A comment section may contain character entity escape sequences, and such characters are treated as literal text that is part of the contents of that comment section',
								['<!--&amp;&quot;&lt;&gt;&#2310;-->'],
								{
									comment:'&amp;&quot;&lt;&gt;&#2310;',
									isValid:true
								}
							)
						]
					},
					{
						title:'A comment section can be serialized',
						test:[
							Uize.Test.ParserTest.serializerTest (
								'A comment section with no contents is serialized correctly',
								{
									comment:'',
									isValid:true
								},
								'<!---->'
							),
							Uize.Test.ParserTest.serializerTest (
								'No XML encoding is performed on the contents of a comment section when it is serialized',
								{
									comment:'<foo><bar>baz & "qux"</bar></foo>',
									isValid:true
								},
								'<!--<foo><bar>baz & "qux"</bar></foo>-->'
							)
						]
					}
				]
			}
		});
	}
});

