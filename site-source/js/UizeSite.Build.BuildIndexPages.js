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
		'Uize.Services.FileSystem'
	],
	builder:function () {
		/*** Variables for Scruncher Optimization ***/
			var _package = function () {};

		/*** General Variables ***/
			var _fileSystem = Uize.Services.FileSystem.singleton ();

		/*** Public Static Methods ***/
			_package.perform = function (_params) {
				var _urlsToBuild = [];

				/*** add URLs for index pages for modules, examples, examples by module, explainers, and widgets ***/
					_urlsToBuild.push (
						'appendixes.html',
						'javascript-explainers.html',
						'javascript-examples.html',
						'javascript-examples-by-module.html',
						'javascript-modules-index.html',
						'javascript-reference.html',
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
						'index.html',
						'directory.html'
					);

				/*** build examples index pages for each keyword ***/
					var _examplesByKeywordPath = _params.memoryPath + '/examples-by-keyword';
					UizeSite.Build.File.perform (Uize.copyInto ({url:_examplesByKeywordPath},_params),'');
					_urlsToBuild.push.apply (
						_urlsToBuild,
						Uize.map (
							Uize.keys (UizeSite.Build.File.readFile ({path:_examplesByKeywordPath})),
							'"javascript-" + value + "-examples.html"'
						)
					);

				/*** now build all the pages ***/
					UizeSite.Build.File.perform (Uize.copyInto ({url:_urlsToBuild},_params));
			};

		return _package;
	}
});

