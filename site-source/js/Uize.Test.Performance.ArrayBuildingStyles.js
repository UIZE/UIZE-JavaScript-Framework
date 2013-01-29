/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Performance.ArrayBuildingStyles Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2011-2013 UIZE
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
		The =Uize.Test.Performance.ArrayBuildingStyles= module defines a performance test that compares different approaches to building arrays.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Performance.ArrayBuildingStyles',
	builder:function () {
		'use strict';

		var _totalIterations = 2000000;

		return Uize.Test.declare ({
			title:'Test the performance of different approaches to building arrays',
			test:[
				{
					title:'Build an array by adding elements with the push method',
					test:function () {
						for (var _iterationNo = -1, _elements = []; ++_iterationNo < _totalIterations;)
							_elements.push (_iterationNo)
						;
						return true;
					}
				},
				{
					title:'Build an array by assigning to an element beyond the last element of the array',
					test:function () {
						for (var _iterationNo = -1, _elements = []; ++_iterationNo < _totalIterations;)
							_elements [_iterationNo] = _iterationNo
						;
						return true;
					}
				}
			]
		});
	}
});

