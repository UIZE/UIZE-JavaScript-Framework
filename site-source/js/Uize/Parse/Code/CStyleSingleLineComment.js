/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.Code.CStyleSingleLineComment Class
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
		The =Uize.Parse.Code.CStyleSingleLineComment= module defines a parser class for C-style single line comments.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parse.Code.CStyleSingleLineComment',
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
					if (m.isValid = _source.substr (_index,2) == '//') {
						var _commentBodyStartPos = _index + 2;
						_index = Math.min (
							(_source.indexOf ('\r',_commentBodyStartPos) + 1 || _sourceLength + 1) - 1,
							(_source.indexOf ('\n',_commentBodyStartPos) + 1 || _sourceLength + 1) - 1
						);
						m.comment = _source.slice (_commentBodyStartPos,_index);
						m.length = _index - m.index;
					} else {
						m.comment = '';
						m.length = 0;
					}
				},

				serialize:function () {
					return this.isValid ? '//' + this.comment : '';
				}
			}
		});
	}
});

