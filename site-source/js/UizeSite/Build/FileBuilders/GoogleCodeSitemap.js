/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.FileBuilders.GoogleCodeSitemap Package
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
		The =UizeSite.Build.FileBuilders.GoogleCodeSitemap= module defines a file builder for the sitemap XML file that is used by the Google Code feature.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'UizeSite.Build.FileBuilders.GoogleCodeSitemap',
	required:'Uize.Build.Util',
	builder:function () {
		'use strict';

		return Uize.package ({
			description:'Google Code sitemap',
			urlMatcher:function (_urlParts) {
				return _urlParts.pathname == this.builtUrl ('sitemap-code.xml');
			},
			builderInputs:function (_urlParts) {
				return {template:this.memoryUrlFromBuiltUrl (_urlParts.pathname) + '.jst'};
			},
			builder:function (_inputs) {
				return this.readFile ({path:_inputs.template}) ({modules:Uize.Build.Util.getJsModules (this.params)});
			}
		});
	}
});

