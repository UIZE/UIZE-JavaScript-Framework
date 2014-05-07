/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Widget.mEventBindings Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
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
		The =Uize.Test.Uize.Widget.mEventBindings= module defines a suite of unit tests for the =Uize.Widget.mEventBindings= mixin module.

		*DEVELOPERS:* `Ben Ilegbodu`, original code donated by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Test.Uize.Widget.mEventBindings',
	required:[
		'Uize.Comm',
		'Uize.Class'
	],
	builder:function () {
		'use strict';
		
		var
			_global = Uize.global(),
			_processArrayAsync = Uize.Comm.processArrayAsync,
			_defaultHandler = function(_event, _source) { _event.handler.call(this, _event, _source) },
			_originalWindow = _global.window
		;
		
		_global.window = _global;  // For Uize.Dom.Basics

		function _getMockDomNode() {
			return Uize.Class.subclass({
				alphastructor:function() {
					this._events = {};
				},
				instanceProperties:{
					tagName:'DIV',
					nodeType:1
				},
				instanceMethods:{
					addEventListener:function(_eventName, _handler) {
						(this._events[_eventName] || (this._events[_eventName] = [])).push(_handler);
					},
					triggerEvent:function(_event) {
						this._events[_event.name]
							&& Uize.applyAll(this, this._events[_event.name], [_event]);
					}
				}
			}) ();
		}

		function _getTestWidgetClass(_eventBindings, _children) {
			return Uize.Widget.subclass ({
				mixins:Uize.Widget.mEventBindings,
				omegastructor:function() {
					this.addChildren(Uize.lookup(_children, {widgetClass:Uize.Widget}));
				},
				eventBindings:_eventBindings
			});
		}
		
		function _getTestWidgetClassInstance(_eventBindings, _children, _nodes) {
			var _nodeMap = {};
			
			if (Uize.isArray(_nodes)) {
				for (var _nodeNo = -1; ++_nodeNo < _nodes.length;)
					_nodeMap[_nodes[_nodeNo]] = _getMockDomNode()
				;
			}
			
			return _getTestWidgetClass(_eventBindings, _children)({
				nodeMap:_nodeMap
			});
		}
		
		function _generateTest(_title, _eventBindingsShorthand, _eventBindingsVerbose, _wiredEvents, _deferredChildren) {
			function _generateSyntaxTests(_isVerbose) {
				var _eventBindings = _isVerbose ? _eventBindingsVerbose : _eventBindingsShorthand;

				function _getSyntaxTestWidgetClass(_children) {
					return _getTestWidgetClass(_eventBindings, _children);
				}
				
				function _getSyntaxTestWidgetClassInstance(_children, _nodes) {
					return _getTestWidgetClassInstance(_eventBindings, _children, _nodes);
				}
				
				function _generateFireTests(_type) {
					var _fireEventMethodName = _type == 'node' ? 'triggerEvent' : 'fire';
					
					function _generateFireTest(_expectFunc) {
						return function(_continue) {
							if (!_wiredEvents || Uize.isEmpty(_wiredEvents[_type]))
								return true;
							
							var
								_typeEvents = _wiredEvents[_type],
								_names = _type == 'self' ? ['self'] : Uize.keys(_typeEvents),
								_mockInstance = _getSyntaxTestWidgetClassInstance(
									_type == 'child' ? _names : undefined,
									_type == 'node' ? _names : undefined
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
													? _mockInstance
													: (_type == 'child'
														? _mockInstance.children[_objectName]
														: _mockInstance.getNode(_objectName)
													),
												_fireEvent = function(_fireHandler) {
													_objectToFireOn[_fireEventMethodName]({
														name:_eventName,
														handler:_fireHandler
													});
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
																	_mockInstance:_mockInstance,
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
											
											_type == 'node' && _mockInstance.set('wired', true);
											
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
																_mockInstance.addChild(_deferredChildName, Uize.Widget);
																
																_nextDeferredChildFunc();
															}
														);
													},
													function() {
														// Verify event is fired
														_verifyEventFired(
															function() {
																// Remove a random child
																_mockInstance.removeChild(
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
										this == _data._mockInstance
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
									_mockInstance = _getSyntaxTestWidgetClassInstance(null, _nodeNames)
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
												_mockInstance.getNode(_nodeName).triggerEvent({
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

		return Uize.Test.resolve ({
			title:'Uize.Widget.mEventBindings Module Test',
			test:[
				Uize.Test.requiredModulesTest ([
					'Uize.Widget',
					'Uize.Widget.mEventBindings'
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
							Uize.lookup(
								[
									':Click',
									':Changed.value'
								],
								_defaultHandler
							),
							{
								'':{
									Click:_defaultHandler,
									'Changed.value':_defaultHandler
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
						)
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
							Uize.lookup(
								[
									':Click',
									':Changed.bar',
									'#:click',
									'#:unload'
								],
								_defaultHandler
							),
							{
								'':{
									Click:_defaultHandler,
									'Changed.bar':_defaultHandler
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
								':Changed.bar':_defaultHandler,
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
									'Changed.bar':_defaultHandler
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
							_WidgetSubclass = _WidgetClass.subclass({
								eventBindings:{
									'childA:Click':function() { }
								}
							}),
							_failTimeout
						;
						
						// this shouldn't happen because the handler should be rebound when new child was added
						_failTimeout = setTimeout(
							function() { _continue(false) }, 
							0
						);
						
						_WidgetSubclass().children.childA.fire('Click');
					}
				},
				{
					title:'When a subclass declares the same child/event combination, the subclass class\' handler is called',
					test:[]
				},
				{
					title:'Fake Test to reset global window object',
					test:function() {
						_global.window = _originalWindow;
						return true;	
					}
				}
			]
		});
	}
});

