/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Str.Repeat Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 2
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Str.Repeat= module provides features for repeating string segments.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Str.Repeat',
	builder:function () {
		'use strict';

		var
			/*** General Variables ***/
				_repeaterArray = [],
				_manySpaces,
				_manySpacesLength,

			/*** references to static methods used internally ***/
				_repeat
		;

		/*** Utility Functions ***/
			function _getManySpaces (_amount) {
				if (!_manySpacesLength)
					_manySpacesLength = (_manySpaces = '          '.replace (/ /g,'          ')).length // 100 spaces
				;
				if (_amount > _manySpacesLength)
					_manySpacesLength = (
						_manySpaces =
							_repeat (_manySpaces,Math.floor (_amount / _manySpacesLength)) +
							_manySpaces.substr (0,_amount % _manySpacesLength)
					).length
				;
				return _manySpaces.substr (0,_amount);
			}

		return Uize.package ({
			repeat:_repeat = function (_sourceStr,_repeatTimes) {
				if (_repeatTimes < 1 || !_sourceStr) return '';
				if (_repeatTimes == 1) return _sourceStr;
				if (_sourceStr == ' ') return _getManySpaces (_repeatTimes);
				_repeaterArray.length = _repeatTimes + 1;
				return _repeaterArray.join (_sourceStr);
				/*?
					Static Methods
						Uize.Str.Repeat.repeat
							Returns a string, that is the specified source string repeated the specified number of times.

							SYNTAX
							................................................................
							repeatedSTR = Uize.Str.Repeat.repeat (sourceSTR,repeatTimesINT);
							................................................................

							EXAMPLE 1
							.....................................................
							var hundredDashes = Uize.Str.Repeat.repeat ('-',100);
							.....................................................

							EXAMPLE 2
							............................................................
							var paddingStr = Uize.Str.Repeat.repeat (' ',paddingAmount);
							............................................................

							EXAMPLE 3
							....................................................
							var tenBrTags = Uize.Str.Repeat.repeat ('<br/>',10);
							....................................................

							The value of the =sourceSTR= parameter can contain any number of any characters. In the above example, a string containing ten =br= tags is being generated.
				*/
			}
		});
	}
});

