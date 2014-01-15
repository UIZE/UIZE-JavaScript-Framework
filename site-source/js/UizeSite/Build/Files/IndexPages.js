/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.Files.IndexPages Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =UizeSite.Build.Files.IndexPages= package provides a method for building the index pages for the examples, tools, and JavaScript modules for the UIZE Web site.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeSite.Build.Files.IndexPages',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticMethods:{
				determineFilesToBuild:function (_params) {
					var m = this;

					/*** add URLs for other miscellaneous pages ***/
						m.addFiles (
							'index.html',
							'directory.html',
							'sitemap-code.xml'
						);

					/*** add URLs for index pages for modules, examples, examples by module, guides, and widgets ***/
						m.addFiles (
							'appendixes.html',
							'javascript-guides.html',
							'javascript-examples.html',
							'javascript-examples-by-module.html',
							'javascript-modules-index.html',
							'javascript-reference.html',
							'javascript-white-papers.html',
							'javascript-widgets.html',
							'todo/modules.html'
						);

					/*** add URLs for the various news pages ***/
						m.addFiles (
							'latest-news.html',
							'latest-news.rss'
						);

						/*** add URLs for news by year index pages ***/
							var _newsYearsLookup = {};
							m.fileSystem.getFiles ({
								path:_params.sourcePath + '/news',
								pathMatcher:function (_path) {
									var _yearMatch = _path.match (/^(\d{4})-\d{2}-\d{2}-.+\.simple$/);
									if (_yearMatch)
										_newsYearsLookup [_yearMatch [1]] = true
									;
								}
							});
							m.addFiles (Uize.map (Uize.keys (_newsYearsLookup),'\'news-\' + value + \'.html\''));

					/*** build examples index pages for each keyword ***/
						var _examplesByKeywordPath = _params.memoryPath + '/examples-by-keyword';
						m.fileBuilder.buildFile (Uize.copyInto ({url:_examplesByKeywordPath,pathPrefix:''},_params));
						m.addFiles (
							Uize.map (
								Uize.keys (m.fileBuilder.get ('adapter').readFile ({path:_examplesByKeywordPath})),
								/* TODO:
									Accessing the service adapter to use specific instance methods that are not part of the actual service interface is a poor design, because it makes an assumption about the service adapter that is chosen for the file builder service by the environment. A better way should be figured out to express this kind of relationship - this way is too weak and fragile.
								*/
								'"javascript-" + value + "-examples.html"'
							)
						);
				}
			}
		});
	}
});

