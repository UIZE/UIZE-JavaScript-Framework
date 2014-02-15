/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.Loc Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 2
	codeCompleteness: 10
	docCompleteness: 4
*/

/*?
	Introduction
		The =Uize.Build.Loc= package lets you execute one of the localization service methods for a project that is configured for localization.

		*DEVELOPERS:* `Chris van Rensburg`

		USAGE
		.........................................................................
		node build.js Uize.Build.Loc project=[projectName] method=[locMethodName]
		.........................................................................

		Parameters
			project
				The name of a project, as configured in the =moduleConfigs ['Uize.Build.Loc'].projects= object of the =uize-config.json= file.

				If the special value "*" is specified for the =project= parameter, then the specified localization method will be executed for all of the localization projects specified in the config.

				EXAMPLE
				....................................................
				node build.js Uize.Build.Loc project=* method=export
				....................................................

			method
				The name of a service method of the =Uize.Services.Loc= service (=export=, =import=, =metrics=, or =pseudoLocalize=).
*/

Uize.module ({
	name:'Uize.Build.Loc',
	required:'Uize.Services.Loc',
	builder:function () {
		'use strict';

		return Uize.package ({
			perform:function (_params) {
				function _performLocMethodForProject (_project,_projectName) {
					_project.name = _projectName;
					Uize.require (
						_project.serviceAdapter,
						function (_locServiceAdapter) {
							var _locService = Uize.Services.Loc ();
							_locService.set ({adapter:_locServiceAdapter ()});
							_locService.init (
								{
									project:_project,
									stringsFolder:_scriptConfig.stringsFolder
								},
								function () {_locService [_params.method] ()}
							);
						}
					);
				}
				var
					_projectName = _params.project,
					_scriptConfig = _params.moduleConfigs ['Uize.Build.Loc'],
					_projects = _scriptConfig.projects
				;
				!_projectName || _projectName == '*'
					? Uize.forEach (_projects,_performLocMethodForProject)
					: _performLocMethodForProject (_projects [_projectName],_projectName)
				;
			}
		});
	}
});

