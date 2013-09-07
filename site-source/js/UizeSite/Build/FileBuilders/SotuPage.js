/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.FileBuilders.SotuPage Package
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
		The =UizeSite.Build.FileBuilders.SotuPage= module defines a file builder for the SOTU (State of the UIZE) page of the UIZE Web site.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'UizeSite.Build.FileBuilders.SotuPage',
	required:[
		'Uize.String',
		'Uize.Build.Util'
	],
	builder:function () {
		function _isModuleForSotu (_moduleName) {
			return (
				(_moduleName == 'Uize' || Uize.String.startsWith (_moduleName,'Uize.')) &&
				!Uize.String.startsWith (_moduleName,'Uize.Test.')
			);
		}

		return Uize.package ({
			description:'SOTU (State of the UIZE) page',
			urlMatcher:function (_urlParts) {
				return _urlParts.pathname == this.builtUrl ('appendixes/sotu.html');
			},
			builderInputs:function (_urlParts) {
				var
					m = this,
					_params = m.params,
					_inputs = {
						jstSource:m.memoryUrlFromBuiltUrl (_urlParts.pathname) + '.jst',
						referencesIndex:m.memoryUrl ('reference.index'),
						examplesByKeyword:m.memoryUrl ('examples-by-keyword')
					}
				;
				Uize.forEach (
					Uize.Build.Util.getJsModules (_params),
					function (_moduleName) {
						if (_isModuleForSotu (_moduleName)) {
							var _moduleUrl = m.getModuleUrl (_moduleName);
							_inputs ['moduleBuiltSize_' + _moduleName] = m.memoryUrl (_moduleUrl + '.builtsize');
							_inputs ['moduleMetaData_' + _moduleName] = m.memoryUrl (_moduleUrl + '.metadata');
						}
					}
				);
				return _inputs;
			},
			builder:function (_inputs) {
				var
					m = this,
					_moduleReferenceFiles = m.readFile ({path:_inputs.referencesIndex}),
					_examplesByKeyword = m.readFile ({path:_inputs.examplesByKeyword}),
					_modules = []
				;
				for (
					var _moduleReferenceFileNo = -1, _moduleReferenceFilesLength = _moduleReferenceFiles.length;
					++_moduleReferenceFileNo < _moduleReferenceFilesLength;
				) {
					var
						_moduleReferenceFile = _moduleReferenceFiles [_moduleReferenceFileNo],
						_moduleName = _moduleReferenceFile.title
					;
					if (_isModuleForSotu (_moduleName)) {
						var
							_metaData = m.readFile ({path:_inputs ['moduleMetaData_' + _moduleName]}),
							_directSubmodules = 0,
							_nestedSubmodules = 0
						;
						for (
							var
								_submoduleNo = _moduleReferenceFileNo,
								_moduleNamePlusDot = _moduleName + '.',
								_moduleNamePlusDotLength = _moduleNamePlusDot.length
							;
							++_submoduleNo < _moduleReferenceFilesLength;
						) {
							var _submoduleName = _moduleReferenceFiles [_submoduleNo].title;
							if (Uize.String.startsWith (_submoduleName,_moduleNamePlusDot)) {
								_nestedSubmodules++;
								_submoduleName.indexOf ('.',_moduleNamePlusDotLength) == -1 && _directSubmodules++;
							}
						}

						_modules.push ({
							name:_moduleName,
							description:_moduleReferenceFile.description,
							examples:(_examplesByKeyword [_moduleName] || []).length,
							directSubmodules:_directSubmodules,
							nestedSubmodules:_nestedSubmodules,
							type:_metaData.type || 'Unknown',
							importance:+_metaData.importance || 0,
							codeCompleteness:+_metaData.codeCompleteness || 0,
							docCompleteness:+_metaData.docCompleteness || 0,
							testCompleteness:+_metaData.testCompleteness || 0,
							keywords:_metaData.keywords || '',
							scrunchedFileSize:m.readFile ({path:_inputs ['moduleBuiltSize_' + _moduleName]})
						});
					}
				}
				return m.readFile ({path:_inputs.jstSource}) ({modules:_modules});
			}
		});
	}
});

