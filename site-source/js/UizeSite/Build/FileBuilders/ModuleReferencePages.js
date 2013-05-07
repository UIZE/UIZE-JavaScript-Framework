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
		'Uize.Url',
		'Uize.Doc.Sucker',
		'UizeSite.Build.Util'
	],
	builder:function () {
		var _visualTestsModuleNameFromWidgetClass = UizeSite.Build.Util.visualTestsModuleNameFromWidgetClass;

		function _hasDeepReference (object,_deepReference) {
			try {
				eval ('object.' + _deepReference);
				return true;
			} catch (_error) {
				return false;
			}
		}
		return {
			description:'Module reference page',
			urlMatcher:function (_urlParts) {
				var _this = this;
				if (
					_urlParts.fileType == 'html' &&
					_urlParts.folderPath == _this.builtUrl ('reference/')
				) {
					var _sourcePathSansExtension = _this.sourceUrl (_this.getModuleUrl (_urlParts.fileName,false));
					return (
						_this.fileExists ({path:_sourcePathSansExtension + '.js'}) ||
						_this.fileExists ({path:_sourcePathSansExtension + '.js.jst'}) ||
						_this.fileExists ({path:_sourcePathSansExtension + '.csst'}) ||
						_this.folderExists ({path:_sourcePathSansExtension})
					);
				} else {
					return false;
				}
			},
			builderInputs:function (_urlParts) {
				var _this = this;
				return {
					tempCode:_this.tempUrl (_this.getModuleUrl (_urlParts.fileName)),
					simpleDocTemplate:_this.memoryUrl ('reference/~SIMPLE-DOC-TEMPLATE.html.jst'),
					modulesTree:_this.memoryUrl ('modules-tree'),
					urlDictionary:_this.memoryUrl ('url-dictionary'),
					examplesByKeyword:_this.memoryUrl ('examples-by-keyword')
				};
			},
			builder:function (_inputs) {
				var
					_this = this,
					_simpleDoc,
					_tempCodePath = _inputs.tempCode,
					_moduleName = _this.moduleNameFromTempPath (_tempCodePath),
					_modulesTree = _this.readFile ({path:_inputs.modulesTree})
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
							_this.readFile ({path:_tempCodePath}),
							{
								urlDictionary:_urlDictionary,
								pathToRoot:'../',
								result:'full',
								module:_module,
								modulesTree:_modulesTree,
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
					{
						hasToDo:_this.fileExists ({path:this.sourceUrl ('todo/modules/' + _moduleName + '.simple')}),
						hasVisualTests:_hasDeepReference (_modulesTree,_visualTestsModuleNameFromWidgetClass (_moduleName))
					}
				);
			}
		};
	}
});

