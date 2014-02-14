/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.FileBuilders.ModuleReferencePages Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2014 UIZE
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
		'Uize.Build.Util',
		'UizeSite.Build.Util'
	],
	builder:function () {
		var
			_visualTestsModuleNameFromWidgetClass = UizeSite.Build.Util.visualTestsModuleNameFromWidgetClass,
			_jsModuleExtensions = Uize.Build.Util.jsModuleExtensions
		;

		function _hasDeepReference (object,_deepReference) {
			try {
				eval ('object.' + _deepReference);
				return true;
			} catch (_error) {
				return false;
			}
		}
		return Uize.package ({
			description:'Module reference page',
			urlMatcher:function (_urlParts) {
				var m = this;
				function _anyOfFilesExists (_files) {
					for (var _fileNo = -1, _filesLength = _files.length; ++_fileNo < _filesLength;)
						if (m.fileExists ({path:_files [_fileNo]})) return true
					;
					return false;
				}
				if (
					_urlParts.fileType == 'html' &&
					_urlParts.folderPath == m.builtUrl ('reference/')
				) {
					var _sourcePathSansExtension = m.sourceUrl (m.getModuleUrl (_urlParts.fileName,false));
					return (
						_anyOfFilesExists (
							Uize.map (
								_jsModuleExtensions,
								function (_extension) {return _sourcePathSansExtension + _extension}
							)
						) ||
						m.folderExists ({path:_sourcePathSansExtension})
					);
				} else {
					return false;
				}
			},
			builderInputs:function (_urlParts) {
				var m = this;
				return {
					tempCode:m.tempUrl (m.getModuleUrl (_urlParts.fileName)),
					simpleDocTemplate:m.memoryUrl ('reference/~SIMPLE-DOC-TEMPLATE.html.jst'),
					modulesTree:m.memoryUrl ('modules-tree'),
					urlDictionary:m.memoryUrl ('url-dictionary'),
					examplesByKeyword:m.memoryUrl ('examples-by-keyword')
				};
			},
			builder:function (_inputs) {
				var
					m = this,
					_simpleDoc,
					_tempCodePath = _inputs.tempCode,
					_moduleName = m.moduleNameFromTempPath (_tempCodePath),
					_modulesTree = m.readFile ({path:_inputs.modulesTree})
				;
				Uize.require (
					_moduleName,
					function (_module) {
						var
							_urlDictionary = m.readFile ({path:_inputs.urlDictionary}),
							_moduleUrlFromDictionary = _urlDictionary [_moduleName]
						;
						_urlDictionary [_moduleName] = null;
						_simpleDoc = Uize.Doc.Sucker.toDocument (
							m.readFile ({path:_tempCodePath}),
							{
								urlDictionary:_urlDictionary,
								pathToRoot:'../',
								result:'full',
								module:_module,
								modulesTree:_modulesTree,
								examples:m.readFile ({path:_inputs.examplesByKeyword}) [_moduleName]
							}
						);
						_urlDictionary [_moduleName] = _moduleUrlFromDictionary;
					}
				);
				return m.processSimpleDoc (
					_moduleName,
					_simpleDoc,
					_inputs.simpleDocTemplate,
					{
						hasToDo:m.fileExists ({path:this.sourceUrl (this.getModuleUrl (_moduleName,false) + '.todo')}),
						hasVisualTests:_hasDeepReference (_modulesTree,_visualTestsModuleNameFromWidgetClass (_moduleName))
					}
				);
			}
		});
	}
});

