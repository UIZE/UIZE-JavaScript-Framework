/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Performance.ArrayIterationStyles Class
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
		The =Uize.Test.Performance.ArrayIterationStyles= module defines a performance test that compares different approaches to iterating over the elements of an array.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Performance.ArrayIterationStyles',
	builder:function () {
		'use strict';

		var
			_elementsLength = 500000,
			_elements = []
		;
		for (var _elementNo = -1; ++_elementNo < _elementsLength;)
			_elements [_elementNo] = _elementNo
		;

		return Uize.Test.declare ({
			title:'Test the performance of different approaches to iterating over the elements of an array',
			test:[
				{
					title:'Iterate over the elements of an array using a simple counter style for loop',
					test:function () {
						for (var _elementNo = -1; ++_elementNo < _elementsLength;)
							// do nothing (because it's so much fun to do)
						;
						return true;
					}
				},
				{
					title:'Iterate over the elements of an array using a for...in loop',
					test:function () {
						for (_elementNo in _elements)
							// do nothing (because it's so much fun to do)
						;
						return true;
					}
				}
			]
		});
	}
});

