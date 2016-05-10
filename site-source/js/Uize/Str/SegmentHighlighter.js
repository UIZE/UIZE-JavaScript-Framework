/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Str.SegmentHighlighter Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	docCompleteness: 4
*/

/*?
	Introduction
		The =Uize.Str.SegmentHighlighter= module defines a class that can be used to generate highlights for segments of a source string.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Str.SegmentHighlighter',
	superclass:'Uize.Class',
	required:[
		'Uize.Str.Lines',
		'Uize.Str.Repeat'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_repeat = Uize.Str.Repeat.repeat
		;

		return _superclass.subclass ({
			stateProperties:{
				_contextLines:{
					name:'contextLines',
					value:0
				},
				_string:{
					name:'string',
					value:''
				},
				_stringLines:{
					derived:'string: Uize.Str.Lines.split (string)'
				},
				_stringLinesDeTabbed:{
					derived:'string: []'
				}
			},

			instanceMethods:{
				getSegmentHighlight:function (_segment) {
					var
						m = this,
						_stringLines = m._stringLines,
						_stringLinesDeTabbed = m._stringLinesDeTabbed,
						_segmentStart = _segment.start,
						_segmentEnd = _segment.end,
						_segmentStartLine = _segmentStart.line,
						_segmentEndLine = _segmentEnd.line,
						_contextLines = m._contextLines,
						_highlightStartLine = Math.max (_segmentStartLine - _contextLines,0),
						_highlightEndLine = Math.min (_segmentEndLine + _contextLines,_stringLines.length - 1),
						_highlightStartLineChar = Math.max (_segmentStart.lineChar,0),
						_highlightEndLineChar = Math.max (_segmentEnd.lineChar,0)
					;
					for (var _lineNo = _highlightStartLine - 1; ++_lineNo < _highlightEndLine + 1;) {
						if (!_stringLinesDeTabbed [_lineNo]) {
							_stringLinesDeTabbed [_lineNo] = 1;
							_stringLines [_lineNo] = _stringLines [_lineNo].replace (/\t/g,'    ');
						}
					}
					var
						_lines = _stringLines.slice (_highlightStartLine,_highlightEndLine + 1),
						_maxMatchedLineLength = Uize.max (
							Uize.map (
								_stringLines.slice (_segmentStartLine,_segmentEndLine + 1),
								'value.length'
							)
						),
						_maxShownLineLength = Uize.max (Uize.map (_lines,'value.length')),
						_highlightEndLineDisplayLength = (_highlightEndLine + '').length,
						_separator =
							_repeat (' ',_highlightEndLineDisplayLength + 2) + '+' +
							_repeat ('-',_highlightStartLineChar) +
							_repeat ('#',_highlightEndLineChar - _highlightStartLineChar + 1) +
							_repeat ('-',_maxShownLineLength - (_highlightStartLineChar + _highlightEndLineChar - _highlightStartLineChar + 1)) +
							'\n'
					;
					return (
						'LINE ' + _segmentStartLine + ' (CHAR ' + _segmentStart.lineChar + ') -> LINE ' + _segmentEndLine + ' (CHAR ' + _segmentEnd.lineChar + ')\n' +
						'\n' +
						_separator +
						Uize.map (
							_lines,
							function (_line,_lineNo) {
								var _displayLineNo = _lineNo + _highlightStartLine + '';
								return (
									_repeat (' ',_highlightEndLineDisplayLength - _displayLineNo.length) +
									_displayLineNo + ' ' +
									(
										Uize.inRange (
											_lineNo,
											_segmentStartLine - _highlightStartLine,
											_segmentEndLine - _highlightStartLine
										)
											? '>'
											: ' '
									) + '|' +
									_line
								);
							}
						).join ('\n') + '\n' +
						_separator
					);
				}
			}
		});
	}
});

