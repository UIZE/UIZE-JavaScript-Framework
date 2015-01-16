/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.FileBuilders.TempSotuModule Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 2
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =UizeSite.Build.FileBuilders.TempSotuModule= module defines a file builder for the generated =UizeSite.Sotu= module in the site temp folder.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'UizeSite.Build.FileBuilders.TempSotuModule',
	required:[
		'Uize.Str.Has',
		'Uize.Build.Util'
	],
	builder:function () {
		'use strict';

		var
			_sotuModuleName = 'UizeSite.Sotu',
			_hasPrefix = Uize.Str.Has.hasPrefix
		;

		function _isModuleForSotu (_moduleName) {
			return (
				(_moduleName == 'Uize' || _hasPrefix (_moduleName,'Uize.')) &&
				_moduleName != _sotuModuleName &&
				!_hasPrefix (_moduleName,'Uize.Test.')
			);
		}

		return Uize.package ({
			description:'Generated UizeSite.Sotu module under temp',
			urlMatcher:function (_urlParts) {
				return _urlParts.pathname == this.tempUrl (this.getModuleUrl (_sotuModuleName));
			},
			builderInputs:function (_urlParts) {
				var
					m = this,
					_params = m.params,
					_moduleBuiltSize = {},
					_moduleMetaData = {}
				;
				Uize.forEach (
					Uize.Build.Util.getJsModules (_params),
					function (_moduleName) {
						if (_isModuleForSotu (_moduleName)) {
							var _moduleUrl = m.getModuleUrl (_moduleName);
							_moduleBuiltSize [_moduleName] = m.memoryUrl (_moduleUrl + '.builtsize');
							_moduleMetaData [_moduleName] = m.memoryUrl (_moduleUrl + '.metadata');
						}
					}
				);
				return {
					referencesIndex:m.memoryUrl ('reference.index'),
					examplesByKeyword:m.memoryUrl ('examples-by-keyword'),
					moduleBuiltSize:_moduleBuiltSize,
					moduleMetaData:_moduleMetaData
				};
			},
			builder:function (_inputs) {
				var
					m = this,
					_moduleBuiltSize = _inputs.moduleBuiltSize,
					_moduleMetaData = _inputs.moduleMetaData,
					_moduleReferenceFiles = m.readFile ({path:_inputs.referencesIndex}),
					_examplesByKeyword = m.readFile ({path:_inputs.examplesByKeyword}),
					_modules = [
						[
							'name',
							'type',
							'importance',
							'codeCompleteness',
							'docCompleteness',
							'testCompleteness',
							'examples',
							'scrunchedFileSize',
							'directSubmodules',
							'nestedSubmodules',
							'description',
							'keywords'
						]
					]
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
							_metaData = m.readFile ({path:_moduleMetaData [_moduleName]}),
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
							if (_hasPrefix (_submoduleName,_moduleNamePlusDot)) {
								_nestedSubmodules++;
								_submoduleName.indexOf ('.',_moduleNamePlusDotLength) == -1 && _directSubmodules++;
							}
						}

						_modules.push ([
							_moduleName,
							_metaData.type,
							+_metaData.importance || 0,
							+_metaData.codeCompleteness || 0,
							+_metaData.docCompleteness || 0,
							+_metaData.testCompleteness || 0,
							(_examplesByKeyword [_moduleName] || []).length,
							m.readFile ({path:_moduleBuiltSize [_moduleName]}),
							_directSubmodules,
							_nestedSubmodules,
							_moduleReferenceFile.description,
							_metaData.keywords || ''
						]);
					}
				}
				return Uize.Build.Util.dataAsModule (_sotuModuleName,_modules);
			}
		});
	}
});

