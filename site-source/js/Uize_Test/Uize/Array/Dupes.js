/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Array.Dupes Class
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
		The =Uize.Test.Uize.Array.Dupes= module defines a suite of unit tests for the =Uize.Array.Dupes= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Array.Dupes',
	builder:function () {
		'use strict';

		var
			_objectA = {},
			_objectB = {},
			_objectC = {},
			_arrayA = [],
			_arrayB = [],
			_arrayC = [],
			_functionA = function () {},
			_functionB = function () {},
			_functionC = function () {}
		;
		return Uize.Test.declare ({
			title:'Uize.Array.Dupes Module Test',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Array.Dupes'),
				Uize.Test.staticMethodsTest ([
					['Uize.Array.Dupes.dedupe',
						[
							/*** test that duplicates are removed correctly, for each possible value type ***/
								['Test that multiple duplicate number values are removed, and that non-duplicate values are not removed',
									[[1,2,NaN,1,1,2,2,NaN,NaN,Infinity]],
									[1,2,NaN,Infinity]
								],
								['Test that multiple duplicate string values are removed, and that non-duplicate values are not removed',
									[['foo','bar','foo','foo','bar','bar','hello']],
									['foo','bar','hello']
								],
								['Test that multiple duplicate boolean values are removed, and that non-duplicate values are not removed',
									[[false,false,false,true]],
									[false,true]
								],
								['Test that multiple duplicate undefined values are removed',
									[[undefined,undefined,undefined]],
									[undefined]
								],
								['Test that multiple duplicate undefined values are removed',
									[[null,null,null]],
									[null]
								],

							/*** test support for object type values ***/
								{
									title:'Test that multiple duplicate object values are removed, and that non-duplicate values are not removed',
									test:function () {
										return this.expect (
											[_objectA,_objectB,_objectC],
											Uize.Array.Dupes.dedupe (
												[_objectA,_objectB,_objectA,_objectA,_objectB,_objectB,_objectC]
											)
										);
									}
								},
								{
									title:'Test that multiple duplicate array values are removed, and that non-duplicate values are not removed',
									test:function () {
										return this.expect (
											[_arrayA,_arrayB,_arrayC],
											Uize.Array.Dupes.dedupe (
												[_arrayA,_arrayB,_arrayA,_arrayA,_arrayB,_arrayB,_arrayC]
											)
										);
									}
								},
								{
									title:'Test that multiple duplicate function values are removed, and that non-duplicate values are not removed',
									test:function () {
										return this.expect (
											[_functionA,_functionB,_functionC],
											Uize.Array.Dupes.dedupe (
												[_functionA,_functionB,_functionA,_functionA,_functionB,_functionB,_functionC]
											)
										);
									}
								},
								{
									title:'Test that all value types can be present in the source array and duplicates of each type are removed correctly',
									test:function () {
										return this.expect (
											[undefined,null,NaN,1,true,'foo',_objectA,_arrayA,_functionA],
											Uize.Array.Dupes.dedupe (
												[
													undefined,undefined,undefined,
													null,null,null,
													NaN,NaN,NaN,
													1,1,1,
													true,true,true,
													'foo','foo','foo',
													_objectA,_objectA,_objectA,
													_arrayA,_arrayA,_arrayA,
													_functionA,_functionA,_functionA
												]
											)
										);
									}
								},

							/*** test that type is taken into account when determining if values are duplicates ***/
								['Test that string serializations of number values are not considered duplicates of those number values',
									[[1,'1',-1,'-1',NaN,'NaN',Infinity,'Infinity']],
									[1,'1',-1,'-1',NaN,'NaN',Infinity,'Infinity']
								],
								['Test that string serializations of boolean values are not considered duplicates of those boolean values',
									[[false,'false',true,'true']],
									[false,'false',true,'true']
								],
								['Test that strings serializations of the values null and undefined are not considered duplicates of those values',
									[[null,'null',undefined,'undefined']],
									[null,'null',undefined,'undefined']
								],
							/*
								- test optional target parameter
							*/

							/*** test optional canonicalizer parameter ***/
								['Test that the optional canonicalizer parameter is observed correctly',
									[
										['hello','world','Hello','HELLO','World','WORLD','foo'],
										function (_value) {return _value.toLowerCase ()}
									],
									['hello','world','foo']
								]
						],
						null,
						{cloneArguments:true}
					],
					['Uize.Array.Dupes.removeValues',[
						{
							title:'',
							test:function () {
								var
									_source = [
										2,1,2,
										true,false,true,
										'bye','hi','bye',
										_objectB,_objectA,_objectB,
										_arrayB,_arrayA,_arrayB,
										_functionB,_functionA,_functionB,
										null,null,null,
										undefined,undefined,undefined
									],
									_result = Uize.Array.Dupes.removeValues (
										_source,
										[2,true,'bye',_objectB,_arrayB,_functionB,null,undefined]
									)
								;
								return (
									this.expect (6,_result.length) &&
									this.expect (1,_result [0]) &&
									this.expect (false,_result [1]) &&
									this.expect ('hi',_result [2]) &&
									this.expectSameAs (_objectA,_result [3]) &&
									this.expectSameAs (_arrayA,_result [4]) &&
									this.expectSameAs (_functionA,_result [5])
								);
							}
						}
					]]
				])
			]
		});
	}
});

