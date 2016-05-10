/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Parse.Xml.NodeList Class
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
		The =Uize.Test.Uize.Parse.Xml.NodeList= module defines a suite of unit tests for the =Uize.Parse.Xml.NodeList= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Parse.Xml.NodeList',
	superclass:'Uize.Test.ParserTest',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticProperties:{parserClass:'Uize.Parse.Xml.NodeList'},

			set:{
				title:'Test for Uize.Parse.Xml.NodeList Module',
				test:[
					Uize.Test.requiredModulesTest ('Uize.Parse.Xml.NodeList'),
					{
						title:'A node list can be parsed',
						test:[
							Uize.Test.ParserTest.parserTest (
								'A node list may contain no nodes',
								[''],
								{
									isValid:true,
									length:0,
									nodes:{
										length:0
									}
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A node list may contain just a single text node',
								['this is some text'],
								{
									isValid:true,
									nodes:{
										0:{
											isValid:true,
											text:'this is some text'
										},
										length:1
									}
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A node list may contain just a single comment node',
								['<!--this is a comment-->'],
								{
									isValid:true,
									nodes:{
										0:{
											isValid:true,
											comment:'this is a comment'
										},
										length:1
									}
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A node list may contain just a single CDATA node',
								['<![CDATA[this is a CDATA section]]>'],
								{
									isValid:true,
									nodes:{
										0:{
											isValid:true,
											cdata:'this is a CDATA section'
										},
										length:1
									}
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A node list may contain just a single tag node',
								['<foo bar="baz"></foo>'],
								{
									isValid:true,
									nodes:{
										0:{
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
										length:1
									}
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A node list may contain a mixture of multiple different types of nodes',
								['text node 1<!--this is a comment-->text node 2<![CDATA[this is a CDATA section]]>text node 3<foo bar="baz"></foo>text node 4'],
								{
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
							),
							Uize.Test.ParserTest.parserTest (
								'A node list may contain a multiple consecutive nodes of the same type',
								['<!--comment 1--><!--comment 2--><![CDATA[CDATA section 1]]><![CDATA[CDATA section 2]]>'],
								{
									isValid:true,
									nodes:{
										0:{
											isValid:true,
											comment:'comment 1'
										},
										1:{
											isValid:true,
											comment:'comment 2'
										},
										2:{
											isValid:true,
											cdata:'CDATA section 1'
										},
										3:{
											isValid:true,
											cdata:'CDATA section 2'
										},
										length:4
									}
								}
							)
						]
					},
					{
						title:'A node list can be serialized',
						test:[
							Uize.Test.ParserTest.serializerTest (
								'A node list containing no nodes is serialized to an empty string',
								{
									isValid:true,
									length:0,
									nodes:{
										length:0
									}
								},
								''
							),
							Uize.Test.ParserTest.serializerTest (
								'A node list containing a single node is serialized correctly',
								'<!--comment 1-->',
								'<!--comment 1-->'
							),
							Uize.Test.ParserTest.serializerTest (
								'A node list containing multiple nodes is serialized correctly',
								'text node 1<!--this is a comment-->text node 2<![CDATA[this is a CDATA section]]>text node 3<foo bar="baz"></foo>text node 4',
								'text node 1<!--this is a comment-->text node 2<![CDATA[this is a CDATA section]]>text node 3<foo bar="baz"></foo>text node 4'
							)
						]
					}
				]
			}
		});
	}
});

