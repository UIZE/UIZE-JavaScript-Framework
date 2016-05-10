/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.Code.Whitespace Class
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
		The =Uize.Parse.Code.Whitespace= module provides methods for parsing and serializing whitespace sections.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parse.Code.Whitespace',
	superclass:'Uize.Parse.Base',
	required:'Uize.Str.Whitespace',
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Performance Optimization ***/
				_indexOfNonWhitespace = Uize.Str.Whitespace.indexOfNonWhitespace
		;

		return _superclass.subclass ({
			instanceProperties:{
				whitespace:''
			},

			instanceMethods:{
				parse:function (_source,_index) {
					var m = this;
					m.source = _source;
					m.index = _index || (_index = 0);
					_index = (_indexOfNonWhitespace (_source,_index) + 1 || _source.length + 1) - 1;
					m.whitespace = (m.isValid = !!(m.length = _index - m.index)) ? _source.slice (m.index,_index) : '';
				},

				serialize:function () {
					return this.whitespace;
				}
			}
		});
	}
});

