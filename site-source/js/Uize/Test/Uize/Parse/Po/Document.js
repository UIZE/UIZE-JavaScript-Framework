/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Parse.Po.Document Class
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
		The =Uize.Test.Uize.Parse.Po.Document= module defines a suite of unit tests for the =Uize.Parse.Po.Document= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Parse.Po.Document',
	superclass:'Uize.Test.ParserTest',
	builder:function (_superclass) {
		'use strict';

		var _poDocument = [
			'',
			'msgid "foo"',
			'   ',
			'#comment number 1',
			'\t\t',
			'#comment number 2',
			'',
			'',
			'',
			'msgid "bar"',
			'#comment number 3',
			'    msgid "baz"',
			'',
			''
		].join ('\n');

		return _superclass.subclass ({
			staticProperties:{parserClass:'Uize.Parse.Po.Document'},

			set:{
				title:'Test for Uize.Parse.Po.Document Module',
				test:[
					Uize.Test.requiredModulesTest ('Uize.Parse.Po.Document'),
					{
						title:'A PO file can be parsed',
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
								'A document may contain just one name-value pair',
								['msgid "foo"'],
								{
									items:{
										0:{
											name:{name:'msgid',isValid:true},
											value:{value:'foo',isValid:true}
										},
										length:1
									},
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A document may contain multiple name-value pairs separated by linebreak characters',
								[
									[
										'msgid "foo"',
										'msgid "bar"',
										'msgid "baz"'
									].join ('\n')
								],
								{
									items:{
										0:{
											name:{name:'msgid',isValid:true},
											value:{value:'foo',isValid:true}
										},
										1:{
											whitespace:'\n',
											isValid:true
										},
										2:{
											name:{name:'msgid',isValid:true},
											value:{value:'bar',isValid:true}
										},
										3:{
											whitespace:'\n',
											isValid:true
										},
										4:{
											name:{name:'msgid',isValid:true},
											value:{value:'baz',isValid:true}
										},
										length:5
									},
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A document may contain a mix of linebreak and carriage return characters as line terminators',
								[
									'msgid "foo"\n' +
									'msgid "bar"\r\n' +
									'msgid "baz"\r' +
									'msgid "qux"'
								],
								{
									items:{
										0:{
											name:{name:'msgid',isValid:true},
											value:{value:'foo',isValid:true}
										},
										1:{
											whitespace:'\n',
											isValid:true
										},
										2:{
											name:{name:'msgid',isValid:true},
											value:{value:'bar',isValid:true}
										},
										3:{
											whitespace:'\r\n',
											isValid:true
										},
										4:{
											name:{name:'msgid',isValid:true},
											value:{value:'baz',isValid:true}
										},
										5:{
											whitespace:'\r',
											isValid:true
										},
										6:{
											name:{name:'msgid',isValid:true},
											value:{value:'qux',isValid:true}
										},
										length:7
									},
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A document may contain a mix of name-value pairs, whitespace, and comments',
								[
									[
										'',
										'msgid "foo"',
										'   ',
										'#comment number 1',
										'\t\t',
										'#comment number 2',
										'',
										'',
										'',
										'msgid "bar"',
										'#comment number 3',
										'    msgid "baz"',
										'',
										''
									].join ('\n')
								],
								{
									items:{
										0:{
											whitespace:'\n',
											isValid:true
										},
										1:{
											name:{name:'msgid',isValid:true},
											value:{value:'foo',isValid:true}
										},
										2:{
											whitespace:'\n   \n',
											isValid:true
										},
										3:{comment:'comment number 1',isValid:true},
										4:{
											whitespace:'\n\t\t\n',
											isValid:true
										},
										5:{comment:'comment number 2',isValid:true},
										6:{
											whitespace:'\n\n\n\n',
											isValid:true
										},
										7:{
											name:{name:'msgid',isValid:true},
											value:{value:'bar',isValid:true}
										},
										8:{
											whitespace:'\n',
											isValid:true
										},
										9:{comment:'comment number 3',isValid:true},
										10:{
											whitespace:'\n    ',
											isValid:true
										},
										11:{
											name:{name:'msgid',isValid:true},
											value:{value:'baz',isValid:true}
										},
										12:{
											whitespace:'\n\n',
											isValid:true
										},
										length:13
									},
									isValid:true
								}
							)
						]
					},
					Uize.Test.ParserTest.serializerTest (
						'A PO file properties document can be serialized',
						_poDocument,
						_poDocument
					)
				]
			}
		});
	}
});

