/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parsers.Code.CStyleMultiLineComment Object
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Object
	importance: 1
	codeCompleteness: 100
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Parsers.Code.CStyleMultiLineComment= module defines a parser object for C-style multi-line comments.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parsers.Code.CStyleMultiLineComment',
	builder:function () {
		'use strict';

		return Uize.mergeInto (
			function (_source,_index) {
				this.parse (_source,_index);
			},

			{
				prototype:{
					source:'',
					index:0,
					length:0,
					isValid:false,
					comment:'',

					parse:function (_source,_index) {
						var
							m = this,
							_sourceLength = (m.source = _source = _source || '').length
						;
						m.index = _index || (_index = 0);
						if (
							m.isValid =
								_source.substr (_index,2) == '/*' &&
								(_index = _source.indexOf ('*/',_index + 2)) > -1
						) {
							m.comment = _source.slice (m.index + 2,_index);
							m.length = _index + 2 - m.index;
							console.log (m);
						} else {
							m.comment = '';
							m.length = 0;
						}
					},

					serialize:function () {
						return this.isValid ? '/*' + this.comment + '*/' : '';
					}
				}
			}
		);
	}
});

