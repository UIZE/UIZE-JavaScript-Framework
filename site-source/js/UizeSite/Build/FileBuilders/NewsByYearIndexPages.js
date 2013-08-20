/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.FileBuilders.NewsByYearIndexPages Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 5
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =UizeSite.Build.FileBuilders.NewsByYearIndexPages= module defines a file builder for the news-by-year index pages of the UIZE Web site.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'UizeSite.Build.FileBuilders.NewsByYearIndexPages',
	builder:function () {
		var _newsByYearRegExp = /^(news-(\d{4})|latest-news)$/;

		return Uize.package ({
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
	}
});

