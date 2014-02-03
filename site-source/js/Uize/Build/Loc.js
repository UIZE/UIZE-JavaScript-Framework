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
*/

Uize.module ({
	name:'Uize.Build.Loc',
	required:[
		'Uize.Services.Loc'
	],
	builder:function () {
		'use strict';

		return Uize.package ({
			perform:function (_params) {
				var
					_projectName = _params.project,
					_project = _params.moduleConfigs ['Uize.Build.Loc'].projects [_projectName]
				;
				_project.name = _projectName;
				Uize.require (
					_project.serviceAdapter,
					function (_locServiceAdapter) {
						var _locService = Uize.Services.Loc.singleton ();
						_locService.set ({adapter:_locServiceAdapter.singleton ()});
						_locService.init (
							{project:_project},
							function () {_locService [_params.method] ()}
						);
					}
				);
			}
		});
	}
});

