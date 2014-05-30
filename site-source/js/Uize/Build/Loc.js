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
			method
				The name of a service method of the =Uize.Services.Loc= service (=export=, =import=, =metrics=, or =pseudoLocalize=).

			project
				The name of a project, as configured in the =moduleConfigs ['Uize.Build.Loc'].projects= object of the =uize-config.json= file.

				Executing a Method For All Projects
					To execute a specific localization method for all projects listed in the config, one can either omit the =project= parameter or one can specify the special "*" wildcard value.

					EXAMPLES
					....................................................
					node build.js Uize.Build.Loc method=export
					node build.js Uize.Build.Loc project=* method=export
					....................................................
*/

Uize.module ({
	name:'Uize.Build.Loc',
	required:[
		'Uize.Services.Loc',
		'Uize.Templates.Text.ProgressBar',
		'Uize.Services.FileSystem'
	],
	builder:function () {
		'use strict';

		return Uize.package ({
			perform:function (_params) {
				function _performLocMethodForProject (_project,_projectName) {
					_project = Uize.merge (_scriptConfig.common,_project,{name:_projectName});
					Uize.require (
						_project.serviceAdapter,
						function (_locServiceAdapter) {
							var
								_locService = Uize.Services.Loc (),
								_logChunks = []
							;
							_locService.set ({adapter:_locServiceAdapter ()});
							_locService.init (
								{
									project:_project,
									workingFolder:_scriptConfig.workingFolder,
									log:function (_message,_progress) {
										_logChunks.push (_message);
										if (_progress == 'summary') {
											_console != 'silent' && console.log (_message);
										} else if (_console == 'verbose') {
											console.log (
												_progressBar && _progress != undefined
													? Uize.Templates.Text.ProgressBar.process ({
														trackLength:20,
														progress:_progress
													})
													: '',
												_message
											);
										}
									}
								},
								function () {
									var _methodName = _params.method;
									_locService [_methodName] (
										{},
										function () {
											var _logFilePath = _params.logFilePath;
											_logFilePath &&
												_fileSystem.writeFile ({
													path:_logFilePath.replace (
														/\.log$/,
														'-' + _methodName + '-' + _project.name + '.log'
													),
													contents:_logChunks.join ('\n')
												})
											;
										}
									)
								}
							);
						}
					);
				}
				var
					_projectName = _params.project,
					_scriptConfig = _params.moduleConfigs ['Uize.Build.Loc'],
					_projects = _scriptConfig.projects,
					_progressBar = _params.progressBar + '' != 'false',
					_console = _params.console || 'verbose',
					_fileSystem = Uize.Services.FileSystem.singleton ()
				;
				!_projectName || _projectName == '*'
					? Uize.forEach (_projects,_performLocMethodForProject)
					: _performLocMethodForProject (_projects [_projectName],_projectName)
				;
			}
		});
	}
});

