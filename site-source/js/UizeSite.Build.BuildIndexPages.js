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
		The =UizeSite.Build.BuildIndexPages= package provides a method for building the index pages for the examples, tools, and JavaScript modules for the UIZE Web site.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeSite.Build.BuildIndexPages',
	required:[
		'UizeSite.Build.File',
		'Uize.Services.FileSystem',


		'Uize.Wsh',
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
			var _package = function () {};

		/*** General Variables ***/
			var _fileSystem = Uize.Services.FileSystem.singleton ();

		/*** Public Static Methods ***/
			_package.perform = function (_params) {
				var _urlsToBuild = [];

				/*** add URLs for index pages for modules, examples by module, explainers, and widgets ***/
					_urlsToBuild.push (
						'javascript-explainers.html',
						'javascript-examples-by-module.html',
						'javascript-modules-index.html',
						'javascript-widgets.html'
					);

				/*** add URLs for the various news pages ***/
					_urlsToBuild.push (
						'latest-news.html',
						'latest-news.rss'
					);

					/*** add URLs for news by year index pages ***/
						var _newsYearsLookup = {};
						_fileSystem.getFiles ({
							path:_params.sourcePath + '/news',
							pathMatcher:function (_path) {
								var
									_yearMatch = _path.match (/^(\d{4})-\d{2}-\d{2}-.+\.simple$/),
									_year = _yearMatch && _yearMatch [1]
								;
								if (_year && !_newsYearsLookup [_year]) {
									_newsYearsLookup [_year] = true;
									_urlsToBuild.push ('news-' + _year + '.html');
								}
							}
						});


				/*** add URLs for other miscellaneous pages ***/
					_urlsToBuild.push (
						'index.html'//, // homepage
						//'directory.html'
					);

				/*** now build all the pages ***/
					UizeSite.Build.File.perform (Uize.copyInto ({url:_urlsToBuild},_params));

/* >>>>>>>>>>>>>>>>>>>>>>>>>>> */ return;

				/*** build the examples module and index pages ***/
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
			};

		return _package;
	}
});

