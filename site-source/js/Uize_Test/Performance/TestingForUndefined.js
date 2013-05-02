/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Performance.TestingForUndefined Class
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
		The =Uize.Test.Performance.TestingForUndefined= module defines a performance test that compares different approaches to testing for an undefined value.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Performance.TestingForUndefined',
	builder:function () {
		'use strict';

		var
			_totalIterations = 500000,
			_testVariableWithUndefinedValue,
			_testVariableWithDefinedValue = 'this is a string value',
			_undefinedStr = 'undefined',
			_undefined
		;

		return Uize.Test.declare ({
			title:'Test the performance of different approaches to testing for an undefined value',
			test:[
				{
					title:'typeof myVariable == undefinedStr',
					test:[
						{
							title:'When the variable being tested is undefined',
							test:function () {
								for (var _iterationNo = _totalIterations; --_iterationNo >= 0;) {
									typeof _testVariableWithUndefinedValue == _undefinedStr;
									typeof _testVariableWithUndefinedValue == _undefinedStr;
									typeof _testVariableWithUndefinedValue == _undefinedStr;
									typeof _testVariableWithUndefinedValue == _undefinedStr;
									typeof _testVariableWithUndefinedValue == _undefinedStr;
									typeof _testVariableWithUndefinedValue == _undefinedStr;
									typeof _testVariableWithUndefinedValue == _undefinedStr;
									typeof _testVariableWithUndefinedValue == _undefinedStr;
									typeof _testVariableWithUndefinedValue == _undefinedStr;
									typeof _testVariableWithUndefinedValue == _undefinedStr;
									typeof _testVariableWithUndefinedValue == _undefinedStr;
									typeof _testVariableWithUndefinedValue == _undefinedStr;
									typeof _testVariableWithUndefinedValue == _undefinedStr;
									typeof _testVariableWithUndefinedValue == _undefinedStr;
									typeof _testVariableWithUndefinedValue == _undefinedStr;
									typeof _testVariableWithUndefinedValue == _undefinedStr;
									typeof _testVariableWithUndefinedValue == _undefinedStr;
									typeof _testVariableWithUndefinedValue == _undefinedStr;
									typeof _testVariableWithUndefinedValue == _undefinedStr;
									typeof _testVariableWithUndefinedValue == _undefinedStr;
								}
								return true;
							}
						},
						{
							title:'When the variable being tested is not undefined',
							test:function () {
								for (var _iterationNo = _totalIterations; --_iterationNo >= 0;) {
									typeof _testVariableWithDefinedValue == _undefinedStr;
									typeof _testVariableWithDefinedValue == _undefinedStr;
									typeof _testVariableWithDefinedValue == _undefinedStr;
									typeof _testVariableWithDefinedValue == _undefinedStr;
									typeof _testVariableWithDefinedValue == _undefinedStr;
									typeof _testVariableWithDefinedValue == _undefinedStr;
									typeof _testVariableWithDefinedValue == _undefinedStr;
									typeof _testVariableWithDefinedValue == _undefinedStr;
									typeof _testVariableWithDefinedValue == _undefinedStr;
									typeof _testVariableWithDefinedValue == _undefinedStr;
									typeof _testVariableWithDefinedValue == _undefinedStr;
									typeof _testVariableWithDefinedValue == _undefinedStr;
									typeof _testVariableWithDefinedValue == _undefinedStr;
									typeof _testVariableWithDefinedValue == _undefinedStr;
									typeof _testVariableWithDefinedValue == _undefinedStr;
									typeof _testVariableWithDefinedValue == _undefinedStr;
									typeof _testVariableWithDefinedValue == _undefinedStr;
									typeof _testVariableWithDefinedValue == _undefinedStr;
									typeof _testVariableWithDefinedValue == _undefinedStr;
									typeof _testVariableWithDefinedValue == _undefinedStr;
								}
								return true;
							}
						}
					]
				},
				{
					title:'typeof myVariable == \'undefined\'',
					test:[
						{
							title:'When the variable being tested is undefined',
							test:function () {
								for (var _iterationNo = _totalIterations; --_iterationNo >= 0;) {
									typeof _testVariableWithUndefinedValue == 'undefined';
									typeof _testVariableWithUndefinedValue == 'undefined';
									typeof _testVariableWithUndefinedValue == 'undefined';
									typeof _testVariableWithUndefinedValue == 'undefined';
									typeof _testVariableWithUndefinedValue == 'undefined';
									typeof _testVariableWithUndefinedValue == 'undefined';
									typeof _testVariableWithUndefinedValue == 'undefined';
									typeof _testVariableWithUndefinedValue == 'undefined';
									typeof _testVariableWithUndefinedValue == 'undefined';
									typeof _testVariableWithUndefinedValue == 'undefined';
									typeof _testVariableWithUndefinedValue == 'undefined';
									typeof _testVariableWithUndefinedValue == 'undefined';
									typeof _testVariableWithUndefinedValue == 'undefined';
									typeof _testVariableWithUndefinedValue == 'undefined';
									typeof _testVariableWithUndefinedValue == 'undefined';
									typeof _testVariableWithUndefinedValue == 'undefined';
									typeof _testVariableWithUndefinedValue == 'undefined';
									typeof _testVariableWithUndefinedValue == 'undefined';
									typeof _testVariableWithUndefinedValue == 'undefined';
									typeof _testVariableWithUndefinedValue == 'undefined';
								}
								return true;
							}
						},
						{
							title:'When the variable being tested is not undefined',
							test:function () {
								for (var _iterationNo = _totalIterations; --_iterationNo >= 0;) {
									typeof _testVariableWithDefinedValue == 'undefined';
									typeof _testVariableWithDefinedValue == 'undefined';
									typeof _testVariableWithDefinedValue == 'undefined';
									typeof _testVariableWithDefinedValue == 'undefined';
									typeof _testVariableWithDefinedValue == 'undefined';
									typeof _testVariableWithDefinedValue == 'undefined';
									typeof _testVariableWithDefinedValue == 'undefined';
									typeof _testVariableWithDefinedValue == 'undefined';
									typeof _testVariableWithDefinedValue == 'undefined';
									typeof _testVariableWithDefinedValue == 'undefined';
									typeof _testVariableWithDefinedValue == 'undefined';
									typeof _testVariableWithDefinedValue == 'undefined';
									typeof _testVariableWithDefinedValue == 'undefined';
									typeof _testVariableWithDefinedValue == 'undefined';
									typeof _testVariableWithDefinedValue == 'undefined';
									typeof _testVariableWithDefinedValue == 'undefined';
									typeof _testVariableWithDefinedValue == 'undefined';
									typeof _testVariableWithDefinedValue == 'undefined';
									typeof _testVariableWithDefinedValue == 'undefined';
									typeof _testVariableWithDefinedValue == 'undefined';
								}
								return true;
							}
						}
					]
				},
				{
					title:'myVariable === variableDeliberatelyNotDefined',
					test:[
						{
							title:'When the variable being tested is undefined',
							test:function () {
								for (var _iterationNo = _totalIterations; --_iterationNo >= 0;) {
									_testVariableWithUndefinedValue === _undefined;
									_testVariableWithUndefinedValue === _undefined;
									_testVariableWithUndefinedValue === _undefined;
									_testVariableWithUndefinedValue === _undefined;
									_testVariableWithUndefinedValue === _undefined;
									_testVariableWithUndefinedValue === _undefined;
									_testVariableWithUndefinedValue === _undefined;
									_testVariableWithUndefinedValue === _undefined;
									_testVariableWithUndefinedValue === _undefined;
									_testVariableWithUndefinedValue === _undefined;
									_testVariableWithUndefinedValue === _undefined;
									_testVariableWithUndefinedValue === _undefined;
									_testVariableWithUndefinedValue === _undefined;
									_testVariableWithUndefinedValue === _undefined;
									_testVariableWithUndefinedValue === _undefined;
									_testVariableWithUndefinedValue === _undefined;
									_testVariableWithUndefinedValue === _undefined;
									_testVariableWithUndefinedValue === _undefined;
									_testVariableWithUndefinedValue === _undefined;
									_testVariableWithUndefinedValue === _undefined;
								}
								return true;
							}
						},
						{
							title:'When the variable being tested is not undefined',
							test:function () {
								for (var _iterationNo = _totalIterations; --_iterationNo >= 0;) {
									_testVariableWithDefinedValue === _undefined;
									_testVariableWithDefinedValue === _undefined;
									_testVariableWithDefinedValue === _undefined;
									_testVariableWithDefinedValue === _undefined;
									_testVariableWithDefinedValue === _undefined;
									_testVariableWithDefinedValue === _undefined;
									_testVariableWithDefinedValue === _undefined;
									_testVariableWithDefinedValue === _undefined;
									_testVariableWithDefinedValue === _undefined;
									_testVariableWithDefinedValue === _undefined;
									_testVariableWithDefinedValue === _undefined;
									_testVariableWithDefinedValue === _undefined;
									_testVariableWithDefinedValue === _undefined;
									_testVariableWithDefinedValue === _undefined;
									_testVariableWithDefinedValue === _undefined;
									_testVariableWithDefinedValue === _undefined;
									_testVariableWithDefinedValue === _undefined;
									_testVariableWithDefinedValue === _undefined;
									_testVariableWithDefinedValue === _undefined;
									_testVariableWithDefinedValue === _undefined;
								}
								return true;
							}
						}
					]
				},
				{
					title:'myVariable === undefined',
					test:[
						{
							title:'When the variable being tested is undefined',
							test:function () {
								for (var _iterationNo = _totalIterations; --_iterationNo >= 0;) {
									_testVariableWithUndefinedValue === undefined;
									_testVariableWithUndefinedValue === undefined;
									_testVariableWithUndefinedValue === undefined;
									_testVariableWithUndefinedValue === undefined;
									_testVariableWithUndefinedValue === undefined;
									_testVariableWithUndefinedValue === undefined;
									_testVariableWithUndefinedValue === undefined;
									_testVariableWithUndefinedValue === undefined;
									_testVariableWithUndefinedValue === undefined;
									_testVariableWithUndefinedValue === undefined;
									_testVariableWithUndefinedValue === undefined;
									_testVariableWithUndefinedValue === undefined;
									_testVariableWithUndefinedValue === undefined;
									_testVariableWithUndefinedValue === undefined;
									_testVariableWithUndefinedValue === undefined;
									_testVariableWithUndefinedValue === undefined;
									_testVariableWithUndefinedValue === undefined;
									_testVariableWithUndefinedValue === undefined;
									_testVariableWithUndefinedValue === undefined;
									_testVariableWithUndefinedValue === undefined;
								}
								return true;
							}
						},
						{
							title:'When the variable being tested is not undefined',
							test:function () {
								for (var _iterationNo = _totalIterations; --_iterationNo >= 0;) {
									_testVariableWithDefinedValue === undefined;
									_testVariableWithDefinedValue === undefined;
									_testVariableWithDefinedValue === undefined;
									_testVariableWithDefinedValue === undefined;
									_testVariableWithDefinedValue === undefined;
									_testVariableWithDefinedValue === undefined;
									_testVariableWithDefinedValue === undefined;
									_testVariableWithDefinedValue === undefined;
									_testVariableWithDefinedValue === undefined;
									_testVariableWithDefinedValue === undefined;
									_testVariableWithDefinedValue === undefined;
									_testVariableWithDefinedValue === undefined;
									_testVariableWithDefinedValue === undefined;
									_testVariableWithDefinedValue === undefined;
									_testVariableWithDefinedValue === undefined;
									_testVariableWithDefinedValue === undefined;
									_testVariableWithDefinedValue === undefined;
									_testVariableWithDefinedValue === undefined;
									_testVariableWithDefinedValue === undefined;
									_testVariableWithDefinedValue === undefined;
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

