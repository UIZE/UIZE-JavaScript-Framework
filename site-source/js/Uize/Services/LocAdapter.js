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
		'Uize.Str.Split',
		'Uize.Util.RegExpComposition'
	],
	superclass:'Uize.Service.Adapter',
	builder:function (_superclass) {
		'use strict';

		var
			_fileSystem = Uize.Services.FileSystem.singleton (),
			_split = Uize.Str.Split.split
		;

		return _superclass.subclass ({
			instanceMethods:{
				languageResourcesFilePath:function (_language) {
					return this._projectStringsPath + _language + '.json';
				},

				readLanguageResourcesFile:function (_language) {
					var _languageResourcesFilePath = this.languageResourcesFilePath (_language);
					return (
						_fileSystem.fileExists ({path:_languageResourcesFilePath})
							? Uize.Json.from (_fileSystem.readFile ({path:_languageResourcesFilePath}))
							: undefined
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
						this.project.languages,
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
						_primaryLanguage = _project.primaryLanguage
					;
					Uize.forEach (
						_project.languages,
						function (_language) {
							if (_language != _primaryLanguage) {
								var _resources = m.readLanguageResourcesFile (_language);
								_resources && m.distributeResources (_resources,_language,_project);
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
						_resoucesByLanguage = Uize.pairUp (_primaryLanguage,_primaryLanguageResources)
					;

					/*** gather resources for all other supported languages ***/
						m.forEachTranslatableLanguage (
							function (_language) {
								var _languageResources = _resoucesByLanguage [_language] = {};
								Uize.forEach (
									_primaryLanguageResources,
									function (_resourceFileStrings,_resourceFileSubPath) {
										var
											_languageResourceFileSubPath =
												m.getLanguageResourcePath (_resourceFileSubPath,_language),
											_resourceFileFullPath = _rootFolderPath + '/' + _languageResourceFileSubPath,
											_resources = _fileSystem.fileExists ({path:_resourceFileFullPath})
												? m.parseResourceFile (_fileSystem.readFile ({path:_resourceFileFullPath}))
												: {}
										;
										_languageResources [_languageResourceFileSubPath] = Uize.Data.Diff.diff (
											_resources,
											_primaryLanguageResourcesDiff [_resourceFileSubPath],
											function (_gatheredProperty,_propertyDiff) {
												return (
													!_propertyDiff || _propertyDiff.value == 'removed'
														? undefined
														: {
															value:
																_propertyDiff.value == 'modified' || _propertyDiff.value == 'added'
																	? ''
																	: _gatheredProperty ? _gatheredProperty.value : ''
														}
												);
											}
										);
									}
								);
							}
						);

					Uize.forEach (
						_resoucesByLanguage,
						function (_languageResources,_language) {
							m.writeLanguageResourcesFile (_language,_languageResources);
						}
					);
					_callback ();
				},

				exportJob:function (_params,_callback) {
					var m = this;
					m.forEachTranslatableLanguage (
						function (_language) {
							var
								_translationJobFilePath = m._projectStringsPath + 'jobs/' + _language + '.csv',
								_translationJobStrings = Uize.Data.Diff.diff (
									m.readLanguageResourcesFile (_language) || {},
									{},
									function (_string) {return _string.value ? undefined : _string}
								)
							;
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
						}
					);
					_callback ();
				},

				importJob:function (_params,_callback) {
					var m = this;
					m.forEachTranslatableLanguage (
						function (_language) {
							var _translatedStrings = Uize.Data.Diff.diff (
								Uize.Data.Flatten.unflatten (
									Uize.Data.NameValueRecords.toHash (
										Uize.Data.Csv.from (
											_fileSystem.readFile ({path:m._projectStringsPath + 'jobs/' + _language + '.csv'})
										),
										0,
										1
									),
									Uize.Json.from
								),
								{},
								function (_string) {return _string.value ? undefined : _string}
							);
							if (!Uize.isEmpty (_translatedStrings))
								m.writeLanguageResourcesFile (
									_language,
									Uize.mergeInto (m.readLanguageResourcesFile (_language),_translatedStrings)
								)
							;
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
						_project = m.project,
						_valuesLookup = {},
						_dupedResourceStringsDetails = {},
						_tokenUsage = {}
					;
					Uize.forEach (
						m.gatherResources (),
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
						path:'logs/loc-metrics-' + _project.name + '.json',
						contents:Uize.Json.to ({
							resourceFiles:_totalResourceFiles,
							brandSpecificResourceFiles:_totalBrandSpecificResourceFiles,
							brandSpecificResourceFilesPercent:_totalBrandSpecificResourceFiles / _totalResourceFiles * 100,
							resourceStrings:_totalResourceStrings,
							brandSpecificResourceStrings:_totalBrandSpecificResourceStrings,
							brandSpecificResourceStringsPercent:_totalBrandSpecificResourceStrings / _totalResourceStrings * 100,
							wordCount:_totalWordCount,
							brandSpecificWordCount:_totalBrandSpecificWordCount,
							brandSpecificWordCountPercent:_totalBrandSpecificWordCount / _totalWordCount * 100,
							charCount:_totalCharCount,
							brandSpecificCharCount:_totalBrandSpecificCharCount,
							brandSpecificCharCountPercent:_totalBrandSpecificCharCount / _totalCharCount * 100,
							tokens:_totalTokens,
							tokenizedResourceStrings:_totalTokenizedResourceStrings,
							tokenizedResourceStringsPercent:_totalTokenizedResourceStrings / _totalResourceStrings * 100,
							dupedResourceStrings:_totalDupedResourceStrings,
							dupedResourceStringsPercent:_totalDupedResourceStrings / _totalResourceStrings * 100,
							dupedResourceStringsDetails:_dupedResourceStringsDetails,
							tokenUsage:_tokenUsage
						})
					});
					_callback ();
				},

				pseudoLocalize:function (_params,_callback) {
					var
						m = this,
						_project = m.project,
						_pseudoLocalizeOptions = {wordSplitter:m.wordSplitter},
						_pseudoLocalizedResources = {},
						_pseudoLocale = _project.pseudoLocale
					;
					Uize.forEach (
						m.readLanguageResourcesFile (_project.primaryLanguage),
						function (_resourceFileStrings,_resourceFileSubPath) {
							_pseudoLocalizedResources [m.getLanguageResourcePath (_resourceFileSubPath,_pseudoLocale)] =
								Uize.Data.Diff.diff (
									_resourceFileStrings,
									{},
									function (_string) {
										return {value:Uize.Loc.Pseudo.pseudoLocalize (_string.value,_pseudoLocalizeOptions)};
									}
								)
							;
						}
					);
					m.writeLanguageResourcesFile (_pseudoLocale,_pseudoLocalizedResources);
					_callback ();
				},

				init:function (_params,_callback) {
					this.project = _params.project;
					this._projectStringsPath = _params.stringsFolder + '/' + this.project.name + '/';
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

