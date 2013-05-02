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

/* TODO:
	- nice-to-haves, per module
		- number of modules that require the module (ie. how shared is the module throughout framework, or is it more isolated)
		- total number of modules (directly and indirectly) required by the module
		- total scrunched size of all modules (directly and indirectly) required by the module
		- creation date of the module
		- developers for the module
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

		return {
			description:'SOTU (State of the UIZE) page',
			urlMatcher:function (_urlParts) {
				return _urlParts.pathname == this.builtUrl ('appendixes/sotu.html');
			},
			builderInputs:function (_urlParts) {
				var
					_this = this,
					_params = _this.params,
					_inputs = {
						jstSource:_this.memoryUrlFromBuiltUrl (_urlParts.pathname) + '.jst',
						referencesIndex:_this.memoryUrl ('reference.index'),
						examplesByKeyword:_this.memoryUrl ('examples-by-keyword')
					}
				;
				Uize.forEach (
					Uize.Build.Util.getJsModules (_params),
					function (_moduleName) {
						if (_isModuleForSotu (_moduleName)) {
							var _moduleUrl = _this.getModuleUrl (_moduleName);
							_inputs ['moduleBuiltSize_' + _moduleName] = _this.memoryUrl (_moduleUrl + '.builtsize');
							_inputs ['moduleMetaData_' + _moduleName] = _this.memoryUrl (_moduleUrl + '.metadata');
						}
					}
				);
				return _inputs;
			},
			builder:function (_inputs) {
				var
					_this = this,
					_moduleReferenceFiles = _this.readFile ({path:_inputs.referencesIndex}),
					_examplesByKeyword = _this.readFile ({path:_inputs.examplesByKeyword}),
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
							_metaData = _this.readFile ({path:_inputs ['moduleMetaData_' + _moduleName]}),
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
							scrunchedFileSize:_this.readFile ({path:_inputs ['moduleBuiltSize_' + _moduleName]})
						});
					}
				}
				return _this.readFile ({path:_inputs.jstSource}) ({modules:_modules});
			}
		};
	}
});

