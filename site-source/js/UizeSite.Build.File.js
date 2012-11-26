/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.File Namespace
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Namespace
	importance: 5
	codeCompleteness: 0
	testCompleteness: 0
	docCompleteness: 2
*/

/* TODO:
	- to implement
		- get log output working again
			- add support in factored out code for producing log output, so that built scripts can generate log files much like before
		- document the Web server functionality (under dev section initially)

		- get character encoding declared at the top of every HTML document

		- improve performance of the build-all script
			- possibly provide a way for the _filesConsideredCurrentLookup lookup to persist across calls to the UizeSite.Build.File.perform method

	- to improve
		- for manageability of the code, figure out an elegant way to be able to have separate file handlers (or sets of handlers) as separate modules
		- UizeSite.SiteMap should dynamically reflect the following...
			- the news-by-year index pages
			- the JavaScript reference pages
		- improve performance of SOTU handler
			- Possibly don't require building of reference documentation for modules in order to get description. Instead, just do parsing of simple doc structure, but without the HTML generation. Then refactor code to have a .info handler specifically for modules, and that has a dependency on the parsed simple doc data, and refactor the module reference handler to use a different process than Uize.Doc.Sucker.toDocument or refactor the Uize.Doc.Sucker.toDocument method to be able to take in a simple data object as well.
		- refactor code to cache in memory the SimpleDoc parsed out of the modules
			- this will allow descriptions to be obtained for the modules without actually building the HTML reference pages, and these descriptions will be used by the SOTU
		- implement ability to store memory results to file system in json form, with ability to read after restarting server
*/

/*?
	Introduction
		The =UizeSite.Build.File= package provides a method for building any file requested for the UIZE Web site.

		*DEVELOPERS:* `Chris van Rensburg`

		EXAMPLE USAGE
		......................................................................................................
		node _build.js UizeSite.Build.File url=reference/Uize.html sourcePath=site-source tempPath=site-temp memoryPath=site-memory builtPath=site-built freshBuild=true
		......................................................................................................

		Parameters
			sourcePath
				document...

			tempPath
				document...

			builtPath
				document...

			minAllowedModifiedDate
				document...

			isDev
				document...
*/

