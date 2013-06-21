/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.FileBuilders.Homepage Package
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
		The =UizeSite.Build.FileBuilders.Homepage= module defines a file builder for the homepage of the UIZE Web site.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'UizeSite.Build.FileBuilders.Homepage',
	required:'Uize.Doc.Simple',
	builder:function () {
		return {
			description:'Homepage',
			urlMatcher:function (_urlParts) {
				return _urlParts.pathname == this.builtUrl ('index.html');
			},
			builderInputs:function (_urlParts) {
				return {
					template:this.memoryUrlFromBuiltUrl (_urlParts.pathname) + '.jst',
					overviewOfFeaturesSimpleDoc:this.sourceUrl ('index-overview-of-features.simple'),
					urlDictionary:this.memoryUrl ('url-dictionary')
				};
			},
			builder:function (_inputs) {
				return this.readFile ({path:_inputs.template}) ({
					overviewOfFeatures:Uize.Doc.Simple.build ({
						data:this.readFile ({path:_inputs.overviewOfFeaturesSimpleDoc}),
						urlDictionary:this.readFile ({path:_inputs.urlDictionary}),
						contentsList:false,
						pathToRoot:''
					})
				});
			}
		};
	}
});

