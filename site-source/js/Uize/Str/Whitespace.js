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
						9,    // Horizontal Tab (HT)
						10,   // Line Feed (LF)
						11,   // Vertical Tab (VT)
						12,   // Form Feed (FF)
						13,   // Carriage Return (CR)
						32,   // Space
						160,  // Non-breaking space
						8192, // ??
						8193, // ??
						8194, // En Space
						8195, // Em Space
						8196, // ??
						8197, // Four-per-em Space
						8198, // ??
						8199, // Figure Space
						8200, // Punctuation Space
						8201, // Thin Space
						8202, // Hair Space
						8203, // Zero-width Space
						8232, // Line Separator
						8233, // Paragraph Separator
						12288 // Ideographic Space
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
			isWhitespace:function (_charStr) {
				return _lastIndexOfWhitespaceOrNon (_charStr,_false) == -1;
			},

			isNonWhitespace:function (_charStr) {
				return _lastIndexOfWhitespaceOrNon (_charStr,_true) == -1;
			},

			hasWhitespace:function (_sourceStr) {
				return _lastIndexOfWhitespaceOrNon (_charStr,_true) > -1;
			},

			hasNonWhitespace:function (_sourceStr) {
				return _lastIndexOfWhitespaceOrNon (_charStr,_false) > -1;
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

