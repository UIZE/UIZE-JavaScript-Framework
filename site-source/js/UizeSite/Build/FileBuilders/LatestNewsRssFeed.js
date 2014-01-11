/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.FileBuilders.LatestNewsRssFeed Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2014 UIZE
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
		The =UizeSite.Build.FileBuilders.LatestNewsRssFeed= module defines a file builder for the latest news RSS feed page of the UIZE Web site.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'UizeSite.Build.FileBuilders.LatestNewsRssFeed',
	builder:function () {
		return Uize.package ({
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
	}
});

