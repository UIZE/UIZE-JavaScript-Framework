/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Class.mChildObjectEventBindings Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 3
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Class.mChildObjectEventBindings= module defines a suite of unit tests for the =Uize.Class.mChildObjectEventBindings= mixin module.

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Test.Uize.Class.mChildObjectEventBindings',
	superclass:'Uize.Test.Class',
	required:[
		'Uize.Comm',
		'Uize.Test.Widget',
		'Uize.Widget'
	],
	builder:function (_superclass) {
		'use strict';

		var
			_Uize = Uize,

			_eventBindingsFunctionName = 'eventBindings',

			_global = Uize.global(),
			_processArrayAsync = Uize.Comm.processArrayAsync,
			_defaultHandler = function(_event, _source) { _event.handler.call(this, _event, _source) },
			_defaultChangedHandler = function(_event, _source) { this.get(_event.name.slice(8)).call(this, _event, _source) },
			_originalWindow,

			_class = _superclass.subclass({
				moduleToTest:'Uize.Class.mChildObjectEventBindings'
			})
		;

		function _getMockDomNode(_name) { return Uize.Test.Widget.getMockDomNode(_name) }

		function _getTestWidgetClass(_eventBindings, _children) {
			return Uize.Widget.subclass (
				_Uize.copyInto(
					{
						mixins:Uize.Class.mChildObjectEventBindings,
						childObjectEventBindings:{
							declaration:_eventBindingsFunctionName,
							instanceProperty:'children',
							addedInstanceProperty:'addedChildren',
							additionalTypes:{
								dom:{
									namePrefix:'#',
									wireWhenever:'wired',
									getObjectMethod:'getNode',
									wireObjectMethod:'wireNode',
									defaultFireIf:'enabledInherited,!busyInherited'
								}
							}
						},
						omegastructor:function() {
							this.addChildren(Uize.lookup(_children, {widgetClass:Uize.Widget}));
						}
					},
					_Uize.pairUp(_eventBindingsFunctionName, _eventBindings)
				)
			);
		}

		function _getTestWidgetClassInstance(_eventBindings, _children, _nodes, _instanceProperties) {
			return _getTestWidgetClass(_eventBindings, _children)(
				Uize.copyInto(
					{
						nodeMap:Uize.map(
							Uize.lookup(_nodes),
							function(_value, _node) { return _getMockDomNode(_node) }
						)
					},
					_instanceProperties
				)
			);
		}

		function _generateTest(_title, _eventBindingsShorthand, _eventBindingsVerbose, _wiredEvents, _deferredChildren) {
			function _generateSyntaxTests(_isVerbose) {
				var _eventBindings = _isVerbose ? _eventBindingsVerbose : _eventBindingsShorthand;

				function _getSyntaxTestWidgetClass(_children) {
					return _getTestWidgetClass(_eventBindings, _children);
				}

				function _getSyntaxTestWidgetClassInstance(_children, _nodes, _instanceProperties) {
					return _getTestWidgetClassInstance(_eventBindings, _children, _nodes, _instanceProperties);
				}

				function _generateFireTests(_type) {
					var _fireEventMethodName = _type == 'node' ? 'triggerEvent' : 'fire';

					function _generateFireTest(_expectFunc, _instanceProperties) {
						return function(_continue) {
							if (!_wiredEvents || Uize.isEmpty(_wiredEvents[_type]))
								return true;

							var
								_typeEvents = _wiredEvents[_type],
								_names = _type == 'self' ? ['self'] : Uize.keys(_typeEvents),
								_testWidgetClassInstance = _getSyntaxTestWidgetClassInstance(
									_type == 'child' ? _names : undefined,
									_type == 'node' ? _names : undefined,
									_instanceProperties
								),
								_fail = function() { _continue(true) }
							;
							_processArrayAsync(
								_names,
								function(_objectName, _nextObjectFunc) {
									_processArrayAsync(
										(_type == 'self' ? _wiredEvents : _typeEvents)[_objectName],
										function(_eventName, _nextEventFunc) {
											var
												_objectToFireOn = _type == 'self'
													? _testWidgetClassInstance
													: (_type == 'child'
														? _testWidgetClassInstance.children[_objectName]
														: _testWidgetClassInstance.getNode(_objectName)
													),
												_fireEvent = function(_fireHandler) {
													_type == 'self' && !_eventName.indexOf('Changed.')
														? _objectToFireOn.set(
															_eventName.slice(8),
															_fireHandler
														)
														: _objectToFireOn[_fireEventMethodName]({
															name:_eventName,
															handler:_fireHandler
														})
													;
												},
												_verifyEventFired = function(_nextFunc) {
													var _handlerNotCalledTimeout = setTimeout(function() { _continue(false) }, 0); // timeout for if handler isn't called
													_fireEvent(
														function(_event, _source) {
															clearTimeout(_handlerNotCalledTimeout);
															_expectFunc.call(
																this,
																{
																	_nextFunc:_nextFunc,
																	_testWidgetClassInstance:_testWidgetClassInstance,
																	_eventName:_eventName,
																	_event:_event,
																	_source:_source,
																	_fail:_fail,
																	_firedObject:_objectToFireOn
																}
															);
														}
													);
												},
												_verifyEventNotFired = function(_nextFunc) {
													var
														_handlerNotCalledTimeout = setTimeout(_nextFunc, 0)// timeout for when handler isn't called
													;

													// Verify event is not fired
													_fireEvent(
														function() { // handler shouldn't get called
															clearTimeout(_handlerNotCalledTimeout);
															_continue(false);
														}
													);
												},
												_deferredChildrenForEventObject = !Uize.isEmpty(_deferredChildren)
													&& (_type == 'self'
														? _deferredChildren.self
														: (_deferredChildren[_type] && _deferredChildren[_type][_objectName])
													),
												_deferredChildrenForEvent = _deferredChildrenForEventObject && _deferredChildrenForEventObject[_eventName]
											;

											_type == 'node' && _testWidgetClassInstance.met('wired');

											if (Uize.isEmpty(_deferredChildrenForEvent)) {
												_verifyEventFired(_nextEventFunc);
											}
											else {
												_processArrayAsync(
													_deferredChildrenForEvent,
													function(_deferredChildName, _nextDeferredChildFunc) {
														_verifyEventNotFired(
															function() {
																// Add deferred child
																_testWidgetClassInstance.addChild(_deferredChildName, Uize.Widget);

																_nextDeferredChildFunc();
															}
														);
													},
													function() {
														// Verify event is fired
														_verifyEventFired(
															function() {
																// Remove a random child
																_testWidgetClassInstance.removeChild(
																	_deferredChildrenForEvent[
																		Math.floor(Math.random() * _deferredChildrenForEvent.length)
																	]
																);

																// Verify event is not fired & then move onto next event
																_verifyEventNotFired(_nextEventFunc);
															}
														);
													}
												);
											}
										},
										_nextObjectFunc
									);
								},
								function() { _continue(true) }
							);
						};
					}

					return {
						title:Uize.capFirstChar(_type) + ' events are successfully fired',
						test:[
							{
								title:'Handler is called',
								test:_generateFireTest(
									function(_data) { _data._nextFunc() }
								)
							},
							{
								title:'"this" context is widget',
								test:_generateFireTest(
									function(_data) {
										this == _data._testWidgetClassInstance
											? _data._nextFunc()
											: _data._fail()
										;
									}
								)
							},
							{
								title:'First argument is event object',
								test:_generateFireTest(
									function(_data) {
										_data._event.name == _data._eventName
											? _data._nextFunc()
											: _data._fail()
										;
									}
								)
							},
							{
								title:'Second argument is source object',
								test:_generateFireTest(
									function(_data) {
										_data._source == _data._firedObject
											? _data._nextFunc()
											: _data._fail()
										;
									}
								)
							}
						]
					};
				}

				return {
					title:(_isVerbose ? 'Verbose' : 'Shorthand') + ' Syntax',
					test:[
						{
							title:'Widget class is a function (not null)',
							test:function() { return this.expectFunction(_getSyntaxTestWidgetClass()) }
						},
						{
							title:'Widget instance is an object (not null)',
							test:function() { return this.expectObject(_getSyntaxTestWidgetClassInstance()) }
						},
						_generateFireTests('self'),
						_generateFireTests('child'),
						{
							title:'Node events do not fire before widget is wired',
							test:function(_continue) {
								if (!_wiredEvents || Uize.isEmpty(_wiredEvents.node))
									return true;

								var
									_nodeNames = Uize.keys(_wiredEvents.node),
									_testWidgetClassInstance = _getSyntaxTestWidgetClassInstance(null, _nodeNames)
								;
								_processArrayAsync(
									_nodeNames,
									function(_nodeName, _nextNodeFunc) {
										_processArrayAsync(
											_wiredEvents.node[_nodeName],
											function(_eventName, _nextEventFunc) {
												// The handler shouldn't be called which means we won't continue to the next node,
												// so, set up a timeout to continue on if the handler is not called.
												var _notFiredTimeout = setTimeout(_nextEventFunc, 0);
												_testWidgetClassInstance.getNode(_nodeName).triggerEvent({
													name:_eventName,
													handler:function() {
														clearTimeout(_notFiredTimeout);
														_continue(false); // we should never get here
													}
												});
											},
											_nextNodeFunc
										);
									},
									function() { _continue(true) }
								);
							}
						},
						_generateFireTests('node')
					]
				};
			}

			return {
				title:_title,
				test:[
					_generateSyntaxTests(),
					_generateSyntaxTests(true)
				]
			};
		}

		return _class.declare({
			set:{
				test:[
					{
						title:'Set the global window object',
						test:function() {
							_originalWindow = _global.window;
							_global.window = _global;  // For Uize.Dom.Basics
							return true;
						}
					},
					Uize.Test.requiredModulesTest ([
						'Uize.Widget',
						'Uize.Class.mChildObjectEventBindings'
					]),
					{
						title:'Empty bindings',
						test:[
							_generateTest('When no declarative event bindings are specified, no events are wired'),
							_generateTest('When empty event bindings is specified, no events are wired')
						]
					},
					{
						title:'Child Events',
						test:[
							_generateTest(
								'When a single child with a single event binding is declared, only that child event is bound',
								{
									'foo:Click':_defaultHandler
								},
								{
									foo:{
										Click:_defaultHandler
									}
								},
								{
									child:{
										foo:['Click']
									}
								}
							),
							_generateTest(
								'When a single child with multiple event bindings are declared, only the events for that child are bound',
								Uize.lookup(
									[
										'foo:Click',
										'foo:Changed.value',
										'foo:Changed.bar'
									],
									_defaultHandler
								),
								{
									foo:{
										Click:_defaultHandler,
										'Changed.value':_defaultHandler,
										'Changed.bar':_defaultHandler
									}
								},
								{
									child:{
										foo:['Click', 'Changed.value', 'Changed.bar']
									}
								}
							),
							_generateTest(
								'When a multiple children each with a single event binding are declared, only the one event for each child is bound',
								Uize.lookup(
									[
										'foo:Changed.bar',
										'lorem:Changed.ipsum'
									],
									_defaultHandler
								),
								{
									foo:{
										'Changed.bar':_defaultHandler
									},
									lorem:{
										'Changed.ipsum':_defaultHandler
									}
								},
								{
									child:{
										foo:['Changed.bar'],
										lorem:['Changed.ipsum']
									}
								}
							),
							_generateTest(
								'When a multiple children each with multiple event bindings are declared, only the events for those children are bound',
								Uize.lookup(
									[
										'foo:Click',
										'lorem:Changed.ipsum',
										'foo:Changed.value',
										'lorem:Changed.dolor',
										'foo:Changed.bar',
										'a:Changed.b',
										'a:c',
										'a:d',
										'a:Changed.e'
									],
									_defaultHandler
								),
								{
									foo:{
										Click:_defaultHandler,
										'Changed.value':_defaultHandler,
										'Changed.bar':_defaultHandler
									},
									lorem:{
										'Changed.ipsum':_defaultHandler,
										'Changed.dolor':_defaultHandler
									},
									a:{
										'Changed.b':_defaultHandler,
										'c':_defaultHandler,
										'd':_defaultHandler,
										'Changed.e':_defaultHandler
									}
								},
								{
									child:{
										foo:['Click', 'Changed.value', 'Changed.bar'],
										lorem:['Changed.ipsum', 'Changed.dolor'],
										a:['Changed.b', 'c', 'd', 'Changed.e']
									}
								}
							),
							{
								title:'Required Children',
								test:[
									_generateTest(
										'When required is left unspecified for a child event binding, the event is fired normally (w/ no errors)',
										{
											'foo:Click':{
													handler:_defaultHandler
												}
										},
										{
											foo:{
												Click:{
													handler:_defaultHandler
												}
											}
										},
										{
											child:{
												foo:['Click']
											}
										}
									),
									_generateTest(
										'When a single required child for a child event binding is declared, the event is not fired until the child is added',
										{
											'foo:Click':{
													handler:_defaultHandler,
													required:['baz']
												}
										},
										{
											foo:{
												Click:{
													handler:_defaultHandler,
													required:['baz']
												}
											}
										},
										{
											child:{
												foo:['Click']
											}
										},
										{
											child:{
												foo:{
													Click:['baz']
												}
											}
										}
									),
									_generateTest(
										'When multiple required children for a child event binding are declared, the event is not fired until all the children are added (and order doesn\'t matter)',
										{
											'foo:Click':{
												handler:_defaultHandler,
												required:['baz', 'bat', 'baf']
											}
										},
										{
											foo:{
												Click:{
													handler:_defaultHandler,
													required:['baz', 'bat', 'baf']
												}
											}
										},
										{
											child:{
												foo:['Click']
											}
										},
										{
											child:{
												foo:{
													Click:['bat', 'baf', 'baz']
												}
											}
										}
									)
								]
							},
							{
								title:'Conditional firing (fireIf)',
								test:Uize.push(
									Uize.map(
										[
											{
												title:'When fireIf is undefined and widget is disabled, child event is fired',
												state:{enabled:false}
											},
											{
												title:'When fireIf is undefined and widget is busy, child event is fired',
												state:{busy:true}
											},
											{
												title:'When fireIf evaluates to true, child event is fired',
												fireIf:'foo',
												state:{foo:true}
											}
										],
										function(_testInfo) {
											return {
												title:_testInfo.title,
												test:function(_continue) {
													var
														_testWidgetClassInstance = _getTestWidgetClassInstance(
															{
																'foo:Click':{
																	handler:function() {
																		clearTimeout(_notFiredTimeout);
																		_continue(true);
																	},
																	fireIf:_testInfo.fireIf
																}
															},
															['foo'],
															null,
															_testInfo.state
														),
														_notFiredTimeout
													;

													_notFiredTimeout = setTimeout(
														function() { _continue(false) },
														0
													);

													_testWidgetClassInstance.children.foo.fire('Click');
												}
											};
										}
									),
									[
										{
											title:'When fireIf evaluates to false, child event isn\'t fired',
											test:function(_continue) {
												var
													_testWidgetClassInstance = _getTestWidgetClassInstance(
														{
															'foo:Click':{
																handler:function() {
																	clearTimeout(_notFiredTimeout);
																	_continue(false);
																},
																fireIf:'foo'
															}
														},
														['foo'],
														null
													),
													_notFiredTimeout
												;

												// fire child widget event (shouldn't actually be handled by widget)
												_testWidgetClassInstance.children.foo.fire('Click');

												_notFiredTimeout = setTimeout(
													function() { _continue(true) },
													0
												);
											}
										}
									]
								)
							}
						]
					},
					{
						title:'Self Events',
						test:[
							_generateTest(
								'When a single event binding is declared, only that event is bound',
								Uize.lookup(
									[
										':Click'
									],
									_defaultHandler
								),
								{
									'':{
										Click:_defaultHandler
									}
								},
								{
									self:['Click']
								}
							),
							_generateTest(
								'When multiple events binding are declared, only those events are bound',
								{
									':Click':_defaultHandler,
									':Changed.value':_defaultChangedHandler
								},
								{
									'':{
										Click:_defaultHandler,
										'Changed.value':_defaultChangedHandler
									}
								},
								{
									self:['Click', 'Changed.value']
								}
							),
							_generateTest(
								'When a single required child for a self event binding is declared, the event is not fired until the child is added',
								{
									':Click':{
										handler:_defaultHandler,
										required:['baz']
									}
								},
								{
									'':{
										Click:{
											handler:_defaultHandler,
											required:['baz']
										}
									}
								},
								{
									self:['Click']
								},
								{
									self:{
										Click:['baz']
									}
								}
							),
							_generateTest(
								'When multiple required children for a self event binding are declared, the event is not fired until all the children are added (and order doesn\'t matter)',
								{
									':Click':{
										handler:_defaultHandler,
										required:['baz', 'bat', 'baf']
									}
								},
								{
									'':{
										Click:{
											handler:_defaultHandler,
											required:['baz', 'bat', 'baf']
										}
									}
								},
								{
									self:['Click']
								},
								{
									self:{
										Click:['bat', 'baf', 'baz']
									}
								}
							),
							{
								title:'Conditional firing (fireIf)',
								test:Uize.push(
									Uize.map(
										[
											{
												title:'When fireIf is undefined and widget is disabled, self event is fired',
												state:{enabled:false}
											},
											{
												title:'When fireIf is undefined and widget is busy, self event is fired',
												state:{busy:true}
											},
											{
												title:'When fireIf evaluates to true, self event is fired',
												fireIf:'foo',
												state:{foo:true}
											}
										],
										function(_testInfo) {
											return {
												title:_testInfo.title,
												test:function(_continue) {
													var
														_testWidgetClassInstance = _getTestWidgetClassInstance(
															{
																':Click':{
																	handler:function() {
																		clearTimeout(_notFiredTimeout);
																		_continue(true);
																	},
																	fireIf:_testInfo.fireIf
																}
															},
															null,
															null,
															_testInfo.state
														),
														_notFiredTimeout
													;

													_notFiredTimeout = setTimeout(
														function() { _continue(false) },
														0
													);

													_testWidgetClassInstance.fire('Click');
												}
											};
										}
									),
									[
										{
											title:'When fireIf evaluates to false, self event isn\'t fired',
											test:function(_continue) {
												var
													_testWidgetClassInstance = _getTestWidgetClassInstance(
														{
															':Click':{
																handler:function() {
																	clearTimeout(_notFiredTimeout);
																	_continue(false);
																},
																fireIf:'foo'
															}
														},
														null,
														null
													),
													_notFiredTimeout
												;

												// fire child widget event (shouldn't actually be handled by widget)
												_testWidgetClassInstance.fire('Click');

												_notFiredTimeout = setTimeout(
													function() { _continue(true) },
													0
												);
											}
										}
									]
								)
							}
						]
					},
					{
						title:'Node Events',
						test:[
							_generateTest(
								'When a single node with a single event binding is declared, only that node event is bound',
								Uize.lookup(
									[
										'#foo:click'
									],
									_defaultHandler
								),
								{
									'#foo':{
										click:_defaultHandler
									}
								},
								{
									node:{
										foo:['click']
									}
								}
							),
							_generateTest(
								'When a single node with multiple event bindings are declared, only the events for that node are bound',
								Uize.lookup(
									[
										'#foo:click',
										'#foo:mousemove',
										'#foo:change'
									],
									_defaultHandler
								),
								{
									'#foo':{
										click:_defaultHandler,
										mousemove:_defaultHandler,
										change:_defaultHandler
									}
								},
								{
									node:{
										foo:['click', 'mousemove', 'change']
									}
								}
							),
							_generateTest(
								'When a multiple nodes each with a single event binding are declared, only the one event for each node is bound',
								Uize.lookup(
									[
										'#foo:load',
										'#lorem:unload'
									],
									_defaultHandler
								),
								{
									'#foo':{
										load:_defaultHandler
									},
									'#lorem':{
										unload:_defaultHandler
									}
								},
								{
									node:{
										foo:['load'],
										lorem:['unload']
									}
								}
							),
							_generateTest(
								'When a multiple nodes each with multiple event bindings are declared, only the events for those nodes are bound',
								Uize.lookup(
									[
										'#a:focus',
										'#foo:click',
										'#lorem:keypress',
										'#a:change',
										'#foo:mouseover',
										'#a:blur',
										'#foo:keydown',
										'#lorem:keyup',
										'#a:load'
									],
									_defaultHandler
								),
								{
									'#foo':{
										click:_defaultHandler,
										mouseover:_defaultHandler,
										keydown:_defaultHandler
									},
									'#lorem':{
										keypress:_defaultHandler,
										keyup:_defaultHandler
									},
									'#a':{
										load:_defaultHandler,
										blur:_defaultHandler,
										focus:_defaultHandler,
										change:_defaultHandler
									}
								},
								{
									node:{
										foo:['click', 'mouseover', 'keydown'],
										lorem:['keypress', 'keyup'],
										a:['load', 'blur', 'focus', 'change']
									}
								}
							),
							_generateTest(
								'When root node with a single event binding is declared, only that node event is bound',
								Uize.lookup(
									[
										'#:click'
									],
									_defaultHandler
								),
								{
									'#':{
										click:_defaultHandler
									}
								},
								{
									node:{
										'':['click']
									}
								}
							),
							_generateTest(
								'When root node with multiple event bindings are declared, only the events for the node are bound',
								Uize.lookup(
									[
										'#:click',
										'#:mousemove'
									],
									_defaultHandler
								),
								{
									'#':{
										click:_defaultHandler,
										mousemove:_defaultHandler
									}
								},
								{
									node:{
										'':['click', 'mousemove']
									}
								}
							),
							{
								title:'Required children',
								test:[
									_generateTest(
										'When required is left unspecified for a node event binding, the event is fired normally (w/ no errors)',
										{
											'#foo:click':{
												handler:_defaultHandler
											}
										},
										{
											'#foo':{
												click:{
													handler:_defaultHandler
												}
											}
										},
										{
											node:{
												foo:['click']
											}
										}
									),
									_generateTest(
										'When a single required child for a node event binding is declared, the event is not fired until the child is added',
										{
											'#foo:click':{
												handler:_defaultHandler,
												required:['baz']
											}
										},
										{
											'#foo':{
												click:{
													handler:_defaultHandler,
													required:['baz']
												}
											}
										},
										{
											node:{
												foo:['click']
											}
										},
										{
											node:{
												foo:{
													click:['baz']
												}
											}
										}
									),
									_generateTest(
										'When multiple required children for a node event binding are declared, the event is not fired until all the children are added (and order doesn\'t matter)',
										{
											'#foo:click':{
												handler:_defaultHandler,
												required:['baz', 'bat', 'baf']
											}
										},
										{
											'#foo':{
												click:{
													handler:_defaultHandler,
													required:['baz', 'bat', 'baf']
												}
											}
										},
										{
											node:{
												foo:['click']
											}
										},
										{
											node:{
												foo:{
													click:['bat', 'baf', 'baz']
												}
											}
										}
									)
								]
							},
							{
								title:'Conditional Firing (fireIf)',
								test:Uize.push(
									Uize.map(
										[
											{
												title:'When fireIf is unspecified, the wired DOM event doesn\'t fire if busy or disabled'
											},
											{
												title:'When fireIf is null, the wired DOM event doesn\'t fire if busy or disabled',
												fireIf:null
											},
											{
												title:'When fireIf is undefined, the wired DOM event doesn\'t fire if busy or disabled',
												fireIf:undefined
											},
											{
												title:'When fireIf is empty string, the wired DOM event doesn\'t fire if busy or disabled',
												fireIf:''
											}
										],
										function (_eventBindingsInfo) {
											return {
												title:_eventBindingsInfo.title,
												test:function(_continue) {
													var
														_testWidgetClassInstance = _getTestWidgetClassInstance(
															{
																'#myNode:click':Uize.copyInto(
																	{
																		handler:function() {
																			clearTimeout(_notFiredTimeout);
																			_continue(false);
																		}
																	},
																	_eventBindingsInfo.fireIf ? {fireIf:_eventBindingsInfo.fireIf} : null
																)
															},
															null,
															['myNode']
														),
														_notFiredTimeout
													;

													_testWidgetClassInstance.met('wired');

													// set widget to busy or disabled
													_testWidgetClassInstance.set(
														Math.floor(Math.random() * 2)
															? {enabled:false}
															: {busy:true}
													);

													// fire DOM node event (shouldn't actually be handled by widget)
													_testWidgetClassInstance.getNode('myNode').triggerEvent({
														name:'click'
													});

													_notFiredTimeout = setTimeout(
														function() { _continue(true) },
														0
													);
												}
											};
										}
									),
									[
										{
											title:'When fireIf is specified, the wired DOM event doesn\'t fire if the condition hasn\'t been met',
											test:function(_continue) {
												var
													_testWidgetClassInstance = _getTestWidgetClassInstance(
														{
															'#myNode:click':{
																handler:function() {
																	clearTimeout(_notFiredTimeout);
																	_continue(false);
																},
																fireIf:'foo'
															}
														},
														null,
														['myNode']
													),
													_notFiredTimeout
												;

												_testWidgetClassInstance.met('wired');

												// fire DOM node event (shouldn't actually be handled by widget)
												_testWidgetClassInstance.getNode('myNode').triggerEvent({
													name:'click'
												});

												_notFiredTimeout = setTimeout(
													function() { _continue(true) },
													0
												);
											}
										},
										{
											title:'When fireIf is specified, the wired DOM event fires when the condition has been met',
											test:function(_continue) {
												var
													_testWidgetClassInstance = _getTestWidgetClassInstance(
														{
															'#myNode:click':{
																handler:function() {
																	clearTimeout(_notFiredTimeout);
																	_continue(true);
																},
																fireIf:'foo'
															}
														},
														null,
														['myNode']
													),
													_notFiredTimeout
												;

												_testWidgetClassInstance.met('wired');
												_testWidgetClassInstance.met('foo');

												_notFiredTimeout = setTimeout(
													function() { _continue(false) },
													0
												);

												// fire DOM node event (shouldn't actually be handled by widget)
												_testWidgetClassInstance.getNode('myNode').triggerEvent({
													name:'click'
												});
											}
										}
									]
								)
							}
						]
					},
					{
						title:'Potential Collision Events',
						test:[
							_generateTest(
								'When events for a child and node with the same name are declared, the proper events are bound',
								Uize.lookup(
									[
										'foo:Click',
										'foo:Changed.bar',
										'#foo:click',
										'#foo:unload',
										'#lorem:change',
										'lorem:Changed.ipsum'
									],
									_defaultHandler
								),
								{
									'foo':{
										Click:_defaultHandler,
										'Changed.bar':_defaultHandler
									},
									'#foo':{
										click:_defaultHandler,
										unload:_defaultHandler
									},
									'#lorem':{
										change:_defaultHandler
									},
									'lorem':{
										'Changed.ipsum':_defaultHandler
									}
								},
								{
									child:{
										'foo':['Click', 'Changed.bar'],
										'lorem':['Changed.ipsum']
									},
									node:{
										'foo':['click', 'unload'],
										'lorem':['change']
									}
								}
							),
							_generateTest(
								'When events for a self and root node with the same name are declared, the proper events are bound',
								Uize.copyInto(
									Uize.lookup(
										[
											':Click',
											'#:click',
											'#:unload'
										],
										_defaultHandler
									),
									{
										':Changed.bar':_defaultChangedHandler
									}
								),
								{
									'':{
										Click:_defaultHandler,
										'Changed.bar':_defaultChangedHandler
									},
									'#':{
										click:_defaultHandler,
										unload:_defaultHandler
									}
								},
								{
									self:['Click', 'Changed.bar'],
									node:{
										'':['click', 'unload']
									}
								}
							)
						]
					},
					{
						title:'All Event Types',
						test:[
							_generateTest(
								'When all 3 types of events are declared, some with required blocks, the proper events are bound and fire at the right time',
								{
									':Click':{
										handler:_defaultHandler,
										required:['green']
									},
									':Changed.bar':_defaultChangedHandler,
									'#:click':_defaultHandler,
									'#:unload':_defaultHandler,
									'#lorem:change':{
										handler:_defaultHandler,
										required:['blah']
									},
									'lorem:Changed.ipsum':_defaultHandler,
									'foo:Click':_defaultHandler,
									'foo:Changed.bar':{
										handler:_defaultHandler,
										required:['hiya']
									},
									'#foo:click':_defaultHandler,
									'#foo:unload':_defaultHandler,
									'#a:load':_defaultHandler,
									'#a:blur':{
										handler:_defaultHandler,
										required:['red','blue']
									},
									'#a:focus':_defaultHandler,
									'#a:change':_defaultHandler
								},
								{
									'':{
										Click:{
											handler:_defaultHandler,
											required:['green']
										},
										'Changed.bar':_defaultChangedHandler
									},
									'#':{
										click:_defaultHandler,
										unload:_defaultHandler
									},
									'#lorem':{
										change:{
											handler:_defaultHandler,
											required:['blah']
										}
									},
									'lorem':{
										'Changed.ipsum':_defaultHandler
									},
									'foo':{
										Click:_defaultHandler,
										'Changed.bar':{
											handler:_defaultHandler,
											required:['hiya']
										}
									},
									'#foo':{
										click:_defaultHandler,
										unload:_defaultHandler
									},
									'#a':{
										load:_defaultHandler,
										blur:{
											handler:_defaultHandler,
											required:['red','blue']
										},
										focus:_defaultHandler,
										change:_defaultHandler
									}
								},
								{
									self:['Click', 'Changed.bar'],
									child:{
										'foo':['Click', 'Changed.bar'],
										'lorem':['Changed.ipsum']
									},
									node:{
										'':['click', 'unload'],
										'foo':['click', 'unload'],
										'lorem':['change'],
										a:['load', 'blur', 'focus', 'change']
									}
								},
								{
									node:{
										lorem:{
											change:['blah']
										},
										a:{
											blur:['red','blue']
										}
									},
									child:{
										foo:{
											'Changed.bar':['hiya']
										}
									},
									self:{
										Click:['green']
									}
								}
							)
						]
					},
					{
						title:'Edge cases',
						test:[
							{
								title:'When a bound child is removed, a fired event on the child is properly handled (no errors & not fired on parent)',
								test:function(_continue) {
									var
										_widget = _getTestWidgetClassInstance(
											{
												'childA:Click':function() { _continue(false) }
											},
											['childA']
										),
										_childToRemove = _widget.children.childA // keep reference so we'll have it after removal
									;

									_widget.removeChild(_childToRemove);

									// fire child event (shouldn't actually be handled by the parent)
									_childToRemove.fire('Click');

									setTimeout(
										function() { _continue(true) },
										0
									);
								}
							},
							{
								title:'When a bound child is removed, and a new same-named child is re-added, a child event is handled by the parent',
								test:function(_continue) {
									var
										_widget = _getTestWidgetClassInstance(
											{
												'childA:Click':function() {
													clearTimeout(_failTimeout);
													_continue(true);
												}
											},
											['childA']
										),
										_failTimeout
									;

									// remove child
									_widget.removeChild('childA');

									// add new same-named child
									var _newChild = _widget.addChild('childA', Uize.Widget);

									// this shouldn't happen because the handler should be rebound when new child was added
									_failTimeout = setTimeout(
										function() { _continue(false) },
										0
									);

									_newChild.fire('Click'); // fire child event (should be handled by parent)
								}
							},
							{
								title:'When a subclass declares the same child/event combination, the base class\' handler is called',
								test:function(_continue) {
									var
										_WidgetClass = _getTestWidgetClass(
											{
												'childA:Click':function() {
													clearTimeout(_failTimeout);
													_continue(true);
												}
											},
											['childA']
										),
										_WidgetSubclass = _WidgetClass.subclass(
											_Uize.pairUp(
												_eventBindingsFunctionName,
												{
													'childA:Click':_Uize.nop
												}
											)
										),
										_failTimeout
									;

									// this shouldn't happen because the base class' handler should be called
									_failTimeout = setTimeout(
										function() { _continue(false) },
										0
									);

									_WidgetSubclass().children.childA.fire('Click');
								}
							}
						]
					},
					{
						title:'Restore the global window object',
						test:function() {
							_global.window = _originalWindow;
							return true;
						}
					}
				]
			}
		});
	}
});
