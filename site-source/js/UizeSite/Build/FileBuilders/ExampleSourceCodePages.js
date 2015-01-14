/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.FileBuilders.ExampleSourceCodePages Package
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
		The =UizeSite.Build.FileBuilders.ExampleSourceCodePages= module defines a file builder for the example source code pages of the UIZE Web site.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'UizeSite.Build.FileBuilders.ExampleSourceCodePages',
	required:'Uize.Url',
	builder:function () {
		var _examplesSourceCodePagesPath = '/examples/source-code/';

		return Uize.package ({
			description:'Example source code pages',
			urlMatcher:function (_urlParts) {
				return (
					_urlParts.folderPath == this.builtUrl (_examplesSourceCodePagesPath) &&
					this.fileExists ({path:this.sourceUrl ('examples/' + _urlParts.file)})
				);
			},
			builderInputs:function (_urlParts) {
				return {
					sourceCode:this.sourceUrl ('examples/' + _urlParts.file),
					sourceCodeTemplate:this.memoryUrl (_examplesSourceCodePagesPath + '~SOURCE-CODE-TEMPLATE.html.jst')
				};
			},
			builder:function (_inputs) {
				var
					_sourceCode = _inputs.sourceCode,
					_sourceFileName = Uize.Url.from (_sourceCode).file,
					_sourceFileText = this.readFile ({path:_sourceCode})
				;
				return this.readFile ({path:_inputs.sourceCodeTemplate}) ({
					sourceFilename:_sourceFileName,
					title:_sourceFileText.match (
						/<title>(.+?)\s*\|\s*JavaScript\s+(?:Tools|Examples)\s*(\|.*?)?<\/title>/
					) [1],
					body:_sourceFileText
				});
			}
		});
	}
});

