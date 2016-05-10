/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Parse.MacStrings.String Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015-2016 UIZE
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
		The =Uize.Test.Uize.Parse.MacStrings.String= module defines a suite of unit tests for the =Uize.Parse.MacStrings.String= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Parse.MacStrings.String',
	superclass:'Uize.Test.ParserTest',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticProperties:{parserClass:'Uize.Parse.MacStrings.String'},

			set:{
				title:'Test for Uize.Parse.MacStrings.String Module',
				test:[
					Uize.Test.requiredModulesTest ('Uize.Parse.MacStrings.String'),
					{
						title:'A string can be parsed',
						test:[
							Uize.Test.ParserTest.parserTest (
								'A basic string key-value pair can be parsed',
								['"String Key"="String Value";'],
								{
									stringKey:{
										value:'String Key',
										isValid:true
									},
									stringValue:{
										value:'String Value',
										isValid:true
									},
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'The "=" (equals sign) character separating the string key and string value may be padded on both sides with whitespace',
								['"String Key" \t = \t\t "String Value";'],
								{
									stringKey:{
										value:'String Key',
										isValid:true
									},
									stringValue:{
										value:'String Value',
										isValid:true
									},
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'There may be optional whitespace before the terminating semi-colon',
								['"String Key"="String Value" \t\t ;'],
								{
									stringKey:{
										value:'String Key',
										isValid:true
									},
									stringValue:{
										value:'String Value',
										isValid:true
									},
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'The string key and the string name may be empty strings',
								['""="";'],
								{
									stringKey:{
										value:'',
										isValid:true
									},
									stringValue:{
										value:'',
										isValid:true
									},
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'The string key and the string name may contain escaped characters, such as linebreaks or escaped quotes',
								['"\\"String\\nKey\\""="\\"String\\nValue\\"";'],
								{
									stringKey:{
										value:'"String\nKey"',
										isValid:true
									},
									stringValue:{
										value:'"String\nValue"',
										isValid:true
									},
									isValid:true
								}
							),
							Uize.Test.ParserTest.parserTest (
								'The string key and the string name may be quoted using single quotes',
								['\'String Key\'=\'String Value\';'],
								{
									stringKey:{
										value:'String Key',
										isValid:true
									},
									stringValue:{
										value:'String Value',
										isValid:true
									},
									isValid:true
								}
							)
						]
					},
					{
						title:'A string can be serialized',
						test:[
							Uize.Test.ParserTest.serializerTest (
								'When a string is serialized, an "=" (equals sign) with a single space on either side is used as the key-value separator',
								{
									stringKey:{
										value:'String Key',
										isValid:true
									},
									stringValue:{
										value:'String Value',
										isValid:true
									},
									isValid:true
								},
								'"String Key" = "String Value";'
							),
							Uize.Test.ParserTest.serializerTest (
								'When a string\'s key or value contain characters that need to be escaped, such as linebreaks or quotes, those characters are backslash-escaped when the string is serialized',
								{
									stringKey:{
										value:'"String\nKey"',
										isValid:true
									},
									stringValue:{
										value:'"String\nValue"',
										isValid:true
									},
									isValid:true
								},
								'"\\"String\\nKey\\"" = "\\"String\\nValue\\"";'
							)
						]
					}
				]
			}
		});
	}
});

