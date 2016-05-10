/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Str.Limit Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2016 UIZE
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
	required:'Uize.Str.Repeat',
	builder:function () {
		'use strict';

		var
			/*** Variables for Performance Optimization ***/
				_repeat = Uize.Str.Repeat.repeat,

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
			},

			lengthize:function (_sourceStr,_length,_align) {
				if (_length < 1) return '';
				var
					_sourceStrLength = _sourceStr.length,
					_totalPadding = _length - _sourceStrLength
				;
				if (_totalPadding) {
					var
						_leftPadding = Math.floor (
							_totalPadding * (typeof _align == 'string' ? {left:0,center:.5,right:1} [_align] : +_align || 0)
						),
						_rightPadding = _totalPadding - _leftPadding
					;
					return (
						_totalPadding > 0
							? _repeat (' ',_leftPadding) + _sourceStr + _repeat (' ',_rightPadding)
							: _sourceStr.slice (-_leftPadding,_sourceStrLength + _rightPadding)
					);
				} else {
					return _sourceStr;
				}
				/*?
					Static Methods
						Uize.Str.Limit.lengthize
							Returns a string, that is the specified source string with its length adjusted to the specified new length, with padding added or truncation performed as necessary.

							This method behaves in the following way...

							- When the specified new length is greater than the source string's length, then padding with space characters will be added as necessary to achieve the new length.
							- When the specified new length is less than the source string's length, then the source string will be truncated as necessary to achieve the new length.
							- When the new length is equal to the source string's current length, then the source string will be returned as is.
							- When the new length is less than =1=, then an empty string will be returned.
							- If padding is to be added or truncation is to be performed, the side(s) of the string on which these operations will be performed is determined by the alignment value (see `Adjust the Length of a Source String, Specifying Alignment`).

							DIFFERENT USAGES

							`Adjust the Length of a Source String`
							..............................................................
							resultSTR = Uize.Str.Limit.lengthize (sourceStr,newLengthINT);
							..............................................................

							`Adjust the Length of a Source String, Specifying Alignment`
							..............................................................................
							resultSTR = Uize.Str.Limit.lengthize (sourceStr,newLengthINT,alignSTRorFLOAT);
							..............................................................................

							Adjust the Length of a Source String
								In the simplest usage, the length of a source string can be adjusted to a new length by specifying the source string as the first argument and the desired length as the second argument.

								SYNTAX
								..............................................................
								resultSTR = Uize.Str.Limit.lengthize (sourceStr,newLengthINT);
								..............................................................

								If the value specified for the =newLengthINT= parameter is different to the length of the source string and padding needs to be added or truncation needs to be performed, the operation will be performed in a left-aligned manner. This is the same as if the value ='left'= or =0= was specified for the optional =alignSTRorFLOAT= third argument (see the usage `Adjust the Length of a Source String, Specifying Alignment`).

								EXAMPLES
								......................................................................
								Uize.Str.Limit.lengthize ('foobarbaz',12);   // returns 'foobarbaz   '
								Uize.Str.Limit.lengthize ('foobarbaz',9);    // returns 'foobarbaz'
								Uize.Str.Limit.lengthize ('foobarbaz',3);    // returns 'foo'
								Uize.Str.Limit.lengthize ('foobarbaz',0);    // returns ''
								Uize.Str.Limit.lengthize ('foobarbaz',-10);  // returns ''

								// when the source string is an empty string
								Uize.Str.Limit.lengthize ('',12);            // returns '            '
								Uize.Str.Limit.lengthize ('',9);             // returns '         '
								Uize.Str.Limit.lengthize ('',3);             // returns '   '
								Uize.Str.Limit.lengthize ('',0);             // returns ''
								Uize.Str.Limit.lengthize ('',-10);           // returns ''
								......................................................................

							Adjust the Length of a Source String, Specifying Alignment
								In cases where padding needs to be added or truncation needs to be performed and you wish to control how content from the source string is aligned in the result string, alignment can be specified using the optional =alignSTRorFLOAT= third argument.

								SYNTAX
								..............................................................................
								resultSTR = Uize.Str.Limit.lengthize (sourceStr,newLengthINT,alignSTRorFLOAT);
								..............................................................................

								Named Alignment
									Alignment can be specified by name by specifying a string value for the =alignSTRorFLOAT= parameter.

									The following string value can be specified...

									- ='left'= - The source text will be left-aligned in the returned string, and any padding or truncation necessary will be applied on the right side of the string.
									- ='center'= - The source text will be center-aligned in the returned string, and any padding or truncation necessary will be applied evenly (half on each side) on the left and right sides of the string.
									- ='right'= The source text will be right-aligned in the returned string, and any padding or truncation necessary will be applied on the left side of the string.

									EXAMPLES
									.................................................................................
									// when the new length is greater than the current length

									Uize.Str.Limit.lengthize ('foobar',10,'left');            // returns 'foobar    '
									Uize.Str.Limit.lengthize ('foobar',10,'center');          // returns '  foobar  '
									Uize.Str.Limit.lengthize ('foobar',10,'right');           // returns '    foobar'


									// when the new length is less than the current length

									Uize.Str.Limit.lengthize ('aaabbbcccdddeee',3,'left');    // returns 'aaa'
									Uize.Str.Limit.lengthize ('aaabbbcccdddeee',3,'center');  // returns 'ccc'
									Uize.Str.Limit.lengthize ('aaabbbcccdddeee',3,'right');   // returns 'eee'
									.................................................................................

								Fractional Alignment
									Beyond the conventional left, center, and right `named alignment`, any arbitrary fractional alignment can be achieved by specifying a floating point number in the range of =0= to =1= for the =alignSTRorFLOAT= parameter.

									When a floating point number is specified for the =alignSTRorFLOAT= parameter, that number is used to determine what fraction of the padding or truncation necessary will be applied to the left side of the string. Then, the remainder of the padding or truncation necessary will be applied to the right side of the string.

									So, for example, if the value =.25= is specified for the =alignSTRorFLOAT= parameter, then a quarter of the padding or truncation necessary will be applied to the left side of the string while the remaining three quarters will be applied to the right side of the string.

									According to this behavior, fractional alignment values are equivalent to `named alignment` values as follows...

									- =0= - equivalent to ='left'= alignment
									- =.5= - equivalent to ='center'= alignment
									- =1= - equivalent to ='right'= alignment

									EXAMPLES
									.................................................................................
									// when the new length is greater than the current length

									Uize.Str.Limit.lengthize ('foobar',10,0);                 // returns 'foobar    '
									Uize.Str.Limit.lengthize ('foobar',10,.25);               // returns ' foobar   '
									Uize.Str.Limit.lengthize ('foobar',10,.5);                // returns '  foobar  '
									Uize.Str.Limit.lengthize ('foobar',10,.75);               // returns '   foobar '
									Uize.Str.Limit.lengthize ('foobar',10,1);                 // returns '    foobar'


									// when the new length is less than the current length

									Uize.Str.Limit.lengthize ('aaabbbcccdddeee',3,0);         // returns 'aaa'
									Uize.Str.Limit.lengthize ('aaabbbcccdddeee',3,.25);       // returns 'bbb'
									Uize.Str.Limit.lengthize ('aaabbbcccdddeee',3,.5);        // returns 'ccc'
									Uize.Str.Limit.lengthize ('aaabbbcccdddeee',3,.75);       // returns 'ddd'
									Uize.Str.Limit.lengthize ('aaabbbcccdddeee',3,1);         // returns 'eee'
									.................................................................................
				*/
			}
		});
	}
});

