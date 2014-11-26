/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Loc.Strings.Util Package
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
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Loc.Strings.Util= module provides utility methods for working with resource strings.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Loc.Strings.Util',
	required:[
		'Uize.Data.Diff',
		'Uize.Json'
	],
	builder:function () {
		'use strict';

		var
			/*** references to methods used internally ***/
				_serializeStringPath,
				_initValues,

			/*** General Variables ***/
				_blankStringPropertyObject = {value:''}
		;

		return Uize.package ({
			initNonTranslatable:function (
				_translatableLanguageStrings,_primaryLanguageStrings,_initNonTranslatable,_isTranslatableString
			) {
				var _initNonTranslatableParts = (
					{
						never:',never,',
						primary:'non-translatable,always,primary',
						blank:'non-translatable,always,blank',
						'primary-if-blank':'non-translatable,if-blank,primary'
					} [_initNonTranslatable || 'primary-if-blank'] || _initNonTranslatable
				).split (',');
				return _initValues (
					_translatableLanguageStrings,
					_primaryLanguageStrings,
					_initNonTranslatableParts [0],
					_initNonTranslatableParts [1],
					_initNonTranslatableParts [2],
					_isTranslatableString
				);
			},

			initValues:_initValues = function (
				_translatableLanguageStrings,_primaryLanguageStrings,_initWhat,_initWhen,_initTo,_isTranslatableString
			) {
				if (_initWhat == 'none' || _initWhen == 'never') {
					return _translatableLanguageStrings;
				} else {
					var
						_initWhatIsAll = _initWhat == 'all',
						_initWhatIsTranslatable = _initWhat == 'translatable',
						_initWhenIsAlways = _initWhen == 'always',
						_initToIsBlank = _initTo == 'blank'
					;
					return Uize.Data.Diff.diff (
						_translatableLanguageStrings,
						_primaryLanguageStrings,
						function (_translatableLanguageString,_primaryLanguageString,_path) {
							_primaryLanguageString.path = _path;
							return (
								_translatableLanguageString &&
								(
									(
										_initWhatIsAll ||
										_initWhatIsTranslatable == _isTranslatableString (_primaryLanguageString)
									) &&
									(_initWhenIsAlways || !_translatableLanguageString.value)
										? (_initToIsBlank ? _blankStringPropertyObject : _primaryLanguageString)
										: _translatableLanguageString
								)
							);
						},
						{skeleton:true}
					);
				}
			},

			serializeStringPath:_serializeStringPath = function (_path) {
				return Uize.Json.to (_path,'mini');
			},

			parseStringPath:Uize.Json.from,

			removeEmptyStrings:function (_strings) {
				return Uize.Data.Diff.diff (
					_strings,
					{},
					function (_string) {return _string.value === '' ? undefined : _string}
				);
			},

			pseudoLocalizeResources:function (_primaryLanguageResources,_isTranslatableString,_pseudoLocalizeString) {
				return Uize.Data.Diff.diff (
					_primaryLanguageResources,
					{},
					function (_string,_dummy,_path) {
						_string.path = _path;
						if (_isTranslatableString (_string))
							_string.value = _pseudoLocalizeString (_string)
						;
						return _string;
					},
					{skeleton:true}
				);
			},

			stringsMetricsFromStringsInfo:function (_stringsInfo) {
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
								_stringFullPath = _serializeStringPath (_stringInfo.path)
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
					tokenHistogram:_tokenHistogram,
					wordCountHistogram:_wordCountHistogram,
					charCountHistogram:_charCountHistogram
				};
			}
		});
	}
});

