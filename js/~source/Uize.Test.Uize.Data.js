/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Data Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Test
	importance: 5
	codeCompleteness: 100
	testCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Data= module defines a suite of unit tests for the =Uize.Data= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Data',
	required:'Uize.Test',
	builder:function () {
		var
			_identicalTestObjectA = {
				aString:'blah',
				anArray:[1,2,3]
			},
			_identicalTestObjectB = {
				aString:'blah',
				anArray:[1,2,3]
			},
			_sparselyPopulatedArray = []
		;
		_sparselyPopulatedArray [2] = 1;
		_sparselyPopulatedArray [7] = 2;

		function _arrayMethodTargetTest (
			_hostName,
			_methodName,
			_sourceArrayContents,
			_expectedTargetArrayContents,
			_argumentsTemplate,
			_sourceArgumentNo,
			_targetArgumentNo
		) {
			if (!_argumentsTemplate) _argumentsTemplate = [];
			if (_sourceArgumentNo == null) _sourceArgumentNo = 0;
			if (_targetArgumentNo == null) _targetArgumentNo = 1;
			var _sourceArray, _target;

			function _callMethodWithTargetArgumentValue (_targetArgumentValue) {
				var
					_host = eval (_hostName),
					_arguments = _argumentsTemplate.concat ()
				;
				_arguments [_sourceArgumentNo] = _sourceArray = _sourceArrayContents.concat ();
				_arguments [_targetArgumentNo] = _targetArgumentValue !== undefined ? _targetArgumentValue : _sourceArray;
				_target = _host [_methodName].apply (_host,_arguments);
			}
			return Uize.Test.declare ({
				title:'Test that the targetARRAYorBOOL parameter is handled correctly for various types of values',
				test:[
					{
						title:'Test that specifying the value false for the optional targetARRAYorBOOL parameter is handled correctly',
						test:function () {
							_callMethodWithTargetArgumentValue (false);
							return (
								this.expect (true,_sourceArray == _target) &&
								this.expect (_expectedTargetArrayContents,_target)
							);
						}
					},
					{
						title:'Test that specifying the value true for the optional targetARRAYorBOOL parameter is handled correctly',
						test:function () {
							_callMethodWithTargetArgumentValue (true);
							return (
								this.expect (false,_sourceArray == _target) &&
								this.expect (_expectedTargetArrayContents,_target)
							);
						}
					},
					{
						title:'Test that specifying an empty array for the optional targetARRAYorBOOL parameter is handled correctly',
						test:function () {
							_callMethodWithTargetArgumentValue ([]);
							return (
								this.expect (false,_sourceArray == _target) &&
								this.expect (_expectedTargetArrayContents,_target)
							);
						}
					},
					{
						title:'Test that specifying an array that is already populated with more elements for the optional targetARRAYorBOOL parameter is handled correctly',
						test:function () {
							var _someExtraCrud = ['some','extra','crud'];
							_callMethodWithTargetArgumentValue (_sourceArrayContents.concat (_someExtraCrud));
							return (
								this.expect (false,_sourceArray == _target) &&
								this.expect (_expectedTargetArrayContents.concat (_someExtraCrud),_target)
							);
						}
					},
					{
						title:'Test that specifying an array that is already populated, but with the same number of elements, for the optional targetARRAYorBOOL parameter is handled correctly',
						test:function () {
							_callMethodWithTargetArgumentValue (_sourceArrayContents.concat ());
							return (
								this.expect (false,_sourceArray == _target) &&
								this.expect (_expectedTargetArrayContents,_target)
							);
						}
					},
					{
						title:'Test that specifying the source array for the optional targetARRAYorBOOL parameter is handled correctly',
						test:function () {
							_callMethodWithTargetArgumentValue ();
							return (
								this.expect (true,_sourceArray == _target) &&
								this.expect (_expectedTargetArrayContents,_target)
							);
						}
					},
					{
						title:'Test that specifying an empty object for the optional targetARRAYorBOOL parameter is handled correctly',
						test:function () {
							_callMethodWithTargetArgumentValue ({});
							return (
								this.expect (false,_sourceArray == _target) &&
								this.expect (Uize.copyInto ({},_expectedTargetArrayContents),_target)
							);
						}
					},
					{
						title:'Test that specifying an object that already has some properties for the optional targetARRAYorBOOL parameter is handled correctly',
						test:function () {
							var _someExtraCrud = {some:1,extra:1,crud:1};
							_callMethodWithTargetArgumentValue (Uize.copyInto ({},_someExtraCrud));
							return (
								this.expect (false,_sourceArray == _target) &&
								this.expect (Uize.copyInto ({},_someExtraCrud,_expectedTargetArrayContents),_target)
							);
						}
					}
				]
			});
		}

		var _class = Uize.Test.declare ({
			title:'Test for Uize.Data Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Data'),
				Uize.Test.staticMethodsTest ([
					['Uize.Data.identical',[
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
								['Test that two objects with different properties are not identical',
									[{foo:1},{foo:1,bar:2}],
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
					['Uize.Data.isEmpty',[
						['Test that empty object is considered empty',[{}],true],
						['Test that empty array is considered empty',[[]],true],
						['Test that empty string is considered empty',[''],true],
						['Test that String object initialized to empty string is considered empty',[new String ('')],true],
						['Test that the number zero is considered empty',[0],true],
						['Test that Number object initialized to zero is considered empty',[new Number (0)],true],
						['Test that the boolean false is considered empty',[false],true],
						['Test that Boolean object initialized to false is considered empty',[new Boolean (false)],true],
						['Test that null is considered empty',[null],true],
						['Test that undefined is considered empty',[undefined],true],
						['Test that NaN is considered empty',[NaN],true],
						['Test that class instance with empty value set-get property is considered empty',
							[new Uize ({value:0})],
							true
						],
						['Test that a non-empty object is not considered empty',[{blah:0}],false],
						['Test that a non-empty array is not considered empty',[['blah']],false],
						['Test that a non-empty string is not considered empty',['blah'],false],
						['Test that String object initialized to non-empty string is not considered empty',
							[new String ('foo')],
							false
						],
						['Test that a non-zero number is not considered empty',[1],false],
						['Test that Number object initialized to non-zero number is not considered empty',
							[new Number (1)],
							false
						],
						['Test that the boolean true is not considered empty',[true],false],
						['Test that Boolean object initialized to true is not considered empty',[new Boolean (true)],false],
						//['Test that a regular expression is not considered empty',[/^.+$/],false],
						['Test that a function (even an empty one) is not considered empty',function () {},false],
						['Test that class instance with non-empty value set-get property is not considered empty',
							[new Uize ({value:1})],
							false
						]
					]],
					['Uize.Data.emptyOut',[
						{
							title:'Test that emptying out an already empty array produces that same empty array as the result',
							test:function () {
								var
									_source = [],
									_result = Uize.Data.emptyOut (_source)
								;
								return this.expect (true,_source == _result) && this.expect (_source,_result);
							}
						},
						{
							title:'Test that emptying out an already empty object produces that same empty object as the result',
							test:function () {
								var
									_source = {},
									_result = Uize.Data.emptyOut (_source)
								;
								return this.expect (true,_source == _result) && this.expect (_source,_result);
							}
						},
						{
							title:'Test that emptying out an array with contents produces that same array with no contents as the result',
							test:function () {
								var
									_source = [1,2,3,4,5],
									_result = Uize.Data.emptyOut (_source)
								;
								return this.expect (true,_source == _result) && this.expect (_source,[]);
							}
						},
						{
							title:'Test that emptying out an object with contents produces that same object with no contents as the result',
							test:function () {
								var
									_source = {foo:1,bar:1},
									_result = Uize.Data.emptyOut (_source)
								;
								return this.expect (true,_source == _result) && this.expect (_source,{});
							}
						},
						['Test that specifying the value null for the source produces the value null as the result',
							null,
							null
						],
						['Test that specifying the value undefined for the source produces the value undefined as the result',
							undefined,
							undefined
						]
					]],
					['Uize.Data.filter',[
						['Test that calling with no parameter produces an empty object',
							[],
							{}
						],
						['Test that calling with the value null specified for source object produces an empty object',
							[null],
							{}
						],
						['Test that calling with the value undefined specified for source object produces an empty object',
							[undefined],
							{}
						],
						['Test that calling with no propertyNames parameter produces an empty object',
							[{foo:1,bar:2,fooBar:3}],
							{}
						],
						['Test that calling with null specified for propertyNames parameter produces an empty object',
							[{foo:1,bar:2,fooBar:3},null],
							{}
						],
						['Test that calling with undefined specified for propertyNames parameter produces an empty object',
							[{foo:1,bar:2,fooBar:3},undefined],
							{}
						],
						['Test that calling with empty array specified for propertyNames parameter produces an empty object',
							[{foo:1,bar:2,fooBar:3},[]],
							{}
						],
						['Test that calling with propertyNames array with no matching properties produces an empty object',
							[{foo:1,bar:2,fooBar:3},['hello','kitty']],
							{}
						],
						['Test that calling with propertyNames array with superset of properties produces source object',
							[{foo:1,bar:2,fooBar:3},['foo','bar','fooBar','hello','kitty']],
							{foo:1,bar:2,fooBar:3}
						],
						['Test that calling with propertyNames array with subset of properties produces subset source object',
							[{foo:1,bar:2,fooBar:3},['foo','bar','hello','kitty']],
							{foo:1,bar:2}
						],
						['Test that calling with empty source object produces empty object',
							[{},['foo','bar','hello','kitty']],
							{}
						],
						['Test that source object properties with values undefined, null, 0, NaN, or false are not missed',
							[{foo:undefined,bar:null,fooBar:0,hello:NaN,kitty:false},['foo','bar','fooBar','hello','kitty']],
							{foo:undefined,bar:null,fooBar:0,hello:NaN,kitty:false}
						],
						['Test that duplicate values in propertyNames array are ok',
							[{foo:1,bar:2,fooBar:3},['foo','foo','bar','bar']],
							{foo:1,bar:2}
						]
					]],
					['Uize.Data.findRecords',[
						['Test that calling with no parameter produces an empty array',
							[],
							[]
						],
						['Test that calling with null for records array produces an empty array',
							[null,{type:'b'}],
							[]
						],
						['Test that calling with undefined for records array produces an empty array',
							[null,{type:'b'}],
							[]
						],
						['Test that calling with an empty records array produces an empty array',
							[[],{type:'b'}],
							[]
						],
						['Test that calling with a non-empty records array with no matching records produces an empty array',
							[[{foo:1,type:'a'},{bar:2,type:'c'}],{type:'b'}],
							[]
						],
						['Test that calling with a non-empty records array and no match specified produces source array',
							[[{foo:1},{bar:2}]],
							[{foo:1},{bar:2}]
						],
						['Test that calling with a non-empty records array and null for match produces source array',
							[[{foo:1},{bar:2}],null],
							[{foo:1},{bar:2}]
						],
						['Test that calling with a non-empty records array and undefined for match produces source array',
							[[{foo:1},{bar:2}],undefined],
							[{foo:1},{bar:2}]
						],
						['Test that calling with a non-empty records array with matching records produces array with those matching records, in the correct order',
							[[{foo:1,type:'a'},{hello:3,type:'b'},{bar:2,type:'c'},{kitty:4,type:'b'}],{type:'b'}],
							[{hello:3,type:'b'},{kitty:4,type:'b'}]
						]
					]],
					['Uize.Data.getColumn',[
						['Get named column from an array of object records',
							[
								[
									{first:'John',last:'Wilkey'},
									{first:'Marie',last:'Stevenson'},
									{first:'Craig',last:'Pollack'}
								],
								'first'
							],
							['John','Marie','Craig']
						],
						['Get numbered column from an array of array records',
							[
								[
									['John','Wilkey'],
									['Marie','Stevenson'],
									['Craig','Pollack']
								],
								0
							],
							['John','Marie','Craig']
						],
						['Get column, using option to remove duplicate value',
							[
								[
									{firstName:'John',lastName:'Wilkey',department:'engineering'},
									{firstName:'Marie',lastName:'Stevenson',department:'finance'},
									{firstName:'Craig',lastName:'Pollack',department:'finance'},
									{firstName:'Nick',lastName:'Arendsen',department:'engineering'},
									{firstName:'Mark',lastName:'Strathley',department:'engineering'}
								],
								'department',
								true
							],
							['engineering','finance']
						]
					]],
					['Uize.Data.getKeys',[
						['Test that an object\'s keys are reported correctly',[{foo:1,bar:2}],['foo','bar']],
						['Test that a populated array\'s keys are reported correctly',[['a','b','c','d']],['0','1','2','3']],
						['Test that a sparsely populated array\'s keys are reported correctly',
							[_sparselyPopulatedArray],
							['2','7']
						],
						['Test that a non-zero length array that is unpopulated has no keys',[new Array (5)],[]],
						['Test that an empty array has no keys',[[]],[]],
						['Test that an empty object has no keys',[{}],[]],
						['Test that null has no keys',null,[]],
						['Test that undefined has no keys',undefined,[]],
						['Test that a boolean value has no keys',false,[]],
						['Test that a number value has no keys',5,[]],
						['Test that a string value has no keys','hello',[]]
					]],
					['Uize.Data.getTotalKeys',[
						['Test that an object\'s total keys are reported correctly',[{foo:1,bar:2}],2],
						['Test that a populated array\'s total keys are reported correctly',[['a','b','c','d']],4],
						['Test that a sparsely populated array\'s total keys are reported correctly',
							[_sparselyPopulatedArray],
							2
						],
						['Test that a non-zero length array that is unpopulated has 0 keys',[new Array (5)],0],
						['Test that an empty array has 0 keys',[[]],0],
						['Test that an empty object has 0 keys',[{}],0],
						['Test that null has 0 keys',null,0],
						['Test that undefined has 0 keys',undefined,0],
						['Test that a boolean value has 0 keys',false,0],
						['Test that a number value has 0 keys',5,0],
						['Test that a string value has 0 keys','hello',0]
					]],
					['Uize.Data.getValues',[
						['Test that an object\'s values are reported correctly',[{foo:1,bar:2}],[1,2]],
						['Test that a populated array\'s values are reported correctly',
							[['a','b','c','d']],
							['a','b','c','d']
						],
						{
							title:'Test that getting values for an array simply returns the array',
							test:function () {return Uize.Data.getValues (_sparselyPopulatedArray) == _sparselyPopulatedArray}
						},
						['Test that a sparsely populated array\'s values are reported correctly',
							[_sparselyPopulatedArray],
							_sparselyPopulatedArray
						],
						['Test that a non-zero length array that is unpopulated has no values',
							[new Array (5)],
							new Array (5)
						],
						['Test that an empty array has no values',[[]],[]],
						['Test that an empty object has no values',[{}],[]],
						['Test that null has no values',null,[]],
						['Test that undefined has no values',undefined,[]],
						['Test that a boolean value has no values',false,[]],
						['Test that a number value has no values',5,[]],
						['Test that a string value has no values','hello',[]]
					]],
					['Uize.Data.getLookup',[
						['Test that true is the default value for the lookupValue paramter',
							[['foo','bar']],
							{foo:true,bar:true}
						],
						['Test that default can be specified as a value for the lookupValue paramter',
							[['foo','bar'],undefined],
							{foo:undefined,bar:undefined}
						],
						['Test that a values array with duplicate values is handled correctly',
							[['foo','foo','bar','bar']],
							{foo:true,bar:true}
						],
						['Test that a values array with different types of values is handled correctly',
							[['','string',true,4.01,NaN,Infinity,null,undefined],1],
							{'':1,'string':1,'true':1,'4.01':1,'NaN':1,'Infinity':1,'null':1,'undefined':1}
						],
						['Test that an empty values array produces an empty lookup object',
							[[]],
							{}
						],
						['Test that a sparsely populated values array produces a lookup object with a single "undefined" key for all the missing/undefined element values',
							[_sparselyPopulatedArray],
							{1:true,2:true,'undefined':true}
						],
						['Test that a non-zero length values array that is unpopulated produces a lookup object with a single "undefined" key for all the undefined element values',
							[new Array (5)],
							{'undefined':true}
						]
					]],
					['Uize.Data.getReverseLookup',[
						['Test that calling with no parameter produces an empty object',
							[],
							{}
						],
						['Test that calling with the value null specified produces an empty object',
							[null],
							{}
						],
						['Test that calling with the value undefined specified produces an empty object',
							[undefined],
							{}
						],
						['Test that an object with no duplicate values is handled correctly',
							[{foo:1,bar:2}],
							{1:'foo',2:'bar'}
						],
						['Test that an object with duplicate values is handled as expected (last mapping wins)',
							[{foo:1,bar:1}],
							{1:'bar'}
						],
						['Test that an empty object produces an empty reverse lookup object',
							[{}],
							{}
						],
						['Test that an object with different types of values is handled correctly',
							[{prop1:'',prop2:'string',prop3:true,prop4:4.01,prop5:NaN,prop6:Infinity,prop7:null,prop8:undefined}],
							{'':'prop1','string':'prop2','true':'prop3','4.01':'prop4','NaN':'prop5',Infinity:'prop6','null':'prop7','undefined':'prop8'}
						],
						['Test that an array can be specified as a source object',
							[['foo','bar']],
							{foo:'0',bar:'1'}
						],
						['Test that an empty array produces an empty reverse lookup object',
							[{}],
							{}
						],
						['Test that a sparsely populated values array produces a reverse lookup object with no "undefined" key for missing/undefined element values',
							[_sparselyPopulatedArray],
							{1:'2',2:'7'}
						],
						['Test that a non-zero length values array that is unpopulated produces an empty reverse lookup object',
							[new Array (5)],
							{}
						],
						['Test that null produces an empty reverse lookup object',null,{}],
						['Test that undefined produces an empty reverse lookup object',undefined,{}],
						['Test that a boolean value produces an empty reverse lookup object',false,{}],
						['Test that a number value produces an empty reverse lookup object',5,{}],
						['Test that a string value produces an empty reverse lookup object','hello',{}]
					]],
					['Uize.Data.intersection',[
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
					['Uize.Data.max',[
						['Test that the maximum value from an object is reported correctly',[{foo:1,bar:2}],2],
						['Test that the maximum value from an array is reported correctly',[[1,2]],2],
						['Test that the maximum value from a sparsely populated array is NaN',
							[_sparselyPopulatedArray],
							NaN
						],
						['Test that the maximum value from a non-zero length array that is unpopulated is NaN',
							[new Array (5)],
							NaN
						],
						['Test that the maximum value from an empty array is -Infinity',[[]],-Infinity],
						['Test that the maximum value from an empty object is -Infinity',[{}],-Infinity],
						['Test that the maximum value from null is -Infinity',null,-Infinity],
						['Test that the maximum value from undefined is -Infinity',undefined,-Infinity],
						['Test that the maximum value from a boolean value is -Infinity',false,-Infinity],
						['Test that the maximum value from a number value is -Infinity',5,-Infinity],
						['Test that the maximum value from a string value is -Infinity','hello',-Infinity]
					]],
					['Uize.Data.min',[
						['Test that the minimum value from an object is reported correctly',[{foo:1,bar:2}],1],
						['Test that the minimum value from an array is reported correctly',[[1,2]],1],
						['Test that the minimum value from a sparsely populated array is NaN',
							[_sparselyPopulatedArray],
							NaN
						],
						['Test that the minimum value from a non-zero length array that is unpopulated is NaN',
							[new Array (5)],
							NaN
						],
						['Test that the minimum value from an empty array is Infinity',[[]],Infinity],
						['Test that the minimum value from an empty object is Infinity',[{}],Infinity],
						['Test that the minimum value from null is Infinity',null,Infinity],
						['Test that the minimum value from undefined is Infinity',undefined,Infinity],
						['Test that the minimum value from a boolean value is Infinity',false,Infinity],
						['Test that the minimum value from a number value is Infinity',5,Infinity],
						['Test that the minimum value from a string value is Infinity','hello',Infinity]
					]],
					['Uize.Data.map',[
						['Test that function mapper gets element value as a parameter correctly',
							[function (_value) {return _value.toUpperCase ()},['a','b','c']],
							['A','B','C']
						],
						['Test that function mapper gets element key as a parameter correctly',
							[function (_value,_key) {return _key},['a','b','c']],
							[0,1,2]
						],
						['Test that function mapper is called as instance method on array correctly',
							[function () {return this.length},['a','b','c']],
							[3,3,3]
						],
						['Test that number can be specified in place of a source array',
							[function (_value,_key) {return (_key + 1) + ' of ' + this.length + ' = ' + _value},['a','b','c']],
							['1 of 3 = a','2 of 3 = b','3 of 3 = c']
						],
						['Test that a string can be used to specify a mapper',
							['(key + 1) + \' of \' + this.length + \' = \' + value',['a','b','c']],
							['1 of 3 = a','2 of 3 = b','3 of 3 = c']
						],
						['Test that a source object is automatically mapped to a object',
							['key + value',{a:0,b:1,c:2}],
							{a:'a0',b:'b1',c:'c2'}
						],
						['Test that an empty array maps to an empty array',
							['value',[]],
							[]
						],
						['Test that an empty object maps to an empty object',
							['value',{}],
							{}
						],

						/*** test target parameter ***/
							['Test that map can be used to convert an array to an object by specifying an empty object target',
								['value',['a','b','c'],{}],
								{0:'a',1:'b',2:'c'}
							],
							['Test that map can be used to convert an object to an array by specifying an empty array target',
								['value',{0:'a',1:'b',2:'c'},[]],
								['a','b','c']
							],
							['Test that an empty array maps to an empty object, when an empty object target is specified',
								['value',[],{}],
								{}
							],
							['Test that an empty object maps to an empty array, when an empty array target is specified',
								['value',{},[]],
								[]
							],
							_arrayMethodTargetTest (
								'Uize.Data',
								'map',
								[1,2,3,4,5],
								[2,4,6,8,10],
								['value * 2',null,null],
								1,
								2
							)
					]],
					['Uize.Data.conjoined',[
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
					['Uize.Data.clones',[
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
					]]
				])
			]
		});

		/*** Public Static Methods ***/
			_class.arrayMethodTargetTest = _arrayMethodTargetTest;

		return _class;
	}
});

