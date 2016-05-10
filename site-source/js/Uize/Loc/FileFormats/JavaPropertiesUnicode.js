/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Loc.FileFormats.JavaPropertiesUnicode Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 50
*/

/*?
	Introduction
		The =Uize.Loc.FileFormats.JavaPropertiesUnicode= module provides support for serializing to and parsing from [[http://en.wikipedia.org/wiki/.properties][Java properties]] files that support unescaped Unicode characters.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Loc.FileFormats.JavaPropertiesUnicode',
	required:[
		'Uize.Loc.FileFormats.JavaProperties',
		'Uize.Parse.JavaPropertiesUnicode.Document',
		'Uize.Parse.JavaPropertiesUnicode.Property'
	],
	builder:function () {
		'use strict';

		return Uize.package ({
			to:Uize.Loc.FileFormats.JavaProperties.to,
			from:Uize.Loc.FileFormats.JavaProperties.from,
			documentParser:Uize.Parse.JavaPropertiesUnicode.Document,
			propertyParser:Uize.Parse.JavaPropertiesUnicode.Property
		});
	}
});

