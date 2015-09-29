/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.Po.Document Object
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2015 UIZE
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
		The =Uize.Parse.Po.Document= module provides methods for parsing and serializing GNU gettext [[https://www.gnu.org/software/gettext/manual/html_node/PO-Files.html][PO files]].

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parse.Po.Document',
	superclass:'Uize.Parse.Items',
	required:[
		'Uize.Parse.Po.NameValue',
		'Uize.Parse.Code.PoundComment',
		'Uize.Parse.Code.Whitespace'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** General Variables ***/
				_class = function (_source,_index) {_superclass.call (this,_source,_index)}
		;

		_class.itemTypes = {
			comment:Uize.Parse.Code.PoundComment,
			nameValue:Uize.Parse.Po.NameValue,
			whitespace:Uize.Parse.Code.Whitespace
		};

		Uize.copyInto (_class.prototype,_superclass.prototype);

		return _class;
	}
});

