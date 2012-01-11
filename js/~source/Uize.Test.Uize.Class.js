/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Class Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Test
	importance: 8
	codeCompleteness: 40
	testCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Class= module defines a suite of unit tests for the =Uize.Class= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Class',
	required:[
		'Uize.Data',
		'Uize.Class'
	],
	builder:function () {
		function _copyArguments (_arguments) {
			var _result = [];
			_result.push.apply (_result,_arguments);
			return _result;
		}

		function _eventsSystemTest (_title,_isInstance) {
			function _getEventSource () {
				return _isInstance ? Uize.Class () : Uize.Class.subclass ();
			}
			return {
				title:_title,
				test:[
					{
						title:'Test that firing an event for which no handler is registered has no ill effect',
						test:function () {
							_getEventSource ().fire ('testEvent');
							return true;
						}
					},
					{
						title:'Test that firing an event for which a handler is registered works correctly',
						test:function () {
							var
								_success = false,
								_eventSource = _getEventSource ()
							;
							_eventSource.wire ('testEvent',function () {_success = true});
							_eventSource.fire ('testEvent');
							return _success;
						}
					},
					{
						title:
							'Test that an event handler function receives a single object parameter, and that this event object contains a name property whose value matches the name of the fired event',
						test:function () {
							var
								_success = false,
								_eventSource = _getEventSource ()
							;
							_eventSource.wire (
								'testEvent',
								function (_event) {
									_success =
										arguments.length == 1 &&
										typeof _event == 'object' && _event &&
										_event.name == 'testEvent'
									;
								}
							);
							_eventSource.fire ('testEvent');
							return _success;
						}
					},
					{
						title:
							'Test that the event object provided to an event handler has a source property, whose value is a reference to the object on which the event was fired',
						test:function () {
							var
								_success = false,
								_eventSource = _getEventSource ()
							;
							_eventSource.wire ('testEvent',function (_event) {_success = _event.source === _eventSource});
							_eventSource.fire ('testEvent');
							return _success;
						}
					},
					{
						title:
							'Test that firing an event for which two handlers are registered results in the handlers being exucuted in the order registered',
						test:function () {
							var
								_coverageAndOrder = [],
								_eventSource = _getEventSource ()
							;
							_eventSource.wire ('testEvent',function () {_coverageAndOrder.push ('handler1')});
							_eventSource.wire ('testEvent',function () {_coverageAndOrder.push ('handler2')});
							_eventSource.fire ('testEvent');
							return this.expect ('handler1,handler2',_coverageAndOrder + '');
						}
					},
					{
						title:
							'Test that firing an event for which more than two handlers are registered results in the handlers being exucuted in the order registered',
						test:function () {
							var
								_coverageAndOrder = [],
								_eventSource = _getEventSource ()
							;
							_eventSource.wire ('testEvent',function () {_coverageAndOrder.push ('handler1')});
							_eventSource.wire ('testEvent',function () {_coverageAndOrder.push ('handler2')});
							_eventSource.wire ('testEvent',function () {_coverageAndOrder.push ('handler3')});
							_eventSource.wire ('testEvent',function () {_coverageAndOrder.push ('handler4')});
							_eventSource.fire ('testEvent');
							return this.expect ('handler1,handler2,handler3,handler4',_coverageAndOrder + '');
						}
					},
					{
						title:'Test that firing an event using the alternate event object form is handled correctly',
						test:function () {
							var
								_success = false,
								_eventSource = _getEventSource ()
							;
							_eventSource.wire ('testEvent',function () {_success = true});
							_eventSource.fire ({name:'testEvent'});
							return _success;
						}
					},
					{
						title:
							'Test that extra event object properties that are specified when firing an event are accessible on the event object in the handler',
						test:function () {
							var
								_success = false,
								_eventSource = _getEventSource ()
							;
							_eventSource.wire (
								'testEvent',
								function (_event) {_success = _event.foo == 'bar' && _event.hello == 'world'}
							);
							_eventSource.fire ({
								name:'testEvent',
								foo:'bar',
								hello:'world'
							});
							return _success;
						}
					},
					{
						title:
							'Test that the same event object is passed to all handlers for an event and is also returned as the result of the fire method',
						test:function () {
							var
								_eventSource = _getEventSource (),
								_handler1ReceivedEvent,
								_handler2ReceivedEvent
							;
							_eventSource.wire (
								'testEvent',
								function (_event) {
									_handler1ReceivedEvent = _event;
									_event.foo = 'bar';
								}
							);
							_eventSource.wire (
								'testEvent',
								function (_event) {
									_handler2ReceivedEvent = _event;
									_event.hello = 'world';
								}
							);
							var _event = _eventSource.fire ('testEvent');
							return (
								_event == _handler1ReceivedEvent &&
								_event == _handler2ReceivedEvent &&
								_event.foo == 'bar' && _event.hello == 'world'
							);
						}
					},
					{
						title:'Test that unwiring an event handler results in that handler no longer being executed',
						test:function () {
							var
								_success = false,
								_eventSource = _getEventSource ()
							;
							function _handler () {_success = !_success}

							_eventSource.wire ('testEvent',_handler);
							_eventSource.fire ('testEvent');
							_eventSource.unwire ('testEvent',_handler);
							_eventSource.fire ('testEvent');

							return _success;
						}
					},
					{
						title:
							'Test that the special wildcard event name results in the handler being executed for all events, and that it can be unwired successfully',
						test:function () {
							var
								_expectedCoverageAndOrder = 'testEvent1,testEvent2,testEvent3',
								_handler1CoverageAndOrder = [],
								_handler2CoverageAndOrder = [],
								_handler3CoverageAndOrder = [],
								_eventSource = _getEventSource ()
							;
							function _handler1 (_event) {_handler1CoverageAndOrder.push (_event.name)}
							function _handler2 (_event) {_handler2CoverageAndOrder.push (_event.name)}
							function _handler3 (_event) {_handler3CoverageAndOrder.push (_event.name)}

							_eventSource.wire ('*',_handler1);
							_eventSource.wire ('*',_handler2);
							_eventSource.wire ('*',_handler3);
							_eventSource.fire ('testEvent1');
							_eventSource.fire ('testEvent2');
							_eventSource.fire ('testEvent3');
							_eventSource.unwire ('*',_handler1);
							_eventSource.unwire ('*',_handler2);
							_eventSource.unwire ('*',_handler3);
							_eventSource.fire ('testEvent1');
							_eventSource.fire ('testEvent2');
							_eventSource.fire ('testEvent3');

							return (
								_handler1CoverageAndOrder + '' == _expectedCoverageAndOrder &&
								_handler2CoverageAndOrder + '' == _expectedCoverageAndOrder &&
								_handler3CoverageAndOrder + '' == _expectedCoverageAndOrder
							);
						}
					},
					{
						title:
							'Test that when the second of three event handlers is unwired, the execution order of the remaining two handlers is preserved',
						test:function () {
							var
								_coverageAndOrder = [],
								_eventSource = _getEventSource ()
							;
							_eventSource.wire ('testEvent',function () {_coverageAndOrder.push ('handler1')});
							function _handler2 () {_coverageAndOrder.push ('handler2')}
							_eventSource.wire ('testEvent',_handler2);
							_eventSource.wire ('testEvent',function () {_coverageAndOrder.push ('handler3')});
							_eventSource.unwire ('testEvent',_handler2);
							_eventSource.fire ('testEvent');
							return this.expect ('handler1,handler3',_coverageAndOrder + '');
						}
					},
					{
						title:
							'Test that wiring handlers for multiple different events using the event-names-to-handlers map is handled correctly',
						test:function () {
							var
								_event1HandlerCalled,
								_event2HandlerCalled,
								_event3HandlerCalled,
								_eventSource = _getEventSource ()
							;
							_eventSource.wire ({
								testEvent1:function () {_event1HandlerCalled = true},
								testEvent2:function () {_event2HandlerCalled = true},
								testEvent3:function () {_event3HandlerCalled = true}
							});
							_eventSource.fire ('testEvent1');
							_eventSource.fire ('testEvent2');
							_eventSource.fire ('testEvent3');
							return _event1HandlerCalled && _event2HandlerCalled && _event3HandlerCalled;
						}
					},
					{
						title:
							'Test that unwiring handlers for multiple different events using the event-names-to-handlers map is handled correctly',
						test:function () {
							var
								_event1Success = false,
								_event2Success = false,
								_event3Success = false,
								_eventSource = _getEventSource ()
							;
							function _fireAllEvents () {
								_eventSource.fire ('testEvent1');
								_eventSource.fire ('testEvent2');
								_eventSource.fire ('testEvent3');
							}
							var _eventsToHandlersMap = {
								testEvent1:function () {_event1Success = !_event1Success},
								testEvent2:function () {_event2Success = !_event2Success},
								testEvent3:function () {_event3Success = !_event3Success}
							};
							_eventSource.wire (_eventsToHandlersMap);
							_fireAllEvents();
							_eventSource.unwire (_eventsToHandlersMap);
							_fireAllEvents();
							return _event1Success && _event2Success && _event3Success;
						}
					},
					{
						title:
							'Test that not specifying a handler when unwiring an event results in all handlers for that event being unwired',
						test:function () {
							var
								_handler1Success = false,
								_handler2Success = false,
								_handler3Success = false,
								_eventSource = _getEventSource ()
							;
							_eventSource.wire ('testEvent',function () {_handler1Success = !_handler1Success});
							_eventSource.wire ('testEvent',function () {_handler2Success = !_handler2Success});
							_eventSource.wire ('testEvent',function () {_handler3Success = !_handler3Success});
							_eventSource.fire ('testEvent');
							_eventSource.unwire ('testEvent');
							_eventSource.fire ('testEvent');

							return _handler1Success && _handler2Success && _handler3Success;
						}
					},
					{
						title:
							'Test that unwiring a handler for the special wildcard event results in just that handler being unwired, rather than all handlers for the wildcard event or all handlers for all events',
						test:function () {
							var
								_coverageAndOrder = [],
								_eventSource = _getEventSource ()
							;
							function _handler1 () {_coverageAndOrder.push ('handler1')}
							_eventSource.wire ('*',_handler1);
							_eventSource.wire ('*',function () {_coverageAndOrder.push ('handler2')});
							_eventSource.wire ('testEvent',function () {_coverageAndOrder.push ('handler3')});
							_eventSource.fire ('testEvent');
							_eventSource.unwire ('*',_handler1);
							_eventSource.fire ('testEvent');

							return this.expect ('handler1,handler2,handler3,handler2,handler3',_coverageAndOrder + '');
						}
					},
					_isInstance
						? {
							title:'Test that event bubbling works correctly for instances',
							test:[
								{
									title:
										'Test that setting the bubble event property to true when firing an event on an instance with no parent is not fatal and results in a handler wired for that event being executed',
									test:function () {
										var
											_eventSource = _getEventSource (),
											_success = false
										;
										_eventSource.wire ('testEvent',function () {_success = true});
										_eventSource.fire ({name:'testEvent',bubble:true});
										return _success;
									}
								},
								{
									title:
										'Test that setting the bubble event property to true when firing an event on an instance with a parent causes that event to fire first on the instance and then on its parent',
									test:function () {
										var
											_coverageAndOrder = [],
											_eventSource = _getEventSource (),
											_eventSourceParent = _getEventSource ()
										;
										_eventSource.parent = _eventSourceParent;
										_eventSource.wire (
											'testEvent',
											function () {_coverageAndOrder.push ('sourceHandler')}
										);
										_eventSourceParent.wire (
											'testEvent',
											function () {_coverageAndOrder.push ('sourceParentHandler')}
										);
										_eventSource.fire ({name:'testEvent',bubble:true});
										return this.expect ('sourceHandler,sourceParentHandler',_coverageAndOrder + '');
									}
								},
								{
									title:
										'Test that a bubbling event is fired on all instances up the parent chain',
									test:function () {
										var
											_coverageAndOrder = [],
											_eventSource = _getEventSource (),
											_eventSourceParent = _getEventSource (),
											_eventSourceParentParent = _getEventSource (),
											_expectedCoverageAndOrder = [
												'sourceHandler',
												'sourceParentHandler',
												'sourceParentParentHandler'
											]
										;
										_eventSource.parent = _eventSourceParent;
										_eventSourceParent.parent = _eventSourceParentParent;
										_eventSource.wire (
											'testEvent',
											function () {_coverageAndOrder.push (_expectedCoverageAndOrder [0])}
										);
										_eventSourceParent.wire (
											'testEvent',
											function () {_coverageAndOrder.push (_expectedCoverageAndOrder [1])}
										);
										_eventSourceParentParent.wire (
											'testEvent',
											function () {_coverageAndOrder.push (_expectedCoverageAndOrder [2])}
										);
										_eventSource.fire ({name:'testEvent',bubble:true});
										return this.expect (_expectedCoverageAndOrder + '',_coverageAndOrder + '');
									}
								},
								{
									title:
										'Test that the event object provided to all handlers of a bubbling event up the parent chain is the same event object',
									test:function () {
										var
											_eventSource = _getEventSource (),
											_eventSourceParent = _getEventSource (),
											_eventSourceParentParent = _getEventSource (),
											_eventSourceHandlerReceivedEvent,
											_eventSourceParentHandlerReceivedEvent,
											_eventSourceParentParentHandlerReceivedEvent,
											_eventFired = {
												name:'testEvent',
												bubble:true
											}
										;
										_eventSource.parent = _eventSourceParent;
										_eventSourceParent.parent = _eventSourceParentParent;
										_eventSource.wire (
											'testEvent',
											function (_event) {
												_eventSourceHandlerReceivedEvent = _event;
												_event.foo = 'bar';
											}
										);
										_eventSourceParent.wire (
											'testEvent',
											function (_event) {
												_eventSourceParentHandlerReceivedEvent = _event;
												_event.hello = 'world';
											}
										);
										_eventSourceParentParent.wire (
											'testEvent',
											function (_event) {
												_eventSourceParentParentHandlerReceivedEvent = _event;
												_event.duck = 'typing';
											}
										);
										var _event = _eventSource.fire (_eventFired);
										return (
											_event == _eventFired &&
											_eventSourceHandlerReceivedEvent == _eventFired &&
											_eventSourceParentHandlerReceivedEvent == _eventFired &&
											_eventSourceParentParentHandlerReceivedEvent == _eventFired &&
											_event.foo == 'bar' && _event.hello == 'world' && _event.duck == 'typing'
										);
									}
								},
								{
									title:
										'Test that a bubbling event can be canceled by a handler of the bubbled event, so that it will not be fired on a higher parent',
									test:function () {
										var
											_coverageAndOrder = [],
											_eventSource = _getEventSource (),
											_eventSourceParent = _getEventSource (),
											_eventSourceParentParent = _getEventSource ()
										;
										_eventSource.parent = _eventSourceParent;
										_eventSourceParent.parent = _eventSourceParentParent;
										_eventSource.wire (
											'testEvent',
											function () {_coverageAndOrder.push ('sourceHandler')}
										);
										_eventSourceParent.wire (
											'testEvent',
											function (_event) {
												_coverageAndOrder.push ('sourceParentHandler');
												_event.bubble = false;
											}
										);
										_eventSourceParentParent.wire (
											'testEvent',
											function () {_coverageAndOrder.push ('sourceParentParentHandler')}
										);
										_eventSource.fire ({name:'testEvent',bubble:true});
										return this.expect ('sourceHandler,sourceParentHandler',_coverageAndOrder + '');
									}
								},
								{
									title:
										'Test that the event object for a bubbling event always has the instance on which the event was originally fired as the value for the source property',
									test:function () {
										var
											_eventSource = _getEventSource (),
											_eventSourceParent = _getEventSource (),
											_eventSourceParentParent = _getEventSource (),
											_eventSourceHandlerSource,
											_eventSourceParentHandlerSource,
											_eventSourceParentParentHandlerSource
										;
										_eventSource.parent = _eventSourceParent;
										_eventSourceParent.parent = _eventSourceParentParent;
										_eventSource.wire (
											'testEvent',
											function (_event) {_eventSourceHandlerSource = _event.source}
										);
										_eventSourceParent.wire (
											'testEvent',
											function (_event) {_eventSourceParentHandlerSource = _event.source}
										);
										_eventSourceParentParent.wire (
											'testEvent',
											function (_event) {_eventSourceParentParentHandlerSource = _event.source}
										);
										_eventSource.fire ({name:'testEvent',bubble:true});
										return (
											_eventSourceHandlerSource == _eventSource &&
											_eventSourceParentHandlerSource == _eventSource &&
											_eventSourceParentParentHandlerSource == _eventSource
										);
									}
								}
							]
						} : {
							title:'Test that event bubbling is ignored for classes',
							test:[
								{
									title:
										'Test that setting the bubble event property to true when firing an event on a class with no parent (as it should be) is not fatal and results in a handler wired for that event being executed',
									test:function () {
										var
											_eventSource = _getEventSource (),
											_success = false
										;
										_eventSource.wire ('testEvent',function () {_success = true});
										_eventSource.fire ({name:'testEvent',bubble:true});
										return _success;
									}
								},
								{
									title:
										'Test that setting the bubble event property to true when firing an event on a class with a parent (which is not exactly valid) is not fatal and results in a handler wired for that event being executed',
									test:function () {
										var
											_coverageAndOrder = [],
											_eventSource = _getEventSource (),
											_eventSourceParent = _getEventSource ()
										;
										_eventSource.parent = _eventSourceParent;
										_eventSource.wire (
											'testEvent',
											function () {_coverageAndOrder.push ('sourceHandler')}
										);
										_eventSourceParent.wire (
											'testEvent',
											function () {_coverageAndOrder.push ('sourceParentHandler')}
										);
										_eventSource.fire ({name:'testEvent',bubble:true});
										return this.expect ('sourceHandler',_coverageAndOrder + '');
									}
								}
							]
						}
				]
			};
		}

		function _setMethodTest (_title,_isInstance) {
			return {
				title:_title,
				test:[
					{
						title:
							'Test that values can be set for multiple properties by calling the set method with a single argument, which is an object containing an arbitrary number of property name to property value mappings',
						test:function () {
							var _Subclass = Uize.Class.subclass ();
							_Subclass.registerProperties ({
								property1:{},
								property2:{},
								property3:{}
							});
							var _testContext = _isInstance ? new _Subclass : _Subclass;
							_testContext.set ({
								property1:'property1Value',
								property2:'property2Value',
								property3:'property3Value'
							});
							return (
								this.expect ('property1Value',_testContext.get ('property1')) &&
								this.expect ('property2Value',_testContext.get ('property2')) &&
								this.expect ('property3Value',_testContext.get ('property3'))
							);
						}
					},
					{
						title:
							'Test that a value can be set for a single property by calling the set method with two arguments, where the first argument is the property\'s name and the second is the property\'s value',
						test:function () {
							var _Subclass = Uize.Class.subclass ();
							_Subclass.registerProperties ({property1:{}});
							var _testContext = _isInstance ? new _Subclass : _Subclass;
							_testContext.set ('property1','property1Value');
							return this.expect ('property1Value',_testContext.get ('property1'));
						}
					},
					{
						title:
							'Test that values can be set for multiple properties by calling the set method with more than two arguments, where the arguments are property name-value pairs',
						test:function () {
							var _Subclass = Uize.Class.subclass ();
							_Subclass.registerProperties ({
								property1:{},
								property2:{},
								property3:{}
							});
							var _testContext = _isInstance ? new _Subclass : _Subclass;
							_testContext.set (
								'property1','property1Value',
								'property2','property2Value',
								'property3','property3Value'
							);
							return (
								this.expect ('property1Value',_testContext.get ('property1')) &&
								this.expect ('property2Value',_testContext.get ('property2')) &&
								this.expect ('property3Value',_testContext.get ('property3'))
							);
						}
					},
					{
						title:
							'Test that, when a private name for a set-get property is different from its publice name, the set method sets a value for a property using the private name of the set-get property and not its public name',
						test:function () {
							var _Subclass = Uize.Class.subclass ();
							_Subclass.registerProperties ({_property1:'property1'});
							var _testContext = _isInstance ? new _Subclass : _Subclass;
							_testContext.set ('property1','property1Value');
							return (
								this.expect (undefined,_testContext.property1) &&
								this.expect ('property1Value',_testContext._property1)
							);
						}
					},
					{
						title:
							'Test that, when a private name for a set-get property is different from its publice name, a value can be set for the property by specifying its private name when calling the set method',
						test:function () {
							var _Subclass = Uize.Class.subclass ();
							_Subclass.registerProperties ({_property1:'property1'});
							var _testContext = _isInstance ? new _Subclass : _Subclass;
							_testContext.set ({_property1:'property1Value'});
							return this.expect ('property1Value',_testContext._property1);
						}
					}
				]
			};
		}

		function _getMethodTest (_title,_isInstance) {
			return {
				title:_title,
				test:[
					{
						title:
							'Test that the value of a single set-get property can be obtained by calling the get method with a single string argument, specifying the name of the property',
						test:function () {
							var _Subclass = Uize.Class.subclass ();
							_Subclass.registerProperties ({
								property1:{value:'property1Value'},
								property2:{value:'property2Value'}
							});
							var _testContext = _isInstance ? new _Subclass : _Subclass;
							return this.expect ('property1Value',_testContext.get ('property1'));
						}
					},
					{
						title:
							'Test that values can be obtained for multiple properties by calling the get method with a single argument, which is a list of property names',
						test:function () {
							var _Subclass = Uize.Class.subclass ();
							_Subclass.registerProperties ({
								property1:{value:'property1Value'},
								property2:{value:'property2Value'},
								property3:{value:'property3Value'}
							});
							var _testContext = _isInstance ? new _Subclass : _Subclass;
							return this.expect (
								{
									property1:'property1Value',
									property2:'property2Value',
									property3:'property3Value'
								},
								_testContext.get (['property1','property2','property3'])
							);
						}
					},
					{
						title:
							'Test that values can be obtained for multiple properties by calling the get method with a single argument, which is an object whose properties are the properties of the instance whose values should be obtained',
						test:function () {
							var _Subclass = Uize.Class.subclass ();
							_Subclass.registerProperties ({
								property1:{value:'property1Value'},
								property2:{value:'property2Value'},
								property3:{value:'property3Value'}
							});
							var _testContext = _isInstance ? new _Subclass : _Subclass;
							return this.expect (
								{
									property1:'property1Value',
									property2:'property2Value',
									property3:'property3Value'
								},
								_testContext.get ({property1:0,property2:0,property3:0})
							);
						}
					},
					{
						title:
							'Test that values can be obtained for all properties by calling the get method with no arguments',
						test:function () {
							var _Subclass = Uize.Class.subclass ();
							_Subclass.registerProperties ({
								property1:{value:'property1Value'},
								property2:{value:'property2Value'},
								property3:{value:'property3Value'}
							});
							var _testContext = _isInstance ? new _Subclass : _Subclass;
							return this.expect (
								{
									property1:'property1Value',
									property2:'property2Value',
									property3:'property3Value'
								},
								_testContext.get ()
							);
						}
					},
					{
						title:
							'Test that, when a private name for a set-get property is different from its publice name, the value can be obtained for the property by specifying its private name when calling the get method',
						test:function () {
							var
								_Subclass = Uize.Class.subclass (),
								_properties = {_property1:'property1'}
							;
							for (var _propertyPrivateName in _properties);
							_Subclass.registerProperties (_properties);
							var _testContext = _isInstance ? new _Subclass : _Subclass;
							_testContext.set ('property1','property1Value');
							return this.expect ('property1Value',_testContext.get (_propertyPrivateName));
						}
					},
					{
						title:
							'Test that, when a private name for a set-get property is different from its publice name and its value is set using its private name, the value can be obtained for the property by specifying its public name when calling the get method',
						test:function () {
							var _Subclass = Uize.Class.subclass ();
							_Subclass.registerProperties ({_property1:'property1'});
							var _testContext = _isInstance ? new _Subclass : _Subclass;
							_testContext.set ({_property1:'property1Value'});
							return this.expect ('property1Value',_testContext.get ('property1'));
						}
					}
				]
			};
		}

		return Uize.Test.declare ({
			title:'Test for Uize Base Class',
			test:[
				Uize.Test.staticMethodsTest ([
					['Uize.Class.fire',[
						// NOTE: this method is thoroughly tested by the event system tests (so, no more tests here)
					]],
					['Uize.Class.wire',[
						// NOTE: this method is thoroughly tested by the event system tests (so, no more tests here)
					]],
					['Uize.Class.unwire',[
						// NOTE: this method is thoroughly tested by the event system tests (so, no more tests here)
					]],
					['Uize.Class.registerProperties',[
						// NOTE: this method is thoroughly tested by the properties system tests (so, no more tests here)
					]],
					['Uize.Class.get',[
						// NOTE: this method is thoroughly tested by the properties system tests (so, no more tests here)
					]],
					['Uize.Class.set',[
						// NOTE: this method is thoroughly tested by the properties system tests (so, no more tests here)
					]],
					['Uize.Class.toggle',[
						// NOTE: this method is thoroughly tested by the properties system tests (so, no more tests here)
					]],
					['Uize.Class.valueOf',[
						{
							title:
								'Test that the valueOf method of a class returns the value of the special value set-get property for the class (ie. the initial value for the value set-get property)',
							test:function () {
								var _Subclass = Uize.Class.subclass ();
								_Subclass.registerProperties ({
									_value:{
										name:'value',
										value:'foo'
									}
								});
								return this.expect (_Subclass.valueOf (),'foo');
							}
						},
						{
							title:
								'Test that the valueOf method of an instance returns the value of the special value set-get property for the instance',
							test:function () {
								var _Subclass = Uize.Class.subclass ();
								_Subclass.registerProperties ({
									_value:{
										name:'value',
										value:'foo'
									}
								});
								var _instance = new _Subclass;
								return this.expect (_instance.valueOf (),'foo');
							}
						}
					]],
					['Uize.Class.subclass',[
						/*
							- test set-get properties and inheritance
								- test that set-get properties are inherited by subclasses
						*/
					]]
				]),
				{
					title:'Test the event system for instances and classes',
					test:[
						_eventsSystemTest ('Test that the event system works for instances',true),
						_eventsSystemTest ('Test that the event system works for classes',false)
					]
				},
				{
					title:'Test the set-get properties system',
					test:[
						{
							title:'Test registering set-get properties',
							test:[
								{
									title:'Test that a set-get property can be registered using the minimal profile syntax',
									test:function () {
										var _Subclass = Uize.Class.subclass ();
										_Subclass.registerProperties ({_myProperty:'myProperty'});
										var _instance = new _Subclass;
										return this.expect ({myProperty:undefined},_instance.get ());
									}
								},
								{
									title:'Test that a set-get property can be registered using the complete profile syntax',
									test:function () {
										var _Subclass = Uize.Class.subclass ();
										_Subclass.registerProperties ({_myProperty:{name:'myProperty'}});
										var _instance = new _Subclass;
										return this.expect ({myProperty:undefined},_instance.get ());
									}
								},
								{
									title:
										'Test that multiple properties can be registered in a single call to the registerProperty method, and that minimal and complete profiles can be combined',
									test:function () {
										var _Subclass = Uize.Class.subclass ();
										_Subclass.registerProperties ({
											_myProperty1:'myProperty1',
											_myProperty2:{name:'myProperty2'}
										});
										var _instance = new _Subclass;
										return this.expect ({myProperty1:undefined,myProperty2:undefined},_instance.get ());
									}
								},
								{
									title:
										'Test that the public name of a set-get property is defaulted when no value is specified for the name property in the property profile',
									test:function () {
										var _Subclass = Uize.Class.subclass ();
										_Subclass.registerProperties ({myProperty:{}});
										var _instance = new _Subclass;
										return this.expect ({myProperty:undefined},_instance.get ());
									}
								},
								{
									title:
										'Test that set-get properties can be registered in an ad hoc fashion, by specifying values for unregistered properties when calling the constructor',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_instance1 = new _Subclass ({foo:'bar'}),
											_instance2 = new _Subclass
										;
										return this.expect ({foo:undefined},_instance2.get ());
									}
								},
								{
									title:
										'Test that set-get properties can be registered in an ad hoc fashion, by setting values for unregistered properties using the set instance method',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_instance1 = new _Subclass
										;
										_instance1.set ({foo:'bar'});
										var _instance2 = new _Subclass;
										return this.expect ({foo:undefined},_instance2.get ());
									}
								},
								{
									title:
										'Test that set-get properties can be registered in an ad hoc fashion, by setting values for unregistered properties using the set static method',
									test:function () {
										var _Subclass = Uize.Class.subclass ();
										_Subclass.set ({foo:'bar'});
										var _instance = new _Subclass;
										return this.expect ({foo:'bar'},_instance.get ());
									}
								},
								{
									title:
										'Test that multiple set-get properties can be registered cumulatively by calling registerProperties repeatedly',
									test:function () {
										var _Subclass = Uize.Class.subclass ();
										_Subclass.registerProperties ({_myProperty1:'myProperty1'});
										_Subclass.registerProperties ({_myProperty2:{name:'myProperty2'}});
										var _instance = new _Subclass;
										return this.expect ({myProperty1:undefined,myProperty2:undefined},_instance.get ());
									}
								}
							]
						},
						{
							title:'Test setting values for set-get properties for instances and classes',
							test:[
								_setMethodTest ('Test that the set method works for instances',true),
								_setMethodTest ('Test that the set method works for classes',false)
							]
						},
						{
							title:'Test getting values for set-get properties for instances and classes',
							test:[
								_getMethodTest ('Test that the get method works for instances',true),
								_getMethodTest ('Test that the get method works for classes',false)
							]
						},
						{
							title:'Test the initial value facility',
							test:[
								{
									title:
										'Test that when no initial value is specified for a set-get property, the property\'s initial value is undefined',
									test:function () {
										var _Subclass = Uize.Class.subclass ();
										_Subclass.registerProperties ({
											myProperty:{}
										});
										var _instance = new _Subclass;
										return this.expect (undefined,_instance.get ('myProperty'));
									}
								},
								{
									title:
										'Test that specifying a value property in a set-get property\'s profile when registering it has the effect of setting the initial value for that property for new instances that are created',
									test:function () {
										var _Subclass = Uize.Class.subclass ();
										_Subclass.registerProperties ({
											myProperty:{value:'initial value'}
										});
										var _instance = new _Subclass;
										return this.expect ('initial value',_instance.get ('myProperty'));
									}
								},
								{
									title:
										'Test that null is supported as an initial value for a set-get property and that it is not treated the same as undefined',
									test:function () {
										var _Subclass = Uize.Class.subclass ();
										_Subclass.registerProperties ({
											myProperty:{value:null}
										});
										var _instance = new _Subclass;
										return this.expect (null,_instance.get ('myProperty'));
									}
								},
								{
									title:
										'Test that the initial value registered for a property is returned as the result when querying the value of that set-get property on the class',
									test:function () {
										var _Subclass = Uize.Class.subclass ();
										_Subclass.registerProperties ({
											myProperty:{value:'initial value'}
										});
										return this.expect ('initial value',_Subclass.get ('myProperty'));
									}
								},
								{
									title:
										'Test that setting the value for a set-get property on the class has the effect of setting the initial value for the property',
									test:function () {
										var _Subclass = Uize.Class.subclass ();
										_Subclass.registerProperties ({
											myProperty:{}
										});
										_Subclass.set ({myProperty:'initial value'});
										var _instance = new _Subclass;
										return this.expect ('initial value',_instance.get ('myProperty'));
									}
								},
								{
									title:
										'Test that setting the value for a set-get property on the class does not affect the value of the property for instances that have already been created',
									test:function () {
										var _Subclass = Uize.Class.subclass ();
										_Subclass.registerProperties ({
											myProperty:{value:'initial value'}
										});
										var _instance = new _Subclass;
										_Subclass.set ({myProperty:'new initial value'});
										return this.expect ('initial value',_instance.get ('myProperty'));
									}
								}
							]
						},
						{
							title:'Test the onChange handlers mechanism',
							test:[
								{
									title:
										'Test that an onChange handler for a set-get property is executed on the very first change of the value of that property that occurs during construction of the instance',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_onChangeHandlerCount = 0
										;
										_Subclass.registerProperties ({
											myProperty:{
												value:'initial value',
												onChange:function () {_onChangeHandlerCount++}
											}
										});
										var _instance = new _Subclass;
										return this.expect (1,_onChangeHandlerCount);
									}
								},
								{
									title:
										'Test that an onChange handler for a set-get property is only executed once upon construction when a value specified for the property in the constructor differs from the property\'s initial value',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_onChangeHandlerCount = 0
										;
										_Subclass.registerProperties ({
											myProperty:{
												value:'initial value',
												onChange:function () {_onChangeHandlerCount++}
											}
										});
										var _instance = new _Subclass ({myProperty:'new value'});
										return this.expect (1,_onChangeHandlerCount);
									}
								},
								{
									title:
										'Test that an onChange handler is only executed when the value of a set-get property has actually changed as a result of a set - not on non-changing sets',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_onChangeCount = 0
										;
										_Subclass.registerProperties ({
											myProperty:{
												value:'initial value',
												onChange:function () {_onChangeCount++}
											}
										});
										var _instance = new _Subclass;
										_instance.set ({myProperty:'initial value'});
										_instance.set ({myProperty:'new value'});
										_instance.set ({myProperty:'new value'});
										return this.expect (2,_onChangeCount);
									}
								},
								{
									title:
										'Test that an onChange handler is called as a method on the instance that owns the set-get property',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_contextForCallingOnChange
										;
										_Subclass.registerProperties ({
											myProperty:{
												value:'initial value',
												onChange:function () {_contextForCallingOnChange = this}
											}
										});
										var _instance = new _Subclass;
										return this.expect (_instance,_contextForCallingOnChange);
									}
								},
								{
									title:
										'Test that the value of the set-get property has already changed by the time that an onChange handler is called',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_valueOfPropertyWhenOnChangeCalled
										;
										_Subclass.registerProperties ({
											myProperty:{
												value:'initial value',
												onChange:function () {
													_valueOfPropertyWhenOnChangeCalled = this.get ('myProperty');
												}
											}
										});
										var _instance = new _Subclass;
										_instance.set ({myProperty:'new value'});
										return this.expect ('new value',_valueOfPropertyWhenOnChangeCalled);
									}
								},
								{
									title:
										'Test that an onChange handler can be specified by a string, where that string specifies the name of a method that must be defined for the instance',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_onChangeCount = 0
										;
										_Subclass.prototype.someMethod = function () {_onChangeCount++};
										_Subclass.registerProperties ({
											myProperty:{
												value:'initial value',
												onChange:'someMethod'
											}
										});
										var _instance = new _Subclass;
										_instance.set ({myProperty:'new value'});
										return this.expect (2,_onChangeCount);
									}
								},
								{
									title:
										'Test that an array of multiple onChange handlers can be specified for a set-get property, and that all of them are executed, in the order in which they appear in the array',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_coverageAndOrder = []
										;
										_Subclass.registerProperties ({
											myProperty:{
												value:'initial value',
												onChange:[
													function () {_coverageAndOrder.push ('onChangeHandler1')},
													function () {_coverageAndOrder.push ('onChangeHandler2')},
													function () {_coverageAndOrder.push ('onChangeHandler3')}
												]
											}
										});
										var _instance = new _Subclass;
										return this.expect (
											'onChangeHandler1,onChangeHandler2,onChangeHandler3',
											_coverageAndOrder + ''
										);
									}
								},
								{
									title:
										'Test that an array of multiple onChange handlers may contain a mix of handlers specified by function reference, handlers specified by method name, and nested lists of handlers',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_coverageAndOrder = []
										;
										_Subclass.prototype.someMethod1 = function () {
											_coverageAndOrder.push ('onChangeHandlerSpecifiedByString1');
										};
										_Subclass.prototype.someMethod2 = function () {
											_coverageAndOrder.push ('onChangeHandlerSpecifiedByString2');
										};
										_Subclass.registerProperties ({
											myProperty:{
												value:'initial value',
												onChange:[
													function () {_coverageAndOrder.push ('onChangeSpecifiedByFunction1')},
													function () {_coverageAndOrder.push ('onChangeSpecifiedByFunction2')},
													function () {_coverageAndOrder.push ('onChangeSpecifiedByFunction3')},
													'someMethod1',
													[
														function () {_coverageAndOrder.push ('onChangeSpecifiedByFunction4')},
														'someMethod2',
														function () {_coverageAndOrder.push ('onChangeSpecifiedByFunction5')}
													]
												]
											}
										});
										var _instance = new _Subclass;
										return this.expect (
											[
												'onChangeSpecifiedByFunction1',
												'onChangeSpecifiedByFunction2',
												'onChangeSpecifiedByFunction3',
												'onChangeHandlerSpecifiedByString1',
												'onChangeSpecifiedByFunction4',
												'onChangeHandlerSpecifiedByString2',
												'onChangeSpecifiedByFunction5'
											],
											_coverageAndOrder
										);
									}
								},
								{
									title:
										'Test that all onChange handlers receive a single argument when it is called, which is an object containing the conformed values for all properties being set (not just those that have changed value)',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_argumentsForBarOnChangeHandler,
											_argumentsForMyPropertyOnChangeHandler1,
											_argumentsForMyPropertyOnChangeHandler2,
											_propertiesBeingSet = {
												foo:'the value of foo',
												bar:'the new value of bar',
												myProperty:'new value'
											}
										;
										_Subclass.registerProperties ({
											foo:{
												value:'the value of foo'
											},
											bar:{
												value:'the value of bar',
												onChange:function () {
													_argumentsForBarOnChangeHandler = _copyArguments (arguments);
												}
											},
											helloWorld:{
												value:'Hello, world!'
											},
											myProperty:{
												value:'initial value',
												onChange:[
													function () {
														_argumentsForMyPropertyOnChangeHandler1 = _copyArguments (arguments);
													},
													function () {
														_argumentsForMyPropertyOnChangeHandler2 = _copyArguments (arguments);
													}
												]
											}
										});
										var _instance = new _Subclass;
										_instance.set (_propertiesBeingSet);
										return (
											this.expect ([_propertiesBeingSet],_argumentsForBarOnChangeHandler) &&
											this.expect ([_propertiesBeingSet],_argumentsForMyPropertyOnChangeHandler1) &&
											this.expect ([_propertiesBeingSet],_argumentsForMyPropertyOnChangeHandler2)
										);
									}
								},
								{
									title:
										'Test that onChange handlers are called for all set-get properties that have changed value in the course of the same set call',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_onChangeHandlerCountForBar,
											_onChangeHandlerCountForHelloWorld,
											_onChangeHandlerCountForMyProperty,
											_coverageAndOrder = []
										;
										_Subclass.registerProperties ({
											foo:{
												value:'the value of foo'
											},
											bar:{
												value:'the value of bar',
												onChange:function () {_onChangeHandlerCountForBar++}
											},
											helloWorld:{
												value:'Hello, world!',
												onChange:function () {_onChangeHandlerCountForHelloWorld++}
											},
											myProperty:{
												value:'initial value',
												onChange:function () {_onChangeHandlerCountForMyProperty++}
											}
										});
										var _instance = new _Subclass;
										_onChangeHandlerCountForBar = _onChangeHandlerCountForHelloWorld = _onChangeHandlerCountForMyProperty = 0;
										_instance.set ({
											foo:'new value of foo',
											bar:'the new value of bar',
											helloWorld:'Hello, world!',
											myProperty:'new value of myProperty'
										});
										return (
											this.expect (1,_onChangeHandlerCountForBar) &&
											this.expect (0,_onChangeHandlerCountForHelloWorld) &&
											this.expect (1,_onChangeHandlerCountForMyProperty)
										);
									}
								},
								{
									title:
										'Test that an onChange handler is not called for any instances of a class when the value of the set-get property is set on the class',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_onChangeCount = 0
										;
										_Subclass.registerProperties ({
											myProperty:{
												value:'initial value',
												onChange:function () {_onChangeCount++}
											}
										});
										var
											_instance1 = new _Subclass,
											_instance2 = new _Subclass,
											_instance3 = new _Subclass,
											_onChangeCountAfterCreatingInstances = _onChangeCount;
										;
										_onChangeCount = 0;
										_Subclass.set ({myProperty:'new initial value'});
										return (
											this.expect (3,_onChangeCountAfterCreatingInstances) &&
											this.expect (0,_onChangeCount)
										);
									}
								},
								{
									title:
										'Test that a set-get property\'s onChange handler is only called for an instance of the class whose value for the property has changed (ie. no contamination across instances)',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_coverageAndOrder = []
										;
										_Subclass.registerProperties ({
											name:{},
											myProperty:{
												value:'initial value',
												onChange:function () {_coverageAndOrder.push (this.get ('name'))}
											}
										});
										var
											_instance1 = new _Subclass ({name:'instance1'}),
											_instance2 = new _Subclass ({name:'instance2'}),
											_instance3 = new _Subclass ({name:'instance3'})
										;
										_coverageAndOrder = [];
										_instance2.set ({myProperty:'new value'});
										return this.expect (['instance2'],_coverageAndOrder);
									}
								},
								{
									title:
										'Test that an onChange handler is only executed if the value of a set-get property has changed after being conformed, and not just if the pre-conformed value is different from the current value',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_valuesWhenOnChangeCalled = []
										;
										_Subclass.registerProperties ({
											name:{},
											myProperty:{
												value:0,
												conformer:function (_value) {
													return Math.max (Math.min (_value,100),0);
												},
												onChange:function () {
													_valuesWhenOnChangeCalled.push (this.get ('myProperty'));
												}
											}
										});
										var _instance = new _Subclass;
										_instance.set ({myProperty:-10});
										_instance.set ({myProperty:10});
										_instance.set ({myProperty:10});
										_instance.set ({myProperty:100});
										_instance.set ({myProperty:200});
										_instance.set ({myProperty:-200});
										_instance.set ({myProperty:0});
										return this.expect ([0,10,100,0],_valuesWhenOnChangeCalled);
									}
								},
								{
									title:
										'Test that when the same onChange handler is registered for multiple set-get properties, it is only executed once - even if the values of all those properties change during a set',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_onChangeHandlerSpecifiedByStringCount = 0,
											_onChangeHandlerSpecifiedByFunctionCount = 0
										;
										_Subclass.prototype.someMethod = function () {_onChangeHandlerSpecifiedByStringCount++};
										function _onChangeHandlerFunction () {_onChangeHandlerSpecifiedByFunctionCount++};
										_Subclass.registerProperties ({
											myProperty1:{
												value:'initial value',
												onChange:[
													'someMethod',
													_onChangeHandlerFunction
												]
											},
											myProperty2:{
												value:'initial value',
												onChange:[
													'someMethod',
													_onChangeHandlerFunction
												]
											},
											myProperty3:{
												value:'initial value',
												onChange:[
													'someMethod',
													_onChangeHandlerFunction
												]
											}
										});
										var _instance = new _Subclass;
										_instance.set ({
											myProperty1:'new value',
											myProperty2:'new value',
											myProperty3:'new value'
										});
										return (
											this.expect (2,_onChangeHandlerSpecifiedByStringCount) &&
											this.expect (2,_onChangeHandlerSpecifiedByFunctionCount)
										);
									}
								},
								{
									title:
										'Test that the execute-once optimization for onChange handlers shared across properties does not prevent an onChange handler from executing on subsequent sets (ie. cleanup occurs correctly)',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_onChangeHandlerCount = 0,
											_myProperty1NewValue = 0,
											_myProperty2NewValue = 0,
											_myProperty3NewValue = 0
										;
										function _onChangeHandlerFunction () {_onChangeHandlerCount++};
										_Subclass.registerProperties ({
											myProperty1:{onChange:_onChangeHandlerFunction},
											myProperty2:{onChange:_onChangeHandlerFunction},
											myProperty3:{onChange:_onChangeHandlerFunction}
										});
										var _instance = new _Subclass;
										_instance.set ({
											myProperty1:++_myProperty1NewValue,
											myProperty2:++_myProperty2NewValue,
											myProperty3:++_myProperty3NewValue
										});
										_instance.set ({myProperty1:++_myProperty1NewValue});
										_instance.set ({myProperty2:++_myProperty2NewValue});
										_instance.set ({myProperty3:++_myProperty3NewValue});
										return this.expect (4,_onChangeHandlerCount);
									}
								}
							]
						},
						{
							title:'Test the conformer mechanism',
							test:[
								{
									title:
										'Test that a set-get property\'s conformer function is called as an instance method on the instance for which the property values are being set',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_contextForConformerCall
										;
										_Subclass.registerProperties ({
											myProperty:{
												conformer:function () {_contextForConformerCall = this},
												value:5
											}
										});
										var _instance = new _Subclass;
										_instance.set ({myProperty:42});
										return this.expectSameAs (_instance,_contextForConformerCall);
									}
								},
								{
									title:
										'Test that a set-get property\'s conformer function is called with two arguments, where the first argument is the new value being set for the property, and the second argument is the current value of the property',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_expectedConformerArguments = [42,5],
											_actualConformerArguments
										;
										_Subclass.registerProperties ({
											myProperty:{
												conformer:function (_newValue,_currentValue) {
													_actualConformerArguments = _copyArguments (arguments);
													return _newValue;
												},
												value:5
											}
										});
										var _instance = new _Subclass;
										_instance.set ({myProperty:42});
										return this.expect (_expectedConformerArguments,_actualConformerArguments);
									}
								},
								{
									title:
										'Test that the value returned by a conformer function is treated as the new value to be set for the property',
									test:function () {
										var _Subclass = Uize.Class.subclass ();
										_Subclass.registerProperties ({
											myProperty:{
												conformer:function () {return 'foo'},
												value:5
											}
										});
										var _instance = new _Subclass;
										_instance.set ({myProperty:42});
										return this.expect ('foo',_instance.get ('myProperty'));
									}
								},
								{
									title:
										'Test that a set-get property\'s conformer function is executed before the value of the property has changed',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_myPropertyValuesWhenConformerCalled = [],
											_expectedPropertyValuesWhenConformerCalled = [undefined,5]
										;
										_Subclass.registerProperties ({
											myProperty:{
												conformer:function (_newValue) {
													_myPropertyValuesWhenConformerCalled.push (this.get ('myProperty'));
													return _newValue;
												},
												value:5
											}
										});
										var _instance = new _Subclass;
										_instance.set ({myProperty:42});
										return this.expect (
											_expectedPropertyValuesWhenConformerCalled,_myPropertyValuesWhenConformerCalled
										);
									}
								},
								{
									title:
										'Test that a set-get property\'s conformer function is called before its onChange handlers are called',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_expectedExecutionOrder = ['conformer','onChange'],
											_actualExecutionOrder = []
										;
										_Subclass.registerProperties ({
											myProperty:{
												conformer:function (_newValue) {
													_actualExecutionOrder.push ('conformer');
													return _newValue;
												},
												onChange:function () {_actualExecutionOrder.push ('onChange')},
												value:5
											}
										});
										var _instance = new _Subclass;
										return this.expect (_expectedExecutionOrder,_actualExecutionOrder);
									}
								},
								{
									title:
										'Test that, if a set-get property\'s value does not change as a result of the action of a conformer, then the property\'s onChange handlers are not executed',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_expectedExecutionOrder = ['conformer'],
											_actualExecutionOrder = []
										;
										_Subclass.registerProperties ({
											myProperty:{
												conformer:function (_newValue,_oldValue) {
													_actualExecutionOrder.push ('conformer');
													return _oldValue;
												},
												onChange:function () {_actualExecutionOrder.push ('onChange')},
												value:5
											}
										});
										var _instance = new _Subclass;
										return this.expect (_expectedExecutionOrder,_actualExecutionOrder);
									}
								}
							]
						},
						{
							title:'Test the Changed.[propertyName] event mechanism',
							test:[
								{
									title:
										'Test that the Changed.[propertyName] event for a property is not fired when the property\'s value is set but doesn\'t change value',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_changedEventCount = 0
										;
										_Subclass.registerProperties ({
											myProperty:{value:'initial value'}
										});
										var _instance = new _Subclass;
										_instance.wire ('Changed.myProperty',function () {_changedEventCount++});
										_instance.set ({myProperty:'initial value'});
										return this.expect (0,_changedEventCount);
									}
								},
								{
									title:
										'Test that the Changed.[propertyName] event for a property is fired when the property\'s value changes during a set',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_changedEventCount = 0
										;
										_Subclass.registerProperties ({
											myProperty:{value:'initial value'}
										});
										var _instance = new _Subclass;
										_instance.wire ('Changed.myProperty',function () {_changedEventCount++});
										_instance.set ({myProperty:'new value'});
										return this.expect (1,_changedEventCount);
									}
								},
								{
									title:
										'Test that the Changed.[propertyName] events for set-get properties that have changed value are fired after all the onChange handlers for the properties have been executed',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_coverageAndOrder = []
										;
										_Subclass.registerProperties ({
											myProperty1:{
												value:'myProperty1 initial value',
												onChange:[
													function () {_coverageAndOrder.push ('myProperty1 onChange handler 1')},
													function () {_coverageAndOrder.push ('myProperty1 onChange handler 2')}
												]
											},
											myProperty2:{
												value:'myProperty2 initial value',
												onChange:[
													function () {_coverageAndOrder.push ('myProperty2 onChange handler 1')},
													function () {_coverageAndOrder.push ('myProperty2 onChange handler 2')}
												]
											}
										});
										var _instance = new _Subclass;
										_coverageAndOrder = [];
										_instance.wire (
											'Changed.myProperty1',
											function () {_coverageAndOrder.push ('Changed.myProperty1 handler')}
										);
										_instance.wire (
											'Changed.myProperty2',
											function () {_coverageAndOrder.push ('Changed.myProperty2 handler')}
										);
										_instance.set ({
											myProperty1:'myProperty1 new value',
											myProperty2:'myProperty2 new value'
										});
										return this.expect (
											[
												'myProperty1 onChange handler 1',
												'myProperty1 onChange handler 2',
												'myProperty2 onChange handler 1',
												'myProperty2 onChange handler 2',
												'Changed.myProperty1 handler',
												'Changed.myProperty2 handler'
											],
											_coverageAndOrder
										);
									}
								},
								{
									title:
										'Test that the Changed.[propertyName] events for set-get properties that have changed value are fired in the order in which the properties are set - not the order in which they were registered',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_coverageAndOrder = []
										;
										_Subclass.registerProperties ({
											myProperty1:{value:'myProperty1 initial value'},
											myProperty2:{value:'myProperty2 initial value'}
										});
										var _instance = new _Subclass;
										_instance.wire (
											'Changed.myProperty1',
											function () {_coverageAndOrder.push ('Changed.myProperty1 handler')}
										);
										_instance.wire (
											'Changed.myProperty2',
											function () {_coverageAndOrder.push ('Changed.myProperty2 handler')}
										);
										_instance.set ({
											myProperty2:'myProperty2 new value',
											myProperty1:'myProperty1 new value'
										});
										return this.expect (
											[
												'Changed.myProperty2 handler',
												'Changed.myProperty1 handler'
											],
											_coverageAndOrder
										);
									}
								},
								{
									title:
										'Test that handlers for the special Changed.[propertyName] event can be wired, unwired, and rewired just like any regular event',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_coverageAndOrder = [],
											_newValue = 0
										;
										_Subclass.registerProperties ({myProperty:{}});
										var _instance = new _Subclass;

										function _makeHandler (_handlerNo) {
											return function () {
												_coverageAndOrder.push (
													'handler ' + _handlerNo + ', value = ' + _instance.get ('myProperty')
												);
											}
										}
										var
											_handler1 = _makeHandler (1),
											_handler2 = _makeHandler (2)
										;
										_instance.wire ('Changed.myProperty',_handler1);
										_instance.wire ('Changed.myProperty',_handler2);
										_instance.set ('myProperty',++_newValue);
										_instance.unwire ('Changed.myProperty',_handler1);
										_instance.set ('myProperty',++_newValue);
										_instance.wire ('Changed.myProperty',_handler1);
										_instance.set ('myProperty',++_newValue);
										_instance.unwire ('Changed.myProperty');
										_instance.set ('myProperty',++_newValue);

										return this.expect (
											[
												'handler 1, value = 1',
												'handler 2, value = 1',
												'handler 2, value = 2',
												'handler 2, value = 3',
												'handler 1, value = 3'
											],
											_coverageAndOrder
										);
									}
								},
								{
									title:'Test premature wiring of a Changed.[propertyName] event',
									test:[
										{
											title:
												'Test that wiring a handler for a Changed.[propertyName] event for a property that has not been registered does not produce a JavaScript error',
											test:function () {
												var
													_Subclass = Uize.Class.subclass (),
													_instance = new _Subclass
												;
												_instance.wire ('Changed.nonExistentProperty',Uize.nop);
												return true;
											}
										},
										{
											title:
												'Test that a handler can be wired for a Changed.[propertyName] event for a property that is not yet registered, and that it will get executed when the property is later registered and its value changes',
											test:function () {
												var
													_Subclass = Uize.Class.subclass (),
													_instance = new _Subclass,
													_changedHandlerCount = 0
												;
												_instance.wire (
													'Changed.myProperty',
													function () {_changedHandlerCount++}
												);
												_Subclass.registerProperties ({myProperty:{}});
												_instance.set ({myProperty:'foo'});
												return this.expect (1,_changedHandlerCount);
											}
										},
										{
											title:
												'Test that a handler can be wired for a Changed.[propertyName] event for a property that is not yet registered, and that it will get executed if the property is registered in an ad hoc fashion by setting its value',
											test:function () {
												var
													_Subclass = Uize.Class.subclass (),
													_instance = new _Subclass,
													_changedHandlerCount = 0
												;
												_instance.wire (
													'Changed.myProperty',
													function () {_changedHandlerCount++}
												);
												_instance.set ({myProperty:'foo'});
												return this.expect (1,_changedHandlerCount);
											}
										}
									]
								}
							]
						},
						{
							title:'Test the Changed.* event mechanism',
							test:[
								{
									title:
										'Test that the Changed.* event is not fired if no set-get properties have changed value during a set',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_changedDotStarHandlerCount = 0
										;
										_Subclass.registerProperties ({
											myProperty1:{value:'initial value'},
											myProperty2:{value:'initial value'},
											myProperty3:{value:'initial value'}
										});
										var _instance = new _Subclass;
										_instance.wire ('Changed.*',function () {_changedDotStarHandlerCount++});
										_instance.set ({
											myProperty1:'initial value',
											myProperty2:'initial value',
											myProperty3:'initial value'
										});
										return this.expect (0,_changedDotStarHandlerCount);
									}
								},
								{
									title:
										'Test that the Changed.* event is fired if any set-get property has changed value during a set',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_changedDotStarHandlerCount = 0
										;
										_Subclass.registerProperties ({
											myProperty1:{value:'initial value'},
											myProperty2:{value:'initial value'},
											myProperty3:{value:'initial value'}
										});
										var _instance = new _Subclass;
										_instance.wire ('Changed.*',function () {_changedDotStarHandlerCount++});
										_instance.set ('myProperty1','new value');
										_instance.set ('myProperty2','new value');
										_instance.set ('myProperty3','new value');
										return this.expect (3,_changedDotStarHandlerCount);
									}
								},
								{
									title:
										'Test that the Changed.* event is fired only once when multiple set-get properties have changed value',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_changedDotStarHandlerCount = 0
										;
										_Subclass.registerProperties ({
											myProperty1:{value:'initial value'},
											myProperty2:{value:'initial value'},
											myProperty3:{value:'initial value'}
										});
										var _instance = new _Subclass;
										_instance.wire ('Changed.*',function () {_changedDotStarHandlerCount++});
										_instance.set ({
											myProperty1:'new value',
											myProperty2:'new value',
											myProperty3:'new value'
										});
										return this.expect (1,_changedDotStarHandlerCount);
									}
								},
								{
									title:
										'Test that the event object for the Changed.* event contains a properties property, which is an object containing values for only those properties that have changed value',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_eventObjectPropertiesProperty
										;
										_Subclass.registerProperties ({
											myProperty1:{value:'initial value'},
											myProperty2:{value:'initial value'},
											myProperty3:{value:'initial value'}
										});
										var _instance = new _Subclass;
										_instance.wire (
											'Changed.*',
											function (_event) {_eventObjectPropertiesProperty = _event.properties}
										);
										_instance.set ({
											myProperty2:'initial value',
											myProperty3:'new value'
										});
										return this.expect ({myProperty3:'new value'},_eventObjectPropertiesProperty);
									}
								},
								{
									title:
										'Test that the Changed.* event is fired after all the onChange handlers for set-get properties that have changed value have been executed, but before handlers for the Changed.[propertyName] events for individual properties are executed',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_coverageAndOrder = []
										;
										_Subclass.registerProperties ({
											myProperty1:{
												value:'myProperty1 initial value',
												onChange:[
													function () {_coverageAndOrder.push ('myProperty1 onChange handler 1')},
													function () {_coverageAndOrder.push ('myProperty1 onChange handler 2')}
												]
											},
											myProperty2:{
												value:'myProperty2 initial value',
												onChange:[
													function () {_coverageAndOrder.push ('myProperty2 onChange handler 1')},
													function () {_coverageAndOrder.push ('myProperty2 onChange handler 2')}
												]
											}
										});
										var _instance = new _Subclass;
										_coverageAndOrder = [];
										_instance.wire ({
											'Changed.myProperty1':
												function () {_coverageAndOrder.push ('Changed.myProperty1 handler')},
											'Changed.myProperty2':
												function () {_coverageAndOrder.push ('Changed.myProperty2 handler')},
											'Changed.*':
												function () {_coverageAndOrder.push ('Changed.* handler')}
										});
										_instance.set ({
											myProperty1:'myProperty1 new value',
											myProperty2:'myProperty2 new value'
										});
										return this.expect (
											[
												'myProperty1 onChange handler 1',
												'myProperty1 onChange handler 2',
												'myProperty2 onChange handler 1',
												'myProperty2 onChange handler 2',
												'Changed.* handler',
												'Changed.myProperty1 handler',
												'Changed.myProperty2 handler'
											],
											_coverageAndOrder
										);
									}
								},
								{
									title:
										'Test that handlers for the special Changed.* event can be wired, unwired, and rewired just like any regular event',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_coverageAndOrder = [],
											_newValue = 0
										;
										_Subclass.registerProperties ({myProperty:{}});
										var _instance = new _Subclass;

										function _makeHandler (_handlerNo) {
											return function () {
												_coverageAndOrder.push (
													'handler ' + _handlerNo + ', value = ' + _instance.get ('myProperty')
												);
											}
										}
										var
											_handler1 = _makeHandler (1),
											_handler2 = _makeHandler (2)
										;
										_instance.wire ('Changed.*',_handler1);
										_instance.wire ('Changed.*',_handler2);
										_instance.set ('myProperty',++_newValue);
										_instance.unwire ('Changed.*',_handler1);
										_instance.set ('myProperty',++_newValue);
										_instance.wire ('Changed.*',_handler1);
										_instance.set ('myProperty',++_newValue);
										_instance.unwire ('Changed.*');
										_instance.set ('myProperty',++_newValue);

										return this.expect (
											[
												'handler 1, value = 1',
												'handler 2, value = 1',
												'handler 2, value = 2',
												'handler 2, value = 3',
												'handler 1, value = 3'
											],
											_coverageAndOrder
										);
									}
								}
							]
						},
						{
							title:'Test the alias mechanism',
							test:[
								{
									title:
										'Test that a set-get property can have multiple aliases, and that its value can be set through any of those aliases',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_valueAfterSetUsingCanonicalName,
											_valueAfterSetUsingAlias1,
											_valueAfterSetUsingAlias2
										;
										_Subclass.registerProperties ({
											_myProperty:{name:'myProperty|myPropertyAlias1|myPropertyAlias2'}
										});
										var _instance = new _Subclass;
										_instance.set ('myProperty','value set using canonical name');
										_valueAfterSetUsingCanonicalName = _instance.get ('myProperty');
										_instance.set ('myPropertyAlias1','value set using alias 1');
										_valueAfterSetUsingAlias1 = _instance.get ('myProperty');
										_instance.set ('myPropertyAlias2','value set using alias 2');
										_valueAfterSetUsingAlias2 = _instance.get ('myProperty');
										return (
											this.expect ('value set using canonical name',_valueAfterSetUsingCanonicalName) &&
											this.expect ('value set using alias 1',_valueAfterSetUsingAlias1) &&
											this.expect ('value set using alias 2',_valueAfterSetUsingAlias2)
										);
									}
								},
								{
									title:
										'Test that getting the values for all set-get properties results in the values of set-get properties with aliases being reported only through their canonical (non-alias) names',
									test:function () {
										var _Subclass = Uize.Class.subclass ();
										_Subclass.registerProperties ({
											_myProperty1:'myProperty1',
											_myProperty2:'myProperty2|myProperty2Alias1',
											_myProperty3:'myProperty3|myProperty3Alias1|myProperty3Alias2'
										});
										var _instance = new _Subclass;
										return this.expect (
											{
												myProperty1:undefined,
												myProperty2:undefined,
												myProperty3:undefined
											},
											_instance.get ()
										);
									}
								},
								{
									title:
										'Test that aliases can be specified using the minimal profile syntax as well as the complete profile syntax',
									test:function () {
										var _Subclass = Uize.Class.subclass ();
										_Subclass.registerProperties ({
											_myProperty1:'myProperty1|myProperty1Alias',
											_myProperty2:{name:'myProperty2|myProperty2Alias'}
										});
										var _instance = new _Subclass;
										_instance.set ({
											myProperty1Alias:'myProperty1 value',
											myProperty2Alias:'myProperty2 value'
										});
										return this.expect (
											{myProperty1:'myProperty1 value',myProperty2:'myProperty2 value'},
											_instance.get ()
										);
									}
								},
								{
									title:
										'Test that a value can be set for a set-get property using any of its aliases in the constructor when creating an instance',
									test:function () {
										var _Subclass = Uize.Class.subclass ();
										_Subclass.registerProperties ({
											_myProperty1:'myProperty1|myProperty1Alias1|myProperty1Alias2',
											_myProperty2:'myProperty2|myProperty2Alias1|myProperty2Alias2',
											_myProperty3:'myProperty3|myProperty3Alias1|myProperty3Alias2'
										});
										var _instance = new _Subclass ({
											myProperty1:'myProperty1 value',
											myProperty2Alias1:'myProperty2 value',
											myProperty3Alias2:'myProperty3 value'
										});
										return this.expect (
											{
												myProperty1:'myProperty1 value',
												myProperty2:'myProperty2 value',
												myProperty3:'myProperty3 value'
											},
											_instance.get ()
										);
									}
								},
								{
									title:
										'Test that a set-get property\'s value can be accessed using any of its registered aliases',
									test:function () {
										var _Subclass = Uize.Class.subclass ();
										_Subclass.registerProperties ({
											_myProperty:{
												name:'myProperty|myPropertyAlias1|myPropertyAlias2',
												value:'myProperty value'
											}
										});
										var _instance = new _Subclass;
										return (
											this.expect ('myProperty value',_instance.get ('myProperty')) &&
											this.expect ('myProperty value',_instance.get ('myPropertyAlias1')) &&
											this.expect ('myProperty value',_instance.get ('myPropertyAlias2'))
										);
									}
								},
								{
									title:
										'Test that handlers can be wired for the Changed.[propertyName] event of a set-get property, using any one of its alias names or its canonical name',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_coverageAndOrder = []
										;
										_Subclass.registerProperties ({
											_myProperty:'myProperty|myPropertyAlias1|myPropertyAlias2'
										});
										var _instance = new _Subclass;
										_instance.wire (
											'Changed.myProperty',
											function () {_coverageAndOrder.push ('handler for Changed.myProperty')}
										);
										_instance.wire (
											'Changed.myPropertyAlias1',
											function () {_coverageAndOrder.push ('handler for Changed.myPropertyAlias1')}
										);
										_instance.wire (
											'Changed.myPropertyAlias2',
											function () {_coverageAndOrder.push ('handler for Changed.myPropertyAlias2')}
										);
										_instance.set ({myProperty:'foo'});
										return this.expect (
											[
												'handler for Changed.myProperty',
												'handler for Changed.myPropertyAlias1',
												'handler for Changed.myPropertyAlias2'
											],
											_coverageAndOrder
										);
									}
								},
								{
									title:
										'Test that handlers can be unwired for the Changed.[propertyName] event of a set-get property, using any one of its alias names or its canonical name',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_coverageAndOrder = [],
											_newValue = 0
										;
										_Subclass.registerProperties ({
											_myProperty:'myProperty|myPropertyAlias1|myPropertyAlias2'
										});
										var _instance = new _Subclass;

										function _changedHandler1 () {_coverageAndOrder.push ('changed handler 1')}
										function _changedHandler2 () {_coverageAndOrder.push ('changed handler 2')}
										function _changedHandler3 () {_coverageAndOrder.push ('changed handler 3')}

										_instance.wire ('Changed.myProperty',_changedHandler1);
										_instance.wire ('Changed.myProperty',_changedHandler2);
										_instance.wire ('Changed.myProperty',_changedHandler3);

										_instance.set ('myProperty',++_newValue);
										_instance.unwire ('Changed.myProperty',_changedHandler1);
										_instance.set ('myProperty',++_newValue);
										_instance.unwire ('Changed.myPropertyAlias1',_changedHandler2);
										_instance.set ('myProperty',++_newValue);
										_instance.unwire ('Changed.myPropertyAlias2',_changedHandler3);
										_instance.set ('myProperty',++_newValue);

										return this.expect (
											[
												'changed handler 1',
												'changed handler 2',
												'changed handler 3',
												'changed handler 2',
												'changed handler 3',
												'changed handler 3'
											],
											_coverageAndOrder
										);
									}
								},
								{
									title:
										'Test that the canonical name of a set-get property is used for the name of the Changed.[propertyName] event that is fired when the property\'s value is changed, regardless of which alias is used when setting the property\'s value',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_coverageAndOrder = [],
											_newValue = 0
										;
										_Subclass.registerProperties ({
											_myProperty:'myProperty|myPropertyAlias1|myPropertyAlias2'
										});
										var _instance = new _Subclass;

										function _changedHandler1 () {_coverageAndOrder.push ('changed handler 1')}
										function _changedHandler2 () {_coverageAndOrder.push ('changed handler 2')}
										function _changedHandler3 () {_coverageAndOrder.push ('changed handler 3')}

										_instance.wire ('Changed.myProperty',_changedHandler1);
										_instance.wire ('Changed.myPropertyAlias1',_changedHandler2);
										_instance.wire ('Changed.myPropertyAlias2',_changedHandler3);

										_instance.set ('myProperty',++_newValue);
										_instance.set ('myPropertyAlias1',++_newValue);
										_instance.set ('myPropertyAlias2',++_newValue);

										return this.expect (
											[
												'changed handler 1','changed handler 2','changed handler 3',
												'changed handler 1','changed handler 2','changed handler 3',
												'changed handler 1','changed handler 2','changed handler 3'
											],
											_coverageAndOrder
										);
									}
								},
								{
									title:
										'Test that the canonical name of a set-get property is used for the properties-being-set object that is passed as a parameter to an onChange handler for the set-get property',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_propertiesBeingSetLog = [],
											_newValue = 0
										;
										_Subclass.registerProperties ({
											_myProperty:{
												name:'myProperty|myPropertyAlias1|myPropertyAlias2',
												onChange:function (_propertiesBeingSet) {
													_propertiesBeingSetLog.push (_propertiesBeingSet);
												}
											}
										});
										var _instance = new _Subclass;

										_instance.set ('myProperty',++_newValue);
										_instance.set ('myPropertyAlias1',++_newValue);
										_instance.set ('myPropertyAlias2',++_newValue);

										return this.expect (
											[
												{myProperty:1},
												{myProperty:2},
												{myProperty:3}
											],
											_propertiesBeingSetLog
										);
									}
								},
								{
									title:
										'Test that the canonical names of set-get properties are used for the properties object that is provided in the event object for Changed.* events',
									test:function () {
										var
											_Subclass = Uize.Class.subclass (),
											_changedDotStarEventObjectPropertiesLog = [],
											_newValue = 0
										;
										_Subclass.registerProperties ({
											_myProperty:'myProperty|myPropertyAlias1|myPropertyAlias2'
										});
										var _instance = new _Subclass;

										_instance.wire (
											'Changed.*',
											function (_event) {_changedDotStarEventObjectPropertiesLog.push (_event.properties)}
										);

										_instance.set ('myProperty',++_newValue);
										_instance.set ('myPropertyAlias1',++_newValue);
										_instance.set ('myPropertyAlias2',++_newValue);

										return this.expect (
											[
												{myProperty:1},
												{myProperty:2},
												{myProperty:3}
											],
											_changedDotStarEventObjectPropertiesLog
										);
									}
								}
							]
						},
						{
							title:
								'Test that values specified for set-get properties when calling a class\' constructor are respected',
							test:function () {
								var _Subclass = Uize.Class.subclass ();
								_Subclass.registerProperties ({
									_myProperty1:{
										name:'myProperty1',
										value:'myProperty1 initial value'
									},
									_myProperty2:{
										name:'myProperty2',
										value:'myProperty2 initial value'
									},
									_myProperty3:{
										name:'myProperty3',
										value:'myProperty3 initial value'
									}
								});
								var _instance = new _Subclass ({
									myProperty1:'myProperty1 new value',
									_myProperty2:'myProperty2 new value'
								});
								return (
									this.expect ('myProperty1 new value',_instance._myProperty1) &&
									this.expect ('myProperty2 new value',_instance._myProperty2) &&
									this.expect ('myProperty3 initial value',_instance._myProperty3)
								);
							}
						}
					]
				}
			]
		});
	}
});

