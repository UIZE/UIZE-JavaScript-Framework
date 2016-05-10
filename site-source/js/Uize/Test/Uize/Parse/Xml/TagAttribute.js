/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Parse.Xml.TagAttribute Class
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
		The =Uize.Test.Uize.Parse.Xml.TagAttribute= module defines a suite of unit tests for the =Uize.Parse.Xml.TagAttribute= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Parse.Xml.TagAttribute',
	superclass:'Uize.Test.ParserTest',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticProperties:{parserClass:'Uize.Parse.Xml.TagAttribute'},

			set:{
				title:'Test for Uize.Parse.Xml.TagAttribute Module',
				test:[
					Uize.Test.requiredModulesTest ('Uize.Parse.Xml.TagAttribute'),
					{
						title:'A tag attribute can be parsed',
						test:[
							Uize.Test.ParserTest.parserTest (
								'An empty string is not a valid tag attribute',
								[''],
								{
									isValid:false,
									length:0
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A tag attribute may not begin with whitespace',
								[' foo="bar"'],
								{
									isValid:false,
									length:0
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A tag attribute may consist of only an attribute name',
								['foo bar="baz"'],
								{
									isValid:true,
									name:{
										isValid:true,
										name:'foo'
									},
									value:{
										isValid:true,
										value:''
									}
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A tag attribute may consist of an attribute name and an attribute value, separated by "=" character',
								['foo="bar"'],
								{
									isValid:true,
									name:{
										isValid:true,
										name:'foo'
									},
									value:{
										isValid:true,
										value:'bar'
									}
								}
							),
							Uize.Test.ParserTest.parserTest (
								'Whitespace padding around the "=" character that separates a tag attribute\'s name and value is ignored',
								['foo  \r \r\n \t = \n\t  "bar"'],
								{
									isValid:true,
									name:{
										isValid:true,
										name:'foo'
									},
									value:{
										isValid:true,
										value:'bar'
									}
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A tag attribute\'s value may optionally be bare (not enclosed in quotes), in which case the value is terminated at the first whitespace character encountered',
								['foo=bar baz=qux'],
								{
									isValid:true,
									name:{
										isValid:true,
										name:'foo'
									},
									value:{
										isValid:true,
										value:'bar'
									}
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A tag attribute\'s value may optionally be bare (not enclosed in quotes) and is started by the first non-whitespace character encountered, and then is terminated by the first whitespace character encountered thereafter',
								['foo  \r \r\n \t = \n\t  bar baz=qux'],
								{
									isValid:true,
									name:{
										isValid:true,
										name:'foo'
									},
									value:{
										isValid:true,
										value:'bar'
									}
								}
							),
							Uize.Test.ParserTest.parserTest (
								'When a tag attribute\'s value is bare (not enclosed in quotes), it is terminated by a ">" character',
								['foo=bar>baz'],
								{
									isValid:true,
									name:{
										isValid:true,
										name:'foo'
									},
									value:{
										isValid:true,
										value:'bar'
									}
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A tag attribute\'s name may contain an optional namespace part',
								['foo:bar="baz"'],
								{
									isValid:true,
									name:{
										isValid:true,
										name:'bar',
										namespace:'foo'
									},
									value:{
										isValid:true,
										value:'baz'
									}
								}
							)
						]
					},
					{
						title:'A tag attribute can be serialized',
						test:[
							Uize.Test.ParserTest.serializerTest (
								'A tag attribute is serialized correctly',
								{
									isValid:true,
									name:{
										isValid:true,
										name:'bar',
										namespace:'foo'
									},
									value:{
										isValid:true,
										value:'"baz\nqux"'
									}
								},
								'foo:bar="&quot;baz&#10;qux&quot;"'
							)
						]
					}
				]
			}
		});
	}
});

