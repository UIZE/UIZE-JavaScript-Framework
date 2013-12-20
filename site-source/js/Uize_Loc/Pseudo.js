/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Loc.Pseudo Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 2
	codeCompleteness: 5
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Loc.Pseudo= module provides methods to facilitate the pseudo-localization of a JavaScript application.

		*DEVELOPERS:* `Chris van Rensburg`

		The =Uize.Loc.Pseudo= module is inspired by the work done by engineers at Microsoft and Google in the area of psueo-localization.
*/

Uize.module ({
	name:'Uize.Loc.Pseudo',
	required:[
		'Uize.Str.Replace',
		'Uize.Str.Repeat',
		'Uize.Str.Split'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Performance Optimization ***/
				_repeat = Uize.Str.Repeat.repeat,
				_split = Uize.Str.Split.split,

			/*** General Variables ***/
				_sacredEmptyObject = {},
				_defaultWordSplitterRegExp = /([\s\?!\.;,&=\(\)\[\]"<>]+)/g,
				_accenterReplacerFunction = Uize.Str.Replace.replacerByLookup (
					Uize.map (
						{
							/*** lowercase alphabet ***/
								a:0x00e5,
								b:0x0180,
								c:0x00e7,
								d:0x00f0,
								e:0x00e9,
								f:0x0192,
								g:0x011d,
								h:0x0125,
								i:0x00ee,
								j:0x0135,
								k:0x0137,
								l:0x013c,
								m:0x0271,
								n:0x00f1,
								o:0x00f6,
								p:0x00fe,
								q:0x01eb,
								r:0x0155,
								s:0x0161,
								t:0x0163,
								u:0x00fb,
								v:0x1e7d,
								w:0x0175,
								x:0x1e8b,
								y:0x00fd,
								z:0x017e,

							/*** uppsercase alphabet ***/
								A:0x00c5,
								B:0x0181,
								C:0x00c7,
								D:0x00d0,
								E:0x00c9,
								F:0x0191,
								G:0x011c,
								H:0x0124,
								I:0x00ce,
								J:0x0134,
								K:0x0136,
								L:0x013b,
								M:0x1e40,
								N:0x00d1,
								O:0x00d6,
								P:0x00de,
								Q:0x01ea,
								R:0x0154,
								S:0x0160,
								T:0x0162,
								U:0x00db,
								V:0x1e7c,
								W:0x0174,
								X:0x1e8a,
								Y:0x00dd,
								Z:0x017d
						},
						'String.fromCharCode (value)'
					)
				)
		;

		/*** Utility Functions ***/
			function _accentString (_string) {
				return _accenterReplacerFunction (_string);
			}

		return Uize.package ({
			accent:_accentString,

			pseudoLocalize:function (_sourceStr,_options) {
				/*** default options ***/
					if (!_options)
						_options = _sacredEmptyObject
					;
					var
						_wordSplitter = _options.wordSplitter || _defaultWordSplitterRegExp,
						_expansion = Uize.toNumber (_options.expansion,1.3),
						_expansionChar = _options.expansionChar || '_',
						_wrapper = _options.wrapper != undefined ? _options.wrapper : '[]',
						_accent = _options.accent !== false
					;

				/*** calculate total word char count (to be used in expansion) ***/
					var
						_stringSegments = _split (_sourceStr,_wordSplitter),
						_totalWordCharCount = 0
					;
					if (_expansion > 1) {
						for (
							var
								_stringSegmentNo = -1,
								_stringSegmentsLength = _stringSegments.length
							;
							++_stringSegmentNo < _stringSegmentsLength;
						) {
							if (_stringSegmentNo % 2 == 0)
								_totalWordCharCount += _stringSegments [_stringSegmentNo].length
							;
						}
					}

				/*** perform pseudo-localization (on a word-by-word basis) and return result ***/
					var
						_wrapperCenterPos = _wrapper.length / 2,
						_wrapperOpener = _wrapper.slice (0,_wrapperCenterPos),
						_wrapperCloser = _wrapper.slice (_wrapperCenterPos),
						_expansionCharsToAdd = _totalWordCharCount * (_expansion - 1),
						_expansionCharsAdded = 0,
						_wordCharCount = 0
					;
					return (
						_wrapperOpener +
						Uize.map (
							_stringSegments,
							function (_stringSegment,_stringSegmentNo) {
								if (_stringSegmentNo % 2 == 0 && _stringSegment) {
									if (_accent)
										_stringSegment = _accentString (_stringSegment)
									;
									if (_expansionCharsToAdd) {
										_wordCharCount += _stringSegment.length;
										var _charsToAddToWord =
											Math.round (_wordCharCount / _totalWordCharCount * _expansionCharsToAdd) -
											_expansionCharsAdded
										;
										if (_charsToAddToWord) {
											_stringSegment += _repeat (_expansionChar,_charsToAddToWord);
											_expansionCharsAdded += _charsToAddToWord;
										}
									}
								}
								return _stringSegment;
							},
							false
						).join ('') +
						_wrapperCloser
					);
			}
		});
	}
});

