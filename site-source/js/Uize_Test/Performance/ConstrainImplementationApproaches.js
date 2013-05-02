/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Performance.ConstrainImplementationApproaches Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Performance.ConstrainImplementationApproaches= module defines a performance test that compares different implementation approaches for constraining a value to a range.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Performance.ConstrainImplementationApproaches',
	builder:function () {
		'use strict';

		var
			_totalIterations = 500000,
			_minValue = 1000,
			_maxValue = 1000000,
			_valueBelowMin = _minValue - 1,
			_valueAboveMax = _maxValue + 1,
			_valueInRange = (_minValue + _maxValue) / 2,
			_Uize_constrain = Uize.constrain
		;

		function _constrainUsingMath (_value,_limitA,_limitB) {
			return Math.min (Math.max (_value,Math.min (_limitA,_limitB)),Math.max (_limitA,_limitB));
		}

		return Uize.Test.declare ({
			title:'Test the performance of different implementation approaches for constraining a value to a range',
			test:[
				{
					title:'An implementation using the Math.min and Math.max methods',
					test:[
						{
							title:'When the value being tested is below the min value of the range',
							test:function () {
								for (var _iterationNo = _totalIterations; --_iterationNo >= 0;) {
									_constrainUsingMath (_valueBelowMin,_minValue,_maxValue);
									_constrainUsingMath (_valueBelowMin,_maxValue,_minValue);
								}
								return true;
							}
						},
						{
							title:'When the value being tested lies inside the range',
							test:function () {
								for (var _iterationNo = _totalIterations; --_iterationNo >= 0;) {
									_constrainUsingMath (_valueInRange,_minValue,_maxValue);
									_constrainUsingMath (_valueInRange,_maxValue,_minValue);
								}
								return true;
							}
						},
						{
							title:'When the value being tested is above the max value of the range',
							test:function () {
								for (var _iterationNo = _totalIterations; --_iterationNo >= 0;) {
									_constrainUsingMath (_valueAboveMax,_minValue,_maxValue);
									_constrainUsingMath (_valueAboveMax,_maxValue,_minValue);
								}
								return true;
							}
						}
					]
				},
				{
					title:'The Uize.constrain method\'s implementation',
					test:[
						{
							title:'When the value being tested is below the min value of the range',
							test:function () {
								for (var _iterationNo = _totalIterations; --_iterationNo >= 0;) {
									_Uize_constrain (_valueBelowMin,_minValue,_maxValue);
									_Uize_constrain (_valueBelowMin,_maxValue,_minValue);
								}
								return true;
							}
						},
						{
							title:'When the value being tested lies inside the range',
							test:function () {
								for (var _iterationNo = _totalIterations; --_iterationNo >= 0;) {
									_Uize_constrain (_valueInRange,_minValue,_maxValue);
									_Uize_constrain (_valueInRange,_maxValue,_minValue);
								}
								return true;
							}
						},
						{
							title:'When the value being tested is above the max value of the range',
							test:function () {
								for (var _iterationNo = _totalIterations; --_iterationNo >= 0;) {
									_Uize_constrain (_valueAboveMax,_minValue,_maxValue);
									_Uize_constrain (_valueAboveMax,_maxValue,_minValue);
								}
								return true;
							}
						}
					]
				}
			]
		});
	}
});

