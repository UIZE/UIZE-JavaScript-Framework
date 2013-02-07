/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.FileBuilders.ModuleReferencePages Package
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
		The =UizeSite.Build.FileBuilders.ModuleReferencePages= module defines a file builder for the module reference pages of the UIZE Web site.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'UizeSite.Build.FileBuilders.ModuleReferencePages',
	required:[
		'Uize.Build.Util',
		'Uize.Url',
		'Uize.Doc.Sucker'
	],
	builder:function () {
		var _jsModuleExtensionRegExp = Uize.Build.Util.jsModuleExtensionRegExp;
		return {
			description:'Module reference page',
			urlMatcher:function (_urlParts) {
				var _sourcePathSansExtension = this.sourceUrl ('js/' + _urlParts.fileName);
				return (
					_urlParts.folderPath == this.builtUrl ('reference/') &&
					(
						this.fileExists ({path:_sourcePathSansExtension + '.js'}) ||
						this.fileExists ({path:_sourcePathSansExtension + '.js.jst'})
					)
				);
			},
			builderInputs:function (_urlParts) {
				var _sourcePathSansExtension = this.sourceUrl ('js/' + _urlParts.fileName);
				return {
					sourceCode:
						_sourcePathSansExtension +
						(this.fileExists ({path:_sourcePathSansExtension + '.js'}) ? '.js' : '.js.jst'),
					simpleDocTemplate:this.memoryUrl ('reference/~SIMPLE-DOC-TEMPLATE.html.jst'),
					modulesTree:this.memoryUrl ('modules-tree'),
					urlDictionary:this.memoryUrl ('url-dictionary'),
					examplesByKeyword:this.memoryUrl ('examples-by-keyword')
				};
			},
			builder:function (_inputs) {
				var
					_this = this,
					_simpleDoc,
					_sourceCodePath = _inputs.sourceCode,
					_moduleName = Uize.Url.from (_sourceCodePath).file.replace (_jsModuleExtensionRegExp,'')
				;
				Uize.require (
					_moduleName,
					function (_module) {
						var
							_urlDictionary = _this.readFile ({path:_inputs.urlDictionary}),
							_moduleUrlFromDictionary = _urlDictionary [_moduleName]
						;
						_urlDictionary [_moduleName] = null;
						_simpleDoc = Uize.Doc.Sucker.toDocument (
							_this.readFile ({path:_sourceCodePath}),
							{
								urlDictionary:_urlDictionary,
								pathToRoot:'../',
								result:'full',
								module:_module,
								modulesTree:_this.readFile ({path:_inputs.modulesTree}),
								examples:_this.readFile ({path:_inputs.examplesByKeyword}) [_moduleName]
							}
						);
						_urlDictionary [_moduleName] = _moduleUrlFromDictionary;
					}
				);
				return _this.processSimpleDoc (
					_moduleName,
					_simpleDoc,
					_inputs.simpleDocTemplate,
					{hasToDo:_this.fileExists ({path:this.sourceUrl ('todo/modules/' + _moduleName + '.simple')})}
				);
			}
		};
	}
});

