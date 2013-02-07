/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.FileBuilders.ModuleSourceCodePages Package
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
		The =UizeSite.Build.FileBuilders.ModuleSourceCodePages= module defines a file builder for the module source code pages of the UIZE Web site.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'UizeSite.Build.FileBuilders.ModuleSourceCodePages',
	required:[
		'Uize.Url',
		'UizeSite.Build.Util'
	],
	builder:function () {
		var _modulesSourceCodePagesPath = '/reference/source-code/';

		return {
			description:'Module source code pages',
			urlMatcher:function (_urlParts) {
				return (
					_urlParts.fileType == 'html' &&
					_urlParts.folderPath == this.builtUrl (_modulesSourceCodePagesPath)
				);
			},
			builderInputs:function (_urlParts) {
				return {
					sourceCode:this.tempUrl ('js/' + _urlParts.fileName + '.js'),
					sourceCodeTemplate:this.memoryUrl (_modulesSourceCodePagesPath + '~SOURCE-CODE-TEMPLATE.html.jst')
				};
			},
			builder:function (_inputs) {
				var
					_sourceCode = _inputs.sourceCode,
					_sourceFileName = Uize.Url.from (_sourceCode).file
				;
				return this.readFile ({path:_inputs.sourceCodeTemplate}) ({
					sourceFilename:_sourceFileName,
					title:UizeSite.Build.Util.getTitleFromFilename (_sourceFileName),
					body:this.readFile ({path:_sourceCode})
				});
			}
		};
	}
});

