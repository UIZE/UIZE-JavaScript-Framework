/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.FileBuilders.ExamplesByKeywordIndexPages Package
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
		The =UizeSite.Build.FileBuilders.ExamplesByKeywordIndexPages= module defines a file builder for the examples-by-keyword index pages of the UIZE Web site.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'UizeSite.Build.FileBuilders.ExamplesByKeywordIndexPages',
	builder:function () {
		var _examplesKeywordRegExp = /^javascript-((.+?)-)?examples$/;

		return {
			description:'Examples-by-keyword index page',
			urlMatcher:function (_urlParts) {
				return (
					_urlParts.fileType == 'html' &&
					this.isBuiltUrl (_urlParts.pathname) &&
					_examplesKeywordRegExp.test (_urlParts.fileName)
				);
			},
			builderInputs:function (_urlParts) {
				return {
					template:this.memoryUrl ('javascript-examples.html.jst'),
					examplesByKeyword:this.memoryUrl ('examples-by-keyword')
				};
			},
			builder:function (_inputs,_urlParts) {
				var _keyword = _urlParts.fileName.match (_examplesKeywordRegExp) [2] || '';
				return this.readFile ({path:_inputs.template}) ({
					keyword:_keyword,
					files:this.readFile ({path:_inputs.examplesByKeyword}) [_keyword] || []
				});
			}
		};
	}
});

