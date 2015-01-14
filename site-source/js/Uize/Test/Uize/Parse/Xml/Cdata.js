/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Parse.Xml.Cdata Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2015 UIZE
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
		The =Uize.Test.Uize.Parse.Xml.Cdata= module defines a suite of unit tests for the =Uize.Parse.Xml.Cdata= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Parse.Xml.Cdata',
	superclass:'Uize.Test.ParserTest',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticProperties:{parserClass:'Uize.Parse.Xml.Cdata'},

			set:{
				title:'Test for Uize.Parse.Xml.Cdata Module',
				test:[
					Uize.Test.requiredModulesTest ('Uize.Parse.Xml.Cdata'),
					{
						title:'A CDATA section can be parsed',
						test:[
							Uize.Test.ParserTest.parserTest (
								'A CDATA section can be empty',
								['<![CDATA[]]>'],
								{
									cdata:'',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A CDATA section containing contents can be parsed',
								['<![CDATA[some CDATA content]]>'],
								{
									cdata:'some CDATA content',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A CDATA section must be terminated in order to be valid',
								['<![CDATA['],
								{
									cdata:'',
									isValid:false
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A CDATA section is terminated by the first "]]>" character sequence',
								['<![CDATA[foo]]>]]>'],
								{
									cdata:'foo',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A CDATA starting character sequence inside a CDATA section is treated as literal text that is part of the contents of that CDATA section',
								['<![CDATA[foo<![CDATA[bar]]>'],
								{
									cdata:'foo<![CDATA[bar',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'XML syntax tags that occur inside a CDATA section are treated as literal text that is part of the contents of that CDATA section',
								['<![CDATA[<foo><bar>baz</bar></foo>]]>'],
								{
									cdata:'<foo><bar>baz</bar></foo>',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A CDATA section may contain linebreaks and other whitespace characters, and such characters are treated as literal text that is part of the contents of that CDATA section',
								['<![CDATA[Line 1\bLine 2\rLine 3\r\n\t\tLine 4]]>'],
								{
									cdata:'Line 1\bLine 2\rLine 3\r\n\t\tLine 4',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A CDATA section may contain character entity escape sequences, and such characters are treated as literal text that is part of the contents of that CDATA section',
								['<![CDATA[&amp;&quot;&lt;&gt;&#2310;]]>'],
								{
									cdata:'&amp;&quot;&lt;&gt;&#2310;',
									isValid:true
								}
							)
						]
					},
					{
						title:'A CDATA section can be serialized',
						test:[
							Uize.Test.ParserTest.serializerTest (
								'A CDATA section with no contents is serialized correctly',
								{
									cdata:'',
									isValid:true
								},
								'<![CDATA[]]>'
							),
							Uize.Test.ParserTest.serializerTest (
								'No XML encoding is performed on the contents of a CDATA section when it is serialized',
								{
									cdata:'<foo><bar>baz & "qux"</bar></foo>',
									isValid:true
								},
								'<![CDATA[<foo><bar>baz & "qux"</bar></foo>]]>'
							)
						]
					}
				]
			}
		});
	}
});

