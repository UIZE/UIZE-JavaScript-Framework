/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Parse.Code.CStyleMultiLineComment Class
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
		The =Uize.Test.Uize.Parse.Code.CStyleMultiLineComment= module defines a suite of unit tests for the =Uize.Parse.Code.CStyleMultiLineComment= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Parse.Code.CStyleMultiLineComment',
	superclass:'Uize.Test.ParserTest',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticProperties:{parserClass:'Uize.Parse.Code.CStyleMultiLineComment'},

			set:{
				title:'Test for Uize.Parse.Code.CStyleMultiLineComment Module',
				test:[
					Uize.Test.requiredModulesTest ('Uize.Parse.Code.CStyleMultiLineComment'),
					{
						title:'A multi-line comment can be parsed',
						test:[
							Uize.Test.ParserTest.parserTest (
								'A multi-line comment starts with a "/*" character sequence and is terminated by a "*/" character sequence',
								['/*this is a comment*/'],
								{
									comment:'this is a comment',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A multi-line comment can span multiple lines and is not terminated by carriage return or linebreak characters',
								[
									'/*\n' +
									'	comment line 1\n' +
									'	comment line 2\r' +
									'	comment line 3\r\n' +
									'	comment line 4\n' +
									'*/'
								],
								{
									comment:
										'\n' +
										'	comment line 1\n' +
										'	comment line 2\r' +
										'	comment line 3\r\n' +
										'	comment line 4\n',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A multi-line comment may contain more "/*" character sequences, and these are treated as part of the comment text',
								['/* foo /* bar */'],
								{
									comment:' foo /* bar ',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A multi-line comment is terminated by the first "*/" character sequence encountered',
								['/* foo */ bar */'],
								{
									comment:' foo ',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A multi-line comment may contain a C-style single line comment, and such text is treated literally and as part of the multi-line comment\'s text',
								['/* foo // bar */'],
								{
									comment:' foo // bar ',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A multi-line comment may be empty',
								['/**/'],
								{
									comment:'',
									isValid:true
								}
							),

							/*** tests for invalid comments ***/
								Uize.Test.ParserTest.parserTest (
									'A multi-line comment may not start with whitespace',
									[' /* this is not a comment */'],
									{
										comment:'',
										isValid:false
									}
								),
								Uize.Test.ParserTest.parserTest (
									'A multi-line comment may not start with a character that is not a multi-line comment starting character sequence',
									['///* this is not a comment */'],
									{
										comment:'',
										isValid:false
									}
								),
								Uize.Test.ParserTest.parserTest (
									'The characters of the starting character sequence for a multi-line comment may not be separated by whitespace',
									['/ * this is not a comment */'],
									{
										comment:'',
										isValid:false
									}
								),
								Uize.Test.ParserTest.parserTest (
									'The characters of the terminating character sequence for a multi-line comment may not be separated by whitespace',
									['/* this is not a comment * /'],
									{
										comment:'',
										isValid:false
									}
								),
								Uize.Test.ParserTest.parserTest (
									'A multi-line comment may not be missing its terminating character sequence',
									['/* this is not a comment'],
									{
										comment:'',
										isValid:false
									}
								)
						]
					},
					{
						title:'A multi-line comment can be serialized',
						test:[
							Uize.Test.ParserTest.serializerTest (
								'An empty multi-line comment is serialized correctly',
								{
									comment:'',
									isValid:true
								},
								'/**/'
							),
							Uize.Test.ParserTest.serializerTest (
								'A non-empty multi-line comment is serialized correctly',
								{
									comment:'this is a comment',
									isValid:true
								},
								'/*this is a comment*/'
							),
							Uize.Test.ParserTest.serializerTest (
								'A multi-line comment containing carriage return and linebreak characters is serialized correctly',
								{
									comment:
										'\n' +
										'	comment line 1\n' +
										'	comment line 2\r' +
										'	comment line 3\r\n' +
										'	comment line 4\n',
									isValid:true
								},
								'/*\n' +
								'	comment line 1\n' +
								'	comment line 2\r' +
								'	comment line 3\r\n' +
								'	comment line 4\n' +
								'*/'
							)
						]
					}
				]
			}
		});
	}
});

