/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Str.Whitespace Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
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
		The =Uize.Str.Whitespace= module provides methods for detecting and removing whitespace padding around single line strings.

		*DEVELOPERS:* `Chris van Rensburg`

		In a Nutshell
			Whitespace Characters
				.

			Non-whitespace Characters
				.
*/

Uize.module ({
	name:'Uize.Str.Whitespace',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,
				_true = true,
				_false = false,

			/*** General Variables ***/
				_trueFlag = {},
				_whiteSpaceCharCodes = Uize.lookup (
					[
						9,    // \t     - Horizontal Tab (HT)
						10,   // \n     - Line Feed (LF)
						11,   // \x0b   - Vertical Tab (VT)
						12,   // \f     - Form Feed (FF)
						13,   // \r     - Carriage Return (CR)
						32,   // \x20   - Space
						160,  // \xa0   - Non-breaking space
						8192, // \u2000 - ??
						8193, // \u2001 - ??
						8194, // \u2002 - En Space
						8195, // \u2003 - Em Space
						8196, // \u2004 - ??
						8197, // \u2005 - Four-per-em Space
						8198, // \u2006 - ??
						8199, // \u2007 - Figure Space
						8200, // \u2008 - Punctuation Space
						8201, // \u2009 - Thin Space
						8202, // \u200a - Hair Space
						8203, // \u200b - Zero-width Space
						8232, // \u2028 - Line Separator
						8233, // \u2029 - Paragraph Separator
						12288 // \u3000 - Ideographic Space
					],
					_trueFlag
				)
		;

		/*** Utility Functions ***/
			function _indexOfWhitespaceOrNon (_sourceStr,_isWhitespace,_startPos) {
				for (
					var _charNo = Math.max (_startPos || 0,0) - 1, _sourceStrLength = _sourceStr.length;
					++_charNo < _sourceStrLength;
				)
					if ((_whiteSpaceCharCodes [_sourceStr.charCodeAt (_charNo)] == _trueFlag) == _isWhitespace)
						return _charNo
				;
				return -1;
			}

			function _lastIndexOfWhitespaceOrNon (_sourceStr,_isWhitespace,_startPos) {
				for (
					var _charNo = Math.min (_startPos != _undefined ? _startPos : Infinity,_sourceStr.length);
					--_charNo >= 0;
				)
					if ((_whiteSpaceCharCodes [_sourceStr.charCodeAt (_charNo)] == _trueFlag) == _isWhitespace)
						return _charNo
				;
				return -1;
			}

		return Uize.package ({
			isWhitespace:function (_sourceStr) {
				return !!_sourceStr && _lastIndexOfWhitespaceOrNon (_sourceStr,_false) == -1;
				/*?
					Static Methods
						Uize.Str.Whitespace.isWhitespace
							Returns a boolean, indicating whether or not the specified source string contains only `whitespace characters`.

							SYNTAX
							................................................................
							isWhitespaceBOOL = Uize.Str.Whitespace.isWhitespace (sourceSTR);
							................................................................

							EXAMPLES
							....................................................................
							Uize.Str.Whitespace.isWhitespace ('   ');           // returns true
							Uize.Str.Whitespace.isWhitespace ('\t\t\t');        // returns true
							Uize.Str.Whitespace.isWhitespace (' \t \r \r\n ');  // returns true

							Uize.Str.Whitespace.isWhitespace ('');              // returns false
							Uize.Str.Whitespace.isWhitespace ('foobar');        // returns false
							Uize.Str.Whitespace.isWhitespace (' \t * \r\n ');   // returns false
							....................................................................

							NOTES
							- see the companion =Uize.Str.Whitespace.isNonWhitespace= static method
							- compare to the related =Uize.Str.Whitespace.hasWhitespace= static method
				*/
			},

			isNonWhitespace:function (_sourceStr) {
				return !!_sourceStr && _lastIndexOfWhitespaceOrNon (_sourceStr,_true) == -1;
				/*?
					Static Methods
						Uize.Str.Whitespace.isWhitespace
							Returns a boolean, indicating whether or not the specified source string contains only `non-whitespace characters`.

							SYNTAX
							................................................................
							isWhitespaceBOOL = Uize.Str.Whitespace.isWhitespace (sourceSTR);
							................................................................

							EXAMPLES
							.....................................................................
							Uize.Str.Whitespace.isNonWhitespace ('foobar');      // returns true
							Uize.Str.Whitespace.isNonWhitespace ('');            // returns true

							Uize.Str.Whitespace.isNonWhitespace ('foo bar');     // returns false
							Uize.Str.Whitespace.isNonWhitespace ('foo\nbar');    // returns false
							Uize.Str.Whitespace.isNonWhitespace ('\t\tfoobar');  // returns false
							Uize.Str.Whitespace.isNonWhitespace ('   ');         // returns false
							.....................................................................

							NOTES
							- see the companion =Uize.Str.Whitespace.isWhitespace= static method
							- compare to the related =Uize.Str.Whitespace.hasNonWhitespace= static method
				*/
			},

			hasWhitespace:function (_sourceStr) {
				return !!_sourceStr && _lastIndexOfWhitespaceOrNon (_sourceStr,_true) > -1;
			},

			hasNonWhitespace:function (_sourceStr) {
				return !!_sourceStr && _lastIndexOfWhitespaceOrNon (_sourceStr,_false) > -1;
			},

			indexOfWhitespace:function (_sourceStr,_startPos) {
				return _indexOfWhitespaceOrNon (_sourceStr,_true,_startPos);
			},

			lastIndexOfWhitespace:function (_sourceStr,_startPos) {
				return _lastIndexOfWhitespaceOrNon (_sourceStr,_true,_startPos);
			},

			indexOfNonWhitespace:function (_sourceStr,_startPos) {
				return _indexOfWhitespaceOrNon (_sourceStr,_false,_startPos);
			},

			lastIndexOfNonWhitespace:function (_sourceStr,_startPos) {
				return _lastIndexOfWhitespaceOrNon (_sourceStr,_false,_startPos);
			}
		});
	}
});

