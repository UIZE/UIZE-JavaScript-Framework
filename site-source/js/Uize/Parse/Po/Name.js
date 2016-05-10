/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.Po.Name Class
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
		The =Uize.Parse.Po.Name= module provides methods for parsing and serializing names in GNU gettext [[https://www.gnu.org/software/gettext/manual/html_node/PO-Files.html][PO files]].

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parse.Po.Name',
	superclass:'Uize.Parse.Base',
	required:'Uize.Str.Whitespace',
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize_Str_Whitespace = Uize.Str.Whitespace,

			/*** Variables for Performance Optimization ***/
				_isNonWhitespace = _Uize_Str_Whitespace.isNonWhitespace,
				_indexOfWhitespace = _Uize_Str_Whitespace.indexOfWhitespace
		;

		return _superclass.subclass ({
			instanceProperties:{
				name:''
			},

			instanceMethods:{
				parse:function (_source,_index) {
					var
						m = this,
						_sourceLength = (m.source = _source).length
					;
					m.index = _index || (_index = 0);
					if (_isNonWhitespace (_source.charAt (_index)))
						_index = ((_indexOfWhitespace (_source,_index) + 1) || _sourceLength + 1) - 1
					;
					m.name = _source.slice (m.index,_index);
					m.isValid = !!(m.length = _index - m.index);
				},

				serialize:function () {
					return this.isValid ? this.name : '';
				}
			}
		});
	}
});

