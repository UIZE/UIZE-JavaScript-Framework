/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Templates.Text.Tables.Histogram Package
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
		The =Uize.Templates.Text.Tables.Histogram= module is a JavaScript Template module, used for generating a text-based histogram table that can be used when outputting to logs, consoles, terminals, etc.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Templates.Text.Tables.Histogram',
	required:[
		'Uize.Templates.Text.Table',
		'Uize.Templates.Text.ProgressBar',
		'Uize.Data.Util',
		'Uize.Array.Util'
	],
	builder:function () {
		'use strict';

		return Uize.package ({
			process:function (_input) {
				var
					_occurrencesByValue = _input.occurrencesByValue,
					_columnTitles = _input.columnTitles,
					_values = Uize.keys (_occurrencesByValue),
					_minValue = Uize.min (_values),
					_maxValue = Uize.max (_values),
					_maxBuckets = Uize.toNumber (_input.maxBuckets,Infinity),
					_rows
				;
				if (_maxBuckets > _values.length) {
					_rows = Uize.map (
						_values.sort (function (_valueA,_valueB) {return _valueA - _valueB}),
						function (_value) {
							var _occurrencesForValue = _occurrencesByValue [_value];
							return [_value,_occurrencesForValue,_value * _occurrencesForValue];
						}
					);
				} else {
					var _bucketSize = (_maxValue - _minValue + 1) / _maxBuckets;
					_rows = Uize.map (
						_maxBuckets,
						function (_value,_bucketNo) {
							return [
								Math.floor (_minValue + _bucketNo * _bucketSize) +
								'-' +
								(Math.floor (_minValue + (_bucketNo + 1) * _bucketSize) - 1),
								0,
								0
							];
						}
					);
					Uize.forEach (
						_occurrencesByValue,
						function (_occurrencesForValue,_value) {
							var _row = _rows [Math.floor ((_value - _minValue) / _bucketSize)];
							_row [1] += _occurrencesForValue;
							_row [2] += _occurrencesForValue * _value;
						}
					);
				}

				var
					_totals = Uize.Data.Util.getColumn (_rows,2),
					_maxOccurrences = Uize.max (Uize.Data.Util.getColumn (_rows,1)),
					_maxTotals = Uize.max (_totals),
					_trackLength = Uize.constrain (_maxOccurrences,20,50)
				;

				function _barFormatter (_max) {
					return function (_value) {
						return (
							_value != undefined
								? (
									_value +
									(
										Uize.isNumber (_value)
											? (
												' ' +
												Uize.Templates.Text.ProgressBar.process ({
													trackLength:_trackLength,
													endsChar:'',
													fullHeadChar:'',
													progress:_value / _max
												})
											)
											: ''
									)
								)
								: ''
						);
					}
				}

				return Uize.Templates.Text.Table.process ({
					title:_input.title,
					columns:[
						{title:_columnTitles.count},
						{
							title:_columnTitles.occurrences,
							align:'right',
							formatter:_barFormatter (_maxOccurrences)
						},
						{
							title:_columnTitles.total,
							align:'right',
							formatter:_barFormatter (_maxTotals)
						}
					],
					rows:_rows.concat ([
						[
							'All (' + _minValue + '-' + _maxValue + ')',
							undefined,
							Uize.Array.Util.sum (_totals) + ''
						]
					])
				});
			}
		});
	}
});

