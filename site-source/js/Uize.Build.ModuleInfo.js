/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.ModuleInfo Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2013 UIZE
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
		The =Uize.Build.ModuleInfo= module provides various methods for obtaining information about JavaScript modules.

		*DEVELOPERS:* `Chris van Rensburg`

	In a Nutshell
		The =Uize.Build.ModuleInfo= module is intended primarily for build processes that build JavaScript libraries / packages that contain all necessary dependency modules.

		Among other things, this module provides a means for performing package dependency tracing for modules.

		Direct vs Package Dependencies
			The =Uize.Build.ModuleInfo= module provides a way of determining either `direct dependencies` or `package dependencies` for modules.

			Direct Dependencies
				Direct dependencies are defined as all those dependencies that are directly declared in the definition for a module as being required.

				Unlike `package dependencies`, direct dependencies does not include all those modules that are required in turn by the module's direct dependencies. Direct dependencies includes all those modules specified in the optional =required= property in the module definition, the module specified in the optional =superclass= property in the module definition, and the "host" object for the module (eg. for the module =MyNamespace.MyModule=, the host would be =MyNamespace=).

				Examples
					To illustrate how the host, superclass, and required list affect the direct dependencies, consider the following examples...

					No Host, No Superclass, No Required
						When no host, superclass, or required list is specified, then the direct dependencies for a module will be an empty array.

						EXAMPLE
						...................................
						Uize.module ({name:'MyNamespace'});
						...................................

						DIRECT DEPENDENCIES
						..
						[]
						..

					Just a Host
						When a module is defined that is under a host namespace, but no superclass or required list is specified, then the dependencies array will contain only the host.

						EXAMPLE
						............................................
						Uize.module ({
							name:'MyNamespace.MyModule',
							buider:function () {
								// build the module here and return it
							}
						});
						............................................

						DIRECT DEPENDENCIES
						...............
						['MyNamespace']
						...............

					A Host and Required
						When a module is defined that is under a host namespace and a required list is specified, then the dependencies array will contain the host along with the required list modules.

						EXAMPLE
						............................................
						Uize.module ({
							name:'MyNamespace.MyModule',
							required:[
								'Uize.Data',
								'Uize.Util.Coupler'
							],
							buider:function () {
								// build the module here and return it
							}
						});
						............................................

						DIRECT DEPENDENCIES
						......................
						[
							'MyNamespace',
							'Uize.Data',
							'Uize.Util.Coupler'
						]
						......................

					A Host and a Superclass
						When a module is defined that is under a host namespace and a superclass is specified, then the dependencies array will contain the host along with the superclass.

						EXAMPLE
						............................................
						Uize.module ({
							name:'MyNamespace.MyModule',
							superclass:'Uize.Class',
							buider:function () {
								// build the module here and return it
							}
						});
						............................................

						DIRECT DEPENDENCIES
						.................
						[
							'MyNamespace',
							'Uize.Class'
						]
						.................

					A Host, a Superclass, and Required
						When a module is defined that is under a host namespace and both a superclass and required list are specified, then the dependencies array will contain the host along with the superclass and required list modules.

						EXAMPLE
						............................................
						Uize.module ({
							name:'MyNamespace.MyModule',
							superclass:'Uize.Class',
							required:[
								'Uize.Data',
								'Uize.Util.Coupler'
							],
							buider:function () {
								// build the module here and return it
							}
						});
						............................................

						DIRECT DEPENDENCIES
						......................
						[
							'MyNamespace',
							'Uize.Class',
							'Uize.Data',
							'Uize.Util.Coupler'
						]
						......................


			Package Dependencies
				Package dependencies are defined as all those dependencies - both direct and indirect - that are required by a module, arranged in a list in dependency order.

				Unlike `direct dependencies`, package dependencies includes all those modules that are required in turn by a module's direct dependencies. Therefore, the package dependencies for a module are considered to be the entire dependency tree for a module and submodules, including the module itself, flattened to a list and de-duplicated.

				EXAMPLE
				.....................................
				Uize.module ({
					name:'MyNamespace.MyModule1',
					superclass:'Uize.Class',
					required:[
						'Uize.Data',
						'Uize.Util.Coupler'
					],
					builder:function () {
						// builder code for this module
					}
				});

				Uize.module ({
					name:'MyNamespace.MyModule2',
					required:[
						'MyNamespace.MyModule1',
						'Uize.Cuve',
						'Uize.Template'
					],
					builder:function () {
						// builder code for this module
					}
				});

				Uize.module ({
					name:'MyNamespace.Module3',
					required:[
						'MyNamespace.MyModule1',
						'MyNamespace.MyModule2',
						'Uize.Array.Sort'
					],
					builder:function () {
						// builder code for this module
					}
				});
				.....................................

				Given the above definition of the modules =MyNamespace.MyModule1=, =MyNamespace.MyModule2=, and =MyNamespace.MyModule3=, the package dependencies for the =MyNamespace.MyModule3= would be as follows...

				PACKAGE DEPENDENCIES
				...........................
				[
					'Uize',
					'Uize.Class',
					'MyNamespace',
					'Uize.Data',
					'Uize.Util'
					'Uize.Util.Coupler'
					'MyNamespace.MyModule1',
					'Uize.Cuve',
					'Uize.String',
					'Uize.Template'
					'MyNamespace.MyModule2',
					'Uize.Array',
					'Uize.Array.Sort'
					'MyNamespace.Module3'
				]
				...........................

		Special Considerations
			In order for the various methods of this module to function correctly, the environment needs to be set up in a specific way.

			Specifically, the =Uize.Build.ModuleInfo.getDefinition=, =Uize.Build.ModuleInfo.getDirectDependencies=, and =Uize.Build.ModuleInfo.traceDependencies= static methods require the environment to be set up with an implementation for the =Uize.moduleLoader= method that will call the callback and supply the module code string for the module. This is generally the case for a build environment, but not guaranteed to be the case for the Web environment.

			This behavior is needed because the module inspection methods of the =Uize.Build.ModuleInfo= module should ideally not have the side effect of actually defining modules in the runtime environment for which dependency information is simply being determined.
