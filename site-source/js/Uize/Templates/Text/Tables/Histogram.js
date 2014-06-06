/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Templates.Text.Tables.Histogram Package
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
		The =Uize.Templates.Text.Tables.Histogram= module is a JavaScript Template module, used for generating a text-based histogram table that can be used when outputting to logs, consoles, terminals, etc.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Templates.Text.Tables.Histogram',
	required:[
		'Uize.Templates.Text.Table',
		'Uize.Templates.Text.ProgressBar',
		'Uize.Fade.xSeries'
	],
	builder:function () {
		'use strict';

		/*** Utiilty Functions ***/
			function _sum (_array) {
				var _result = 0;
				Uize.forEach (_array,function (_value) {_result += _value});
				return _result;
			}

		return Uize.package ({
			process:function (_input) {
				var
					_occurrencesByValue = _input.occurrencesByValue,
					_columnTitles = _input.columnTitles,
					_values = Uize.keys (_occurrencesByValue),
					_occurrences = Uize.values (_occurrencesByValue),
					_minValue = Uize.min (_values),
					_maxValue = Uize.max (_values),
					_maxOccurrences = Uize.max (_occurrences),
					_maxBuckets = Uize.toNumber (_input.maxBuckets,Infinity),
					_rows
				;
				if (_maxBuckets > _values.length) {
					_rows = Uize.map (
						_values.sort (function (_valueA,_valueB) {return _valueA - _valueB}).reverse (),
						function (_value) {
							var _occurrencesForValue = _occurrencesByValue [_value];
							return [_value,_occurrencesForValue,_value * _occurrencesForValue];
						}
					);
				} else {
					_rows = Uize.map (
						Uize.Fade.getSeries (_minValue,_maxValue + 1,_maxBuckets + 1,{quantization:1}),
						function (_value,_key,_array) {
							return [_value + '-' + (this [_key + 1] - 1),0,0];
						}
					);
					_rows.pop ();
					var _bucketSize = (_maxValue - _minValue) / _maxBuckets;
					Uize.forEach (
						_occurrencesByValue,
						function (_occurrencesForValue,_value) {
							console.log ('>>>>>>>>>> ' + Math.round ((_value - _minValue) / _bucketSize));
							var _row = _rows [Math.round ((_value - _minValue) / _bucketSize)];
							_row [1] += _occurrencesForValue;
							_row [2] += _occurrencesForValue * _value;
						}
					);
					console.log (_rows);
				}
				return Uize.Templates.Text.Table.process ({
					title:_input.title,
					columns:[
						{title:_columnTitles.count},
						{
							title:_columnTitles.occurrences,
							align:'right',
							formatter:function (_value) {
								return (
									_value != undefined
										? (
											_value + ' ' +
											Uize.Templates.Text.ProgressBar.process ({
												trackLength:Math.min (_maxOccurrences,50),
												endsChar:'',
												fullHeadChar:'',
												progress:_value / _maxOccurrences
											})
										)
										: ''
								);
							}
						},
						{
							title:_columnTitles.total,
							align:'right',
						}
					],
					rows:_rows.concat ([
						[
							'All (' + _minValue + '-' + _maxValue + ')',
							undefined,
							_sum (Uize.Data.Util.getColumn (_rows,2))
						]
					])
				});
			}
		});
	}
});

