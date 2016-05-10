/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.JavaProperties.Document Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
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
		The =Uize.Parse.JavaProperties.Document= module provides methods for parsing and serializing [[http://en.wikipedia.org/wiki/.properties][Java properties]] files.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parse.JavaProperties.Document',
	superclass:'Uize.Parse.Items',
	required:[
		'Uize.Parse.Code.PoundComment',
		'Uize.Parse.JavaProperties.Property',
		'Uize.Parse.Code.Whitespace'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticProperties:{
				itemTypes:{
					comment:Uize.Parse.Code.PoundComment,
					property:Uize.Parse.JavaProperties.Property,
					whitespace:Uize.Parse.Code.Whitespace
				}
			}
		});
	}
});

