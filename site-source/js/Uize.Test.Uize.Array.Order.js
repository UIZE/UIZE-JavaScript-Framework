/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Array.Order Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2013 UIZE
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
		The =Uize.Test.Uize.Array.Order= module defines a suite of unit tests for the =Uize.Array.Order= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Array.Order',
	required:'Uize.Test.Uize',
	builder:function () {
		'use strict';

		function _arrayMethodTargetTest (_methodName,_sourceArrayContents,_expectedTargetArrayContents) {
			return Uize.Test.Uize.arrayMethodTargetTest (
				'Uize.Array.Order',
				_methodName,
				_sourceArrayContents,
				_expectedTargetArrayContents
			);
		}

		return Uize.Test.declare ({
			title:'Uize.Array.Order Module Test',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Array.Order'),
				Uize.Test.staticMethodsTest ([
					['Uize.Array.Order.jumble',[
						['Test that jumbling an empty array produces an empty array',[[]],[]],
						['Test that jumbling an array with only one element returns that same array',[[1]],[1]],
						{
							title:'Test that jumbling an array with multiple unique values produces an array of the same length containing all those unique values',
							test:function () {
								var
									_elements = [1,2,3,4,5,6,7,8,9],
									_elementsLength = _elements.length,
									_jumbledArray = Uize.Array.Order.jumble (_elements),
									_result = _jumbledArray.length == _elementsLength,
									_jumbledArrayLookup = Uize.lookup (_jumbledArray)
								;
								for (var _elementNo = -1; _result && ++_elementNo < _elementsLength;)
									_result = _jumbledArrayLookup [_elements [_elementNo]]
								;
								return _result;
							}
						},
						_arrayMethodTargetTest ('jumble',[],[])
					]],
					['Uize.Array.Order.reverse',[
						['Test that reversing an empty array produces an empty array',[[]],[]],
						['Test that reversing an array with only one element returns that same array',[[1]],[1]],
						['Test that reversing an array with an even number of elements is handled correctly',
							[[1,2,3,4]],
							[4,3,2,1]
						],
						['Test that reversing an array with an odd number of elements is handled correctly',
							[[1,2,3,4,5]],
							[5,4,3,2,1]
						],
						_arrayMethodTargetTest ('reverse',[1,2,3,4,5],[5,4,3,2,1])
					]],
					['Uize.Array.Order.insideOut',[
						['Test that reordering an empty array from inside to out produces an empty array',
							[[]],
							[]
						],
						['Test that reordering an array with only one element from inside to out returns that same array',
							[[1]],
							[1]
						],
						['Test that reordering an array with an even number of elements from inside to out is handled correctly',
							[[1,2,3,4,5,6]],
							[3,4,2,5,1,6]
						],
						['Test that reordering an array with an odd number of elements from inside to out is handled correctly',
							[[1,2,3,4,5,6,7]],
							[4,3,5,2,6,1,7]
						],
						_arrayMethodTargetTest ('insideOut',[1,2,3,4,5,6,7],[4,3,5,2,6,1,7])
					]],
					['Uize.Array.Order.outsideIn',[
						['Test that reordering an empty array from outside to in produces an empty array',
							[[]],
							[]
						],
						['Test that reordering an array with only one element from outside to in returns that same array',
							[[1]],
							[1]
						],
						['Test that reordering an array with an even number of elements from outside to in is handled correctly',
							[[1,2,3,4,5,6]],
							[1,6,2,5,3,4]
						],
						['Test that reordering an array with an odd number of elements from outside to in is handled correctly',
							[[1,2,3,4,5,6,7]],
							[1,7,2,6,3,5,4]
						],
						_arrayMethodTargetTest ('outsideIn',[1,2,3,4,5,6,7],[1,7,2,6,3,5,4])
					]],
					['Uize.Array.Order.reorder',[
						/*** test 'jumbled' reordering mode ***/
							['Test that \'jumbled\' option with empty array returns empty array',[[],'jumbled'],[]],
							['Test that \'jumbled\' option with one element array returns that same array',
								[[1],'jumbled'],
								[1]
							],

						/*** test 'reverse' reordering mode ***/
							['Test that \'reverse\' option with empty array returns empty array',[[],'reverse'],[]],
							['Test that \'reverse\' option with one element array returns that same array',
								[[1],'reverse'],
								[1]
							],
							['Test that \'reverse\' option with even elements array works correctly',
								[[1,2,3,4],'reverse'],
								[4,3,2,1]
							],
							['Test that \'reverse\' option with odd elements array works correctly',
								[[1,2,3,4,5],'reverse'],
								[5,4,3,2,1]
							],

						/*** test 'inside out' reordering mode ***/
							['Test that \'inside out\' option with empty array returns empty array',
								[[],'inside out'],
								[]
							],
							['Test that \'inside out\' option with one element array returns that same array',
								[[1],'inside out'],
								[1]
							],
							['Test that \'inside out\' option with even elements array works correctly',
								[[1,2,3,4,5,6],'inside out'],
								[3,4,2,5,1,6]
							],
							['Test that \'inside out\' option with odd elements array works correctly',
								[[1,2,3,4,5,6,7],'inside out'],
								[4,3,5,2,6,1,7]
							],

						/*** test 'outside in' reordering mode ***/
							['Test that \'outside in\' option with empty array returns empty array',
								[[],'outside in'],
								[]
							],
							['Test that \'outside in\' option with one element array returns that same array',
								[[1],'outside in'],
								[1]
							],

						/*** test 'normal' reordering mode ***/
							['Test that \'normal\' option with empty array returns empty array',[[],'normal'],[]],
							['Test that \'normal\' option with one element array returns that same array',[[1],'normal'],[1]]
					]]
				])
			]
		});
	}
});

