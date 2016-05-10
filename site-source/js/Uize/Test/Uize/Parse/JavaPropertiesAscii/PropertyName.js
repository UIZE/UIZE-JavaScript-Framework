/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Parse.JavaPropertiesAscii.PropertyName Class
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
		The =Uize.Test.Uize.Parse.JavaPropertiesAscii.PropertyName= module defines a suite of unit tests for the =Uize.Parse.JavaPropertiesAscii.PropertyName= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Parse.JavaPropertiesAscii.PropertyName',
	superclass:'Uize.Test.ParserTest',
	builder:function (_superclass) {
		'use strict';

		var _unicodePropertyName = '~\\u0080\\u00FF\\u013D';

		return _superclass.subclass ({
			staticProperties:{parserClass:'Uize.Parse.JavaPropertiesAscii.PropertyName'},

			set:{
				title:'Test for Uize.Parse.JavaPropertiesAscii.PropertyName Module',
				test:[
					Uize.Test.requiredModulesTest ('Uize.Parse.JavaPropertiesAscii.PropertyName'),
					Uize.Test.ParserTest.parserTest (
						'A Unicode property name can be parsed',
						[_unicodePropertyName],
						{
							name:'~\u0080\u00FF\u013D',
							isValid:true
						}
					),
					Uize.Test.ParserTest.serializerTest (
						'A Unicode property name can be serialized',
						_unicodePropertyName,
						_unicodePropertyName
					)
				]
			}
		});
	}
});

