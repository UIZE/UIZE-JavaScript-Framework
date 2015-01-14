/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.Dependencies.Async Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Util.Dependencies.Async= utility module provides methods for working with dependency relationships in a generic way, and where the method for obtaining direct dependencies involves an asynchronous process.

		*DEVELOPERS:* `Chris van Rensburg`

		While the =Uize.Util.Dependencies.Async= module is used by the =Uize.Build.ModuleInfo= build utility module to trace module dependencies, the methods of the =Uize.Util.Dependencies.Async= module are expressed in sufficiently generic terms that the module can be used for many types of items that have dependency relationships.
*/

Uize.module ({
	name:'Uize.Util.Dependencies.Async',
	required:'Uize.Flo',
	builder:function () {
		'use strict';

		/*** General Variables ***/
			var
				_trueFlagValue = {},
				_resolveDependenciesList = Uize.Util.Dependencies.resolveDependenciesList
			;

		return Uize.package ({
			traceDependencies:function (_rootDependencies,_getDirectDependencies,_excludeDependencies,_callback) {
				var
					_excludeDependenciesLookup = Uize.lookup (
						_resolveDependenciesList (_excludeDependencies),
						_trueFlagValue
					),
					_dependenciesNeeded = []
				;
				function _traceDependencies (_dependencies,_next) {
					Uize.Flo.forEach (
						function (_next) {_next (_dependencies.sort ())},
						function (_next) {
							var
								m = this,
								_dependency = m.value
							;
							m ['if'] (
								function (_next) {_next (_excludeDependenciesLookup [_dependency] != _trueFlagValue)},
								[
									function (_next) {
										_excludeDependenciesLookup [_dependency] = _trueFlagValue;
										_getDirectDependencies (_dependency,_next);
									},
									function (_next) {
										_traceDependencies (this.result,_next);
									},
									function (_next) {
										_dependenciesNeeded.push (_dependency);
										_next ();
									}
								]
							) (_next);
						}
					) (_next);
				}
				_traceDependencies (
					_resolveDependenciesList (_rootDependencies),
					function () {_callback (_dependenciesNeeded)}
				);
			}
		});
	}
});

