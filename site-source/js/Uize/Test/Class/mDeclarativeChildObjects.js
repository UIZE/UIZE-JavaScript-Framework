/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Class.mDeclarativeChildObjects Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
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
		The =Uize.Test.Class.mDeclarativeChildObjects= module provides convenience methods for writing test cases against =Uize.Class= subclass modules that mix-in =Uize.Class.mDeclarativeChildObjects=.

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Test.Class.mDeclarativeChildObjects',
	required:'Uize.Array.Util',
	builder:function () {
		'use strict';

		var
			_Uize = Uize
		;

		return function (_class) {
			_class.declare({
				staticMethods:{
					declarativeChildObjectsTest:function(_properties) {
						var
							_childObjectsTestName = _properties.childObjectTestsName,
							_childObjectTestName = _properties.childObjectTestName,
							_childObjectsPropertyName = _properties.childObjectsPropertyName,
							_childObjectClassKey = _properties.childObjectClassKey
						;

						_class.declare({
							staticMethods:_Uize.pairUp(
								_childObjectTestName,
									function(_testParams) {
										var
											_testClass = this,
											_childName = _testParams.childName,
											_cases = _testParams.cases,
											_instanceProperties = _testParams.instanceProperties,
											_tests
										;

										function _getInstance(m, _initialProperties) {
											return m.setInstance(_Uize.copy(_instanceProperties, _initialProperties));
										}

										if (!_cases) {
											_tests = [
												{
													title:'When instance is created, ' + _childName + ' child object is NOT added',
													test:function() {
														return this.expectNully(_getInstance(this)[_childObjectsPropertyName][_childName]);
													}
												}
											];
										}
										else {
											_tests = Uize.Array.Util.flatten(
												_Uize.map(
													_cases,
													function(_case) {
														var
															_childObjectClassName = _case[_childObjectClassKey],
															_expectedChildProperties = _case.expectedProperties,
															_childObjectInstanceProperties = _case.instanceProperties,
															_caseTests = [
																{
																	title:'When instance is created, ' + _childName + ' child object is added',
																	test:function() {
																		return this.expectNonNull(_getInstance(this)[_childObjectsPropertyName][_childName]);
																	}
																},
																{
																	title:'When instance is created, ' + _childName + ' child object is an instance of ' + _childObjectClassName,
																	test:function() {
																		return this.expect(_childObjectClassName, _getInstance(this)[_childObjectsPropertyName][_childName].Class.moduleName);
																	}
																}
															]
														;

														if (_expectedChildProperties) {
															// NOTE: For when a child is declared w/ initial state properties
															_caseTests.push({
																title:'When instance is created, ' + _childName + ' child object has the correct initial state properties',
																test:function() {
																	var _child = _getInstance(this, _childObjectInstanceProperties)[_childObjectsPropertyName][_childName];
																	return this.expect(_expectedChildProperties, _child.get(_Uize.keys(_expectedChildProperties)));
																}
															});
														}

														return _caseTests;
													}
												)
											);
										}

										return _testClass.resolve(
											_Uize.copyInto(
												{
													title:'DECLARATIVE CHILD OBJECT TEST: ' + _childName,
													test:_tests
												},
												_testParams.testProperties
											)
										);
									},
								_childObjectsTestName,
									function(_declarativeChildObjectsTests) {
										return this.makeMultipleDeclarativeCasesTest(
											'Declarative Child Object Tests',
											_declarativeChildObjectsTests,
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
