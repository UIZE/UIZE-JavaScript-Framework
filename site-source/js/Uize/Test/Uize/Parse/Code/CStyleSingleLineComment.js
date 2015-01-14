/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Parse.Code.CStyleSingleLineComment Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2015 UIZE
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
		The =Uize.Test.Uize.Parse.Code.CStyleSingleLineComment= module defines a suite of unit tests for the =Uize.Parse.Code.CStyleSingleLineComment= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Parse.Code.CStyleSingleLineComment',
	superclass:'Uize.Test.ParserTest',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticProperties:{parserClass:'Uize.Parse.Code.CStyleSingleLineComment'},

			set:{
				title:'Test for Uize.Parse.Code.CStyleSingleLineComment Module',
				test:[
					Uize.Test.requiredModulesTest ('Uize.Parse.Code.CStyleSingleLineComment'),
					{
						title:'A comment can be parsed',
						test:[
							Uize.Test.ParserTest.parserTest (
								'A comment starts with a "//" character sequence',
								['//this is a comment'],
								{
									comment:'this is a comment',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A comment is terminated by the first carriage return character',
								['//this is a comment\r\r\r\n\n\nthis is not part of the comment'],
								{
									comment:'this is a comment',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A comment is terminated by the first linebreak character',
								['//this is a comment\n\n\n\r\r\rthis is not part of the comment'],
								{
									comment:'this is a comment',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A comment may contain more "/" characters on the same line, and these are treated as part of the comment text',
								['//foo /////// bar\nthis is not part of the comment'],
								{
									comment:'foo /////// bar',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A comment may be empty',
								['//'],
								{
									comment:'',
									isValid:true
								}
							),

							/*** tests for invalid comments ***/
								Uize.Test.ParserTest.parserTest (
									'A comment may not start with whitespace',
									[' //this is not a comment'],
									{
										comment:'',
										isValid:false
									}
								),
								Uize.Test.ParserTest.parserTest (
									'A comment may not start with a character that is not a comment start character',
									['this is not a comment'],
									{
										comment:'',
										isValid:false
									}
								)
						]
					},
					{
						title:'A comment can be serialized',
						test:[
							Uize.Test.ParserTest.serializerTest (
								'An empty comment is serialized correctly',
								{
									comment:'',
									isValid:true
								},
								'//'
							),
							Uize.Test.ParserTest.serializerTest (
								'A non-empty comment is serialized correctly',
								{
									comment:'this is a comment',
									isValid:true
								},
								'//this is a comment'
							)
						]
					}
				]
			}
		});
	}
});

