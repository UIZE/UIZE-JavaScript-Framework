/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Parse.MacStrings.Document Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015-2016 UIZE
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
		The =Uize.Test.Uize.Parse.MacStrings.Document= module defines a suite of unit tests for the =Uize.Parse.MacStrings.Document= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Parse.MacStrings.Document',
	superclass:'Uize.Test.ParserTest',
	builder:function (_superclass) {
		'use strict';

		var
			_mixedStringsCommentsAndBlankLines = [
				'',
				'"String 1 Name" = "String 1 Value";',
				'',
				'// comment number 1',
				'',
				'/*',
				'	comment number 2 - line 1',
				'	comment number 2 - line 2',
				'*/',
				'',
				'',
				'',
				'"String 2 Name" = "String 2 Value";',
				'// comment number 3',
				'    "String 3 Name" = "String 3 Value";',
				'',
				''
			].join ('\n')
		;

		return _superclass.subclass ({
			staticProperties:{parserClass:'Uize.Parse.MacStrings.Document'},

			set:{
				title:'Test for Uize.Parse.MacStrings.Document Module',
				test:[
					Uize.Test.requiredModulesTest ('Uize.Parse.MacStrings.Document'),
					{
						title:'A Mac strings document can be parsed',
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
								'A document may contain just one string',
								['"Property Name"="Property Value";'],
								{
									items:{
										0:{
											stringKey:{value:'Property Name',isValid:true},
											stringValue:{value:'Property Value',isValid:true}
										},
										length:1
									},
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A document may contain multiple strings separated by linebreak characters',
								[
									[
										'"String 1 Name"="String 1 Value";',
										'"String 2 Name"="String 2 Value";',
										'"String 3 Name"="String 3 Value";'
									].join ('\n')
								],
								{
									items:{
										0:{
											stringKey:{value:'String 1 Name',isValid:true},
											stringValue:{value:'String 1 Value',isValid:true}
										},
										1:{whitespace:'\n'},
										2:{
											stringKey:{value:'String 2 Name',isValid:true},
											stringValue:{value:'String 2 Value',isValid:true}
										},
										3:{whitespace:'\n'},
										4:{
											stringKey:{value:'String 3 Name',isValid:true},
											stringValue:{value:'String 3 Value',isValid:true}
										},
										length:5
									},
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A document may contain a mix of linebreak and carriage return characters as line separators',
								[
									'"String 1 Name"="String 1 Value";\n' +
									'"String 2 Name"="String 2 Value";\r\n' +
									'"String 3 Name"="String 3 Value";\r' +
									'"String 4 Name"="String 4 Value";'
								],
								{
									items:{
										0:{
											stringKey:{value:'String 1 Name',isValid:true},
											stringValue:{value:'String 1 Value',isValid:true}
										},
										1:{whitespace:'\n'},
										2:{
											stringKey:{value:'String 2 Name',isValid:true},
											stringValue:{value:'String 2 Value',isValid:true}
										},
										3:{whitespace:'\r\n'},
										4:{
											stringKey:{value:'String 3 Name',isValid:true},
											stringValue:{value:'String 3 Value',isValid:true}
										},
										5:{whitespace:'\r'},
										6:{
											stringKey:{value:'String 4 Name',isValid:true},
											stringValue:{value:'String 4 Value',isValid:true}
										},
										length:7
									},
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'Multiple blank lines between strings are collapsed into items of contiguous whitespace',
								[
									[
										'',
										'"String 1 Name"="String 1 Value";',
										'',
										'',
										'"String 2 Name"="String 2 Value";',
										'',
										'',
										'',
										'"String 3 Name"="String 3 Value";',
										'',
										''
									].join ('\n')
								],
								{
									items:{
										0:{whitespace:'\n'},
										1:{
											stringKey:{value:'String 1 Name',isValid:true},
											stringValue:{value:'String 1 Value',isValid:true}
										},
										2:{whitespace:'\n\n\n'},
										3:{
											stringKey:{value:'String 2 Name',isValid:true},
											stringValue:{value:'String 2 Value',isValid:true}
										},
										4:{whitespace:'\n\n\n\n'},
										5:{
											stringKey:{value:'String 3 Name',isValid:true},
											stringValue:{value:'String 3 Value',isValid:true}
										},
										6:{whitespace:'\n\n'},
										length:7
									},
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A document may contain a mix of single line comments of the form "// commwnt", or multi-line comments of the form "/* comment */"',
								[
									[
										'// comment number 1',
										'/*',
										'	comment number 2 - line 1',
										'	comment number 2 - line 2',
										'*/',
										'// comment number 3'
									].join ('\n')
								],
								{
									items:{
										0:{comment:' comment number 1',isValid:true},
										1:{whitespace:'\n'},
										2:{comment:'\n\tcomment number 2 - line 1\n\tcomment number 2 - line 2\n',isValid:true},
										3:{whitespace:'\n'},
										4:{comment:' comment number 3',isValid:true},
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
										'// comment number 1',
										'',
										'/*',
										'	comment number 2 - line 1',
										'	comment number 2 - line 2',
										'*/',
										'',
										'',
										'',
										'// comment number 3',
										'',
										''
									].join ('\n')
								],
								{
									items:{
										0:{whitespace:'\n\n'},
										1:{comment:' comment number 1',isValid:true},
										2:{whitespace:'\n\n'},
										3:{comment:'\n\tcomment number 2 - line 1\n\tcomment number 2 - line 2\n',isValid:true},
										4:{whitespace:'\n\n\n\n'},
										5:{comment:' comment number 3',isValid:true},
										6:{whitespace:'\n\n'},
										length:7
									},
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A document may contain a mix of strings and comments and blank lines',
								[_mixedStringsCommentsAndBlankLines],
								{
									items:{
										0:{whitespace:'\n'},
										1:{
											stringKey:{value:'String 1 Name',isValid:true},
											stringValue:{value:'String 1 Value',isValid:true}
										},
										2:{whitespace:'\n\n'},
										3:{comment:' comment number 1',isValid:true},
										4:{whitespace:'\n\n'},
										5:{comment:'\n\tcomment number 2 - line 1\n\tcomment number 2 - line 2\n',isValid:true},
										6:{whitespace:'\n\n\n\n'},
										7:{
											stringKey:{value:'String 2 Name',isValid:true},
											stringValue:{value:'String 2 Value',isValid:true}
										},
										8:{whitespace:'\n'},
										9:{comment:' comment number 3',isValid:true},
										10:{whitespace:'\n    '},
										11:{
											stringKey:{value:'String 3 Name',isValid:true},
											stringValue:{value:'String 3 Value',isValid:true}
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
						'A Mac strings document can be serialized',
						_mixedStringsCommentsAndBlankLines,
						_mixedStringsCommentsAndBlankLines
					)
				]
			}
		});
	}
});

