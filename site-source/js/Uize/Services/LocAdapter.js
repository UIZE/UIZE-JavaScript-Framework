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
		'Uize.Data.NameValueRecords',
		'Uize.Data.Csv',
		'Uize.Data.Diff',
		'Uize.Loc.Pseudo',
		'Uize.Str.Split',
		'Uize.Templates.TextProgressBar',
		'Uize.Templates.TextTable'
	],
	superclass:'Uize.Service.Adapter',
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,
				_split = Uize.Str.Split.split,

			/*** General Variables ***/
				_fileSystem = Uize.Services.FileSystem.singleton (),
				_sacredEmptyArray = []
		;

		/*** Private Instance Methods ***/
			function _calculateMetricsForLanguage (m,_language,_languageResources,_metricsFilePath) {
				function _percent (_numerator,_denominator) {
					return ((_numerator / _denominator) || 0) * 100;
				}
				var
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
						_processStrings (
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
										_stringMetrics = _getStringMetrics (m,_value),
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

				var _metrics = {
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
				};
				_fileSystem.writeFile ({path:_metricsFilePath,contents:Uize.Json.to (_metrics)});

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
									if (m.isTranslatableString (_string))
										_string.value = Uize.Loc.Pseudo.pseudoLocalize (_string.value,_pseudoLocalizeOptions)
									;
									return _string;
								}
							)
						;
					}
				);
				return _pseudoLocalizedResources;
			}

			function _languageResourcesFilePath (m,_language) {
				return m._workingFolderPath + _language + '.json';
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

			function _forEachTranslatableLanguage (m,_iterationHandler) {
				var
					_project = m.project,
					_primaryLanguage = _project.primaryLanguage,
					_pseudoLocale = _project.pseudoLocale
				;
				Uize.forEach (
					_project.languages,
					function (_language) {
						_language != _primaryLanguage && _language != _pseudoLocale && _iterationHandler (_language);
					}
				);
			}

			function _distributeResources (m,_resources,_language) {
				var _rootFolderPath = m.project.rootFolderPath;
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
			}

			function _getStringMetrics (m,_sourceStr) {
				var
					_stringSegments = _split (_sourceStr,m.wordSplitter),
					_words = 0,
					_chars = 0,
					_tokenAdded = {},
					_tokens = []
				;
				if (m.tokenRegExp)
					_sourceStr.replace (
						m.tokenRegExp,
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

				getLanguageResourcePath:function (_enResourcePath,_language) {
					// this method should be implemented by subclasses
				},

				isBrandResourceFile:function (_filePath) {
					// this method should be implemented by subclasses
					return false;
				},

				isBrandResourceString:function (_resourceStringPath,_resourceStringText) {
					// this method should be implemented by subclasses
					return false;
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
					// this method should be implemented by subclasses
				},

				parseResourceFile:function (_resourceFileText) {
					// this method should be implemented by subclasses
				},

				serializeResourceFile:function (_strings) {
					// this method should be implemented by subclasses
				},

				getReferencingCodeFiles:function () {
					return [];
					// this method should be implemented by subclasses
				},

				getReferencesFromCodeFile:function (_filePath) {
					return {};
					// this method should be implemented by subclasses
				},

				'import':function (_params,_callback) {
					var
						m = this,
						_project = m.project,
						_primaryLanguage = _project.primaryLanguage,
						_languages = _project.languages
					;
					m.prepareToExecuteMethod ((_languages.length - !_project.importPrimary) * 2);
					Uize.forEach (
						_languages,
						function (_language) {
							if (_language != _primaryLanguage || _project.importPrimary) {
								var _resources = _readLanguageResourcesFile (m,_language);
								m.stepCompleted (_language + ': read language resources file');
								_resources && _distributeResources (m,_resources,_language,_project);
								m.stepCompleted (_language + ': distributed strings to individual resource files');
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
						_primaryLanguageResourcesLast = _readLanguageResourcesFile (m,_primaryLanguage) || {},
						_primaryLanguageResourcesDiff = Uize.Data.Diff.diff (
							_primaryLanguageResourcesLast,
							_primaryLanguageResources
						),
						_resoucesByLanguage = Uize.pairUp (_primaryLanguage,_primaryLanguageResources),
						_totalLanguages = _project.languages.length,
						_totalTranslatableLanguages = _totalLanguages - 2
					;

					m.prepareToExecuteMethod (
						_totalTranslatableLanguages * Uize.totalKeys (_primaryLanguageResources) +
							// total number of resource files to gather, across all translatable languages
						_totalLanguages
							// number of language resources files to write
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
										m.stepCompleted ('Gathered resources from file: ' + _resourceFilePath);
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
						_primaryLanguageResources = _readLanguageResourcesFile (m,_project.primaryLanguage),
						_totalTranslatableLanguages = _project.languages.length - 2
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
												!_languageString.value && m.isTranslatableString (_primaryLanguageString)
													? _primaryLanguageString
													: _undefined
											);
										}
									),
									_jobsPath = m._workingFolderPath + 'jobs/'
								;
								m.stepCompleted (_language + ': determined strings that need translation');

							/*** calculate metrics for translation job ***/
								_calculateMetricsForLanguage (
									m,
									_language,
									_translationJobStrings,
									_jobsPath + _language + '-metrics.json'
								);
								m.stepCompleted (_language + ': calculated translation job metrics');

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
								m.stepCompleted (_language + ': created translation job file');
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
					m.prepareToExecuteMethod (_totalTranslatableLanguages * 2);

					_forEachTranslatableLanguage (
						m,
						function (_language) {
							/*** determine strings that have been translated ***/
								var
									_jobFilePath = m._workingFolderPath + 'jobs/' + _language + '.csv',
									_translatedStrings = _fileSystem.fileExists ({path:_jobFilePath})
										? Uize.Data.Diff.diff (
											Uize.Data.Flatten.unflatten (
												Uize.Data.NameValueRecords.toHash (
													Uize.Data.Csv.from (_fileSystem.readFile ({path:_jobFilePath})),
													0,
													1
												),
												Uize.Json.from
											),
											{},
											function (_string) {return _string.value ? _string : _undefined}
										) :
										{}
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
					_callback ();
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
						var _metrics = _calculateMetricsForLanguage (
							m,
							_primaryLanguage,
							_primaryLanguageResources,
							m._workingFolderPath + 'metrics/' + _primaryLanguage + '.json'
						);
						m.stepCompleted ('calculated metrics for primary language');

					/*** produce summary ***/
						function _breakdownTable (_type,_countByCategory) {
							var _allCount = _countByCategory.All;
							return Uize.Templates.TextTable.process ({
								title:_type,
								columns:[
									{title:'Category'},
									{
										title:'Count',
										align:'right'
									},
									{
										title:'Percent of Total',
										align:'right',
										formatter:function (_value) {
											return (
												(_value * 100).toFixed (1) + '% ' +
												Uize.Templates.TextProgressBar.process ({
													trackLength:20,
													endsChar:'',
													fullHeadChar:'',
													progress:_value
												})
											);
										}
									}
								],
								rows:Uize.map (
									Uize.keys (_countByCategory),
									function (_category) {
										var _count = _countByCategory [_category];
										return [_category,_count,_count / _allCount];
									}
								)
							});
						}

						function _sum (_array) {
							var _result = 0;
							Uize.forEach (_array,function (_value) {_result += _value});
							return _result;
						}

						function _histogramTable (_title,_columnTitles,_occurrencesByValueLookup) {
							var
								_values = Uize.keys (_occurrencesByValueLookup),
								_occurrences = Uize.values (_occurrencesByValueLookup),
								_minValue = Uize.min (_values),
								_maxValue = Uize.max (_values),
								_maxOccurrences = Uize.max (_occurrences),
								_rows = Uize.map (
									_values.sort (function (_valueA,_valueB) {return _valueA - _valueB}).reverse (),
									function (_value) {
										var _occurrencesForValue = _occurrencesByValueLookup [_value];
										return [_value,_occurrencesForValue,_value * _occurrencesForValue];
									}
								)
							;
							return Uize.Templates.TextTable.process ({
								title:_title,
								columns:[
									{title:_columnTitles.count},
									{
										title:_columnTitles.occurrences,
										align:'right',
										formatter:function (_value) {
											return (
												_value != undefined
													? (
														_value + ' ' +
														Uize.Templates.TextProgressBar.process ({
															trackLength:Math.min (_maxOccurrences,50),
															endsChar:'',
															fullHeadChar:'',
															progress:_value / _maxOccurrences
														})
													)
													: ''
											);
										}
									},
									{
										title:_columnTitles.total,
										align:'right',
									}
								],
								rows:_rows.concat ([
									[
										'All (' + _minValue + '-' + _maxValue + ')',
										undefined,
										_sum (Uize.Data.Util.getColumn (_rows,2))
									]
								])
							});
						}

						var _occurrencesByValueLookup = {};
						Uize.forEach (
							_metrics.dupedResourceStringsDetails,
							function (_resourceStringDupes) {
								var _dupeCount = _resourceStringDupes.length - 1;
								_occurrencesByValueLookup [_dupeCount] = (_occurrencesByValueLookup [_dupeCount] || 0) + 1;
							}
						);

						m.methodExecutionComplete (
							_breakdownTable (
								'Resource Files',
								{
									'All':_metrics.resourceFiles,
									'Non Brand-specific':_metrics.resourceFiles - _metrics.brandSpecificResourceFiles,
									'Brand-specific':_metrics.brandSpecificResourceFiles
								}
							) + '\n' +
							_breakdownTable (
								'Resource Strings',
								{
									'All':_metrics.resourceStrings,
									'Non Brand-specific':_metrics.resourceStrings - _metrics.brandSpecificResourceStrings,
									'Brand-specific':_metrics.brandSpecificResourceStrings
								}
							) + '\n' +
							_breakdownTable (
								'Word Count',
								{
									'All':_metrics.wordCount,
									'Non Brand-specific':_metrics.wordCount - _metrics.brandSpecificWordCount,
									'Brand-specific':_metrics.brandSpecificWordCount
								}
							) + '\n' +
							_breakdownTable (
								'Character Count',
								{
									'All':_metrics.charCount,
									'Non Brand-specific':_metrics.charCount - _metrics.brandSpecificCharCount,
									'Brand-specific':_metrics.brandSpecificCharCount
								}
							) + '\n' +
							_breakdownTable (
								'Resource Strings (tokenized vs. non-tokenized)',
								{
									'All':_metrics.resourceStrings,
									'Non-tokenized':_metrics.resourceStrings - _metrics.tokenizedResourceStrings,
									'Tokenized':_metrics.tokenizedResourceStrings
								}
							) + '\n' +
							_histogramTable (
								'Histogram of Resource String Duplicates',
								{
									count:'Duplication Count',
									occurrences:'Occurrences',
									total:'Total Duplicates'
								},
								_occurrencesByValueLookup
							)
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
						_distributeResources (m,_pseudoLocalizedResources,m.project.primaryLanguage);
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
										var _filePath = _stringReference.filePath;
										(
											_stringsReferencesByCodeFile [_filePath] ||
											(_stringsReferencesByCodeFile [_filePath] = [])
										).push (_stringId);
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
							_unreferenced = [],
							_references = {},
							_multiReferenced = {}
						;
						Uize.Data.Flatten.flatten (
							_primaryLanguageResources,
							function (_path) {
								var
									_stringId = _path.slice (1).join ('.'),
									_stringReferences = _allReferencesLookup [_stringId]
								;
								if (_stringReferences) {
									_references [_stringId] = _stringReferences;
									if (_stringReferences.length > 1)
										_multiReferenced [_stringId] = _stringReferences.length
									;
								} else {
									_unreferenced.push (_stringId);
								}
							}
						);
						m.stepCompleted ('analyzed resource usage');

					/*** write report file ***/
						var _usageReportFilePath = m.workingFolderPath + 'metrics/usage-report.json';
						_fileSystem.writeFile ({
							path:_usageReportFilePath,
							contents:Uize.Json.to ({
								unreferenced:_unreferenced,
								multiReferenced:_multiReferenced,
								references:_references,
								referencesByCodeFile:_stringsReferencesByCodeFile
							})
						});
						m.stepCompleted ('created usage report file: ' + _usageReportFilePath);

					_callback ();
				},

				init:function (_params,_callback) {
					var m = this;
					m.project = _params.project;
					m._workingFolderPath = m.workingFolderPath = _params.workingFolder + '/' + m.project.name + '/';
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

