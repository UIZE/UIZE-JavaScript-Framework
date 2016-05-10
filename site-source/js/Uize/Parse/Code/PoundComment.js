/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.Code.PoundComment Class
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
		The =Uize.Parse.Code.PoundComment= module provides methods for parsing and serializing single line comments that start with a pound character.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parse.Code.PoundComment',
	superclass:'Uize.Parse.Base',
	required:'Uize.Str.Whitespace',
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Performance Optimization ***/
				_isNonWhitespace = Uize.Str.Whitespace.isNonWhitespace,

			/*** General Variables ***/
				_commentStartCharacterLookup = _charsLookup ('!#')
		;

		/*** Utility Functions ***/
			function _charsLookup (_charsStr) {
				return Uize.lookup (_charsStr.split (''));
			}

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
					if (m.isValid = !!_commentStartCharacterLookup [_source.charAt (_index)]) {
						var _commentBodyStartPos = _index + 1;
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
					return this.isValid ? '#' + this.comment : '';
				}
			}
		});
	}
});

