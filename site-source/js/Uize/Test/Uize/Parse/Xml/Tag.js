/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Parse.Xml.Tag Class
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
		The =Uize.Test.Uize.Parse.Xml.Tag= module defines a suite of unit tests for the =Uize.Parse.Xml.Tag= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Parse.Xml.Tag',
	superclass:'Uize.Test.ParserTest',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticProperties:{parserClass:'Uize.Parse.Xml.Tag'},

			set:{
				title:'Test for Uize.Parse.Xml.Tag Module',
				test:[
					Uize.Test.requiredModulesTest ([
						'Uize.Parse.Xml.NodeList',
						'Uize.Parse.Xml.Tag'
					]),
					{
						title:'A tag can be parsed',
						test:[
							Uize.Test.ParserTest.parserTest (
								'A tag may be self-closing',
								['<foo/><bar></bar>'],
								{
									isValid:true,
									tagName:{
										isValid:true,
										name:'foo'
									},
									length:6,
									childNodes:undefined
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A tag may consist of a pair of opening and closing tags',
								['<foo></foo>'],
								{
									isValid:true,
									tagName:{
										isValid:true,
										name:'foo'
									},
									childNodes:{
										isValid:true,
										nodes:{
											length:0
										}
									}
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A self-closing tag may contain whitespace padding around its name',
								['< \n\r \t foo \r \n \t / >'],
								{
									isValid:true,
									tagName:{
										isValid:true,
										name:'foo'
									},
									childNodes:undefined
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A tag that is not self-closing may contain whitespace padding around its name in both the opening and closing tags',
								['< \n\r \t foo \r \n \t >< \t\t \r / \n\n foo \r\t \n >'],
								{
									isValid:true,
									tagName:{
										isValid:true,
										name:'foo'
									},
									childNodes:{
										isValid:true,
										nodes:{
											length:0
										}
									}
								}
							),
							Uize.Test.ParserTest.parserTest (
								'Text after the terminator for a tag is extraneous and is not parsed as part of the tag',
								['<foo/><bar><baz/></bar>'],
								{
									isValid:true,
									tagName:{
										isValid:true,
										name:'foo'
									},
									childNodes:undefined
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A tag may contain a mixture of multiple different types of child nodes',
								['<foo>text node 1<!--this is a comment-->text node 2<![CDATA[this is a CDATA section]]>text node 3<foo bar="baz"></foo>text node 4</foo>'],
								{
									isValid:true,
									tagName:{
										isValid:true,
										name:'foo'
									},
									childNodes:{
										isValid:true,
										nodes:{
											0:{
												isValid:true,
												text:'text node 1'
											},
											1:{
												isValid:true,
												comment:'this is a comment'
											},
											2:{
												isValid:true,
												text:'text node 2'
											},
											3:{
												isValid:true,
												cdata:'this is a CDATA section'
											},
											4:{
												isValid:true,
												text:'text node 3'
											},
											5:{
												isValid:true,
												tagName:{
													isValid:true,
													name:'foo'
												},
												tagAttributes:{
													isValid:true,
													attributes:{
														0:{
															isValid:true,
															name:{
																isValid:true,
																name:'bar'
															},
															value:{
																isValid:true,
																value:'baz'
															}
														},
														length:1
													}
												}
											},
											6:{
												isValid:true,
												text:'text node 4'
											},
											length:7
										}
									}
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A self-closing tag may contain attributes',
								['<foo bar="baz" qux="nux" hello="world"/>'],
								{
									isValid:true,
									tagName:{
										isValid:true,
										name:'foo'
									},
									tagAttributes:{
										isValid:true,
										attributes:{
											0:{
												isValid:true,
												name:{
													isValid:true,
													name:'bar'
												},
												value:{
													isValid:true,
													value:'baz'
												}
											},
											1:{
												isValid:true,
												name:{
													isValid:true,
													name:'qux'
												},
												value:{
													isValid:true,
													value:'nux'
												}
											},
											2:{
												isValid:true,
												name:{
													isValid:true,
													name:'hello'
												},
												value:{
													isValid:true,
													value:'world'
												}
											},
											length:3
										}
									},
									childNodes:undefined
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A paired tag may contain attributes',
								['<foo bar="baz" qux="nux" hello="world"></foo>'],
								{
									isValid:true,
									tagName:{
										isValid:true,
										name:'foo'
									},
									tagAttributes:{
										isValid:true,
										attributes:{
											0:{
												isValid:true,
												name:{
													isValid:true,
													name:'bar'
												},
												value:{
													isValid:true,
													value:'baz'
												}
											},
											1:{
												isValid:true,
												name:{
													isValid:true,
													name:'qux'
												},
												value:{
													isValid:true,
													value:'nux'
												}
											},
											2:{
												isValid:true,
												name:{
													isValid:true,
													name:'hello'
												},
												value:{
													isValid:true,
													value:'world'
												}
											},
											length:3
										}
									},
									childNodes:{
										isValid:true,
										nodes:{
											length:0
										}
									}
								}
							),

							/*** tests for invalid tags ***/
								Uize.Test.ParserTest.parserTest (
									'An empty string is not a valid tag',
									[''],
									{
										isValid:false,
										length:0
									}
								),
								Uize.Test.ParserTest.parserTest (
									'A closing tag is not a valid tag',
									['</foo>'],
									{
										isValid:false,
										length:0
									}
								),
								Uize.Test.ParserTest.parserTest (
									'A tag may not start with whitespace',
									[' <foo></foo>'],
									{
										isValid:false,
										length:0
									}
								),
								Uize.Test.ParserTest.parserTest (
									'A tag is not valid unless it starts with a "<" character',
									['foo<foo></foo>'],
									{
										isValid:false,
										length:0
									}
								),
								Uize.Test.ParserTest.parserTest (
									'A closing tag without a preceding opening tag of the same name is not a valid tag',
									['</foo>'],
									{
										isValid:false,
										length:0
									}
								),
								Uize.Test.ParserTest.parserTest (
									'A tag is not valid if it is missing its tag name',
									['<foo$bar></foo$bar>'],
									{
										isValid:false,
										length:0
									}
								),
								Uize.Test.ParserTest.parserTest (
									'A tag that is not self-closing is not valid if it is not paired with a closing tag',
									['<foo>'],
									{
										isValid:false,
										length:0
									}
								),
								Uize.Test.ParserTest.parserTest (
									'A tag that is not self-closing is not valid if it is not paired with a closing tag of the same name',
									['<foo></bar>'],
									{
										isValid:false,
										length:0
									}
								),
								Uize.Test.ParserTest.parserTest (
									'A tag is not valid if it is overlapped with another tag',
									['<foo><bar></foo></bar>'],
									{
										isValid:false,
										length:0
									}
								)
						]
					},
					{
						title:'A tag can be serialized',
						test:[
							Uize.Test.ParserTest.serializerTest (
								'A tag with undefined child nodes is serialized as a self-closing tag',
								'<foo/>',
								'<foo/>'
							),
							Uize.Test.ParserTest.serializerTest (
								'A tag with zero child nodes is serialized as an empty paired tag',
								'<foo></foo>',
								'<foo></foo>'
							),
							Uize.Test.ParserTest.serializerTest (
								'A tag with a single text child node is serialized correctly',
								'<foo>bar baz</foo>',
								'<foo>bar baz</foo>'
							),
							Uize.Test.ParserTest.serializerTest (
								'A tag with a single comment child node is serialized correctly',
								'<foo><!-- a comment --></foo>',
								'<foo><!-- a comment --></foo>'
							),
							Uize.Test.ParserTest.serializerTest (
								'A tag with a single CDATA child node is serialized correctly',
								'<foo><![CDATA[this is a CDATA section]]></foo>',
								'<foo><![CDATA[this is a CDATA section]]></foo>'
							),
							Uize.Test.ParserTest.serializerTest (
								'A tag with a mixture of multiple different types of child nodes is serialized correctly',
								'<foo>text node 1<!--this is a comment-->text node 2<![CDATA[this is a CDATA section]]>text node 3<foo bar="baz"></foo>text node 4</foo>',
								'<foo>text node 1<!--this is a comment-->text node 2<![CDATA[this is a CDATA section]]>text node 3<foo bar="baz"></foo>text node 4</foo>'
							),
							Uize.Test.ParserTest.serializerTest (
								'A self-closing tag with attributes is serialized correctly',
								'<foo bar="baz" qux="nux" hello="world"/>',
								'<foo bar="baz" qux="nux" hello="world"/>'
							),
							Uize.Test.ParserTest.serializerTest (
								'A paired tag with attributes is serialized correctly',
								'<foo bar="baz" qux="nux" hello="world"></foo>',
								'<foo bar="baz" qux="nux" hello="world"></foo>'
							)
						]
					}
				]
			}
		});
	}
});

