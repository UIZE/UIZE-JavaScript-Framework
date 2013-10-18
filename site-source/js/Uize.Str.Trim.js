/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Str.Trim Package
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
		The =Uize.Str.Trim= module provides methods for detecting and removing padding around single line strings.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Str.Trim',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_hasPadding,
				_trim,

			/*** General Variables ***/
				_nonWhitespaceCharRegExp = new RegExp ('[^ \\n\\r\\t\\f\\x0b\\xa0\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u200b\\u2028\\u2029\\u3000]'),
				_whiteSpaceCharCodes = {
					9:1, 10:1, 11:1, 12:1, 13:1, 32:1, 160:1, 8192:1, 8193:1, 8194:1, 8195:1, 8196:1, 8197:1, 8198:1, 8199:1, 8200:1, 8201:1, 8202:1, 8203:1, 8232:1, 8233:1, 12288:1
				}
		;

		return Uize.package ({
			hasPadding:_hasPadding = function (_sourceStr) {
				var _sourceStrLength = _sourceStr.length;
				return !!(
					_sourceStrLength &&
					(
						_whiteSpaceCharCodes [_sourceStr.charCodeAt (0)] ||
						_whiteSpaceCharCodes [_sourceStr.charCodeAt (_sourceStrLength - 1)]
					)
				);
				/*?
					Static Methods
						Uize.Str.Trim.hasPadding
							Returns a boolean, indicidating whether or not the specified string has whitespace padding on either - or both - of its sides (ie. leading or trailing whitespace).

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
				/* NOTES:
					- performance
						- return early for empty string and string with no padding (avoid doing any string operation if there is no whitespace to trim)
						- don't create regular expression (use pre-created, if necessary)
						- try to avoid use of regular expression
						- don't perform multiple string operations or assignments
						- to find a non-whitespace character, check charCode and look in hash
						- perform trim by doing slice - not replace
					- what is whitespace? Different JS interpreters apparently interpret \s differently
				*/
				if (!_hasPadding (_sourceStr)) return _sourceStr;
				var
					_firstNonSpaceCharPos = _side == 1 ? 0 : _sourceStr.search (_nonWhitespaceCharRegExp),
					_lastNonSpaceCharPos = _sourceStr.length - 1
				;
				if (_firstNonSpaceCharPos == -1) return '';
				if (_side != -1)
					while (_whiteSpaceCharCodes [_sourceStr.charCodeAt (_lastNonSpaceCharPos)]) _lastNonSpaceCharPos--
				;
				return _sourceStr.slice (_firstNonSpaceCharPos,_lastNonSpaceCharPos + 1);
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
							Returns a string, that is the specified source string minus any whitespace padding to the left of the first non-whitespace character or the end of the string (ie. leading whitespace).

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
							Returns a string, that is the specified source string minus any whitespace padding to the right of the last non-whitespace character or the start of the string (ie. trailing whitespace).

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

