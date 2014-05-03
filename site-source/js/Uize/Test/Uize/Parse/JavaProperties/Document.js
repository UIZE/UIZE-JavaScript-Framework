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
								'The property name and property value may be separated by an "=" (equals sign) character',
								['PropertyName=PropertyValue'],
								{
									items:{
										0:{
											name:{
												name:'PropertyName',
												isValid:true
											},
											value:{
												value:'PropertyValue',
												isValid:true
											}
										}
									},
									isValid:true
								}
							)
						]
					},
					{
						title:'A Java properties document can be serialized',
						test:[
						]
					}
				]
			}
		});
	}
});

