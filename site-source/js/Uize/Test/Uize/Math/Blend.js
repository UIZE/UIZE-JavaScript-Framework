/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Math.Blend Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2016 UIZE
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
		The =Uize.Test.Uize.Math.Blend= module defines a suite of unit tests for the =Uize.Math.Blend= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Math.Blend',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.Math.Blend Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Math.Blend'),
				Uize.Test.staticMethodsTest ([
					['Uize.Math.Blend.blend',[
						/*** test simple blending of numbers ***/
							['When blending two number values, a blend amount of 0 results in the first value being returned',
								[1,6,0],
								1
							],
							['When blending two number values, a blend amount of 1 results in the second value being returned',
								[1,6,1],
								6
							],
							['When blending two number values, a blend amount of .5 results in the average of the two numbers being returned',
								[1,6,.5],
								3.5
							],

						/*** test blending of structured values ***/
							/*** test blending of array values ***/
								{
									title:'When the values being blended are arrays and the blend amount is 0, then a copy of the first array value is returned',
									test:function () {
										var
											_valueA = [0,5,10,15],
											_valueB = [50,40,30,20],
											_blended = Uize.Math.Blend.blend (_valueA,_valueB,0)
										;
										return (
											this.expect (_valueA,_blended) &&
											this.expectNotSameAs (_valueA,_blended) &&
											this.expectNotSameAs (_valueB,_blended)
										);
									}
								},
								{
									title:'When the values being blended are arrays and the blend amount is 1, then a copy of the second array value is returned',
									test:function () {
										var
											_valueA = [0,5,10,15],
											_valueB = [50,40,30,20],
											_blended = Uize.Math.Blend.blend (_valueA,_valueB,1)
										;
										return (
											this.expect (_valueB,_blended) &&
											this.expectNotSameAs (_valueA,_blended) &&
											this.expectNotSameAs (_valueB,_blended)
										);
									}
								},
								{
									title:'When the values being blended are arrays and the blend amount is .5, then the values of corresponding elements of the respective arrays are blended in equal proportions to form a new, averages array',
									test:function () {
										var
											_valueA = [0,5,10,15],
											_valueB = [50,40,30,20],
											_blended = Uize.Math.Blend.blend (_valueA,_valueB,.5)
										;
										return (
											this.expect ([25,22.5,20,17.5],_blended) &&
											this.expectNotSameAs (_valueA,_blended) &&
											this.expectNotSameAs (_valueB,_blended)
										);
									}
								},

							/*** test blending of object values ***/
								{
									title:'When the values being blended are objects and the blend amount is 0, then a copy of the first object value is returned',
									test:function () {
										var
											_valueA = {propA:0,propB:5,propC:10,propD:15},
											_valueB = {propA:50,propB:40,propC:30,propD:20},
											_blended = Uize.Math.Blend.blend (_valueA,_valueB,0)
										;
										return (
											this.expect (_valueA,_blended) &&
											this.expectNotSameAs (_valueA,_blended) &&
											this.expectNotSameAs (_valueB,_blended)
										);
									}
								},
								{
									title:'When the values being blended are objects and the blend amount is 1, then a copy of the second object value is returned',
									test:function () {
										var
											_valueA = {propA:0,propB:5,propC:10,propD:15},
											_valueB = {propA:50,propB:40,propC:30,propD:20},
											_blended = Uize.Math.Blend.blend (_valueA,_valueB,1)
										;
										return (
											this.expect (_valueB,_blended) &&
											this.expectNotSameAs (_valueA,_blended) &&
											this.expectNotSameAs (_valueB,_blended)
										);
									}
								},
								{
									title:'When the values being blended are objects and the blend amount is .5, then the values of corresponding properties of the respective objects are blended in equal proportions to form a new, averages object',
									test:function () {
										var
											_valueA = {propA:0,propB:5,propC:10,propD:15},
											_valueB = {propA:50,propB:40,propC:30,propD:20},
											_blended = Uize.Math.Blend.blend (_valueA,_valueB,.5)
										;
										return (
											this.expect ({propA:25,propB:22.5,propC:20,propD:17.5},_blended) &&
											this.expectNotSameAs (_valueA,_blended) &&
											this.expectNotSameAs (_valueB,_blended)
										);
									}
								},

							/*** test blending of a compound object ***/
								{
									title:'When the values being blended are compound (hierarchical) objects and the blend amount is 0, then a copy of the first object value is returned',
									test:function () {
										var
											_valueA = [[0,{foo:5}],{bar:10,baz:[15]}],
											_valueB = [[50,{foo:40}],{bar:30,baz:[20]}],
											_blended = Uize.Math.Blend.blend (_valueA,_valueB,0)
										;
										return (
											this.expect (_valueA,_blended) &&
											this.expectNotSameAs (_valueA,_blended) &&
											this.expectNotSameAs (_valueB,_blended)
										);
									}
								},
								{
									title:'When the values being blended are compound (hierarchical) objects and the blend amount is 1, then a copy of the second object value is returned',
									test:function () {
										var
											_valueA = [[0,{foo:5}],{bar:10,baz:[15]}],
											_valueB = [[50,{foo:40}],{bar:30,baz:[20]}],
											_blended = Uize.Math.Blend.blend (_valueA,_valueB,1)
										;
										return (
											this.expect (_valueB,_blended) &&
											this.expectNotSameAs (_valueA,_blended) &&
											this.expectNotSameAs (_valueB,_blended)
										);
									}
								},
								{
									title:'When the values being blended are compound (hierarchical) objects and the blend amount is .5, then the values of corresponding leaf nodes of the respective objects are blended in equal proportions to form a new, averages object whose structure matches the structure of the objects being blended',
									test:function () {
										var
											_valueA = [[0,{foo:5}],{bar:10,baz:[15]}],
											_valueB = [[50,{foo:40}],{bar:30,baz:[20]}],
											_blended = Uize.Math.Blend.blend (_valueA,_valueB,.5)
										;
										return (
											this.expect ([[25,{foo:22.5}],{bar:20,baz:[17.5]}],_blended) &&
											this.expectNotSameAs (_valueA,_blended) &&
											this.expectNotSameAs (_valueB,_blended)
										);
									}
								},

						/*** test that quantization is supported correctly ***/
							['The quantization interval is relative to the first of the two values being blended',
								[0,10,.5,3],
								6
							],
							['When the blend amount is 1, the second of the two values being blended is returned, even if the value doesn\'t fall exactly on a quantization interval',
								[0,10,1,3],
								10
							],
							['When the value 0 is specified for quantization, then there is effectively no quantization applied',
								[0,10,.03125,0],
								.3125
							],
							['When the value null is specified for quantization, then there is effectively no quantization applied',
								[0,10,.03125,null],
								.3125
							],
							['When the value undefined is specified for quantization, then there is effectively no quantization applied',
								[0,10,.03125,undefined],
								.3125
							],
							/*
								- test that quantization always rounds "up" to the nearest quantization intercal away from the first value, regardless of the whether the second number is greater than or less than the first number
							*/
							{
								title:'When the value Infinity is specified for quantization, then the first of the two values being blended will be returned for any blend amounts from 0 up to, but not including, 1',
								test:function () {
									var m = this;
									function _case (_blendAmount,_expected) {
										return m.expect (_expected,Uize.Math.Blend.blend (0,10,_blendAmount,Infinity));
									}
									return (
										_case (0,0) &&
										_case (.25,0) &&
										_case (.49,0) &&
										_case (.5,0) &&
										_case (.75,0) &&
										_case (1,10)
									);
								}
							},
							{
								title:'When the quantization value is between .5 and 1 (non-inclusive) times the difference between the two values being blended, then quantization is applied correctly',
								test:function () {
									var m = this;
									function _case (_blendAmount,_expected) {
										return m.expect (_expected,Uize.Math.Blend.blend (0,10,_blendAmount,6));
									}
									return (
										_case (0,0) &&
										_case (.29,0) &&
										_case (.3,6) &&
										_case (.5,6) &&
										_case (.8999,6) &&
										_case (.9,10) &&
										_case (1,10)
									);
								}
							},
							{
								title:'When the quantization value is between 1 and 2 times the difference between the two values being blended, then quantization is applied correctly',
								test:function () {
									var m = this;
									function _case (_blendAmount,_expected) {
										return m.expect (_expected,Uize.Math.Blend.blend (0,10,_blendAmount,14));
									}
									return (
										_case (0,0) &&
										_case (.69999,0) &&
										_case (.7,10) &&
										_case (.9999,10) &&
										_case (1,10)
									);
								}
							},
							{
								title:'When the quantization value is 2 or more times the difference between the two values being blended, then quantization is applied correctly',
								test:function () {
									var m = this;
									function _case (_blendAmount,_expected) {
										return m.expect (_expected,Uize.Math.Blend.blend (0,10,_blendAmount,20));
									}
									return (
										_case (0,0) &&
										_case (.3,0) &&
										_case (.5,0) &&
										_case (.9999,0) &&
										_case (1,10)
									);
								}
							},
							{
								title:'A negative value for quantization behaves in the same way as a positive value',
								test:function () {
									var m = this;
									function _case (_blendAmount,_expected) {
										return m.expect (_expected,Uize.Math.Blend.blend (0,10,_blendAmount,4));
									}
									return (
										_case (0,0) &&
										_case (.1999,0) &&
										_case (.2,4) &&
										_case (.55999,4) &&
										_case (.6,8) &&
										_case (.999,8) &&
										_case (1,10)
									);
								}
							},
							{
								title:'When the values being blended are compound (hierarchical) objects, the quantization value is applied for blending values of all leaf nodes',
								test:function () {
									var
										_valueA = [[0,{foo:5}],{bar:10,baz:[15]}],
										_valueB = [[50,{foo:40}],{bar:30,baz:[20]}],
										_blended = Uize.Math.Blend.blend (_valueA,_valueB,.5,3)
									;
									return (
										this.expect ([[24,{foo:23}],{bar:19,baz:[18]}],_blended) &&
										this.expectNotSameAs (_valueA,_blended) &&
										this.expectNotSameAs (_valueB,_blended)
									);
								}
							},
							{
								title:'A compound (hierarchical) quantization object can be specified to match the structure or the objects being blended and to specify different quantizations for different leaf nodes',
								test:function () {
									var
										_valueA = [[0,{foo:5}],{bar:10,baz:[15]}],
										_valueB = [[50,{foo:40}],{bar:30,baz:[20]}],
										_blended = Uize.Math.Blend.blend (_valueA,_valueB,.5,[[3,{foo:4}],{bar:6,baz:[2]}])
									;
									return (
										this.expect ([[24,{foo:21}],{bar:22,baz:[17]}],_blended) &&
										this.expectNotSameAs (_valueA,_blended) &&
										this.expectNotSameAs (_valueB,_blended)
									);
								}
							},
							{
								title:'When a quantization number is specified at a node of a compound (hierarchical) quantization object, then the quantization number applies to all corresponding deeper nodes in the compound values being blended',
								test:function () {
									var
										_valueA = {foo:[0,5],bar:[{baz:10},15]},
										_valueB = {foo:[50,40],bar:[{baz:30},20]},
										_blended = Uize.Math.Blend.blend (_valueA,_valueB,.5,{foo:3,bar:4})
									;
									return (
										this.expect ({foo:[24,23],bar:[{baz:22},19]},_blended) &&
										this.expectNotSameAs (_valueA,_blended) &&
										this.expectNotSameAs (_valueB,_blended)
									);
								}
							},

						/*** test that curve functions are supported correctly ***/
							['A custom curve function is applied when the values being blended are numbers',
								[0,10,.5,0,function (_value) {return _value * _value}],
								2.5
							],
							['A custom curve function is applied when the values being blended are compound (hierarchical) objects, and the quantization value is applied for blending values of all leaf nodes',
								[
									[[0,{foo:5}],{bar:10,baz:[15]}],
									[[50,{foo:40}],{bar:30,baz:[20]}],
									.5,
									0,
									function (_value) {return _value * _value}
								],
								[[12.5,{foo:13.75}],{bar:15,baz:[16.25]}]
							],
							['A compound (hierarchical) curve function object can be specified to match the structure or the objects being blended and to specify different curve functions for different leaf nodes',
								[
									[[0,{foo:5}],{bar:10,baz:[15]}],
									[[50,{foo:40}],{bar:30,baz:[20]}],
									.5,
									0,
									[
										[
											function (_value) {return Math.pow (_value,2)},
											{foo:function (_value) {return Math.pow (_value,3)}}
										],
										{
											bar:function (_value) {return Math.pow (_value,4)},
											baz:[function (_value) {return Math.pow (_value,5)}]
										}
									]
								],
								[[12.5,{foo:9.375}],{bar:11.25,baz:[15.15625]}]
							],
							[
								'When a curve function is specified at a node of a compound (hierarchical) curve function object, then the curve function applies to all corresponding deeper nodes in the compound values being blended',
								[
									{foo:[0,5],bar:[{baz:10},15]},
									{foo:[50,40],bar:[{baz:30},20]},
									.5,
									0,
									{
										foo:function (_value) {return Math.pow (_value,2)},
										bar:function (_value) {return Math.pow (_value,4)}
									}
								],
								{foo:[12.5,13.75],bar:[{baz:11.25},15.3125]}
							],

						/*** test that the optional previousValue and valuesUnchanged arguments are supported correctly ***/
							{
								title:'When the optional previousValue argument is specified and the resulting blended value is identical to the specified previous value, then the value of the valuesUnchanged argument is returned',
								test:function () {
									var _valuesUnchanged = {};
									return this.expectSameAs (
										_valuesUnchanged,
										Uize.Math.Blend.blend (
											[[0,{foo:5}],{bar:10,baz:[15]}],
											[[50,{foo:40}],{bar:30,baz:[20]}],
											.5,
											0,
											null,
											[[25,{foo:22.5}],{bar:20,baz:[17.5]}],
											_valuesUnchanged
										)
									);
								}
							},
							{
								title:'When the optional previousValue argument is specified and the resulting blended value is not identical to the specified previous value, then the new blended value is returned and not the value of the valuesUnchanged argument',
								test:function () {
									var
										_valuesUnchanged = {},
										_blendResult = Uize.Math.Blend.blend (
											[[0,{foo:5}],{bar:10,baz:[15]}],
											[[50,{foo:40}],{bar:30,baz:[20]}],
											.6,
											0,
											null,
											[[25,{foo:22.5}],{bar:20,baz:[17.5]}],
											_valuesUnchanged
										)
									;
									return (
										this.expectNotSameAs (_valuesUnchanged,_blendResult) &&
										this.expect ([[30,{foo:26}],{bar:22,baz:[18]}],_blendResult)
									);
								}
							},

						/*** miscellaneous tests ***/
							{
								title:'When both of the two values being blended are references to the same object, then a copy of that object is returned and not a reference to the object itself',
								test:function () {
									var
										_valueA = [[0,{foo:5}],{bar:10,baz:[15]}],
										_valueB = _valueA,
										_blendResult = Uize.Math.Blend.blend (_valueA,_valueB,.5)
									;
									return this.expectNotSameAs (_valueA,_blendResult) && this.expect (_valueA,_blendResult);
								}
							}
					]]
				])
			]
		});
	}
});

