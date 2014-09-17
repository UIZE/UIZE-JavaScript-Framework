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
		'Uize.Data.NameValueRecords',
		'Uize.Data.Csv',
		'Uize.Loc.Xliff',
		'Uize.Loc.Pseudo',
		'Uize.Loc.Strings.Metrics',
		'Uize.Data.Diff',
		'Uize.Str.Whitespace',
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

		/*** Private Instance Methods ***/
			function _isTranslatableString (m,_stringInfo) {
				return _hasNonWhitespace (_stringInfo.value) && m.isTranslatableString (_stringInfo);
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
						_processStrings (
							_resourceFileStrings,
							function (_value,_path) {
								var
									_isTranslatable = _isTranslatableString (m,{key:_path [_path.length - 1],value:_value}),
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
								return _value;
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
					_project = m.project,
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
								function (_string) {
									if (_isTranslatableString (m,_string))
										_string.value = Uize.Loc.Pseudo.pseudoLocalize (_string.value,_pseudoLocalizeOptions)
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

			function _processStrings (_strings,_stringProcessor) {
				function _processSection (_section,_path) {
					for (var _key in _section) {
						var _value = _section [_key];
						if (Uize.isObject (_value)) {
							_processSection (_value,_path.concat (_key));
						} else if (typeof _value == 'string') {
							_section [_key] = _stringProcessor (_section [_key],_path.concat (_key));
						}
					}
				}
				_processSection (_strings,[]);
			}

		return _superclass.subclass ({
			instanceMethods:{
				getTranslatableLanguages:function () {return _getTranslatableLanguages (this)},

				getLanguages:function () {
					var _project = this.project;
					return Uize.push (_getTranslatableLanguages (this),[_project.primaryLanguage,_project.pseudoLocale]);
				},

				distributeResources:function (_resources,_language) {
					// NOTE: this method can be useful for implementation of the extract method
					var
						m = this,
						_rootFolderPath = m.project.rootFolderPath
					;
					Uize.forEach (
						_resources,
						function (_resourceFileStrings,_resourceFileSubPath) {
							var _resourceFileFullPath =
								_rootFolderPath + '/' + m.getLanguageResourcePath (_resourceFileSubPath,_language)
							;
							_fileSystem.writeFile ({
								path:_resourceFileFullPath,
								contents:m.serializeResourceFile (_resourceFileStrings,_language)
							});
						}
					);
				},

				prepareToExecuteMethod:function (_totalSteps) {
					this._methodTotalSteps = _totalSteps;
					this._methodCompletedSteps = 0;
				},

				stepCompleted:function (_message) {
					this._log (_message,++this._methodCompletedSteps / this._methodTotalSteps);
				},

				methodExecutionComplete:function (_summary) {
					this._log (_summary,'summary');
				},

				gatherResources:function () {
					var
						m = this,
						_resources = {},
						_rootFolderPath = m.project.rootFolderPath,
						_resourceFiles = _fileSystem.getFiles ({
							path:_rootFolderPath,
							pathMatcher:function (_filePath) {return m.isResourceFile (_filePath)},
							recursive:true
						})
					;
					Uize.forEach (
						_resourceFiles,
						function (_filePath) {
							try {
								_resources [_filePath] = m.parseResourceFile (
									_fileSystem.readFile ({path:_rootFolderPath + '/' + _filePath})
								);
							} catch (_error) {
								console.log (
									'ERROR: problem parsing file ' + _filePath + '\n' +
									_error
								);
							}
						}
					);
					return _resources;
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
					// this method can optionally be overridden by subclasses
					return !!this.getResourceFileBrand (_filePath);
				},

				isBrandResourceString:function (_resourceStringPath) {
					// this method can optionally be overridden by subclasses
					return !!this.getStringBrand (_resourceStringPath);
				},

				getResourceFileBrand:function (_filePath) {
					// this method should be implemented by subclasses
					return '';
				},

				getStringBrand:function (_resourceStringPath) {
					// this method should be implemented by subclasses
					return '';
				},

				stringHasHtml:function (_path,_value) {
					// this method can be overridden by subclasses
					return /<[^<]+>/.test (_value); // NOTE: this is not the most robust test, so probably RegExpComposition should be used
				},

				isStringLong:function (_stringMetrics) {
					// this method can be overridden by subclasses
					return _stringMetrics.words > 50 || _stringMetrics.chars > 500;
				},

				isStringKeyValid:function (_path) {
					// this method can be overridden by subclasses
					return true;
				},

				isTokenWeak:function (_tokenName) {
					// this method can be overridden by subclasses
					return _tokenName.length < 3 || /^\d+$/.test (_tokenName);
				},

				isTranslatableString:function (_stringInfo) {
					// this method should be implemented by subclasses
					/* NOTE:
						the _stringInfo argument is an object of the form...

						.................
						{
							key:keySTR,
							value:valueSTR
						}
						.................
					*/
					return true;
				},

				isResourceFile:function (_filePath) {
					throw new Error ('The isResourceFile method must be implemented.');
					// this method should be implemented by subclasses
				},

				parseResourceFile:function (_resourceFileText) {
					throw new Error ('The parseResourceFile method must be implemented.');
					// this method should be implemented by subclasses
				},

				serializeResourceFile:function (_strings) {
					throw new Error ('The serializeResourceFile method must be implemented');
					// this method should be implemented by subclasses
				},

				getReferencingCodeFiles:function () {
					throw new Error ('The getReferencingCodeFiles method must be implemented');
					// this method should be implemented by subclasses
				},

				getReferencesFromCodeFile:function (_filePath) {
					throw new Error ('The getReferencesFromCodeFile method must be implemented');
					// this method should be implemented by subclasses
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
											var _resourceFileFullPath = _rootFolderPath + '/' + _resourceFilePath;
											_languageResources [_resourceFileSubPath] = Uize.Data.Diff.diff (
												_fileSystem.fileExists ({path:_resourceFileFullPath})
													? m.parseResourceFile (_fileSystem.readFile ({path:_resourceFileFullPath}))
													: {}
												,
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
											);
											m.stepCompleted ('Gathered resources from file: ' + _resourceFilePath);
										} else {
											m.stepCompleted ('Skipped resource file (' + _language + ' not supported by brand ' + _resourceFileBrand + '): ' + _resourceFilePath);
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
						_totalTranslatableLanguages = _getTranslatableLanguages (m).length
					;
					m.prepareToExecuteMethod (_totalTranslatableLanguages * 3);

					_forEachTranslatableLanguage (
						m,
						function (_language) {
							/*** determine strings that need translation ***/
								var
									_translationJobStrings = Uize.Data.Diff.diff (
										_readLanguageResourcesFile (m,_language) || {},
										_primaryLanguageResources,
										function (_languageString,_primaryLanguageString) {
											return (
												_primaryLanguageString &&
												(!_languageString || !_languageString.value) &&
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
										? Uize.Loc.Xliff.to (
											{
												sourceLanguage:_primaryLanguage,
												targetLanguage:_language,
												strings:_translationJobStrings
											},
											{
												seedTarget:true,
												tokenSplitter:m.tokenRegExp
											}
										)
										: Uize.Data.Csv.to (
											Uize.Data.NameValueRecords.fromHash (
												Uize.Data.Flatten.flatten (
													_translationJobStrings,
													function (_path) {return Uize.Json.to (_path,'mini')}
												),
												0,
												1
											)
										)
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
										? Uize.Data.Diff.diff (
											_project.translationJobFileFormat == 'xliff'
												? Uize.Loc.Xliff.from (_translationJobFile)
												: Uize.Data.Flatten.unflatten (
													Uize.Data.NameValueRecords.toHash (Uize.Data.Csv.from (_translationJobFile),0,1),
													Uize.Json.from
												)
											,
											{},
											function (_string) {return _string.value ? _string : _undefined}
										)
										: {}
								;
								m.stepCompleted (_language + ': determined strings that have been translated');

							/*** update language resources file ***/
								if (!Uize.isEmpty (_translatedStrings))
									_writeLanguageResourcesFile (
										m,
										_language,
										Uize.mergeInto (_readLanguageResourcesFile (m,_language),_translatedStrings)
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
											_stringReferences
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

