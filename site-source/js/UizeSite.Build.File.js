/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.File Namespace
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 0
	docCompleteness: 2
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
			builtPath
				.

			freshBuild
				.

			isDev
				.

			memoryPath
				.

			minAllowedModifiedDate
				.

			url
				.

			sourcePath
				.

			tempPath
				.
*/

Uize.module ({
	name:'UizeSite.Build.File',
	superclass:'Uize.Services.FileBuilderAdapter',
	required:[
		'Uize.Url',
		'Uize.String',
		'Uize.Date',
		'Uize.Doc.Simple',
		'Uize.Template.Module',
		'Uize.Data.Simple',
		'Uize.Doc.Sucker',
		'Uize.Util.Oop',
		'Uize.Data.Matches',
		'Uize.Build.Util',
		'UizeSite.Build.Util',
		'Uize.Build.ModuleInfo',
		'Uize.Array.Sort',
		'Uize.Data.PathsTree',
		'Uize.String.Lines',
		'UizeSite.SiteMap'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_class = _superclass.subclass (),
				_undefined
			;

		/*** General Variables ***/
			var
				_sacredEmptyArray = [],
				_moduleExtensionRegExp = /(\.js|\.js\.jst)$/,
				_threeFoldersDeepRegExp = /^([^\\\/]+)[\\\/]([^\\\/]+)[\\\/]([^\\\/]+)[\\\/][^\\\/]+$/
			;

		/*** Utility Functions ***/
			function _getTitleFromFilename (_filename) {
				return _filename.match (/(.*)\.[^\.]*$/) [1].replace (/-/g,' ');
			}

			function _getPathToRoot (_path) {
				return Uize.String.repeat ('../',_path.length - _path.replace (/[\/\\]/g,'').length);
			}

			function _forEachNumberedProperty (_object,_propertyNamePrefix,_handler) {
				var
					_propertyNo = -1,
					_propertyName,
					_propertyValue
				;
				while ((_propertyValue = _object [_propertyName = _propertyNamePrefix + ++_propertyNo]) != _undefined)
					_handler (_propertyValue,_propertyName)
				;
			}

		_class.instanceMethods ({
			_processSimpleDoc:function (_title,_simpleDocBuildResult,_simpleDocTemplatePath,_extraTemplateInputs) {
				var
					_contentsTreeItems = _simpleDocBuildResult.contentsTreeItems,
					_contentsTreeItem0 = _contentsTreeItems [0]
				;
				return this.readFile ({path:_simpleDocTemplatePath}) (
					Uize.copyInto (
						{
							title:_title,
							description:
								(
									_contentsTreeItem0 &&
									(_contentsTreeItem0.description || (_contentsTreeItem0.items [0] || {}).description)
								) || '',
							body:_simpleDocBuildResult.html
						},
						_extraTemplateInputs
					)
				);
			},

			getJsModules:function () {
				return UizeSite.Util.Build.getJsModules (this.params.sourcePath);
			},

			init:function (_params,_callback) {
				var _this = this;

				/*** handler for source files ***/
					_this.registerUrlHandler ({
						description:'Short-circuit handling for source files',
						urlMatcher:function (_urlParts) {return this.isSourceUrl (_urlParts.folderPath)}
					});

				/*** handler for the home page ***/
					_this.registerUrlHandler ({
						description:'Homepage',
						urlMatcher:function (_urlParts) {
							return _urlParts.pathname == this.builtUrl ('index.html');
						},
						builderInputs:function (_urlParts) {
							return {
								template:this.memoryUrlFromBuiltUrl (_urlParts.pathname) + '.jst',
								newsItems:this.memoryUrl ('news.index')
							};
						},
						builder:function (_inputs) {
							return this.readFile ({path:_inputs.template}) ({
								latestNews:this.readFile ({path:_inputs.newsItems}).slice (0,10)
							});
						}
					});

				/*** handlers for Widgets To Go pages ***/
					var _widgetsToGoPath = 'widgets/';

					function _urlizeWidgetTitle (_widget) {
						return _widget.title.toLowerCase ().replace (/\s+/g,'-');
					}

					/*** handler for Widgets To Go index page ***/
						_this.registerUrlHandler ({
							description:'Widgets To Go index page',
							urlMatcher:function (_urlParts) {
								return _urlParts.pathname == this.builtUrl ('javascript-widgets.html');
							},
							builderInputs:function (_urlParts) {
								return {
									template:this.memoryUrlFromBuiltUrl (_urlParts.pathname) + '.jst',
									widgets:this.memoryUrl (_widgetsToGoPath + 'widgets.simpledata')
								};
							},
							builder:function (_inputs) {
								return this.readFile ({path:_inputs.template}) ({
									files:Uize.map (
										this.readFile ({path:_inputs.widgets}).widgets,
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
						_this.registerUrlHandler ({
							description:'Widget homepages',
							urlMatcher:function (_urlParts) {
								return (
									_urlParts.fileType == 'html' &&
									_urlParts.folderPath == this.builtUrl (_widgetsToGoPath)
								);
							},
							builderInputs:function (_urlParts) {
								var _widgetsToGoMemoryPath = this.memoryUrl (_widgetsToGoPath);
								return {
									template:_widgetsToGoMemoryPath + 'homepage.html.jst',
									widgets:_widgetsToGoMemoryPath + 'widgets.simpledata'
								};
							},
							builder:function (_inputs,_urlParts) {
								var _widgetTitleUrlized = _urlParts.fileName;
								return this.readFile ({path:_inputs.template}) (
									Uize.Data.Matches.firstValue (
										this.readFile ({path:_inputs.widgets}).widgets,
										function (_widget) {return _widgetTitleUrlized == _urlizeWidgetTitle (_widget)}
									)
								);
							}
						});

					/*** handler for widget iframe pages ***/
						_this.registerUrlHandler ({
							description:'Widget IFRAME pages',
							urlMatcher:function (_urlParts) {
								return (
									_urlParts.fileType == 'html' &&
									Uize.String.startsWith (_urlParts.folderPath,this.builtUrl (_widgetsToGoPath)) &&
									(_urlParts.fileName == 'web' || _urlParts.fileName == 'mobile') &&
									_threeFoldersDeepRegExp.test (_urlParts.pathname)
								);
							},
							builderInputs:function (_urlParts) {
								var _widgetsToGoMemoryPath = this.memoryUrl (_widgetsToGoPath);
								return {
									template:_widgetsToGoMemoryPath + 'widget.html.jst',
									widgets:_widgetsToGoMemoryPath + 'widgets.simpledata'
								};
							},
							builder:function (_inputs,_urlParts) {
								var _widgetTitleUrlized = _urlParts.pathname.match (_threeFoldersDeepRegExp) [3];
								return this.readFile ({path:_inputs.template}) ({
									widget:Uize.Data.Matches.firstValue (
										this.readFile ({path:_inputs.widgets}).widgets,
										function (_widget) {return _widgetTitleUrlized == _urlizeWidgetTitle (_widget)}
									),
									mobile:_urlParts.fileName == 'mobile'
								});
							}
						});

					/*** handler for widget Google Gadget XML pages ***/
						_this.registerUrlHandler ({
							description:'Widget Google Gadget XML pages',
							urlMatcher:function (_urlParts) {
								return (
									_urlParts.file == 'gadget.xml' &&
									Uize.String.startsWith (_urlParts.folderPath,this.builtUrl (_widgetsToGoPath)) &&
									_threeFoldersDeepRegExp.test (_urlParts.pathname)
								);
							},
							builderInputs:function (_urlParts) {
								var _widgetsToGoMemoryPath = this.memoryUrl (_widgetsToGoPath);
								return {
									template:_widgetsToGoMemoryPath + 'gadget.xml.jst',
									widgets:_widgetsToGoMemoryPath + 'widgets.simpledata'
								};
							},
							builder:function (_inputs,_urlParts) {
								var _widgetTitleUrlized = _urlParts.pathname.match (_threeFoldersDeepRegExp) [3];
								return this.readFile ({path:_inputs.template}) (
									Uize.Data.Matches.firstValue (
										this.readFile ({path:_inputs.widgets}).widgets,
										function (_widget) {return _widgetTitleUrlized == _urlizeWidgetTitle (_widget)}
									)
								);
							}
						});

				/*** handler for Google Code sitemap ***/
					_this.registerUrlHandler ({
						description:'Google Code sitemap',
						urlMatcher:function (_urlParts) {
							return _urlParts.pathname == this.builtUrl ('sitemap-code.xml');
						},
						builderInputs:function (_urlParts) {
							return {template:this.memoryUrlFromBuiltUrl (_urlParts.pathname) + '.jst'};
						},
						builder:function (_inputs) {
							return this.readFile ({path:_inputs.template}) ({modules:this.getJsModules ()});
						}
					});

				/*** handler for in-memory HTML page info objects **/
					var _htmlInfoExtensionRegExp = /\.html\.info$/;
					_this.registerUrlHandler ({
						description:'In-memory HTML page info object',
						urlMatcher:function (_urlParts) {
							var _pathname = _urlParts.pathname;
							return this.isMemoryUrl (_pathname) && _htmlInfoExtensionRegExp.test (_pathname);
						},
						builderInputs:function (_urlParts) {
							return {
								htmlFile:
									this.builtUrlFromMemoryUrl (_urlParts.pathname)
										.replace (_htmlInfoExtensionRegExp,'.html')
							};
						},
						builder:function (_inputs) {
							var _info = Uize.Build.Util.getHtmlFileInfo (
								_inputs.htmlFile,
								function (_title) {return _title.match (/^\s*(.*?)\s*\|/) [1]}
							);
							_info.path = _info.path.slice (this.params.builtPath.length + 1);
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
						_this.registerUrlHandler ({
							description:'In-memory HTML files index for the ' + _indexableFolderUnderBuilt + ' folder',
							urlMatcher:function (_urlParts) {
								return _urlParts.pathname == this.memoryUrl (_indexableFolderUnderBuilt + '.index');
							},
							builderInputs:function (_urlParts) {
								var
									_this = this,
									_inputs = {}
								;
								Uize.forEach (
									UizeSite.Build.Util.getIndexableFiles (
										_this.params.sourcePath,_indexableFolderUnderSource,_indexableFileExtensionRegExp
									),
									function (_filePath,_fileNo) {
										_inputs ['fileInfo' + _fileNo] = _this.memoryUrl (
											_indexableFolderUnderBuilt + '/' +
											_filePath.replace (_indexableFileExtensionRegExp,'') + '.html.info'
										);
									}
								);
								return _inputs;
							},
							builder:function (_inputs) {
								var
									_this = this,
									_index = []
								;
								_forEachNumberedProperty (
									_inputs,
									'fileInfo',
									function (_fileInfoPath) {_index.push (_this.readFile ({path:_fileInfoPath}))}
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
						_this.registerUrlHandler ({
							description:_description,
							urlMatcher:function (_urlParts) {
								return _urlParts.pathname == this.builtUrl (_indexPageFileName + '.html');
							},
							builderInputs:function (_urlParts) {
								return {
									template:this.memoryUrlFromBuiltUrl (_urlParts.pathname) + '.jst',
									filesIndex:this.memoryUrl (_indexableFolderUnderBuilt + '.index')
								};
							},
							builder:function (_inputs) {
								return this.readFile ({path:_inputs.template}) ({files:this.readFile ({path:_inputs.filesIndex})});
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

					/*** handler for the modules TO DO index page ***/
						_registerIndexPageUrlHandler (
							'JavaScript modules TO DO index page',
							'todo/modules',
							'todo/modules',
							'todo/modules',
							/\.simple$/
						);

				/*** handler for examples-by-keyword index pages ***/
					_registerInMemoryHtmlFilesIndexHandler ('examples','examples',/\.html$/);

					_this.registerUrlHandler ({
						description:'Examples-by-keyword lookup',
						urlMatcher:function (_urlParts) {
							return _urlParts.pathname == this.memoryUrl ('examples-by-keyword');
						},
						builderInputs:function (_urlParts) {
							return {filesIndex:this.memoryUrl ('examples.index')};
						},
						builder:function (_inputs) {
							var
								_examples = this.readFile ({path:_inputs.filesIndex}),
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
					_this.registerUrlHandler ({
						description:'Examples-by-keyword index page',
						urlMatcher:function (_urlParts) {
							return (
								_urlParts.fileType == 'html' &&
								this.isBuiltUrl (_urlParts.pathname) &&
								_examplesKeywordRegExp.test (_urlParts.fileName)
							);
						},
						builderInputs:function (_urlParts) {
							return {
								template:this.memoryUrl ('javascript-examples.html.jst'),
								examplesByKeyword:this.memoryUrl ('examples-by-keyword')
							};
						},
						builder:function (_inputs,_urlParts) {
							var _keyword = _urlParts.fileName.match (_examplesKeywordRegExp) [2] || '';
							return this.readFile ({path:_inputs.template}) ({
								keyword:_keyword,
								files:this.readFile ({path:_inputs.examplesByKeyword}) [_keyword] || []
							});
						}
					});

				/*** handler for javascript-examples-by-module index page ***/
					var _examplesByModuleFile = 'javascript-examples-by-module.html';
					_this.registerUrlHandler ({
						description:'JavaScript examples by module index page',
						urlMatcher:function (_urlParts) {
							return _urlParts.pathname == this.builtUrl (_examplesByModuleFile);
						},
						builderInputs:function () {
							return {
								template:this.memoryUrl (_examplesByModuleFile + '.jst'),
								examplesIndex:this.memoryUrl ('examples.index')
							};
						},
						builder:function (_inputs) {
							return this.readFile ({path:_inputs.template}) ({
								examples:this.readFile ({path:_inputs.examplesIndex})}
							);
						}
					});

				/*** handlers for news index pages ***/
					_registerInMemoryHtmlFilesIndexHandler ('news','news',/\.simple$/,-1);

					/*** handler for news-by-year index pages ***/
						_this.registerUrlHandler ({
							description:'News-by-year lookup',
							urlMatcher:function (_urlParts) {
								return _urlParts.pathname == this.memoryUrl ('news-by-year');
							},
							builderInputs:function (_urlParts) {
								return {filesIndex:this.memoryUrl ('news.index')};
							},
							builder:function (_inputs) {
								var
									_newsItems = this.readFile ({path:_inputs.filesIndex}),
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
						_this.registerUrlHandler ({
							description:'News-by-year index page',
							urlMatcher:function (_urlParts) {
								return (
									_urlParts.fileType == 'html' &&
									this.isBuiltUrl (_urlParts.pathname) &&
									_newsByYearRegExp.test (_urlParts.fileName)
								);
							},
							builderInputs:function (_urlParts) {
								return {
									template:this.memoryUrl ('news.html.jst'),
									newsByYear:this.memoryUrl ('news-by-year')
								};
							},
							builder:function (_inputs,_urlParts) {
								var
									_year = _urlParts.fileName.match (_newsByYearRegExp) [2] || '',
									_newsItems = this.readFile ({path:_inputs.newsByYear}) [_year] || []
								;
								return this.readFile ({path:_inputs.template}) ({
									year:_year,
									files:_year ? _newsItems : _newsItems.slice (0,50)
								});
							}
						});

					/*** handler for latest news RSS feed ***/
						_this.registerUrlHandler ({
							description:'Latest news RSS feed',
							urlMatcher:function (_urlParts) {
								return _urlParts.pathname == this.builtUrl ('latest-news.rss');
							},
							builderInputs:function (_urlParts) {
								return {
									newsItems:this.memoryUrl ('news.index'),
									template:this.memoryUrlFromBuiltUrl (_urlParts.pathname) + '.jst'
								};
							},
							builder:function (_inputs) {
								return this.readFile ({path:_inputs.template}) ({
									items:Uize.map (
										this.readFile ({path:_inputs.newsItems}).slice (0,50),
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
					_this.registerUrlHandler ({
						description:'Directory page',
						urlMatcher:function (_urlParts) {
							return _urlParts.pathname == this.builtUrl ('directory.html');
						},
						builderInputs:function (_urlParts) {
							return {
								modulesTree:this.memoryUrl ('modules-tree'),
								examplesInfoForSiteMap:this.memoryUrl ('examples-info-for-sitemap'),
								template:this.memoryUrlFromBuiltUrl (_urlParts.pathname) + '.jst'
							};
						},
						builder:function (_inputs) {
							return this.readFile ({path:_inputs.template}) ({
								siteMap:UizeSite.SiteMap ({
									modulesTree:this.readFile ({path:_inputs.modulesTree}),
									examplesInfo:this.readFile ({path:_inputs.examplesInfoForSiteMap})
								})
							});
						}
					});

				/*** handler for in-memory compiled JST templates ***/
					_this.registerUrlHandler ({
						description:'In-memory compiled JST templates',
						urlMatcher:function (_urlParts) {
							return this.isMemoryUrl (_urlParts.pathname) && _urlParts.fileType == 'jst';
						},
						builderInputs:function (_urlParts) {
							return {source:this.sourceUrlFromMemoryUrl (_urlParts.pathname)};
						},
						builder:function (_inputs) {
							var _template = Uize.Template.compile (
								this.readFile ({path:_inputs.source}),
								{result:'full'}
							);
							Uize.require (_template.required);
							return _template.templateFunction;
						}
					});

				/*** handler for in-memory parsed SimpleData files ***/
					_this.registerUrlHandler ({
						description:'In-memory parsed SimpleData files',
						urlMatcher:function (_urlParts) {
							return this.isMemoryUrl (_urlParts.pathname) && _urlParts.fileType == 'simpledata';
						},
						builderInputs:function (_urlParts) {
							return {source:this.sourceUrlFromMemoryUrl (_urlParts.pathname)};
						},
						builder:function (_inputs) {
							return Uize.Data.Simple.parse ({
								simple:this.readFile ({path:_inputs.source}),
								collapseChildren:true
							});
						}
					});

				/*** handler for in-memory modules tree object ***/
					_this.registerUrlHandler ({
						description:'In-memory modules tree object',
						urlMatcher:function (_urlParts) {
							return _urlParts.pathname == this.memoryUrl ('modules-tree');
						},
						builder:function () {
							return Uize.Data.PathsTree.fromList (this.getJsModules (),'.');
						}
					});

				/*** handler for generated UizeSite.ModulesTree module under temp ***/
					var _modulesTreeDataModuleName = 'UizeSite.ModulesTree';
					_this.registerUrlHandler ({
						description:'Generated UizeSite.ModulesTree module under temp',
						urlMatcher:function (_urlParts) {
							return _urlParts.pathname == this.tempUrl ('js/' + _modulesTreeDataModuleName + '.js');
						},
						builderInputs:function () {
							return {modulesTree:this.memoryUrl ('modules-tree')};
						},
						builder:function (_inputs) {
							return Uize.Build.Util.dataAsModule (
								_modulesTreeDataModuleName,
								this.readFile ({path:_inputs.modulesTree})
							);
						}
					});

				/*** handler for generated UizeSite.Examples module under temp ***/
					var _examplesDataModuleName = 'UizeSite.Examples';
					_this.registerUrlHandler ({
						description:'Generated UizeSite.Examples module under temp',
						urlMatcher:function (_urlParts) {
							return _urlParts.pathname == this.tempUrl ('js/' + _examplesDataModuleName + '.js');
						},
						builderInputs:function () {
							return {filesIndex:this.memoryUrl ('examples.index')};
						},
						builder:function (_inputs) {
							return Uize.Build.Util.dataAsModule (
								_examplesDataModuleName,
								this.readFile ({path:_inputs.filesIndex})
							);
						}
					});

				/*** handler for in-memory examples-info-for-sitemap object ***/
					_this.registerUrlHandler ({
						description:'In-memory examples-info-for-sitemap object',
						urlMatcher:function (_urlParts) {
							return _urlParts.pathname == this.memoryUrl ('examples-info-for-sitemap');
						},
						builderInputs:function () {
							return {examplesByKeyword:this.memoryUrl ('examples-by-keyword')};
						},
						builder:function (_inputs) {
							var _examplesByKeyword = this.readFile ({path:_inputs.examplesByKeyword});
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
					_this.registerUrlHandler ({
						description:'Generated UizeSite.ExamplesInfoForSiteMap module under temp',
						urlMatcher:function (_urlParts) {
							return _urlParts.pathname == this.tempUrl ('js/' + _examplesInfoForSiteMapModuleName + '.js');
						},
						builderInputs:function () {
							return {examplesInfoForSiteMap:this.memoryUrl ('examples-info-for-sitemap')};
						},
						builder:function (_inputs) {
							return Uize.Build.Util.dataAsModule (
								_examplesInfoForSiteMapModuleName,
								this.readFile ({path:_inputs.examplesInfoForSiteMap})
							);
						}
					});

				/*** handler for regular JavaScript modules under temp ***/
					_this.registerUrlHandler ({
						description:'Regular JavaScript modules under temp',
						urlMatcher:function (_urlParts) {
							var _pathname = _urlParts.pathname;
							return (
								_urlParts.fileType == 'js' &&
								this.isTempUrl (_pathname) &&
								this.fileExists ({path:this.sourceUrlFromTempUrl (_pathname)})
							);
						},
						builderInputs:function (_urlParts) {
							return {sourceJs:this.sourceUrlFromTempUrl (_urlParts.pathname)};
						}
					});

				/*** handler for in-memory URL dictionary for SimpleDoc pages ***/
					_this.registerUrlHandler ({
						description:'In-memory URL dictionary for SimpleDoc pages',
						urlMatcher:function (_urlParts) {
							return _urlParts.pathname == this.memoryUrl ('url-dictionary');
						},
						builderInputs:function (_urlParts) {
							return {
								credits:this.memoryUrl ('appendixes/credits.html.simpledata'),
								endorsements:this.memoryUrl ('endorsements.html.simpledata')
							};
						},
						builder:function (_inputs) {
							var
								_this = this,
								_urlDictionary = {}
							;

							/*** add the credits and endorsements links ***/
								function _addUrlsFromListingsInput (_inputName) {
									for (
										var
											_listingNo = -1,
											_listings = _this.readFile ({path:_inputs [_inputName]}).listings,
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
											_files = _this.fileSystem.getFiles ({
												path:_this.sourceUrl (_sourceFolder),
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
					_this.registerUrlHandler ({
						description:'Explainers, generated from SimpleDoc files',
						urlMatcher:function (_urlParts) {
							return (
								_urlParts.fileType == 'html' &&
								this.isBuiltUrl (_urlParts.folderPath) &&
								this.fileExists ({
									path:this.sourceUrlFromBuiltUrl (_urlParts.folderPath) + _urlParts.fileName + '.simple'
								})
							);
						},
						builderInputs:function (_urlParts) {
							var _folderPath = _urlParts.folderPath;
							return {
								simpleDoc:this.sourceUrlFromBuiltUrl (_folderPath) + _urlParts.fileName + '.simple',
								simpleDocTemplate:this.memoryUrlFromBuiltUrl (_folderPath) + '~SIMPLE-DOC-TEMPLATE.html.jst',
								urlDictionary:this.memoryUrl ('url-dictionary')
							};
						},
						builder:function (_inputs) {
							var
								_simpleDocPath = _inputs.simpleDoc,
								_simpleDoc = Uize.Doc.Simple.build ({
									data:this.readFile ({path:_simpleDocPath}),
									urlDictionary:this.readFile ({path:_inputs.urlDictionary}),
									pathToRoot:_getPathToRoot (_simpleDocPath.slice (this.params.sourcePath.length + 1)),
									result:'full'
								})
							;
							return this._processSimpleDoc (
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
					_this.registerUrlHandler ({
						description:'JavaScript library modules',
						urlMatcher:function (_urlParts) {
							return (
								!this.params.isDev &&
								Uize.String.startsWith (_urlParts.pathname,this.builtUrl ('js/')) &&
								Uize.String.endsWith (_urlParts.pathname,'.library.js')
							);
						},
						builderInputs:function (_urlParts) {
							var
								_this = this,
								_pathname = _urlParts.pathname,
								_librarySourcePath = _this.sourceUrlFromBuiltUrl (_pathname),
								_inputs = {librarySource:_librarySourcePath},
								_libraryFileContents = _this.readFile ({path:_librarySourcePath}),
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
										_inputs ['libraryModule' + ++_moduleNo] = _this.builtUrl ('js/' + _moduleName + '.js')
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
								_this = this,
								_libraryFileContents = _this.readFile ({path:_inputs.librarySource}),
								_contentsCommentStartPos = _libraryFileContents.search (_contentsCommentRegExp),
								_contentsCommentEndPos = _libraryFileContents.indexOf ('*/',_contentsCommentStartPos),
								_libraryContentsChunks = [],
								_libraryUsesUizeModules
							;
							_forEachNumberedProperty (
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
										_stripModuleHeaderComment (_this.readFile ({path:_modulePath}))
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
					_this.registerUrlHandler ({
						description:'Built JavaScript module',
						urlMatcher:function (_urlParts) {
							return _urlParts.fileType == 'js' && this.isBuiltUrl (_urlParts.folderPath);
						},
						builderInputs:function (_urlParts) {
							return {jsTemp:this.tempUrlFromBuiltUrl (_urlParts.pathname)};
						},
						builder:function (_inputs) {
							var
								_this = this,
								_path = _inputs.jsTemp,
								_result = _this.readFile ({path:_path})
							;
							function _getModuleInheritanceDepth (_moduleName,_moduleCode) {
								if (_moduleName in _moduleInheritanceDepthLookup) {
									return _moduleInheritanceDepthLookup [_moduleName];
								} else {
									var
										_inheritanceDepth = 0,
										_superclassKnown
									;
									if (!_moduleCode) {
										var _moduleUrl = 'js/' + _moduleName + '.js';
										_this.perform (Uize.copyInto ({},_this.params,{url:_moduleUrl}));
										_moduleCode = _this.readFile ({path:_this.builtUrl (_moduleUrl)});
									}
									var _moduleDefinition = Uize.Build.ModuleInfo.getDefinitionFromCode (_moduleCode);
									if (_moduleDefinition && (_superclassKnown = 'superclass' in _moduleDefinition)) {
										var _superclass = _moduleDefinition.superclass;
										if (_superclass)
											_inheritanceDepth = _getModuleInheritanceDepth (_superclass) + 1
										;
									}
									_superclassKnown ||
										Uize.require (
											_moduleName,
											function (_module) {
												_inheritanceDepth = Uize.Util.Oop.getInheritanceChain (_module).length;
											}
										)
									;
									_moduleInheritanceDepthLookup [_moduleName] = _inheritanceDepth;
									return _moduleInheritanceDepthLookup [_moduleName] = _inheritanceDepth;
								}
							}
							if (!_this.params.isDev) {
								var
									_pathParts = Uize.Url.from (_path),
									_moduleName = _pathParts.fileName,
									_scruncherSettings = {},
									_sourceFileName = _pathParts.file,
									_headComment = _this.params.scrunchedHeadComments [
										_sourceFileName.slice (0,_sourceFileName.indexOf ('.'))
									],
									_keepHeadComment = _headComment == undefined
								;
								if (!_keepHeadComment)
									_scruncherSettings.KEEPHEADCOMMENT = 'FALSE'
								;
								if (Uize.String.startsWith (_path,_this.tempUrl ('js/'))) {
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
					_this.registerUrlHandler ({
						description:'Module reference page',
						urlMatcher:function (_urlParts) {
							var _sourcePathSansExtension = this.sourceUrl ('js/' + _urlParts.fileName);
							return (
								_urlParts.folderPath == this.builtUrl ('reference/') &&
								(
									this.fileExists ({path:_sourcePathSansExtension + '.js'}) ||
									this.fileExists ({path:_sourcePathSansExtension + '.js.jst'})
								)
							);
						},
						builderInputs:function (_urlParts) {
							var _sourcePathSansExtension = this.sourceUrl ('js/' + _urlParts.fileName);
							return {
								sourceCode:
									_sourcePathSansExtension +
									(this.fileExists ({path:_sourcePathSansExtension + '.js'}) ? '.js' : '.js.jst'),
								simpleDocTemplate:this.memoryUrl ('reference/~SIMPLE-DOC-TEMPLATE.html.jst'),
								modulesTree:this.memoryUrl ('modules-tree'),
								urlDictionary:this.memoryUrl ('url-dictionary'),
								examplesByKeyword:this.memoryUrl ('examples-by-keyword')
							};
						},
						builder:function (_inputs) {
							var
								_this = this,
								_simpleDoc,
								_sourceCodePath = _inputs.sourceCode,
								_moduleName = Uize.Url.from (_sourceCodePath).file.replace (_moduleExtensionRegExp,'')
							;
							Uize.require (
								_moduleName,
								function (_module) {
									var
										_urlDictionary = _this.readFile ({path:_inputs.urlDictionary}),
										_moduleUrlFromDictionary = _urlDictionary [_moduleName]
									;
									_urlDictionary [_moduleName] = null;
									_simpleDoc = Uize.Doc.Sucker.toDocument (
										_this.readFile ({path:_sourceCodePath}),
										{
											urlDictionary:_urlDictionary,
											pathToRoot:'../',
											result:'full',
											module:_module,
											modulesTree:_this.readFile ({path:_inputs.modulesTree}),
											examples:_this.readFile ({path:_inputs.examplesByKeyword}) [_moduleName]
										}
									);
									_urlDictionary [_moduleName] = _moduleUrlFromDictionary;
								}
							);
							return _this._processSimpleDoc (
								_moduleName,
								_simpleDoc,
								_inputs.simpleDocTemplate,
								{hasToDo:_this.fileExists ({path:this.sourceUrl ('todo/modules/' + _moduleName + '.simple')})}
							);
						}
					});

				/*** handler for module source code pages ***/
					var _modulesSourceCodePagesPath = '/reference/source-code/';
					_this.registerUrlHandler ({
						description:'Module source code pages',
						urlMatcher:function (_urlParts) {
							return (
								_urlParts.fileType == 'html' &&
								_urlParts.folderPath == this.builtUrl (_modulesSourceCodePagesPath)
							);
						},
						builderInputs:function (_urlParts) {
							return {
								sourceCode:this.tempUrl ('js/' + _urlParts.fileName + '.js'),
								sourceCodeTemplate:this.memoryUrl (_modulesSourceCodePagesPath + '~SOURCE-CODE-TEMPLATE.html.jst')
							};
						},
						builder:function (_inputs) {
							var
								_sourceCode = _inputs.sourceCode,
								_sourceFileName = Uize.Url.from (_sourceCode).file
							;
							return this.readFile ({path:_inputs.sourceCodeTemplate}) ({
								sourceFilename:_sourceFileName,
								title:_getTitleFromFilename (_sourceFileName),
								body:this.readFile ({path:_sourceCode})
							});
						}
					});

				/*** handler for example source code pages ***/
					var _examplesSourceCodePagesPath = '/examples/source-code/';
					_this.registerUrlHandler ({
						description:'Example source code pages',
						urlMatcher:function (_urlParts) {
							return (
								_urlParts.folderPath == this.builtUrl (_examplesSourceCodePagesPath) &&
								this.fileExists ({path:this.sourceUrl ('examples/' + _urlParts.file)})
							);
						},
						builderInputs:function (_urlParts) {
							return {
								sourceCode:this.sourceUrl ('examples/' + _urlParts.file),
								sourceCodeTemplate:this.memoryUrl (_examplesSourceCodePagesPath + '~SOURCE-CODE-TEMPLATE.html.jst')
							};
						},
						builder:function (_inputs) {
							var
								_sourceCode = _inputs.sourceCode,
								_sourceFileName = Uize.Url.from (_sourceCode).file,
								_sourceFileText = this.readFile ({path:_sourceCode})
							;
							return this.readFile ({path:_inputs.sourceCodeTemplate}) ({
								sourceFilename:_sourceFileName,
								title:_sourceFileText.match (
									/<title>(.+?)\s*\|\s*JavaScript\s+(?:Tools|Examples)\s*(\|.*?)?<\/title>/
								) [1],
								body:_sourceFileText
							});
						}
					});

				/*** handler for SimpleData derived pages ***/
					_this.registerUrlHandler ({
						description:'SimpleData derived pages',
						urlMatcher:function (_urlParts) {
							var _pathname = _urlParts.pathname;
							return (
								this.isBuiltUrl (_urlParts.pathname) &&
								this.fileExists ({path:this.sourceUrlFromBuiltUrl (_pathname) + '.jst'}) &&
								this.fileExists ({path:this.sourceUrlFromBuiltUrl (_pathname) + '.simpledata'})
							);
						},
						builderInputs:function (_urlParts) {
							var _pathname = _urlParts.pathname;
							return {
								jstTemplate:this.memoryUrlFromBuiltUrl (_pathname) + '.jst',
								simpleData:this.sourceUrlFromBuiltUrl (_pathname) + '.simpledata'
							};
						},
						builder:function (_inputs) {
							return this.readFile ({path:_inputs.jstTemplate}) (
								Uize.Data.Simple.parse ({
									simple:this.readFile ({path:_inputs.simpleData}),
									collapseChildren:true
								})
							);
						}
					});

				/*** handler for compiled JST modules ***/
					var _jsJstRegExp = /\.js\.jst$/i;
					_this.registerUrlHandler ({
						description:'Compiled JST modules, generated from .js.jst files',
						urlMatcher:function (_urlParts) {
							var _pathname = _urlParts.pathname;
							return (
								_urlParts.fileType == 'js' &&
								this.isTempUrl (_pathname) &&
								this.fileExists ({path:this.sourceUrlFromTempUrl (_pathname) + '.jst'})
							);
						},
						builderInputs:function (_urlParts) {
							return {jstSource:this.sourceUrlFromTempUrl (_urlParts.pathname) + '.jst'};
						},
						builder:function (_inputs) {
							var _jstSource = _inputs.jstSource;
							return Uize.Template.Module.buildTemplateModuleText (
								Uize.Url.from (_jstSource).file.replace (_jsJstRegExp,''),
								this.readFile ({path:_jstSource})
							);
						}
					});

				/*** handler for in-memory module metadata objects **/
					var
						_moduleMetaDataExtensionRegExp = /\.js\.metadata$/,
						_metaDataCommentRegExp = /\/\*\s*Module\s*Meta\s*Data/i
					;
					_this.registerUrlHandler ({
						description:'In-memory module metadata object',
						urlMatcher:function (_urlParts) {
							var _pathname = _urlParts.pathname;
							return this.isMemoryUrl (_pathname) && _moduleMetaDataExtensionRegExp.test (_pathname);
						},
						builderInputs:function (_urlParts) {
							var
								_inputs = {
									jsModule:
										this.tempUrlFromMemoryUrl (_urlParts.pathname.replace (_moduleMetaDataExtensionRegExp,'.js'))
								},
								_testModulePath =
									'js/' +
									Uize.Build.Util.getTestModuleName (_urlParts.file.replace (_moduleMetaDataExtensionRegExp,'')) +
									'.js'
							;
							if (this.fileExists ({path:this.sourceUrl (_testModulePath)}))
								_inputs.testModuleMetaData = this.memoryUrl (_testModulePath + '.metadata')
							;
							return _inputs;
						},
						builder:function (_inputs) {
							var
								_moduleText = this.readFile ({path:_inputs.jsModule}),
								_metaDataCommentStartPos = _moduleText.search (_metaDataCommentRegExp),
								_metaDataCommentEndPos = _moduleText.indexOf ('*/',_metaDataCommentStartPos),
								_metaDataText = _metaDataCommentStartPos > -1
									?
										_moduleText.slice (_metaDataCommentStartPos,_metaDataCommentEndPos)
											.replace (_metaDataCommentRegExp,'')
									: '',
								_metaData = _metaDataText
									?
										Uize.Data.Simple.parse ({
											simple:Uize.String.Lines.normalizeIndent (_metaDataText),
											collapseChildren:true
										})
									: {},
								_testModuleMetaData = _inputs.testModuleMetaData
							;
							if (_testModuleMetaData)
								_metaData.testCompleteness = +this.readFile ({path:_testModuleMetaData}).codeCompleteness || 0
							;
							return _metaData;
						}
					});

				/*** handler for in-memory built size for modules **/
					var _moduleBuiltSizeExtensionRegExp = /\.js\.builtsize$/;
					_this.registerUrlHandler ({
						description:'In-memory built size for module',
						urlMatcher:function (_urlParts) {
							var _pathname = _urlParts.pathname;
							return this.isMemoryUrl (_pathname) && _moduleBuiltSizeExtensionRegExp.test (_pathname);
						},
						builderInputs:function (_urlParts) {
							return {
								builtModule:
									this.builtUrlFromMemoryUrl (_urlParts.pathname).replace (_moduleBuiltSizeExtensionRegExp,'.js')
							};
						},
						builder:function (_inputs) {
							return this.readFile ({path:_inputs.builtModule}).length;
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

					_this.registerUrlHandler ({
						description:'SOTU (State of the UIZE) page',
						urlMatcher:function (_urlParts) {
							return _urlParts.pathname == this.builtUrl ('appendixes/sotu.html');
						},
						builderInputs:function (_urlParts) {
							var
								_this = this,
								_inputs = {
									jstSource:_this.memoryUrlFromBuiltUrl (_urlParts.pathname) + '.jst',
									referencesIndex:_this.memoryUrl ('reference.index'),
									examplesByKeyword:_this.memoryUrl ('examples-by-keyword')
								}
							;
							Uize.forEach (
								_this.getJsModules (),
								function (_moduleName) {
									if (_isModuleForSotu (_moduleName)) {
										var _modulePathSuffix = '/js/' + _moduleName + '.js';
										_inputs ['moduleBuiltSize_' + _moduleName] =
											_this.memoryUrl (_modulePathSuffix + '.builtsize')
										;
										_inputs ['moduleMetaData_' + _moduleName] =
											_this.memoryUrl (_modulePathSuffix + '.metadata')
										;
									}
								}
							);
							return _inputs;
						},
						builder:function (_inputs) {
							var
								_moduleReferenceFiles = this.readFile ({path:_inputs.referencesIndex}),
								_examplesByKeyword = this.readFile ({path:_inputs.examplesByKeyword}),
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
										_metaData = this.readFile ({path:_inputs ['moduleMetaData_' + _moduleName]}),
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
										scrunchedFileSize:this.readFile ({path:_inputs ['moduleBuiltSize_' + _moduleName]})
									});
								}
							}
							return this.readFile ({path:_inputs.jstSource}) ({modules:_modules});
						}
					});

				/*** handler for static assets ***/
					_this.registerUrlHandler ({
						description:'Fallback handler for static assets',
						urlMatcher:function (_urlParts) {
							return (
								this.isBuiltUrl (_urlParts.folderPath) &&
								this.fileExists ({path:this.sourceUrlFromBuiltUrl (_urlParts.pathname)})
							);
						},
						builderInputs:function (_urlParts) {
							return {sourcePath:this.sourceUrlFromBuiltUrl (_urlParts.pathname)};
						}
					});

				_callback ();
			}
		});

		return _class;
	}
});

