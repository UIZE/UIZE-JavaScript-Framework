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
		node build.js UizeSite.Build.File url=reference/Uize.html sourcePath=site-source tempPath=site-temp memoryPath=site-memory builtPath=site-built staleBefore=now
		......................................................................................................

		Parameters
			builtPath
				.

			staleBefore
				.

			isDev
				.

			memoryPath
				.

			staleBefore
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
		'Uize.Doc.Simple',
		'Uize.Data.Simple',
		'Uize.Data.Matches',
		'Uize.Build.Util',
		'UizeSite.Build.Util',
		'Uize.Array.Sort',
		'Uize.Data.PathsTree',
		'Uize.String.Lines',
		'Uize.Build.FileBuilders.SourceFiles',
		'Uize.Build.FileBuilders.UnprocessedFiles',
		'UizeSite.Build.FileBuilders.Homepage',
		'UizeSite.Build.FileBuilders.WidgetsToGoPages',
		'UizeSite.Build.FileBuilders.GoogleCodeSitemap',
		'Uize.Build.FileBuilders.InMemoryHtmlInfo',
		'UizeSite.Build.FileBuilders.JavaScriptExamplesByModule',
		'UizeSite.Build.FileBuilders.DirectoryPage',
		'Uize.Build.FileBuilders.BuiltModules',
		'UizeSite.Build.FileBuilders.ModuleReferencePages',
		'UizeSite.Build.FileBuilders.ModuleSourceCodePages',
		'UizeSite.Build.FileBuilders.ExampleSourceCodePages',
		'Uize.Build.FileBuilders.SimpleDataPages',
		'Uize.Build.FileBuilders.CompiledJstModules',
		'Uize.Build.FileBuilders.InMemoryModuleMetadata',
		'Uize.Build.FileBuilders.InMemoryModuleBuiltSize',
		'UizeSite.Build.FileBuilders.SotuPage'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			instanceMethods:{
				processSimpleDoc:function (_title,_simpleDocBuildResult,_simpleDocTemplatePath,_extraTemplateInputs) {
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
					return UizeSite.Build.Util.getJsModules (this.params.sourcePath);
				},

				init:function (_params,_callback) {
					var _this = this;

					_this.registerFileBuilders (
						Uize.Build.FileBuilders.SourceFiles,
						Uize.Build.FileBuilders.UnprocessedFiles,
						UizeSite.Build.FileBuilders.Homepage,
						UizeSite.Build.FileBuilders.WidgetsToGoPages,
						UizeSite.Build.FileBuilders.GoogleCodeSitemap,
						Uize.Build.FileBuilders.InMemoryHtmlInfo
					);

					/*** handlers for some index pages ***/
						function _registerInMemoryHtmlFilesIndexHandler (
							_indexableFolderUnderSource,
							_indexableFolderUnderBuilt,
							_indexableFileExtensionRegExp,
							_sortOrder
						) {
							_this.registerFileBuilders ({
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
									Uize.Build.Util.forEachNumberedProperty (
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
							_this.registerFileBuilders ({
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
								Uize.Build.Util.jsModuleExtensionRegExp
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

						_this.registerFileBuilders ({
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
						_this.registerFileBuilders ({
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

					_this.registerFileBuilders (UizeSite.Build.FileBuilders.JavaScriptExamplesByModule);

					/*** handlers for news index pages ***/
						_registerInMemoryHtmlFilesIndexHandler ('news','news',/\.simple$/,-1);

						/*** handler for news-by-year index pages ***/
							_this.registerFileBuilders ({
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
							_this.registerFileBuilders ({
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
							_this.registerFileBuilders ({
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

					_this.registerFileBuilders (UizeSite.Build.FileBuilders.DirectoryPage);

					/*** handler for in-memory compiled JST templates ***/
						_this.registerFileBuilders ({
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
						_this.registerFileBuilders ({
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
						_this.registerFileBuilders ({
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
						_this.registerFileBuilders ({
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
						_this.registerFileBuilders ({
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
						_this.registerFileBuilders ({
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
						_this.registerFileBuilders ({
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
						_this.registerFileBuilders ({
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
						_this.registerFileBuilders ({
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
									_addReferencePages ('js',Uize.Build.Util.jsModuleExtensionRegExp,'reference');

								return _urlDictionary;
							}
						});

					/*** handler for SimpleDoc explainers, appendixes, news, etc. ***/
						_this.registerFileBuilders ({
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
										pathToRoot:
											Uize.Build.Util.getPathToRoot (
												_simpleDocPath.slice (this.params.sourcePath.length + 1)
											),
										result:'full'
									})
								;
								return this.processSimpleDoc (
									_simpleDoc.metaData.title ||
									UizeSite.Build.Util.getTitleFromFilename (Uize.Url.from (_simpleDocPath).file)
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
						_this.registerFileBuilders ({
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
								Uize.Build.Util.forEachNumberedProperty (
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

					_this.registerFileBuilders (
						Uize.Build.FileBuilders.BuiltModules,
						UizeSite.Build.FileBuilders.ModuleReferencePages,
						UizeSite.Build.FileBuilders.ModuleSourceCodePages,
						UizeSite.Build.FileBuilders.ExampleSourceCodePages,
						Uize.Build.FileBuilders.SimpleDataPages,
						Uize.Build.FileBuilders.CompiledJstModules,
						Uize.Build.FileBuilders.InMemoryModuleMetadata,
						Uize.Build.FileBuilders.InMemoryModuleBuiltSize,
						UizeSite.Build.FileBuilders.SotuPage
					);

					_callback ();
				}
			}
		});
	}
});

