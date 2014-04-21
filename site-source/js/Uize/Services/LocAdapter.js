Uize.module ({
	name:'Uize.Services.LocAdapter',
	required:[
		'Uize.Services.FileSystem',
		'Uize.Json',
		'Uize.Data.Flatten',
		'Uize.Data.NameValueRecords',
		'Uize.Data.Csv',
		'Uize.Data.Diff',
		'Uize.Loc.Pseudo',
		'Uize.Build.Util',
		'Uize.Str.Split'
	],
	superclass:'Uize.Service.Adapter',
	builder:function (_superclass) {
		'use strict';

		var
			_fileSystem = Uize.Services.FileSystem.singleton (),
			_split = Uize.Str.Split.split,
			_undefined
		;

		return _superclass.subclass ({
			instanceMethods:{
				_calculateMetricsForLanguage:function (_language,_languageResources,_metricsFilePath) {
					function _percent (_numerator,_denominator) {
						return ((_numerator / _denominator) || 0) * 100;
					}
					var
						m = this,
						_project = m.project,
						_totalResourceFiles = 0,
						_totalBrandSpecificResourceFiles = 0,
						_totalResourceStrings = 0,
						_totalBrandSpecificResourceStrings = 0,
						_totalWordCount = 0,
						_totalBrandSpecificWordCount = 0,
						_totalCharCount = 0,
						_totalBrandSpecificCharCount = 0,
						_totalTokens = 0,
						_totalTokenizedResourceStrings = 0,
						_totalDupedResourceStrings = 0,
						_currentResourceFileIsBrandSpecific,
						_valuesLookup = {},
						_dupedResourceStringsDetails = {},
						_tokenUsage = {}
					;
					Uize.forEach (
						_languageResources,
						function (_resourceFileStrings,_resourceFileSubPath) {
							var
								_wordCount = 0,
								_brandSpecificWordCount = 0,
								_charCount = 0,
								_brandSpecificCharCount = 0
							;
							_totalResourceFiles++;
							_totalBrandSpecificResourceFiles += (
								_currentResourceFileIsBrandSpecific = m.isBrandResourceFile (_resourceFileSubPath)
							);
							m.processStrings (
								_resourceFileStrings,
								function (_value,_path) {
									/*** update information on duplicates ***/
										var _stringFullPath = Uize.Json.to (
											[_resourceFileSubPath].concat (_path),
											{
												quoteChar:'"',
												indentChars:'',
												linebreakChars:''
											}
										);
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
											_stringMetrics = m.getStringMetrics (_value),
											_stringTokens = _stringMetrics.tokens,
											_stringTokensLength = _stringTokens.length
										;

										/*** update general metrics ***/
											_totalResourceStrings++;
											_wordCount += _stringMetrics.words;
											_charCount += _stringMetrics.chars;
											if (_currentResourceFileIsBrandSpecific || m.isBrandResourceString (_path,_value)) {
												_totalBrandSpecificResourceStrings++;
												_brandSpecificWordCount += _stringMetrics.words;
												_brandSpecificCharCount += _stringMetrics.chars;
											}

										/*** update metrics on tokenized strings and token usage ***/
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

									return _value;
								}
							);
							_totalWordCount += _wordCount;
							_totalCharCount += _charCount;
							_totalBrandSpecificWordCount += _brandSpecificWordCount;
							_totalBrandSpecificCharCount += _brandSpecificCharCount;
						}
					);
					_fileSystem.writeFile ({
						path:_metricsFilePath,
						contents:Uize.Json.to ({
							resourceFiles:_totalResourceFiles,
							brandSpecificResourceFiles:_totalBrandSpecificResourceFiles,
							brandSpecificResourceFilesPercent:_percent (_totalBrandSpecificResourceFiles,_totalResourceFiles),
							resourceStrings:_totalResourceStrings,
							brandSpecificResourceStrings:_totalBrandSpecificResourceStrings,
							brandSpecificResourceStringsPercent:
								_percent (_totalBrandSpecificResourceStrings,_totalResourceStrings),
							wordCount:_totalWordCount,
							brandSpecificWordCount:_totalBrandSpecificWordCount,
							brandSpecificWordCountPercent:_percent (_totalBrandSpecificWordCount,_totalWordCount),
							charCount:_totalCharCount,
							brandSpecificCharCount:_totalBrandSpecificCharCount,
							brandSpecificCharCountPercent:_percent (_totalBrandSpecificCharCount,_totalCharCount),
							tokens:_totalTokens,
							tokenizedResourceStrings:_totalTokenizedResourceStrings,
							tokenizedResourceStringsPercent:_percent (_totalTokenizedResourceStrings,_totalResourceStrings),
							dupedResourceStrings:_totalDupedResourceStrings,
							dupedResourceStringsPercent:_percent (_totalDupedResourceStrings,_totalResourceStrings),
							dupedResourceStringsDetails:_dupedResourceStringsDetails,
							tokenUsage:_tokenUsage
						})
					});
				},

				_pseudoLocalizeResources:function (_primaryLanguageResources) {
					var
						_pseudoLocalizedResources = {},
						_pseudoLocalizeOptions = {wordSplitter:this.wordSplitter}
					;
					Uize.forEach (
						_primaryLanguageResources,
						function (_resourceFileStrings,_resourceFileSubPath) {
							_pseudoLocalizedResources [_resourceFileSubPath] =
								Uize.Data.Diff.diff (
									_primaryLanguageResources [_resourceFileSubPath],
									{},
									function (_string) {
										return {value:Uize.Loc.Pseudo.pseudoLocalize (_string.value,_pseudoLocalizeOptions)};
									}
								)
							;
						}
					);
					return _pseudoLocalizedResources;
				},

				_prepareToExecuteMethod:function (_totalSteps) {
					this._methodTotalSteps = _totalSteps;
					this._methodCompletedSteps = 0;
				},

				_stepCompleted:function (_message) {
					this._log (_message,++this._methodCompletedSteps / this._methodTotalSteps);
				},

				languageResourcesFilePath:function (_language) {
					return this._workingFolderPath + _language + '.json';
				},

				readLanguageResourcesFile:function (_language) {
					var _languageResourcesFilePath = this.languageResourcesFilePath (_language);
					return (
						_fileSystem.fileExists ({path:_languageResourcesFilePath})
							? Uize.Json.from (_fileSystem.readFile ({path:_languageResourcesFilePath}))
							: _undefined
					);
				},

				writeLanguageResourcesFile:function (_language,_languageResources) {
					_fileSystem.writeFile ({
						path:this.languageResourcesFilePath (_language),
						contents:Uize.Json.to (_languageResources)
					});
				},

				forEachTranslatableLanguage:function (_iterationHandler) {
					var
						_project = this.project,
						_primaryLanguage = _project.primaryLanguage,
						_pseudoLocale = _project.pseudoLocale
					;
					Uize.forEach (
						_project.languages,
						function (_language) {
							_language != _primaryLanguage && _language != _pseudoLocale && _iterationHandler (_language);
						}
					);
				},

				distributeResources:function (_resources,_language) {
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
								contents:m.serializeResourceFile (_resourceFileStrings)
							});
						}
					);
				},

				gatherResources:function () {
					var
						m = this,
						_project = m.project,
						_currentFolderRelativePath,
						_currentFileRelativePath,
						_resources = {},
						_rootFolderPath = _project.rootFolderPath,
						_rootFolderPathLength = _rootFolderPath.length
					;
					Uize.Build.Util.buildFiles ({
						targetFolderPathCreator:function (_folderPath) {
							_currentFolderRelativePath = _folderPath.slice (_rootFolderPathLength + 1);
							return _folderPath;
						},
						targetFilenameCreator:function (_sourceFileName) {
							return (
								m.isResourceFile (_currentFileRelativePath = _currentFolderRelativePath + '/' + _sourceFileName)
									? _sourceFileName
									: null
							);
						},
						fileBuilder:function (_sourceFileName,_sourceFileText) {
							var
								_strings,
								_errorWithFile
							;
							try {
								_strings = m.parseResourceFile (_sourceFileText);
							} catch (_error) {
								_errorWithFile = _error + '';
							}
							_resources [_currentFileRelativePath] = _strings;
							return {logDetails:_errorWithFile ? '\tERROR: ' + _errorWithFile : ''};
						},
						alwaysBuild:true,
						dryRun:true,
						rootFolderPath:_rootFolderPath,
						logFilePath:''
					});
					return _resources;
				},

				getLanguageResourcePath:function (_enResourcePath,_language) {
					// this method should be implemented by subclasses
				},

				getStringMetrics:function (_sourceStr) {
					var
						_stringSegments = _split (_sourceStr,this.wordSplitter),
						_words = 0,
						_chars = 0,
						_tokenAdded = {},
						_tokens = []
					;
					if (this.tokenRegExp)
						_sourceStr.replace (
							this.tokenRegExp,
							function (_match,_tokenName) {
								if (!_tokenAdded [_tokenName]) {
									_tokens.push (_tokenName);
									_tokenAdded [_tokenName] = 1;
								}
							}
						)
					;
					for (
						var _stringSegmentNo = -2, _stringSegmentsLength = _stringSegments.length;
						(_stringSegmentNo += 2) < _stringSegmentsLength;
					)
						_chars += _stringSegments [_stringSegmentNo].length
					;
					return {
						words:(_stringSegmentsLength + 1) / 2,
						chars:_chars,
						tokens:_tokens
					};
				},

				isBrandResourceFile:function (_filePath) {
					// this method should be implemented by subclasses
					return false;
				},

				isBrandResourceString:function (_resourceStringPath,_resourceStringText) {
					// this method should be implemented by subclasses
					return false;
				},

				isResourceFile:function (_filePath) {
					// this method should be implemented by subclasses
				},

				parseResourceFile:function (_resourceFileText) {
					// this method should be implemented by subclasses
				},

				serializeResourceFile:function (_strings) {
					// this method should be implemented by subclasses
				},

				processStrings:function (_strings,_stringProcessor) {
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
				},

				'import':function (_params,_callback) {
					var
						m = this,
						_project = m.project,
						_primaryLanguage = _project.primaryLanguage,
						_languages = _project.languages
					;
					m._prepareToExecuteMethod ((_languages.length - !_project.importPrimary) * 2);
					Uize.forEach (
						_languages,
						function (_language) {
							if (_language != _primaryLanguage || _project.importPrimary) {
								var _resources = m.readLanguageResourcesFile (_language);
								m._stepCompleted (_language + ': read language resources file');
								_resources && m.distributeResources (_resources,_language,_project);
								m._stepCompleted (_language + ': distributed strings to individual resource files');
							}
						}
					);
					_callback ();
				},

				'export':function (_params,_callback) {
					var
						m = this,
						_project = m.project,
						_rootFolderPath = _project.rootFolderPath,
						_primaryLanguageResources = m.gatherResources (),
						_primaryLanguage = _project.primaryLanguage,
						_primaryLanguageResourcesLast = m.readLanguageResourcesFile (_primaryLanguage) || {},
						_primaryLanguageResourcesDiff = Uize.Data.Diff.diff (
							_primaryLanguageResourcesLast,
							_primaryLanguageResources
						),
						_resoucesByLanguage = Uize.pairUp (_primaryLanguage,_primaryLanguageResources),
						_totalLanguages = _project.languages.length,
						_totalTranslatableLanguages = _totalLanguages - 2
					;

					m._prepareToExecuteMethod (
						_totalTranslatableLanguages * Uize.totalKeys (_primaryLanguageResources) +
							// total number of resource files to gather, across all translatable languages
						_totalLanguages
							// number of language resources files to write
					);

					/*** gather resources for all translatable languages ***/
						m.forEachTranslatableLanguage (
							function (_language) {
								var _languageResources = _resoucesByLanguage [_language] = {};
								Uize.forEach (
									_primaryLanguageResources,
									function (_resourceFileStrings,_resourceFileSubPath) {
										var
											_resourceFilePath = m.getLanguageResourcePath (_resourceFileSubPath,_language),
											_resourceFileFullPath = _rootFolderPath + '/' + _resourceFilePath
										;
										_languageResources [_resourceFileSubPath] = Uize.Data.Diff.diff (
											_fileSystem.fileExists ({path:_resourceFileFullPath})
												? m.parseResourceFile (_fileSystem.readFile ({path:_resourceFileFullPath}))
												: {}
											,
											_primaryLanguageResourcesDiff [_resourceFileSubPath],
											function (_gatheredProperty,_propertyDiff) {
												return (
													!_propertyDiff || _propertyDiff.value == 'removed'
														? _undefined
														: {
															value:_propertyDiff.value == 'modified'
																? ''
																: _gatheredProperty ? _gatheredProperty.value : ''
														}
												);
											}
										);
										m._stepCompleted ('Gathered resources from file: ' + _resourceFilePath);
									}
								);
							}
						);

					/*** generate resources for pseudo-locale ***/
						_resoucesByLanguage [_project.pseudoLocale] = m._pseudoLocalizeResources (_primaryLanguageResources);

					Uize.forEach (
						_resoucesByLanguage,
						function (_languageResources,_language) {
							m.writeLanguageResourcesFile (_language,_languageResources);
							m._stepCompleted ('Created resources file for language: ' + _language);
						}
					);
					_callback ();
				},

				exportJobs:function (_params,_callback) {
					var
						m = this,
						_project = m.project,
						_primaryLanguageResources = m.readLanguageResourcesFile (_project.primaryLanguage),
						_totalTranslatableLanguages = _project.languages.length - 2
					;
					m._prepareToExecuteMethod (_totalTranslatableLanguages * 3);

					m.forEachTranslatableLanguage (
						function (_language) {
							/*** determine strings that need translation ***/
								var
									_translationJobStrings = Uize.Data.Diff.diff (
										Uize.Data.Diff.diff (
											m.readLanguageResourcesFile (_language) || {},
											{},
											function (_string) {return _string.value ? _undefined : _string}
										),
										_primaryLanguageResources,
										function (_stringToTranslate,_primaryLanguageString) {
											return _stringToTranslate && _primaryLanguageString;
										}
									),
									_jobsPath = m._workingFolderPath + 'jobs/'
								;
								m._stepCompleted (_language + ': determined strings that need translation');

							/*** calculate metrics for translation job ***/
								m._calculateMetricsForLanguage (
									_language,
									_translationJobStrings,
									_jobsPath + _language + '-metrics.json'
								);
								m._stepCompleted (_language + ': calculated translation job metrics');

							/*** write translation job strings CSV file ***/
								var _translationJobFilePath = _jobsPath + _language + '.csv';
								Uize.isEmpty (_translationJobStrings)
									? _fileSystem.writeFile ({path:_translationJobFilePath,contents:''})
									//? _fileSystem.deleteFile ({path:_translationJobFilePath})
									: _fileSystem.writeFile ({
										path:_translationJobFilePath,
										contents:Uize.Data.Csv.to (
											Uize.Data.NameValueRecords.fromHash (
												Uize.Data.Flatten.flatten (
													_translationJobStrings,
													function (_path) {return Uize.Json.to (_path,'mini')}
												),
												0,
												1
											)
										)
									})
								;
								m._stepCompleted (_language + ': created translation job file');
						}
					);
					_callback ();
				},

				importJobs:function (_params,_callback) {
					var
						m = this,
						_project = m.project,
						_totalTranslatableLanguages = _project.languages.length - 2
					;
					m._prepareToExecuteMethod (_totalTranslatableLanguages * 2);

					m.forEachTranslatableLanguage (
						function (_language) {
							/*** determine strings that have been translated ***/
								var _translatedStrings = Uize.Data.Diff.diff (
									Uize.Data.Flatten.unflatten (
										Uize.Data.NameValueRecords.toHash (
											Uize.Data.Csv.from (
												_fileSystem.readFile ({path:m._workingFolderPath + 'jobs/' + _language + '.csv'})
											),
											0,
											1
										),
										Uize.Json.from
									),
									{},
									function (_string) {return _string.value ? _string : _undefined}
								);
								m._stepCompleted (_language + ': determined strings that have been translated');

							/*** update language resources file ***/
								if (!Uize.isEmpty (_translatedStrings))
									m.writeLanguageResourcesFile (
										_language,
										Uize.mergeInto (m.readLanguageResourcesFile (_language),_translatedStrings)
									)
								;
								m._stepCompleted (_language + ': updated language resources file');
						}
					);
					_callback ();
				},

				extract:function (_params,_callback) {
					_callback ();
				},

				metrics:function (_params,_callback) {
					var
						m = this,
						_primaryLanguage = m.project.primaryLanguage
					;
					m._prepareToExecuteMethod (2);

					/*** gather resources for primary language ***/
						var _primaryLanguageResources = m.gatherResources ();
						m._stepCompleted ('gathered resources for primary language');

					/*** calculate metrics for primary language ***/
						m._calculateMetricsForLanguage (
							_primaryLanguage,
							_primaryLanguageResources,
							m._workingFolderPath + 'metrics/' + _primaryLanguage + '.json'
						);
						m._stepCompleted ('calculated metrics for primary language');

					_callback ();
				},

				pseudoLocalize:function (_params,_callback) {
					var m = this;
					m._prepareToExecuteMethod (3);

					/*** gather resources for primary language ***/
						var _primaryLanguageResources = m.gatherResources ();
						m._stepCompleted ('gathered resources for primary language');

					/**( pseudo-localize resources for primary language ***/
						var _pseudoLocalizedResources = m._pseudoLocalizeResources (_primaryLanguageResources);
						m._stepCompleted ('pseudo-localized resources for primary language');

					/*** distributed pseudo-localized resources to individual resource files ***/
						m.distributeResources (_pseudoLocalizedResources,m.project.primaryLanguage);
						m._stepCompleted ('distributed pseudo-localized resources to individual resource files');

					_callback ();
				},

				init:function (_params,_callback) {
					this.project = _params.project;
					this._workingFolderPath = _params.workingFolder + '/' + this.project.name + '/';
					this._log = _params.log || Uize.nop;
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

