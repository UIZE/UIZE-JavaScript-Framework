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
		'Uize.Str.Repeat',
		'Uize.Templates.TextProgressBar'
	],
	builder:function () {
		'use strict';

		var _repeat = Uize.Str.Repeat.repeat;

		/*** Utility Functions ***/
			function _renderTextTable (_input) {
				function _pad (_sourceStr,_length,_align) {
					var
						_totalPadding = _length - _sourceStr.length,
						_leftPadding = Math.floor (
							_totalPadding * (typeof _align == 'string' ? {left:0,center:.5,right:1} [_align] : _align)
						)
					;
					return _repeat (' ',_leftPadding) + _sourceStr + _repeat (' ',_totalPadding - _leftPadding);
				}

				var
					_title = _input.title,
					_columns = _input.columns,
					_rows = _input.rows
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
						_columnMaxWidths = Uize.map (_columns,'value.title.length'),
						_formattedRows = Uize.map (
							_rows,
							function (_row) {
								return Uize.map (
									_columns,
									function (_column,_columnNo) {
										var _formattedValue = _column.formatter (_row [_columnNo]) + '';
										_columnMaxWidths [_columnNo] = Math.max (
											_columnMaxWidths [_columnNo],
											_formattedValue.length
										);
										return _formattedValue;
									}
								);
							}
						)
					;

				/*** produce row dividers ***/
					var
						_columnLines = Uize.map (
							_columnMaxWidths,
							function (_columnMaxWidth) {return Uize.Str.Repeat.repeat ('-',_columnMaxWidth)}
						),
						_rowSeparatorLine = '|-' + _columnLines.join ('-+-') + '-|',
						_topAndBottomLine = '+-' + _columnLines.join ('---') + '-+'
					;

				return (
					(
						_title
							? (_topAndBottomLine + '\n| ' + _pad (_title,_topAndBottomLine.length - 4,'center') + ' |\n')
							: ''
					) +
					_topAndBottomLine + '\n' +
					(
						'| ' +
						Uize.map (
							_columns,
							function (_column,_columnNo) {return _pad (_column.title,_columnMaxWidths [_columnNo],'center')}
						).join (' | ') + ' |'
					) + '\n' +
					_rowSeparatorLine + '\n' +
					Uize.map (
						_formattedRows,
						function (_row) {
							return (
								'| ' +
								Uize.map (
									_row,
									function (_column,_columnNo) {
										return _pad (_column,_columnMaxWidths [_columnNo],_columns [_columnNo].align);
									}
								).join (' | ') +
								' |'
							);
						}
					).join ('\n' + _rowSeparatorLine + '\n') +
					'\n' + _topAndBottomLine + '\n'
				);
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

						function _augmentFormatterWithProgressBar (_formatter) {
							_formatter = Uize.resolveTransformer (_formatter);
							return function (_value) {
								var m = this;
								return (
									_formatter.call (m,_value) + ' ' +
									Uize.Templates.TextProgressBar.process ({
										trackLength:5,
										endsChar:'',
										fullHeadChar:'',
										progress:(_value - m.minValue) / (m.maxValue - m.minValue)
									})
								);
							};
						};

						console.log (
							_renderTextTable ({
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

