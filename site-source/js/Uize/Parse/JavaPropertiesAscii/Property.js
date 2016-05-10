/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.JavaPropertiesAscii.Property Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Parse.JavaPropertiesAscii.Property= module provides methods for parsing and serializing properties in [[http://en.wikipedia.org/wiki/.properties][Java properties]] files, where all characters outside the ASCII range should be Unicode-escaped.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parse.JavaPropertiesAscii.Property',
	superclass:'Uize.Parse.JavaProperties.Property',
	required:[
		'Uize.Parse.JavaPropertiesAscii.PropertyName',
		'Uize.Parse.JavaPropertiesAscii.PropertyValue'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			instanceProperties:{
				parserClassesByType:{
					propertyName:Uize.Parse.JavaPropertiesAscii.PropertyName,
					propertyValue:Uize.Parse.JavaPropertiesAscii.PropertyValue
				}
			}
		});
	}
});

