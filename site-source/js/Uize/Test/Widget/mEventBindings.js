/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Widget.mEventBindings Class
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
		The =Uize.Test.Widget.mEventBindings= module provides convenience methods for writing test cases against =Uize.Widget= subclass modules that mix-in =Uize.Widget.mEventBindings=.

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Test.Widget.mEventBindings',
	required:[
		'Uize.Test.Class.mSpy',
		'Uize.Array.Util'
	],
	builder:function () {
		'use strict';

		var
			_Uize = Uize,

			_global = _Uize.global()
		;

		return function (_class) {
			_class.declare({
				mixins:_Uize.Test.Class.mSpy,
				staticMethods:{
					eventBindingTest:function(_testParams) {
						var
							_testClass = this,

							_widgetName = _testParams.widgetName || '',
							_nodeName = _testParams.nodeName,
							_nodeNameSpecified = !_Uize.isNully(_nodeName),
							_eventName = _testParams.eventName,
							_propertyName = _testParams.propertyName,
							_instanceProperties = _testParams.instanceProperties,
							_nodes = _testParams.nodes,
							_cases = _testParams.cases,

							_testName
						;

						function _getWidgetInstance(m) {
							return m.setInstance(
								_instanceProperties,
								_Uize.copyInto(
									{'':0}, // always need root node
									_nodeNameSpecified ? _Uize.pairUp(_nodeName, 0) : null,
									_Uize.isArray(_nodes) ? _Uize.lookup(_nodes) : _nodes
								)
							);
						}

						if (_nodeNameSpecified)
							_testName = '#' + _nodeName + ':' + _eventName;
						else {
							if (_propertyName)
								_testName = _widgetName + ':Changed.' + _propertyName;
							else if (_eventName)
								_testName = _widgetName + ':' + _eventName;
						}

						return _testClass.resolve(
							_Uize.copyInto(
								{
									title:'EVENT BINDING TEST: ' + _testName,
									test:_Uize.map(
										_cases,
										function(_case) {
											var
												_spy = _case.spy || [],
												_webSpy = _case.webSpy || [],
												_spies = _Uize.isArray(_spy) ? _spy : [_spy],
												_webSpies = _Uize.isArray(_webSpy) ? _webSpy : [_webSpy],
												_expected = _case.expected,

												_createWidgetAndTrigger = function(m, _continue) {
													var
														_widgetInstance = _getWidgetInstance(m),
														_spyObjects = _Uize.map(
															_spies,
															function(_spyInfo) {
																_spyInfo = _Uize.clone(_spyInfo);
																delete _spyInfo.args;
																delete _spyInfo.notCalled;

																// add spy
																return m.spyOn(
																	_Uize.copyInto(
																		{object:_widgetInstance},
																		_spyInfo
																	)
																);
															}
														),
														_webSpyObject = !_Uize.isEmpty(_webSpies)
															&& m.spyOn({
																object:_widgetInstance,
																methodName:'web',
																mockMethod:function(_nodeBlob) {
																	var _webObject = _webSpyObject.originalMethod.call(this, _nodeBlob);

																	_Uize.forEach(
																		_webSpies,
																		function(_webSpyInfo) {
																			m.spyOn(
																				_Uize.copyInto(
																					{object:_webObject},
																					_webSpyInfo
																				)
																			);
																		}
																	);

																	return _webObject;
																}
															}),
														_originalWindow = _global.window,
														_originalDocument = _global.document
													;

													_Uize.isFunction(_case.initialize)
														&& _case.initialize.call(m, _continue)
													;

													if (_nodeNameSpecified) {
														// For Uize.Dom.Basics when its wiring things
														_global.window = _global;
														_global.document = _class.getDocument();

														// wire the UI
														_widgetInstance.met('wired');
													}

													// change state
													_widgetInstance.set(_case.state);

													if (_nodeNameSpecified) {
														// fire fake DOM event
														_widgetInstance.getNode(_nodeName).triggerEvent({
															name:_eventName
														});

														_global.window = _originalWindow;
														_global.document = _originalDocument;
													}
													else if (_eventName)
														(_widgetName
															? _widgetInstance.children[_widgetName]
															: _widgetInstance
														).fire(_eventName);

													return {
														_widget:_widgetInstance,
														_spyObjects:_spyObjects
													};
												},
												_tests = _Uize.Array.Util.flatten(
													_Uize.map(
														_spies,
														function(_spyInfo, _spyNo) {
															var
																_spyArgs = _spyInfo.args,
																_notCalled = _spyInfo.notCalled,
																_spyTests = [
																	{
																		title:'After event binding is triggered, ' + _spyInfo.methodName + ' method ' + (_notCalled ? 'is NOT' : 'has been') + ' called',
																		test:function(_continue) {
																			var _testInfo = _createWidgetAndTrigger(this, _continue);
																			return this[_notCalled ? 'expectToNotHaveBeenCalled' : 'expectToHaveBeenCalled'](_testInfo._spyObjects[_spyNo]);
																		}
																	}
																]
															;

															if (_spyArgs)
																_spyTests.push({
																	title:'After event binding is triggered, ' + _spyInfo.methodName + ' method has been called with appropriate arguments',
																	test:function(_continue) {
																		var _testInfo = _createWidgetAndTrigger(this, _continue);
																		return this.expectToHaveBeenCalledWith(_testInfo._spyObjects[_spyNo], _spyInfo.args);
																	}
																})
															;

															return _spyTests;
														}
													)
												)
											;

											if (!_Uize.isNully(_expected))
												_tests.push({
													title:'After event binding is triggered, widget has expected state',
													test:function(_continue) {
														var _widget = _createWidgetAndTrigger(this, _continue)._widget;
														return this.expect(
															_expected,
															_widget.get(_Uize.keys(_expected))
														);
													}
												})
											;

											if (_Uize.isFunction(_case.expectFunc))
												_tests.push({
													title:'After event binding is triggered, expected result happens',
													test:function(_continue) {
														_createWidgetAndTrigger(this, _continue);
														return _case.expectFunc.call(this, _continue);
													}
												})
											;

											return {
												title:_case.title,
												test:_tests
											};
										}
									)
								},
								_testParams.testProperties
							)
						);
						/*?
							Static Methods
								Uize.Test.Widget.mEventBindings.eventBindingTest
									.

									SYNTAX
									..................................................................
									testCLASS = Uize.Test.Widget.mEventBindings.eventBindingTest (
										paramsOBJ
									);
									..................................................................

									paramsOBJ
										.

										widgetName
											.

										nodeName
											.

										eventName
											.

										propertyName
											.

										cases
											.

											title
												.

											state
												.

											expected
												.

											expectFunc
												.

											spy
												.

												args
													.

												notCalled
													.

											webSpy
												.

											initialize
												.

										nodes
											.

										instanceProperties
											.

										testProperties
											.

									EXAMPLE
									.......
									Uize.Test.Widget.mEventBindings.childTest (
										{
											widgetName:'stop',
											eventName:'Click',
											cases:[
												{
													state:{
														isAnimating:true
													},
													expectFunc:function(widget) {
														return this.expect(false, widget.get('isAnimating'))
													}
												}
											]
										}
									);
									......

									NOTES
									- see the related =Uize.Test.Widget.mEventBindings.eventBindingsTest= static method
						*/
					},

					eventBindingsTest:function(_eventBindingsTests) {
						return this.makeMultipleDeclarativeCasesTest(
							'Event Bindings Tests',
							_eventBindingsTests,
							this.eventBindingTest
						);
						/*?
							Static Methods
								Uize.Test.Widget.mEventBindings.eventBindingsTest
									.

									SYNTAX
									..................................................................
									testCLASS = Uize.Test.Widget.mEventBindings.eventBindingsTest (
										eventBindingsTestsARRAYorOBJ
									);
									..................................................................

									eventBindingsTestsARRAYorOBJ
										See =Uize.Test.Widget.mEventBindings.eventBindingTest= static method for the structure for each set of event binding tests.

									EXAMPLE
									.......
									Uize.Test.Widget.mEventBindings.eventBindingsTest  (
										[
											{
												widgetName:'stop',
												eventName:'Click',
												cases:[

												]
											},
											{
												nodeName:'image',
												eventName:'click',
												cases:[

												]
											},
											{
												widgetName:'',
												cases:[

												]
											}
										]
									);
									......

									NOTES
									- see the related =Uize.Test.Widget.mEventBindings.eventBindingTest= static method
						*/
					}
				}
			});
		};
	}
});
