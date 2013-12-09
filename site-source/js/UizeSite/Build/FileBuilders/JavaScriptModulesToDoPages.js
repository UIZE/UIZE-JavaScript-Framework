/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.FileBuilders.JavaScriptModulesToDoPages Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =UizeSite.Build.FileBuilders.JavaScriptModulesToDoPages= module defines a file builder for the TO DO pages of JavaScript modules.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'UizeSite.Build.FileBuilders.JavaScriptModulesToDoPages',
	required:[
		'Uize.Doc.Simple',
		'Uize.Build.Util',
		'Uize.Str.Has'
	],
	builder:function () {
		function _todoSourceFilePath (m,_urlParts) {
			return m.sourceUrl (m.getModuleUrl (_urlParts.fileName,false) + '.todo');
		}

		return Uize.package ({
			description:'SimpleDoc pages',
			urlMatcher:function (_urlParts) {
				return (
					_urlParts.fileType == 'html' &&
					Uize.Str.Has.hasPrefix (_urlParts.pathname,this.params.builtPath + '/todo/modules/') &&
					this.fileExists ({path:_todoSourceFilePath (this,_urlParts)})
				);
			},
			builderInputs:function (_urlParts) {
				return {
					simpleDoc:_todoSourceFilePath (this,_urlParts),
					simpleDocTemplate:this.memoryUrlFromBuiltUrl (_urlParts.folderPath) + '~SIMPLE-DOC-TEMPLATE.html.jst',
					urlDictionary:this.memoryUrl ('url-dictionary')
				};
			},
			builder:function (_inputs,_urlParts) {
				var
					_simpleDocPath = _inputs.simpleDoc,
					_simpleDocTemplate = _inputs.simpleDocTemplate,
					_simpleDoc = Uize.Doc.Simple.build ({
						data:this.readFile ({path:_simpleDocPath}),
						urlDictionary:this.readFile ({path:_inputs.urlDictionary}),
						pathToRoot:Uize.Build.Util.getPathToRoot (
							_simpleDocTemplate.slice (this.params.sourcePath.length + 1)
						),
						result:'full'
					})
				;
				return this.processSimpleDoc (
					_urlParts.fileName,
					_simpleDoc,
					_simpleDocTemplate
				);
			}
		});
	}
});

