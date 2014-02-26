/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Loc.Pseudo Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 2
	codeCompleteness: 100
	docCompleteness: 55
*/

/*?
	Introduction
		The =Uize.Loc.Pseudo= module provides methods to facilitate the pseudo-localization of a JavaScript application.

		*DEVELOPERS:* `Chris van Rensburg`

		The =Uize.Loc.Pseudo= module is inspired by the work done by engineers at Microsoft and Google in the area of psueo-localization.

		###
			Accenting
				.

			Expansion
				.
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
			/*** Variables for Scruncher Optimization ***/
				_undefined,

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
				/*?
					Static Methods
						Uize.Loc.Pseudo.accent
							Returns an accented version of the specified source string, where all alphabetical characters are replaced with correponding accented versions of those characters from the extended Unicode character set.

							SYNTAX
							.................................................
							accentedSTR = Uize.Loc.Pseudo.accent (sourceSTR);
							.................................................

							The =Uize.Loc.Pseudo.accent= method is useful in the process of pseudo-localization, as it provides a way to create readable versions of English source strings that are very visibly different and that can be used to test a system's support for characters outside of the standard ASCII character set.

							When used as a part of pseudo-localization, accenting of strings can be a valuable aid during the internationalization process of an application and can help to expose those strings that are still hard-coded in the code and have not been externalized to resource files.

							EXAMPLE
							..........................................................................
							Uize.Loc.Pseudo.accent ('This pseudo-localization thing is pretty cool!');
							..........................................................................

							RESULT
							..............................................
							Ţĥîš þšéûðö-ļöçåļîžåţîöñ ţĥîñĝ îš þŕéţţý çööļ!
							..............................................

							NOTES
							- see also the =Uize.Loc.Pseudo.pseudoLocalize= static method
				*/

			pseudoLocalize:function (_sourceStr,_options) {
				/*** default options ***/
					if (!_options)
						_options = _sacredEmptyObject
					;
					var
						_accent = _options.accent != _undefined ? _options.accent : true,
						_wordSplitter = _options.wordSplitter || _defaultWordSplitterRegExp,
						_expansion = Uize.toNumber (_options.expansion,1.3),
						_expansionChar = _options.expansionChar != _undefined ? _options.expansionChar : '_',
						_wrapper = _options.wrapper != _undefined ? _options.wrapper : '[]'
					;

				/*** calculate total word char count (to be used in expansion) ***/
					var
						_stringSegments = _split (_sourceStr,_wordSplitter),
						_totalWordCharCount = 0
					;
					if (_expansion > 1) {
						for (
							var _stringSegmentNo = -2, _stringSegmentsLength = _stringSegments.length;
							(_stringSegmentNo += 2) < _stringSegmentsLength;
						)
							_totalWordCharCount += _stringSegments [_stringSegmentNo].length
						;
					}

				/*** perform pseudo-localization (on a word-by-word basis) and return result ***/
					var
						_wrapperCenterPos = Math.ceil (_wrapper.length / 2),
						_wrapperOpener = _wrapper.slice (0,_wrapperCenterPos),
						_wrapperCloser = _wrapper.slice (_wrapperCenterPos),
						_expansionCharsToAdd = _totalWordCharCount * (_expansion - 1),
						_expansionCharsAdded = 0,
						_wordCharCount = 0
					;
					return (
						(_totalWordCharCount ? _wrapperOpener : '') +
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
						(_totalWordCharCount ? _wrapperCloser : '')
					);

				/*?
					Static Methods
						Uize.Loc.Pseudo.pseudoLocalize
							Returns a pseudo-localized version of the specified source string.

							`Pseudo-localize a String Using the Option Defaults`
							................................................................
							pseudoLocalizedSTR = Uize.Loc.Pseudo.pseudoLocalize (sourceSTR);
							................................................................

							`Pseudo-localize a String, Specifying Custom Options`
							...........................................................................
							pseudoLocalizedSTR = Uize.Loc.Pseudo.pseudoLocalize (sourceSTR,optionsOBJ);
							...........................................................................

							`Pseudo-localize a String, But Without Accenting`
							..................................................................................
							pseudoLocalizedSTR = Uize.Loc.Pseudo.pseudoLocalize (sourceSTR,{accenting:false});
							..................................................................................

							`Pseudo-localize a String, But Without Expansion`
							..............................................................................
							pseudoLocalizedSTR = Uize.Loc.Pseudo.pseudoLocalize (sourceSTR,{expansion:0});
							..............................................................................

							`Pseudo-localize a String, Specifying a Custom Expansion Factor`
							...............................................................................................
							pseudoLocalizedSTR = Uize.Loc.Pseudo.pseudoLocalize (sourceSTR,{expansion:expansionFactorNUM});
							...............................................................................................

							`Pseudo-localize a String, Specifying a Custom Expansion Character`
							.....................................................
							pseudoLocalizedSTR = Uize.Loc.Pseudo.pseudoLocalize (
								sourceSTR,
								{expansionChar:expansionCharSTR}
							);
							.....................................................

							`Pseudo-localize a String, But Without Adding a Wrapper`
							.............................................................................
							pseudoLocalizedSTR = Uize.Loc.Pseudo.pseudoLocalize (sourceSTR,{wrapper:''});
							.............................................................................

							`Pseudo-localize a String, Specifying a Custom Wrapper`
							.....................................................................................
							pseudoLocalizedSTR = Uize.Loc.Pseudo.pseudoLocalize (sourceSTR,{wrapper:wrapperSTR});
							.....................................................................................

							`Pseudo-localize a String, Specifying a Custom Word Splitter`
							.....................................................
							pseudoLocalizedSTR = Uize.Loc.Pseudo.pseudoLocalize (
								sourceSTR,
								{wordSplitter:wordSplitterSTRorREGEXP}
							);
							.....................................................

							Pseudo-localize a String Using the Option Defaults
								In the simplest usage, a source string can be pseudo-localized using the option defaults by specifying the source string as the single argument.

								SYNTAX
								................................................................
								pseudoLocalizedSTR = Uize.Loc.Pseudo.pseudoLocalize (sourceSTR);
								................................................................

								EXAMPLE
								..................................................................................
								Uize.Loc.Pseudo.pseudoLocalize ('This pseudo-localization thing is pretty cool!');
								..................................................................................

								RESULT
								............................................................
								[Ţĥîš_ þšéûðö-ļöçåļîžåţîöñ______ ţĥîñĝ_ îš_ þŕéţţý__ çööļ_!]
								............................................................

							Pseudo-localize a String, Specifying Custom Options
								In cases where the option defaults do not satisfy the needs, a string can be pseudo-localized with custom options by speciying an options object for the optional =optionsOBJ= parameter.

								SYNTAX
								...........................................................................
								pseudoLocalizedSTR = Uize.Loc.Pseudo.pseudoLocalize (sourceSTR,optionsOBJ);
								...........................................................................

								optionsOBJ
									The value for the =optionsOBJ= parameter should be an object containing any of the following option properties, in any combination...

									accent
										A boolean, specifying whether ot not accenting of characters should be applied.

										- when the value =null= or =undefined= is specified for this property, its value will be defaulted to =true= and character accenting will be applied
										- when a non-nully value is specified for this property, then character accenting will be applied if the value is truthy and not applied if the value is falsy
										- to see an example of this option in use, see the use case `Pseudo-localize a String, But Without Accenting`

									expansion
										A number, specifying an expansion factor to be used when producing a pseudo-localized string from the source string.

										- when a number value less than or equal to =1= is specified for this property, then no expansion will take place
										- when a number value greater than =1= is specified for this property, then the words of the source string will be expanded by the factor specified by the =expansioin= property, using the expansion character specified by the companion =expansionChar= property (eg. if the value =2= is specified, then the word length in the pseudo-localized string will be double that of the source string)
										- when the value =null= or =undefined= is specified for this property, its value will be defaulted to =1.3=
										- when a non-number value is specified for this property, it will be coerced to a number, so specifying the string ='1.5'= would be equivalent to specifying the number =1.5=
										- to see examples of this option in use, see the use cases `Pseudo-localize a String, But Without Expansion` and `Pseudo-localize a String, Specifying a Custom Expansion Factor`

									expansionChar
										A string, specifying a character that should be used for the expansion of words in the source string.

										- when the value =null= or =undefined= is specified for this property, then its value will be defaulted to the "_" (underscore) character
										- the character specified for this option will be repeated as necessary to expand words from the source string to produce words in the pseudo-localized string
										- to see an example of this option in use, see the use case `Pseudo-localize a String, Specifying a Custom Expansion Character`

									wordSplitter
										A regular expression, specifying a match expression that should be used to split a source string into words and non-words.

										### Example
											.

										A Single Capture
											The regular expression specified for the =wordSplitter= option should contain a single capturing group that encloses the entire pattern.

											This is important, as it allows the =Uize.Loc.Pseudo.pseudoLocalize= method to split the source string exactly into alternating words and non-words, allowing the method to apply the pseudo-localization transformations like `accenting` and `expansion` for only the word parts of the source string, leaving the non-word parts unaffected.

											In such an event that a word splitter regular expression needs to use grouping, the group sub-patterns should use the "?:" no-capture qualifier, as follows...

											EXAMPLE
											................................................................
											/(\s+|\{[\da-zA-Z]+\}|[\?!\.;,&=\-\(\)\[\]"<>]+|\d+(?:\.\d+)?)/g
											................................................................

											In the above example, the word splitter regular expression is matching whitespace, substitution tokens of the form "{token}", various punctuation characters, and numbers. Specifically, the sub-pattern for numbers is =\d+(?:\.\d+)?=, which is using the "?:" no-capture qualifier for its optional decimal part group. This prevents the decimal part group from entering into the words and non-words array as a separate element if matched, which would throw off the pseudo-localization code.

									wrapper
										A string, specifying the characters that should be used to wrap the source string when performing pseudo-localization on it.

										The wrapper string is split down the middle to form two parts: the opener characters and the closer characters. The opener characters are used as the prefix while the closer characters are used as the suffix.

										A Two Character Wrapper
											In the simplest case, specifying a two character wrapper will result in the first character being used as the opener / prefix and the second character as the closer.

											EXAMPLE
											....................................................
											Uize.Loc.Pseudo.pseudoLocalize (
												'This pseudo-localization thing is pretty cool!',
												{wrapper:'<>'}
											);
											....................................................

											RESULT
											............................................................
											<Ţĥîš_ þšéûðö-ļöçåļîžåţîöñ______ ţĥîñĝ_ îš_ þŕéţţý__ çööļ_!>
											............................................................

										Wrappers With More Than Teo Characters
											.

											EXAMPLE
											....................................................
											Uize.Loc.Pseudo.pseudoLocalize (
												'This pseudo-localization thing is pretty cool!',
												{wrapper:'[-  -]'}
											);
											....................................................

											RESULT
											................................................................
											[- Ţĥîš_ þšéûðö-ļöçåļîžåţîöñ______ ţĥîñĝ_ îš_ þŕéţţý__ çööļ_! -]
											................................................................

										An Odd Length Wrapper
											.

											EXAMPLE
											....................................................
											Uize.Loc.Pseudo.pseudoLocalize (
												'This pseudo-localization thing is pretty cool!',
												{wrapper:'<#>'}
											);
											....................................................

											RESULT
											.............................................................
											<#Ţĥîš_ þšéûðö-ļöçåļîžåţîöñ______ ţĥîñĝ_ îš_ þŕéţţý__ çööļ_!>
											.............................................................

										No Wrapper
											.

											EXAMPLE
											....................................................
											Uize.Loc.Pseudo.pseudoLocalize (
												'This pseudo-localization thing is pretty cool!',
												{wrapper:''}
											);
											....................................................

											RESULT
											..........................................................
											Ţĥîš_ þšéûðö-ļöçåļîžåţîöñ______ ţĥîñĝ_ îš_ þŕéţţý__ çööļ_!
											..........................................................

										The Default Wrapper
											.

											EXAMPLE
											..................................................................................
											Uize.Loc.Pseudo.pseudoLocalize ('This pseudo-localization thing is pretty cool!');
											..................................................................................

											RESULT
											............................................................
											[Ţĥîš_ þšéûðö-ļöçåļîžåţîöñ______ ţĥîñĝ_ îš_ þŕéţţý__ çööļ_!]
											............................................................

							Pseudo-localize a String, But Without Accenting

								SYNTAX
								...............................................................................
								pseudoLocalizedSTR = Uize.Loc.Pseudo.pseudoLocalize (sourceSTR,{accent:false});
								...............................................................................

								EXAMPLE
								....................................................
								Uize.Loc.Pseudo.pseudoLocalize (
									'This pseudo-localization thing is pretty cool!',
									{accent:false}
								);
								....................................................

								RESULT
								............................................................
								[This_ pseudo-localization______ thing_ is_ pretty__ cool_!]
								............................................................

							Pseudo-localize a String, But Without Expansion

								SYNTAX
								..............................................................................
								pseudoLocalizedSTR = Uize.Loc.Pseudo.pseudoLocalize (sourceSTR,{expansion:0});
								..............................................................................

								EXAMPLE
								....................................................
								Uize.Loc.Pseudo.pseudoLocalize (
									'This pseudo-localization thing is pretty cool!',
									{expansion:0}
								);
								....................................................

								RESULT
								................................................
								[Ţĥîš þšéûðö-ļöçåļîžåţîöñ ţĥîñĝ îš þŕéţţý çööļ!]
								................................................

							Pseudo-localize a String, Specifying a Custom Expansion Factor

								SYNTAX
								...............................................................................................
								pseudoLocalizedSTR = Uize.Loc.Pseudo.pseudoLocalize (sourceSTR,{expansion:expansionFactorNUM});
								...............................................................................................

								EXAMPLE
								....................................................
								Uize.Loc.Pseudo.pseudoLocalize (
									'This pseudo-localization thing is pretty cool!',
									{expansion:2}
								);
								....................................................

								RESULT
								........................................................................................
								[Ţĥîš____ þšéûðö-ļöçåļîžåţîöñ___________________ ţĥîñĝ_____ îš__ þŕéţţý______ çööļ____!]
								........................................................................................

							Pseudo-localize a String, Specifying a Custom Expansion Character

								SYNTAX
								.....................................................
								pseudoLocalizedSTR = Uize.Loc.Pseudo.pseudoLocalize (
									sourceSTR,
									{expansionChar:expansionCharSTR}
								);
								.....................................................

								EXAMPLE
								....................................................
								Uize.Loc.Pseudo.pseudoLocalize (
									'This pseudo-localization thing is pretty cool!',
									{expansionChar:'~'}
								);
								....................................................

								RESULT
								............................................................
								[Ţĥîš~ þšéûðö-ļöçåļîžåţîöñ~~~~~~ ţĥîñĝ~ îš~ þŕéţţý~~ çööļ~!]
								............................................................

							Pseudo-localize a String, But Without Adding a Wrapper

								SYNTAX
								.............................................................................
								pseudoLocalizedSTR = Uize.Loc.Pseudo.pseudoLocalize (sourceSTR,{wrapper:''});
								.............................................................................

								EXAMPLE
								....................................................
								Uize.Loc.Pseudo.pseudoLocalize (
									'This pseudo-localization thing is pretty cool!',
									{wrapper:''}
								);
								....................................................

								RESULT
								..........................................................
								Ţĥîš_ þšéûðö-ļöçåļîžåţîöñ______ ţĥîñĝ_ îš_ þŕéţţý__ çööļ_!
								..........................................................

							Pseudo-localize a String, Specifying a Custom Wrapper

								SYNTAX
								.....................................................................................
								pseudoLocalizedSTR = Uize.Loc.Pseudo.pseudoLocalize (sourceSTR,{wrapper:wrapperSTR});
								.....................................................................................

								EXAMPLE
								....................................................
								Uize.Loc.Pseudo.pseudoLocalize (
									'This pseudo-localization thing is pretty cool!',
									{wrapper:'[-  -]'}
								);
								....................................................

								RESULT
								................................................................
								[- Ţĥîš_ þšéûðö-ļöçåļîžåţîöñ______ ţĥîñĝ_ îš_ þŕéţţý__ çööļ_! -]
								................................................................

							Pseudo-localize a String, Specifying a Custom Word Splitter

								SYNTAX
								.....................................................
								pseudoLocalizedSTR = Uize.Loc.Pseudo.pseudoLocalize (
									sourceSTR,
									{wordSplitter:wordSplitterSTRorREGEXP}
								);
								.....................................................

								EXAMPLE
								......................................................................
								Uize.Loc.Pseudo.pseudoLocalize (
									'<div>This <b>pseudo-localization</b> thing is pretty cool!</div>',
									{wordSplitter:/((?:<.+?>|\{[^\}]+\}|\s|[\?!\.;,&=\(\)\[\]"])+)/g}
								);
								......................................................................

								RESULT
								..............................................................................
								[<div>Ţĥîš_ <b>þšéûðö-ļöçåļîžåţîöñ______</b> ţĥîñĝ_ îš_ þŕéţţý__ çööļ_!</div>]
								..............................................................................

				*/
			}
		});
	}
});

