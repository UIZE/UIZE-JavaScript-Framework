/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.BuildStateCombinationLibraries Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Build.BuildStateCombinationLibraries= module provides a method for building JavaScript library files for all combinations of the specified states.

		*DEVELOPERS:* `Chris van Rensburg`
*/

/*
	params:
		stateDefinitionsPath
			A path to a file that should contain a definition of all the states for which combination libraries should be built, expressed in the form of a JSON object.

			STATE DEFINITION SYNTAX
			...............................
			[
				{
					name: stateNameSTR,
					modules: moduleNamesARRAY
				},
				{
					name: stateNameSTR,
					modules: moduleNamesARRAY
				},
				...
				...
				...
				{
					name: stateNameSTR,
					modules: moduleNamesARRAY
				}
			]
			...............................

		packageTargetPathTemplate
			a template string for generating the target path for a state combination delta package

		excludeModules
			an optional array, specifying modules to be excluded from the generated packages
*/

Uize.module ({
	name:'Uize.Build.BuildStateCombinationLibraries',
	required:[
		'Uize.Services.FileBuilder',
		'Uize.Services.FileSystem',
		'Uize.Build.ModuleInfo',
		'Uize.Data',
		'Uize.Json'
	],
	builder:function () {
		'use strict';

		var _package = function () {};

		/*** Public Static Methods ***/
			_package.perform = function (_params) {
				var
					_builtPath = _params.builtPath,
					_packageTargetPathTemplate = _params.packageTargetPathTemplate,
					_trueFlag = {},
					_fileBuilder = Uize.Services.FileBuilder.singleton (),
					_fileSystem = Uize.Services.FileSystem.singleton (),
					_dependenciesByStateCombination = {},
					_excludeModules = _params.excludeModules ? _params.excludeModules.split (',') : [],
					_states = Uize.Json.from (_fileSystem.readFile ({path:_params.stateDefinitionsPath})),
					_stateNames = Uize.Data.getColumn (_states,'name'),
					_statesLookup = {},
					_builtModuleFileCache = {}
				;

				Uize.forEach (_states,function (_state) {_statesLookup [_state.name] = _state});

				function _readBuiltModuleFile (_moduleName) {
					var _builtModuleFile = _builtModuleFileCache [_moduleName];
					if (!_builtModuleFile) {
						var _modulePath = 'js/' + _moduleName + '.js';
						_fileBuilder.buildFile (
							Uize.copyInto (
								Uize.Data.filter (
									_params,
									['builtPath', 'sourcePath', 'memoryPath', 'tempPath', 'staleBefore', 'isDev']
								),
								{url:_modulePath}
							)
						);
						_builtModuleFile = _builtModuleFileCache [_moduleName] =
							_fileBuilder.readFile ({path:_builtPath + '/' + _modulePath})
						;
					}
					return _builtModuleFile;
				}

				function _getDependenciesForStateCombination (_stateCombination) {
					var
						_stateCombinationId = _stateCombination.sort ().join (','),
						_stateCombinationDependencies = _dependenciesByStateCombination [_stateCombinationId]
					;
					if (!_stateCombinationDependencies) {
						var _modules = [];
						Uize.forEach (
							_stateCombination,
							function (_stateName) {_modules.push.apply (_modules,_statesLookup [_stateName].modules)}
						);
						_stateCombinationDependencies = _dependenciesByStateCombination [_stateCombinationId] =
							Uize.Build.ModuleInfo.traceDependencies (_modules,_excludeModules)
						;
					}
					return _stateCombinationDependencies;
				}

				function _makeStateCombinationDeltaPackages (_stateCombination) {
					var _stateCombinationLookup = Uize.lookup (_stateCombination,_trueFlag);
					Uize.forEach (
						_stateNames,
						function (_stateName) {
							if (_stateCombinationLookup [_stateName] != _trueFlag) {
								_fileSystem.writeFile ({
									path:Uize.substituteInto (
										_packageTargetPathTemplate,
										{
											previousStates:_stateCombination.sort ().join ('-'),
											nextState:_stateName
										},
										'{KEY}'
									),
									contents:
										Uize.map (
											Uize.Build.ModuleInfo.traceDependencies (
												_statesLookup [_stateName].modules,
												_excludeModules.concat (_getDependenciesForStateCombination (_stateCombination))
											),
											_readBuiltModuleFile
										).join ('\n\n')
								});
								_makeStateCombinationDeltaPackages (_stateCombination.concat (_stateName));
							}
						}
					);
				}
				_makeStateCombinationDeltaPackages ([]);
			};

		return _package;
	}
});

