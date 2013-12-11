/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Data.Flatten Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013 UIZE
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
		The =Uize.Test.Uize.Data.Flatten= module defines a suite of unit tests for the =Uize.Data.Flatten= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Data.Flatten',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Uize.Data.Flatten Module Test',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Data.Flatten'),
				Uize.Test.staticMethodsTest ([
					['Uize.Data.Flatten.flatten',[
						['Test that flattening an empty object produces an empty object',
							{},
							{}
						],
						['Test that flattening an already flat object returns an object with the same contents',
							{
								foo:'bar',
								baz:'qux',
								hello:'world',
								'':'empty string key',
								'key.with.periods':'what it says'
							},
							{
								foo:'bar',
								baz:'qux',
								hello:'world',
								'':'empty string key',
								'key.with.periods':'what it says'
							}
						],
						['Test that flattening a hierarchical object using the default pathToKey transformer works correctly',
							{
								foo:'bar',
								baz:{
									qux:42,
									more:{
										hello:'world',
										evenMore:{
											more:['stuff','cowbell']
										}
									}
								},
								apples:'oranges'
							},
							{
								foo:'bar',
								'baz.qux':42,
								'baz.more.hello':'world',
								'baz.more.evenMore.more':['stuff','cowbell'],
								apples:'oranges'
							}
						],
						/*
							- test flattening a hierarchical object using a custom string pathToKey transformer
							- test flattening a hierarchical object using a function pathToKey transformer
							- test flattening a hierarchical object and specifying the value true for the optional inclueNonLeafNodes argument
								- test that leaf node objects are shared references and not clones
							- test when a property value is a non-plain object
								- an object instance
								- a regular expression instance
								- an array
								- a function reference

							- test when a property value is a simple, non-object type
								- null
								- undefined
								- number (0, 42, NaN, Infinity)
								- boolean (false, specifically)
								- string ('', 'foo')

							- Test that flattening an object produces a new object and does not modify the source object
						*/
					]],
					['Uize.Data.Flatten.unflatten',[
						/*
							- test unflattening an empty object
							- test unflattening an already unflattened object
							- test unflattening a flattened object using the default pathToKey transformer, and where the default pathToKey transformer was used for flattening the object
							- test unflattening a flattened object using a custom string pathToKey transformer
							- test unflattening a flattened object using a function pathToKey transformer
							- test unflattening a flattened object and specifying the value true for the optional inclueNonLeafNodes argument
							- test unflattening a flattened object that was flattened using the value true for the optional inclueNonLeafNodes argument (so, an object that contains path repititions)
						*/
					]]
				])
			]
		});
	}
});

