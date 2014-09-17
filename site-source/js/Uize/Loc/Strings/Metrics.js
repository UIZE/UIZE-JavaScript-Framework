/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Loc.Strings.Metrics Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Loc.Strings.Metrics= module provides methods for obtaining metrics, such as word and character counts, from resource strings.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Loc.Strings.Metrics',
	required:[
		'Uize.Str.Split',
		'Uize.Util.RegExpComposition'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Performance Optimization ***/
				_split = Uize.Str.Split.split,

			/*** General Variables ***/
				_wordSplitterRegExpComposition = Uize.Util.RegExpComposition ({
					punctuation:/[\?!\.:;,&=\-\(\)\[\]"<>]/,
					number:/\d+(?:\.\d+)?/,
					whitespace:/\s+/,
					wordSplitter:/({whitespace}|{punctuation}|{number})/
				}),
				_defaultWordSplitter = _wordSplitterRegExpComposition.get ('wordSplitter')
		;

		return Uize.package ({
			getMetrics:function (_sourceStr,_wordSplitter,_tokenRegExp) {
				var
					_words = 0,
					_chars = 0,
					_tokens = []
				;

				if (_sourceStr) {
					if (_tokenRegExp) {
						var
							_match,
							_tokenName,
							_tokenAdded = {}
						;
						_tokenRegExp.lastIndex = 0;
						while (_match = _tokenRegExp.exec (_sourceStr)) {
							if (!(_tokenName = _match [1])) {
								for (var _matchSegmentNo = _match.length; !_tokenName && --_matchSegmentNo >= 0;)
									_tokenName = _match [_matchSegmentNo]
								;
							}
							if (!_tokenAdded [_tokenName]) {
								_tokens.push (_tokenName);
								_tokenAdded [_tokenName] = 1;
							}
						}
					}
					for (
						var
							_stringSegmentNo = -2,
							_stringSegments = _split (_sourceStr,_wordSplitter || _defaultWordSplitter),
							_stringSegmentsLength = _stringSegments.length,
							_wordChars
						;
						(_stringSegmentNo += 2) < _stringSegmentsLength;
					) {
						if (_wordChars = _stringSegments [_stringSegmentNo].length) {
							_words++;
							_chars += _wordChars;
						}
					}
				}

				return {
					words:_words,
					chars:_chars,
					tokens:_tokens
				};
			}
		});
	}
});

