/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.FileBuilders.SimpleDocPages Package
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
		The =Uize.Build.FileBuilders.SimpleDocPages= module defines a file builder for building HTML pages from the SimpleDoc (=.simple=) pages of a site.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'Uize.Build.FileBuilders.SimpleDocPages',
	required:[
		'Uize.Doc.Simple',
		'Uize.Build.Util',
		'Uize.Url'
	],
	builder:function () {
		return {
			description:'SimpleDoc pages',
			urlMatcher:function (_urlParts) {
				return (
					_urlParts.fileType == 'html' &&
					this.isBuiltUrl (_urlParts.folderPath) &&
					this.fileExists ({
						path:this.sourceUrlFromBuiltUrl (_urlParts.folderPath) + _urlParts.fileName + '.simple'
					})
				);
			},
			builderInputs:function (_urlParts) {
				var _folderPath = _urlParts.folderPath;
				return {
					simpleDoc:this.sourceUrlFromBuiltUrl (_folderPath) + _urlParts.fileName + '.simple',
					simpleDocTemplate:this.memoryUrlFromBuiltUrl (_folderPath) + '~SIMPLE-DOC-TEMPLATE.html.jst',
					urlDictionary:this.memoryUrl ('url-dictionary')
				};
			},
			builder:function (_inputs) {
				var
					_simpleDocPath = _inputs.simpleDoc,
					_simpleDoc = Uize.Doc.Simple.build ({
						data:this.readFile ({path:_simpleDocPath}),
						urlDictionary:this.readFile ({path:_inputs.urlDictionary}),
						pathToRoot:Uize.Build.Util.getPathToRoot (_simpleDocPath.slice (this.params.sourcePath.length + 1)),
						result:'full'
					})
				;
				return this.processSimpleDoc (
					_simpleDoc.metaData.title ||
					UizeSite.Build.Util.getTitleFromFilename (Uize.Url.from (_simpleDocPath).file)
						.replace (/(^|\s)[a-z]/g,function (_match) {return _match.toUpperCase ()}),
					_simpleDoc,
					_inputs.simpleDocTemplate
				);
			}
		};
	}
});