Uize.module ({
	name:'UizeSite.Build.File',
	required:[
		'Uize.Url',
		'Uize.String',
		'Uize.Date',
		'Uize.Services.FileSystem',
		'Uize.Doc.Simple',
		'Uize.Template.Module',
		'Uize.Data.Simple',
		'Uize.Doc.Sucker',
		'Uize.Util.Oop',
		'Uize.Data.Matches',
		'Uize.Build.Util',
		'Uize.Array.Sort',
		'Uize.Data.PathsTree',
		'Uize.String.Lines',
		'Uize.Data.Matches',
		'UizeSite.SiteMap'
	],
	builder:function () {
		/*** Variables for Scruncher Optimization ***/
			var
				_package = function () {},
				_undefined
			;

		/*** Utility Functions ***/
			function _log () {
				typeof console != 'undefined' && typeof console.log == 'function' &&
					console.log.apply (console,arguments)
				;
			}

		/*** General Variables ***/
			var
				_fileSystem = Uize.Services.FileSystem.singleton (),
				_sacredEmptyObject = {},
				_sacredEmptyArray = [],
				_trueFlag = {},
				_urlHandlers = [],
				_minAllowedModifiedDate,
				_moduleExtensionRegExp = /(\.js|\.js\.jst)$/,
				_sourcePath,
				_tempPath,
				_builtPath,
				_memoryPath,
				_isDev,
				_scrunchedHeadComments,
				_threeFoldersDeepRegExp = /^([^\\\/]+)[\\\/]([^\\\/]+)[\\\/]([^\\\/]+)[\\\/][^\\\/]+$/,
				_lastParams
			;

			/*** URL tests ***/
				function _isUnderPath (_path,_whichPath) {return Uize.String.startsWith (_path,_whichPath + '/')}
				function _isUnderMemoryPath (_path) {return _isUnderPath (_path,_memoryPath)}
				function _isUnderBuiltPath (_path) {return _isUnderPath (_path,_builtPath)}
				function _isUnderTempPath (_path) {return _isUnderPath (_path,_tempPath)}

			/*** URL transformers ***/
				function _changePath (_path,_pathToRemove,_pathToPrepend) {
					return (_pathToPrepend || '') + _path.slice (_pathToRemove.length);
				}
				function _sourcePathFromBuiltPath (_path) {return _changePath (_path,_builtPath,_sourcePath)}
				function _tempPathFromBuiltPath (_path) {return _changePath (_path,_builtPath,_tempPath)}
				function _memoryPathFromBuiltPath (_path) {return _changePath (_path,_builtPath,_memoryPath)}

			/*** URL utilities ***/
				function _getTitleFromFilename (_filename) {
					return _filename.match (/(.*)\.[^\.]*$/) [1].replace (/-/g,' ');
				}

				function _getPathToRoot (_path) {
					return Uize.String.repeat ('../',_path.length - _path.replace (/[\/\\]/g,'').length);
				}

			/*** abstractions of various methods of the file system service to support object storage ***/
				var _objectCache = {};

				function _writeFile (_params) {
					var _path = _params.path;
					_isUnderMemoryPath (_path)
						? (
							_objectCache [_path] = {
								contents:_params.contents,
								modifiedDate:new Date
							}
						)
						: _fileSystem.writeFile (_params)
					;
				}

				function _readFile (_params) {
					var _path = _params.path;
					return (
						_isUnderMemoryPath (_path)
							? (_objectCache [_path] || _sacredEmptyObject).contents
							: _fileSystem.readFile (_params)
					);
				}

				function _getModifiedDate (_params) {
					var _path = _params.path;
					return (
						_isUnderMemoryPath (_path)
							? (_objectCache [_path] || _sacredEmptyObject).modifiedDate
							: _fileSystem.getModifiedDate (_params)
					);
				}

				function _fileExists (_params) {
					var _path = _params.path;
					return _isUnderMemoryPath (_path) ? !!_objectCache [_path] : _fileSystem.fileExists (_params);
				}

			/*** misc utilities ***/
				function _registerUrlHandler (_urlHandler) {
					_urlHandlers.push (_urlHandler);
				}

				function _getModules () {
					return _package.getJsModules (_sourcePath);
				}

				function _forEachNumberedInput (_inputs,_inputNamePrefix,_handler) {
					var
						_inputNo = -1,
						_inputName,
						_inputValue
					;
					while ((_inputValue = _inputs [_inputName = _inputNamePrefix + ++_inputNo]) != _undefined)
						_handler (_inputValue,_inputName)
					;
				}

				function _processSimpleDoc (_title,_simpleDocBuildResult,_simpleDocTemplatePath) {
					var
						_contentsTreeItems = _simpleDocBuildResult.contentsTreeItems,
						_contentsTreeItem0 = _contentsTreeItems [0]
					;
					return _readFile ({path:_simpleDocTemplatePath}) ({
						title:_title,
						description:
							(
								_contentsTreeItem0 &&
								(_contentsTreeItem0.description || (_contentsTreeItem0.items [0] || {}).description)
							) || '',
						body:_simpleDocBuildResult.html
					});
				}

			/*** handler for source files ***/
				_registerUrlHandler ({
					description:'Short-circuit handling for source files',
					urlMatcher:function (_urlParts) {
						return Uize.String.startsWith (_urlParts.folderPath,_sourcePath);
					}
				});

			/*** handler for the home page ***/
				_registerUrlHandler ({
					description:'Homepage',
					urlMatcher:function (_urlParts) {
						return _urlParts.pathname == _builtPath + '/index.html';
					},
					builderInputs:function (_urlParts) {
						return {
							template:_memoryPathFromBuiltPath (_urlParts.pathname) + '.jst',
							newsItems:_memoryPath + '/news.index'
						};
					},
					builder:function (_inputs) {
						return _readFile ({path:_inputs.template}) ({
							latestNews:_readFile ({path:_inputs.newsItems}).slice (0,10)
						});
					}
				});

			/*** handlers for Widgets To Go pages ***/
				var _widgetsToGoPath = 'widgets/';

				function _urlizeWidgetTitle (_widget) {
					return _widget.title.toLowerCase ().replace (/\s+/g,'-');
				}

				/*** handler for Widgets To Go index page ***/
					_registerUrlHandler ({
						description:'Widgets To Go index page',
						urlMatcher:function (_urlParts) {
							return _urlParts.pathname == _builtPath + '/javascript-widgets.html';
						},
						builderInputs:function (_urlParts) {
							return {
								template:_changePath (_urlParts.pathname,_builtPath,_memoryPath) + '.jst',
								widgets:_memoryPath + '/' + _widgetsToGoPath + 'widgets.simpledata'
							};
						},
						builder:function (_inputs) {
							return _readFile ({path:_inputs.template}) ({
								files:Uize.map (
									_readFile ({path:_inputs.widgets}).widgets,
									function (_widget) {
										var _widgetTitleUrlized = _urlizeWidgetTitle (_widget);
										return {
											title:_widget.title,
											path:_widgetsToGoPath + _widgetTitleUrlized + '.html',
											imageSrc:'images/widgets/' + _widgetTitleUrlized + '-96x96.gif',
											description:_widget.description.short
										};
									}
								)
							});
						}
					});

				/*** handler for widget homepages ***/
					_registerUrlHandler ({
						description:'Widget homepages',
						urlMatcher:function (_urlParts) {
							return (
								_urlParts.fileType == 'html' &&
								_urlParts.folderPath == _builtPath + '/' + _widgetsToGoPath
							);
						},
						builderInputs:function (_urlParts) {
							var _widgetsToGoMemoryPath = _memoryPath + '/' + _widgetsToGoPath;
							return {
								template:_widgetsToGoMemoryPath + 'homepage.html.jst',
								widgets:_widgetsToGoMemoryPath + 'widgets.simpledata'
							};
						},
						builder:function (_inputs,_urlParts) {
							var _widgetTitleUrlized = _urlParts.fileName;
							return _readFile ({path:_inputs.template}) (
								Uize.Data.Matches.firstValue (
									_readFile ({path:_inputs.widgets}).widgets,
									function (_widget) {return _widgetTitleUrlized == _urlizeWidgetTitle (_widget)}
								)
							);
						}
					});

				/*** handler for widget iframe pages ***/
					_registerUrlHandler ({
						description:'Widget IFRAME pages',
						urlMatcher:function (_urlParts) {
							return (
								_urlParts.fileType == 'html' &&
								Uize.String.startsWith (_urlParts.folderPath,_builtPath + '/' + _widgetsToGoPath) &&
								(_urlParts.fileName == 'web' || _urlParts.fileName == 'mobile') &&
								_threeFoldersDeepRegExp.test (_urlParts.pathname)
							);
						},
						builderInputs:function (_urlParts) {
							var _widgetsToGoMemoryPath = _memoryPath + '/' + _widgetsToGoPath;
							return {
								template:_widgetsToGoMemoryPath + 'widget.html.jst',
								widgets:_widgetsToGoMemoryPath + 'widgets.simpledata'
							};
						},
						builder:function (_inputs,_urlParts) {
							var _widgetTitleUrlized = _urlParts.pathname.match (_threeFoldersDeepRegExp) [3];
							return _readFile ({path:_inputs.template}) ({
								widget:Uize.Data.Matches.firstValue (
									_readFile ({path:_inputs.widgets}).widgets,
									function (_widget) {return _widgetTitleUrlized == _urlizeWidgetTitle (_widget)}
								),
								mobile:_urlParts.fileName == 'mobile'
							});
						}
					});

				/*** handler for widget Google Gadget XML pages ***/
					var _widgetGoogleGadgetPageRegExp = new RegExp (
						_builtPath + '/' + _widgetsToGoPath + '([^\\/\\.]+)/gadget\\.xml'
					);
					_registerUrlHandler ({
						description:'Widget Google Gadget XML pages',
						urlMatcher:function (_urlParts) {
							return (
								_urlParts.file == 'gadget.xml' &&
								Uize.String.startsWith (_urlParts.folderPath,_builtPath + '/' + _widgetsToGoPath) &&
								_threeFoldersDeepRegExp.test (_urlParts.pathname)
							);
						},
						builderInputs:function (_urlParts) {
							var _widgetsToGoMemoryPath = _memoryPath + '/' + _widgetsToGoPath;
							return {
								template:_widgetsToGoMemoryPath + 'gadget.xml.jst',
								widgets:_widgetsToGoMemoryPath + 'widgets.simpledata'
							};
						},
						builder:function (_inputs,_urlParts) {
							var _widgetTitleUrlized = _urlParts.pathname.match (_threeFoldersDeepRegExp) [3];
							return _readFile ({path:_inputs.template}) (
								Uize.Data.Matches.firstValue (
									_readFile ({path:_inputs.widgets}).widgets,
									function (_widget) {return _widgetTitleUrlized == _urlizeWidgetTitle (_widget)}
								)
							);
						}
					});

			/*** handler for Google Code sitemap ***/
				_registerUrlHandler ({
					description:'Google Code sitemap',
					urlMatcher:function (_urlParts) {
						return _urlParts.pathname == _builtPath + '/sitemap-code.xml';
					},
					builderInputs:function (_urlParts) {
						return {template:_memoryPathFromBuiltPath (_urlParts.pathname) + '.jst'};
					},
					builder:function (_inputs) {
						return _readFile ({path:_inputs.template}) ({modules:_getModules ()});
					}
				});

			/*** handler for in-memory HTML page info objects **/
				var _htmlInfoExtensionRegExp = /\.html\.info$/;
				_registerUrlHandler ({
					description:'In-memory HTML page info object',
					urlMatcher:function (_urlParts) {
						var _pathname = _urlParts.pathname;
						return _isUnderMemoryPath (_pathname) && _htmlInfoExtensionRegExp.test (_pathname);
					},
					builderInputs:function (_urlParts) {
						return {
							htmlFile:
								_changePath (_urlParts.pathname,_memoryPath,_builtPath)
									.replace (_htmlInfoExtensionRegExp,'.html')
						};
					},
					builder:function (_inputs) {
						var _info = Uize.Build.Util.getHtmlFileInfo (
							_inputs.htmlFile,
							function (_title) {return _title.match (/^\s*(.*?)\s*\|/) [1]}
						);
						_info.path = _info.path.slice (_builtPath.length + 1);
						return _info;
					}
				});

			/*** handlers for some index pages ***/
				function _registerInMemoryHtmlFilesIndexHandler (
					_indexableFolderUnderSource,
					_indexableFolderUnderBuilt,
					_indexableFileExtensionRegExp,
					_sortOrder
				) {
					_registerUrlHandler ({
						description:'In-memory HTML files index for the ' + _indexableFolderUnderBuilt + ' folder',
						urlMatcher:function (_urlParts) {
							return _urlParts.pathname == _memoryPath + '/' + _indexableFolderUnderBuilt + '.index';
						},
						builderInputs:function (_urlParts) {
							var _inputs = {};
							Uize.forEach (
								_package.getIndexableFiles (
									_sourcePath,_indexableFolderUnderSource,_indexableFileExtensionRegExp
								),
								function (_filePath,_fileNo) {
									_inputs ['fileInfo' + _fileNo] =
										_memoryPath + '/' + _indexableFolderUnderBuilt + '/' +
										_filePath.replace (_indexableFileExtensionRegExp,'') + '.html.info'
									;
								}
							);
							return _inputs;
						},
						builder:function (_inputs) {
							var _index = [];
							_forEachNumberedInput (
								_inputs,
								'fileInfo',
								function (_fileInfoPath) {_index.push (_readFile ({path:_fileInfoPath}))}
							);
							return Uize.Array.Sort.sortBy (_index,'value.title',_sortOrder);
						}
					});
				}

				function _registerIndexPageUrlHandler (
					_description,
					_indexPageFileName,
					_indexableFolderUnderSource,
					_indexableFolderUnderBuilt,
					_indexableFileExtensionRegExp
				) {
					_registerInMemoryHtmlFilesIndexHandler (
						_indexableFolderUnderSource,_indexableFolderUnderBuilt,_indexableFileExtensionRegExp
					);
					_registerUrlHandler ({
						description:_description,
						urlMatcher:function (_urlParts) {
							return _urlParts.pathname == _builtPath + '/' + _indexPageFileName + '.html';
						},
						builderInputs:function (_urlParts) {
							return {
								template:_memoryPathFromBuiltPath (_urlParts.pathname) + '.jst',
								filesIndex:_memoryPath + '/' + _indexableFolderUnderBuilt + '.index'
							};
						},
						builder:function (_inputs) {
							return _readFile ({path:_inputs.template}) ({files:_readFile ({path:_inputs.filesIndex})});
						}
					});
				}

				/*** handler for the JavaScript modules index page ***/
					_registerIndexPageUrlHandler (
						'JavaScript modules index page',
						'javascript-modules-index',
						'js',
						'reference',
						_moduleExtensionRegExp
					);

				/*** handler for the JavaScript explainers index page ***/
					_registerIndexPageUrlHandler (
						'JavaScript explainers index page',
						'javascript-explainers',
						'explainers',
						'explainers',
						/\.simple$/
					);

				/*** handler for the appendixes index page ***/
					_registerIndexPageUrlHandler (
						'Appendixes index page',
						'appendixes',
						'appendixes',
						'appendixes',
						/(\.simple|\.html\.jst)$/
					);

				/*** handler for the JavaScript reference index page ***/
					_registerIndexPageUrlHandler (
						'JavaScript reference index',
						'javascript-reference',
						'javascript-reference',
						'javascript-reference',
						/\.simple$/
					);

			/*** handler for examples-by-keyword index pages ***/
				_registerInMemoryHtmlFilesIndexHandler ('examples','examples',/\.html$/);

				_registerUrlHandler ({
					description:'Examples-by-keyword lookup',
					urlMatcher:function (_urlParts) {
						return _urlParts.pathname == _memoryPath + '/examples-by-keyword';
					},
					builderInputs:function (_urlParts) {
						return {filesIndex:_memoryPath + '/examples.index'};
					},
					builder:function (_inputs) {
						var
							_examples = _readFile ({path:_inputs.filesIndex}),
							_examplesByKeyword = {'':_examples}
						;
						for (
							var _exampleNo = -1, _examplesLength = _examples.length, _example, _keywords, _keywordsStr;
							++_exampleNo < _examplesLength;
						) {
							if (_keywordsStr = (_example = _examples [_exampleNo]).keywords) {
								for (
									var
										_keywordNo = -1,
										_keywords = _keywordsStr.split (' '),
										_keywordsLength = _keywords.length,
										_keyword
									;
									++_keywordNo < _keywordsLength;
								)
									(
										_examplesByKeyword [_keyword = _keywords [_keywordNo]] ||
										(_examplesByKeyword [_keyword] = [])
									).push (_example)
								;
							}
						}
						return _examplesByKeyword;
					}
				});

				var _examplesKeywordRegExp = /^javascript-((.+?)-)?examples$/;
				_registerUrlHandler ({
					description:'Examples-by-keyword index page',
					urlMatcher:function (_urlParts) {
						return (
							_urlParts.fileType == 'html' &&
							_isUnderBuiltPath (_urlParts.pathname) &&
							_examplesKeywordRegExp.test (_urlParts.fileName)
						);
					},
					builderInputs:function (_urlParts) {
						return {
							template:_memoryPath + '/javascript-examples.html.jst',
							examplesByKeyword:_memoryPath + '/examples-by-keyword'
						};
					},
					builder:function (_inputs,_urlParts) {
						var _keyword = _urlParts.fileName.match (_examplesKeywordRegExp) [2] || '';
						return _readFile ({path:_inputs.template}) ({
							keyword:_keyword,
							files:_readFile ({path:_inputs.examplesByKeyword}) [_keyword] || []
						});
					}
				});

			/*** handler for javascript-examples-by-module index page ***/
				var _examplesByModuleFile = 'javascript-examples-by-module.html';
				_registerUrlHandler ({
					description:'JavaScript examples by module index page',
					urlMatcher:function (_urlParts) {
						return _urlParts.pathname == _builtPath + '/' + _examplesByModuleFile;
					},
					builderInputs:function () {
						return {
							template:_memoryPath + '/' + _examplesByModuleFile + '.jst',
							examplesIndex:_memoryPath + '/examples.index'
						};
					},
					builder:function (_inputs) {
						return _readFile ({path:_inputs.template}) ({examples:_readFile ({path:_inputs.examplesIndex})});
					}
				});

			/*** handlers for news index pages ***/
				_registerInMemoryHtmlFilesIndexHandler ('news','news',/\.simple$/,-1);

				/*** handler for news-by-year index pages ***/
					_registerUrlHandler ({
						description:'News-by-year lookup',
						urlMatcher:function (_urlParts) {
							return _urlParts.pathname == _memoryPath + '/news-by-year';
						},
						builderInputs:function (_urlParts) {
							return {filesIndex:_memoryPath + '/news.index'};
						},
						builder:function (_inputs) {
							var
								_newsItems = _readFile ({path:_inputs.filesIndex}),
								_newsByYearLookup = {'':_newsItems}
							;
							for (
								var _newsItemNo = -1, _newsItemsLength = _newsItems.length, _newsItem;
								++_newsItemNo < _newsItemsLength;
							) {
								var _year = Uize.Url.from ((_newsItem = _newsItems [_newsItemNo]).path).file.slice (0,4);
								(_newsByYearLookup [_year] || (_newsByYearLookup [_year] = [])).push (_newsItem);
							}
							return _newsByYearLookup;
						}
					});

					var _newsByYearRegExp = /^(news-(\d{4})|latest-news)$/;
					_registerUrlHandler ({
						description:'News-by-year index page',
						urlMatcher:function (_urlParts) {
							return (
								_urlParts.fileType == 'html' &&
								_isUnderBuiltPath (_urlParts.pathname) &&
								_newsByYearRegExp.test (_urlParts.fileName)
							);
						},
						builderInputs:function (_urlParts) {
							return {
								template:_memoryPath + '/news.html.jst',
								newsByYear:_memoryPath + '/news-by-year'
							};
						},
						builder:function (_inputs,_urlParts) {
							var
								_year = _urlParts.fileName.match (_newsByYearRegExp) [2] || '',
								_newsItems = _readFile ({path:_inputs.newsByYear}) [_year] || []
							;
							return _readFile ({path:_inputs.template}) ({
								year:_year,
								files:_year ? _newsItems : _newsItems.slice (0,50)
							});
						}
					});

				/*** handler for latest news RSS feed ***/
					_registerUrlHandler ({
						description:'Latest news RSS feed',
						urlMatcher:function (_urlParts) {
							return _urlParts.pathname == _builtPath + '/latest-news.rss';
						},
						builderInputs:function (_urlParts) {
							return {
								newsItems:_memoryPath + '/news.index',
								template:_changePath (_urlParts.pathname,_builtPath,_memoryPath) + '.jst'
							};
						},
						builder:function (_inputs) {
							return _readFile ({path:_inputs.template}) ({
								items:Uize.map (
									_readFile ({path:_inputs.newsItems}).slice (0,50),
									function (_value) {
										return {
											title:_value.title.replace (/^\d{4}-\d{2}-\d{2}\s*-\s*/,''),
											date:_value.title.slice (0,10),
											link:'http://www.uize.com/' + _value.path,
											description:_value.description
										}
									}
								)
							});
						}
					});

			/*** handler for the directory page ***/
				_registerUrlHandler ({
					description:'Directory page',
					urlMatcher:function (_urlParts) {
						return _urlParts.pathname == _builtPath + '/directory.html';
					},
					builderInputs:function (_urlParts) {
						return {
							modulesTree:_memoryPath +'/modules-tree',
							examplesInfoForSiteMap:_memoryPath +'/examples-info-for-sitemap',
							template:_memoryPathFromBuiltPath (_urlParts.pathname) + '.jst'
						};
					},
					builder:function (_inputs) {
						return _readFile ({path:_inputs.template}) ({
							siteMap:UizeSite.SiteMap ({
								modulesTree:_readFile ({path:_inputs.modulesTree}),
								examplesInfo:_readFile ({path:_inputs.examplesInfoForSiteMap})
							})
						});
					}
				});

			/*** handler for in-memory compiled JST templates ***/
				_registerUrlHandler ({
					description:'In-memory compiled JST templates',
					urlMatcher:function (_urlParts) {
						return _isUnderMemoryPath (_urlParts.pathname) && _urlParts.fileType == 'jst';
					},
					builderInputs:function (_urlParts) {
						return {source:_changePath (_urlParts.pathname,_memoryPath,_sourcePath)};
					},
					builder:function (_inputs) {
						var _template = Uize.Template.compile (
							_fileSystem.readFile ({path:_inputs.source}),
							{result:'full'}
						);
						Uize.require (_template.required);
						return _template.templateFunction;
					}
				});

			/*** handler for in-memory parsed SimpleData files ***/
				_registerUrlHandler ({
					description:'In-memory parsed SimpleData files',
					urlMatcher:function (_urlParts) {
						return _isUnderMemoryPath (_urlParts.pathname) && _urlParts.fileType == 'simpledata';
					},
					builderInputs:function (_urlParts) {
						return {source:_changePath (_urlParts.pathname,_memoryPath,_sourcePath)};
					},
					builder:function (_inputs) {
						return Uize.Data.Simple.parse ({
							simple:_fileSystem.readFile ({path:_inputs.source}),
							collapseChildren:true
						});
					}
				});

			/*** handler for in-memory modules tree object ***/
				_registerUrlHandler ({
					description:'In-memory modules tree object',
					urlMatcher:function (_urlParts) {
						return _urlParts.pathname == _memoryPath +'/modules-tree';
					},
					builder:function () {
						return Uize.Data.PathsTree.fromList (_getModules (),'.');
					}
				});

			/*** handler for generated UizeSite.ModulesTree module under temp ***/
				var _modulesTreeDataModuleName = 'UizeSite.ModulesTree';
				_registerUrlHandler ({
					description:'Generated UizeSite.ModulesTree module under temp',
					urlMatcher:function (_urlParts) {
						return _urlParts.pathname == _tempPath + '/js/' + _modulesTreeDataModuleName + '.js';
					},
					builderInputs:function () {
						return {modulesTree:_memoryPath +'/modules-tree'};
					},
					builder:function (_inputs) {
						return Uize.Build.Util.dataAsModule (
							_modulesTreeDataModuleName,
							_readFile ({path:_inputs.modulesTree})
						);
					}
				});

			/*** handler for generated UizeSite.Examples module under temp ***/
				var _examplesDataModuleName = 'UizeSite.Examples';
				_registerUrlHandler ({
					description:'Generated UizeSite.Examples module under temp',
					urlMatcher:function (_urlParts) {
						return _urlParts.pathname == _tempPath + '/js/' + _examplesDataModuleName + '.js';
					},
					builderInputs:function () {
						return {filesIndex:_memoryPath + '/examples.index'};
					},
					builder:function (_inputs) {
						return Uize.Build.Util.dataAsModule (
							_examplesDataModuleName,
							_readFile ({path:_inputs.filesIndex})
						);
					}
				});

			/*** handler for in-memory examples-info-for-sitemap object ***/
				_registerUrlHandler ({
					description:'In-memory examples-info-for-sitemap object',
					urlMatcher:function (_urlParts) {
						return _urlParts.pathname == _memoryPath +'/examples-info-for-sitemap';
					},
					builderInputs:function () {
						return {examplesByKeyword:_memoryPath + '/examples-by-keyword'};
					},
					builder:function (_inputs) {
						var _examplesByKeyword = _readFile ({path:_inputs.examplesByKeyword});
						return {
							keywords:Uize.Data.Matches.values (
								Uize.keys (_examplesByKeyword),
								'value && value.slice (0,4) != "Uize"'
							).sort (),
							tools:Uize.map (_examplesByKeyword.tool,'{title:value.title,path:value.path}')
						};
					}
				});

			/*** handler for generated UizeSite.ExamplesInfoForSiteMap module under temp ***/
				var _examplesInfoForSiteMapModuleName = 'UizeSite.ExamplesInfoForSiteMap';
				_registerUrlHandler ({
					description:'Generated UizeSite.ExamplesInfoForSiteMap module under temp',
					urlMatcher:function (_urlParts) {
						return _urlParts.pathname == _tempPath +'/js/' + _examplesInfoForSiteMapModuleName + '.js';
					},
					builderInputs:function () {
						return {examplesInfoForSiteMap:_memoryPath +'/examples-info-for-sitemap'};
					},
					builder:function (_inputs) {
						return Uize.Build.Util.dataAsModule (
							_examplesInfoForSiteMapModuleName,
							_readFile ({path:_inputs.examplesInfoForSiteMap})
						);
					}
				});

			/*** handler for regular JavaScript modules under temp ***/
				_registerUrlHandler ({
					description:'Regular JavaScript modules under temp',
					urlMatcher:function (_urlParts) {
						var _pathname = _urlParts.pathname;
						return (
							_urlParts.fileType == 'js' &&
							_isUnderTempPath (_pathname) &&
							_fileSystem.fileExists ({path:_changePath (_pathname,_tempPath,_sourcePath)})
						);
					},
					builderInputs:function (_urlParts) {
						return {sourceJs:_changePath (_urlParts.pathname,_tempPath,_sourcePath)};
					}
				});

			/*** handler for in-memory URL dictionary for SimpleDoc pages ***/
				_registerUrlHandler ({
					description:'In-memory URL dictionary for SimpleDoc pages',
					urlMatcher:function (_urlParts) {
						return _urlParts.pathname == _memoryPath + '/url-dictionary';
					},
					builderInputs:function (_urlParts) {
						return {
							credits:_memoryPath + '/appendixes/credits.html.simpledata',
							endorsements:_memoryPath + '/endorsements.html.simpledata'
						};
					},
					builder:function (_inputs) {
						var _urlDictionary = {};

						/*** add the credits and endorsements links ***/
							function _addUrlsFromListingsInput (_inputName) {
								for (
									var
										_listingNo = -1,
										_listings = _readFile ({path:_inputs [_inputName]}).listings,
										_listingsLength = _listings.length,
										_listing
									;
									++_listingNo < _listingsLength;
								) {
									if ((_listing = _listings [_listingNo]).link)
										_urlDictionary [_listing.fullName] = _listing.link
									;
								}
							}
							_addUrlsFromListingsInput ('credits');
							_addUrlsFromListingsInput ('endorsements');

						/*** add links to module reference pages and JavaScript reference pages ***/
							function _addReferencePages (_sourceFolder,_sourceFileExtensionRegExp,_referenceFolder) {
								for (
									var
										_fileNo = -1,
										_referenceUrlPrefix = '/' + (_referenceFolder || _sourceFolder)+ '/',
										_files = _fileSystem.getFiles ({
											path:_sourcePath + '/' + _sourceFolder,
											pathMatcher:_sourceFileExtensionRegExp
										}),
										_filesLength = _files.length,
										_fileName
									;
									++_fileNo < _filesLength;
								)
									_urlDictionary [
										_fileName = Uize.Url.from (_files [_fileNo]).file
											.replace (_sourceFileExtensionRegExp,'')
									] = _referenceUrlPrefix + _fileName + '.html'
								;
							}
							_addReferencePages ('javascript-reference',/\.simple$/i);
							_addReferencePages ('js',/(\.js|\.js\.jst)$/i,'reference');

						return _urlDictionary;
					}
				});

			/*** handler for SimpleDoc explainers, appendixes, news, etc. ***/
				_registerUrlHandler ({
					description:'Explainers, generated from SimpleDoc files',
					urlMatcher:function (_urlParts) {
						return (
							_urlParts.fileType == 'html' &&
							_isUnderBuiltPath (_urlParts.folderPath) &&
							_fileSystem.fileExists ({
								path:_sourcePathFromBuiltPath (_urlParts.folderPath) + _urlParts.fileName + '.simple'
							})
						);
					},
					builderInputs:function (_urlParts) {
						var _folderPath = _urlParts.folderPath;
						return {
							simpleDoc:_sourcePathFromBuiltPath (_folderPath) + _urlParts.fileName + '.simple',
							simpleDocTemplate:_memoryPathFromBuiltPath (_folderPath) + '~SIMPLE-DOC-TEMPLATE.html.jst',
							urlDictionary:_memoryPath + '/url-dictionary'
						};
					},
					builder:function (_inputs) {
						var
							_simpleDocPath = _inputs.simpleDoc,
							_simpleDoc = Uize.Doc.Simple.build ({
								data:_fileSystem.readFile ({path:_simpleDocPath}),
								urlDictionary:_readFile ({path:_inputs.urlDictionary}),
								pathToRoot:_getPathToRoot (_simpleDocPath.slice (_sourcePath.length + 1)),
								result:'full'
							})
						;
						return _processSimpleDoc (
							_simpleDoc.metaData.title ||
							_getTitleFromFilename (Uize.Url.from (_simpleDocPath).file)
								.replace (/(^|\s)[a-z]/g,function (_match) {return _match.toUpperCase ()}),
							_simpleDoc,
							_inputs.simpleDocTemplate
						);
					}
				});

			/*** handler for JavaScript library modules ***/
				var
					_contentsCommentRegExp = /\/\*\s*Library\s*Contents/i,
					_lineStartsWithIdentifierCharRegExp = /^[a-zA-Z_$]/,
					_libraryUsesUizeModulesHeader =
						'/*______________\n' +
						'|       ______  |   B U I L T     O N     U I Z E     F R A M E W O R K\n' +
						'|     /      /  |   ---------------------------------------------------\n' +
						'|    /    O /   |   This JavaScript application is developed using the object\n' +
						'|   /    / /    |   oriented UIZE JavaScript framework as its foundation.\n' +
						'|  /    / /  /| |\n' +
						'| /____/ /__/_| |    ONLINE : http://www.uize.com\n' +
						'|          /___ |   LICENSE : Available under MIT License or GNU General Public License\n' +
						'|_______________|             http://www.uize.com/license.html\n' +
						'*/\n\n'
				;
				_registerUrlHandler ({
					description:'JavaScript library modules',
					urlMatcher:function (_urlParts) {
						return (
							!_isDev &&
							Uize.String.startsWith (_urlParts.pathname,_builtPath + '/js/') &&
							Uize.String.endsWith (_urlParts.pathname,'.library.js')
						);
					},
					builderInputs:function (_urlParts) {
						var
							_pathname = _urlParts.pathname,
							_librarySourcePath = _sourcePathFromBuiltPath (_pathname),
							_inputs = {librarySource:_librarySourcePath},
							_libraryFileContents = _fileSystem.readFile ({path:_librarySourcePath}),
							_contentsCommentStartPos = _libraryFileContents.search (_contentsCommentRegExp),
							_contentsCommentEndPos = _libraryFileContents.indexOf ('*/',_contentsCommentStartPos),
							_moduleNo = -1
						;
						Uize.forEach (
							Uize.String.Lines.split (
								_contentsCommentStartPos > -1
									?
										_libraryFileContents.slice (_contentsCommentStartPos,_contentsCommentEndPos)
											.replace (_contentsCommentRegExp,'')
									: _libraryFileContents
							),
							function (_moduleName) {
								if (
									(_moduleName = Uize.String.trim (_moduleName)) &&
									_lineStartsWithIdentifierCharRegExp.test (_moduleName)
								)
									_inputs ['libraryModule' + ++_moduleNo] = _builtPath + '/js/' + _moduleName + '.js'
								;
							}
						);
						return _inputs;
					},
					builder:function (_inputs) {
						function _stripModuleHeaderComment (_moduleText) {
							var _moduleHeaderCommentPos = _moduleText.indexOf ('/*');
							return (
								_moduleHeaderCommentPos > -1
									? (
										_moduleText.slice (0,_moduleHeaderCommentPos) +
										_moduleText.slice (_moduleText.indexOf ('*/',_moduleHeaderCommentPos + 2) + 2)
									)
									: _moduleText
							);
						}
						var
							_libraryFileContents = _fileSystem.readFile ({path:_inputs.librarySource}),
							_contentsCommentStartPos = _libraryFileContents.search (_contentsCommentRegExp),
							_contentsCommentEndPos = _libraryFileContents.indexOf ('*/',_contentsCommentStartPos),
							_libraryContentsChunks = [],
							_libraryUsesUizeModules
						;
						_forEachNumberedInput (
							_inputs,
							'libraryModule',
							function (_modulePath) {
								if (!_libraryUsesUizeModules)
									_libraryUsesUizeModules = Uize.String.startsWith (
										Uize.Url.from (_modulePath).fileName,
										'Uize'
									)
								;
								_libraryContentsChunks.push (
									_stripModuleHeaderComment (_fileSystem.readFile ({path:_modulePath}))
								);
							}
						);
						return (
							(_libraryUsesUizeModules ? _libraryUsesUizeModulesHeader : '') +
							_libraryFileContents.slice (0,_contentsCommentStartPos) +
							_libraryContentsChunks.join ('\n') +
							_libraryFileContents.slice (_contentsCommentEndPos + 2)
						);
					}
				});

			/*** handler for built JavaScript modules (scrunched, if preference configured) ***/
				var
					_scruncherPrefixChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
					_endsWithDotJsRegExp = /\.js$/,
					_moduleInheritanceDepthLookup = {
						Uize:0 // pre-cache this in order to prevent loading and re-evaluating the Uize base module
					}
				;
				function _getModuleInheritanceDepth (_moduleName,_moduleCode) {
					function _getModuleDefinitionFromCode (_moduleCode) {
						var
							_result,
							Uize = {module:function (_definition) {_result = _definition}}
						;
						eval (_moduleCode);
						return _result;
					}
					if (_moduleName in _moduleInheritanceDepthLookup) {
						return _moduleInheritanceDepthLookup [_moduleName];
					} else {
						var
							_inheritanceDepth = 0,
							_superclassKnown
						;
						if (!_moduleCode) {
							var _moduleUrl = 'js/' + _moduleName + '.js';
							_package.perform (Uize.copyInto ({},_lastParams,{url:_moduleUrl}));
							_moduleCode = _fileSystem.readFile ({path:_builtPath + '/' + _moduleUrl});
						}
						var _moduleDefinition = _getModuleDefinitionFromCode (_moduleCode);
						if (_moduleDefinition && (_superclassKnown = 'superclass' in _moduleDefinition)) {
							var _superclass = _moduleDefinition.superclass;
							if (_superclass)
								_inheritanceDepth = _getModuleInheritanceDepth (_superclass) + 1
							;
						}
						_superclassKnown ||
							Uize.require (
								_moduleName,
								function (_module) {_inheritanceDepth = Uize.Util.Oop.getInheritanceChain (_module).length}
							)
						;
						_moduleInheritanceDepthLookup [_moduleName] = _inheritanceDepth;
						return _moduleInheritanceDepthLookup [_moduleName] = _inheritanceDepth;
					}
				}
				_registerUrlHandler ({
					description:'Built JavaScript module',
					urlMatcher:function (_urlParts) {
						return _urlParts.fileType == 'js' && _isUnderBuiltPath (_urlParts.folderPath);
					},
					builderInputs:function (_urlParts) {
						return {jsTemp:_changePath (_urlParts.pathname,_builtPath,_tempPath)};
					},
					builder:function (_inputs) {
						var
							_path = _inputs.jsTemp,
							_result = _fileSystem.readFile ({path:_path})
						;
						if (!_isDev) {
							var
								_pathParts = Uize.Url.from (_path),
								_moduleName = _pathParts.fileName,
								_scruncherSettings = {},
								_sourceFileName = _pathParts.file,
								_headComment =
									_scrunchedHeadComments [_sourceFileName.slice (0,_sourceFileName.indexOf ('.'))],
								_keepHeadComment = _headComment == undefined
							;
							if (!_keepHeadComment)
								_scruncherSettings.KEEPHEADCOMMENT = 'FALSE'
							;
							if (Uize.String.startsWith (_path,_tempPath + '/js/')) {
								var _inheritanceDepth = _getModuleInheritanceDepth (_moduleName,_result);
								_scruncherSettings.MAPPINGS =
									'=' +
									(_inheritanceDepth ? _scruncherPrefixChars.charAt (_inheritanceDepth - 1) : '') +
									',' + _moduleName.replace (/\./g,'_')
								;
							}
							var _scruncherResult = Uize.Build.Scruncher.scrunch (_result,_scruncherSettings);
							_result =
								(
									_keepHeadComment
										? ''
										: Uize.substituteInto (
											_headComment,
											{buildDate:Uize.Date.toIso8601 (),moduleName:_moduleName},
											'{KEY}'
										)
								) + _scruncherResult.scrunchedCode
							;
							/*
							return {
								outputText:_result,
								logDetails:Uize.String.Lines.indent (_scruncherResult.report,2) + '\n'
							};
							*/
						}
						return _result;
					}
				});

			/*** handler for module reference pages ***/
				_registerUrlHandler ({
					description:'Module reference page',
					urlMatcher:function (_urlParts) {
						var _sourcePathSansExtension = _sourcePath + '/js/' + _urlParts.fileName;
						return (
							_urlParts.folderPath == _builtPath + '/reference/' &&
							(
								_fileSystem.fileExists ({path:_sourcePathSansExtension + '.js'}) ||
								_fileSystem.fileExists ({path:_sourcePathSansExtension + '.js.jst'})
							)
						);
					},
					builderInputs:function (_urlParts) {
						var _sourcePathSansExtension = _sourcePath + '/js/' + _urlParts.fileName;
						return {
							sourceCode:
								_sourcePathSansExtension +
								(_fileSystem.fileExists ({path:_sourcePathSansExtension + '.js'}) ? '.js' : '.js.jst'),
							simpleDocTemplate:_memoryPath + '/reference/~SIMPLE-DOC-TEMPLATE.html.jst',
							modulesTree:_memoryPath + '/modules-tree',
							urlDictionary:_memoryPath + '/url-dictionary',
							examplesByKeyword:_memoryPath + '/examples-by-keyword'
						};
					},
					builder:function (_inputs) {
						var
							_simpleDoc,
							_sourceCodePath = _inputs.sourceCode,
							_moduleName = Uize.Url.from (_sourceCodePath).file.replace (_moduleExtensionRegExp,'')
						;
						Uize.require (
							_moduleName,
							function (_module) {
								var
									_urlDictionary = _readFile ({path:_inputs.urlDictionary}),
									_moduleUrlFromDictionary = _urlDictionary [_moduleName]
								;
								_urlDictionary [_moduleName] = null;
								_simpleDoc = Uize.Doc.Sucker.toDocument (
									_fileSystem.readFile ({path:_sourceCodePath}),
									{
										urlDictionary:_urlDictionary,
										pathToRoot:'../',
										result:'full',
										module:_module,
										modulesTree:_readFile ({path:_inputs.modulesTree}),
										examples:_readFile ({path:_inputs.examplesByKeyword}) [_moduleName]
									}
								);
								_urlDictionary [_moduleName] = _moduleUrlFromDictionary;
							}
						);
						return _processSimpleDoc (_moduleName,_simpleDoc,_inputs.simpleDocTemplate);
					}
				});

			/*** handler for module source code pages ***/
				var _modulesSourceCodePagesPath = '/reference/source-code/';
				_registerUrlHandler ({
					description:'Module source code pages',
					urlMatcher:function (_urlParts) {
						return (
							_urlParts.fileType == 'html' &&
							_urlParts.folderPath == _builtPath + _modulesSourceCodePagesPath
						);
					},
					builderInputs:function (_urlParts) {
						return {
							sourceCode:_tempPath + '/js/' + _urlParts.fileName + '.js',
							sourceCodeTemplate:_memoryPath + _modulesSourceCodePagesPath + '~SOURCE-CODE-TEMPLATE.html.jst'
						};
					},
					builder:function (_inputs) {
						var
							_sourceCode = _inputs.sourceCode,
							_sourceFileName = Uize.Url.from (_sourceCode).file
						;
						return _readFile ({path:_inputs.sourceCodeTemplate}) ({
							sourceFilename:_sourceFileName,
							title:_getTitleFromFilename (_sourceFileName),
							body:_fileSystem.readFile ({path:_sourceCode})
						});
					}
				});

			/*** handler for example source code pages ***/
				var _examplesSourceCodePagesPath = '/examples/source-code/';
				_registerUrlHandler ({
					description:'Example source code pages',
					urlMatcher:function (_urlParts) {
						return (
							_urlParts.folderPath == _builtPath + _examplesSourceCodePagesPath &&
							_fileSystem.fileExists ({path:_sourcePath + '/examples/' + _urlParts.file})
						);
					},
					builderInputs:function (_urlParts) {
						return {
							sourceCode:_sourcePath + '/examples/' + _urlParts.file,
							sourceCodeTemplate:_memoryPath + _examplesSourceCodePagesPath + '~SOURCE-CODE-TEMPLATE.html.jst'
						};
					},
					builder:function (_inputs) {
						var
							_sourceCode = _inputs.sourceCode,
							_sourceFileName = Uize.Url.from (_sourceCode).file,
							_sourceFileText = _fileSystem.readFile ({path:_sourceCode})
						;
						return _readFile ({path:_inputs.sourceCodeTemplate}) ({
							sourceFilename:_sourceFileName,
							title:_sourceFileText.match (
								/<title>(.+?)\s*\|\s*JavaScript\s+(?:Tools|Examples)\s*(\|.*?)?<\/title>/
							) [1],
							body:_sourceFileText
						});
					}
				});

			/*** handler for SimpleData derived pages ***/
				_registerUrlHandler ({
					description:'SimpleData derived pages',
					urlMatcher:function (_urlParts) {
						var _pathname = _urlParts.pathname;
						return (
							_isUnderBuiltPath (_urlParts.pathname) &&
							_fileSystem.fileExists ({path:_sourcePathFromBuiltPath (_pathname) + '.jst'}) &&
							_fileSystem.fileExists ({path:_sourcePathFromBuiltPath (_pathname) + '.simpledata'})
						);
					},
					builderInputs:function (_urlParts) {
						var _pathname = _urlParts.pathname;
						return {
							jstTemplate:_memoryPathFromBuiltPath (_pathname) + '.jst',
							simpleData:_sourcePathFromBuiltPath (_pathname) + '.simpledata'
						};
					},
					builder:function (_inputs) {
						return _readFile ({path:_inputs.jstTemplate}) (
							Uize.Data.Simple.parse ({
								simple:_fileSystem.readFile ({path:_inputs.simpleData}),
								collapseChildren:true
							})
						);
					}
				});

			/*** handler for compiled JST modules ***/
				var _jsJstRegExp = /\.js\.jst$/i;
				_registerUrlHandler ({
					description:'Compiled JST modules, generated from .js.jst files',
					urlMatcher:function (_urlParts) {
						var _pathname = _urlParts.pathname;
						return (
							_urlParts.fileType == 'js' &&
							_isUnderTempPath (_pathname) &&
							_fileSystem.fileExists ({path:_changePath (_pathname,_tempPath,_sourcePath) + '.jst'})
						);
					},
					builderInputs:function (_urlParts) {
						return {jstSource:_changePath (_urlParts.pathname,_tempPath,_sourcePath) + '.jst'};
					},
					builder:function (_inputs) {
						var _jstSource = _inputs.jstSource;
						return Uize.Template.Module.buildTemplateModuleText (
							Uize.Url.from (_jstSource).file.replace (_jsJstRegExp,''),
							_fileSystem.readFile ({path:_jstSource})
						);
					}
				});

			/*** handler for in-memory module metadata objects **/
				var
					_moduleMetaDataExtensionRegExp = /\.js\.metadata$/,
					_metaDataCommentRegExp = /\/\*\s*Module\s*Meta\s*Data/i
				;
				_registerUrlHandler ({
					description:'In-memory module metadata object',
					urlMatcher:function (_urlParts) {
						var _pathname = _urlParts.pathname;
						return _isUnderMemoryPath (_pathname) && _moduleMetaDataExtensionRegExp.test (_pathname);
					},
					builderInputs:function (_urlParts) {
						return {
							jsModule:
								_changePath (_urlParts.pathname,_memoryPath,_tempPath)
									.replace (_moduleMetaDataExtensionRegExp,'.js')
						};
					},
					builder:function (_inputs) {
						var
							_moduleText = _readFile ({path:_inputs.jsModule}),
							_metaDataCommentStartPos = _moduleText.search (_metaDataCommentRegExp),
							_metaDataCommentEndPos = _moduleText.indexOf ('*/',_metaDataCommentStartPos),
							_metaDataText = _metaDataCommentStartPos > -1
								?
									_moduleText.slice (_metaDataCommentStartPos,_metaDataCommentEndPos)
										.replace (_metaDataCommentRegExp,'')
								: ''
						;
						return (
							_metaDataText
								?
									Uize.Data.Simple.parse ({
										simple:Uize.String.Lines.normalizeIndent (_metaDataText),
										collapseChildren:true
									})
								: {}
						);
					}
				});

			/*** handler for in-memory built size for modules **/
				var _moduleBuiltSizeExtensionRegExp = /\.js\.builtsize$/;
				_registerUrlHandler ({
					description:'In-memory built size for module',
					urlMatcher:function (_urlParts) {
						var _pathname = _urlParts.pathname;
						return _isUnderMemoryPath (_pathname) && _moduleBuiltSizeExtensionRegExp.test (_pathname);
					},
					builderInputs:function (_urlParts) {
						return {
							builtModule:
								_changePath (_urlParts.pathname,_memoryPath,_builtPath)
									.replace (_moduleBuiltSizeExtensionRegExp,'.js')
						};
					},
					builder:function (_inputs) {
						return _readFile ({path:_inputs.builtModule}).length;
					}
				});

			/*** handler for the SOTU page ***/
				/* TODO:
					- nice-to-haves, per module
						- number of modules that require the module (ie. how shared is the module throughout framework, or is it more isolated)
						- total number of modules (directly and indirectly) required by the module
						- total scrunched size of all modules (directly and indirectly) required by the module
						- creation date of the module
						- developers for the module
				*/
				function _isModuleForSotu (_moduleName) {
					return (
						(_moduleName == 'Uize' || Uize.String.startsWith (_moduleName,'Uize.')) &&
						!Uize.String.startsWith (_moduleName,'Uize.Test.')
					);
				}

				_registerUrlHandler ({
					description:'SOTU (State of the UIZE) page',
					urlMatcher:function (_urlParts) {
						return _urlParts.pathname == _builtPath + '/appendixes/sotu.html';
					},
					builderInputs:function (_urlParts) {
						var _inputs = {
							jstSource:_changePath (_urlParts.pathname,_builtPath,_memoryPath) + '.jst',
							referencesIndex:_memoryPath + '/reference.index',
							examplesByKeyword:_memoryPath + '/examples-by-keyword'
						};
						Uize.forEach (
							_getModules (),
							function (_moduleName) {
								if (_isModuleForSotu (_moduleName)) {
									var _modulePathSuffix = '/js/' + _moduleName + '.js';
									_inputs ['moduleBuiltSize_' + _moduleName] =
										_memoryPath + _modulePathSuffix + '.builtsize'
									;
									_inputs ['moduleMetaData_' + _moduleName] =
										_memoryPath + _modulePathSuffix + '.metadata'
									;
								}
							}
						);
						return _inputs;
					},
					builder:function (_inputs) {
						var
							_moduleReferenceFiles = _readFile ({path:_inputs.referencesIndex}),
							_examplesByKeyword = _readFile ({path:_inputs.examplesByKeyword}),
							_modules = []
						;
						for (
							var _moduleReferenceFileNo = -1, _moduleReferenceFilesLength = _moduleReferenceFiles.length;
							++_moduleReferenceFileNo < _moduleReferenceFilesLength;
						) {
							var
								_moduleReferenceFile = _moduleReferenceFiles [_moduleReferenceFileNo],
								_moduleName = _moduleReferenceFile.title
							;
							if (_isModuleForSotu (_moduleName)) {
								var
									_metaData = _readFile ({path:_inputs ['moduleMetaData_' + _moduleName]}),
									_directSubmodules = 0,
									_nestedSubmodules = 0
								;
								for (
									var
										_submoduleNo = _moduleReferenceFileNo,
										_moduleNamePlusDot = _moduleName + '.',
										_moduleNamePlusDotLength = _moduleNamePlusDot.length
									;
									++_submoduleNo < _moduleReferenceFilesLength;
								) {
									var _submoduleName = _moduleReferenceFiles [_submoduleNo].title;
									if (Uize.String.startsWith (_submoduleName,_moduleNamePlusDot)) {
										_nestedSubmodules++;
										_submoduleName.indexOf ('.',_moduleNamePlusDotLength) == -1 && _directSubmodules++;
									}
								}

								_modules.push ({
									name:_moduleName,
									description:_moduleReferenceFile.description,
									examples:(_examplesByKeyword [_moduleName] || _sacredEmptyArray).length,
									directSubmodules:_directSubmodules,
									nestedSubmodules:_nestedSubmodules,
									type:_metaData.type || 'Unknown',
									importance:+_metaData.importance || 0,
									codeCompleteness:+_metaData.codeCompleteness || 0,
									docCompleteness:+_metaData.docCompleteness || 0,
									testCompleteness:+_metaData.testCompleteness || 0,
									keywords:_metaData.keywords || '',
									scrunchedFileSize:_readFile ({path:_inputs ['moduleBuiltSize_' + _moduleName]})
								});
							}
						}
						return _readFile ({path:_inputs.jstSource}) ({modules:_modules});
					}
				});

			/*** handler for static assets ***/
				_registerUrlHandler ({
					description:'Fallback handler for static assets',
					urlMatcher:function (_urlParts) {
						return (
							Uize.String.startsWith (_urlParts.folderPath,_builtPath) &&
							_fileSystem.fileExists ({path:_sourcePathFromBuiltPath (_urlParts.pathname)})
						);
					},
					builderInputs:function (_urlParts) {
						return {sourcePath:_sourcePathFromBuiltPath (_urlParts.pathname)};
					}
				});

		/*** Public Static Methods ***/
			_package.getJsModules = function (_sourcePath) {
				return Uize.map (
					_fileSystem.getFiles ({
						path:_sourcePath + '/js',
						pathMatcher:_moduleExtensionRegExp
					}),
					function (_fileName) {return _fileName.replace (_moduleExtensionRegExp,'')}
				);
			};

			_package.getIndexableFiles = function (_sourcePath,_indexableFolderUnderSource,_indexableFileExtensionRegExp) {
				return _fileSystem.getFiles ({
					path:_sourcePath + '/' + _indexableFolderUnderSource,
					pathMatcher:function (_filePath) {
						return (
							_indexableFileExtensionRegExp.test (_filePath) &&
							!Uize.String.startsWith (Uize.Url.from (_filePath).fileName,'~')
						);
					}
				});
			};

			_package.perform = function (_params,_pathPrefix) {
				_lastParams = Uize.copyInto ({},_params);
				var _filesConsideredCurrentLookup = {};

				function _ensureFileCurrent (_url) {
					/*
						- how handlers are used...
							- handler is picked by going through all the handlers in sequence, until a handler matches the URL path
							- handlers are recursive, so for every handler that maps a requested path to a source path, the remaining handlers are evaluated to see if any apply to the source path
								- so, for example, a handler for scrunched JavaScript modules can rely on a handler for compiled JST modules, so that if a .jst source file is modified, requesting the scrunched compiled JST module will result in the .jst source file first being compiled to a JST source module, and then being scrunched to a scrunched JST module
							- handlers can also register build needs
							- handlers can have multiple inputs
								- a handler for a SimpleDoc explainer HTML URL will have at least two direct inputs...
									- the .simple source file
									- the .jst JavaScript template used to build the HTML file
							- some handlers may need to check multiple files to determine if the current built result is current
								- for example, a handler for a JavaScript module doc HTML page will need to check that none of the modules along the modules inheritance chain (if it is a class module) have a more recent modified date, since the documentation reflects inherited features for classes

						- needed items can be objects, in memory
							- as objects in memory, needed objects can have a last modified date

						- a JST template can have template modules as dependencies
							- template module dependencies are dependencies for the process of using of such a JST template
							- if one of the template module dependencies is modified since the last build using the JST template, then the last built product of the JST template would need to be rebuilt

						- with a request driven model for build process, for the purpose of performance, any file can have an internal / parsed representation as an object
							- so, for example, a .json file that is built as part of a build process can also be stored in memory as a JavaScript object, so that processes that repeatedly use the .json file as an input can not have to repeatedly parse the
							- all files can be modified through their string or object interfaces
								- if modified through object interface...
									- buffered serialization, buffered writing to file
									- immediate serialization when requested in text form or requested through file interface
									- writing to file can be decoupled from serialization to text, as a consequence of file system service
								- if modified through file interface...
									- immediate parsing when requested in object form
							- to aid in performance, files can be cached in a memory cache system (such as memcache)
					*/
					if (_filesConsideredCurrentLookup [_url] != _trueFlag) {
						var
							_urlParts = Uize.Url.from (_url),
							_matchingHandler
						;
						for (
							var _urlHandlerNo = -1, _urlHandlersLength = _urlHandlers.length, _urlHandler;
							++_urlHandlerNo < _urlHandlersLength;
						) {
							if ((_urlHandler = _urlHandlers [_urlHandlerNo]).urlMatcher (_urlParts)) {
								_matchingHandler = _urlHandler;
								break;
							}
						}
						if (_matchingHandler) {
							var
								_builderInputs = (_matchingHandler.builderInputs || Uize.nop) (_urlParts),
								_builder = _matchingHandler.builder
							;
							if (_builderInputs || _builder) {
								var
									_path = _urlParts.pathname,
									_mustBuild = !_fileExists ({path:_path}),
									_lastBuiltDate = _mustBuild ? 0 : _getModifiedDate ({path:_path}),
									_builderInput
								;
								_mustBuild || (_mustBuild = _lastBuiltDate < _minAllowedModifiedDate);
								for (var _builderInputName in _builderInputs) {
									_ensureFileCurrent (_builderInput = _builderInputs [_builderInputName]);
									_mustBuild || (
										_mustBuild = Math.max (
											_getModifiedDate ({path:_builderInput}),
											_minAllowedModifiedDate
										) > _lastBuiltDate
									);
								}
								if (_mustBuild) {
									var
										_startTime = Uize.now (),
										_buildError
									;
									try {
										_builder
											? _writeFile ({path:_url,contents:_builder (_builderInputs,_urlParts)})
											: _fileSystem.copyFile ({path:Uize.values (_builderInputs) [0],targetPath:_url})
										;
										_filesConsideredCurrentLookup [_url] = _trueFlag;
									} catch (_error) {
										_buildError = _error;
									}
									_log (
										(_buildError ? '*** BUILD FAILED' : 'BUILT') + ': ' + _url + '\n' +
											'\tduration: ' + (Uize.now () - _startTime) + '\n' +
											'\tbuilder: ' + _matchingHandler.description + '\n' +
											'\tbuilder inputs:\n' +
												Uize.map (
													Uize.keys (_builderInputs),
													function (_key) {return '\t\t' + _key + ': ' + _builderInputs [_key] + '\n'}
												).join ('')
									);
									if (_buildError) {
										_log (_buildError);
										throw _buildError;
									}
								} else {
									_filesConsideredCurrentLookup [_url] = _trueFlag;
								}
							}
						}
					}
				}

				_minAllowedModifiedDate = Uize.toNumber (_params.minAllowedModifiedDate,-Infinity);
				_sourcePath = _params.sourcePath;
				_tempPath = _params.tempPath;
				_builtPath = _params.builtPath;
				_memoryPath = _params.memoryPath;
				_isDev = _params.isDev == 'true';
				_scrunchedHeadComments = _params.scrunchedHeadComments || {};

				var _url = _params.url;
				if (_pathPrefix == _undefined)
					_pathPrefix = _builtPath + '/'
				;
				if (Uize.isArray (_url)) {
					Uize.forEach (_url,function (_url) {_ensureFileCurrent (_pathPrefix + _url)});
				} else {
					_ensureFileCurrent (_pathPrefix + _url);
				}
				/*?
					Static Methods
						UizeSite.Build.File.perform
							SYNTAX
							........................................
							UizeSite.Build.File.perform (paramsOBJ);
							........................................

							Parameters
								url
									A string, specifying the URL, relative to the built path, of the file that should be built.

								sourcePath
									A string, specifying the folder path for the site's source code.

								tempPath
									A string, specifying the folder path for temporary files created while building files for the site.

								builtPath
									A string, specifying the folder path for the built files of the site.

								minAllowedModifiedDate
									document...

								isDev
									document...
				*/
			};

			_package.readFile = _readFile;

		return _package;
	}
});

