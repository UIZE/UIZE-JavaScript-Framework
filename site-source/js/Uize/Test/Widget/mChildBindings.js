/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Widget.mChildBindings Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2014 UIZE
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
		The =Uize.Test.Widget.mChildBindings= module provides convenience methods for writing test cases against =Uize.Widget= subclass modules that mix-in =Uize.Widget.mChildBindings=.

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Test.Widget.mChildBindings',
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
					childBindingTest:function(_testParams) {
						var
							_testClass = this,
							_stateProperty = _testParams.propertyName
						;
						
						function _getWidgetInstance(m, _instanceProperties) {
							return m.setInstance(
								_Uize.copy(_testParams.instanceProperties, _instanceProperties)
							);
						}
						
						return _testClass.resolve(
							_Uize.copyInto(
								{
									title:'CHILD BINDING TEST: ' + _stateProperty,
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
																	title:'When instance is created and the ' + _stateProperty + ' property is set to {' + _expect.a + '}, the ' + _childProperty + ' property of ' + _childName + ' child widget is set to {' + _expect.b + '}',
																	test:function() {
																		var _instance = _getWidgetInstance(this, _instanceProperties);
																		
																		_instance.set(_expect.aState || _Uize.pairUp(_stateProperty, _expect.a));

																		return this.expect(_expect.b, _instance.children[_childName].get(_childProperty));
																	}
																});
												
															if (_direction.indexOf('<-') > -1)
																_expectTests.push({
																	title:'When instance is created and the ' + _childProperty + ' property of ' + _childName + ' child widget is set to {' + _expect.b + '}, the ' + _stateProperty + ' property is set to {' + _expect.a + '}',
																	test:function() {
																		var _instance = _getWidgetInstance(this, _instanceProperties);
																		
																		_instance.children[_childName].set(_expect.bState || _Uize.pairUp(_childProperty, _expect.b));
																		
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
						/*?
							Static Methods
								Uize.Test.Widget.mChildingBindings.childBindingTest
									.
									
									SYNTAX
									..................................................................
									testCLASS = Uize.Test.Widget.mChildingBindings.childBindingTest (
										paramsOBJ
									);
									..................................................................
									
									paramsOBJ
										.
										
										propertyName
											.
											
										cases
											.
											
											child
												name of the bound child
												
											property
												child state property name
												
											direction
												binding direction
												
											expect
												array of expectations
												
											instanceProperties
												instance properties for the case
										
										instanceProperties
											.
											
										testProperties
											.
									
									EXAMPLE
									.......
									Uize.Test.Widget.mChildingBindings.childBindingTest (
										{
											propertyName:'numColors',
											cases:[
												{
													child:'numColors',
													property:'value',
													direction:'<->',
													expect:[
														{a:7, b:7}
													]
												}
											]
										}
									);
									......
									
									NOTES
									- see the related =Uize.Test.Widget.mChildBindings.childBindingsTest= static method
						*/
					},
					
					childBindingsTest:function(_childBindingsTests) {
						return this.makeMultipleDeclarativeCasesTest(
							'Child Bindings Tests',
							_childBindingsTests,
							this.childBindingTest
						);
						/*?
							Static Methods
								Uize.Test.Widget.mChildBindings.childBindingsTest
									.
									
									SYNTAX
									..................................................................
									testCLASS = Uize.Test.Widget.mChildBindings.childBindingsTest (
										childBindingsTestsARRAYorOBJ
									);
									..................................................................
									
									childBindingsTestsARRAYorOBJ
										See =Uize.Test.Widget.mChildBindings.childBindingTest= static method for the structure for each set of child binding tests.
										
									EXAMPLE
									.......
									Uize.Test.Widget.mChildBindings.childBindingsTest  (
										[
											{
												propertyName:'numColors',
												cases:[
												]
											},
											{
												propertyName:'maxValidColors',
												cases:[
												]
											},
											{
												propertyName:'maxColors',
												cases:[
												]
											}
										]
									);
									......
									
									NOTES
									- see the related =Uize.Test.Widget.mChildBindings.childBindingTest= static method
						*/
					}
				}
			});
		};
	}
});
