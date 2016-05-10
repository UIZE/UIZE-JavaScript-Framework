/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Loc.Pseudo Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2016 UIZE
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
		The =Uize.Loc.Pseudo= module provides methods to facilitate the [[http://en.wikipedia.org/wiki/Pseudolocalization][pseudo-localization]] of the resource strings of an application.

		*DEVELOPERS:* `Chris van Rensburg`

		In a Nutshell
			What is Pseudo-localization?
				Pseudo-localization is a process of programmatically "translating" application text (typically English) to a pseudo-locale to aid in identifying i18n (internationalization) and L10n (localization) issues in the application.

				Consider the following example of text before and after pseudo-localization...

				SOURCE TEXT
				......................................
				Your account settings have been saved.
				......................................

				PSEUDO-LOCALIZED TEXT
				..................................................
				[Ýöûŕ_ åççöûñţ__ šéţţîñĝš___ ĥåṽé_ ƀééñ_ šåṽéð__.]
				..................................................

				By looking at the pseudo-localized text, you can tell that it has been derived from the source English text, which means that pseudo-localized text is still sufficiently readable that various people involved in design, development, and testing can navigate through the user interface of an application in the pseudo-localized state.

				Basic Processes
					The technique of pseudo-localization involves applying the following three processes to the original source text...

					- *accenting* - this is the process of converting ASCII alphabetical characters to accented Unicode versions
					- *expansion* - this is the process of adding extra expansion characters to simulate the expansion that typically occurs when English text is translated to languages like German, French, Spanish, Portuguese, etc.
					- *wrapping* - this is the process of wrapping translated text with characters (typically square brackets) to indicate the boundaries of individual resource strings and help to identify issues with truncation and concatenation

					These processes are discussed in further detail in the section `Pseudo-localization Features`.

				Advantages of Pseudo-localization
					As an i18n technique, pseudo-localization offers the following advantages...

					It's Free
						Because pseudo-localization can be performed programmatically, it is essentially a free form of pseudo-translation.

						Translation using human translators can be a costly process. Pseudo-localization is a cost effective alternative to traditional translation when one is only trying to expose issues with internationalization (e.g. hard-coded text) or localization (e.g. layout issues).

					It's Immediate
						Because pseudo-localization can be performed programmatically, results can be available immediately for review.

						Translation using human translators can be slow and is certainly not instantaneous. Pseudo-localization can be a virtually instantaneous process, allowing designers, developers, testers, and others to discover and address problems earlier in the development cycle, without having to be slowed down by a translation process that could take days or even weeks.

					It Makes Testing Easier
						Because pseudo-localized text is still readable as English, pseudo-localization makes it easier to test an application to discover i18n and L10n issues than if the text were truly translated to another language.

						Pseudo-localized text is intended to resemble the source English text from which it is derived, specifically so that designers, developers, testers, and others can still navigate the application in the pseudo-localized state.

				Disadvantages of Pseudo-localization
					While geneerally a beneficial technique, pseudo-localization does have some disadvantages...

					It May Produce False Positives
						Because pseudo-localized text is derived purely from the source English text, any expansion process that is applied to simulate the effects of translation to other languages is approximate and not too reliable.

						Expansion is determined as a percentage of the length of the source English text, but the actual expansion that will occur when translating to a specific language can vary substantially depending on the actual text being translated. Even with languages where translated text is typically longer, there can be individual cases where an English word or even sentence could be no longer when translated, or even shorter in some cases.

						Therefore, the expansion process in pseudo-localization could produce false positives of issues that aren't real issues in practice. This may lead one to "fix" layout issues that don't exist in practice. In general, the more languages that an application will be translated to, the more useful the findings from pseudo-localization will be, since the variety of languages will have an aggregating effect and result in the expansion being more likely to be indicative of results for some language out of the set.

					Primary Language Should be English
						As a technique, pseudo-localization is built around the assumption that there is English text that can be used as the source for generating pseudo-localized text.

						In particular, the two processes of `accenting` and `expansion` are largely predicated on the source text being English. At the very least, accenting anticipates that the source language use the Latin alphabet rather than a non-Latin script, so that alternate versions of the characters with different accents can be substituted. Expansion, on the other hand, is most valuable when the language to be used as the source for pseudo-localization is the most brief, since this will increase the number of languages that can be simulated by the expanion process (pseudo-localization `can't simulate contraction`, after all).

						Put together, this leads to English being the most suitable language to use as the primary language from which pseudo-localized text is generated.

					Can't Simulate Contraction
						While pseudo-localization can simulate the expansion of text from translation by adding extra, easily ignorable characters without interfering with readability, there is no way to remove characters to simulate contraction without harming readability.

						In contrast to languages like German, French, Spanish, Portuguese, etc., where translating from English produces text that is larger, some Asian languages that use logographic writing systems can be somewhat more compact than the equivalent English. If you want to get some sense of how much vacant space there might be in the UI when an application is translated from English to one of these more compact languages, pseudo-localization won't be coming to your rescue.

			Pseudo-localization Features
				The =Uize.Loc.Pseudo= module supports several pseudo-localization features, including `accenting`, `expansion`, and `wrapping`.

				Accenting
					Accenting is the process of converting Latin alphabetical characters from the ASCII character set to accented Unicode versions.

					Accenting Enabled By Default
						Accenting is enabled by default in the =Uize.Loc.Pseudo.pseudoLocalize= method.

						EXAMPLE
						..........................................................................
						Uize.Loc.Pseudo.pseudoLocalize ('Your account settings have been saved.');
						..........................................................................

						OUTPUT
						..................................................
						[Ýöûŕ_ åççöûñţ__ šéţţîñĝš___ ĥåṽé_ ƀééñ_ šåṽéð__.]
						..................................................

						What you will notice from the output in the above example is that the pseudo-localized text is still readable - all the ASCII alphabetical characters have been replaced with accented Unicode variants that are analagous to the originals.

					Disabling Accenting
						Accenting can be disabled by specifying the value =false= for the =accent= property in the options object, as shown in the example below...

						EXAMPLE
						.........................................................................................
						Uize.Loc.Pseudo.pseudoLocalize ('Your account settings have been saved.',{accent:false});
						.........................................................................................

						OUTPUT
						..................................................
						[Your_ account__ settings___ have_ been_ saved__.]
						..................................................

				Expansion
					Expansion is the process of adding extra expansion characters to simulate the expansion that typically occurs when English text is translated to languages like German, French, Spanish, Portuguese, etc.

					The =Uize.Loc.Pseudo.pseudoLocalize= method implements expansion by adding extra characters at the end of words. Consider the following example...

					EXAMPLE
					..........................................................................
					Uize.Loc.Pseudo.pseudoLocalize ('Your account settings have been saved.');
					..........................................................................

					OUTPUT
					..................................................
					[Ýöûŕ_ åççöûñţ__ šéţţîñĝš___ ĥåṽé_ ƀééñ_ šåṽéð__.]
					..................................................

					What you will notice from the above example is that each word is expanded by the addition of a suffix of "_" (underscore) characters. This is the `default expansion` behavior, but it can be overridden by specifying a `custom expansion factor` and `custom expansion character`.

					How Expansion is Performed
						Expansion is performed according to the following steps...

						- the source string is split into separate words using a `word splitter` regular expression
						- the total character count for all the words is computed
						- the amount of expansion characters to add is computed, by applying the `expansion factor` to the total character count of all the words
						- the computed amount of expansion characters is distrubted proportionately across all the words (a word that is twice as long as some other word will get roughly twice the number of expansion characters added as that other word)
						- the pseudo-localized string is constructed by concatenating the expanded words with the non-word segments

					Expansion Factor
						In order to determine how many `expansion characters` should be added to the source string, an expansion factor is applied to the total number of word characters in the source string.

						The expansion factor is specified as a floating point number, representing the ratio of word characters in the pseudo-localized string to word characters in the source string. So, for example, an expansion factor of 2 means that the pseudo-localized string will have twice as many word characters as the source string, meaning that the length of every word will be doubled, meaning that the total length of all the words will be increased by 100% (different ways of saying the same thing, really).

						EXPANSION OF 2
						........................................................................
						[Ýöûŕ____ åççöûñţ_______ šéţţîñĝš________ ĥåṽé____ ƀééñ____ šåṽéð_____.]
						........................................................................

						Similarly, an expansion factor of 1.3 means that there will be 30% more word characters in the pseudo-localized string than the source string.

						EXPANSION OF 1.3
						..................................................
						[Ýöûŕ_ åççöûñţ__ šéţţîñĝš___ ĥåṽé_ ƀééñ_ šåṽéð__.]
						..................................................

					Expansion Character ~~ Expansion Characters
						When pseudo-localizing a source string, words from the source string are expanded by appending zero or more of a specific expansion character.

						While the =Uize.Loc.Pseudo.pseudoLocalize= method uses a `default expansion character`, a `custom expansion character` can also be specified explicitly.

					Default Expansion
						Without specifying explicit values for `expansion factor` and `expansion character`. the =Uize.Loc.Pseudo.pseudoLocalize= method uses `default expansion factor` and `default expansion character` values.

						Default Expansion Factor
							When a `custom expansion factor` is not explicitly specified, the default value =1.3= is used for the `expansion factor`.

						Default Expansion Character
							When a `custom expansion character` is not explicitly specified, the default value ='_'= (an underscore) is used for the `expansion character`.

					Custom Expansion
						`Custom expansion factor` and `custom expansion character` values can be specified explicitly to achieve custom expansion.

						Custom Expansion Factor
							When the `default expansion factor` is not suitable, a custom expansion factor can be specified for the =expansion= property of the options object.

							EXAMPLE
							........................................................................................
							Uize.Loc.Pseudo.pseudoLocalize ('Your account settings have been saved.',{expansion:2});
							........................................................................................

							RESULT
							........................................................................
							[Ýöûŕ____ åççöûñţ_______ šéţţîñĝš________ ĥåṽé____ ƀééñ____ šåṽéð_____.]
							........................................................................

						Custom Expansion Character
							When the `default expansion character` is not suitable, a custom expansion character can be specified for the =expansionChar= property of the options object.

							EXAMPLE
							..............................................................................................
							Uize.Loc.Pseudo.pseudoLocalize ('Your account settings have been saved.',{expansionChar:'~'});
							..............................................................................................

							RESULT
							..................................................
							[Ýöûŕ~ åççöûñţ~~ šéţţîñĝš~~~ ĥåṽé~ ƀééñ~ šåṽéð~~.]
							..................................................

				Wrapping
					Wrapping is the process of wrapping pseudo-localized text with characters (typically square brackets) to indicate the boundaries and help to identify issues with truncation and concatenation.

					Default Wrapper
						By default, the =Uize.Loc.Pseudo.pseudoLocalize= method wraps all pseudo-localized text in square brackets.

						EXAMPLE
						..........................................................................
						Uize.Loc.Pseudo.pseudoLocalize ('Your account settings have been saved.');
						..........................................................................

						OUTPUT
						..................................................
						[Ýöûŕ_ åççöûñţ__ šéţţîñĝš___ ĥåṽé_ ƀééñ_ šåṽéð__.]
						..................................................

					Custom Wrapper
						When the square brackets used as the `default wrapper` is not suitable, the =Uize.Loc.Pseudo.pseudoLocalize= method allows a custom wrapper to be specified using the =wrapper= property in the options object.

						EXAMPLE
						.............................................................................................
						Uize.Loc.Pseudo.pseudoLocalize ('Your account settings have been saved.',{wrapper:'[-  -]'});
						.............................................................................................

						RESULT
						......................................................
						[- Ýöûŕ_ åççöûñţ__ šéţţîñĝš___ ĥåṽé_ ƀééñ_ šåṽéð__. -]
						......................................................

						When applying a custom wrapper, the wrapper string is split into two halves, the first of which is used as a prefix, and the second of which is used as a suffix.

					No Wrapper
						The `wrapping` process can be effectively disabled by specifying the value =''= (empty string) for the =wrapper= property in the options object, as shown in the example below...

						EXAMPLE
						.......................................................................................
						Uize.Loc.Pseudo.pseudoLocalize ('Your account settings have been saved.',{wrapper:''});
						.......................................................................................

						OUTPUT
						................................................
						Ýöûŕ_ åççöûñţ__ šéţţîñĝš___ ĥåṽé_ ƀééñ_ šåṽéð__.
						................................................
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
							Returns an accented version of the specified source string, where all Latin alphabet characters are replaced with correponding accented Unicode versions of those characters.

							SYNTAX
							.................................................
							accentedSTR = Uize.Loc.Pseudo.accent (sourceSTR);
							.................................................

							The =Uize.Loc.Pseudo.accent= method is useful in the process of pseudo-localization, as it provides a way to create readable versions of English source strings that are very visibly different. This can be a valuable aid during the internationalization process of an application and can help to expose those strings that are still hard-coded in the code and have not been externalized to resource files. Furthermore, accented versions of strings can also be used to test a system's support for characters outside of the standard ASCII character set.

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

			pseudoLocalize:function (_source,_options) {
				if (!_options)
					_options = _sacredEmptyObject
				;

				/*** normalize string source to array ***/
					var _sourceIsString = typeof _source == 'string';
					if (_sourceIsString)
						_source = [_source]
					;

				/*** segment strings and calculate total word char count (to be used in expansion) ***/
					var
						_totalWordCharCount = 0,
						_wordSplitter = _options.wordSplitter || _defaultWordSplitterRegExp,
						_result = Uize.map (
							_source,
							function (_string) {
								var _stringSegments = _split (_string,_wordSplitter,null,'match');
								for (var _stringSegmentNo = _stringSegments.length + 1; (_stringSegmentNo -= 2) >= 0;)
									_totalWordCharCount += _stringSegments [_stringSegmentNo].length
								;
								return _stringSegments;
							}
						)
					;

				/*** perform pseudo-localization (on a word-by-word basis) and return result ***/
					var
						_accent = _options.accent != _undefined ? _options.accent : true,
						_expansion = Uize.toNumber (_options.expansion,1.3),
						_expansionChar = _options.expansionChar != _undefined ? _options.expansionChar : '_',
						_expansionCharLength = _expansionChar.length,
						_wrapper = _options.wrapper != _undefined ? _options.wrapper : '[]',
						_wrapperCenterPos = Math.ceil (_wrapper.length / 2),
						_wrapperOpener = _wrapper.slice (0,_wrapperCenterPos),
						_wrapperCloser = _wrapper.slice (_wrapperCenterPos),
						_expansionCharsToAdd = _totalWordCharCount * (_expansion - 1),
						_expansionCharsAdded = 0,
						_wordCharCount = 0
					;
					Uize.map (
						_result,
						function (_stringSegments) {
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
													_stringSegment += _expansionCharLength > 1
														? _repeat (
															_expansionChar,Math.ceil (_charsToAddToWord / _expansionCharLength)
														).slice (
															0,_charsToAddToWord
														)
														: _repeat (_expansionChar,_charsToAddToWord)
													;
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
						},
						_result
					);

				return _sourceIsString ? _result [0] : _result;
				/*?
					Static Methods
						Uize.Loc.Pseudo.pseudoLocalize
							Returns a pseudo-localized version of the specified source string.

							For a refresher on pseudo-localization, refer to the section `What is Pseudo-localization?`.

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
								In cases where the option defaults do not satisfy the needs, a string can be pseudo-localized with custom options by speciying an options object for the optional =optionsOBJ= second argument.

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
										A number, specifying an `expansion factor` to be used when producing a pseudo-localized string from the source string.

										- when a number value less than or equal to =1= is specified for this property, then no expansion will take place
										- when a number value greater than =1= is specified for this property, then the words of the source string will be expanded by the factor specified by the =expansioin= property, using the expansion character specified by the companion =expansionChar= property (e.g. if the value =2= is specified, then the word length in the pseudo-localized string will be double that of the source string)
										- when the value =null= or =undefined= is specified for this property, its value will be defaulted to =1.3=
										- when a non-number value is specified for this property, it will be coerced to a number, so specifying the string ='1.5'= would be equivalent to specifying the number =1.5=
										- to see examples of this option in use, see the use cases `Pseudo-localize a String, But Without Expansion` and `Pseudo-localize a String, Specifying a Custom Expansion Factor`

										For more details on the process of expansion, consult the section `How Expansion is Performed`.

									expansionChar
										A string, specifying a character that should be used for the expansion of words in the source string.

										- when the value =null= or =undefined= is specified for this property, then its value will be defaulted to the "_" (underscore) character
										- the character specified for this option will be repeated as necessary to expand words from the source string to produce words in the pseudo-localized string (see the section `How Expansion is Performed`)
										- to see an example of this option in use, see the use case `Pseudo-localize a String, Specifying a Custom Expansion Character`

									wordSplitter ~~ Word Splitter
										A regular expression, specifying a match expression that should be used to split a source string into words and non-words.

										Default Word Splitter
											When no `custom word splitter` is explicitly specified, the =Uize.Loc.Pseudo.pseudoLocalize= method uses a default word splitter that provides a basic level of support for splitting a source string into word and non-word segments.

										Custom Word Splitter
											When the `default word splitter` is not suitable, a custom word splitter can be specified for the =wordSplitter= property of the options object.

											EXAMPLE
											....................................................................................
											var
												_wordSplitterRegExpComposition = Uize.Util.RegExpComposition ({
													punctuation:/[\?!\.;,&=\-\(\)\[\]"]+/,
													number:/\d+(?:\.\d+)?/,
													whitespace:/\s+/,
													htmlTag:/<(?:.|[\r\n\f])+?>/,
													wordSplitter:/({htmlTag}|{whitespace}|{punctuation}|{number})/
												}),
												_wordSplitterRegExp = _wordSplitterRegExpComposition.get ('wordSplitter'),
												_pseudoLocalized = Uize.Loc.Pseudo.pseudoLocalize (
													'<div class="title">Account Settings</div>\n' +
													'<div class="settingsLinks">\n' +
													'	<div id="changePassword" class="settingsLink">Change Password</div>\n' +
													'	<div id="changeEmail" class="settingsLink">Change Email Address</div>\n' +
													'	<div id="billingInfo" class="settingsLink">Update Billing Info</div>\n' +
													'	<div id="shippingAddress" class="settingsLink">Shipping Address</div>\n' +
													'</div>\n',
													{
														wordSplitter:_wordSplitterRegExp,
														wrapper:''
													}
												)
											;
											....................................................................................

											In the above example, the =Uize.Util.RegExpComposition= module is being used to construct a complex word splitter regular expression with support for non-word segments comprising punctuation, numbers, whitespace, and HTML tags. We don't have to use the =Uize.Util.RegExpComposition= module for constructing our word splitter regular expression, but this module makes it easier to define sub-expressions and use those in other expressions.

											Once the above code has been executed, the value of the =_pseudoLocalized= variable will be a string with the following contents...

											PSEUDO-LOCALIZED STRING
											.............................................................................
											<div class="title">Åççöûñţ__ Šéţţîñĝš___</div>
											<div class="settingsLinks">
												<div id="changePassword" class="settingsLink">Çĥåñĝé_ Þåššŵöŕð___</div>
												<div id="changeEmail" class="settingsLink">Çĥåñĝé__ Éɱåîļ_ Åððŕéšš__</div>
												<div id="billingInfo" class="settingsLink">Ûþðåţé__ Ɓîļļîñĝ__ Îñƒö_</div>
												<div id="shippingAddress" class="settingsLink">Šĥîþþîñĝ___ Åððŕéšš__</div>
											</div>
											.............................................................................

											What you'll notice from the result is that none of the words that are part of the HTML tags have been pseudo-localized. Also, the non-word text that is matched by the word splitter regular expression has been ignored when computing the number of expansion characters that need to be added to the string.

									wrapper
										A string, specifying the characters that should be used to wrap the source string when performing pseudo-localization on it.

										The wrapper string is split down the middle to form two parts: the opener characters (used as the prefix) and the closer characters (used as the suffix).

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
											When a wrapper string with more than two characters is specified, the wrapper string is split in half to produce multi-character prefix and suffix strings.

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
											When a wrapper string with an odd number of characters is specified, then the wrapper string will be split in half in such a way that the prefix string contains one more character than the suffix string.

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

										An Empty Wrapper
											The wrapper behavior can be disabled by specifying an empty wrapper string.

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
											When the =wrapper= option is not specified, or if the values =null= or =undefined= are specified for this option, then the option is defaulted to the value ='[]'= to provide a "bracketing" behavior.

											EXAMPLE
											..................................................................................
											Uize.Loc.Pseudo.pseudoLocalize ('This pseudo-localization thing is pretty cool!');
											..................................................................................

											RESULT
											............................................................
											[Ţĥîš_ þšéûðö-ļöçåļîžåţîöñ______ ţĥîñĝ_ îš_ þŕéţţý__ çööļ_!]
											............................................................

							Pseudo-localize a String, But Without Accenting
								In cases where `accenting` is not desired, it can be disabled by specifying the value =false= for the =accent= property in the options object (as specified by the =optionsOBJ= parameter).

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
								In cases where `expansion` is not desired, it can be disabled by specifying the value =0= for the =expansion= property in the options object (as specified by the =optionsOBJ= parameter).

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
								When a custom `expansion` factor is desired, the desired expansion can be specified as a number for the =expansion= property in the options object (as specified by the =optionsOBJ= parameter).

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
								When a custom `expansion character` is desired, it can be specified as a string for the =expansionChar= property in the options object (as specified by the =optionsOBJ= parameter).

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
								In cases where a `wrapper` is not desired, this feature can be disabled by specifying the value =''= (empty string) for the =wrapper= property in the options object (as specified by the =optionsOBJ= parameter).

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
								In cases where the default square brackets `wrapper` is not suitable, a custom wrapper can be specified using the =wrapper= property in the options object (as specified by the =optionsOBJ= parameter).

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
								In cases where the default `word splitter` is not suitable, a `custom word splitter` can be specified using the =wordSplitter= property in the options object (as specified by the =optionsOBJ= parameter).

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

