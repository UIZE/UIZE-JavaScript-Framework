/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.WebServer Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	testCompleteness: 0
	docCompleteness: 4
*/

/* TODO:
	- to implement
		- handlers
			- handler for UizeSite.ExamplesInfoForSiteMap
			- handler for SOTU
		- factor out file building into separate module, so that file building can be triggered by build scripts
			- put in support in factored out code for producing log output, so that built scripts can generate log files much like before
		- update all build scripts to trigger file building using new approach
	- to fix
		- SimpleDoc files need to be supplied with urlDictionary
		- UizeSite.SiteMap should dynamically reflect the following...
			- the news-by-year index pages
			- the JavaScript reference pages
*/

/*?
	Introduction
		The =UizeSite.Build.WebServer= package provides a method for running a Web server for the UIZE Web site on the localhost.

		*DEVELOPERS:* `Chris van Rensburg`

		EXAMPLE USAGE
		......................................................................................................
		node _build.js UizeSite.Build.WebServer sourcePath=site-source tempPath=site-temp builtPath=site-built freshBuild=true
		......................................................................................................

		Parameters
			sourcePath
				document...

			tempPath
				document...

			builtPath
				document...

			freshBuild
				document...

			isDev
				document...
*/

Uize.module ({
	name:'UizeSite.Build.WebServer',
	required:[
		'Uize.Url',
		'Uize.String',
		'Uize.Date',
		'Uize.Services.FileSystem',
		'Uize.Doc.Simple',
		'Uize.Templates.JstModule',
		'Uize.Data.Simple',
		'Uize.Doc.Sucker',
		'Uize.Util.Oop',
		'Uize.Data.Matches',
		'Uize.Build.Util',
		'UizeSite.Build.Util',
		'Uize.Array.Sort',
		'Uize.Data.PathsTree'
	],
	builder:function () {
		/*** Variables for Scruncher Optimization ***/
			var
				_package = function () {},
				_Uize = Uize,
				_Uize_Url = _Uize.Url,
				_undefined
			;

		/*** General Variables ***/
			var
				_fileSystem = Uize.Services.FileSystem.singleton (),
				_sacredEmptyObject = {}
			;

		/*** Public Static Methods ***/
			_package.perform = function (_params) {
				var
					_port = 1337,
					_host = '127.0.0.1',
					_http = require ('http'),
					_mimeTypes = {
						html:'text/html',
						text:'text/plain',
						js:'application/javascript',
						css:'text/css',
						png:'image/png',
						gif:'image/gif',
						jpg:'image/jpeg'
					},
					_urlHandlers = [],
					_minAllowedModifiedDate = _params.freshBuild == 'true' ? Uize.now () : -Infinity,
					_sourcePath = _params.sourcePath,
					_tempPath = _params.tempPath,
					_builtPath = _params.builtPath
					_memoryPath = 'memory',
					_isDev = _params.isDev == 'true',
					_scrunchedHeadComments = _params.scrunchedHeadComments || {},
					_moduleExtensionRegExp = /(\.js|\.js\.jst)$/
				;

				function _getModules () {
					return Uize.map (
						_fileSystem.getFiles ({
							path:_sourcePath + '/js',
							pathMatcher:_moduleExtensionRegExp
						}),
						function (_fileName) {return _fileName.replace (_moduleExtensionRegExp,'')}
					);
				}

				function _registerUrlHandler (_urlHandler) {
					_urlHandlers.push (_urlHandler);
				}

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

				/*** misc utilities ***/
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

					function _pathExists (_params) {
						var _path = _params.path;
						return _isUnderMemoryPath (_path) ? !!_objectCache [_path] : _fileSystem.pathExists (_params);
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
												imageSrc:'../images/widgets/' + _widgetTitleUrlized + '-96x96.gif',
												description:_widget.description.short
											};
										}
									)
								});
							}
						});

					/*** handler for widget homepages ***/
						var _widgetHomepageRegExp = new RegExp (
							_builtPath + '/' + _widgetsToGoPath + '[^\\/\\.]+\\.html'
						);
						_registerUrlHandler ({
							description:'Widget homepages',
							urlMatcher:function (_urlParts) {
								return _widgetHomepageRegExp.test (_urlParts.pathname);
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
						var _widgetIframePageRegExp = new RegExp (
							_builtPath + '/' + _widgetsToGoPath + '([^\\/\\.]+)/(?:web|mobile)\\.html'
						);
						_registerUrlHandler ({
							description:'Widget IFRAME pages',
							urlMatcher:function (_urlParts) {
								return _widgetIframePageRegExp.test (_urlParts.pathname);
							},
							builderInputs:function (_urlParts) {
								var _widgetsToGoMemoryPath = _memoryPath + '/' + _widgetsToGoPath;
								return {
									template:_widgetsToGoMemoryPath + 'widget.html.jst',
									widgets:_widgetsToGoMemoryPath + 'widgets.simpledata'
								};
							},
							builder:function (_inputs,_urlParts) {
								var _widgetTitleUrlized = _urlParts.pathname.match (_widgetIframePageRegExp) [1];
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
								return _widgetGoogleGadgetPageRegExp.test (_urlParts.pathname);
							},
							builderInputs:function (_urlParts) {
								var _widgetsToGoMemoryPath = _memoryPath + '/' + _widgetsToGoPath;
								return {
									template:_widgetsToGoMemoryPath + 'gadget.xml.jst',
									widgets:_widgetsToGoMemoryPath + 'widgets.simpledata'
								};
							},
							builder:function (_inputs,_urlParts) {
								var _widgetTitleUrlized = _urlParts.pathname.match (_widgetGoogleGadgetPageRegExp) [1];
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
								UizeSite.Build.Util.getFirstTitleSegment
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
						var
							_inMemoryFileInfoPath = _memoryPath + '/' + _indexableFolderUnderBuilt,
							_inMemoryHtmlFilesIndexPath = _inMemoryFileInfoPath + '.index'
						;
						_registerUrlHandler ({
							description:'In-memory HTML files index for the ' + _indexableFolderUnderBuilt + ' folder',
							urlMatcher:function (_urlParts) {
								return _urlParts.pathname == _inMemoryHtmlFilesIndexPath;
							},
							builderInputs:function (_urlParts) {
								var _inputs = {};
								Uize.forEach (
									_fileSystem.getFiles ({
										path:_sourcePath + '/' + _indexableFolderUnderSource,
										pathMatcher:function (_filePath) {
											return (
												_indexableFileExtensionRegExp.test (_filePath) &&
												!Uize.String.startsWith (Uize.Url.from (_filePath).fileName,'~')
											);
										}
									}),
									function (_filePath,_fileNo) {
										_inputs ['fileInfo' + _fileNo] =
											_inMemoryFileInfoPath + '/' +
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

					var _examplesByKeywordPath = _memoryPath + '/examples-by-keyword';
					_registerUrlHandler ({
						description:'Examples-by-keyword lookup',
						urlMatcher:function (_urlParts) {
							return _urlParts.pathname == _examplesByKeywordPath;
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
								examplesByKeyword:_examplesByKeywordPath
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

				/*** handlers for news index pages ***/
					_registerInMemoryHtmlFilesIndexHandler ('news','news',/\.simple$/,-1);

					/*** handler for news-by-year index pages ***/
						var _newsByYearPath = _memoryPath + '/news-by-year';
						_registerUrlHandler ({
							description:'News-by-year lookup',
							urlMatcher:function (_urlParts) {
								return _urlParts.pathname == _newsByYearPath;
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
									newsByYear:_newsByYearPath
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
							return {template:_memoryPathFromBuiltPath (_urlParts.pathname) + '.jst'};
						},
						builder:function (_inputs) {
							return _readFile ({path:_inputs.template}) ();
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
							return _urlParts.pathname == _tempPath +'/js/' + _modulesTreeDataModuleName + '.js';
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

				/*** handler for SimpleDoc explainers, appendixes, news, etc. ***/
					_registerUrlHandler ({
						description:'Explainers, generated from SimpleDoc files',
						urlMatcher:function (_urlParts) {
							var _folderPath = _urlParts.folderPath;
							return (
								_urlParts.fileType == 'html' &&
								_isUnderBuiltPath (_folderPath) &&
								_fileSystem.pathExists ({
									path:_sourcePathFromBuiltPath (_urlParts.folderPath) + _urlParts.fileName + '.simple'
								})
							);
						},
						builderInputs:function (_urlParts) {
							var _folderPath = _urlParts.folderPath;
							return {
								simpleDoc:_sourcePathFromBuiltPath (_folderPath) + _urlParts.fileName + '.simple',
								simpleDocTemplate:_memoryPathFromBuiltPath (_folderPath) + '~SIMPLE-DOC-TEMPLATE.html.jst'
							};
						},
						builder:function (_inputs) {
							var
								_simpleDocPath = _inputs.simpleDoc,
								_simpleDoc = Uize.Doc.Simple.build ({
									data:_fileSystem.readFile ({path:_simpleDocPath}),
									//urlDictionary:_urlDictionary,
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
							var _folderPath = _urlParts.folderPath;
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
								_libraryFileContents = _fileSystem.readFile ({path:_librarySourcePath})
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

				/*** handler for JavaScript built modules (scrunched, if preference configured) ***/
					var
						_scruncherPrefixChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
						_endsWithDotJsRegExp = /\.js$/
					;
					_registerUrlHandler ({
						description:'JavaScript modules',
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
								if (Uize.String.startsWith (_path,_tempPath + '/js/'))
									Uize.require (
										_moduleName,
										function (_module) {
											var _inheritanceDepth = Uize.Util.Oop.getInheritanceChain (_module).length;
											_scruncherSettings.MAPPINGS =
												'=' +
												(_inheritanceDepth ? _scruncherPrefixChars.charAt (_inheritanceDepth - 1) : '') +
												',' + _moduleName.replace (/\./g,'_')
											;
										}
									)
								;
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
								return _result;
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

				/*** handler for module reference docs ***/
					var _urlDictionary = {};
					_registerUrlHandler ({
						description:'Module reference pages',
						urlMatcher:function (_urlParts) {
							var
								_folderPath = _urlParts.folderPath,
								_sourcePathSansExtension = _sourcePath + '/js/' + _urlParts.fileName
							;
							return (
								_folderPath == _builtPath + '/reference/' &&
								(
									_fileSystem.pathExists ({path:_sourcePathSansExtension + '.js'}) ||
									_fileSystem.pathExists ({path:_sourcePathSansExtension + '.js.jst'})
								)
							);
						},
						builderInputs:function (_urlParts) {
							var _sourcePathSansExtension = _sourcePath + '/js/' + _urlParts.fileName;
							return {
								sourceCode:
									_sourcePathSansExtension +
									(_fileSystem.pathExists ({path:_sourcePathSansExtension + '.js'}) ? '.js' : '.js.jst'),
								simpleDocTemplate:_memoryPath + '/reference/~SIMPLE-DOC-TEMPLATE.html.jst',
								modulesTree:_memoryPath + '/modules-tree',
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
									var _moduleUrlFromDictionary = _urlDictionary [_moduleName];
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
							var _folderPath = _urlParts.folderPath;
							return (
								_urlParts.folderPath == _builtPath + _modulesSourceCodePagesPath &&
								_fileSystem.pathExists ({path:_sourcePath + '/js/' + _urlParts.fileName + '.js'})
							);
						},
						builderInputs:function (_urlParts) {
							return {
								sourceCode:_sourcePath + '/js/' + _urlParts.fileName + '.js',
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
							var _folderPath = _urlParts.folderPath;
							return (
								_urlParts.folderPath == _builtPath + _examplesSourceCodePagesPath &&
								_fileSystem.pathExists ({path:_sourcePath + '/examples/' + _urlParts.file})
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
								_fileSystem.pathExists ({path:_sourcePathFromBuiltPath (_pathname) + '.jst'}) &&
								_fileSystem.pathExists ({path:_sourcePathFromBuiltPath (_pathname) + '.simpledata'})
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
								_fileSystem.pathExists ({path:_changePath (_pathname,_tempPath,_sourcePath) + '.jst'})
							);
						},
						builderInputs:function (_urlParts) {
							return {jstSource:_changePath (_urlParts.pathname,_tempPath,_sourcePath) + '.jst'};
						},
						builder:function (_inputs) {
							var _jstSource = _inputs.jstSource;
							return Uize.Templates.JstModule.process ({
								moduleName:Uize.Url.from (_jstSource).file.replace (_jsJstRegExp,''),
								compiledTemplate:Uize.Template.compile (
									_fileSystem.readFile ({path:_jstSource}),
									{result:'full'}
								)
							});
						}
					});

				/*** handler for static assets ***/
					_registerUrlHandler ({
						description:'Fallback handler for static assets',
						urlMatcher:function (_urlParts) {
							var _folderPath = _urlParts.folderPath;
							return (
								Uize.String.startsWith (_folderPath,_builtPath) &&
								_fileSystem.pathExists ({path:_sourcePathFromBuiltPath (_urlParts.pathname)})
							);
						},
						builderInputs:function (_urlParts) {
							return {sourcePath:_sourcePathFromBuiltPath (_urlParts.pathname)};
						}
					});

				function _ensureFileCurrent (_url) {
					/*** remove query from URL (since we don't handle this on the server side yet) ***/
						var _queryPos = _url.indexOf ('?');
						if (_queryPos > -1)
							_url = _url.slice (0,_queryPos)
						;

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
					var
						_urlParts = _Uize_Url.from (_url),
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
								_mustBuild = !_pathExists ({path:_path}),
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
								} catch (_error) {
									_buildError = _error;
								}
								console.log (
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
									console.log (_buildError);
									throw _buildError;
								}
							}
						}
					}
				}

				_http.createServer (
					function (_request,_response) {
						var
							_requestUrl = _builtPath + (_request.url == '/' ? '/index.html' : _request.url),
							_fileContents,
							_startTime = Uize.now ()
						;
						try {
							_ensureFileCurrent (_requestUrl);
							var _urlParts = _Uize_Url.from (_requestUrl);
							_fileContents = _fileSystem.readFile ({path:_urlParts.pathname,encoding:'buffer'});
							_response.writeHead (200,{'Content-Type':_mimeTypes [_urlParts.fileType]});
						} catch (_error) {
							console.log ('404: ' + _requestUrl);
							_fileContents = '404';
							_response.writeHead (404,{'Content-Type':'text/html'});
						}
						_response.end (_fileContents);
						console.log ('PAGE DELIVERY TIME: ' + _requestUrl + ' (' + (Uize.now () - _startTime) + ')\n');
					}
				).listen (_port,_host);

				console.log ('Server running at http://' + _host + ':' + _port + '/');
				/*?
					Static Methods
						UizeSite.Build.WebServer.perform
							SYNTAX
							.............................................
							UizeSite.Build.WebServer.perform (paramsOBJ);
							.............................................

							Parameters
								sourcePath
									A string, specifying the folder path for the site's source code.

								tempPath
									A string, specifying the folder path for temporary files created while building files for the site.

								builtPath
									A string, specifying the folder path for the built files of the site.
				*/
			};

		return _package;
	}
});

