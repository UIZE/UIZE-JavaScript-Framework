/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Loc.Strings.Metrics Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2016 UIZE
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
		'Uize.Util.RegExpComposition.WordSplitter',
		'Uize.Loc.Strings.StringPath',
		'Uize.Array.Sort'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Performance Optimization ***/
				_split = Uize.Str.Split.split,
				_toStringPath = Uize.Loc.Strings.StringPath.to,

			/*** General Variables ***/
				_defaultWordSplitter = Uize.Util.RegExpComposition.WordSplitter.get ('wordSplitter')
		;

		/*** Utility Functions ***/
			function _getTokenNameFromMatch (_match) {
				var _tokenName;
				if (_match && !(_tokenName = _match [1])) {
					for (var _matchSegmentNo = _match.length; !_tokenName && --_matchSegmentNo >= 0;)
						_tokenName = _match [_matchSegmentNo]
					;
				}
				return _tokenName;
			}

		return Uize.package ({
			getTokenNameFromMatch:_getTokenNameFromMatch,

			getStringMetrics:function (_sourceStr,_wordSplitter,_tokenRegExp) {
				var
					_words = 0,
					_chars = 0,
					_tokens = []
				;

				if (_sourceStr) {
					if (_tokenRegExp) {
						var
							_match,
							_tokenAdded = {},
							_trueFlag = {}
						;
						_tokenRegExp.lastIndex = 0;
						while (_match = _tokenRegExp.exec (_sourceStr)) {
							var _tokenName = _getTokenNameFromMatch (_match);
							if (_tokenAdded [_tokenName] != _trueFlag) {
								_tokens.push (_tokenName);
								_tokenAdded [_tokenName] = _trueFlag;
							}
						}
					}
					for (
						var
							_stringSegmentNo = -2,
							_stringSegments = _split (_sourceStr,_wordSplitter || _defaultWordSplitter,null,'match'),
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
			},

			getStringsMetrics:function (_stringsInfo) {
				var
					_totalResourceStrings = 0,
					_totalBrandSpecificResourceStrings = 0,
					_totalResourceStringPerBrand = {},
					_totalWordCount = 0,
					_totalBrandSpecificWordCount = 0,
					_totalWordCountPerBrand = {},
					_totalCharCount = 0,
					_totalBrandSpecificCharCount = 0,
					_totalCharCountPerBrand = {},
					_totalTokens = 0,
					_totalTokenizedResourceStrings = 0,
					_totalHtmlResourceStrings = 0,
					_totalLongResourceStrings = 0,
					_totalInvalidKeyResourceStrings = 0,
					_totalWeakTokenResourceStrings = 0,
					_totalNonTranslatableResourceStrings = 0,
					_totalDupedResourceStrings = 0,
					_valuesLookup = {},
					_dupedResourceStringsDetails = {},
					_tokenUsage = {},
					_tokenUsageSummary,
					_tokenHistogram = {},
					_wordCountHistogram = {},
					_charCountHistogram = {}
				;

				/*** calculate metrics on resource strings ***/
					Uize.forEach (
						_stringsInfo,
						function (_stringInfo) {
							var
								_value = _stringInfo.value,
								_stringFullPath = _toStringPath (_stringInfo.path)
							;

							/*** update information on duplicates ***/
								if (_valuesLookup [_value]) {
									_totalDupedResourceStrings++;
									(
										_dupedResourceStringsDetails [_value] ||
										(_dupedResourceStringsDetails [_value] = [_valuesLookup [_value]])
									).push (_stringFullPath);
								} else {
									_valuesLookup [_value] = _stringFullPath;
								}

							/*** get metrics for string ***/
								var
									_stringMetrics = _stringInfo.metrics,
									_isTranslatable = _stringInfo.isTranslatable,
									_words = _isTranslatable * _stringMetrics.words,
									_chars = _isTranslatable * _stringMetrics.chars,
									_stringTokens = _stringMetrics.tokens,
									_stringTokensLength = _stringTokens.length
								;

								_stringInfo.hasHtml && _totalHtmlResourceStrings++;
								_stringInfo.isLong && _totalLongResourceStrings++;
								_stringInfo.isKeyValid || _totalInvalidKeyResourceStrings++;
								_stringInfo.hasWeakTokens && _totalWeakTokenResourceStrings++;
								_stringInfo.isTranslatable || _totalNonTranslatableResourceStrings++;

								/*** update general metrics ***/
									_totalResourceStrings++;
									_totalWordCount += _words;
									_totalCharCount += _chars;

									if (_stringInfo.isBrandSpecific) {
										_totalBrandSpecificResourceStrings++;
										_totalBrandSpecificWordCount += _words;
										_totalBrandSpecificCharCount += _chars;

										var _stringBrand = _stringInfo.brand;
										if (_stringBrand) {
											_totalResourceStringPerBrand [_stringBrand] =
												(_totalResourceStringPerBrand [_stringBrand] || 0) + 1
											;
											_totalWordCountPerBrand [_stringBrand] =
												(_totalWordCountPerBrand [_stringBrand] || 0) + _words
											;
											_totalCharCountPerBrand [_stringBrand] =
												(_totalCharCountPerBrand [_stringBrand] || 0) + _chars
											;
										}
									}
									_wordCountHistogram [_words] = (_wordCountHistogram [_words] || 0) + 1;
									_charCountHistogram [_chars] = (_charCountHistogram [_chars] || 0) + 1;

								/*** update metrics on tokenized strings and token usage ***/
									_tokenHistogram [_stringTokensLength] = (_tokenHistogram [_stringTokensLength] || 0) + 1;
									if (_stringTokensLength) {
										Uize.forEach (
											_stringTokens,
											function (_tokenName) {
												(_tokenUsage [_tokenName] || (_tokenUsage [_tokenName] = [])).push (
													_stringFullPath
												);
											}
										);
										_totalTokens += _stringTokensLength;
										_totalTokenizedResourceStrings++;
									}
						}
					);

				/*** build token usage summary ***/
					_tokenUsageSummary = Uize.Array.Sort.sortBy (
						Uize.map (
							Uize.keys (_tokenUsage),
							function (_tokenName) {
								var _stringsFoundInCount = _tokenUsage [_tokenName].length;
								return {
									name:_tokenName,
									stringsFoundInCount:_stringsFoundInCount,
									stringsFoundInPercent:_stringsFoundInCount / _totalResourceStrings * 100
								};
							}
						),
						'value.stringsFoundInCount',
						-1
					);

				return {
					resourceStrings:{
						all:_totalResourceStrings,
						brandSpecific:_totalBrandSpecificResourceStrings,
						tokenized:_totalTokenizedResourceStrings,
						html:_totalHtmlResourceStrings,
						long:_totalLongResourceStrings,
						invalidKey:_totalInvalidKeyResourceStrings,
						weakTokens:_totalWeakTokenResourceStrings,
						nonTranslatable:_totalNonTranslatableResourceStrings,
						duped:_totalDupedResourceStrings,
						perBrand:_totalResourceStringPerBrand
					},
					wordCount:{
						all:_totalWordCount,
						brandSpecific:_totalBrandSpecificWordCount,
						perBrand:_totalWordCountPerBrand
					},
					charCount:{
						all:_totalCharCount,
						brandSpecific:_totalBrandSpecificCharCount,
						perBrand:_totalCharCountPerBrand
					},
					tokens:_totalTokens,
					dupedResourceStringsDetails:_dupedResourceStringsDetails,
					tokenUsage:_tokenUsage,
					tokenUsageSummary:_tokenUsageSummary,
					tokenHistogram:_tokenHistogram,
					wordCountHistogram:_wordCountHistogram,
					charCountHistogram:_charCountHistogram
				};
				/*?
					Static Methods
						Uize.Loc.Strings.Metrics.getStringsMetrics
							Returns a strings metrics object, containing metrics information produced by an analysis of the specified strings info array.

							SYNTAX
							..................................................................................
							stringsMetricsOBJ = Uize.Loc.Strings.Metrics.getStringsMetrics (stringsInfoARRAY);
							..................................................................................
				*/
			}
		});
	}
});

