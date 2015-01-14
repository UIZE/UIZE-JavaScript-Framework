/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.FileBuilders.InMemoryNewsByYearLookup Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2015 UIZE
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
		The =UizeSite.Build.FileBuilders.InMemoryNewsByYearLookup= module defines a file builder for the in-memory news-by-year lookup for the news pages of the UIZE Web site.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'UizeSite.Build.FileBuilders.InMemoryNewsByYearLookup',
	builder:function () {
		return Uize.package ({
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
	}
});

