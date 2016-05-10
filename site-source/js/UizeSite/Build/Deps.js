/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.Deps Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
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
		The =UizeSite.Build.Deps= module implements a build script for analyzing the dependencies of a specified module and producing a detailed report.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeSite.Build.Deps',
	required:[
		'Uize.Util.Dependencies.Analyzer',
		'Uize.Build.Files',
		'Uize.Build.ModuleInfo',
		'Uize.Services.FileSystem',
		'Uize.Json',
		'Uize.Templates.Text.Table',
		'Uize.Templates.Text.ProgressBar'
	],
	builder:function () {
		'use strict';

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

						function _augmentFormatterWithProgressBar (_formatter) {
							_formatter = Uize.resolveTransformer (_formatter);
							return function (_value) {
								var m = this;
								return (
									_formatter.call (m,_value) + ' ' +
									Uize.Templates.Text.ProgressBar.process ({
										trackLength:5,
										endsChar:'',
										fullHeadChar:'',
										progress:(_value - m.minValue) / (m.maxValue - m.minValue)
									})
								);
							};
						};

						console.log (
							Uize.Templates.Text.Table.process ({
								title:'COMPLETE LIST OF DEPENDENCIES',
								columns:[
									{
										title:'Module Name',
										align:'left'
									},
									{
										title:'Type',
										align:'left'
									},
									{
										title:'Order',
										align:'right'
									},
									{
										title:'Depth',
										align:'right',
										minValue:0,
										maxValue:2
									},
									{
										title:'Import.',
										align:'right',
										minValue:0,
										maxValue:10,
										formatter:_augmentFormatterWithProgressBar ()
									},
									{
										title:'Code',
										align:'right',
										minValue:0,
										maxValue:100,
										formatter:_augmentFormatterWithProgressBar ('value + "%"')
									},
									{
										title:'Dir. Deps',
										align:'right',
										formatter:_augmentFormatterWithProgressBar ()
									},
									{
										title:'Shared',
										align:'right',
										minValue:0,
										formatter:_augmentFormatterWithProgressBar ()
									},
									{
										title:'Size (%)',
										align:'right',
										minValue:0,
										maxValue:100,
										formatter:_augmentFormatterWithProgressBar ('value.toFixed (1) + "%"')
									},
									{
										title:'Size (B)',
										align:'right',
										formatter:_augmentFormatterWithProgressBar ('value + " B"')
									},
									{
										title:'Unique',
										align:'right',
										formatter:_augmentFormatterWithProgressBar ('value + " B"')
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

