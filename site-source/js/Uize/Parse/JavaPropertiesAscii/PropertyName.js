/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.JavaPropertiesAscii.PropertyName Class
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
		The =Uize.Parse.JavaPropertiesAscii.PropertyName= module provides methods for parsing and serializing property names in [[http://en.wikipedia.org/wiki/.properties][Java properties]] files, where all characters outside the ASCII range should be Unicode-escaped.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parse.JavaPropertiesAscii.PropertyName',
	superclass:'Uize.Parse.JavaProperties.PropertyName',
	required:'Uize.Parse.JavaProperties.UnicodeEscaped',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			instanceMethods:{
				unicodeEscape:function (_source) {
					return Uize.Parse.JavaProperties.UnicodeEscaped.to (_source,{escapingThreshold:128});
				}
			}
		});
	}
});

