/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Array.Sort Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2016 UIZE
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
		The =Uize.Test.Uize.Array.Sort= module defines a suite of unit tests for the =Uize.Array.Sort= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Array.Sort',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Uize.Array.Sort Module Test',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Array.Sort'),
				Uize.Test.staticMethodsTest ([
					['Uize.Array.Sort.sortBy',
						[
							['Sorting an empty array produces an empty array',
								[[]],
								[]
							],
							['Sorting an array with only one element returns that same array',
								[[1]],
								[1]
							],
							/*** test default ascending sort ***/
								['Sorting an array of numbers without specifying a sort value mapper will sort the numbers in ascending order',
									[[10,4,2,5.6,-3.222,0]],
									[-3.222,0,2,4,5.6,10]
								],
								['Sorting an array of strings without specifying a sort value mapper will sort the strings in ascending ASCIIbetical order',
									[['paul','Deborah','ANDREW','15','DEBEORAH','andrew','...','jack']],
									['...','15','ANDREW','DEBEORAH','Deborah','andrew','jack','paul']
								],

							/*** test null or undefined as the sort value mapper ***/
								['Specifying the value undefined for the sort value mapper results in a simple ascending order sort',
									[[10,4,2,5.6,-3.222,0]],
									[-3.222,0,2,4,5.6,10]
								],
								['Specifying the value null for the sort value mapper results in a simple ascending order sort',
									[[10,4,2,5.6,-3.222,0]],
									[-3.222,0,2,4,5.6,10]
								],

							/*** test support for sort value mapper expression ***/
								['Specifying a string value for sort value mapper results in that string being treated as a sort value mapper expression, in which context the identifier "value" can be used to access the value for an element',
									[
										[
											{firstName:'paul'},
											{firstName:'Deborah'},
											{firstName:'ANDREW'},
											{firstName:'DEBEORAH'},
											{firstName:'andrew'}
										],
										'value.firstName'
									],
									[
										{firstName:'ANDREW'},
										{firstName:'DEBEORAH'},
										{firstName:'Deborah'},
										{firstName:'andrew'},
										{firstName:'paul'}
									]
								],
								['A string sort value mapper expression can use the identifier "key" in order to form mapped values using the indexes of elements',
									[[1,2,3,4,5,6,7],'100 - key'],
									[7,6,5,4,3,2,1]
								],

							/*** test support for sort column number ***/
								['Specifying a number value for sort value mapper results in a sort by element number for an array of arrays',
									[
										[
											['Mac Book Pro 17"',2299],
											['Mac Book Pro 15"',1799],
											['Mac Book Pro 13"',1199]
										],
										1
									],
									[
										['Mac Book Pro 13"',1199],
										['Mac Book Pro 15"',1799],
										['Mac Book Pro 17"',2299]
									]
								],

							/*** test support for orderINT parameter ***/
								['Specifying the value 1 for the optional orderINT parameter produces an ascending order sort',
									[[10,4,2,5.6,-3.222,0],null,1],
									[-3.222,0,2,4,5.6,10]
								],
								['Specifying the value 0 for the optional orderINT parameter produces an ascending order sort',
									[[10,4,2,5.6,-3.222,0],null,0],
									[-3.222,0,2,4,5.6,10]
								],
								['Specifying the value null for the optional orderINT parameter produces an ascending order sort',
									[[10,4,2,5.6,-3.222,0],null,null],
									[-3.222,0,2,4,5.6,10]
								],
								['Specifying the value undefined for the optional orderINT parameter produces an ascending order sort',
									[[10,4,2,5.6,-3.222,0],null,undefined],
									[-3.222,0,2,4,5.6,10]
								],
								['Specifying the value -1 for the optional orderINT parameter produces a descending order sort',
									[[10,4,2,5.6,-3.222,0],null,-1],
									[10,5.6,4,2,0,-3.222]
								],

							/*** test support for value mapper function ***/
								['When a sort value mapper function is specified, the values it returns are used to determine the order of elements in the sorted array',
									[
										['paul','Dian','DEBEORAH','andrew','jaCK'],
										function (value) {return value.toLowerCase ()}
									],
									['andrew','DEBEORAH','Dian','jaCK','paul']
								],
								['A sort value mapper function can use the optional second parameter in order to form mapped values using the indexes of elements',
									[[1,2,3,4,5,6,7],function (value,key) {return 100 - key}],
									[7,6,5,4,3,2,1]
								],

							/*** test that source array is modified ***/
								{
									title:'Sorting an array modifies the source array and does not create a new array for the case of no sort value mapper',
									test:function () {
										var _sourceArray = ['paul','Dian','DEBEORAH','andrew','jaCK'];
										return this.expect (true,_sourceArray == Uize.Array.Sort.sortBy (_sourceArray));
									}
								},
								{
									title:'Sorting an array modifies the source array and does not create a new array for the case of specifying a sort value mapper function',
									test:function () {
										var _sourceArray = ['paul','Dian','DEBEORAH','andrew','jaCK'];
										return this.expect (
											true,
											_sourceArray == Uize.Array.Sort.sortBy (
												_sourceArray,function (value) {return value.toLowerCase ()}
											)
										);
									}
								}
						],
						null,
						{cloneArguments:true}
					],
					['Uize.Array.Sort.spread',
						[
							['Spreading an empty array produces an empty array',
								[[]],
								[]
							],
							['Spreading an array with only one element returns that same array',
								[[1]],
								[1]
							],
							['When the source array contains only a single minimum value element, then that element will be positioned in the center of the spread array',
								[[9,9,9,9,9,9,9,9,1]],
								[9,9,9,9,1,9,9,9,9]
							],
							['When the source array contains elements having three different values, those values are distributed evenly in the spread array, starting with the lowest value in the center',
								[[9,9,9,9,9,9,9,9,1,2,2]],
								[9,9,2,9,9,1,9,9,2,9,9]
							],
							['When the source array contains elements having four different values, those values are distributed evenly in the spread array, starting with the lowest value in the center',
								[[9,9,9,9,9,9,9,9,1,2,2,3,3,3,3]],
								[9,3,9,2,9,3,9,1,9,3,9,2,9,3,9]
							],

							/*** test the reverse order ***/
								['When the value -1 is specified for the optional orderINT parameter and the source array contains only a single maximum value element, then that element will be positioned in the center of the spread array',
									[[1,1,1,1,1,1,1,1,9],null,-1],
									[1,1,1,1,9,1,1,1,1]
								],
								['When the value -1 is specified for the optional orderINT parameter and the source array contains three different values, those values are distributed evenly in the spread array, starting with the highest value in the center',
									[[1,1,1,1,1,1,1,1,9,8,8],null,-1],
									[1,1,8,1,1,9,1,1,8,1,1]
								],
								['When the value -1 is specified for the optional orderINT parameter and the source array contains four different values, those values are distributed evenly in the spread array, starting with the highest value in the center',
									[[1,1,1,1,1,1,1,1,9,8,8,7,7,7,7],null,-1],
									[1,7,1,8,1,7,1,9,1,7,1,8,1,7,1]
								],
								['When the value -1 is specified for the optional orderINT parameter and the source array contains a mix of different values, those values are distributed evenly in the spread array, starting with the highest value in the center',
									[[1,1,1,1,1,2,2,2,3,3,4,4,4,4,5,5,6,7,7,7,7,7,7,8,9,9],null,-1],
									[4,7,1,7,2,5,9,3,6,1,7,1,4,9,3,7,1,7,2,4,8,2,5,7,1,4]
								],

							/*** miscellaneous tests ***/
								['When all elements of the source array have different values, those values are distributed evenly in the spread array, starting with the lowest value in the center',
									[[1,2,3,4,5,6,7,8,9]],
									[8,4,2,6,1,9,5,3,7]
								],
								['When the source array contains a mix of different values, those values are distributed evenly in the spread array, starting with the lowest value in the center',
									[[1,1,1,1,1,2,2,2,3,3,4,4,4,4,5,5,6,7,7,7,7,7,7,8,9,9]],
									[5,2,8,1,7,4,1,7,3,9,2,7,4,1,6,3,9,1,7,4,1,7,4,2,7,5]
								],
								['When all elements of the source array have the same value, then spreading the array will have no effect',
									[[1,1,1,1,1,1,1,1,1]],
									[1,1,1,1,1,1,1,1,1]
								],
								['An optional value mapper can be specified for generating the values by which the array should be spread',
									[[{a:9},{a:9},{a:9},{a:9},{a:9},{a:9},{a:9},{a:9},{a:1},{a:2},{a:2}],'value.a'],
									[{a:9},{a:9},{a:2},{a:9},{a:9},{a:1},{a:9},{a:9},{a:2},{a:9},{a:9}]
								]
						],
						null,
						{cloneArguments:true}
					]
				])
			]
		});
	}
});

