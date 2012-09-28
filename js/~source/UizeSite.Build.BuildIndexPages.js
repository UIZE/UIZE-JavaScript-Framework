/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.BuildIndexPages Namespace
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Namespace
	importance: 1
	codeCompleteness: 100
	testCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =UizeSite.Build.BuildIndexPages= package provides a method for building index pages for examples, tools, and JavaScript modules for the UIZE Web site.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeSite.Build.BuildIndexPages',
	required:[
		'Uize.Wsh',
		'Uize.Build.Util',
		'Uize.Template',
		'Uize.String',
		'Uize.String.Lines',
		'Uize.Json',
		'Uize.Data',
		'Uize.Array.Sort',
		'Uize.Data.PathsTree',
		'UizeSite.Build.Util'
	],
	builder:function () {
		/*** Variables for Scruncher Optimization ***/
			var
				_package = function () {},
				_getFirstTitleSegment = UizeSite.Build.Util.getFirstTitleSegment
			;

		/*** Utility Functions ***/
			function _buildIndexPage (_indexPageTemplatePath,_filesToIndex) {
				Uize.Build.Util.processJstFile (_indexPageTemplatePath,{files:_filesToIndex});
			}

		/*** Public Static Methods ***/
			_package.perform = function (_params) {
				var _moduleReferenceFiles = Uize.Build.Util.getHtmlFilesInfo ('reference',_getFirstTitleSegment);

				/*** build index files for modules, explainers, and widgets ***/
					_buildIndexPage (
						'javascript-explainers.html.jst',
						Uize.Build.Util.getHtmlFilesInfo ('explainers',_getFirstTitleSegment)
					);
					_buildIndexPage ('javascript-modules-index.html.jst',_moduleReferenceFiles);
					_buildIndexPage (
						'javascript-widgets.html.jst',
						Uize.Build.Util.getHtmlFilesInfo ('widgets',_getFirstTitleSegment)
					);

				/*** build the UizeSite.ModulesTree module ***/
					/*** build modules tree structure from list of module names ***/
						var _modulesTree = Uize.Data.PathsTree.fromList (Uize.map (_moduleReferenceFiles,'value.title'),'.');

					/*** write the modules tree module file ***/
						Uize.Build.Util.writeDataModule (_params.moduleFolderPath,'UizeSite.ModulesTree',_modulesTree);

				/*** build the examples module and index pages ***/
					var _examples = Uize.Build.Util.getHtmlFilesInfo ('examples',_getFirstTitleSegment);

					/*** build the UizeSite.Examples module ***/
						Uize.Build.Util.writeDataModule (_params.moduleFolderPath,'UizeSite.Examples',_examples);

					/*** build the examples by module page ***/
						Uize.Build.Util.processJstFile ('javascript-examples-by-module.html.jst');

					/*** build map of examples by keyword ***/
						var _examplesByKeyword = {'':_examples};
						for (
							var _exampleNo = -1, _examplesLength = _examples.length, _example;
							++_exampleNo < _examplesLength;
						) {
							var _keywordsStr = (_example = _examples [_exampleNo]).keywords;
							if (_keywordsStr) {
								var _keywords = _keywordsStr.split (' ');
								for (var _keywordNo = -1, _keywordsLength = _keywords.length; ++_keywordNo < _keywordsLength;) {
									var _keyword = _keywords [_keywordNo];
									Uize.String.startsWith (_keyword,'Uize') ||
										(_examplesByKeyword [_keyword] || (_examplesByKeyword [_keyword] = [])).push (_example)
									;
								}
							}
						}

					/*** build examples index pages for each keyword ***/
						var _indexPageTemplate = Uize.Build.Util.compileJstFile ('javascript-examples.html.jst');
						for (var _keyword in _examplesByKeyword)
							Uize.Wsh.writeFile ({
								path:'javascript-' + _keyword + (_keyword && '-') + 'examples.html',
								text:_indexPageTemplate ({files:_examplesByKeyword [_keyword],keyword:_keyword})
							})
						;

					/*** build the UizeSite.ExamplesInfoForSiteMap module ***/
						Uize.Build.Util.writeDataModule (
							_params.moduleFolderPath,'UizeSite.ExamplesInfoForSiteMap',
							{
								keywords:Uize.keys (_examplesByKeyword).slice (1).sort (), // slice removes the '' keyword
								tools:
									Uize.map (
										_examplesByKeyword.tool,
										function (_value) {return Uize.Data.filter (_value,['title','path'])}
									)
							}
						);

				/*** build the news index pages ***/
					var
						_newsItems = Uize.Array.Sort.sortBy (
							Uize.Build.Util.getHtmlFilesInfo ('news',_getFirstTitleSegment),
							'value.title',
							-1
						),
						_newsIndexPageTemplate = Uize.Build.Util.compileJstFile ('news.html.jst')
					;

					/*** build the latest news files ***/
						var _latestNews = _newsItems.slice (0,50);

						/*** build the latest news HTML page ***/
							Uize.Wsh.writeFile ({
								path:'latest-news.html',
								text:_newsIndexPageTemplate ({files:_latestNews})
							});

						/*** build the latest news RSS file ***/
							Uize.Build.Util.processJstFile (
								'latest-news.rss.jst',
								{
									items:Uize.map (
										_latestNews,
										function (_value) {
											return {
												title:_value.title.replace (/^\d\d\d\d-\d\d-\d\d\s*-\s*/,''),
												date:_value.title.slice (0,10),
												link:'http://www.uize.com/' + _value.path,
												description:_value.description
											}
										}
									)
								}
							);

					/*** build the home page, to update the news pod ***/
						Uize.Build.Util.processJstFile ('index.html.jst',{latestNews:_latestNews});

					/*** build map of news items by year ***/
						var _newsItemsByYear = {};
						for (
							var _newsItemNo = -1, _newsItemsLength = _newsItems.length, _newsItem, _year;
							++_newsItemNo < _newsItemsLength;
						) {
							var _year = (_newsItem = _newsItems [_newsItemNo]).title.slice (0,4);
							(_newsItemsByYear [_year] || (_newsItemsByYear [_year] = [])).push (_newsItem);
						}

					/*** build news index pages for each year ***/
						for (var _year in _newsItemsByYear)
							Uize.Wsh.writeFile ({
								path:'news-' + _year + '.html',
								text:_newsIndexPageTemplate ({files:_newsItemsByYear [_year],year:_year})
							})
						;

				/*** build the directory page ***/
					Uize.Build.Util.processJstFile ('directory.html.jst');
			};

		return _package;
	}
});

