/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Parse.JavaPropertiesAscii.PropertyValue Class
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
		The =Uize.Test.Uize.Parse.JavaPropertiesAscii.PropertyValue= module defines a suite of unit tests for the =Uize.Parse.JavaPropertiesAscii.PropertyValue= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Parse.JavaPropertiesAscii.PropertyValue',
	superclass:'Uize.Test.ParserTest',
	builder:function (_superclass) {
		'use strict';

		var _unicodePropertyValue = '~\\u0080\\u00FF\\u013D';

		return _superclass.subclass ({
			staticProperties:{parserClass:'Uize.Parse.JavaPropertiesAscii.PropertyValue'},

			set:{
				title:'Test for Uize.Parse.JavaPropertiesAscii.PropertyValue Module',
				test:[
					Uize.Test.requiredModulesTest ('Uize.Parse.JavaPropertiesAscii.PropertyValue'),
					Uize.Test.ParserTest.parserTest (
						'A Unicode property value can be parsed',
						[_unicodePropertyValue],
						{
							value:'~\u0080\u00FF\u013D',
							isValid:true
						}
					),
					Uize.Test.ParserTest.serializerTest (
						'A Unicode property value can be serialized',
						_unicodePropertyValue,
						_unicodePropertyValue
					)
				]
			}
		});
	}
});

