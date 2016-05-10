/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Parse.JavaProperties.Property Class
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
		The =Uize.Test.Uize.Parse.JavaProperties.Property= module defines a suite of unit tests for the =Uize.Parse.JavaProperties.Property= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Parse.JavaProperties.Property',
	superclass:'Uize.Test.ParserTest',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticProperties:{parserClass:'Uize.Parse.JavaProperties.Property'},

			set:{
				title:'Test for Uize.Parse.JavaProperties.Property Module',
				test:[
					Uize.Test.requiredModulesTest ('Uize.Parse.JavaProperties.Property'),
					{
						title:'A property can be parsed',
						test:[
							Uize.Test.ParserTest.parserTest (
								'The property name and property value may be separated by an "=" (equals sign) character',
								['PropertyName=PropertyValue'],
								{
									name:{
										name:'PropertyName',
										isValid:true
									},
									value:{
										value:'PropertyValue',
										isValid:true
									},
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'The property name and property value may be separated by a ":" (colon) character',
								['PropertyName:PropertyValue'],
								{
									name:{
										name:'PropertyName',
										isValid:true
									},
									value:{
										value:'PropertyValue',
										isValid:true
									},
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'The property name and property value may be separated by an arbitrary amount of whitespace',
								['PropertyName 	 PropertyValue'],
								{
									name:{
										name:'PropertyName',
										isValid:true
									},
									value:{
										value:'PropertyValue',
										isValid:true
									},
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'The property name may contain whitespace (e.g. space or tab) characters, as long as they are backslash escaped',
								['My\\ Property\\	Name PropertyValue'],
								{
									name:{
										name:'My Property	Name',
										isValid:true
									},
									value:{
										value:'PropertyValue',
										isValid:true
									},
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'All whitespace around the name-value separator is ignored and not included in the property name or property value',
								['PropertyName 	=	 PropertyValue'],
								{
									name:{
										name:'PropertyName',
										isValid:true
									},
									value:{
										value:'PropertyValue',
										isValid:true
									},
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A property\'s value will be empty if there are no characters between the "=" delimiter and the next new line character',
								['PropertyName =\n'],
								{
									name:{
										name:'PropertyName',
										isValid:true
									},
									value:{
										value:'',
										isValid:true
									},
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A property\'s value will be empty if there are no characters other than whitespace characters between the property name and the next new line character',
								['PropertyName        \n'],
								{
									name:{
										name:'PropertyName',
										isValid:true
									},
									value:{
										value:'',
										isValid:true
									},
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'A property\'s value will be empty if there are no characters between the "=" delimiter and another property on a new line',
								['PropertyName =\nProperty2Name=Property2Value'],
								{
									name:{
										name:'PropertyName',
										isValid:true
									},
									value:{
										value:'',
										isValid:true
									},
									isValid:true
								}
							)
						]
					},
					{
						title:'A property can be serialized',
						test:[
							Uize.Test.ParserTest.serializerTest (
								'When a property is serialized, an "=" (equals sign) with no padding is used as the name-value separator',
								{
									name:{
										name:'PropertyName',
										isValid:true
									},
									value:{
										value:'PropertyValue',
										isValid:true
									},
									isValid:true
								},
								'PropertyName=PropertyValue'
							)
						]
					}
				]
			}
		});
	}
});

