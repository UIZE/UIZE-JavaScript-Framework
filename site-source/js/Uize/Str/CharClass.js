/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Str.CharClass Class
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
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Str.CharClass= module defines a simple class that provides methods for working with strings that may contain chars of a specific character class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Str.CharClass',
	superclass:'Uize.Oop.BasicClass',
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_true = true,
				_false = false,

			/*** General Variables ***/
				_trueFlag = {}
		;

		/*** Private Instance Methods ***/
			function _indexOfClassCharOrNon (m,_sourceStr,_isClassChar,_direction,_startPos) {
				var
					_charsLookup = m._charsLookup,
					_sourceStrLength = _sourceStr.length
				;
				if (_sourceStrLength) {
					_startPos = _startPos != undefined ? _startPos : -_direction * Infinity;
					var _endPos = _direction == 1 ? _sourceStrLength : -1;
					if ((_startPos - _endPos) * _direction < 0) {
						if (_sourceStrLength == 1) {
							return (_charsLookup [_sourceStr] == _trueFlag) == _isClassChar ? 0 : -1;
						} else {
							for (
								var _charNo = _direction == 1
									? Math.max (_startPos,0) - 1
									: Math.min (_startPos,_sourceStrLength - 1) + 1
								;
								(_charNo += _direction) != _endPos;
							)
								if ((_charsLookup [_sourceStr.charAt (_charNo)] == _trueFlag) == _isClassChar)
									return _charNo
							;
						}
					}
				}
				return -1;
			}

		return _superclass.subclass ({
			constructor:Uize.noNew (function (_chars) {this.setChars (_chars)}),

			instanceMethods:{
				setChars:function (_chars) {
					this._charsLookup = _chars
						? Uize.lookup (
							Uize.map (
								_chars,
								function (_char) {return typeof _char == 'string' ? _char : String.fromCharCode (+_char)}
							),
							_trueFlag
						)
						: {}
					;
				},

				isClassChars:function (_sourceStr) {
					return !!_sourceStr && _indexOfClassCharOrNon (this,_sourceStr,_false,-1) == -1;
				},

				isNonClassChars:function (_sourceStr) {
					return !!_sourceStr && _indexOfClassCharOrNon (this,_sourceStr,_true,-1) == -1;
				},

				hasClassChars:function (_sourceStr) {
					return !!_sourceStr && _indexOfClassCharOrNon (this,_sourceStr,_true,-1) > -1;
				},

				hasNonClassChars:function (_sourceStr) {
					return !!_sourceStr && _indexOfClassCharOrNon (this,_sourceStr,_false,-1) > -1;
				},

				indexOfClassChar:function (_sourceStr,_startPos) {
					return _indexOfClassCharOrNon (this,_sourceStr,_true,1,_startPos);
				},

				lastIndexOfClassChar:function (_sourceStr,_startPos) {
					return _indexOfClassCharOrNon (this,_sourceStr,_true,-1,_startPos);
				},

				indexOfNonClassChar:function (_sourceStr,_startPos) {
					return _indexOfClassCharOrNon (this,_sourceStr,_false,1,_startPos);
				},

				lastIndexOfNonClassChar:function (_sourceStr,_startPos) {
					return _indexOfClassCharOrNon (this,_sourceStr,_false,-1,_startPos);
				}
			}
		});
	}
});

