/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.Deps Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 4
*/

/*?
	Introduction
		The =Uize.Build.Deps= module implements a build script for analyzing the dependencies of a specified module and producing a detailed report.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Build.Deps',
	required:[
		'Uize.Util.Dependencies.Analyzer',
		'Uize.Build.Files',
		'Uize.Build.ModuleInfo',
		'Uize.Services.FileSystem',
		'Uize.Json'
	],
	builder:function () {
		'use strict';

		/*** Utility Functions ***/
			function _renderTextTable (_params) {
				return Uize.Json.to (_params.rows);
			}

		return Uize.package ({
			perform:function (_params) {
				var
					_moduleName = _params.module,
					_fileSystem = Uize.Services.FileSystem.singleton ()
				;
				Uize.Util.Dependencies.Analyzer.analyze (
					_moduleName,
					function (_moduleName,_callback) {
						var
							_moduleInfoModuleUrl =
								_params.modulesFolder + '/' +
								Uize.modulePathResolver ('UizeSite.ModuleInfo.' + _moduleName) + '.js',
							_paramsForBuildFiles = Uize.copy (_params,{files:_moduleInfoModuleUrl})
						;
						delete _paramsForBuildFiles.module;
						Uize.Build.Files.perform (_paramsForBuildFiles);
						_callback (
							Uize.Build.ModuleInfo.getDefinitionFromCode (
								_fileSystem.readFile ({path:_params.builtPath + '/' + _moduleInfoModuleUrl})
							).builder () ()
						);
					},
					function (_analysis) {
						var _analysisAsJson = Uize.Json.to (_analysis);
						_fileSystem.writeFile ({
							path:_params.logFilePath,
							contents:_analysisAsJson
						});

						console.log (
							_renderTextTable ({
								title:'Complete List of Dependencies',
								columns:[
									{title:'Module Name'},
									{title:'Type'},
									{title:'Order'},
									{
										title:'Depth',
										minValue:0,
										maxValue:2
									},
									{
										title:'Import.',
										minValue:0,
										maxValue:10
									},
									{
										title:'Code',
										minValue:0,
										maxValue:100,
										formatter:'value + "%"'
									},
									{title:'Dir. Deps'},
									{
										title:'Shared',
										minValue:0
									},
									{
										title:'Size (%)',
										minValue:0,
										maxValue:100,
										formatter:'value.toFixed (1) + "%"'
									},
									{
										title:'Size (B)',
										formatter:'value + " B"'
									},
									{
										title:'Unique',
										formatter:'value + " B"'
									}
								],
								rows:Uize.map (_analysis.dependencies,'Uize.values (value)')
							})
						);
					}
				);
			}
		});
	}
});

