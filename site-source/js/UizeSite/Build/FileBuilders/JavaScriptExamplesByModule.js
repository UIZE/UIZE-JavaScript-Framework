/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.FileBuilders.JavaScriptExamplesByModule Package
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
		The =UizeSite.Build.FileBuilders.JavaScriptExamplesByModule= module defines a file builder for the JavaScript-examples-by-module index page of the UIZE Web site.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'UizeSite.Build.FileBuilders.JavaScriptExamplesByModule',
	builder:function () {
		var _examplesByModuleFile = 'javascript-examples-by-module.html';

		return {
			description:'JavaScript examples by module index page',
			urlMatcher:function (_urlParts) {
				return _urlParts.pathname == this.builtUrl (_examplesByModuleFile);
			},
			builderInputs:function () {
				return {
					template:this.memoryUrl (_examplesByModuleFile + '.jst'),
					examplesIndex:this.memoryUrl ('examples.index')
				};
			},
			builder:function (_inputs) {
				return this.readFile ({path:_inputs.template}) ({
					examples:this.readFile ({path:_inputs.examplesIndex})}
				);
			}
		};
	}
});

