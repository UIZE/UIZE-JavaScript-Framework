/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Parse.Po.Name Class
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
		The =Uize.Test.Uize.Parse.Po.Name= module defines a suite of unit tests for the =Uize.Parse.Po.Name= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Parse.Po.Name',
	superclass:'Uize.Test.ParserTest',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticProperties:{parserClass:'Uize.Parse.Po.Name'},

			set:{
				title:'Test for Uize.Parse.Po.Name Module',
				test:[
					Uize.Test.requiredModulesTest ('Uize.Parse.Po.Name'),
					{
						title:'A name can be parsed',
						test:[
							Uize.Test.ParserTest.parserTest (
								'A name may not start with whitespace characters',
								[' msgstr[0]'],
								{
									name:'',
									isValid:false
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A name may not be an empty string',
								[''],
								{
									name:'',
									isValid:false
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A name may contain any non-whitespace characters',
								['msgstr[0]'],
								{
									name:'msgstr[0]',
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A name is terminated by the first whitespace character',
								['msgstr[0] "foo"\nmsgstr[1] "bar"'],
								{
									name:'msgstr[0]',
									isValid:true
								}
							)
						]
					},
					{
						title:'A name can be serialized',
						test:[
							Uize.Test.ParserTest.serializerTest (
								'A name containing only alphanumeric characters can be serialized',
								{
									name:'msgid',
									isValid:true
								},
								'msgid'
							),
							Uize.Test.ParserTest.serializerTest (
								'A name containing non-alphanumeric characters can be serialized',
								{
									name:'msgstr[0]',
									isValid:true
								},
								'msgstr[0]'
							)
						]
					}
				]
			}
		});
	}
});

