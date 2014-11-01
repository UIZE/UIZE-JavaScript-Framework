/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Services.LocAdapter Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 2
	codeCompleteness: 80
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Services.LocAdapter= module defines a base class for adapters for the =Uize.Services.Loc= service.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Services.LocAdapter',
	required:[
		'Uize.Services.FileSystem',
		'Uize.Json',
		'Uize.Data.Flatten',
		'Uize.Data.Matches',
		'Uize.Data.Csv',
		'Uize.Loc.FileFormats.ProjectStrings.Xliff',
		'Uize.Loc.FileFormats.ProjectStrings.Csv',
		'Uize.Loc.Pseudo',
		'Uize.Loc.Strings.Metrics',
		'Uize.Loc.Strings.Util',
		'Uize.Data.Diff',
		'Uize.Str.Whitespace',
		'Uize.Build.Util.Whitespace',
		'Uize.Templates.Text.Tables.Breakdown',
		'Uize.Templates.Text.Tables.YinYangBreakdown',
		'Uize.Templates.Text.Tables.Histogram'
	],
	superclass:'Uize.Service.Adapter',
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,
				_breakdownTable = Uize.Templates.Text.Tables.Breakdown.process,

			/*** Variables for Performance Optimization ***/
				_getStringMetrics = Uize.Loc.Strings.Metrics.getMetrics,
				_hasNonWhitespace = Uize.Str.Whitespace.hasNonWhitespace,

			/*** General Variables ***/
				_fileSystem = Uize.Services.FileSystem.singleton (),
				_sacredEmptyObject = {},
				_sacredEmptyArray = [],
				_pathJsonSerializationOptions = {
					quoteChar:'"',
					indentChars:'',
					linebreakChars:''
				},
				_fileTypeExtensionsLookup = {
					csv:'csv',
					xliff:'xlf'
				}
		;

		/*** Utility Functions ***/
			function _twoGroupBreakdownTable (_title,_groupATitle,_groupACount,_groupBTitle,_groupBCount) {
				return _breakdownTable ({
					title:_title,
					countByCategory:Uize.pairUp (
						'All',_groupACount + _groupBCount,
						_groupATitle,_groupACount,
						_groupBTitle,_groupBCount
					)
				});
			}

			function _serializeStringPath (_path) {
				return Uize.Json.to (_path,_pathJsonSerializationOptions);
			}

			function _removeEmptyStrings (_strings) {
				return Uize.Data.Diff.diff (
					_strings,
					{},
					function (_string) {return _string.value === '' ? _undefined : _string}
				);
			}

		/*** Private Instance Methods ***/
			function _isTranslatableString (m,_stringInfo) {
				return _hasNonWhitespace (_stringInfo.value) && m.isTranslatableString (_stringInfo);
			}

			function _getResourceFileInfo (m,_resourceFileFullPath,_language) {
				return {
					path:_resourceFileFullPath,
					language:_language,
					isPrimaryLanguage:_language == m.project.primaryLanguage
				};
			}

			function _parseResourceFile (m,_resourceFilePath,_language) {
				var
					_project = m.project,
					_resourceFileFullPath = _project.rootFolderPath + '/' + _resourceFilePath
				;
				return (
					_fileSystem.fileExists ({path:_resourceFileFullPath})
						? m.parseResourceFile (
							_fileSystem.readFile ({path:_resourceFileFullPath}),
							_getResourceFileInfo (m,_resourceFileFullPath,_language)
						)
						: {}
				);
			}

			function _calculateStringsInfoForLanguage (m,_language,_languageResources,_subFolder) {
				var
					_stringsInfo = [],
					_infoFilePath = m._workingFolderPath + _subFolder + 'strings-info/' + _language,
					_wordSplitter = m.wordSplitter,
					_tokenRegExp = m.tokenRegExp
				;
				Uize.forEach (
					_languageResources,
					function (_resourceFileStrings,_resourceFileSubPath) {
						var
							_resourceFileIsBrandSpecific = m.isBrandResourceFile (_resourceFileSubPath),
							_resourceFileBrand = _resourceFileIsBrandSpecific
								? m.getResourceFileBrand (_resourceFileSubPath)
								: ''
						;
						Uize.Data.Diff.diff (
							_resourceFileStrings,
							{},
							function (_string,_dummy,_path) {
								var
									_value = _string.value,
									_isTranslatable = _isTranslatableString (m,_string),
									_stringMetrics = _getStringMetrics (_value,_wordSplitter,_tokenRegExp),
									_isBrandSpecific = _resourceFileIsBrandSpecific || m.isBrandResourceString (_path)
								;

								/*** check for weak tokens ***/
									for (
										var
											_tokens = _stringMetrics.tokens,
											_tokenNo = _tokens.length,
											_hasWeakTokens = false
										;
										!_hasWeakTokens && --_tokenNo >= 0;
									) {
										if (m.isTokenWeak (_tokens [_tokenNo]))
											_hasWeakTokens = true
										;
									}

								_stringsInfo.push ({
									path:[_resourceFileSubPath].concat (_path),
									value:_value,
									metrics:_stringMetrics,
									isBrandSpecific:_isBrandSpecific,
									brand:_isBrandSpecific ? _resourceFileBrand || m.getStringBrand (_path) : '',
									hasHtml:m.stringHasHtml (_path,_value),
									isLong:_isTranslatable && m.isStringLong (_stringMetrics),
									isKeyValid:m.isStringKeyValid (_path),
									hasWeakTokens:_hasWeakTokens,
									isTranslatable:_isTranslatable
								});
							}
						);
					}
				);

				/*** write the JSON file ***/
					_fileSystem.writeFile ({
						path:_infoFilePath + '.json',
						contents:Uize.Json.to (_stringsInfo)
					});

				/*** generate and write a flat CSV file version ***/
					_fileSystem.writeFile ({
						path:_infoFilePath + '.csv',
						contents:Uize.Data.Csv.to (
							Uize.map (
								_stringsInfo,
								function (_stringInfo) {
									var
										_path = _stringInfo.path,
										_stringMetrics = _stringInfo.metrics
									;
									return [
										_path [_path.length - 1],
										_stringInfo.value,
										_path [0],
										_serializeStringPath (_path),
										_stringInfo.isBrandSpecific,
										_stringInfo.brand,
										_stringInfo.hasHtml,
										_stringInfo.isLong,
										_stringInfo.isKeyValid,
										_stringInfo.hasWeakTokens,
										_stringInfo.isTranslatable,
										_stringMetrics.words,
										_stringMetrics.chars,
										_stringMetrics.tokens.join (',')
									];
								}
							),
							{
								hasHeader:true,
								columns:[
									'Key',
									'Value',
									'File',
									'Path',
									'Brand-specific',
									'Brand',
									'HTML',
									'Long',
									'Valid Key',
									'Waak Tokens',
									'Translatable',
									'Word Count',
									'Char Count',
									'Tokens'
								]
							}
						)
					});

				return _stringsInfo;
			}

			function _calculateMetricsForLanguage (m,_language,_languageResources,_subFolder) {
				var
					_totalResourceFiles = 0,
					_totalBrandSpecificResourceFiles = 0,
					_totalResourceFilesPerBrand = {},
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
					_charCountHistogram = {},
					_stringsInfo = _calculateStringsInfoForLanguage (m,_language,_languageResources,_subFolder)
				;
				Uize.forEach (
					_languageResources,
					function (_resourceFileStrings,_resourceFileSubPath) {
						_totalResourceFiles++;
						if (m.isBrandResourceFile (_resourceFileSubPath)) {
							_totalBrandSpecificResourceFiles++;
							var _resourceFileBrand = m.getResourceFileBrand (_resourceFileSubPath);
							if (_resourceFileBrand)
								_totalResourceFilesPerBrand [_resourceFileBrand] =
									(_totalResourceFilesPerBrand [_resourceFileBrand] || 0) + 1
							;
						}
					}
				);
				Uize.forEach (
					_stringsInfo,
					function (_stringInfo) {
						var
							_path = _stringInfo.path,
							_value = _stringInfo.value,
							_stringFullPath = _serializeStringPath (_path)
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
								_words = _stringMetrics.words,
								_chars = _stringMetrics.chars,
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

				var _metrics = {
					resourceFiles:{
						all:_totalResourceFiles,
						brandSpecific:_totalBrandSpecificResourceFiles,
						perBrand:_totalResourceFilesPerBrand
					},
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
				_fileSystem.writeFile ({
					path:m._workingFolderPath + _subFolder + 'metrics/' + _language + '.json',
					contents:Uize.Json.to (_metrics)
				});

				return _metrics;
			}

			function _pseudoLocalizeResources (m,_primaryLanguageResources) {
				var
					_pseudoLocalizedResources = {},
					_pseudoLocalizeOptions = Uize.copy (m.project.pseudoLocalization,{wordSplitter:m.wordSplitter})
				;
				Uize.forEach (
					_primaryLanguageResources,
					function (_resourceFileStrings,_resourceFileSubPath) {
						_pseudoLocalizedResources [_resourceFileSubPath] =
							Uize.Data.Diff.diff (
								_primaryLanguageResources [_resourceFileSubPath],
								{},
								function (_string,_propertyB,_path) {
									_string.path = _path;
									if (_isTranslatableString (m,_string))
										_string.value = m.pseudoLocalizeString (_string,_pseudoLocalizeOptions)
									;
									return _string;
								},
								{skeleton:true}
							)
						;
					}
				);
				return _pseudoLocalizedResources;
			}

			function _languageResourcesFilePath (m,_language) {
				return m._workingFolderPath + _language + '.json';
			}

			function _getTranslationJobFilePath (m,_language) {
				return (
					m._workingFolderPath + 'jobs/' + _language +
					'.' + _fileTypeExtensionsLookup [m.project.translationJobFileFormat || 'csv']
				);
			}

			function _readLanguageResourcesFile (m,_language) {
				var _path = _languageResourcesFilePath (m,_language);
				return (
					_fileSystem.fileExists ({path:_path})
						? Uize.Json.from (_fileSystem.readFile ({path:_path}))
						: _undefined
				);
			}

			function _writeLanguageResourcesFile (m,_language,_languageResources) {
				_fileSystem.writeFile ({
					path:_languageResourcesFilePath (m,_language),
					contents:Uize.Json.to (_languageResources)
				});
			}

			function _getTranslatableLanguages (m) {
				var _project = m.project;
				return Uize.Data.Matches.remove (
					_project.languages,
					Uize.lookup ([_project.primaryLanguage,_project.pseudoLocale])
				);
			}

			function _forEachTranslatableLanguage (m,_iterationHandler) {
				Uize.forEach (_getTranslatableLanguages (m),function (_language) {_iterationHandler (_language)});
			}

		return _superclass.subclass ({
			instanceMethods:{
				getTranslatableLanguages:function () {
					return _getTranslatableLanguages (this);
					/*?
						Instance Methods
							getTranslatableLanguages
								Returns an array, containing the locale codes for all the translatable languages configured for the project (i.e. excluding the primary language and the pseudo-locale).

								SYNTAX
								..............................................................
								translatableLanguagesARRAY = this.getTranslatableLanguages ();
								..............................................................

								NOTES
								- compare to the related =getLanguages= instance method
					*/
				},

				getLanguages:function () {
					var _project = this.project;
					return Uize.push (
						_getTranslatableLanguages (this),
						[_project.primaryLanguage,_project.pseudoLocale]
					);
					/*?
						Instance Methods
							getLanguages
								Returns an array, containing the locale codes for all the languages configured for the project, including the primary language and the pseudo-locale.

								SYNTAX
								......................................
								languagesARRAY = this.getLanguages ();
								......................................

								NOTES
								- compare to the related =getTranslatableLanguages= instance method
					*/
				},

				distributeResources:function (_resources,_language) {
					var
						m = this,
						_project = m.project
					;
					Uize.forEach (
						_resources,
						function (_resourceFileStrings,_resourceFileSubPath) {
							var _resourceFileFullPath =
								_project.rootFolderPath + '/' + m.getLanguageResourcePath (_resourceFileSubPath,_language)
							;
							_fileSystem.writeFile ({
								path:_resourceFileFullPath,
								contents:Uize.Build.Util.Whitespace.alterNormalizedWhitespace (
									m.serializeResourceFile (
										_project.skipEmptyValues === true
											? _removeEmptyStrings (_resourceFileStrings)
											: _resourceFileStrings,
										_getResourceFileInfo (m,_resourceFileFullPath,_language)
									),
									_project.resourceFileWhitespace
								)
							});
						}
					);
					/*?
						Instance Methods
							distributeResources
								Distributes the resource strings from the specified project resource strings object to a project's codebase as resource files.

								SYNTAX
								..........................................................
								this.distributeResources (stringResourcesOBJ,languageSTR);
								..........................................................

								The =distributeResources= method iterates through the project resource strings object passed to it and uses the =serializeResourceFile= instance method to generate the contents for resource files that are then written to the codebase of the project. A language identifier should be passed to the =languageSTR= parameter so that the =distributeResources= method can know for which language resource files are to be generated - this information will govern the naming of the generated files.

								In addition to being used internally in the implementation of the =import= localization service method, the =distributeResources= method can be used in the implementation of the =extract= localization service method for generating resource files for the primary language, based upon resource strings that have been extracted from the project's source code files.

								NOTES
								- see the related =serializeResourceFile= instance method
								- see also the companion =gatherResources= instance method
					*/
				},

				prepareToExecuteMethod:function (_totalSteps) {
					this._methodTotalSteps = _totalSteps;
					this._methodCompletedSteps = 0;
					/*?
						Instance Methods
							prepareToExecuteMethod
								Prepares the method progress logger to expect the specified number of total steps to be performed during execution of a method.

								SYNTAX
								............................................
								this.prepareToExecuteMethod (totalStepsINT);
								............................................

								The =prepareToExecuteMethod= method is used internally in the implementations for localization service methods, such as the =export= method. When used, it should be called early in the execution of a localization method, after the scope of the method's work has been determined, but before any of the work has been performed. Thereafter, the related =stepCompleted= and =methodExecutionComplete= methods should be used.

								NOTES
								- see the related =stepCompleted= and =methodExecutionComplete= instance methods
					*/
				},

				stepCompleted:function (_message) {
					this._log (_message,++this._methodCompletedSteps / this._methodTotalSteps);
					/*?
						Instance Methods
							stepCompleted
								Informs the method progress logger of the completion of one of the steps of a localization service method's execution.

								SYNTAX
								................................
								this.stepCompleted (messageSTR);
								................................

								The =stepCompleted= method is used internally in the implementations for localization service methods, such as the =export= method. When used, it should be called during the execution of a localization service method, exactly as many times as the number of total steps specified when earlier calling the =prepareToExecuteMethod= method. A string value should be passed for the =messageSTR= parameter, so that information about the step that has been completed can be logged.

								NOTES
								- see the related =prepareToExecuteMethod= and =methodExecutionComplete= instance methods
					*/
				},

				methodExecutionComplete:function (_summary) {
					this._log (_summary,'summary');
					/*?
						Instance Methods
							methodExecutionComplete
								Informs the method progress logger of the completion of a localization service method's execution.

								SYNTAX
								..........................................
								this.methodExecutionComplete (summarySTR);
								..........................................

								The =methodExecutionComplete= method is used internally in the implementations for localization service methods, such as the =export= method. When used, it should be called after all steps in the execution of a method have been completed. A string value should be passed for the =summarySTR= parameter, so that summary information can be logged for the method.

								NOTES
								- see the related =prepareToExecuteMethod= and =stepCompleted= instance methods
					*/
				},

				gatherResources:function () {
					var
						m = this,
						_resources = {},
						_project = m.project,
						_primaryLanguage = _project.primaryLanguage,
						_resourceFiles = _fileSystem.getFiles ({
							path:_project.rootFolderPath,
							pathMatcher:function (_filePath) {return m.isResourceFile (_filePath)},
							recursive:true
						})
					;
					Uize.forEach (
						_resourceFiles,
						function (_filePath) {
							try {
								_resources [_filePath] = _parseResourceFile (m,_filePath,_primaryLanguage);
							} catch (_error) {
								console.log (
									'ERROR: problem parsing file ' + _filePath + '\n' +
									_error
								);
							}
						}
					);
					return _resources;
					/*?
						Instance Methods
							gatherResources
								Returns a project resource strings object, being the complete set of resource strings for the primary language of a project, as parsed from all the primary language resource files of the project.

								SYNTAX
								.............................................
								stringResourcesOBJ = this.gatherResources ();
								.............................................

								The =gatherResources= method recurses through all the folders under the configured root folder path for a project, finding all the resource files (as determined by the =isResourceFile= instance method), and parses the resource strings from these files using the =parseResourceFile= instance method. The parsed resource strings are populated into the master project resource strings object.

								NOTES
								- see the related =isResourceFile= and =parseResourceFile= instance methods
								- see also the companion =distributeResources= instance method
					*/
				},

				getLanguageResourcePath:function () {
					throw new Error ('The getLanguageResourcePath method must be implemented.');
					/*?
						Instance Methods
							getLanguageResourcePath
								Returns a string, representing the file path for a language specific version of the specified primary language resource file.

								SYNTAX
								............................................................................................
								resourcePathSTR = this.getLanguageResourcePath (primaryLanguageResourcePathSTR,languageSTR);
								............................................................................................

								The =primaryLanguageResourcePathSTR= parameter is used to specify the path for the primary language version of a specific resource file, while the =languageSTR= parameter is used to specify the language for which a language specific resource file path should be generated.

								The implementation of the =getLanguageResourcePath= method should take the values for these two parameters and then use the project specific rules for resource file naming and organization to derive the path for the language specific version of the resource file and return this path.

								The =getLanguageResourcePath= method is used when generating resource files in the codebase for all the translatable languages configured for a project. This method *must* be overridden by subclasses, since the base class' version contains no implementation and will throw an exception if called.
					*/
				},

				isBrandResourceFile:function (_filePath) {
					return !!this.getResourceFileBrand (_filePath);
					/*?
						Instance Methods
							isBrandResourceFile
								Returns a boolean, indicating whether or not the specified file path is for a brand resource file.

								SYNTAX
								.................................................................
								isBrandResourceFileBOOL = this.isBrandResourceFile (filePathSTR);
								.................................................................

								The implementation of this method, provided in this base class, leverages the related =getResourceFileBrand= instance method and returns =true= if the value returned by the =getResourceFileBrand= method is truthy. This method can be optionally overridden by subclasses to determine if a resource file is for a brand in a different manner.

								NOTES
								- see also the related =getResourceFileBrand= instance method
					*/
				},

				isBrandResourceString:function (_resourceStringPath) {
					return !!this.getStringBrand (_resourceStringPath);
					/*?
						Instance Methods
							isBrandResourceString
								Returns a boolean, indicating whether or not the specified resource string is for a brand.

								SYNTAX
								.................................................................................
								isBrandResourceStringBOOL = this.isBrandResourceString (resourceStringPathARRAY);
								.................................................................................

								The implementation of this method, provided in this base class, leverages the related =getStringBrand= instance method and returns =true= if the value returned by the =getStringBrand= method is truthy.

								This method can be optionally overridden by subclasses, if it is necessary to determine if a resource string is for a brand in some different manner. When the =isBrandResourceString= method is called, it is passed a value for the =resourceStringPathARRAY= parameter that is a path array, where the last element can be regarded as the string key. An implementation for this method may use any elements of the path array to determine whether or not the string is for a brand.

								NOTES
								- see also the related =getStringBrand= instance method
					*/
				},

				getResourceFileBrand:function (_filePath) {
					return '';
					/*?
						Instance Methods
							getResourceFileBrand
								Returns a string, representing the brand ID for the specified resource file, or an empty string if the resource file is brand-neutral.

								SYNTAX
								.............................................................
								brandIdSTR = this.getResourceFileBrand (resourceFilePathSTR);
								.............................................................

								The implementation of this method, provided in this base class, simply returns an empty string. This method can be optionally overridden by subclasses, for projects that support branded resources.

								NOTES
								- compare to the related =getStringBrand= instance method
					*/
				},

				getStringBrand:function (_stringPath) {
					return '';
					/*?
						Instance Methods
							getStringBrand
								Returns a string, representing the brand ID for the specified resource string, or an empty string if the resource string is brand-neutral.

								SYNTAX
								...................................................
								brandIdSTR = this.getStringBrand (stringPathARRAY);
								...................................................

								The implementation of this method, provided in this base class, simply returns an empty string. This method can be optionally overridden by subclasses, for projects that support branded resources.

								When the =getStringBrand= method is called, a value is passed for the =stringPathARRAY= parameter that specifies the full path to the string, where the first element in the path array specifies the path for the resource file to which the string belongs, and the remaining elements of the path array specify the location of the string internal to the resource file (this may consist of simply a key element, or multiple elements if the resource files for a project are hierarchical rather than flat).

								NOTES
								- compare to the related =getResourceFileBrand= instance method
					*/
				},

				stringHasHtml:function (_stringPath,_value) {
					return /<[^<]+>/.test (_value); // NOTE: this is not the most robust test, so probably RegExpComposition should be used
					/*?
						Instance Methods
							stringHasHtml
								Returns a boolean, indicating whether or not the specified string contains HTML tags.

								SYNTAX
								..................................................................
								hasHtmlBOOL = this.stringHasHtml (stringPathARRAY,stringValueSTR);
								..................................................................

								The implementation of this method, provided in this base class, performs a very simple (and performant), regular expression match based test to determine if a string contains HTML tags. Some projects may use a format for substitution tokens that resembles the HTML tag format, and this may confuse the test in the base class' implementation of this method. In such cases, this method can be overridden in a subclass.

								When the =stringHasHtml= method is called, two parameters are passed to it: =stringPathARRAY= and =stringValueSTR=.

								stringPathARRAY
									An array, specifying the full path to the string.

									The path can be used to determine if a string contains HTML if the project organizes resource strings in such a way that strings that contain HTML are either separated in some way from those that don't, or if some naming convention is used for the string keys (or other elements of the string path array) to indicate that a string contains HTML.

								stringValueSTR
									A string, representing the actual text of the resource string.

									With the value of a resource string, a regular expression match or other form of test (such as HTML parsing) can be performed to determine if the string contains HTML tags.

								NOTES
								- the result returned by this method is used by the =metrics= method when producing its metrics report
					*/
				},

				isStringLong:function (_stringMetrics) {
					return _stringMetrics.words > 50 || _stringMetrics.chars > 500;
					/*?
						Instance Methods
							isStringLong
								Returns a boolean, indicating whether or not a string is considered to be long.

								SYNTAX
								..................................................
								isLongBOOL = this.isStringLong (stringMetricsOBJ);
								..................................................

								The implementation of this method, provided in this base class, judges a string to be long if it contains more than 50 words or more than 500 characters.

								When the =isStringLong= method is called, a string metrics object is passed as a value to the =stringMetricsOBJ= parameter. The string metrics object is generated by the =Uize.Loc.Strings.Metrics.getMetrics= method of the =Uize.Loc.Strings.Metrics= module and contains information on the word count and character count of the string. This information can be used in the implementation of the =isStringLong= method.

								NOTES
								- the result returned by this method is used by the =metrics= method when producing its metrics report
					*/
				},

				isStringKeyValid:function (_stringPath) {
					return true;
					/*?
						Instance Methods
							isStringKeyValid
								Returns a boolean, indicating whether or not a string's key is valid.

								SYNTAX
								......................................................
								isValidBOOL = this.isStringKeyValid (stringPathARRAY);
								......................................................

								The implementation of this method, provided in this base class, always returns the value =true=.

								When the =isStringKeyValid= method is called, a value is passed for the =stringPathARRAY= parameter that specifies the full path to the string. Generally, the key is considered to be the very last element in the string path array, but an implementation of this method can use any or all of the elements of the path array to determine if the string's "key" is valid.

								NOTES
								- the result returned by this method is used by the =metrics= method when producing its metrics report
					*/
				},

				isTokenWeak:function (_tokenName) {
					return _tokenName.length < 3 || /^\d+$/.test (_tokenName);
					/*?
						Instance Methods
							isTokenWeak
								Returns a boolean, indicating whether or not the name of a substitution token is considered weak.

								SYNTAX
								.............................................
								isWeakBOOL = this.isTokenWeak (tokenNameSTR);
								.............................................

								The implementation of this method, provided in this base class, judges the name of a token to be weak if it is less than three characters in length, or if it is a number.

								When the =isTokenWeak= method is called, the name of a token to test is passed to the =tokenNameSTR= parameter. An implementation of this method can use any criteria suitable to the project to determine whether or not a token name is weak.

								NOTES
								- the result returned by this method is used by the =metrics= method when producing its metrics report
					*/
				},

				isTranslatableString:function (_stringInfo) {
					return true;
					/*?
						Instance Methods
							isTranslatableString
								Returns a boolean, indicating whether or not the specified string is translatable.

								SYNTAX
								...............................................................
								isTranslatableBOOL = this.isTranslatableString (stringInfoOBJ);
								...............................................................

								The implementation of this method, provided in this base class, always returns the value =true=. If the resource files for a project are expected to contain any strings that should never be translated, then this method should be overridden in an adapter subclass for the project to return the value =false= for such strings.

								When the =isTranslatableString= method is called, a value is passed for the =stringInfoOBJ= parameter that provides information about the string and is of the form...

								STRING INFO
								................................................
								{
									key:keySTR,     // the key of the string path
									value:valueSTR  // the text of the string
								}
								................................................

								Techniques for Determining Translatability
									An implementation of the =isTranslatableString= method can use any criteria suitable to the project to determine whether or not a given string is translatable.

									In one approach, a special naming convention could be used for string keys to indicate strings that should not be translated, and then the implementation of this method can perform a test using the value of the =key= property of the string info object.

									Alternatively, or in addition to, the text of the string can be used to determine whether or not it is translatable. For example, a regular expression based match could be used to detect strings whose values are URLs, phone numbers, e-mail addresses, etc. that should not be translated.

								How the Result is Used
									The value returned by the =isTranslatableString= method is used to determine whether or not a string's value should be pseudo-localized by the =pseudoLocalizeString= instance method, and whether or not a string's value should be exported into translation jobs by the =exportJobs= instance method.

								Pure Whitespace is Not Translatable
									The =isTranslatableString= method is never called for strings whose values are either empty or pure whitespace (containing no non-whitespace characters).

									It is not often that the value of a string for the primary language of a project is pure whitespace, but this does occur from time to time. In such cases, these strings are always considered non-translatable.
					*/
				},

				pseudoLocalizeString:function (_stringInfo,_pseudoLocalizeOptions) {
					return Uize.Loc.Pseudo.pseudoLocalize (_stringInfo.value,_pseudoLocalizeOptions);
					/*?
						Instance Methods
							pseudoLocalizeString
								Returns a string, being a pseudo-localized version of the specified resource string.

								SYNTAX
								............................................................................................
								pseudoLocalizedSTR = this.pseudoLocalizeString (stringInfoOBJ,pseudoLocalizationOptionsOBJ);
								............................................................................................

								When the resource strings for a project are exported using the =export= localization service method, pseudo-localized values for all translatable strings are automatically generated for the configured pseudo-locale of the project. These pseudo-localized values are created by calling the =pseudoLocalizeString= method.

								The implementation of this method, provided in this base class, pseudo-localizes resource strings by calling the =Uize.Loc.Pseudo.pseudoLocalize= method of the =Uize.Loc.Pseudo= module. This behavior is generally adequate for most projects. However, the implementation of this method can optionally be overridden in an adapter subclass for a project if any kind of special handling might be needed for specific strings, or if a different process of pseudo-localization needs to be employed.

								When the =pseudoLocalizeString= method is called, two parameters are passed to it: =stringInfoOBJ= and =stringValueSTR=.

								stringInfoOBJ
									An object that provides information about the string, of the form...

									STRING INFO
									...........................................................
									{
										key:keySTR,      // the key of the string path
										value:valueSTR,  // the text of the string
										path:pathSTR     // the full path of the resource string
									}
									...........................................................

									An implementation of this method can optionally use the values of the =key= or =path= properties of the string info object to conditionalize how pseudo-localized versions of resource strings should be derived from the =value= property of the string info object.

								pseudoLocalizationOptionsOBJ
									An object, containing the configured pseudo-localization options for the project.

									The properties of this options object will depend upon the configuration of the project and the pseudo-localization process being used.
					*/
				},

				isResourceFile:function (_filePath) {
					throw new Error ('The isResourceFile method must be implemented.');
					/*?
						Instance Methods
							isResourceFile
								Returns a boolean, indicating whether or not the specified file is a resource file.

								SYNTAX
								.......................................................
								isResourceFileBOOL = this.isResourceFile (filePathSTR);
								.......................................................

								The implementation of this method, provided in this base class, throws an error. This means that this method *must* be overridden by an adapter subclass for a project.

								When the =isResourceFile= method is called, it is passed a value for the =filePathSTR= parameter that specifies the path for the file being tested, that is relative to the configured root folder path for the project.

								An implementation for this method can perform any test against the file path to determine whether or not the file is a resource file. Assuming that a project follows a sensible naming convention for resource files, it is quite reasonable to use a regular epxression based match.

								NOTES
								- see also the related =isBrandResourceFile= and =getResourceFileBrand= instance methods
					*/
				},

				parseResourceFile:function (_resourceFileText,_resourceFileInfo) {
					throw new Error ('The parseResourceFile method must be implemented.');
					/*?
						Instance Methods
							parseResourceFile
								Returns a resource strings object, being the resource strings parsed from the specified resource file.

								SYNTAX
								......................................................................................
								resourceStringsOBJ = this.parseResourceFile (resourceFileTextSTR,resourceFileInfoOBJ);
								......................................................................................

								The implementation of this method, provided in this base class, throws an error. This means that this method *must* be overridden by an adapter subclass for a project.

								When the =parseResourceFile= method is called, two parameters are passed to it: =resourceFileTextSTR= and =resourceFileInfoOBJ=.

								resourceFileTextSTR
									A string, representing the text contents of the resource file being parsed.

								resourceFileInfoOBJ
									An object, providing additional information about the resource file being parsed, of the form...

									RESOURCE FILE INFO
									..........................................
									{
										path:filePathSTR,
										language:localeSTR,
										isPrimaryLanguage:isPrimaryLanguageBOOL
									}
									..........................................

									An implementation of the =parseResourceFile= method can optionally use any or all of the information contained inside the resource file info object to conditionalize how a resource file is parsed.

									Primary Language Value Defaulting
										Some resource file formats follow a convention of using the text for the primary language version of resource strings as string keys, and often the values in the primary language resource files are left blank.

										But, to satisfy the needs of the localization service adapter, string values must not be empty for internal operations. In such cases, then, the implementation of the =parseResourceFile= method in the adapter subclass for the project can default the values to the keys when parsing the resource files for the primary language, but not perform this defaulting behavior for resource files for the translatable languages.

								NOTES
								- see the companion =serializeResourceFile= instance method
								- the =parseResourceFile= method is used in the implementations of the =gatherResources= and =export= instance methods
					*/
				},

				serializeResourceFile:function (_strings,_resourceFileInfo) {
					throw new Error ('The serializeResourceFile method must be implemented');
					/*?
						Instance Methods
							serializeResourceFile
								Returns a string, being the specified resource strings object serialized to the text contents of a resource file.

								SYNTAX
								..........................................................................................
								resourceFileTextSTR = this.serializeResourceFile (resourceStringsOBJ,resourceFileInfoOBJ);
								..........................................................................................

								The implementation of this method, provided in this base class, throws an error. This means that this method *must* be overridden by an adapter subclass for a project.

								When the =serializeResourceFile= method is called, two parameters are passed to it: =resourceStringsOBJ= and =resourceFileInfoOBJ=.

								resourceStringsOBJ
									An object, containing the resource strings that should be serialized to produce the resulting resource file text.

								resourceFileInfoOBJ
									An object, providing additional information about the resource file being serialized, of the form...

									RESOURCE FILE INFO
									..........................................
									{
										path:filePathSTR,
										language:localeSTR,
										isPrimaryLanguage:isPrimaryLanguageBOOL
									}
									..........................................

									An implementation of the =serializeResourceFile= method can optionally use any or all of the information contained inside the resource file info object to conditionalize how a resource file is serialized.

									In particular, certain resource file formats may require that the language of the strings contained inside a file be specified in some internal markup inside the file, such as in an XML tag attribute. Using the value of the =language= property of the resource file info object, the serializer can represent the language in the serialized resource file text in whatever way is appropriate for the resource file format being used by a project.

								NOTES
								- see the companion =parseResourceFile= instance method
								- the =serializeResourceFile= method is used in the implementation of the =distributeResources= instance method
					*/
				},

				getReferencingCodeFiles:function () {
					throw new Error ('The getReferencingCodeFiles method must be implemented');
					/*?
						Instance Methods
							getReferencingCodeFiles
								Returns an array of file paths, representing the code files in a project's codebase that may contain references to resource strings.

								SYNTAX
								.................................................
								filePathsARRAY = this.getReferencingCodeFiles ();
								.................................................

								The implementation of this method, provided in this base class, throws an error. This means that, if the =usage= localization service method is to be used for a project, then this method *must* be overridden by the adapter subclass for the project.

								The =getReferencingCodeFiles= method is not passed any parameters when it is called. As an instance method, an implementation for this method can access the project properties through the properties of the instance. The implementation can determine the list of referencing files in any way that suits the nature of the project. The only requirement is that the method return an array of file paths.

								The =usage= method iterates over the list of referencing files that is returned by this method and, for each file, uses the =getReferencesFromCodeFile= instance method to obtain the file's resource string references.

								NOTES
								- see also the related =usage= and =getReferencesFromCodeFile= instance methods
					*/
				},

				getReferencesFromCodeFile:function (_filePath) {
					throw new Error ('The getReferencesFromCodeFile method must be implemented');
					/*?
						Instance Methods
							getReferencesFromCodeFile
								Returns a string references lookup object, representing the information for zero or more resource string references detected within the specified code file.

								SYNTAX
								...................................................................
								stringReferencesOBJ = this.getReferencesFromCodeFile (filePathSTR);
								...................................................................

								The =usage= method iterates over the list of referencing files that is returned by the =getReferencingCodeFiles= instance method and, for each file, uses the =getReferencesFromCodeFile= instance method to obtain the file's resource string references.

								The implementation of this method, provided in this base class, throws an error. This means that, if the =usage= localization service method is to be used for a project, then this method *must* be overridden by the adapter subclass for the project.

								When the =getReferencesFromCodeFile= method is called, the file path for a code file is passed to its =filePathSTR= parameter. As an instance method, an implementation for this method can access the project properties through the properties of the instance.

								The implementation can detect resource string references in any way that suits the nature of the project and the language(s) of its code files. The only requirement is that the method return a lookup object of string references arrays, where the keys of the lookup object are string ID's, and where the values of the lookup are references arrays containing any number of reference info objects describing the references to the string within the code file.


								STRING REFERENCES LOOKUP OBJECT
								..........................
								{
									myString1:[
										{
											// reference info
										},
										{
											// reference info
										},
										...
									],
									myString2:[
										{
											// reference info
										},
										{
											// reference info
										},
										...
									],
									...
									...
									...
									myStringN:[
										{
											// reference info
										},
										{
											// reference info
										},
										...
									]
								}
								..........................

								The information that is returned in the string reference objects is left to the discretion of the adapter subclass for the project. The following structure is recommended as a guideline...

								STRING REFERENCE OBJECT
								................................................................................
								{
									reference:referenceTextSTR,
									start:{
										line:startLineINT,          // the line number where the reference starts
										lineChar:startLineCharINT,  // the starting character on the starting line
										char:startCharINT           // the starting character within the file
									},
									end:{
										line:endLineINT,            // the line number where the reference ends
										lineChar:endLineCharINT,    // the ending character on the ending line
										char:endCharINT             // the ending character within the file
									}
								}
								................................................................................

								NOTES
								- see also the related =usage= and =getReferencingCodeFiles= instance methods
					*/
				},

				doesBrandSupportLanguage:function (_brand,_language) {
					var _project = this.project;
					if (_language == _project.pseudoLocale) {
						return true;
					} else {
						var
							_brandLanguages = _project.brandLanguages,
							_languagesForBrand = _brand && _brandLanguages && _brandLanguages [_brand]
						;
						return _languagesForBrand ? Uize.isIn (_languagesForBrand,_language) : true;
					}
					/*?
						Instance Methods
							doesBrandSupportLanguage
								Returns a boolean, indicating whether or not the specified brand supports the specified language.

								SYNTAX
								..............................................................................
								supportsLanguageBOOL = this.doesBrandSupportLanguage (brandIdSTR,languageSTR);
								..............................................................................

								Whether or not a particular language is supported for a brand is governed by the brand language configuration for a project. Internally, the =doesBrandSupportLanguage= method is used in the implementation of the =export= localization service method to determine if branded resource strings should be gathered for any given translatable language for which strings are being exported.

								If an empty string is specified for the =brandIdSTR= parameter, or if the language identifier for the pseudo-locale that is configured for the project is specified for the =languageSTR= parameter, then the =doesBrandSupportLanguage= method will return the value =true=.

								NOTES
								- see the related =getResourceFileBrand= and =getStringBrand= instance methods
					*/
				},

				'import':function (_params,_callback) {
					var
						m = this,
						_project = m.project,
						_importPrimary = _project.importPrimary
					;
					function _importLanguage (_language) {
						var _resources = _readLanguageResourcesFile (m,_language);
						m.stepCompleted (_language + ': read language resources file');
						_resources && m.distributeResources (_resources,_language);
						m.stepCompleted (_language + ': distributed strings to individual resource files');
					}
					m.prepareToExecuteMethod ((_getTranslatableLanguages (m).length + 1 + !!_importPrimary) * 2);
					_importPrimary && _importLanguage (_project.primaryLanguage);
					_forEachTranslatableLanguage (m,_importLanguage);
					_importLanguage (_project.pseudoLocale);
					_callback ();
				},

				'export':function (_params,_callback) {
					var
						m = this,
						_project = m.project,
						_rootFolderPath = _project.rootFolderPath,
						_primaryLanguageResources = m.gatherResources (),
						_primaryLanguage = _project.primaryLanguage,
						_primaryLanguageResourcesLast = _readLanguageResourcesFile (m,_primaryLanguage) || {},
						_primaryLanguageResourcesDiff = Uize.Data.Diff.diff (
							_primaryLanguageResourcesLast,
							_primaryLanguageResources,
							null,
							{skeleton:true}
						),
						_resoucesByLanguage = Uize.pairUp (_primaryLanguage,_primaryLanguageResources),
						_totalTranslatableLanguages = _getTranslatableLanguages (m).length
					;

					m.prepareToExecuteMethod (
						_totalTranslatableLanguages * Uize.totalKeys (_primaryLanguageResources) +
							// total number of resource files to gather, across all translatable languages
						_totalTranslatableLanguages + 2
							// number of language resource files to write (includes primary language and pseudo-locale)
					);

					/*** gather resources for all translatable languages ***/
						_forEachTranslatableLanguage (
							m,
							function (_language) {
								var _languageResources = _resoucesByLanguage [_language] = {};
								Uize.forEach (
									_primaryLanguageResources,
									function (_resourceFileStrings,_resourceFileSubPath) {
										var
											_resourceFilePath = m.getLanguageResourcePath (_resourceFileSubPath,_language),
											_resourceFileBrand = m.getResourceFileBrand (_resourceFileSubPath)
										;
										if (m.doesBrandSupportLanguage (_resourceFileBrand,_language)) {
											_languageResources [_resourceFileSubPath] = Uize.Loc.Strings.Util.initNonTranslatable (
												Uize.Data.Diff.diff (
													_parseResourceFile (m,_resourceFilePath,_language),
													_primaryLanguageResourcesDiff [_resourceFileSubPath],
													function (_gatheredProperty,_propertyDiff,_path) {
														return (
															!_propertyDiff || _propertyDiff.value == 'removed' ||
															!m.doesBrandSupportLanguage (m.getStringBrand (_path),_language)
																? _undefined
																: {
																	value:_propertyDiff.value == 'modified'
																		? ''
																		: _gatheredProperty ? _gatheredProperty.value : ''
																}
														);
													},
													{skeleton:true}
												),
												_resourceFileStrings,
												_params.initNonTranslatable,
												function (_string) {return _isTranslatableString (m,_string)}
											);
											m.stepCompleted ('Gathered resources from file: ' + _resourceFilePath);
										} else {
											m.stepCompleted (
												'Skipped resource file (' + _language + ' not supported by brand ' + _resourceFileBrand + '): ' + _resourceFilePath
											);
										}
									}
								);
							}
						);

					/*** generate resources for pseudo-locale ***/
						_resoucesByLanguage [_project.pseudoLocale] = _pseudoLocalizeResources (m,_primaryLanguageResources);

					Uize.forEach (
						_resoucesByLanguage,
						function (_languageResources,_language) {
							_writeLanguageResourcesFile (m,_language,_languageResources);
							m.stepCompleted ('Created resources file for language: ' + _language);
						}
					);
					_callback ();
				},

				exportJobs:function (_params,_callback) {
					var
						m = this,
						_project = m.project,
						_primaryLanguage = _project.primaryLanguage,
						_primaryLanguageResources = _readLanguageResourcesFile (m,_primaryLanguage),
						_totalTranslatableLanguages = _getTranslatableLanguages (m).length,
						_filter = _params.filter || 'missing',
						_filterIsAll = _filter == 'all',
						_filterIsTranslated = _filter == 'translated'
					;
					m.prepareToExecuteMethod (_totalTranslatableLanguages * 3);

					_forEachTranslatableLanguage (
						m,
						function (_language) {
							/*** determine strings that need translation ***/
								var
									_languageResources = _readLanguageResourcesFile (m,_language) || {},
									_translationJobStrings = Uize.Data.Diff.diff (
										_languageResources,
										_primaryLanguageResources,
										function (_languageString,_primaryLanguageString) {
											return (
												_languageString &&
												(_filterIsAll || !!_languageString.value == _filterIsTranslated) &&
												_isTranslatableString (m,_primaryLanguageString)
													? _primaryLanguageString
													: _undefined
											);
										}
									),
									_jobsPath = m._workingFolderPath + 'jobs/'
								;
								m.stepCompleted (_language + ': determined strings that need translation');

							/*** calculate metrics for translation job ***/
								_calculateMetricsForLanguage (m,_language,_translationJobStrings,'jobs/');
								m.stepCompleted (_language + ': calculated translation job metrics');

							/*** write translation job file ***/
								_fileSystem.writeFile ({
									path:_getTranslationJobFilePath (m,_language),
									contents:_project.translationJobFileFormat == 'xliff'
										? Uize.Loc.FileFormats.ProjectStrings.Xliff.to (
											{
												sourceLanguage:_primaryLanguage,
												targetLanguage:_language,
												strings:_translationJobStrings
											},
											{
												seedTarget:_filterIsAll || _filterIsTranslated ? _languageResources : true,
												tokenSplitter:m.tokenRegExp
											}
										)
										: Uize.Loc.FileFormats.ProjectStrings.Csv.to (_translationJobStrings)
								});

								m.stepCompleted (_language + ': created translation job file');
						}
					);
					_callback ();
				},

				importJobs:function (_params,_callback) {
					var
						m = this,
						_project = m.project,
						_totalTranslatableLanguages = _getTranslatableLanguages (m).length,
						_jobsPath = m._workingFolderPath + 'jobs/'
					;
					m.prepareToExecuteMethod (_totalTranslatableLanguages * 2);

					_forEachTranslatableLanguage (
						m,
						function (_language) {
							/*** determine strings that have been translated ***/
								var
									_translationJobFilePath = _getTranslationJobFilePath (m,_language),
									_translationJobFile = _fileSystem.fileExists ({path:_translationJobFilePath})
										? _fileSystem.readFile ({path:_translationJobFilePath})
										: '',
									_translatedStrings = _translationJobFile
										? _removeEmptyStrings (
											_project.translationJobFileFormat == 'xliff'
												? Uize.Loc.FileFormats.ProjectStrings.Xliff.from (_translationJobFile)
												: Uize.Loc.FileFormats.ProjectStrings.Csv.from (_translationJobFile)
										)
										: {}
								;
								m.stepCompleted (_language + ': determined strings that have been translated');

							/*** update language resources file ***/
								if (!Uize.isEmpty (_translatedStrings))
									_writeLanguageResourcesFile (
										m,
										_language,
										Uize.Data.Diff.diff (
											_readLanguageResourcesFile (m,_language),
											_translatedStrings,
											function (_languageString,_translatedString) {
												return (
													_languageString
														? (_translatedString && _translatedString.value && _translatedString) ||
															_languageString
														: _undefined
												);
											},
											{skeleton:true}
										)
									)
								;
								m.stepCompleted (_language + ': updated language resources file');
						}
					);
					_callback ();
				},

				extract:function (_params,_callback) {
					throw new Error ('The extract method must be implemented');
				},

				metrics:function (_params,_callback) {
					var
						m = this,
						_primaryLanguage = m.project.primaryLanguage
					;
					m.prepareToExecuteMethod (2);

					/*** gather resources for primary language ***/
						var _primaryLanguageResources = m.gatherResources ();
						m.stepCompleted ('gathered resources for primary language');

					/*** calculate metrics for primary language ***/
						var _metrics = _calculateMetricsForLanguage (m,_primaryLanguage,_primaryLanguageResources,'');
						m.stepCompleted ('calculated metrics for primary language');

					/*** produce summary ***/
						/*** compile data for duplicates histogram ***/
							var _dupesHistogram = {};
							Uize.forEach (
								_metrics.dupedResourceStringsDetails,
								function (_resourceStringDupes) {
									var _dupeCount = _resourceStringDupes.length - 1;
									_dupesHistogram [_dupeCount] = (_dupesHistogram [_dupeCount] || 0) + 1;
								}
							);

						function _brandSpecificBreakdownTable (_title,_qualityMetrics) {
							var _countByCategory = Uize.pairUp (
								'All',_qualityMetrics.all,
								'Non Brand-specific',_qualityMetrics.all - _qualityMetrics.brandSpecific,
								'Brand-specific',_qualityMetrics.brandSpecific
							);
							Uize.forEach (
								_qualityMetrics.perBrand,
								function (_count,_brandId) {
									_countByCategory ['Brand: ' + _brandId] = _count;
								}
							);
							return _breakdownTable ({
								title:_title,
								countByCategory:_countByCategory
							});
						}

						m.methodExecutionComplete (
							_brandSpecificBreakdownTable ('Resource Files',_metrics.resourceFiles) + '\n' +
							_brandSpecificBreakdownTable ('Resource Strings',_metrics.resourceStrings) + '\n' +
							_brandSpecificBreakdownTable ('Word Count',_metrics.wordCount) + '\n' +
							_brandSpecificBreakdownTable ('Character Count',_metrics.charCount) + '\n' +
							Uize.Templates.Text.Tables.YinYangBreakdown.process ({
								title:'Resource Strings',
								countByCategory:{
									'All,None':_metrics.resourceStrings.all,
									'Brand-specific,Brand-neutral':_metrics.resourceStrings.brandSpecific,
									'Tokenized,Non-tokenized':_metrics.resourceStrings.tokenized,
									'HTML,Non-HTML':_metrics.resourceStrings.html,
									'Long,Normal':_metrics.resourceStrings.long,
									'Invalid Keys,Valid Keys':_metrics.resourceStrings.invalidKey,
									'Some Weak Tokens,Only Strong Tokens':_metrics.resourceStrings.weakTokens,
									'Non-translatable,Translatable':_metrics.resourceStrings.nonTranslatable
								}
							}) + '\n' +
							Uize.Templates.Text.Tables.Histogram.process ({
								title:'Histogram of Resource String Duplicates',
								columnTitles:{
									count:'Duplication Count',
									occurrences:'Occurrences',
									total:'Total Duplicates'
								},
								occurrencesByValue:_dupesHistogram
							}) + '\n' +
							Uize.Templates.Text.Tables.Histogram.process ({
								title:'Histogram of Resource String Tokenization',
								columnTitles:{
									count:'Tokens in String',
									occurrences:'Strings',
									total:'Total Tokens'
								},
								occurrencesByValue:_metrics.tokenHistogram
							})
						);

					_callback ();
				},

				pseudoLocalize:function (_params,_callback) {
					var m = this;
					m.prepareToExecuteMethod (3);

					/*** gather resources for primary language ***/
						var _primaryLanguageResources = m.gatherResources ();
						m.stepCompleted ('gathered resources for primary language');

					/**( pseudo-localize resources for primary language ***/
						var _pseudoLocalizedResources = _pseudoLocalizeResources (m,_primaryLanguageResources);
						m.stepCompleted ('pseudo-localized resources for primary language');

					/*** distributed pseudo-localized resources to individual resource files ***/
						m.distributeResources (_pseudoLocalizedResources,m.project.primaryLanguage);
						m.stepCompleted ('distributed pseudo-localized resources to individual resource files');

					_callback ();
				},

				usage:function (_params,_callback) {
					var
						m = this,
						_allReferencesLookup = {},
						_referencingFiles = m.getReferencingCodeFiles ()
					;

					m.prepareToExecuteMethod (_referencingFiles.length + 4);

					/*** build lookup of string references ***/
						Uize.forEach (
							_referencingFiles,
							function (_filePath) {
								Uize.forEach (
									m.getReferencesFromCodeFile (_filePath),
									function (_stringReferences,_stringId) {
										Uize.push (
											_allReferencesLookup [_stringId] || (_allReferencesLookup [_stringId] = []),
											Uize.map (
												_stringReferences,
												function (_stringReference) {
													return Uize.copyInto ({filePath:_filePath},_stringReference);
												}
											)
										);
									}
								);
								m.stepCompleted ('scanned for resource string references in file: ' + _filePath);
							}
						);

					/*** create index of resource string references by code file ***/
						var _stringsReferencesByCodeFile = {};
						Uize.forEach (
							_allReferencesLookup,
							function (_stringReferences,_stringId) {
								Uize.forEach (
									_stringReferences,
									function (_stringReference) {
										var
											_filePath = _stringReference.filePath,
											_stringsReferencesForCodeFile =
												_stringsReferencesByCodeFile [_filePath] ||
												(_stringsReferencesByCodeFile [_filePath] = {})
										;
										_stringsReferencesForCodeFile [_stringId] =
											(_stringsReferencesForCodeFile [_stringId] || 0) + 1
										;
									}
								);
							}
						);
						m.stepCompleted ('created index of resource string references by code file');

					/*** gather resources for primary language ***/
						var _primaryLanguageResources = m.gatherResources ();
						m.stepCompleted ('gathered resources for primary language');

					/*** analyze resource string usage ***/
						var
							_stringIdLookup = {},
							_unreferenced = [],
							_references = {},
							_multiReferenced = {},
							_referencesHistogram = {},
							_trueValue = {}
						;
						Uize.Data.Flatten.flatten (
							_primaryLanguageResources,
							function (_path) {
								var
									_stringId = _path.slice (1).join ('.'),
									_stringReferences = _allReferencesLookup [_stringId],
									_stringReferenceCount = _stringReferences ? _stringReferences.length : 0
								;
								_stringIdLookup [_stringId] = _trueValue;
								if (_stringReferenceCount) {
									_references [_stringId] = _stringReferences;
									if (_stringReferenceCount > 1)
										_multiReferenced [_stringId] = _stringReferenceCount
									;
								} else {
									_unreferenced.push (_stringId);
								}
								_referencesHistogram [_stringReferenceCount] =
									(_referencesHistogram [_stringReferenceCount] || 0) + 1
								;
							}
						);
						m.stepCompleted ('analyzed resource usage');

					/*** references to missing resource strings ***/
						var _missingStrings = {};
						Uize.forEach (
							_allReferencesLookup,
							function (_stringReferences,_stringId) {
								if (_stringIdLookup [_stringId] != _trueValue)
									_missingStrings [_stringId] = _stringReferences
								;
							}
						);

					/*** write report file ***/
						var _usageReportFilePath = m._workingFolderPath + 'metrics/usage-report.json';
						_fileSystem.writeFile ({
							path:_usageReportFilePath,
							contents:Uize.Json.to ({
								unreferenced:_unreferenced,
								multiReferenced:_multiReferenced,
								references:_references,
								referencesByCodeFile:_stringsReferencesByCodeFile,
								referencesHistogram:_referencesHistogram,
								missingStrings:_missingStrings
							})
						});
						m.stepCompleted ('created usage report file: ' + _usageReportFilePath);

					/*** produce summary ***/
						var
							_referencesValues = Uize.values (_references),
							_referencesValuesLength = _referencesValues.length,
							_unreferencedLength = _unreferenced.length
						;
						m.methodExecutionComplete (
							_twoGroupBreakdownTable (
								'Resource Strings',
								'Referenced',_referencesValuesLength,
								'Unreferenced',_unreferencedLength
							) + '\n' +
							Uize.Templates.Text.Tables.Histogram.process ({
								title:'Histogram of String References',
								columnTitles:{
									count:'References',
									occurrences:'Strings',
									total:'Total References'
								},
								occurrencesByValue:_referencesHistogram
							})
						);

					_callback ();
				},

				about:function (_params,_callback) {
					var _project = this.project;
					console.log (
						'\n' +
						'------------------------------- Project: ' + _project.name + ' -------------------------------\n\n' +
						Uize.Json.to (_project,{sortKeys:true}) +
						'\n'
					);

					_callback ();
				},

				preview:function (_params,_callback) {
					throw new Error ('The preview method is not implemented in this adapter.');
				},

				init:function (_params,_callback) {
					var
						m = this,
						_project = m.project = _params.project
					;

					/*** ensure that the languages property exists and is a superset of all the brand languages ***/
						var
							_languages = _project.languages || (_project.languages = []),
							_brandLanguages = _project.brandLanguages
						;
						if (_brandLanguages) {
							var _languagesLookup = Uize.lookup (_languages);
							Uize.forEach (
								_brandLanguages,
								function (_languagesForBrand) {
									Uize.forEach (
										_languagesForBrand,
										function (_language) {
											if (!_languagesLookup [_language]) {
												_languages.push (_language);
												_languagesLookup [_language] = true;
											}
										}
									);
								}
							);
						}

					m._workingFolderPath = m.workingFolderPath = _params.workingFolder + '/' + _project.name + '/';
					m._log = _params.log || Uize.nop;

					_callback ();
				}
			},

			instanceProperties:{
				wordSplitter:null,
				tokenRegExp:null
			}
		});
	}
});

