/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.FileBuilders.InMemoryParsedSimpleDataFiles Package
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
		The =Uize.Build.FileBuilders.InMemoryParsedSimpleDataFiles= module defines a file builder for building in-memory parsed SimpleData objects from their corresponding source files.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'Uize.Build.FileBuilders.InMemoryParsedSimpleDataFiles',
	required:'Uize.Data.Simple',
	builder:function () {
		return {
			description:'In-memory parsed SimpleData files',
			urlMatcher:function (_urlParts) {
				return this.isMemoryUrl (_urlParts.pathname) && _urlParts.fileType == 'simpledata';
			},
			builderInputs:function (_urlParts) {
				return {source:this.sourceUrlFromMemoryUrl (_urlParts.pathname)};
			},
			builder:function (_inputs) {
				return Uize.Data.Simple.parse ({
					simple:this.readFile ({path:_inputs.source}),
					collapseChildren:true
				});
			}
		};
	}
});

