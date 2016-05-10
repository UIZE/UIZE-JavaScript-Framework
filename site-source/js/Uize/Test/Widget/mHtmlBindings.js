/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Widget.mHtmlBindings Class
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
		The =Uize.Test.Widget.mHtmlBindings= module provides convenience methods for writing test cases against =Uize.Widget= subclass modules that mix-in =Uize.Widget.mHtmlBindings=.

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Test.Widget.mHtmlBindings',
	required:[
		'Uize.Test.Class.mSpy',
		'Uize.Json'
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
					htmlBindingTest:function(_testParams) {
						var
							_testClass = this,

							_propertyName = _testParams.propertyName,
							_nodeName = _testParams.nodeName,
							_bindingType = _testParams.bindingType,
							_instanceProperties = _testParams.instanceProperties,
							_nodes = _testParams.nodes,
							_cases = _testParams.cases
						;

						function _getWidgetInstance(m) {
							return m.setInstance(
								_instanceProperties,
								_Uize.copyInto(
									{'':0}, // always need root node
									_Uize.pairUp(_nodeName, 0), // add in the node we're testing on by default
									_Uize.isArray(_nodes) ? _Uize.lookup(_nodes) : _nodes
								)
							);
						}

						return _testClass.resolve(
							_Uize.copyInto(
								{
									title:'HTML BINDING TEST: ' + _propertyName + (_nodeName && _bindingType ? (' -> ' + _nodeName + ':' + _bindingType) : ''),
									test:_Uize.map(
										_cases,
										function(_case) {
											var
												_state = _case.state,
												_expectFunc = _case.expectFunc
											;
											return {
												title:_case.title || 'When state is set to ' + _Uize.Json.to(_state, 'mini') + ', ' + _propertyName + ' is properly set as ' + _bindingType + ' of ' + (_nodeName || '*root node*'),
												test:function(_continue) {
													var
														m = this,
														_widgetInstance = _getWidgetInstance(m),

														_originalWindow = _global.window,
														_originalDocument = _global.document,

														_expectedArgs = [_nodeName],
														_expectedValueKey,

														_webSpy = _case.webSpy || [],
														_webSpies = _Uize.isArray(_webSpy) ? _webSpy : [_webSpy],
														_spyObject = m.spyOn({object:_widgetInstance}),
														_webSpyObjects,
														_webSpyObject = !_Uize.isEmpty(_webSpies)
															&& m.spyOn({
																object:_widgetInstance,
																methodName:'web',
																mockMethod:function(_nodeBlob) {
																	var _webObject = _webSpyObject.originalMethod.call(this, _nodeBlob);

																	_webSpyObjects = _Uize.map(
																		_webSpies,
																		function(_webSpyInfo) {
																			return m.spyOn(
																				_Uize.copyInto(
																					{object:_webObject},
																					_webSpyInfo
																				)
																			);
																		}
																	);

																	return _webObject;
																}
															})
													;

													// For Uize.Dom.Basics when its wiring things
													_global.window = _global;
													_global.document = _class.getDocument();

													_Uize.isFunction(_case.initialize)
														&& _case.initialize.call(m, _continue)
													;

													// wire the UI
													_widgetInstance.met('wired');

													if (!_expectFunc) {
														var _methodToSpy;

														if (_bindingType == 'value')
															_methodToSpy = 'setNodeValue';
														else if (_bindingType == 'html' || _bindingType == 'innerHTML')
															_methodToSpy = 'setNodeInnerHtml';
														else if (_bindingType == '?')
															_methodToSpy = 'displayNode';
														else if (_bindingType == 'show' || _bindingType == 'hide') {
															_methodToSpy = 'setNodeStyle';
															_expectedValueKey = 'display';
														}
														else if (_bindingType.charCodeAt (0) == 64) {
															_methodToSpy = 'setAttribute';
															_expectedArgs = [_bindingType.slice (1)];
															_spyObject.set('object', _widgetInstance.getNode(_nodeName));
														}
														else if (_bindingType.slice (0,6) == 'style.') {
															_methodToSpy = 'setNodeStyle';
															_expectedValueKey = _bindingType.slice (6);
														}
														else {
															_methodToSpy = 'setNodeProperties';
															_expectedValueKey = _bindingType;
														}

														_spyObject.set({
															methodName:_methodToSpy,
															callThrough:true
														});
													}

													// add any override spy info
													_spyObject.set(_case.spy);

													// change state
													_widgetInstance.set(_state);

													_global.window = _originalWindow;
													_global.document = _originalDocument;

													return (_expectFunc
														|| function() {
															var _propertyValue = _widgetInstance.get(_propertyName);

															if (_bindingType == 'value' || _bindingType == 'html' || _bindingType == 'innerHTML')
																_propertyValue = _propertyValue == null ? '' : _propertyValue;
															else if (_bindingType == '?')
																_propertyValue = !!_propertyValue;
															else if (_bindingType == 'show' || _bindingType == 'hide')
																_propertyValue = !!_propertyValue == (_bindingType == 'show') ? '' : 'none';

															_expectedArgs.push(
																_expectedValueKey
																	? _Uize.pairUp(_expectedValueKey, _propertyValue)
																	: _propertyValue
															);

															return m.expectToHaveBeenCalled(_spyObject)
																&& m.expectToHaveBeenCalledWith(_spyObject, _expectedArgs)
															;
														}
													).call(m, _spyObject, _continue);
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
								Uize.Test.Widget.mHtmlBindings.htmlBindingTest
									.

									SYNTAX
									..................................................................
									testCLASS = Uize.Test.Widget.mHtmlBindings.htmlBindingTest (
										paramsOBJ
									);
									..................................................................

									paramsOBJ
										.

										propertyNameSTR
											.

										nodeNameSTR
											.

										bindingTypeSTR
											.

										casesARRAY
											.

											state
												.

											title
												.

											expectFunc
												.

											spy
												.

											webSpy
												.

											initialize
												.

										nodesARRAYOrOBJ
											.

										instancePropertiesOBJ
											.

										testPropertiesOBJ
											.

									EXAMPLE
									.......
									Uize.Test.Widget.mHtmlBindings.childTest (
										{
											propertyName:'size',
											nodeName:'image',
											bindingType:'style.width',
											cases:[
												{
													state:{
														size:450
													}
												}
											]
										}
									);
									......

									NOTES
									- see the related =Uize.Test.Widget.mHtmlBindings.htmlBindingsTest= static method
						*/
					},

					htmlBindingsTest:function(_htmlBindingsTests) {
						return this.makeMultipleDeclarativeCasesTest(
							'HTML Bindings Tests',
							_htmlBindingsTests,
							this.htmlBindingTest
						);
						/*?
							Static Methods
								Uize.Test.Widget.mHtmlBindings.htmlBindingsTest
									.

									SYNTAX
									..................................................................
									testCLASS = Uize.Test.Widget.mHtmlBindings.htmlBindingsTest (
										htmlBindingsTestsARRAYorOBJ
									);
									..................................................................

									htmlBindingsTestsARRAYorOBJ
										See =Uize.Test.Widget.mHtmlBindings.htmlBindingTest= static method for the structure for each set of HTML binding tests.

									EXAMPLE
									.......
									Uize.Test.Widget.mHtmlBindings.htmlBindingsTest  (
										[
											{
												propertyName:'value',
												nodeName:'display',
												bindingType:'html'
												cases:[

												]
											},
											{
												propertyName:'displayName',
												nodeName:'displayName'
												bindingType:'html',
												cases:[

												]
											},
											{
												propertyName:'posX',
												nodeName:'image',
												bindingType:'style.left'
												cases:[

												]
											}
										]
									);
									......

									NOTES
									- see the related =Uize.Test.Widget.mHtmlBindings.htmlBindingTest= static method
						*/
					}
				}
			});
		};
	}
});