*/

Uize.module ({
	name:'Uize.Build.ModuleInfo',
	required:'Uize.Services.FileSystem',
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_package = function () {},
				_true = true,
				_false = false,
				_undefined,
				_trueFlagValue = {},
				_forEach = Uize.forEach
			;

		/*** General Variables ***/
			var _fileSystem = Uize.Services.FileSystem.singleton ();

		/*** Public Static Methods ***/
			_package.getDefinitionFromCode = Uize.quarantine (
				function (_moduleCode) {
					var
						_result,
						Uize = {module: function (_definition) {_result = _definition}}
					;
					eval (_moduleCode);
					return _result;
				}
				/*?
					Static Methods
						Uize.Build.ModuleInfo.getDefinitionFromCode
							Returns an object, representing the module definition for the module supplied in the specified module code string.

							SYNTAX
							..................................................................................
							moduleDefinitionOBJ = Uize.Build.ModuleInfo.getDefinitionFromCode (moduleCodeSTR);
							..................................................................................

							The =Uize.Build.ModuleInfo.getDefinitionFromCode= method can be used to get a module definition object if the code for a module is known or has been previously loaded or generated. The module definition object returned by this method will have exactly the same form as the object that would be supplied in a call to the =Uize.module= method.

							NOTES
							- compare to the related =Uize.Build.ModuleInfo.getDefinition= static method
					*/
			);

			_package.getDefinition = function (_moduleName) {
				var _definition = {name:_moduleName};
				if (_moduleName != 'Uize') {
					try {
						Uize.moduleLoader (
							_moduleName,
							function (_moduleText) {_definition = _package.getDefinitionFromCode (_moduleText)}
						);
					} catch (_error) {
						// if a module cannot be loaded because it is missing, ignore it
					}
				}
				return _definition;
				/*?
					Static Methods
						Uize.Build.ModuleInfo.getDefinition
							Returns an object, representing the module definition for the specified module.

							SYNTAX
							..........................................................................
							moduleDefinitionOBJ = Uize.Build.ModuleInfo.getDefinition (moduleNameSTR);
							..........................................................................

							The module definition object returned by this method will have exactly the same form as the object that would be supplied in a call to the =Uize.module= method.

							In order for this method to function correctly, the environment needs to be set up in a specific way (see `Special Considerations`). It should also be noted that this method will load the code for the specified module, but will not actually load the module in such a way that it becomes defined in the environment. This is by design. Ideally, getting the definition for a module does not have the side effect of actually defining the module.

							NOTES
							- compare to the related =Uize.Build.ModuleInfo.getDefinitionFromCode= static method
					*/
			};

			var _getDirectDependencies = _package.getDirectDependencies = function (_moduleName) {
				var _definition = _package.getDefinition (_moduleName);
				return _definition ? Uize.resolveModuleDefinition (_definition).required : [];
				/*?
					Static Methods
						Uize.Build.ModuleInfo.getDirectDependencies
							Returns an array, containing the names of all the modules that are declared as `direct dependencies` of the specified module.

							SYNTAX
							...............................................................................
							moduleNamesARRAY = Uize.Build.ModuleInfo.getDirectDependencies (moduleNameSTR);
							...............................................................................

							Unlike the related =Uize.Build.ModuleInfo.traceDependencies= static method, which returns `package dependencies` for one or more modules, the =Uize.Build.ModuleInfo.getDirectDependencies= method only returns the `direct dependencies` for a single module.

							In order for this method to function correctly, the environment needs to be set up in a specific way (see `Special Considerations`).

							NOTES
							- compare to the related =Uize.Build.ModuleInfo.traceDependencies= static method
				*/
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
				/*?
					Static Methods
						Uize.Build.ModuleInfo.traceDependencies
							Returns an array, containing the names of all the modules that are required - both directly and indirectly - by the specified module or modules, and excluding the optionally specified exclude list.

							SYNTAX
							.............................................................
							dependenciesARRAY = Uize.Build.ModuleInfo.traceDependencies (
								moduleNamesARRAY,
								excludeModulesARRAY  // optional
							);
							.............................................................

							Unlike the related =Uize.Build.ModuleInfo.getDirectDependencies= static method, which only returns the `direct dependencies` for a single module, the =Uize.Build.ModuleInfo.traceDependencies= method returns `package dependencies` for one or more modules, performing deep dependency tracing and recursively tracing the dependencies for the specified module(s), all their direct dependencies, and their dependencies' dependencies, and so on.

							In order for this method to function correctly, the environment needs to be set up in a specific way (see `Special Considerations`).

							NOTES
							- compare to the related =Uize.Build.ModuleInfo.getDirectDependencies= static method
					*/
			};

		return _package;
	}
});

