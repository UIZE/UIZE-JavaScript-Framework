/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Performance.ArraySummingApproaches Class
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
		The =Uize.Test.Performance.ArraySummingApproaches= module defines a performance test that compares different approaches to summing all the elements of an array.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Performance.ArraySummingApproaches',
	builder:function () {
		'use strict';

		function _sumArrayUsingLoop (_elements) {
			var _result = 0;
			for (var _elementNo = _elements.length; --_elementNo >= 0;)
				_result += _elements [_elementNo]
			;
			return _result;
		}

		function _sumArrayUsingJoinAndEval (_elements) {
			return eval (_elements.join ('+'));
		}

		function _makeRandomNumbersArray (_elementsLength) {
			var _elements = [];
			for (var _elementNo = _elementsLength; --_elementNo >= 0;)
				_elements.push (Math.random () * 1000000)
			;
			return _elements;
		}

		var
			_shortArray = _makeRandomNumbersArray (10),
			_mediumArray = _makeRandomNumbersArray (100),
			_longArray = _makeRandomNumbersArray (1000),
			_totalIterations = 500
		;

		return Uize.Test.declare ({
			title:'Test the performance of different approaches to summing all the elements of an array',
			test:[
				{
					title:'Use a loop to iterate over the elements of an array and add each element\'s value to a sum variable',
					test:[
						{
							title:'Sum a short array (10 elements) 500 times',
							test:function () {
								for (var _iterationNo = _totalIterations; --_iterationNo >= 0;)
									_sumArrayUsingLoop (_shortArray)
								;
								return true;
							}
						},
						{
							title:'Sum a medium array (100 elements) 500 times',
							test:function () {
								for (var _iterationNo = _totalIterations; --_iterationNo >= 0;)
									_sumArrayUsingLoop (_mediumArray)
								;
								return true;
							}
						},
						{
							title:'Sum a long array (1000 elements) 500 times',
							test:function () {
								for (var _iterationNo = _totalIterations; --_iterationNo >= 0;)
									_sumArrayUsingLoop (_longArray)
								;
								return true;
							}
						}
					]
				},
				{
					title:'Join all the elements of an array using "+" as the delimiter and use eval to evaluate the resulting summation expression',
					test:[
						{
							title:'Sum a short array (10 elements) 500 times',
							test:function () {
								for (var _iterationNo = _totalIterations; --_iterationNo >= 0;)
									_sumArrayUsingJoinAndEval (_shortArray)
								;
								return true;
							}
						},
						{
							title:'Sum a medium array (100 elements) 500 times',
							test:function () {
								for (var _iterationNo = _totalIterations; --_iterationNo >= 0;)
									_sumArrayUsingJoinAndEval (_mediumArray)
								;
								return true;
							}
						},
						{
							title:'Sum a long array (1000 elements) 500 times',
							test:function () {
								for (var _iterationNo = _totalIterations; --_iterationNo >= 0;)
									_sumArrayUsingJoinAndEval (_longArray)
								;
								return true;
							}
						}
					]
				}
			]
		});
	}
});

