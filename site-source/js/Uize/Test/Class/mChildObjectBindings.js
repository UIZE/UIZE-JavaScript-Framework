/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Class.mChildObjectBindings Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2015 UIZE
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
		The =Uize.Test.Class.mChildObjectBindings= module provides convenience methods for writing test cases against =Uize.Class= subclass modules that mix-in =Uize.Class.mChildObjectBindings=.

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Test.Class.mChildObjectBindings',
	required:[
		'Uize.Data.Compare',
		'Uize.Array.Util'
	],
	builder:function () {
		'use strict';

		var
			_Uize = Uize
		;

		return function (_class) {
			_class.declare({
				staticMethods:{
					childObjectBindingsTest:function(_properties) {
						var
							_childObjectsTestName = _properties.childObjectTestsName,
							_childObjectTestName = _properties.childObjectTestName,
							_childObjectsPropertyName = _properties.childObjectsPropertyName
						;

						_class.declare({
							staticMethods:_Uize.pairUp(
								_childObjectTestName,
									function(_testParams) {
										var
											_testClass = this,
											_stateProperty = _testParams.propertyName
										;

										function _getInstance(m, _instanceProperties) {
											return m.setInstance(
												_Uize.copy(_testParams.instanceProperties, _instanceProperties)
											);
										}

										return _testClass.resolve(
											_Uize.copyInto(
												{
													title:'CHILD OBJECT BINDING TEST: ' + _stateProperty,
													test:_Uize.Array.Util.flatten(
														_Uize.map(
															_testParams.cases,
															function(_case) {
																var
																	_childName = _case.child,
																	_childProperty = _case.property,
																	_direction = _case.direction,
																	_instanceProperties = _case.instanceProperties
																;

																return Uize.Array.Util.flatten(
																	_Uize.map(
																		_case.expect,
																		function(_expect) {
																			var _expectTests = [];

																			if (_direction.indexOf('->') > -1)
																				_expectTests.push({
																					title:'When instance is created and the ' + _stateProperty + ' property is set to {' + _expect.a + '}, the ' + _childProperty + ' property of ' + _childName + ' child object is set to {' + _expect.b + '}',
																					test:function() {
																						var _instance = _getInstance(this, _instanceProperties);

																						_instance.set(_expect.aState || _Uize.pairUp(_stateProperty, _expect.a));

																						return this.expect(_expect.b, _instance[_childObjectsPropertyName][_childName].get(_childProperty));
																					}
																				});

																			if (_direction.indexOf('<-') > -1)
																				_expectTests.push({
																					title:'When instance is created and the ' + _childProperty + ' property of ' + _childName + ' child object is set to {' + _expect.b + '}, the ' + _stateProperty + ' property is set to {' + _expect.a + '}',
																					test:function() {
																						var _instance = _getInstance(this, _instanceProperties);

																						_instance[_childObjectsPropertyName][_childName].set(_expect.bState || _Uize.pairUp(_childProperty, _expect.b));

																						return this.expect(_expect.a, _instance.get(_stateProperty));
																					}
																				});

																			return _expectTests;
																		}
																	)
																);
															}
														)
													)
												},
												_testParams.testProperties
											)
										);
									},
								_childObjectsTestName,
									function(_childObjectBindingsTests) {
										return this.makeMultipleDeclarativeCasesTest(
											'Child Object Bindings Tests',
											_childObjectBindingsTests,
											this[_childObjectTestName]
										);
									}
							)
						});
					}
				}
			});
		};
	}
});
