/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Parse.Code.Whitespace Class
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
		The =Uize.Test.Uize.Parse.Code.Whitespace= module defines a suite of unit tests for the =Uize.Parse.Code.Whitespace= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Parse.Code.Whitespace',
	superclass:'Uize.Test.ParserTest',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticProperties:{parserClass:'Uize.Parse.Code.Whitespace'},

			set:{
				title:'Test for Uize.Parse.Code.Whitespace Module',
				test:[
					Uize.Test.requiredModulesTest ('Uize.Parse.Code.Whitespace'),
					{
						title:'Whitespace can be parsed',
						test:[
							Uize.Test.ParserTest.parserTest (
								'Whitespace must start with a whitespace character',
								['# not whitespace'],
								{
									whitespace:'',
									isValid:false
								}
							),
							Uize.Test.ParserTest.parserTest (
								'Whitespace may contain linebreak characters',
								['   \t \n \r  '],
								{
									whitespace:'   \t \n \r  ',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'Whitespace can start with linebreak characters',
								['\n\n\r   \t \n \r  '],
								{
									whitespace:'\n\n\r   \t \n \r  ',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'Whitespace is all whitespace characters up until the first non-whitespace character',
								[' \t  \t \n \r  foo bar baz  \n \r \t'],
								{
									whitespace:' \t  \t \n \r  ',
									isValid:true
								}
							)
						]
					},
					{
						title:'Whitespace can be serialized',
						test:[
							Uize.Test.ParserTest.serializerTest (
								'Whitespace can be serialized',
								{
									whitespace:'   \t \n \r  ',
									isValid:true
								},
								'   \t \n \r  '
							)
						]
					}
				]
			}
		});
	}
});

