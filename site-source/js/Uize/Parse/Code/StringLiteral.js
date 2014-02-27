/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.Code.StringLiteral Object
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
		The =Uize.Parse.Code.StringLiteral= module defines a parser object for string literals.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parse.Code.StringLiteral',
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
					value:'',

					parse:function (_source,_index) {
						var
							m = this,
							_sourceLength = (m.source = _source = _source || '').length
						;
						m.index = _index || (_index = 0);
						var _currentChar = _source.charAt (_index);
						if (m.isValid = _currentChar == '"' || _currentChar == '\'') {
							_index++;
							/*
								- iterate over characters until end of string literal or end of source
								- maintain escaping state
								- escape characters from map
							*/
						} else {
							m.value = '';
							m.length = 0;
						}
					},

					serialize:function () {
						/*
							- escape characters, as necessary
						*/
						return this.isValid ? '"' + this.value + '"' : '';
					}
				}
			}
		);
	}
});

