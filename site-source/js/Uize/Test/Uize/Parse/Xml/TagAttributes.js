/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Parse.Xml.TagAttributes Class
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
		The =Uize.Test.Uize.Parse.Xml.TagAttributes= module defines a suite of unit tests for the =Uize.Parse.Xml.TagAttributes= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Parse.Xml.TagAttributes',
	superclass:'Uize.Test.ParserTest',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticProperties:{parserClass:'Uize.Parse.Xml.TagAttributes'},

			set:{
				title:'Test for Uize.Parse.Xml.TagAttributes Module',
				test:[
					Uize.Test.requiredModulesTest ('Uize.Parse.Xml.TagAttributes'),
					{
						title:'A tag attributes list can be parsed',
						test:[
							Uize.Test.ParserTest.parserTest (
								'A tag attributes list may contain no attributes',
								[''],
								{
									isValid:true,
									length:0,
									attributes:{
										length:0
									}
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A tag attributes list may contain just a single attribute',
								['foo="bar"'],
								{
									isValid:true,
									attributes:{
										0:{
											isValid:true,
											name:{
												isValid:true,
												name:'foo'
											},
											value:{
												isValid:true,
												value:'bar'
											}
										},
										length:1
									}
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A tag attributes list is terminated by the first character sequence that is not a valid tag attribute character sequence',
								['foo="bar"><baz hello="world"></baz>'],
								{
									isValid:true,
									attributes:{
										0:{
											isValid:true,
											name:{
												isValid:true,
												name:'foo'
											},
											value:{
												isValid:true,
												value:'bar'
											}
										},
										length:1
									}
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A tag attributes list may contain multiple attributes',
								['foo="bar" baz="qux" hello="world"'],
								{
									isValid:true,
									attributes:{
										0:{
											isValid:true,
											name:{
												isValid:true,
												name:'foo'
											},
											value:{
												isValid:true,
												value:'bar'
											}
										},
										1:{
											isValid:true,
											name:{
												isValid:true,
												name:'baz'
											},
											value:{
												isValid:true,
												value:'qux'
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
								}
							),

							/*** test shitespace handling ***/
								Uize.Test.ParserTest.parserTest (
									'Any leading and trailing whitespace in a tag attributes list is ignored',
									[' \r\n \t foo="bar" \r\n \t '],
									{
										isValid:true,
										attributes:{
											0:{
												isValid:true,
												name:{
													isValid:true,
													name:'foo'
												},
												value:{
													isValid:true,
													value:'bar'
												}
											},
											length:1
										}
									}
								),
								Uize.Test.ParserTest.parserTest (
									'Attributes in a tag attributes list may be separated by arbitrary amounts of whitespace, including linebreak characters',
									['foo="bar" \r\n baz="qux" \t\t \n  \thello="world"'],
									{
										isValid:true,
										attributes:{
											0:{
												isValid:true,
												name:{
													isValid:true,
													name:'foo'
												},
												value:{
													isValid:true,
													value:'bar'
												}
											},
											1:{
												isValid:true,
												name:{
													isValid:true,
													name:'baz'
												},
												value:{
													isValid:true,
													value:'qux'
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
									}
								)
						]
					},
					{
						title:'A tag attributes list can be serialized',
						test:[
							Uize.Test.ParserTest.serializerTest (
								'A tag attributes list containing no attributes is serialized to an empty string',
								{
									isValid:true,
									length:0,
									attributes:{
										length:0
									}
								},
								''
							),
							Uize.Test.ParserTest.serializerTest (
								'A tag attributes list containing a single attribute is serialized correctly',
								' foo = "bar" ',
								'foo="bar"'
							),
							Uize.Test.ParserTest.serializerTest (
								'A tag attributes list containing multiple attributes is serialized correctly',
								' foo = "bar" baz = qux hello=world',
								'foo="bar" baz="qux" hello="world"'
							)
						]
					}
				]
			}
		});
	}
});

