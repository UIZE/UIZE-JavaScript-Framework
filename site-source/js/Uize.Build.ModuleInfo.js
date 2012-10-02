/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.ModuleInfo Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 2
	codeCompleteness: 0
	testCompleteness: 0
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Build.ModuleInfo= module provides various methods for obtaining information about modules JavaScript modules.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Build.ModuleInfo',
	required:'Uize.Wsh',
	builder:function () {
		/*** Variables for Scruncher Optimization ***/
			var
				_package = function () {},
				_true = true,
				_false = false,
				_undefined,
				_trueFlagValue = {},
				_forEach = Uize.forEach
			;

		/*** Utility Functions ***/
			function _readModuleFile (_moduleName) {
				/* TODO: this should be migrated into a new Uize.Build.Utils module as Uize.Build.Utils.readModuleFile */
				return Uize.Wsh.readFile (env.moduleFolderPath + '\\' + _moduleName + '.js');
			}

		/*** Public Static Methods ***/
			_package.getDefinitionFromCode = function (_moduleCode) {
				var
					_result,
					Uize = {module: function (_definition) {_result = _definition}}
				;
				eval (_moduleCode);
				return _result;
			};

			_package.getDefinition = function (_moduleName) {
				return _package.getDefinitionFromCode (_readModuleFile (_moduleName));
			};

			var _getDirectDependencies = _package.getDirectDependencies = function (_moduleName) {
				var _definition = _package.getDefinition (_moduleName);
				return _definition ? Uize.resolveModuleDefinition (_definition).required : [];
			};

			_package.traceDependencies = function (_modules,_excludeModules) {
				var
					_excludeModulesLookup = {},
					_modulesNeeded = []
				;
				_forEach (
					_excludeModules,
					function (_excludeModule) {_excludeModulesLookup [_excludeModule] = _trueFlagValue}
				);

				function _traceDependencies (_modules) {
					_forEach (
						_modules.sort (),
						function (_moduleName) {
							if (_excludeModulesLookup [_moduleName] != _trueFlagValue) {
								_excludeModulesLookup [_moduleName] = _trueFlagValue;
								_traceDependencies (_getDirectDependencies (_moduleName));
								_modulesNeeded.push (_moduleName);
							}
						}
					);
				}
				_traceDependencies (['Uize'].concat (typeof _modules == 'string' ? [_modules] : _modules));

				return _modulesNeeded;
			};

		return _package;
	}
});

