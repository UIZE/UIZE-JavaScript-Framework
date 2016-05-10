/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Parse.Po.NameValue Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 1
	codeCompleteness: 80
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Parse.Po.NameValue= module defines a suite of unit tests for the =Uize.Parse.Po.NameValue= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Parse.Po.NameValue',
	superclass:'Uize.Test.ParserTest',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticProperties:{parserClass:'Uize.Parse.Po.NameValue'},

			set:{
				title:'Test for Uize.Parse.Po.NameValue Module',
				test:[
					Uize.Test.requiredModulesTest ('Uize.Parse.Po.NameValue'),
					{
						title:'A name-value pair can be parsed',
						test:[
							Uize.Test.ParserTest.parserTest (
								'The name and value are separated by an arbitrary amount of inline whitespace',
								['msgid "foo"'],
								{
									name:{
										name:'msgid',
										isValid:true
									},
									value:{
										value:'foo',
										isValid:true
									},
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'The value in a name-value pair must start on the same line as the name',
								['msgid \n"foo"'],
								{isValid:false}
							),
							Uize.Test.ParserTest.parserTest (
								'The value in a name-value pair may span multiple lines, if each part is enclosed in quotes',
								['msgid "foo"\n" bar"\n" baz"\n\n\r" qux"'],
								{
									name:{
										name:'msgid',
										isValid:true
									},
									value:{
										value:'foo bar baz qux',
										isValid:true
									},
									isValid:true
								}
							)
						]
					},
					{
						title:'A name-value pair can be serialized',
						test:[
							Uize.Test.ParserTest.serializerTest (
								'When a name-value pair is serialized, a single space is used as the name-value separator',
								{
									name:{
										name:'msgid',
										isValid:true
									},
									value:{
										value:'foo',
										isValid:true
									},
									isValid:true
								},
								'msgid "foo"'
							)
						]
					}
				]
			}
		});
	}
});

