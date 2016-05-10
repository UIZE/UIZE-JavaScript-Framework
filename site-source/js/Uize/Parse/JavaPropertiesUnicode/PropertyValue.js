/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.JavaPropertiesUnicode.PropertyValue Class
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
		The =Uize.Parse.JavaPropertiesUnicode.PropertyValue= module provides methods for parsing and serializing property values in [[http://en.wikipedia.org/wiki/.properties][Java properties]] files that support unescaped Unicode characters.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parse.JavaPropertiesUnicode.PropertyValue',
	superclass:'Uize.Parse.JavaProperties.PropertyValue',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			instanceMethods:{
				unicodeEscape:Uize.returnX,
				unicodeUnescape:Uize.returnX
			}
		});
	}
});

