/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Templates.TextTable Package
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
		The =Uize.Templates.TextTable= module is a JavaScript Template module, used for generating a text-based table layout of data that can be used when outputting to logs, consoles, terminals, etc.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Templates.TextTable',
	required:[
		'Uize.Data.Util',
		'Uize.Str.Repeat'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Performance Optimization ***/
				_repeat = Uize.Str.Repeat.repeat
		;

		return Uize.package ({
			process:function (_input) {
				function _pad (_sourceStr,_length,_align) {
					var
						_totalPadding = _length - _sourceStr.length,
						_leftPadding = Math.floor (
							_totalPadding * (typeof _align == 'string' ? {left:0,center:.5,right:1} [_align] : +_align || 0)
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
		});
	}
});

