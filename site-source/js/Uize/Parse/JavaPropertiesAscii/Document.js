/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.JavaPropertiesAscii.Document Class
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
		The =Uize.Parse.JavaPropertiesAscii.Document= module provides methods for parsing and serializing [[http://en.wikipedia.org/wiki/.properties][Java properties]] files, where all characters outside the ASCII range should be Unicode-escaped.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parse.JavaPropertiesAscii.Document',
	superclass:'Uize.Parse.JavaProperties.Document',
	required:'Uize.Parse.JavaPropertiesAscii.Property',
	builder:function (_superclass) {
		'use strict';

		var _class = _superclass.subclass ();
		_class.itemTypes.property = Uize.Parse.JavaPropertiesAscii.Property;
		return _class;
	}
});

