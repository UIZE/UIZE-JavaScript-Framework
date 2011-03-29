/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Test
	importance: 8
	codeCompleteness: 9
	testCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize= module defines a suite of unit tests for the =Uize= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize',
	required:'Uize.Data',
	builder:function () {
		var
			_oneLevelDeepTestObjectForCloning = {
				undefinedValue:undefined,
				nullValue:null,
				emptyString:'',
				nonEmptyString:'solar',
				numberValueZero:0,
				numberValueNegative:-1,
				numberValuePositive:1,
				numberValueNaN:NaN,
				numberValueInfinity:Infinity,
				numberValueNegativeInfinity:-Infinity,
				booleanFalse:false,
				booleanTrue:true
			},
			_oneLevelDeepTestArrayForCloning = [
				undefined,
				null,
				'',
				'solar',
				0,
				-1,
				1,
				NaN,
				Infinity,
				-Infinity,
				false,
				true
			],
			_complexObjectDataStructure = {
				anObject:_oneLevelDeepTestObjectForCloning,
				anArray:_oneLevelDeepTestArrayForCloning
			},
			_complexArrayDataStructure = [
				_oneLevelDeepTestObjectForCloning,
				_oneLevelDeepTestArrayForCloning
			]
		;

		function _cloneObjectTest (_title,_class,_instantiationValue) {
			return {
				title:_title,
				test:function () {
					var
						_sourceObject = new _class (_instantiationValue),
						_clonedObject = Uize.clone (_sourceObject)
					;
					return (
						this.expect (true,_clonedObject != _sourceObject) &&
						this.expectSameAs (_sourceObject.constructor,_clonedObject.constructor) &&
						this.expect (_sourceObject.valueOf (),_clonedObject.valueOf ())
					);
				}
			};
		}

		return Uize.Test.declare ({
			title:'Test for Uize Base Class',
			test:[
				{
					title:'Data Module Pattern with Caching Accessor',
					test:function () {
						var _result;

						/*** declare MyNamespace namespace ***/
							Uize.module ({name:'MyNamespace'});

						/*** declare module with data records for engineering employees ***/
							Uize.module ({
								name:'MyNamespace.EngineeringEmployees',
								builder:function () {
									var _cachedData;

									return function (_getCopy) {
										if (_cachedData && !_getCopy) return _cachedData;

										var _data = [
											{firstName:'John',lastName:'Wilkey',department:'engineering'},
											{firstName:'Nick',lastName:'Arendsen',department:'engineering'},
											{firstName:'Mark',lastName:'Strathley',department:'engineering'}
										];
										return _getCopy ? _data : (_cachedData = _data);
									};
								}
							});

						/*** declare module with data records for finance employees ***/
							Uize.module ({
								name:'MyNamespace.FinanceEmployees',
								builder:function () {
									var _cachedData;

									return function (_getCopy) {
										if (_cachedData && !_getCopy) return _cachedData;

										var _data = [
											{firstName:'Marie',lastName:'Stevenson',department:'finance'},
											{firstName:'Craig',lastName:'Pollack',department:'finance'}
										];
										return _getCopy ? _data : (_cachedData = _data);
									};
								}
							});

						/*** declare module that combines data for engineering and finance employees ***/
							Uize.module ({
								name:'MyNamespace.AllEmployees',
								required:[
									'MyNamespace.EngineeringEmployees',
									'MyNamespace.FinanceEmployees'
								],
								builder:function () {
									var _cachedData;

									return function (_getCopy) {
										if (_cachedData && !_getCopy) return _cachedData;

										var _data = [].concat (
											MyNamespace.EngineeringEmployees (true),
											MyNamespace.FinanceEmployees (true)
										);
										return _getCopy ? _data : (_cachedData = _data);
									};
								}
							});

						/*** declare anonymous module that requires all employees module and compares to expected ***/
							Uize.module ({
								required:'MyNamespace.AllEmployees',
								builder:function () {
									_result = Uize.Data.identical (
										MyNamespace.AllEmployees (),
										[
											{firstName:'John',lastName:'Wilkey',department:'engineering'},
											{firstName:'Nick',lastName:'Arendsen',department:'engineering'},
											{firstName:'Mark',lastName:'Strathley',department:'engineering'},
											{firstName:'Marie',lastName:'Stevenson',department:'finance'},
											{firstName:'Craig',lastName:'Pollack',department:'finance'}
										]
									);
								}
							});

						return _result;
					}
				},
				Uize.Test.staticMethodsTest ([
					['Uize.capFirstChar',[
						['Many letters, first letter is lowercase','hello','Hello'],
						['Many letters, first letter is uppercase','Hello','Hello'],
						['Single letter, lowercase','h','H'],
						['Single letter, uppercase','H','H'],
						['Empty string','','']
					]],
					['Uize.constrain',[
						['Test that constraining a value that is lower than the lower limit returns the lower limit',
							[-20,-10,10],
							-10
						],
						['Test that constraining a value that is equal to the lower limit returns that value',
							[-10,-10,10],
							-10
						],
						['Test that constraining a value that is higher than the upper limit returns the upper limit',
							[20,-10,10],
							10
						],
						['Test that constraining a value that is equal to the upper limit returns that value',
							[10,-10,10],
							10
						],
						['Test that constraining value that is within the range simply returns that value',
							[1,-10,10],
							1
						],
						['Test that, when the range is reversed, constraining a value that is lower than the lower limit returns the lower limit',
							[-20,10,-10],
							-10
						],
						['Test that, when the range is reversed, constraining a value that is equal to the lower limit returns that value',
							[-10,10,-10],
							-10
						],
						['Test that, when the range is reversed, constraining a value that is higher than the upper limit returns the upper limit',
							[20,10,-10],
							10
						],
						['Test that, when the range is reversed, constraining a value that is equal to the upper limit returns that value',
							[10,10,-10],
							10
						],
						['Test that, when the range is reversed, constraining value that is within the range simply returns that value',
							[1,10,-10],
							1
						],
						['Test that, when the lower limit and the upper limit are equal, constraining a value that is lower than the lower limit returns the lower limit',
							[5,10,10],
							10
						],
						['Test that, when the lower limit and the upper limit are equal, constraining a value that is higher than the upper limit returns the upper limit',
							[15,10,10],
							10
						]
					]],
					['Uize.isArray',[
						['Test that calling with no parameters returns false',[],false],
						['Test that the value undefined is not regarded as an array',undefined,false],
						['Test that the value null is not regarded as an array',null,false],
						['Test that a string type value is not regarded as an array','hello',false],
						['Test that a String object instance is not regarded as an array',new String ('hello'),false],
						['Test that a number type value is not regarded as an array',5,false],
						['Test that a Number object instance is not regarded as an array',new Number (5),false],
						['Test that a boolean type value is not regarded as an array',true,false],
						['Test that a Boolean object instance is not regarded as an array',new Boolean (true),false],
						['Test that an empty object is not regarded as an array',{},false],
						['Test that a function is not regarded as an array',function () {},false],
						['Test that a regular expression instance is not regarded as an array',/\d+/,false],
						['Test that an empty array is regarded as an array',[[]],true],
						['Test that an array with elements is regarded as an array',[[1,2,3,4]],true]
					]],
					['Uize.isNumber',[
						['Test that calling with no parameters returns false',[],false],
						['Test that the value undefined is not regarded as a number',undefined,false],
						['Test that the value null is not regarded as a number',null,false],
						['Test that a number format string type value is not regarded as a number','5',false],
						['Test that a number format String object instance is not regarded as a number',new String ('5'),false],
						['Test that a boolean type value is not regarded as a number',true,false],
						['Test that a Boolean object instance is not regarded as a number',new Boolean (true),false],
						['Test that an object is not regarded as a number',{},false],
						['Test that an array is not regarded as a number',[[]],false],
						['Test that a function is not regarded as a number',function () {},false],
						['Test that a regular expression instance is not regarded as a number',/\d+/,false],
						['Test that a number type value is regarded as a number',5,true],
						['Test that the special value Infinity is regarded as a number',Infinity,true],
						['Test that the special value -Infinity is regarded as a number',-Infinity,true],
						['Test that the special value NaN is not regarded as a number',NaN,false],
						['Test that a Number object instance is not regarded as a number',new Number (5),false]
					]],
					['Uize.escapeRegExpLiteral',[
					]],
					['Uize.copyInto',[
					]],
					['Uize.pairUp',[
						['Test that calling with no parameters returns {undefined:undefined}',[],{undefined:undefined}],
						['Test that undefined is the default for the valueANYTYPE parameter',['key'],{key:undefined}],
						['Test that the key can be a string','key',{key:undefined}],
						['Test that the key can be a number',5,{5:undefined}],
						['Test that the key can be the special value Infinity',Infinity,{Infinity:undefined}],
						['Test that the key can be the special value NaN',NaN,{NaN:undefined}],
						['Test that the key can be a boolean',false,{'false':undefined}],
						['Test that the key can be undefined',undefined,{undefined:undefined}],
						['Test that the key can be null',null,{'null':undefined}],
						['Test that the value can be a string',['key','value'],{key:'value'}],
						['Test that the value can be a number',['key',5],{key:5}],
						['Test that the value can be the special value Infinity',['key',Infinity],{key:Infinity}],
						['Test that the value can be the special value NaN',['key',NaN],{key:NaN}],
						['Test that the value can be a boolean',['key',false],{key:false}],
						['Test that the value can be undefined',['key',undefined],{key:undefined}],
						['Test that the value can be null',['key',null],{key:null}],
						['Test that the value can be an object',['key',{propName:'propValue'}],{key:{propName:'propValue'}}]
					]],
					['Uize.substituteInto',[
						['Test that calling with no parameters produces an empty string',
							[],
							''
						],
						['Test that calling with just a source string simply produces that string',
							'Hello, world!',
							'Hello, world!'
						],
						['Test that specifying the value null for substitutions produces the source string',
							['Hello, world!',null,'[#KEY]'],
							'Hello, world!'
						],
						['Test that specifying the value undefined for substitutions produces the source string',
							['Hello, world!',undefined,'[#KEY]'],
							'Hello, world!'
						],
						['Test that substituting into an empty string produces an empty string',
							['',{name:'Eric'},'[#KEY]'],
							''
						],
						['Test that substitution of a single token works correctly',
							['My name is [#name].',{name:'Eric'},'[#KEY]'],
							'My name is Eric.'
						],
						['Test that multiple substitutions are handled corretly',
							['My name is [#name], and I am a [#occupation].',{name:'Eric',occupation:'viking'},'[#KEY]'],
							'My name is Eric, and I am a viking.'
						],
						['Test that a custom token naming specifier is handled correctly',
							['My name is <%name%>, and I am a <%occupation%>.',{name:'Eric',occupation:'viking'},'<%KEY%>'],
							'My name is Eric, and I am a viking.'
						],
						['Test that token naming where token opener and closer are empty strings is handled correcly',
							['I am name, and I am a occupation.',{name:'Eric',occupation:'viking'},'KEY'],
							'I am Eric, and I am a viking.'
						],
						['Test that default for token naming is [#KEY]',
							['My name is [#name].',{name:'Eric'}],
							'My name is Eric.'
						],
						['Test that specifying an empty object for substitutions simply produces the source string',
							['Hello, world!',{}],
							'Hello, world!'
						],
						['Test that the same substitution can be used multiple times',
							['My name is [#name]. [#name] is my name. You can call me [#name].',{name:'Eric'}],
							'My name is Eric. Eric is my name. You can call me Eric.'
						],
						['Test that substitution values that contain tokens are not further substituted into',
							['[#token1][#token2]',{token1:'[#token2]foo',token2:'bar'}],
							'[#token2]foobar'
						],
						['Test that tokens in the source string for which there aren\'t substitutions are left in the source string',
							['My name is [#name].',{occupation:'viking'}],
							'My name is [#name].'
						],
						['Test that substitutions for which there aren\'t tokens in the source string are ignored',
							['My name is [#name].',{name:'Eric',occupation:'viking'}],
							'My name is Eric.'
						],
						['Test that specifying an array for substitutions is handled correctly',
							['My name is [#0], and I am a [#1].',['Eric','viking']],
							'My name is Eric, and I am a viking.'
						],
						['Test that specifying an empty array for substitutions simply produces the source string',
							['Hello, world!',[]],
							'Hello, world!'
						],
						['Test that non-string substitution values are correctly coerced to strings',
							[
								'[#int] [#neg] [#float] [#nan] [#infinity] [#true] [#false] [#obj] [#null] [#undefined]',
								{
									int:5,neg:-5,float:5.5,nan:NaN,infinity:Infinity,
									'true':true,'false':false,
									obj:new Uize ({value:'OBJECT'}),
									'null':null,'undefined':undefined
								}
							],
							'5 -5 5.5 NaN Infinity true false OBJECT null undefined'
						],
						['Test that a string type substitution is treated as a substitutions array with one element',
							['My name is [#0].','Eric'],
							'My name is Eric.'
						],
						['Test that a number type substitution is treated as a substitutions array with one element',
							['Pi is approximately [#0].',3.14159265359],
							'Pi is approximately 3.14159265359.'
						],
						['Test that a boolean type substitution is treated as a substitutions array with one element',
							['It is not [#0] that the Earth is flat.',true],
							'It is not true that the Earth is flat.'
						],
						['Test that substitution keys are case-sensitive, as designed',
							['My name is [#name], and not [#NAME]!',{name:'Eric',NAME:'Derrick'}],
							'My name is Eric, and not Derrick!'
						],
						['Test that substitution keys are space-sensitive, as designed',
							['My name is [#name], and not [# name ]!',{name:'Eric',' name ':'Derrick'}],
							'My name is Eric, and not Derrick!'
						],
						['Test that spaces in the token opener and token closer are significant, as designed',
							['[name] [ name] [name ] [ name ]',{name:'Eric'},'[ KEY ]'],
							'[name] [ name] [name ] Eric'
						],
						['Test that a token opener containing regular expression special characters is handled correctly',
							['My name is [^$|{}[]()?.*+\\name].',{name:'Eric'},'[^$|{}[]()?.*+\\KEY]'],
							'My name is Eric.'
						],
						['Test that a token closer containing regular expression special characters is handled correctly',
							['My name is [name^$|{}[]()?.*+\\].',{name:'Eric'},'[KEY^$|{}[]()?.*+\\]'],
							'My name is Eric.'
						],
						['Test that a substitution key containing regular expression special characters is handled correctly',
							['My name is [^$|{}[]()?.*+\\].',{'^$|{}[]()?.*+\\':'Eric'},'[KEY]'],
							'My name is Eric.'
						],
						['Test that the source for substituting into can be a number',
							[3.14159265359,{'.':','},'KEY'],
							'3,14159265359'
						],
						['Test that the source for substituting into can be a boolean',
							[true,{ru:'Russia'},'KEY'],
							'tRussiae'
						],
						['Test that the source for substituting into can be an object that implements a value interface',
							[new Uize ({value:'My name is [#name].'}),{name:'Eric'}],
							'My name is Eric.'
						],
						['Test that the source for substituting into can be an array, whose elements will be concatenated',
							[['[#name]','[#occupation]'],{name:'Eric',occupation:'viking'}],
							'Eric,viking'
						]
					]],
					['Uize.indexIn',[
						['Test that calling with no parameters produces the result -1',
							[],
							-1
						],
						['Test that specifying null for the sourceARRAY parameter produces the result -1',
							[null,null],
							-1
						],
						['Test that specifying undefined for the sourceARRAY parameter produces the result -1',
							[undefined,undefined],
							-1
						],
						['Test that specifying a number for the sourceARRAY parameter produces the result -1',
							[5,5],
							-1
						],
						['Test that specifying a string for the sourceARRAY parameter produces the result -1',
							['hello','hello'],
							-1
						],
						['Test that specifying a boolean for the sourceARRAY parameter produces the result -1',
							[true,true],
							-1
						],
						['Test that specifying an empty array for the sourceARRAY parameter produces the result -1',
							[[],1],
							-1
						],
						['Test that the fromEndBOOL and strictEqualityBOOL parameters are observed correctly',
							[[0,1,'1','1',1,2],'1',true,false],
							4
						],
						['Test that the strictEqualityBOOL parameter is defaulted to true, as designed',
							[[0,1,'1','1',1,2],'1',true],
							3
						],
						['Test that the fromEndBOOL parameter is defaulted to false, as designed',
							[[0,1,'1','1',1,2],'1'],
							2
						],
						['Test that -1 is returned when the value is not found in the source array',
							[[0,1,'1','1',1,2],'0'],
							-1
						]
					]],
					['Uize.isIn',[
						['Test that calling with no parameters produces the result false',
							[],
							false
						],
						['Test that specifying null for the sourceARRAY parameter produces the result false',
							[null,null],
							false
						],
						['Test that specifying undefined for the sourceARRAY parameter produces the result false',
							[undefined,undefined],
							false
						],
						['Test that specifying a number for the sourceARRAY parameter produces the result false',
							[5,5],
							false
						],
						['Test that specifying a string for the sourceARRAY parameter produces the result false',
							['hello','hello'],
							false
						],
						['Test that specifying a boolean for the sourceARRAY parameter produces the result false',
							[true,true],
							false
						],
						['Test that specifying an empty array for the sourceARRAY parameter produces the result false',
							[[],1],
							false
						],
						['Test that the strictEqualityBOOL parameter ia observed correctly',
							[[0,1],'1',false],
							true
						],
						['Test that the strictEqualityBOOL parameter is defaulted to true, as designed',
							[[0,1],'1'],
							false
						],
						['Test that false is returned when the value is not found in the source array',
							[[0,1],2],
							false
						]
					]],
					['Uize.recordMatches',[
					]],
					['Uize.findRecordNo',[
					]],
					['Uize.findRecord',[
					]],
					['Uize.getGuid',[
						{
							title:'Test that a string type value is returned, as expected',
							test:function () {return this.expectNonEmptyString (Uize.getGuid ())}
						},
						{
							title:'Test that result is different across ten successive calls',
							test:function () {
								var _callResults = [];
								for (var _callNo = -1; ++_callNo < 10;)
									_callResults.push (Uize.getGuid ())
								;
								return this.expectNoRepeats (_callResults);
							}
						}
					]],
					['Uize.getPathToLibrary',[
					]],
					['Uize.globalEval',[
					]],
					['Uize.isInstance',[
						['Test that calling with no parameters produces the result false',[],false],
						['Test that null is not regarded as a Uize subclass instance',null,false],
						['Test that undefined is not regarded as a Uize subclass instance',undefined,false],
						['Test that a string is not regarded as a Uize subclass instance','hello',false],
						['Test that a number is not regarded as a Uize subclass instance',5,false],
						['Test that a boolean is not regarded as a Uize subclass instance',true,false],
						['Test that a simple object is not regarded as a Uize subclass instance',{},false],
						['Test that an array is not regarded as a Uize subclass instance',[],false],
						['Test that a regular expression is not regarded as a Uize subclass instance',/\d+/,false],
						['Test that a function is not regarded as a Uize subclass instance',function () {},false],
						['Test that a Uize class is not regarded as a Uize subclass instance',Uize,false],
						['Test that a Uize package is not regarded as a Uize subclass instance',Uize.Data,false],
						['Test that a Uize instance is correctly regarded as a Uize subclass instance',new Uize,true]
					]],
					['Uize.clone',[
						/*** test cloning of null values ***/
							['Test that cloning the value null produces the value null',null,null],
							['Test that cloning the value undefined produces the value undefined',undefined,undefined],

						/*** test cloning of string valus ***/
							['Test that cloning an empty string produces an empty string','',''],
							['Test that cloning a non-empty string is handled correctly','solar','solar'],

						/*** test cloning of number values ***/
							['Test that cloning the value 0 produces the value 0',0,0],
							['Test that cloning a negative number is handled correctly',-1,-1],
							['Test that cloning a positive number is handled correctly',1,1],
							['Test that cloning the special number value NaN is handled correctly',NaN,NaN],
							['Test that cloning the special number value Infinity is handled correctly',Infinity,Infinity],
							['Test that cloning the special number value -Infinity is handled correctly',-Infinity,-Infinity],

						/*** test cloning of boolean values ***/
							['Test that cloning the boolean value false produces the value false',false,false],
							['Test that cloning the boolean value true produces the value true',true,true],

						/*** test cloning of instances of JavaScript's built-in objects ***/
							_cloneObjectTest (
								'Test that cloning an instance of the RegExp object is handled correctly',
								RegExp,
								new RegExp ('^\\s+$','gi')
							),
							_cloneObjectTest (
								'Test that cloning an instance of the Date object is handled correctly',
								Date,
								'2001/9/11'
							),
							_cloneObjectTest (
								'Test that cloning an instance of the String object is handled correctly',
								String,
								'solar'
							),
							_cloneObjectTest (
								'Test that cloning an instance of the Number object is handled correctly',
								Number,
								42
							),
							_cloneObjectTest (
								'Test that cloning an instance of the Boolean object is handled correctly',
								Boolean,
								true
							),

						/*** test cloning of one level deep simple objects ***/
							['Test that cloning an empty object produces an empty object',{},{}],
							_cloneObjectTest (
								'Test that the clone of an object is not a reference to that object, but is a new object',
								Object,
								{}
							),
							['Test that cloning a non-empty object produces an identical copy of that object',
								_oneLevelDeepTestObjectForCloning,
								_oneLevelDeepTestObjectForCloning
							],

						/*** test cloning of one level deep arrays ***/
							['Test that cloning an empty array produces an empty array',[[]],[]],
							_cloneObjectTest (
								'Test that the clone of an array is not a reference to that array, but is a new array',
								Array,
								[]
							),
							['Test that cloning a non-empty array produces an identical copy of that array',
								[_oneLevelDeepTestArrayForCloning],
								_oneLevelDeepTestArrayForCloning
							],

						/*** test cloning of complex data structures ***/
							['Test that cloning a complex object data structure is handled correctly',
								[_complexObjectDataStructure],
								_complexObjectDataStructure
							],
							['Test that cloning a complex array data structure is handled correctly',
								[_complexArrayDataStructure],
								_complexArrayDataStructure
							],

						/*** test cloning of value types that should just be copied by reference ***/
							{
								title:'Test that cloning a function simply returns a reference to that function',
								test:function () {
									var _toClone = function () {};
									return this.expectSameAs (_toClone,Uize.clone (_toClone))
								}
							},
							{
								title:'Test that cloning a Uize class instance simply returns a reference to that instance',
								test:function () {
									var _toClone = new Uize;
									return this.expectSameAs (_toClone,Uize.clone (_toClone))
								}
							},

						/*** miscellaneous ***/
							['Test that specifying no parameter is equivalent to cloning the value undefined',
								[],
								undefined
							]
					]],
					['Uize.callOn',[
					]],

					['Uize.wire',[
					]],
					['Uize.unwire',[
					]],
					['Uize.registerProperties',[
					]],
					['Uize.get',[
					]],
					['Uize.set',[
					]],
					['Uize.toggle',[
					]],
					['Uize.toString',[
					]],
					['Uize.valueOf',[
					]],
					['Uize.module',[
					]],
					['Uize.subclass',[
					]]
				])
			]
		});
	}
});

