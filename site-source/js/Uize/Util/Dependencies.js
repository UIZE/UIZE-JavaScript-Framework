/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.Dependencies Package
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
		The =Uize.Util.Dependencies= utility module provides methods for working with dependency relationships in a generic way.

		*DEVELOPERS:* `Chris van Rensburg`

		While the =Uize.Util.Dependencies= module is used by the =Uize.Build.ModuleInfo= build utility module to trace module dependencies, the methods of the =Uize.Util.Dependencies= module are expressed in sufficiently generic terms that the module can be used for many types of items that have dependency relationships.
*/

Uize.module ({
	name:'Uize.Util.Dependencies',
	builder:function () {
		'use strict';

		/*** General Variables ***/
			var _trueFlagValue = {};

		/*** Utility Functions ***/
			function _resolveDependenciesList (_dependencies) {
				return (
					!_dependencies
						? []
						: typeof _dependencies == 'string'
							? _dependencies.split (',')
							: _dependencies
				);
			}

		return Uize.package ({
			resolveDependenciesList:_resolveDependenciesList,

			traceDependencies:function (_rootDependencies,_getDirectDependencies,_excludeDependencies) {
				var
					_excludeDependenciesLookup = Uize.lookup (
						_resolveDependenciesList (_excludeDependencies),
						_trueFlagValue
					),
					_dependenciesNeeded = []
				;
				function _traceDependencies (_dependencies) {
					Uize.forEach (
						_dependencies.sort (),
						function (_dependency) {
							if (_excludeDependenciesLookup [_dependency] != _trueFlagValue) {
								_excludeDependenciesLookup [_dependency] = _trueFlagValue;
								_traceDependencies (_getDirectDependencies (_dependency));
								_dependenciesNeeded.push (_dependency);
							}
						}
					);
				}
				_traceDependencies (_resolveDependenciesList (_rootDependencies));

				return _dependenciesNeeded;
				/*?
					Static Methods
						Uize.Util.Dependencies.traceDependencies
							Returns an array, containing the dependencies that are required - both directly and indirectly - by the specified root dependency (or dependencies), and excluding the optionally specified exclude list.

							SYNTAX
							..............................................................
							dependenciesARRAY = Uize.Util.Dependencies.traceDependencies (
								rootDependenciesSTRorARRAY,
								getDirectDependenciesFUNC,
								excludeDependenciesSTRorARRAY  // optional
							);
							..............................................................

							The =Uize.Util.Dependencies.traceDependencies= method can be used to trace all the dependencies for a specified set of one or more root level dependencies. Dependencies, which are specified by name, can be of any type - modules, needs, conditions, barriers, derived values, etc.

							Parameters
								The =Uize.Util.Dependencies.traceDependencies= method takes the following parameters...

								- =rootDependenciesSTRorARRAY= - either a string, containing a comma-separated list of the root dependencies, or a string array of the root dependencies
								- =getDirectDependenciesFUNC= - a function that should expect to receive a single string parameter representing the name of a dependency, and that should return an array of the dependency's direct dependencies
								- =excludeDependenciesSTRorARRAY= - an optional string, containing a comma-separated list of dependencies to exclude, or a string array of the dependencies to exclude

							In order for this method to be able to trace dependencies, a function must be specified for the =getDirectDependenciesFUNC= parameter that can be used to obtain a list of the direct dependencies for any given dependency. Provided with this function, the =Uize.Util.Dependencies.traceDependencies= method can recursively trace out the dependency list and return the list of all dependencies - both direct and indirect - listed in dependency order and ASCIIbetically sub-sorted.

							EXAMPLE
							.........................................................................
							var directDepsLookup = {
								foo:['bar','baz','qux'],
								bar:['baz','qux'],
								baz:['qux'],
								qux:[]
							};

							function getDirectDeps (dep) {
								return directDepsLookup [dep];
							}

							alert (  // alerts "qux,baz,bar,foo"
								Uize.Util.Dependencies.traceDependencies (['foo','qux'],getDirectDeps)
							);

							alert (  // alerts "qux,baz"
								Uize.Util.Dependencies.traceDependencies ('baz',getDirectDeps)
							);

							alert (  // alerts "baz,bar,foo"
								Uize.Util.Dependencies.traceDependencies ('foo',getDirectDeps,['qux'])
							);
							.........................................................................

							The above example is very hypothetical and over simplified, but it demonstrates the basics of how the =Uize.Util.Dependencies.traceDependencies= method can be used.

							In the example, we have created a =directDepsLookup= object, which maps the names of dependencies to their direct dependencies (it's not important what type of things we're dealing with). Then, we've created a simple =getDirectDeps= function that looks up the direct dependencies for a specified dependency from the =directDepsLookup= lookup and returns those dependencies. When we call the =Uize.Util.Dependencies.traceDependencies= method, we supply the =getDirectDeps= function for the method's =getDirectDependenciesFUNC= parameter.

							In a real world usage, the function value provided for the =getDirectDependenciesFUNC= parameter would have an understanding of the type of dependencies that are being dealt with. This approach provides the maximum flexibility for the user of the =Uize.Util.Dependencies.traceDependencies= method, keeping the responsibility of this method to simply performing the recursive tracing algorithm.

							NOTES
							- compare to the related =Uize.Util.Dependencies.getDirectDependencies= static method
				*/
			}
		});
	}
});

