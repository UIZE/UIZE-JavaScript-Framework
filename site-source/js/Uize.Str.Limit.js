/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Str.Limit Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Str.Limit= module provides methods for limiting the length of strings and performing truncation in different ways.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Str.Limit',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_limitLength
		;

		return Uize.package ({
			joinUsingSuffixPriority:function (_prefix,_suffix,_maxLength) {
				var _suffixLength = _suffix.length;
				return (
					_maxLength < _suffixLength
						? _suffix.substr (0,_maxLength)
						: _maxLength == _suffixLength
							? _suffix
							: _limitLength (_prefix,_maxLength - _suffixLength) + _suffix
				);
				/*?
					Static Methods
						Uize.Str.Limit.joinUsingSuffixPriority
							Returns a string, that is the concatenation of the two specified strings, limited to the specified maximum length, and such that the suffix string takes precedence if any characters must be lost in order to limit the length of the resulting string.

							SYNTAX
							......................................................................................
							joinedSTR = Uize.Str.Limit.joinUsingSuffixPriority (prefixSTR,suffixSTR,maxLengthINT);
							......................................................................................

							EXAMPLE
							........................................................................................
							Uize.Str.Limit.joinUsingSuffixPriority ('Some Greate Product Title',' - Customized',30);
							........................................................................................

							In the above example, this method would produce the result ='Some Greate Produ - Customized'=.
				*/
			},

			limitLength:_limitLength = function (_sourceStr,_maxLength) {
				var
					_continuationStr = '...',
					_continuationStrLength = _continuationStr.length
				;
				return (
					_maxLength < 1
						? ''
						: _maxLength <= _continuationStrLength
							? _sourceStr.slice (0,_maxLength)
							: _sourceStr.length > _maxLength
								? (_sourceStr.substr (0,_maxLength - _continuationStrLength) + _continuationStr)
								: _sourceStr
				);
				/*?
					Static Methods
						Uize.Str.Limit.limitLength
							Returns a string, that is the specified source string limited to the specified maximum length.

							SYNTAX
							.................................................................
							limitedSTR = Uize.Str.Limit.limitLength (sourceSTR,maxLengthINT);
							.................................................................

							If the string specified in the =sourceSTR= has to be truncated, it will be truncated to accommodate an ellipsis of "..." (three periods), such that the final length of the returned string is guaranteed to be no greater than the maximum length specified in the =maxLengthINT= parameter.

							EXAMPLE
							...................................................................................
							Uize.Str.Limit.limitLength ('012345678901',15);        // returns '012345678901'
							Uize.Str.Limit.limitLength ('0123456789012',15);       // returns '0123456789012'
							Uize.Str.Limit.limitLength ('01234567890123',15);      // returns '01234567890123'
							Uize.Str.Limit.limitLength ('012345678901234',15);     // returns '012345678901234'
							Uize.Str.Limit.limitLength ('0123456789012345',15);    // returns '012345678901...'
							Uize.Str.Limit.limitLength ('01234567890123456',15);   // returns '012345678901...'
							Uize.Str.Limit.limitLength ('012345678901234567',15);  // returns '012345678901...'
							...................................................................................

							Notice how, once the limit of =15= characters has been hit, all the resulting strings are only 15 characters long, with the last three characters being the ellipsis periods.
				*/
			}
		});
	}
});

