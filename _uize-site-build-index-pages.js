/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Index Pages Build Script
|   /    / /    |    AUTHOR : Chris van Rensburg (http://www.tomkidding.com)
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2012 Chris van Rensburg
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*
	DESCRIPTION
		A script for WSH that builds index pages for examples, tool, and JavaScript modules.
*/

/*** boilerplate setup code for WSH build scripts ***/
	var _setupFile = new ActiveXObject ('Scripting.FileSystemObject').OpenTextFile ('_build-script-setup.js',1);
	eval (_setupFile.ReadAll ()) ();
	_setupFile.Close ();

Uize.module ({
	required:[
		'Uize.Wsh',
		'Uize.Wsh.BuildUtils',
		'Uize.Template',
		'Uize.String',
		'Uize.String.Lines',
		'Uize.Json',
		'Uize.Data',
		'Uize.Array.Sort',
		'Uize.Data.PathsTree',
		'UizeDotCom.BuildUtils'
	],
	builder:function () {
		/*** Utility Functions ***/
			function _buildIndexPage (_indexPageTemplatePath,_filesToIndex) {
				Uize.Wsh.BuildUtils.processJstFile (_indexPageTemplatePath,{files:_filesToIndex});
			}

		var
			_getFirstTitleSegment = UizeDotCom.BuildUtils.getFirstTitleSegment,
			_moduleReferenceFiles = Uize.Wsh.BuildUtils.getHtmlFilesInfo ('reference',_getFirstTitleSegment)
		;

		/*** build index files for modules, explainers, and widgets ***/
			_buildIndexPage (
				'javascript-explainers.html.jst',
				Uize.Wsh.BuildUtils.getHtmlFilesInfo ('explainers',_getFirstTitleSegment)
			);
			_buildIndexPage ('javascript-modules-index.html.jst',_moduleReferenceFiles);
			_buildIndexPage (
				'javascript-widgets.html.jst',
				Uize.Wsh.BuildUtils.getHtmlFilesInfo ('widgets',_getFirstTitleSegment)
			);

		/*** build the UizeDotCom.ModulesTree module ***/
			/*** build modules tree structure from list of module names ***/
				var _modulesTree = Uize.Data.PathsTree.fromList (Uize.map (_moduleReferenceFiles,'value.title'),'.');

			/*** write the modules tree module file ***/
				Uize.Wsh.BuildUtils.writeDataModule (env.moduleFolderPath,'UizeDotCom.ModulesTree',_modulesTree);

		/*** build the examples module and index pages ***/
			var _examples = Uize.Wsh.BuildUtils.getHtmlFilesInfo ('examples',_getFirstTitleSegment);

			/*** build the UizeDotCom.Examples module ***/
				Uize.Wsh.BuildUtils.writeDataModule (env.moduleFolderPath,'UizeDotCom.Examples',_examples);

			/*** build the examples by module page ***/
				Uize.Wsh.BuildUtils.processJstFile ('javascript-examples-by-module.html.jst');

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
				var _indexPageTemplate = Uize.Wsh.BuildUtils.compileJstFile ('javascript-examples.html.jst');
				for (var _keyword in _examplesByKeyword)
					Uize.Wsh.writeFile ({
						path:'javascript-' + _keyword + (_keyword && '-') + 'examples.html',
						text:_indexPageTemplate ({files:_examplesByKeyword [_keyword],keyword:_keyword})
					})
				;

			/*** build the UizeDotCom.ExamplesInfoForSiteMap module ***/
				Uize.Wsh.BuildUtils.writeDataModule (
					env.moduleFolderPath,'UizeDotCom.ExamplesInfoForSiteMap',
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
					Uize.Wsh.BuildUtils.getHtmlFilesInfo ('news',_getFirstTitleSegment),
					'value.title',
					-1
				),
				_newsIndexPageTemplate = Uize.Wsh.BuildUtils.compileJstFile ('news.html.jst')
			;

			/*** build the latest news files ***/
				var _latestNews = _newsItems.slice (0,50);

				/*** build the latest news HTML page ***/
					Uize.Wsh.writeFile ({
						path:'latest-news.html',
						text:_newsIndexPageTemplate ({files:_latestNews})
					});

				/*** build the latest news RSS file ***/
					Uize.Wsh.BuildUtils.processJstFile (
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
				Uize.Wsh.BuildUtils.processJstFile ('index.html.jst',{latestNews:_latestNews});

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
			Uize.Wsh.BuildUtils.processJstFile ('directory.html.jst');
	}
});

