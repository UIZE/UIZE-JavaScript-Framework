/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Parse.Xml.TagAttributeValue Class
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
		The =Uize.Test.Uize.Parse.Xml.TagAttributeValue= module defines a suite of unit tests for the =Uize.Parse.Xml.TagAttributeValue= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Parse.Xml.TagAttributeValue',
	superclass:'Uize.Test.ParserTest',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticProperties:{parserClass:'Uize.Parse.Xml.TagAttributeValue'},

			set:{
				title:'Test for Uize.Parse.Xml.TagAttributeValue Module',
				test:[
					Uize.Test.requiredModulesTest ('Uize.Parse.Xml.TagAttributeValue'),
					{
						title:'A tag attribute value can be parsed',
						test:[
							Uize.Test.ParserTest.parserTest (
								'A tag attribute value can be empty',
								['""'],
								{
									value:'',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A tag attribute value containing contents can be parsed',
								['"some attribute value"'],
								{
									value:'some attribute value',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A quote-enclosed tag attribute value must be terminated by a quote character in order to be valid',
								['"foo'],
								{
									value:'',
									isValid:false
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A quote-enclosed tag attribute value must be terminated by a matching quote character in order to be valid',
								['"foo\''],
								{
									value:'',
									isValid:false
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A quote-enclosed tag attribute value is terminated by the first matching quote character',
								['"foo" bar'],
								{
									value:'foo',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A tag attribute value may be enclosed in single quotes',
								['\'some attribute value\''],
								{
									value:'some attribute value',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'If a tag attribute value does not start with a quote character, then it is terminated at the first whitespace character, if that whitespace character occurs before the first ">" character',
								['foo bar> baz qux'],
								{
									value:'foo',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'If a tag attribute value does not start with a quote character, then it is terminated at the first ">" character, if that ">" character occurs before the first whitespace character',
								['foo>bar baz qux'],
								{
									value:'foo',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'If a tag attribute value starts with a whitespace character, it is immediately terminated and treated as being empty',
								[' foo bar baz qux'],
								{
									value:'',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A tag attribute value may contain linebreaks and other whitespace characters, and such characters are treated as literal text that is part of the contents of that tag attribute value',
								['"Line 1\nLine 2\rLine 3\r\n\t\tLine 4"'],
								{
									value:'Line 1\nLine 2\rLine 3\r\n\t\tLine 4',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A tag attribute value may contain character entity escape sequences, and such escape sequences are unescaped',
								['"&amp;&quot;&lt;&gt;&#216;"'],
								{
									value:'&"<>Ø',
									isValid:true
								}
							)
						]
					},
					{
						title:'A tag attribute value can be serialized',
						test:[
							Uize.Test.ParserTest.serializerTest (
								'A tag attribute value with no contents is serialized correctly',
								{
									value:'',
									isValid:true
								},
								'""'
							),
							Uize.Test.ParserTest.serializerTest (
								'A tag attribute value with some contents is serialized correctly',
								{
									value:'some attribute value',
									isValid:true
								},
								'"some attribute value"'
							),
							Uize.Test.ParserTest.serializerTest (
								'XML encoding is performed on the contents of an attribute value when it is serialized',
								{
									value:'&"<>Ø',
									isValid:true
								},
								'"&amp;&quot;&lt;&gt;Ø"'
							),
							Uize.Test.ParserTest.serializerTest (
								'Linebreak characters inside a tag attribute value are XML encoded when the value is serialized',
								{
									value:'Line 1\nLine 2\rLine 3\r\n\t\tLine 4',
									isValid:true
								},
								'"Line 1&#10;Line 2&#13;Line 3&#13;&#10;\t\tLine 4"'
							)
						]
					}
				]
			}
		});
	}
});

