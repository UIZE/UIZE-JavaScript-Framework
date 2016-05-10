/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Parse.JavaProperties.Document Class
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
		The =Uize.Test.Uize.Parse.JavaProperties.Document= module defines a suite of unit tests for the =Uize.Parse.JavaProperties.Document= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Parse.JavaProperties.Document',
	superclass:'Uize.Test.ParserTest',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticProperties:{parserClass:'Uize.Parse.JavaProperties.Document'},

			set:{
				title:'Test for Uize.Parse.JavaProperties.Document Module',
				test:[
					Uize.Test.requiredModulesTest ('Uize.Parse.JavaProperties.Document'),
					{
						title:'A Java properties document can be parsed',
						test:[
							Uize.Test.ParserTest.parserTest (
								'A document may be empty',
								[''],
								{
									items:{length:0},
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A document may contain just one property',
								['PropertyName=PropertyValue'],
								{
									items:{
										0:{
											name:{name:'PropertyName',isValid:true},
											value:{value:'PropertyValue',isValid:true}
										},
										length:1
									},
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A document may contain multiple properties separated by linebreak characters',
								[
									[
										'Property1Name=Property1Value',
										'Property2Name=Property2Value',
										'Property3Name=Property3Value'
									].join ('\n')
								],
								{
									items:{
										0:{
											name:{name:'Property1Name',isValid:true},
											value:{value:'Property1Value',isValid:true}
										},
										1:{whitespace:'\n'},
										2:{
											name:{name:'Property2Name',isValid:true},
											value:{value:'Property2Value',isValid:true}
										},
										3:{whitespace:'\n'},
										4:{
											name:{name:'Property3Name',isValid:true},
											value:{value:'Property3Value',isValid:true}
										},
										length:5
									},
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A document may contain a mix of linebreak and carriage return characters as line terminators',
								[
									'Property1Name=Property1Value\n' +
									'Property2Name=Property2Value\r\n' +
									'Property3Name=Property3Value\r' +
									'Property4Name=Property4Value'
								],
								{
									items:{
										0:{
											name:{name:'Property1Name',isValid:true},
											value:{value:'Property1Value',isValid:true}
										},
										1:{whitespace:'\n'},
										2:{
											name:{name:'Property2Name',isValid:true},
											value:{value:'Property2Value',isValid:true}
										},
										3:{whitespace:'\r\n'},
										4:{
											name:{name:'Property3Name',isValid:true},
											value:{value:'Property3Value',isValid:true}
										},
										5:{whitespace:'\r'},
										6:{
											name:{name:'Property4Name',isValid:true},
											value:{value:'Property4Value',isValid:true}
										},
										length:7
									},
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'Multiple blank lines between properties are collapsed into items of contiguous whitespace',
								[
									[
										'',
										'Property1Name=Property1Value',
										'',
										'',
										'Property2Name=Property2Value',
										'',
										'',
										'',
										'Property3Name=Property3Value',
										'',
										''
									].join ('\n')
								],
								{
									items:{
										0:{whitespace:'\n'},
										1:{
											name:{name:'Property1Name',isValid:true},
											value:{value:'Property1Value',isValid:true}
										},
										2:{whitespace:'\n\n\n'},
										3:{
											name:{name:'Property2Name',isValid:true},
											value:{value:'Property2Value',isValid:true}
										},
										4:{whitespace:'\n\n\n\n'},
										5:{
											name:{name:'Property3Name',isValid:true},
											value:{value:'Property3Value',isValid:true}
										},
										6:{whitespace:'\n\n'},
										length:7
									},
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A document may contain a mix of single line comments starting with "#" (pound) or "!" (exclamation mark) characters',
								[
									[
										'#comment number 1',
										'#comment number 2',
										'!comment number 3'
									].join ('\n')
								],
								{
									items:{
										0:{comment:'comment number 1',isValid:true},
										1:{whitespace:'\n'},
										2:{comment:'comment number 2',isValid:true},
										3:{whitespace:'\n'},
										4:{comment:'comment number 3',isValid:true},
										length:5
									},
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'Multiple blank lines between comments are collapsed into items of contiguous whitespace',
								[
									[
										'',
										'',
										'#comment number 1',
										'',
										'#comment number 2',
										'',
										'',
										'',
										'!comment number 3',
										'',
										''
									].join ('\n')
								],
								{
									items:{
										0:{whitespace:'\n\n'},
										1:{comment:'comment number 1',isValid:true},
										2:{whitespace:'\n\n'},
										3:{comment:'comment number 2',isValid:true},
										4:{whitespace:'\n\n\n\n'},
										5:{comment:'comment number 3',isValid:true},
										6:{whitespace:'\n\n'},
										length:7
									},
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A document may contain a mix of properties and comments',
								[
									[
										'',
										'Property1Name=Property1Value',
										'',
										'#comment number 1',
										'',
										'#comment number 2',
										'',
										'',
										'',
										'Property2Name : Property2Value',
										'!comment number 3',
										'    Property3Name:Property3Value',
										'',
										''
									].join ('\n')
								],
								{
									items:{
										0:{whitespace:'\n'},
										1:{
											name:{name:'Property1Name',isValid:true},
											value:{value:'Property1Value',isValid:true}
										},
										2:{whitespace:'\n\n'},
										3:{comment:'comment number 1',isValid:true},
										4:{whitespace:'\n\n'},
										5:{comment:'comment number 2',isValid:true},
										6:{whitespace:'\n\n\n\n'},
										7:{
											name:{name:'Property2Name',isValid:true},
											value:{value:'Property2Value',isValid:true}
										},
										8:{whitespace:'\n'},
										9:{comment:'comment number 3',isValid:true},
										10:{whitespace:'\n    '},
										11:{
											name:{name:'Property3Name',isValid:true},
											value:{value:'Property3Value',isValid:true}
										},
										12:{whitespace:'\n\n'},
										length:13
									},
									isValid:true
								}
							)
						]
					},
					Uize.Test.ParserTest.serializerTest (
						'A Java properties document can be serialized',
						[
							'',
							'Property1Name=Property1Value',
							'',
							'#comment number 1',
							'',
							'#comment number 2',
							'',
							'',
							'',
							'Property2Name : Property2Value',
							'!comment number 3',
							'    Property3Name:Property3Value',
							'',
							''
						].join ('\n'),
						[
							'',
							'Property1Name=Property1Value',
							'',
							'#comment number 1',
							'',
							'#comment number 2',
							'',
							'',
							'',
							'Property2Name=Property2Value',
							'#comment number 3',
							'    Property3Name=Property3Value',
							'',
							''
						].join ('\n')
					)
				]
			}
		});
	}
});

