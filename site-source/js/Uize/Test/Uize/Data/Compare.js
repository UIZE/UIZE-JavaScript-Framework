/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Data.Compare Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 5
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Data.Compare= module defines a suite of unit tests for the =Uize.Data.Compare= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Data.Compare',
	required:'Uize.Test',
	builder:function () {
		'use strict';

		var
			_identicalTestObjectA = {
				aString:'blah',
				anArray:[1,2,3]
			},
			_identicalTestObjectB = {
				aString:'blah',
				anArray:[1,2,3]
			}
		;

		return Uize.Test.resolve ({
			title:'Test for Uize.Data.Compare Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Data.Compare'),
				Uize.Test.staticMethodsTest ([
					['Uize.Data.Compare.identical',[
						['Test that calling with no parameters returns true',
							[],
							true
						],
						['Test that equality option defaults to strict',
							['1',1],
							false
						],
						/*** test for identical ***/
							/*** test for identical, simple type values with identical values ***/
								['Test that two identical numbers are identical',
									[1,1],
									true
								],
								['Test that two identical booleans are identical',
									[true,true],
									true
								],
								['Test that two identical strings are identical',
									['foo','foo'],
									true
								],
								['Test that null is identical to null',
									[null,null],
									true
								],
								['Test that NaN is identical to NaN',
									[NaN,NaN],
									true
								],
								['Test that undefined is identical to undefined',
									[undefined,undefined],
									true
								],

							/*** test for identical, simple type values with different values ***/
								['Test that two different numbers are not identical',
									[1,2],
									false
								],
								['Test that two different booleans are not identical',
									[true,false],
									false
								],
								['Test that two different strings are not identical',
									['foo','bar'],
									false
								],
								['Test that null is not identical to undefined',
									[null,undefined],
									false
								],
								['Test that NaN is not identical to 0',
									[NaN,0],
									false
								],

							/*** test for identical, two instances of the same object with identical values ***/
								['Test that two different Date object instances with the same value are identical',
									[new Date (2001,8,11),new Date (2001,8,11)],
									true
								],
								['Test that two different String object instances with the same value are identical',
									[new String ('foo'),new String ('foo')],
									true
								],
								['Test that two different Number object instances with the same value are identical',
									[new Number (1),new Number (1)],
									true
								],
								['Test that two different Boolean object instances with the same value are identical',
									[new Boolean (false),new Boolean (false)],
									true
								],
								['Test that two different RegExp object instances with the same value are identical',
									[new RegExp ('^foo$','gi'),new RegExp ('^foo$','gi')],
									true
								],

							/*** test for identical, two instances of the same object but with differing values ***/
								['Test that two different Date object instances with different values are not identical',
									[new Date (2001,8,11),new Date (2001,8,12)],
									false
								],
								['Test that two different String object instances with different values are not identical',
									[new String ('foo'),new String ('bar')],
									false
								],
								['Test that two different Number object instances with different values are not identical',
									[new Number (1),new Number (2)],
									false
								],
								['Test that two different Boolean object instances with different values are not identical',
									[new Boolean (false),new Boolean (true)],
									false
								],
								['Test that two different RegExp object instances with different values are not identical',
									[new RegExp ('^foo$'),new RegExp ('^bar$')],
									false
								],
								['Test that two different RegExp object instances that are only different in their options are not identical',
									[new RegExp ('^foo$','g'),new RegExp ('^foo$','i')],
									false
								],

							/*** test for identical, two instances of different objects but with identical valueOf values ***/
								['Test that a Date object instance is not identical to a Number object instance whose value is the Date instance\'s time in milliseconds',
									[new Date (2001,8,11),new Number (new Date (2001,8,11))],
									false
								],

						/*** test for loose equality ***/
							/*** test for loose equality, simple type values of different type but equivalent value ***/
								['Test that the number 1 and the string \'1\' are identical, according to loose equality',
									[1,'1',{equality:'loose'}],
									true
								],
								['Test that the number 1 and the boolean true are identical, according to loose equality',
									[1,true,{equality:'loose'}],
									true
								],
								['Test that the number 0 and the boolean false are identical, according to loose equality',
									[0,false,{equality:'loose'}],
									true
								],
								['Test that the number 0 and an empty string are identical, according to loose equality',
									[0,'',{equality:'loose'}],
									true
								],
								['Test that the boolean false and an empty string are identical, according to loose equality',
									[false,'',{equality:'loose'}],
									true
								],
								['Test that null and undefined are identical, according to loose equality',
									[null,undefined,{equality:'loose'}],
									true
								],

							/*** test for loose equality, simple type values of different type and not equivalent value ***/
								['Test that the number 1 and the string \'2\' are not identical, according to loose equality',
									[1,'2',{equality:'loose'}],
									false
								],
								['Test that the number 1 and the boolean false are not identical, according to loose equality',
									[1,false,{equality:'loose'}],
									false
								],
								['Test that the number 0 and the boolean true are not identical, according to loose equality',
									[0,true,{equality:'loose'}],
									false
								],
								['Test that the number 0 and a non-empty string are not identical, according to loose equality',
									[0,'blah',{equality:'loose'}],
									false
								],
								['Test that the boolean false and a non-empty string are not identical, according to loose equality',
									[false,'blah',{equality:'loose'}],
									false
								],
								['Test that null and the number 0 are not identical, according to loose equality',
									[null,0,{equality:'loose'}],
									false
								],

							/*** test for loose equality, simple type values of same type but different value ***/
								['Test that the number 1 and the number 2 are not identical, according to loose equality',
									[1,2,{equality:'loose'}],
									false
								],
								['Test that the boolean false and the boolean true are not identical, according to loose equality',
									[false,true,{equality:'loose'}],
									false
								],
								['Test that the string \'0\' and the string \'1\' are not identical, according to loose equality',
									['0','1',{equality:'loose'}],
									false
								],
								['Test that the string \'0\' and an empty string are not identical, according to loose equality',
									['0','',{equality:'loose'}],
									false
								],
								['Test that null and an empty object are not identical, according to loose equality',
									[null,{},{equality:'loose'}],
									false
								],

						/*** test for type equality ***/
							/*** test for type equality, simple type values of same type but different value ***/
								['Test that the number 1 and the number 2 are identical, according to type equality',
									[1,2,{equality:'type'}],
									true
								],
								['Test that the number 1 and NaN are identical, according to type equality',
									[1,NaN,{equality:'type'}],
									true
								],
								['Test that the number 1 and the number Infinity are identical, according to type equality',
									[1,Infinity,{equality:'type'}],
									true
								],
								['Test that the boolean false and the boolean true are identical, according to type equality',
									[false,true,{equality:'type'}],
									true
								],
								['Test that the string \'0\' and the string \'1\' are identical, according to type equality',
									['0','1',{equality:'type'}],
									true
								],
								['Test that the string \'0\' and an empty string are identical, according to type equality',
									['0','',{equality:'type'}],
									true
								],
								['Test that undefined is identical to undefined, according to type equality',
									[undefined,undefined,{equality:'type'}],
									true
								],
								['Test that null is identical to null, according to type equality',
									[null,null,{equality:'type'}],
									true
								],
								['Test that NaN is identical to NaN, according to type equality',
									[NaN,NaN,{equality:'type'}],
									true
								],

							/*** test for type equality, simple type values of different type ***/
								['Test that the number 1 and the string \'1\' are not identical, according to type equality',
									[1,'1',{equality:'type'}],
									false
								],
								['Test that the number 1 and the boolean true are not identical, according to type equality',
									[1,true,{equality:'type'}],
									false
								],
								['Test that the number 0 and the boolean false are not identical, according to type equality',
									[0,false,{equality:'type'}],
									false
								],
								['Test that the number 0 and an empty string are not identical, according to type equality',
									[0,'',{equality:'type'}],
									false
								],
								['Test that the number 0 and null are not identical, according to type equality',
									[0,null,{equality:'type'}],
									false
								],
								['Test that the number 0 and undefined are not identical, according to type equality',
									[0,undefined,{equality:'type'}],
									false
								],
								['Test that the boolean false and an empty string are not identical, according to type equality',
									[false,'',{equality:'type'}],
									false
								],
								['Test that null and undefined are not identical, according to type equality',
									[null,undefined,{equality:'type'}],
									false
								],
								['Test that null and an empty string are not identical, according to type equality',
									[null,'',{equality:'type'}],
									false
								],
								['Test that null and an empty object are not identical, according to type equality',
									[null,{},{equality:'type'}],
									false
								],
								['Test that undefined and an empty string are not identical, according to type equality',
									[undefined,'',{equality:'type'}],
									false
								],

						/*** tests comparing data structures ***/
							/*** test identical arrays and objects ***/
								['Test that two empty arrays are identical',
									[[],[]],
									true
								],
								['Test that two empty objects are identical',
									[{},{}],
									true
								],
								['Test that two identical arrays are identical',
									[
										[1,true,'blah',[],{},null,undefined],
										[1,true,'blah',[],{},null,undefined]
									],
									true
								],
								['Test that two identical objects are identical',
									[
										{prop1:1,prop2:true,prop3:'blah',prop4:[],prop5:{},prop6:null,prop7:undefined},
										{prop1:1,prop2:true,prop3:'blah',prop4:[],prop5:{},prop6:null,prop7:undefined}
									],
									true
								],
								['Test that two unpopulated arrays with same lengths are identical',
									[new Array (10),new Array (10)],
									true
								],
								{
									title:
										'Test workaround for issue in versions of Microsoft\'s JScript interpreter, where the for...in loop skips elements whose values are specified as undefined when an array is initialized using the array literal syntax',
									test:function () {
										var
											_array1 = [undefined,undefined,undefined],
											_array2 = [undefined,undefined,undefined]
										;
										_array2 [0] = undefined;
										return Uize.Data.Compare.identical (_array1,_array2);
									}
								},
								['Test that object is identical to itself',
									[_identicalTestObjectA,_identicalTestObjectA],
									true
								],
								['Test that two objects, with no shared object references, are identical',
									[_identicalTestObjectA,_identicalTestObjectB],
									true
								],

							/*** test non-identical arrays and objects ***/
								['Test that two unpopulated arrays with different lengths are not identical',
									[new Array (10),new Array (20)],
									false
								],
								['Test that two arrays with different elements are not identical',
									[[1,2],[1,2,3]],
									false
								],
								{
									title:
										'Test that two arrays with identical elements but different custom properties are not considered identical',
									test:function () {
										var
											_array1 = [1,2,3,4,5],
											_array2 = _array1.concat ()
										;
										_array1.foo = 'bar';
										_array2.hello = 'world';
										return !Uize.Data.Compare.identical (_array1,_array2);
									}
								},
								['Test that two objects with different properties are not identical',
									[{foo:1},{foo:1,bar:2}],
									false
								],

						/*** test for tree equality ***/
							{
								title:'Test that various combinations of different simple type values are considered tree identical',
								test:function () {
									var _success = true;
									for (
										var
											_valueNoA = -1,
											_values = [-1,0,1,NaN,Infinity,false,true,'','foo','bar',null,undefined],
											_valuesLength = _values.length,
											_equality = {equality:'tree'}
										;
										_success && ++_valueNoA < _valuesLength;
									) {
										for (var _valueNoB = _valueNoA - 1; _success && ++_valueNoB < _valuesLength;)
											_success = Uize.Data.Compare.identical (_values [_valueNoA],_values [_valueNoB],_equality)
										;
									}
									return this.expect (true,_success);
								}
							},
							/*
							['Test that a Date object instance and a RegExp object instance are considered tree identical',
								[new Date,new RegExp,{equality:'tree'}],
								true
							],
							*/

							/*** test arrays for tree equality ***/
								['Test that two empty arrays are considered tree identical',
									[[],[],{equality:'tree'}],
									true
								],
								['Test that two arrays with the same number of simple type elements are considered tree identical',
									[
										[-1,0,1,NaN,Infinity,false,true,'','foo',null,undefined],
										[-1,undefined,1,'',NaN,Infinity,false,0,null,true,'foo'],
										{equality:'tree'}
									],
									true
								],
								{
									title:'Test that two arrays with the same number of simple type elements, but where one array has a custom property that the other doesn\'t, are not considered tree identical',
									test:function () {
										var
											_array1 = [0,1,2],
											_array2 = [0,1,2]
										;
										_array2.foo = 'bar';
										return this.expect (false,Uize.Data.Compare.identical (_array1,_array2,{equality:'tree'}));
									}
								},
								['Test that two arrays, each with a different number of simple type elements, are not considered tree identical',
									[[0,1,2],[0,1,2,3],{equality:'tree'}],
									false
								],
								['Test that two arrays with the same number of elements, where an element of one array is simple type and the corresponding element of the other array is an object, are not considered tree identical',
									[[0,1,2],[0,1,{}],{equality:'tree'}],
									false
								],
								['Test that two arrays with the same number of elements, where an element of one array is simple type and the corresponding element of the other array is an array, are not considered tree identical',
									[[0,1,2],[0,1,[]],{equality:'tree'}],
									false
								],

							/*** test objects for tree equality ***/
								['Test that two empty objects are considered tree identical',
									[{},{},{equality:'tree'}],
									true
								],
								['Test that two objects with the same set of properties but with different simple type values are considered tree identical',
									[
										{p0:-1,p1:0,p2:1,p3:NaN,p4:Infinity,p5:false,p6:true,p7:'',p8:'foo',p9:null,p10:undefined},
										{p0:-1,p1:undefined,p2:1,p3:'',p4:NaN,p5:Infinity,p6:false,p7:0,p8:null,p9:true,p10:'foo'},
										{equality:'tree'}
									],
									true
								],
								['Test that two objects, each with a different set of properties, are not considered tree identical',
									[{foo:'bar'},{foo:'bar',hello:'world'},{equality:'tree'}],
									false
								],
								['Test that two objects with the same set of properties, where the value of a property in one object is simple type and the value of that same property in the other object is an object, are not considered tree identical',
									[{p0:0,p1:1,p2:2},{p0:0,p1:1,p2:{}},{equality:'tree'}],
									false
								],
								['Test that two objects with the same set of properties, where the value of a property in one object is simple type and the value of that same property in the other object is an array, are not considered tree identical',
									[{p0:0,p1:1,p2:2},{p0:0,p1:1,p2:[]},{equality:'tree'}],
									false
								],

						/*** misc ***/
							['Test loose equality, with property value being a string in one object and a number in the other',
								[{foo:'1'},{foo:1},{equality:'loose'}],
								true
							],
							['Test strict equality, with property value being a string in one object and a number in the other',
								[{foo:'1'},{foo:1},{equality:'strict'}],
								false
							],
							['Test type equality, with property value being a string in both objects, but with different values',
								[{foo:'1'},{foo:'2'},{equality:'type'}],
								true
							],
							['Test that NaN, Infinity, -Infinity, 5, and 1 are all type identical',
								[[NaN,Infinity,-Infinity,5],[1,1,1,1],{equality:'type'}],
								true
							]
					]],
					['Uize.Data.Compare.intersection',[
						['Test that calling with no parameters produces an empty object',
							[],
							{}
						],
						['Test that calling with null values produces an empty object',
							[null,null],
							{}
						],
						['Test that calling with undefined values produces an empty object',
							[undefined,undefined],
							{}
						],
						['Test that calling with two empty objects produces an empty object',
							[{},{}],
							{}
						],
						['Test that calling with non-empty objects with no intersecting properties produces an empty object',
							[{foo:1,bar:2},{hello:1,kitty:2}],
							{}
						],
						['Test that calling with non-empty objects with intersecting properties produces object with the intersecting properties',
							[{foo:1,bar:2,fooBar:3,solarPower:4},{hello:1,kitty:2,fooBar:3,solarPower:4}],
							{fooBar:3,solarPower:4}
						],
						['Test that calling with non-empty objects with intersecting properties, but only one with matching values, produces object with only the completely matching intersecting property',
							[{foo:1,bar:2,fooBar:3,solarPower:4},{hello:1,kitty:2,fooBar:3,solarPower:5}],
							{fooBar:3}
						],
						['Test that values for intersecting properties must be a strict equality match in order to be considered intersecting',
							[{foo:1,bar:2,fooBar:true,hello:null,kitty:0},{foo:1,bar:'2',fooBar:1,hello:undefined,kitty:''}],
							{foo:1}
						],
						['Test that arrays can also be specified as source objects',
							[['foo','bar',true,null],['hello','bar','kitty',null]],
							{1:'bar',3:null}
						]
					]],
					['Uize.Data.Compare.conjoined',[
						['Test that object is considered conjoined to itself',
							[_identicalTestObjectA,_identicalTestObjectA],
							true
						],
						['Test that two objects, with no shared object references, are not considered conjoined',
							[_identicalTestObjectA,_identicalTestObjectB],
							false
						],
						['Test that two objects that share some object reference are considered conjoined',
							[{foo:_identicalTestObjectA},{bar:_identicalTestObjectA}],
							true
						]
					]],
					['Uize.Data.Compare.clones',[
						['Test that object is not considered a clone of itself',
							[_identicalTestObjectA,_identicalTestObjectA],
							false
						],
						['Test that two identical objects, with no shared object references, are considered clones',
							[_identicalTestObjectA,_identicalTestObjectB],
							true
						],
						['Test that two objects that are identical, but that share an object reference, are not considered clones',
							[{foo:1,bar:_identicalTestObjectA},{foo:1,bar:_identicalTestObjectA}],
							false
						]
					]],
					['Uize.Data.Compare.diff',[
						['',
							[
								{foo:'bar'},
								{foo:'BAR'}
							],
							{
								added:{},
								removed:{},
								modified:{
									foo:1
								}
							}
						]
					]]
				])
			]
		});
	}
});

