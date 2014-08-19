/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Parse.JavaProperties.Document Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
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
										1:{
											name:{name:'Property2Name',isValid:true},
											value:{value:'Property2Value',isValid:true}
										},
										2:{
											name:{name:'Property3Name',isValid:true},
											value:{value:'Property3Value',isValid:true}
										},
										length:3
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
										1:{
											name:{name:'Property2Name',isValid:true},
											value:{value:'Property2Value',isValid:true}
										},
										2:{
											name:{name:'Property3Name',isValid:true},
											value:{value:'Property3Value',isValid:true}
										},
										3:{
											name:{name:'Property4Name',isValid:true},
											value:{value:'Property4Value',isValid:true}
										},
										length:4
									},
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'Blank lines between properties are ignored',
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
										0:{
											name:{name:'Property1Name',isValid:true},
											value:{value:'Property1Value',isValid:true}
										},
										1:{
											name:{name:'Property2Name',isValid:true},
											value:{value:'Property2Value',isValid:true}
										},
										2:{
											name:{name:'Property3Name',isValid:true},
											value:{value:'Property3Value',isValid:true}
										},
										length:3
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
										1:{comment:'comment number 2',isValid:true},
										2:{comment:'comment number 3',isValid:true},
										length:3
									},
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'Blank lines around comments are ignored',
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
										0:{comment:'comment number 1',isValid:true},
										1:{comment:'comment number 2',isValid:true},
										2:{comment:'comment number 3',isValid:true},
										length:3
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
										0:{
											name:{name:'Property1Name',isValid:true},
											value:{value:'Property1Value',isValid:true}
										},
										1:{comment:'comment number 1',isValid:true},
										2:{comment:'comment number 2',isValid:true},
										3:{
											name:{name:'Property2Name',isValid:true},
											value:{value:'Property2Value',isValid:true}
										},
										4:{comment:'comment number 3',isValid:true},
										5:{
											name:{name:'Property3Name',isValid:true},
											value:{value:'Property3Value',isValid:true}
										},
										length:6
									},
									isValid:true
								}
							)
						]
					},
					{
						title:'A Java properties document can be serialized',
						test:function () {
							return this.expect (
								[
									'Property1Name=Property1Value',
									'#comment number 1',
									'#comment number 2',
									'Property2Name=Property2Value',
									'#comment number 3',
									'Property3Name=Property3Value'
								].join ('\n'),
								new Uize.Parse.JavaProperties.Document (
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
								).serialize ()
							);
						}
					}
				]
			}
		});
	}
});

