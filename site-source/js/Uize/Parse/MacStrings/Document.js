/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.MacStrings.Document Class
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
		The =Uize.Parse.MacStrings.Document= module provides methods for parsing and serializing [[https://developer.apple.com/library/mac/documentation/Cocoa/Conceptual/LoadingResources/Strings/Strings.html][Mac OS / iOS Strings Files]].

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parse.MacStrings.Document',
	superclass:'Uize.Parse.Items',
	required:[
		'Uize.Parse.Code.CStyleSingleLineComment',
		'Uize.Parse.Code.CStyleMultiLineComment',
		'Uize.Parse.MacStrings.String',
		'Uize.Parse.Code.Whitespace'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticProperties:{
				itemTypes:{
					singleLineComment:Uize.Parse.Code.CStyleSingleLineComment,
					multiLineComment:Uize.Parse.Code.CStyleMultiLineComment,
					string:Uize.Parse.MacStrings.String,
					whitespace:Uize.Parse.Code.Whitespace
				}
			}
		});
	}
});

