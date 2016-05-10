/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.Code.CStyleMultiLineComment Class
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
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Parse.Code.CStyleMultiLineComment= module defines a parser class for C-style multi-line comments.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parse.Code.CStyleMultiLineComment',
	superclass:'Uize.Parse.Base',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			instanceProperties:{
				comment:''
			},

			instanceMethods:{
				parse:function (_source,_index) {
					var
						m = this,
						_sourceLength = (m.source = _source).length
					;
					m.index = _index || (_index = 0);
					if (
						m.isValid =
							_source.substr (_index,2) == '/*' &&
							(_index = _source.indexOf ('*/',_index + 2)) > -1
					) {
						m.comment = _source.slice (m.index + 2,_index);
						m.length = _index + 2 - m.index;
					} else {
						m.comment = '';
						m.length = 0;
					}
				},

				serialize:function () {
					return this.isValid ? '/*' + this.comment + '*/' : '';
				}
			}
		});
	}
});

