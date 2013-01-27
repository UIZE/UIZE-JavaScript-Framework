/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Array.Sort Class
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
		The =Uize.Test.Uize.Array.Sort= module defines a suite of unit tests for the =Uize.Array.Sort= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Array.Sort',
	builder:function () {
		'use strict';

		return Uize.Test.declare ({
			title:'Uize.Array.Sort Module Test',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Array.Sort'),
				Uize.Test.staticMethodsTest ([
					['Uize.Array.Sort.sortBy',
						[
							['Test that sorting an empty array produces an empty array',
								[[]],
								[]
							],
							['Test that sorting an array with only one element returns that same array',
								[[1]],
								[1]
							],
							/*** test default ascending sort ***/
								['Test that sorting an array of numbers without specifying a sort value mapper will sort the numbers in ascending order',
									[[10,4,2,5.6,-3.222,0]],
									[-3.222,0,2,4,5.6,10]
								],
								['Test that sorting an array of strings without specifying a sort value mapper will sort the strings in ascending ASCIIbetical order',
									[['paul','Deborah','ANDREW','15','DEBEORAH','andrew','...','jack']],
									['...','15','ANDREW','DEBEORAH','Deborah','andrew','jack','paul']
								],

							/*** test null or undefined as the sort value mapper ***/
								['Test that specifying the value undefined for the sort value mapper results in a simple ascending order sort',
									[[10,4,2,5.6,-3.222,0]],
									[-3.222,0,2,4,5.6,10]
								],
								['Test that specifying the value null for the sort value mapper results in a simple ascending order sort',
									[[10,4,2,5.6,-3.222,0]],
									[-3.222,0,2,4,5.6,10]
								],

							/*** test support for sort value mapper expression ***/
								['Test that specifying a string value for sort value mapper results in that string being treated as a sort value mapper expression, in which context the identifier "value" can be used to access the value for an element',
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
								['Test that a string sort value mapper expression can use the identifier "key" in order to form mapped values using the indexes of elements',
									[[1,2,3,4,5,6,7],'100 - key'],
									[7,6,5,4,3,2,1]
								],

							/*** test support for sort column number ***/
								['Test that specifying a number value for sort value mapper results in a sort by element number for an array of arrays',
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
								['Test that specifying the value 1 for the optional orderINT parameter produces an ascending order sort',
									[[10,4,2,5.6,-3.222,0],null,1],
									[-3.222,0,2,4,5.6,10]
								],
								['Test that specifying the value 0 for the optional orderINT parameter produces an ascending order sort',
									[[10,4,2,5.6,-3.222,0],null,0],
									[-3.222,0,2,4,5.6,10]
								],
								['Test that specifying the value null for the optional orderINT parameter produces an ascending order sort',
									[[10,4,2,5.6,-3.222,0],null,null],
									[-3.222,0,2,4,5.6,10]
								],
								['Test that specifying the value undefined for the optional orderINT parameter produces an ascending order sort',
									[[10,4,2,5.6,-3.222,0],null,undefined],
									[-3.222,0,2,4,5.6,10]
								],
								['Test that specifying the value -1 for the optional orderINT parameter produces a descending order sort',
									[[10,4,2,5.6,-3.222,0],null,-1],
									[10,5.6,4,2,0,-3.222]
								],

							/*** test support for value mapper function ***/
								['Test that specifying a sort value mapper function is handled correctly',
									[
										['paul','Dian','DEBEORAH','andrew','jaCK'],
										function (value) {return value.toLowerCase ()}
									],
									['andrew','DEBEORAH','Dian','jaCK','paul']
								],
								['Test that a sort value mapper function can use the optional second parameter in order to form mapped values using the indexes of elements',
									[[1,2,3,4,5,6,7],function (value,key) {return 100 - key}],
									[7,6,5,4,3,2,1]
								],

							/*** test that source array is modified ***/
								{
									title:'Test that sorting an array modifies the source array and does not create a new array for the case of no sort value mapper',
									test:function () {
										var _sourceArray = ['paul','Dian','DEBEORAH','andrew','jaCK'];
										return this.expect (true,_sourceArray == Uize.Array.Sort.sortBy (_sourceArray));
									}
								},
								{
									title:'Test that sorting an array modifies the source array and does not create a new array for the case of specifying a sort value mapper function',
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
					]
				])
			]
		});
	}
});

