Uize.module ({
	name:'Uize.Services.LocAdapter',
	required:[
		'Uize.Services.FileSystem',
		'Uize.Json',
		'Uize.Data.Flatten',
		'Uize.Data.NameValueRecords',
		'Uize.Data.Csv',
		'Uize.Loc.Pseudo',
		'Uize.Build.Util',
		'Uize.Str.Split'
	],
	superclass:'Uize.Service.Adapter',
	builder:function (_superclass) {
		'use strict';

		var
			_fileSystem = Uize.Services.FileSystem.singleton (),
			_split = _split = Uize.Str.Split.split
		;

		return _superclass.subclass ({
			instanceMethods:{
				distributeResources:function (_resources,_language) {
					var
						m = this,
						_rootFolderPath = m.project.rootFolderPath
					;
					Uize.forEach (
						_resources,
						function (_resourceFileNamespaces,_resourceFileSubPath) {
							var _resourceFileFullPath =
								_rootFolderPath + '/' + m.getLanguageResourcePath (_resourceFileSubPath,_language)
							;
							_fileSystem.writeFile ({
								path:_resourceFileFullPath,
								contents:m.serializeResourceFile (_resourceFileNamespaces)
							});
						}
					);
				},

				gatherResources:function () {
					var
						m = this,
						_project = m.project,
						_currentFolderRelativePath,
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
							return m.isResourceFile (_sourceFileName) ? _sourceFileName : null;
						},
						fileBuilder:function (_sourceFileName,_sourceFileText) {
							var
								_namespaces,
								_errorWithFile
							;
							try {
								_namespaces = m.parseResourceFile (_sourceFileText);
							} catch (_error) {
								_errorWithFile = _error + '';
							}
							_resources [_currentFolderRelativePath + '/' + _sourceFileName] = _namespaces;
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
						_chars = 0
					;
					for (
						var _stringSegmentNo = -2, _stringSegmentsLength = _stringSegments.length;
						(_stringSegmentNo += 2) < _stringSegmentsLength;
					)
						_chars += _stringSegments [_stringSegmentNo].length
					;
					return {
						words:(_stringSegmentsLength + 1) / 2,
						chars:_chars
					};
				},

				isBrandResourceFile:function (_filename) {
					// this method should be implemented by subclasses
				},

				isResourceFile:function (_filename) {
					// this method should be implemented by subclasses
				},

				parseResourceFile:function (_resourceFileText) {
					// this method should be implemented by subclasses
				},

				serializeResourceFile:function (_namespaces) {
					// this method should be implemented by subclasses
				},

				processStrings:function (_namespaces,_stringProcessor) {
					Uize.forEach (
						_namespaces,
						function (_namespace) {
							function _processSection (_section) {
								for (var _key in _section) {
									var _value = _section [_key];
									if (Uize.isObject (_value)) {
										_processSection (_value);
									} else if (typeof _value == 'string') {
										_section [_key] = _stringProcessor (_section [_key]);
									}
								}
							}
							_processSection (_namespace);
						}
					);
				},

				import:function (_params,_callback) {
					var
						m = this,
						_project = m.project,
						_projectName = _project.name
					;
					Uize.forEach (
						_project.languages,
						function (_language) {
							if (_language != 'en-US') {
								var _languageFilename = 'strings/' + _projectName + '/' + _language + '.csv';
								if (_fileSystem.fileExists ({path:_languageFilename})) {
									m.distributeResources (
										Uize.Data.Flatten.unflatten (
											Uize.Data.NameValueRecords.toHash (
												Uize.Data.Csv.from (_fileSystem.readFile ({path:_languageFilename})),
												0,
												1
											),
											'|'
										),
										_language,
										_project
									);
								}
							}
						}
					);
					_callback ();
				},

				export:function (_params,_callback) {
					var
						_project = this.project,
						_projectName = _project.name
					;
					_fileSystem.writeFile ({
						path:'strings/' + _projectName + '/en-US.csv',
						contents:Uize.Data.Csv.to (
							Uize.Data.NameValueRecords.fromHash (
								Uize.Data.Flatten.flatten (this.gatherResources (),'|'),
								0,
								1
							)
						)
					});
					_callback ();
				},

				metrics:function (_params,_callback) {
					var
						m = this,
						_totalResourceFiles = 0,
						_totalBrandSpecificResourceFiles = 0,
						_totalWordCount = 0,
						_totalBrandSpecificWordCount = 0,
						_totalCharCount = 0,
						_totalBrandSpecificCharCount = 0,
						_currentResourceFileIsBrandSpecific,
						_project = m.project
					;
					Uize.forEach (
						m.gatherResources (),
						function (_resourceFileNamespaces,_resourceFileSubPath) {
							var
								_wordCount = 0,
								_charCount = 0
							;
							_totalResourceFiles++;
							_totalBrandSpecificResourceFiles += (
								_currentResourceFileIsBrandSpecific = m.isBrandResourceFile (_resourceFileSubPath)
							);
							m.processStrings (
								_resourceFileNamespaces,
								function (_value) {
									var _stringMetrics = m.getStringMetrics (_value);
									_wordCount += _stringMetrics.words;
									_charCount += _stringMetrics.chars;
									return _value;
								}
							);
							_totalWordCount += _wordCount;
							_totalCharCount += _charCount;
							if (_currentResourceFileIsBrandSpecific) {
								_totalBrandSpecificWordCount += _wordCount;
								_totalBrandSpecificCharCount += _charCount;
							}

						}
					);
					_fileSystem.writeFile ({
						path:'logs/loc-metrics-' + _project.name + '.json',
						contents:Uize.Json.to ({
							resourceFiles:_totalResourceFiles,
							brandSpecificResourceFiles:_totalBrandSpecificResourceFiles,
							brandSpecificResourceFilesPercent:_totalBrandSpecificResourceFiles / _totalResourceFiles * 100,
							wordCount:_totalWordCount,
							brandSpecificWordCount:_totalBrandSpecificWordCount,
							brandSpecificWordCountPercent:_totalBrandSpecificWordCount / _totalWordCount * 100,
							charCount:_totalCharCount,
							brandSpecificCharCount:_totalBrandSpecificCharCount,
							brandSpecificCharCountPercent:_totalBrandSpecificCharCount / _totalCharCount * 100
						})
					});
					_callback ();
				},

				pseudoLocalize:function (_params,_callback) {
					var
						_pseudoLocalizeOptions = {wordSplitter:this.wordSplitter},
						_projectName = this.project.name
					;

					function _pseudoLocalizeString (_string) {
						return Uize.Loc.Pseudo.pseudoLocalize (_string,_pseudoLocalizeOptions);
					}

					_fileSystem.writeFile ({
						path:'strings/' + _projectName + '/pseudo.csv',
						contents:Uize.Data.Csv.to (
							Uize.map (
								Uize.Data.Csv.from (_fileSystem.readFile ({path:'strings/' + _projectName + '/en-US.csv'})),
								function (_keyValueArray) {
									_keyValueArray [1] = _pseudoLocalizeString (_keyValueArray [1] || '');
									return _keyValueArray;
								},
								false
							)
						)
					});
					_callback ();
				},

				init:function (_params,_callback) {
					this.project = _params.project;
					_callback ();
				}
			},

			instanceProperties:{
				wordSplitter:/([\s\?!\.;,&=\(\)\[\]"<>]+)/g
			}
		});
	}
});

