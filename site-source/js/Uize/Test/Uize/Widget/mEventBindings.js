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
	codeCompleteness: 5
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
			_defaultHandler = function(_event, _source) { _event.handler.call(this, _event, _source) }
		;
		
		_global.window = _global;  // For Uize.Dom.Basics
		
		function _generateTest(_title, _eventBindings, _wiredEvents) {
			function _getMockWidgetClass(_children) {
				return Uize.Widget.subclass ({
					mixins:Uize.Widget.mEventBindings,
					omegastructor:function() {
						this.addChildren(Uize.lookup(_children, {widgetClass:Uize.Widget}));
					},
					eventBindings:_eventBindings
				});
			}
			
			function _getMockWidgetInstance(_children, _nodes) {
				var _nodeMap = {};
				
				if (Uize.isArray(_nodes)) {
					for (var _nodeNo = -1; ++_nodeNo < _nodes.length;)
						_nodeMap[_nodes[_nodeNo]] = _getMockDomNode()
					;
				}
				
				return _getMockWidgetClass(_children)({
					nodeMap:_nodeMap
				});
			}
			
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
							Uize.applyAll(this, this._events[_event.name], [_event]);
						}
					}
				}) ();
			}
		
			function _expectAll(_obj, _expectFunc) {
				for (var _key in _obj) {
					if (!_expectFunc(_obj[_key], _key))
						return false;
				}
				
				return true;
			}
			
			return {
				title:_title,
				test:[
					{
						title:'Widget class is a function (not null)',
						test:function() { return this.expectFunction(_getMockWidgetClass()) }
					},
					{
						title:'Widget instance is an object (not null)',
						test:function() { return this.expectObject(_getMockWidgetInstance()) }
					},
					{
						title:'Self events are properly bucketed',
						test:function() {
							return !_wiredEvents
								|| Uize.isEmpty(_wiredEvents.self)
								|| this.expect(
									Uize.lookup(_wiredEvents.self),
									Uize.lookup(
										Uize.keys(_getMockWidgetClass().mEventBindings_widget[''])
									)
								)
							;
						}
					},
					{
						title:'Self events are successfully fired',
						test:[
							{
								title:'Handler is called',
								test:function(_continue) {
									if (!_wiredEvents || Uize.isEmpty(_wiredEvents.self))
										return true;
									
									var _mockInstance = _getMockWidgetInstance();
									_processArrayAsync(
										_wiredEvents.self,
										function(_eventName, _nextEventFunc) {
											_mockInstance.fire({
												name:_eventName,
												handler:_nextEventFunc
											});
										},
										function() { _continue(true) }
									);
								}
							},
							{
								title:'"this" context is widget',
								test:function(_continue) {
									if (!_wiredEvents || Uize.isEmpty(_wiredEvents.self))
										return true;
									
									var _mockInstance = _getMockWidgetInstance();
									_processArrayAsync(
										_wiredEvents.self,
										function(_eventName, _nextEventFunc) {
											_mockInstance.fire({
												name:_eventName,
												handler:function() {
													this == _mockInstance
														? _nextEventFunc()
														: _continue(false)
													;
												}
											});
										},
										function() { _continue(true) }
									);
								}
							},
							{
								title:'First argument is event object',
								test:function(_continue) {
									if (!_wiredEvents || Uize.isEmpty(_wiredEvents.self))
										return true;
									
									var _mockInstance = _getMockWidgetInstance();
									_processArrayAsync(
										_wiredEvents.self,
										function(_eventName, _nextEventFunc) {
											_mockInstance.fire({
												name:_eventName,
												handler:function(_event) {
													_event.name == _eventName
														? _nextEventFunc()
														: _continue(false)
													;
												}
											});
										},
										function() { _continue(true) }
									);
								}
							},
							{
								title:'Second argument is source object',
								test:function(_continue) {
									if (!_wiredEvents || Uize.isEmpty(_wiredEvents.self))
										return true;
									
									var _mockInstance = _getMockWidgetInstance();
									_processArrayAsync(
										_wiredEvents.self,
										function(_eventName, _nextEventFunc) {
											_mockInstance.fire({
												name:_eventName,
												handler:function(_event, _source) {
													_source == _mockInstance
														? _nextEventFunc()
														: _continue(false)
													;
												}
											});
										},
										function() { _continue(true) }
									);
								}
							}
						]
					},
					{
						title:'Child events are properly bucketed',
						test:function() {
							var m = this;
							return !_wiredEvents
								|| Uize.isEmpty(_wiredEvents.child)
								|| _expectAll(
									_getMockWidgetClass().mEventBindings_widget,
									function (_bindings, _widgetName) {
										return _widgetName == ''
											|| m.expect(
												Uize.lookup(_wiredEvents.child[_widgetName]),
												Uize.lookup(Uize.keys(_bindings))
											)
										;
									}
								)
							;
						}
					},
					{
						title:'Child events are successfully fired',
						test:[
							{
								title:'Handler is called',
								test:function(_continue) {
									if (!_wiredEvents || Uize.isEmpty(_wiredEvents.child))
										return true;
									
									var
										_childNames = Uize.keys(_wiredEvents.child),
										_mockInstance = _getMockWidgetInstance(_childNames)
									;
									_processArrayAsync(
										_childNames,
										function(_childName, _nextChildFunc) {
											_processArrayAsync(
												_wiredEvents.child[_childName],
												function(_eventName, _nextEventFunc) {
													_mockInstance.children[_childName].fire({
														name:_eventName,
														handler:_nextEventFunc
													});
												},
												_nextChildFunc
											);
										},
										function() { _continue(true) }
									);
								}
							},
							{
								title:'"this" context is widget',
								test:function(_continue) {
									if (!_wiredEvents || Uize.isEmpty(_wiredEvents.child))
										return true;
									
									var
										_childNames = Uize.keys(_wiredEvents.child),
										_mockInstance = _getMockWidgetInstance(_childNames)
									;
									_processArrayAsync(
										_childNames,
										function(_childName, _nextChildFunc) {
											_processArrayAsync(
												_wiredEvents.child[_childName],
												function(_eventName, _nextEventFunc) {
													_mockInstance.children[_childName].fire({
														name:_eventName,
														handler:function() {
															this == _mockInstance
																? _nextEventFunc()
																: _continue(false)
															;
														}
													});
												},
												_nextChildFunc
											);
										},
										function() { _continue(true) }
									);
								}
							},
							{
								title:'First argument is event object',
								test:function(_continue) {
									if (!_wiredEvents || Uize.isEmpty(_wiredEvents.child))
										return true;
									
									var
										_childNames = Uize.keys(_wiredEvents.child),
										_mockInstance = _getMockWidgetInstance(_childNames)
									;
									_processArrayAsync(
										_childNames,
										function(_childName, _nextChildFunc) {
											_processArrayAsync(
												_wiredEvents.child[_childName],
												function(_eventName, _nextEventFunc) {
													_mockInstance.children[_childName].fire({
														name:_eventName,
														handler:function(_event) {
															_event.name == _eventName
																? _nextEventFunc()
																: _continue(false)
															;
														}
													});
												},
												_nextChildFunc
											);
										},
										function() { _continue(true) }
									);
								}
							},
							{
								title:'Second argument is source object',
								test:function(_continue) {
									if (!_wiredEvents || Uize.isEmpty(_wiredEvents.child))
										return true;
									
									var
										_childNames = Uize.keys(_wiredEvents.child),
										_mockInstance = _getMockWidgetInstance(_childNames)
									;
									_processArrayAsync(
										_childNames,
										function(_childName, _nextChildFunc) {
											_processArrayAsync(
												_wiredEvents.child[_childName],
												function(_eventName, _nextEventFunc) {
													_mockInstance.children[_childName].fire({
														name:_eventName,
														handler:function(_event, _source) {
															_source == _mockInstance.children[_childName]
																? _nextEventFunc()
																: _continue(false)
															;
														}
													});
												},
												_nextChildFunc
											);
										},
										function() { _continue(true) }
									);
								}
							}
						]
					},
					{
						title:'Node events are properly bucketed',
						test:function() {
							var m = this;
							return !_wiredEvents
								|| Uize.isEmpty(_wiredEvents.node)
								|| _expectAll(
									_getMockWidgetClass().mEventBindings_dom,
									function (_bindings, _nodeName) {
										return m.expect(
											Uize.lookup(_wiredEvents.node[_nodeName]),
											Uize.lookup(Uize.keys(_bindings))
										);
									}
								)
							;
						}
					},
					{
						title:'Node events do not fire before wire',
						test:[
							
						]
					},
					{
						title:'Node events are successfully fired',
						test:[
							{
								title:'Handler is called',
								test:function(_continue) {
									if (!_wiredEvents || Uize.isEmpty(_wiredEvents.node))
										return true;
									
									var
										_nodeNames = Uize.keys(_wiredEvents.node),
										_mockInstance = _getMockWidgetInstance(null, _nodeNames)
									;
									
									_mockInstance.set({wired:true});
									
									_processArrayAsync(
										_nodeNames,
										function(_nodeName, _nextNodeFunc) {
											_processArrayAsync(
												_wiredEvents.node[_nodeName],
												function(_eventName, _nextEventFunc) {
													_mockInstance.getNode(_nodeName).triggerEvent({
														name:_eventName,
														handler:_nextEventFunc
													});
												},
												_nextNodeFunc
											);
										},
										function() { _continue(true) }
									);
								}
							},
							{
								title:'"this" context is widget',
								test:function(_continue) {
									if (!_wiredEvents || Uize.isEmpty(_wiredEvents.node))
										return true;
									
									var
										_nodeNames = Uize.keys(_wiredEvents.node),
										_mockInstance = _getMockWidgetInstance(null, _nodeNames)
									;
									
									_mockInstance.set({wired:true});
									
									_processArrayAsync(
										_nodeNames,
										function(_nodeName, _nextNodeFunc) {
											_processArrayAsync(
												_wiredEvents.node[_nodeName],
												function(_eventName, _nextEventFunc) {
													_mockInstance.getNode(_nodeName).triggerEvent({
														name:_eventName,
														handler:function() {
															this == _mockInstance
																? _nextEventFunc()
																: _continue(false)
															;
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
							{
								title:'First argument is event object',
								test:function(_continue) {
									if (!_wiredEvents || Uize.isEmpty(_wiredEvents.node))
										return true;
									
									var
										_nodeNames = Uize.keys(_wiredEvents.node),
										_mockInstance = _getMockWidgetInstance(null, _nodeNames)
									;
									
									_mockInstance.set({wired:true});
									
									_processArrayAsync(
										_nodeNames,
										function(_nodeName, _nextNodeFunc) {
											_processArrayAsync(
												_wiredEvents.node[_nodeName],
												function(_eventName, _nextEventFunc) {
													_mockInstance.getNode(_nodeName).triggerEvent({
														name:_eventName,
														handler:function(_event) {
															_event.name == _eventName
																? _nextEventFunc()
																: _continue(false)
															;
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
							{
								title:'Second argument is source object',
								test:function(_continue) {
									if (!_wiredEvents || Uize.isEmpty(_wiredEvents.node))
										return true;
									
									var
										_nodeNames = Uize.keys(_wiredEvents.node),
										_mockInstance = _getMockWidgetInstance(null, _nodeNames)
									;
									
									_mockInstance.set({wired:true});
									
									_processArrayAsync(
										_nodeNames,
										function(_nodeName, _nextNodeFunc) {
											_processArrayAsync(
												_wiredEvents.node[_nodeName],
												function(_eventName, _nextEventFunc) {
													_mockInstance.getNode(_nodeName).triggerEvent({
														name:_eventName,
														handler:function(_event, _source) {
															_source == _mockInstance.getNode(_nodeName)
																? _nextEventFunc()
																: _continue(false)
															;
														}
													});
												},
												_nextNodeFunc
											);
										},
										function() { _continue(true) }
									);
								}
							}
						]
					}
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
					title:'Verbose Syntax',
					test:[
						{
							title:'Child Events',
							test:[
								_generateTest(
									'When a single child with a single event binding is declared, only that child event is bound',
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
								)
							]
						},
						{
							title:'Self Events',
							test:[
								_generateTest(
									'When a single event binding is declared, only that event is bound',
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
										'':{
											Click:_defaultHandler,
											'Changed.value':_defaultHandler
										}
									},
									{
										self:['Click', 'Changed.value']	
									}
								)
							]
						},
						{
							title:'Node Events',
							test:[
								_generateTest(
									'When a single node with a single event binding is declared, only that node event is bound',
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
									'When a single node with multiple event bindings are separately declared, all of those events for that node are bound',
									{
										'#foo':{
											mousemove:_defaultHandler
										},
										'#lorem':{
											mouseout:_defaultHandler
										}
									},
									{
										node:{
											foo:['mousemove'],
											lorem:['mouseout']
										}
									}
								),
								_generateTest(
									'When a multiple nodes each with a single event binding are declared, only the one event for each node is bound',
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
								)
							]
						},
						{
							title:'Potential Collision Events',
							test:[
								_generateTest(
									'When events for a child and node with the same name are declared, the proper events are bound'
								),
								_generateTest(
									'When events for a self and root node with the same name are declared, the proper events are bound'
								)
							]
						},
						{
							title:'All Event Types',
							test:[
								_generateTest(
									'When all 3 types of events are declared, the proper events are bound'
								)
							]
						},
						{
							title:'Required Children',
							test:[
								
							]
						}
					]
				},
				{
					title:'Shorthand Syntax',
					test:[
						
					]
				}
			]
		});
	}
});

