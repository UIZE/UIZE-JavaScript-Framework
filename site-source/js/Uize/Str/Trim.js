/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Str.Trim Package
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
		The =Uize.Str.Trim= module provides methods for detecting and removing whitespace padding around single line strings.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Str.Trim',
	required:'Uize.Str.Whitespace',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize_Str_Whitespace = Uize.Str.Whitespace,
				_isWhitespace = _Uize_Str_Whitespace.isWhitespace,
				_indexOfNonWhitespace = _Uize_Str_Whitespace.indexOfNonWhitespace,
				_lastIndexOfNonWhitespace = _Uize_Str_Whitespace.lastIndexOfNonWhitespace,

			/*** references to static methods used internally ***/
				_trim
		;

		return Uize.package ({
			hasPadding:function (_sourceStr) {
				var _sourceStrLength = _sourceStr.length;
				return !!(
					_sourceStrLength &&
					(
						_isWhitespace (_sourceStr.charAt (0)) ||
						_isWhitespace (_sourceStr.charAt (_sourceStrLength - 1))
					)
				);
				/*?
					Static Methods
						Uize.Str.Trim.hasPadding
							Returns a boolean, indicidating whether or not the specified string has whitespace padding on either - or both - of its sides (i.e. leading or trailing whitespace).

							SYNTAX
							......................................................
							hasPaddingBOOL = Uize.Str.Trim.hasPadding (sourceSTR);
							......................................................

							EXAMPLES
							.....................................................................................
							Uize.Str.Trim.hasPadding ('   leading whitespace');                  // returns true
							Uize.Str.Trim.hasPadding ('trailing whitespace     ');               // returns true
							Uize.Str.Trim.hasPadding ('   leading and trailing whitespace   ');  // returns true
							Uize.Str.Trim.hasPadding ('no         padding');                     // returns false
							Uize.Str.Trim.hasPadding ('   ');                                    // returns true
							Uize.Str.Trim.hasPadding ('');                                       // returns false
							.....................................................................................

							NOTES
							- see the related =Uize.Str.Trim.trim= static method
				*/
			},

			trim:_trim = function (_sourceStr,_side) {
				if (!_sourceStr) return _sourceStr;
				var
					_sourceStrLength = _sourceStr.length,
					_startPos = _side != 1 ? (_indexOfNonWhitespace (_sourceStr) + 1 || _sourceStrLength + 1) - 1 : 0,
					_endPos = _side != -1 ? _lastIndexOfNonWhitespace (_sourceStr) + 1 : _sourceStrLength
				;
				return _startPos > 0 || _endPos < _sourceStrLength ? _sourceStr.slice (_startPos,_endPos) : _sourceStr;
				/*?
					Static Methods
						Uize.Str.Trim.trim
							Returns a string, that is the specified source string minus any whitespace padding to the left and right of the first and last non-whitespace characters, respectively.

							SYNTAX
							............................................
							trimmedSTR = Uize.Str.Trim.trim (sourceSTR);
							............................................

							EXAMPLES
							...............................................................................
							Uize.Str.Trim.trim ('  THIS IS A STRING  ');      // returns 'THIS IS A STRING'
							Uize.Str.Trim.trim ('\tTHIS IS A STRING\t');      // returns 'THIS IS A STRING'
							Uize.Str.Trim.trim ('\n\nTHIS IS A STRING\n\n');  // returns 'THIS IS A STRING'
							Uize.Str.Trim.trim ('  \t \n\n \t');              // returns ''
							...............................................................................

							Working with Multi-line Strings
								This method regards linebreak characters as whitespace.

								Therefore, this method cannot be used to trim whitespace padding on a line by line basis. To trim line by line, use the =Uize.Str.Trim.Lines.trim= method implemented in the =Uize.Str.Trim.Lines= module that is dedicated to working with multi-line strings.

							NOTES
							- see the companion =Uize.Str.Trim.trimLeft= and =Uize.Str.Trim.trimRight= static methods
							- see the related =Uize.Str.Trim.hasPadding= static method
				*/
			},

			trimLeft:function (_sourceStr) {
				return _trim (_sourceStr,-1);
				/*?
					Static Methods
						Uize.Str.Trim.trimLeft
							Returns a string, that is the specified source string minus any whitespace padding to the left of the first non-whitespace character or the end of the string (i.e. leading whitespace).

							SYNTAX
							....................................................
							leftTrimmedSTR = Uize.Str.Trim.trimLeft (sourceSTR);
							....................................................

							EXAMPLES
							..................................................................................
							Uize.Str.Trim.trim ('  THIS IS A STRING  ');      // returns 'THIS IS A STRING  '
							Uize.Str.Trim.trim ('\tTHIS IS A STRING\t');      // returns 'THIS IS A STRING\t'
							Uize.Str.Trim.trim ('\n\nTHIS IS A STRING\n\n');  // returns 'THIS IS A STRING\n\n'
							Uize.Str.Trim.trim ('  \t \n\n \t');              // returns ''
							...................................................................................

							Working with Multi-line Strings
								This method regards linebreak characters as whitespace.

								Therefore, this method cannot be used to trim whitespace padding on a line by line basis. To left trim line by line, use the =Uize.Str.Trim.Lines.trimLeft= method implemented in the =Uize.Str.Trim.Lines= module that is dedicated to working with multi-line strings.

							NOTES
							- see the companion =Uize.Str.Trim.trim= and =Uize.Str.Trim.trimRight= static methods
				*/
			},

			trimRight:function (_sourceStr) {
				return _trim (_sourceStr,1);
				/*?
					Static Methods
						Uize.Str.Trim.trimRight
							Returns a string, that is the specified source string minus any whitespace padding to the right of the last non-whitespace character or the start of the string (i.e. trailing whitespace).

							SYNTAX
							......................................................
							rightTrimmedSTR = Uize.Str.Trim.trimRight (sourceSTR);
							......................................................

							EXAMPLES
							...................................................................................
							Uize.Str.Trim.trim ('  THIS IS A STRING  ');      // returns '  THIS IS A STRING'
							Uize.Str.Trim.trim ('\tTHIS IS A STRING\t');      // returns '\tTHIS IS A STRING'
							Uize.Str.Trim.trim ('\n\nTHIS IS A STRING\n\n');  // returns '\n\nTHIS IS A STRING'
							Uize.Str.Trim.trim ('  \t \n\n \t');              // returns ''
							...................................................................................

							Working with Multi-line Strings
								This method regards linebreak characters as whitespace.

								Therefore, this method cannot be used to trim whitespace padding on a line by line basis. To right trim line by line, use the =Uize.Str.Trim.Lines.trimRight= method implemented in the =Uize.Str.Trim.Lines= module that is dedicated to working with multi-line strings.

							NOTES
							- see the companion =Uize.Str.Trim.trim= and =Uize.Str.Trim.trimLeft= static methods
				*/
			}
		});
	}
});

