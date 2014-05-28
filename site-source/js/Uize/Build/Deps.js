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
		'Uize.Json',
		'Uize.Data.Util',
		'Uize.Str.Repeat'
	],
	builder:function () {
		'use strict';

		/*** Utility Functions ***/
			function _renderTextTable (_params) {
				var
					_columns = _params.columns,
					_rows = _params.rows
				;

				/*** resolve column information ***/
					Uize.forEach (
						_columns,
						function (_column,_columnNo) {
							var _columnValues = Uize.Data.Util.getColumn (_rows,_columnNo);
							if (!('minValue' in _column)) _column.minValue = Uize.min (_columnValues);
							if (!('maxValue' in _column)) _column.maxValue = Uize.max (_columnValues);
							_column.formatter = Uize.resolveTransformer (_column.formatter);
						}
					);

				/*** format column data and get max width for each column ***/
					var
						_columnMaxWidths = [],
						_formattedRows = Uize.map (
							_rows,
							function (_row) {
								return Uize.map (
									_columns,
									function (_column,_columnNo) {
										var _formattedValue = _column.formatter (_row [_columnNo]) + '';
										_columnMaxWidths [_columnNo] = Math.max (
											_columnMaxWidths [_columnNo] || 0,
											_formattedValue.length
										);
										return _formattedValue;
									}
								);
							}
						)
					;

				return Uize.map (
					_formattedRows,
					function (_row) {
						return (
							'| ' +
							Uize.map (
								_row,
								function (_column,_columnNo) {
									var _padding = Uize.Str.Repeat.repeat (' ',_columnMaxWidths [_columnNo] - _column.length);
									return _columns [_columnNo].align == 'right' ? _padding + _column : _column + _padding;
								}
							).join (' | ') +
							' |'
						);
					}
				).join ('\n');
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
										maxValue:10
									},
									{
										title:'Code',
										align:'right',
										minValue:0,
										maxValue:100,
										formatter:'value + "%"'
									},
									{
										title:'Dir. Deps',
										align:'right',
									},
									{
										title:'Shared',
										align:'right',
										minValue:0
									},
									{
										title:'Size (%)',
										align:'right',
										minValue:0,
										maxValue:100,
										formatter:'value.toFixed (1) + "%"'
									},
									{
										title:'Size (B)',
										align:'right',
										formatter:'value + " B"'
									},
									{
										title:'Unique',
										align:'right',
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

