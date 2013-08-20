/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.FileBuilders.DirectoryPage Package
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
		The =UizeSite.Build.FileBuilders.DirectoryPage= module defines a file builder for the directory page of the UIZE Web site.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'UizeSite.Build.FileBuilders.DirectoryPage',
	required:'UizeSite.SiteMap',
	builder:function () {
		return Uize.package ({
			description:'Directory page',
			urlMatcher:function (_urlParts) {
				return _urlParts.pathname == this.builtUrl ('directory.html');
			},
			builderInputs:function (_urlParts) {
				return {
					modulesTree:this.memoryUrl ('modules-tree'),
					examplesInfoForSiteMap:this.memoryUrl ('examples-info-for-sitemap'),
					template:this.memoryUrlFromBuiltUrl (_urlParts.pathname) + '.jst'
				};
			},
			builder:function (_inputs) {
				return this.readFile ({path:_inputs.template}) ({
					siteMap:UizeSite.SiteMap ({
						modulesTree:this.readFile ({path:_inputs.modulesTree}),
						examplesInfo:this.readFile ({path:_inputs.examplesInfoForSiteMap})
					})
				});
			}
		});
	}
});

