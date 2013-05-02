/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.FileBuilders.UnprocessedFiles Package
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
		The =Uize.Build.FileBuilders.UnprocessedFiles= module defines a file builder for unprocessed files, such as image files, literal HTML files, literal CSS files, etc.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'Uize.Build.FileBuilders.UnprocessedFiles',
	builder:function () {
		return {
			description:'Files that are unprocessed',
			urlMatcher:function (_urlParts) {
				return (
					this.isBuiltUrl (_urlParts.folderPath) &&
					Uize.resolveMatcher (this.params.staticFilePathMatcher) (_urlParts.pathname) &&
					this.fileExists ({path:this.sourceUrlFromBuiltUrl (_urlParts.pathname)})
				);
			},
			builderInputs:function (_urlParts) {
				return {sourcePath:this.sourceUrlFromBuiltUrl (_urlParts.pathname)};
			}
		};
	}
});

