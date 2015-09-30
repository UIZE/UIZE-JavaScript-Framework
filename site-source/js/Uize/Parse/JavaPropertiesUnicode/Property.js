/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.JavaPropertiesUnicode.Property Object
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Object
	importance: 1
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Parse.JavaPropertiesUnicode.Property= module provides methods for parsing and serializing properties in [[http://en.wikipedia.org/wiki/.properties][Java properties]] files that support unescaped Unicode characters.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parse.JavaPropertiesUnicode.Property',
	superclass:'Uize.Parse.JavaProperties.Property',
	required:[
		'Uize.Parse.JavaPropertiesUnicode.PropertyName',
		'Uize.Parse.JavaPropertiesUnicode.PropertyValue'
	],
	builder:function (_superclass) {
		'use strict';

		var
			_class = _superclass.subclass (),
			_parserClassesByType = _class.prototype.parserClassesByType
		;
		_parserClassesByType.propertyName = Uize.Parse.JavaPropertiesUnicode.PropertyName;
		_parserClassesByType.propertyValue = Uize.Parse.JavaPropertiesUnicode.PropertyValue;

		return _class;
	}
});

