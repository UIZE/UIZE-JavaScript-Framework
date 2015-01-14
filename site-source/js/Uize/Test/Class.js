/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Class Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 4
	codeCompleteness: 100
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Test.Class= module provides convenience methods for writing test cases against =Uize.Class= subclass modules.

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Test.Class',
	required:[
		'Uize.Test',
		'Uize.Util.Oop',
		'Uize.Json'
	],
	builder:function (_superclass) {
		'use strict';
		
		var
			_Uize = Uize,
			_Uize_Json_to = _Uize.Json.to,
			
			_superclass_requiredModulesTest = _superclass.requiredModulesTest
		;
		
		// This is probably universally useful for all test modules
		function _makeDeclarativeCasesTest(_testTitlePrefix, _testParams,  _testFunc) {
			var
				_class = this,
				_propertyName = _testParams.propertyName,
				_cases = _testParams.cases,
				_caseTestProperties = _testParams.caseTestProperties,
				_tests = []
			;

			function _getCaseTest(_case) {
				var
					_caseIsTestObject = _Uize.Util.Oop.inheritsFrom (_case,_Uize.Test),
					_caseTest = !_caseIsTestObject
						? {
							title:_case.title
								|| (
									'When ' + _Uize_Json_to(_case.instanceProperties, 'mini')
										+ ', ' + _propertyName + ' is ' + _Uize_Json_to(_case.expected, 'mini')
								),
							test:function () {
								return _testFunc.call(
									this,
									_class.getModule(),
									_case.instanceProperties,
									_case.expected
								);
							}
						}
						: _case
				;
				if (_caseIsTestObject && _Uize.isArray (_case.test))
					_case.test = _Uize.map (_case.test,_getCaseTest)
				;
				if (_caseTestProperties)
					_caseIsTestObject
						? _caseTest.set (_caseTestProperties)
						: _Uize.copyInto (_caseTest,_caseTestProperties)
				;
				return _caseTest;
			}

			for (var _caseNo = -1, _casesLength = _cases.length; ++_caseNo < _casesLength;)
				_tests.push (_getCaseTest (_cases [_caseNo]))
			;

			return _class.resolve (
				_Uize.copyInto (
					{
						title:_testTitlePrefix + ': ' + _propertyName,
						test:_tests
					},
					_testParams.testProperties
				)
			);
		}
		
		function _makeMultipleDeclarativeCasesTest(_testTitle, _tests, _makeTestFunc) {
			var _class = this;
			return _class.resolve ({
				title:_testTitle,
				test:Uize.map (
					_tests,
					function (_test) {
						return (
							_Uize.isArray (_test)
								? _makeTestFunc.apply (_class, _test)
								: (_Uize.isPlainObject(_test)
									? _makeTestFunc.call (_class, _test)
									: _test
								)
						);
					}
				)
			});
		}
		
		function _makeDeclarativeCasesPropertyTest(_testTitlePrefix, _testParams) {
			var
				_propertyName = _testParams.propertyName,
				_instanceProperties = _testParams.instanceProperties
			;

			// TODO: Add an initial test that verifies the state property actually exists and is derived?
			return _makeDeclarativeCasesTest.call(
				this,
				_testTitlePrefix,
				_testParams,
				function(_moduleToTest, _initialProperties, _expectedValue) {
					var
						_instance = new _moduleToTest(_Uize.copy(_instanceProperties, _initialProperties))
					;
					return this.expect(
						_expectedValue,
						_instance.get(_propertyName)
					);
				}
			);
		}

		return _superclass.subclass({
			staticMethods:{
				derivedPropertyTest:function(_testParams) {
					return _makeDeclarativeCasesPropertyTest.call(
						this,
						'DERIVED PROPERTY TEST',
						_testParams
					);
					/*?
						Static Methods
							Uize.Test.Class.derivedPropertyTest
								.
								
								SYNTAX
								..................................................................
								testCLASS = Uize.Test.Class.derivedPropertyTest (
									testParamsOBJ
								);
								..................................................................
								
								testParamsOBJ
									.
									
									propertyName
										.
										
									cases
										.
										
										title
											The title of the test case
											
										instanceProperties
											Properties to set on instance to cause derivation
											
										expected
											The expected derived value for the test case
								
									instanceProperties
										.
										
									testProperties
										.
										
									caseTestProperties
										.
								
								EXAMPLE
								.......
								Uize.Test.Class.derivedPropertyTest (
									{
										propertyName:'isEmpty',
										cases:[
											{
												title:'No total items',
												instanceProperties:{totalItems:0},
												expected:true
											},
											{
												title:'1 total items',
												instanceProperties:{totalItems:1},
												expected:false
											},
											{
												title:'Many total items',
												instanceProperties:{totalItems:2},
												expected:false
											}
										]
									}
								);
								......
								
								NOTES
								- see the related =Uize.Test.Class.derivedPropertiesTest= static method
					*/
				},
				derivedPropertiesTest:function(_derivedPropertiesTests) {
					return _makeMultipleDeclarativeCasesTest.call(
						this,
						'Derived Property Tests',
						_derivedPropertiesTests,
						this.derivedPropertyTest
					);
					/*?
						Static Methods
							Uize.Test.Class.derivedPropertiesTest
								.
								
								SYNTAX
								..................................................................
								testCLASS = Uize.Test.Class.derivedPropertiesTest (
									derivedPropertiesTestsARRAYorOBJ
								);
								..................................................................
								
								derivedPropertiesTestARRAYorOBJ
									See =Uize.Test.Class.derivedPropertyTest= static method for the structure for each set of derived property tests.
									
								EXAMPLE
								.......
								Uize.Test.Class.derivedPropertiesTest (
									[
										{
											propertyName:'isEmpty',
											cases:[
											]
										},
										{
											propertyName:'oneSelected',
											cases:[
											]
										},
										{
											propertyName:'someSelected',
											cases:[
											]
										}
									]
								);
								......
								
								NOTES
								- see the related =Uize.Test.Class.derivedPropertyTest= static method
					*/
				},
				instanceMethodTest:function(_testParams) {
					var
						_testClass = this,
						_methodName = _testParams.methodName,
						_cases = _testParams.cases,
						_instanceProperties = _testParams.instanceProperties
					;
					
					function _getWidgetInstance(m, _caseInstanceProperties) {
						return m.setInstance(_Uize.copy(_instanceProperties, _caseInstanceProperties));
					}
					
					return _testClass.resolve(
						_Uize.copyInto(
							{
								title:'INSTANCE METHOD TEST: ' + _methodName,
								test:Uize.map(
									_cases,
									function(_case) {
										var
											_methodParams = _case.params || [],
											_expected = _case.expected,
											_initializeFunc = _case.initialize
										;
										return {
											title:_case.title || 'When ' + _Uize.Json.to(_methodParams, 'mini') + ' is passed, ' + _Uize_Json_to(_expected, 'mini') + ' is returned',
											test:function(_continue) {
												var
													m = this,
													_widgetInstance = _getWidgetInstance(m, _case.instanceProperties),
													_test = _case.test
												;
												
												return _Uize.isFunction(_test)
													? _test.call(m, _continue)
													: (
														function() {
															// Allow for any initialization work that needs to happen before
															// calling the method
															_Uize.isFunction(_initializeFunc)
																&& _initializeFunc.call(m, _widgetInstance)
															;
															
															// Call method w/ params
															var _returnValue = _widgetInstance[_methodName].apply(_widgetInstance, _methodParams);
			
															// If expected parameter, than compare the returnValue
															// otherwise call the expect function
															return 'expected' in _case
																? m.expect(_expected, _returnValue)
																: _case.expectFunc.call(m, _returnValue, _continue)
															;
														}
													) ()
												;
											}
										};
									}
								)
							},
							_testParams.testProperties
						)
					);
					/*?
						Static Methods
							Uize.Test.Class.instanceMethodTest
								.
								
								SYNTAX
								..................................................................
								testCLASS = Uize.Test.Class.instanceMethodTest (
									paramsOBJ
								);
								..................................................................
								
								paramsOBJ
									.
									
									methodName
										.
										
									cases
										.
										
										title
											.
											
										params
											.
											
										instanceProperties
											.
											
										expected
											.
											
										expectFunc
											.
											
										initialize
											.
									
									instanceProperties
										.
										
									testProperties
										.
								
								EXAMPLE
								.......
								Uize.Test.Class.instanceMethodTest (
									{
										methodName:'getCurve',
										cases:[
											{
												params:['position'],
												expected:true
											}
										]
									}
								);
								......
								
								NOTES
								- see the related =Uize.Test.Class.childBindingsTest= static method
					*/
				},
				instanceMethodsTest:function(_instanceMethodsTests) {
					return _makeMultipleDeclarativeCasesTest.call(
						this,
						'Instance Method Tests',
						_instanceMethodsTests,
						this.instanceMethodTest
					);
					/*?
						Static Methods
							Uize.Test.Class.instanceMethodsTest
								.
								
								SYNTAX
								..................................................................
								testCLASS = Uize.Test.Class.instanceMethodsTest (
									instanceMethodsTestsARRAYorOBJ
								);
								..................................................................
								
								instanceMethodsTestsARRAYorOBJ
									See =Uize.Test.Class.instanceMethodTest= static method for the structure for each set of instance method tests.
									
								EXAMPLE
								.......
								Uize.Test.Class.instanceMethodsTest (
									[
										{
											methodName:'getCurve',
											cases:[
											]
										},
										{
											methodName:'getDialogProperties',
											cases:[
											]
										}
									]
								);
								......
								
								NOTES
								- see the related =Uize.Test.Class.instanceMethodTest= static method
					*/
				},
				getInstance:function(_instanceProperties) {
					return new (this.getModule()) (_instanceProperties);
					/*?
						Static Methods
							Uize.Test.Class.getInstance
								Gets an instantiation of class defined by the =moduleToTest= state property.
					*/
				},
				getModule:function() {
					return _Uize.getModuleByName(this.get('moduleToTest'));
					/*?
						Static Methods
							Uize.Test.Class.getModule
								Gets a reference to the class defined by the =moduleToTest= state property.
					*/
				},
				makeDeclarativeCasesTest:_makeDeclarativeCasesTest,
					/*?
						Static Methods
							Uize.Test.Class.makeDeclarativeCasesTest
								.
								
								SYNTAX
								..................................................................
								testCLASS = Uize.Test.Class.makeDeclarativeCasesTest (
									testTitleSTR,
									casesARRAY,
									testFUNC,
									testPropertiesOBJ,
									caseTestPropertiesOBJ
								);
								..................................................................
								
								NOTES
								- see the related =Uize.Test.Class.makeMultipleDeclarativeCasesTest= static method
					*/
					
				makeMultipleDeclarativeCasesTest:_makeMultipleDeclarativeCasesTest,
					/*?
						Static Methods
							Uize.Test.Class.makeMultipleDeclarativeCasesTest
								.
								
								SYNTAX
								..................................................................
								testCLASS = Uize.Test.Class.makeMultipleDeclarativeCasesTest (
									testTitleSTR,
									makeTestFUNC,
									casesARRAY
								);
								..................................................................
								
								NOTES
								- see the related =Uize.Test.Class.makeDeclarativeCasesTest= static method
					*/
				
				moduleToTest:function(_moduleToTest) {
					this.set({
						title:'Test for ' + _moduleToTest,
						_moduleToTest:_moduleToTest
					});
				},
				propertyConformerTest:function(_testParams) {
					return _makeDeclarativeCasesPropertyTest.call(
						this,
						'PROPERTY CONFORMER TEST',
						_testParams
					);
					/*?
						Static Methods
							Uize.Test.Class.propertyConformerTest
								.
								
								SYNTAX
								..................................................................
								testCLASS = Uize.Test.Class.propertyConformerTest (
									testParamsOBJ
								);
								..................................................................
								
								testParamsOBJ
									.
									
									propertyName
										.
										
									cases
										.
										
										title
											The title of the test case
											
										instanceProperties
											Properties to set on instance to cause derivation
											
										expected
											The expected derived value for the test case
								
									instanceProperties
										.
										
									testProperties
										.
										
									caseTestProperties
										.
								
								EXAMPLE
								.......
								Uize.Test.Class.propertyConformerTest (
									{
										propertyName:'listName',
										cases:[
											{
												title:'Caps are lowercase',
												instanceProperties:{listName:'FOO'},
												expected:'foo'
											},
											{
												title:'Mixed case is lowercase',
												instanceProperties:{listName:'FoO'},
												expected:'foo'
											},
											{
												title:'Lower case is still lowercase',
												instanceProperties:{listName:'foo'},
												expected:'foo'
											]
										]
									}
								);
								......
								
								NOTES
								- see the related =Uize.Test.Class.propertyConformersTest= static method
					*/
				},
				propertyConformersTest:function(_propertyConformerTests) {
					return _makeMultipleDeclarativeCasesTest.call(
						this,
						'Property Conformer Tests',
						_propertyConformerTests,
						this.propertyConformerTest
					);
					/*?
						Static Methods
							Uize.Test.Class.propertyConformersTest
								.
								
								SYNTAX
								..................................................................
								testCLASS = Uize.Test.Class.propertyConformersTest (
									propertyConformersTestARRAYorOBJ
								);
								..................................................................
								
								propertyConformersTestARRAYorOBJ
									See =Uize.Test.Class.propertyConformerTest= static method for the structure for each set of property conformer tests.
									
								EXAMPLE
								.......
								Uize.Test.Class.propertyConformersTest (
									[
										{
											propertyName:'listName',
											cases:[
											]
										}
										..
									]
								);
								......
								
								NOTES
								- see the related =Uize.Test.Class.propertyConformerTest= static method
					*/
				},
				requiredModulesTest:function() { return _superclass_requiredModulesTest.call(this, this.get('moduleToTest')) }
			},
			
			instanceMethods:{
				setInstance:function(_instanceProperties) {
					var
						m = this,
						_instance = m.Class.getInstance(_instanceProperties)
					;
					
					m.set({_instance:_instance});
					
					return _instance;
				}
			},
			
			stateProperties:{
				_instance:'instance',
				_moduleToTest:'moduleToTest'	
			}
		});
	}
});
