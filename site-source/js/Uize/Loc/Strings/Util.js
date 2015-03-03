/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Loc.Strings.Util Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2015 UIZE
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
		'Uize.Data.Csv',
		'Uize.Json'
	],
	builder:function () {
		'use strict';

		var
			/*** references to methods used internally ***/
				_serializeStringPath,
				_initValues,

			/*** General Variables ***/
				_blankStringPropertyObject = {value:''},
				_sacredEmptyObject = {}
		;

		return Uize.package ({
			initNonTranslatable:function (
				_translatableLanguageStrings,_primaryLanguageStrings,_initMode,_isTranslatableString
			) {
				var _initModeParts = (
					{
						never:',never,',
						primary:'non-translatable,always,primary',
						blank:'non-translatable,always,blank',
						'primary-if-blank':'non-translatable,if-blank,primary'
					} [_initMode || 'primary-if-blank'] || _initMode
				).split (',');
				return _initValues (
					_translatableLanguageStrings,
					_primaryLanguageStrings,
					_initModeParts [0],
					_initModeParts [1],
					_initModeParts [2],
					_isTranslatableString
				);
				/*?
					Static Methods
						Uize.Loc.Strings.Util.initNonTranslatable
							Lets you initialize the non-translatable strings in a project resource strings object.

							SYNTAX
							...................................................................
							initializedStringsOBJ = Uize.Loc.Strings.Util.initNonTranslatable (
								translatableLanguageStringsOBJ,
								primaryLanguageStringsOBJ,
								initModeSTR,
								isTranslatableStringFUNC
							);
							...................................................................

							The =Uize.Loc.Strings.Util.initNonTranslatable= method is essentially a specialized usage of the more versatile =Uize.Loc.Strings.Util.initValues= static method.

							NOTES
							- compare to the related =Uize.Loc.Strings.Util.initValues= static method
				*/
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
									(
										_initWhenIsAlways ||
										(_translatableLanguageString.value == null || _translatableLanguageString.value === '')
									)
										? (_initToIsBlank ? _blankStringPropertyObject : _primaryLanguageString)
										: _translatableLanguageString
								)
							);
						},
						{skeleton:true}
					);
				}
				/*?
					Static Methods
						Uize.Loc.Strings.Util.initValues
							Lets you initialize strings in a project resource strings object, with versatile options that make it possible to achieve a variety of different initialization behaviors.

							SYNTAX
							..........................................................
							initializedStringsOBJ = Uize.Loc.Strings.Util.initValues (
								translatableLanguageStringsOBJ,
								primaryLanguageStringsOBJ,
								initWhatSTR,
								initWhenSTR,
								initToSTR,
								isTranslatableStringFUNC
							);
							..........................................................

							NOTES
							- compare to the related =Uize.Loc.Strings.Util.initNonTranslatable= static method
				*/
			},

			serializeStringPath:_serializeStringPath = function (_path) {
				return Uize.Json.to (_path,'mini');
				/*?
					Static Methods
						Uize.Loc.Strings.Util.serializeStringPath
							Returns a string, representing the serialized form of the specified string path array.

							SYNTAX
							......................................................................................
							serializedStringPathSTR = Uize.Loc.Strings.Util.serializeStringPath (stringPathARRAY);
							......................................................................................

							NOTES
							- see the companion =Uize.Loc.Strings.Util.parseStringPath= static method
				*/
			},

			parseStringPath:Uize.Json.from,
				/*?
					Static Methods
						Uize.Loc.Strings.Util.parseStringPath
							Returns an array, representing the string path array parsed from the specified serialized string path.

							SYNTAX
							..................................................................................
							stringPathARRAY = Uize.Loc.Strings.Util.parseStringPath (serializedStringPathSTR);
							..................................................................................

							NOTES
							- see the companion =Uize.Loc.Strings.Util.serializeStringPath= static method
				*/

			removeEmptyStrings:function (_strings) {
				return Uize.Data.Diff.diff (
					_strings,
					{},
					function (_string) {return _string.value === '' ? undefined : _string}
				);
				/*?
					Static Methods
						Uize.Loc.Strings.Util.removeEmptyStrings
							Returns a new project resource strings object, being the specified project resource strings object with all empty strings removed.

							SYNTAX
							.........................................................................
							prunedStringsOBJ = Uize.Loc.Strings.Util.removeEmptyStrings (stringsOBJ);
							.........................................................................
				*/
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
				/*?
					Static Methods
						Uize.Loc.Strings.Util.pseudoLocalizeResources
							Returns a new project resource strings object, being the specified project resource strings object with all translatable strings pseudo-localized.

							SYNTAX
							...........................................................................
							pseudoLocalizedStringsOBJ = Uize.Loc.Strings.Util.pseudoLocalizeResources (
								stringsOBJ,
								isTranslatableStringFUNC,
								pseudoLocalizeStringFUNC
							);
							...........................................................................
				*/
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
				/*?
					Static Methods
						Uize.Loc.Strings.Util.stringsMetricsFromStringsInfo
							Returns a strings metrics object, containing metrics information produced by an analysis of the specified strings info array.

							SYNTAX
							...................................................................................................
							pseudoLocalizedStringsOBJ = Uize.Loc.Strings.Util.stringsMetricsFromStringsInfo (stringsInfoARRAY);
							...................................................................................................
				*/
			},

			diffResources:function (_resourcesA,_resourcesB) {
				var _resourcesDiff = [];
				Uize.Data.Diff.diff (
					_resourcesA,
					_resourcesB,
					function (_resourcesAString,_resourcesBString,_path) {
						if (
							!_resourcesAString ||
							!_resourcesBString ||
							_resourcesAString.value !== _resourcesBString.value
						) {
							var
								_valueInA = (_resourcesAString || _sacredEmptyObject).value || '',
								_valueInB = (_resourcesBString || _sacredEmptyObject).value || ''
							;
							_resourcesDiff.push ({
								key:_path [_path.length - 1],
								path:_path.concat (),
								valueInA:_valueInA,
								valueInB:_valueInB,
								difference:!_resourcesAString || !_valueInA
									? 'missing in A'
									: !_resourcesBString || !_valueInB
										? 'missing in B'
										: 'different'
							});
						}
					}
				);
				return _resourcesDiff;
				/*?
					Static Methods
						Uize.Loc.Strings.Util.diffResources
							Returns a strings diff array, containing string diff objects for every string for which there are differences between the two specified project resource strings objects.

							SYNTAX
							.................................................................................
							stringsDiffARRAY = Uize.Loc.Strings.Util.diffResources (stringsAOBJ,stringsBOBJ);
							.................................................................................
				*/
			},

			resourcesDiffAsCsv:function (_resourcesDiff) {
				return Uize.Data.Csv.to (
					Uize.map (
						_resourcesDiff,
						function (_stringDiff) {
							var _path = _stringDiff.path;
							return [
								_path [0],
								_stringDiff.key,
								_serializeStringPath (_path),
								_stringDiff.difference,
								_stringDiff.valueInA,
								_stringDiff.valueInB
							];
						}
					),
					{
						hasHeader:true,
						columns:[
							'Resource File',
							'Key',
							'Path',
							'Difference',
							'Value in A',
							'Value in B'
						]
					}
				);
				/*?
					Static Methods
						Uize.Loc.Strings.Util.resourcesDiffAsCsv
							Returns a strings, being the specified strings diff array serialized to CSV format.

							SYNTAX
							..................................................................................
							stringsDiffAsCsvSTR = Uize.Loc.Strings.Util.resourcesDiffAsCsv (stringsDiffARRAY);
							..................................................................................
				*/
			}
		});
	}
});

