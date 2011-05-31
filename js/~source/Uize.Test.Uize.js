/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Test
	importance: 8
	codeCompleteness: 28
	testCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize= module defines a suite of unit tests for the =Uize= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize',
	required:'Uize.Data',
	builder:function () {
		var
			_oneLevelDeepTestObjectForCloning = {
				undefinedValue:undefined,
				nullValue:null,
				emptyString:'',
				nonEmptyString:'solar',
				numberValueZero:0,
				numberValueNegative:-1,
				numberValuePositive:1,
				numberValueNaN:NaN,
				numberValueInfinity:Infinity,
				numberValueNegativeInfinity:-Infinity,
				booleanFalse:false,
				booleanTrue:true
			},
			_oneLevelDeepTestArrayForCloning = [
				undefined,
				null,
				'',
				'solar',
				0,
				-1,
				1,
				NaN,
				Infinity,
				-Infinity,
				false,
				true
			],
			_complexObjectDataStructure = {
				anObject:_oneLevelDeepTestObjectForCloning,
				anArray:_oneLevelDeepTestArrayForCloning
			},
			_complexArrayDataStructure = [
				_oneLevelDeepTestObjectForCloning,
				_oneLevelDeepTestArrayForCloning
			]
		;

		function _cloneObjectTest (_title,_class,_instantiationValue) {
			return {
				title:_title,
				test:function () {
					var
						_sourceObject = new _class (_instantiationValue),
						_clonedObject = Uize.clone (_sourceObject)
					;
					return (
						this.expect (true,_clonedObject != _sourceObject) &&
						this.expectSameAs (_sourceObject.constructor,_clonedObject.constructor) &&
						this.expect (_sourceObject.valueOf (),_clonedObject.valueOf ())
					);
				}
			};
		}

		function _eventsSystemTest (_title,_isInstance) {
			function _getEventSource () {
				return _isInstance ? new Uize : Uize.subclass ();
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
							return _coverageAndOrder + '' == 'handler1,handler2';
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
							return _coverageAndOrder + '' == 'handler1,handler2,handler3,handler4';
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
							return _coverageAndOrder + '' == 'handler1,handler3';
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

							return _coverageAndOrder + '' == 'handler1,handler2,handler3,handler2,handler3';
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
										return _coverageAndOrder + '' == 'sourceHandler,sourceParentHandler';
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
										return _coverageAndOrder + '' == _expectedCoverageAndOrder + '';
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
										return _coverageAndOrder + '' == 'sourceHandler,sourceParentHandler';
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
										return _coverageAndOrder + '' == 'sourceHandler';
									}
								}
							]
						}
				]
			};
		}

		return Uize.Test.declare ({
			title:'Test for Uize Base Class',
			test:[
				Uize.Test.staticMethodsTest ([
					['Uize.capFirstChar',[
						['Many letters, first letter is lowercase','hello','Hello'],
						['Many letters, first letter is uppercase','Hello','Hello'],
						['Single letter, lowercase','h','H'],
						['Single letter, uppercase','H','H'],
						['Empty string','','']
					]],
					['Uize.constrain',[
						['Test that constraining a value that is lower than the lower limit returns the lower limit',
							[-20,-10,10],
							-10
						],
						['Test that constraining a value that is equal to the lower limit returns that value',
							[-10,-10,10],
							-10
						],
						['Test that constraining a value that is higher than the upper limit returns the upper limit',
							[20,-10,10],
							10
						],
						['Test that constraining a value that is equal to the upper limit returns that value',
							[10,-10,10],
							10
						],
						['Test that constraining value that is within the range simply returns that value',
							[1,-10,10],
							1
						],
						['Test that, when the range is reversed, constraining a value that is lower than the lower limit returns the lower limit',
							[-20,10,-10],
							-10
						],
						['Test that, when the range is reversed, constraining a value that is equal to the lower limit returns that value',
							[-10,10,-10],
							-10
						],
						['Test that, when the range is reversed, constraining a value that is higher than the upper limit returns the upper limit',
							[20,10,-10],
							10
						],
						['Test that, when the range is reversed, constraining a value that is equal to the upper limit returns that value',
							[10,10,-10],
							10
						],
						['Test that, when the range is reversed, constraining value that is within the range simply returns that value',
							[1,10,-10],
							1
						],
						['Test that, when the lower limit and the upper limit are equal, constraining a value that is lower than the lower limit returns the lower limit',
							[5,10,10],
							10
						],
						['Test that, when the lower limit and the upper limit are equal, constraining a value that is higher than the upper limit returns the upper limit',
							[15,10,10],
							10
						]
					]],
					['Uize.isArray',[
						['Test that calling with no parameters returns false',[],false],
						['Test that the value undefined is not regarded as an array',undefined,false],
						['Test that the value null is not regarded as an array',null,false],
						['Test that a string type value is not regarded as an array','hello',false],
						['Test that a String object instance is not regarded as an array',new String ('hello'),false],
						['Test that a number type value is not regarded as an array',5,false],
						['Test that a Number object instance is not regarded as an array',new Number (5),false],
						['Test that a boolean type value is not regarded as an array',true,false],
						['Test that a Boolean object instance is not regarded as an array',new Boolean (true),false],
						['Test that an empty object is not regarded as an array',{},false],
						['Test that a function is not regarded as an array',function () {},false],
						['Test that a regular expression instance is not regarded as an array',/\d+/,false],
						['Test that an empty array is regarded as an array',[[]],true],
						['Test that an array with elements is regarded as an array',[[1,2,3,4]],true]
					]],
					['Uize.isNumber',[
						['Test that calling with no parameters returns false',[],false],
						['Test that the value undefined is not regarded as a number',undefined,false],
						['Test that the value null is not regarded as a number',null,false],
						['Test that a number format string type value is not regarded as a number','5',false],
						['Test that a number format String object instance is not regarded as a number',new String ('5'),false],
						['Test that a boolean type value is not regarded as a number',true,false],
						['Test that a Boolean object instance is not regarded as a number',new Boolean (true),false],
						['Test that an object is not regarded as a number',{},false],
						['Test that an array is not regarded as a number',[[]],false],
						['Test that a function is not regarded as a number',function () {},false],
						['Test that a regular expression instance is not regarded as a number',/\d+/,false],
						['Test that a number type value is regarded as a number',5,true],
						['Test that the special value Infinity is regarded as a number',Infinity,true],
						['Test that the special value -Infinity is regarded as a number',-Infinity,true],
						['Test that the special value NaN is not regarded as a number',NaN,false],
						['Test that a Number object instance is not regarded as a number',new Number (5),false]
					]],
					['Uize.escapeRegExpLiteral',[
						['Test that all of the regular expression special characters are escaped correctly',
							'^$|{}[]()?.*+\\',
							'\\^\\$\\|\\{\\}\\[\\]\\(\\)\\?\\.\\*\\+\\\\'
						]
					]],
					['Uize.copyInto',
						[
							['Test that calling with only a target object and no source object results in the target object being returned unchanged',
								{foo:'bar',hello:'world'},
								{foo:'bar',hello:'world'}
							],
							['Test that specifying the value null for the source object results in the target object being returned unchanged',
								[{foo:'bar',hello:'world'},null],
								{foo:'bar',hello:'world'}
							],
							['Test that specifying the value undefined for the source object results in the target object being returned unchanged',
								[{foo:'bar',hello:'world'},undefined],
								{foo:'bar',hello:'world'}
							],
							['Test that copying a source object into a target object works correctly',
								[{foo:'foo',hello:'there',otherInTarget:'blah'},{foo:'bar',hello:'world',otherInSource:'yawn'}],
								{foo:'bar',hello:'world',otherInTarget:'blah',otherInSource:'yawn'}
							],
							{
								title:'Test that the target object is returned and not a new object',
								test:function () {
									var _target = {foo:'bar'};
									var _result = Uize.copyInto (_target,{hello:'world'});
									return this.expectSameAs (_target,_result);
								}
							},
							['Test that an arbitrary number of source objects is supported',
								[
									{propFromTarget:'foo'},
									{propFromSource1:'bar'},
									{propFromSource2:'hello'},
									{propFromSource3:'world'}
								],
								{
									propFromTarget:'foo',
									propFromSource1:'bar',
									propFromSource2:'hello',
									propFromSource3:'world'
								}
							],
							['Test that the contents of source objects are copied into the target in the order in which the source objects are specified',
								[
									{foo:'foo',otherInTarget:'blah'},
									{foo:'bar',fancy:'pants'},
									{fancy:'schmancy',la:'dee dah'},
									{la:'dolce vita',fin:'ished'}
								],
								{foo:'bar',otherInTarget:'blah',fancy:'schmancy',la:'dolce vita',fin:'ished'}
							],
							['Test that specifying the value null or undefined for all of the source objects results in the target object being returned unchanged',
								[{foo:'bar',hello:'world'},null,undefined,undefined,null],
								{foo:'bar',hello:'world'}
							],
							['Test that specifying the value null for the target object results in the value null being returned',
								[null,{foo:'bar',hello:'world'}],
								null
							],
							['Test that specifying the value undefined for the target object results in the value null being returned',
								[undefined,{foo:'bar',hello:'world'}],
								undefined
							]
						],
						null,
						{cloneArguments:true}
					],
					['Uize.pairUp',[
						['Test that calling with no parameters returns {undefined:undefined}',[],{undefined:undefined}],
						['Test that undefined is the default for the valueANYTYPE parameter',['key'],{key:undefined}],
						['Test that the key can be a string','key',{key:undefined}],
						['Test that the key can be a number',5,{5:undefined}],
						['Test that the key can be the special value Infinity',Infinity,{Infinity:undefined}],
						['Test that the key can be the special value NaN',NaN,{NaN:undefined}],
						['Test that the key can be a boolean',false,{'false':undefined}],
						['Test that the key can be undefined',undefined,{undefined:undefined}],
						['Test that the key can be null',null,{'null':undefined}],
						['Test that the value can be a string',['key','value'],{key:'value'}],
						['Test that the value can be a number',['key',5],{key:5}],
						['Test that the value can be the special value Infinity',['key',Infinity],{key:Infinity}],
						['Test that the value can be the special value NaN',['key',NaN],{key:NaN}],
						['Test that the value can be a boolean',['key',false],{key:false}],
						['Test that the value can be undefined',['key',undefined],{key:undefined}],
						['Test that the value can be null',['key',null],{key:null}],
						['Test that the value can be an object',['key',{propName:'propValue'}],{key:{propName:'propValue'}}],
						['Test that an arbitrary number of arguments is supported',
							[
								'string','foo',
								'number',42,
								'boolean',false,
								'regexp',/\d+/,
								'undefined',undefined,
								'null',null,
								'NaN',NaN,
								'object',{},
								'array',[]
							],
							{
								'string':'foo',
								'number':42,
								'boolean':false,
								'regexp':/\d+/,
								'undefined':undefined,
								'null':null,
								'NaN':NaN,
								'object':{},
								'array':[]
							}
						],
						['Test that if there is only one argument whose value is an array, then that array is treated as the arguments list',
							[
								[
									'string','foo',
									'number',42,
									'boolean',false,
									'regexp',/\d+/,
									'undefined',undefined,
									'null',null,
									'NaN',NaN,
									'object',{},
									'array',[]
								]
							],
							{
								'string':'foo',
								'number':42,
								'boolean':false,
								'regexp':/\d+/,
								'undefined':undefined,
								'null':null,
								'NaN':NaN,
								'object':{},
								'array':[]
							}
						]
					]],
					['Uize.substituteInto',[
						['Test that calling with no parameters produces an empty string',
							[],
							''
						],
						['Test that calling with just a source string simply produces that string',
							'Hello, world!',
							'Hello, world!'
						],
						['Test that specifying the value null for substitutions produces the source string',
							['Hello, world!',null,'[#KEY]'],
							'Hello, world!'
						],
						['Test that specifying the value undefined for substitutions produces the source string',
							['Hello, world!',undefined,'[#KEY]'],
							'Hello, world!'
						],
						['Test that substituting into an empty string produces an empty string',
							['',{name:'Eric'},'[#KEY]'],
							''
						],
						['Test that substitution of a single token works correctly',
							['My name is [#name].',{name:'Eric'},'[#KEY]'],
							'My name is Eric.'
						],
						['Test that multiple substitutions are handled corretly',
							['My name is [#name], and I am a [#occupation].',{name:'Eric',occupation:'viking'},'[#KEY]'],
							'My name is Eric, and I am a viking.'
						],
						['Test that a custom token naming specifier is handled correctly',
							['My name is <%name%>, and I am a <%occupation%>.',{name:'Eric',occupation:'viking'},'<%KEY%>'],
							'My name is Eric, and I am a viking.'
						],
						['Test that token naming where token opener and closer are empty strings is handled correcly',
							['I am name, and I am a occupation.',{name:'Eric',occupation:'viking'},'KEY'],
							'I am Eric, and I am a viking.'
						],
						['Test that default for token naming is [#KEY]',
							['My name is [#name].',{name:'Eric'}],
							'My name is Eric.'
						],
						['Test that specifying an empty object for substitutions simply produces the source string',
							['Hello, world!',{}],
							'Hello, world!'
						],
						['Test that the same substitution can be used multiple times',
							['My name is [#name]. [#name] is my name. You can call me [#name].',{name:'Eric'}],
							'My name is Eric. Eric is my name. You can call me Eric.'
						],
						['Test that substitution values that contain tokens are not further substituted into',
							['[#token1][#token2]',{token1:'[#token2]foo',token2:'bar'}],
							'[#token2]foobar'
						],
						['Test that tokens in the source string for which there aren\'t substitutions are left in the source string',
							['My name is [#name].',{occupation:'viking'}],
							'My name is [#name].'
						],
						['Test that substitutions for which there aren\'t tokens in the source string are ignored',
							['My name is [#name].',{name:'Eric',occupation:'viking'}],
							'My name is Eric.'
						],
						['Test that specifying an array for substitutions is handled correctly',
							['My name is [#0], and I am a [#1].',['Eric','viking']],
							'My name is Eric, and I am a viking.'
						],
						['Test that specifying an empty array for substitutions simply produces the source string',
							['Hello, world!',[]],
							'Hello, world!'
						],
						['Test that non-string substitution values are correctly coerced to strings',
							[
								'[#int] [#neg] [#float] [#nan] [#infinity] [#true] [#false] [#obj] [#null] [#undefined]',
								{
									int:5,neg:-5,float:5.5,nan:NaN,infinity:Infinity,
									'true':true,'false':false,
									obj:new Uize ({value:'OBJECT'}),
									'null':null,'undefined':undefined
								}
							],
							'5 -5 5.5 NaN Infinity true false OBJECT null undefined'
						],
						['Test that a string type substitution is treated as a substitutions array with one element',
							['My name is [#0].','Eric'],
							'My name is Eric.'
						],
						['Test that a number type substitution is treated as a substitutions array with one element',
							['Pi is approximately [#0].',3.14159265359],
							'Pi is approximately 3.14159265359.'
						],
						['Test that a boolean type substitution is treated as a substitutions array with one element',
							['It is not [#0] that the Earth is flat.',true],
							'It is not true that the Earth is flat.'
						],
						['Test that substitution keys are case-sensitive, as designed',
							['My name is [#name], and not [#NAME]!',{name:'Eric',NAME:'Derrick'}],
							'My name is Eric, and not Derrick!'
						],
						['Test that substitution keys are space-sensitive, as designed',
							['My name is [#name], and not [# name ]!',{name:'Eric',' name ':'Derrick'}],
							'My name is Eric, and not Derrick!'
						],
						['Test that spaces in the token opener and token closer are significant, as designed',
							['[name] [ name] [name ] [ name ]',{name:'Eric'},'[ KEY ]'],
							'[name] [ name] [name ] Eric'
						],
						['Test that a token opener containing regular expression special characters is handled correctly',
							['My name is [^$|{}[]()?.*+\\name].',{name:'Eric'},'[^$|{}[]()?.*+\\KEY]'],
							'My name is Eric.'
						],
						['Test that a token closer containing regular expression special characters is handled correctly',
							['My name is [name^$|{}[]()?.*+\\].',{name:'Eric'},'[KEY^$|{}[]()?.*+\\]'],
							'My name is Eric.'
						],
						['Test that a substitution key containing regular expression special characters is handled correctly',
							['My name is [^$|{}[]()?.*+\\].',{'^$|{}[]()?.*+\\':'Eric'},'[KEY]'],
							'My name is Eric.'
						],
						['Test that the source for substituting into can be a number',
							[3.14159265359,{'.':','},'KEY'],
							'3,14159265359'
						],
						['Test that the source for substituting into can be a boolean',
							[true,{ru:'Russia'},'KEY'],
							'tRussiae'
						],
						['Test that the source for substituting into can be an object that implements a value interface',
							[new Uize ({value:'My name is [#name].'}),{name:'Eric'}],
							'My name is Eric.'
						],
						['Test that the source for substituting into can be an array, whose elements will be concatenated',
							[['[#name]','[#occupation]'],{name:'Eric',occupation:'viking'}],
							'Eric,viking'
						]
					]],
					['Uize.indexIn',[
						['Test that calling with no parameters produces the result -1',
							[],
							-1
						],
						['Test that specifying null for the sourceARRAY parameter produces the result -1',
							[null,null],
							-1
						],
						['Test that specifying undefined for the sourceARRAY parameter produces the result -1',
							[undefined,undefined],
							-1
						],
						['Test that specifying a number for the sourceARRAY parameter produces the result -1',
							[5,5],
							-1
						],
						['Test that specifying a string for the sourceARRAY parameter produces the result -1',
							['hello','hello'],
							-1
						],
						['Test that specifying a boolean for the sourceARRAY parameter produces the result -1',
							[true,true],
							-1
						],
						['Test that specifying an empty array for the sourceARRAY parameter produces the result -1',
							[[],1],
							-1
						],
						['Test that the fromEndBOOL and strictEqualityBOOL parameters are observed correctly',
							[[0,1,'1','1',1,2],'1',true,false],
							4
						],
						['Test that the strictEqualityBOOL parameter is defaulted to true, as designed',
							[[0,1,'1','1',1,2],'1',true],
							3
						],
						['Test that the fromEndBOOL parameter is defaulted to false, as designed',
							[[0,1,'1','1',1,2],'1'],
							2
						],
						['Test that -1 is returned when the value is not found in the source array',
							[[0,1,'1','1',1,2],'0'],
							-1
						]
					]],
					['Uize.isIn',[
						['Test that calling with no parameters produces the result false',
							[],
							false
						],
						['Test that specifying null for the sourceARRAY parameter produces the result false',
							[null,null],
							false
						],
						['Test that specifying undefined for the sourceARRAY parameter produces the result false',
							[undefined,undefined],
							false
						],
						['Test that specifying a number for the sourceARRAY parameter produces the result false',
							[5,5],
							false
						],
						['Test that specifying a string for the sourceARRAY parameter produces the result false',
							['hello','hello'],
							false
						],
						['Test that specifying a boolean for the sourceARRAY parameter produces the result false',
							[true,true],
							false
						],
						['Test that specifying an empty array for the sourceARRAY parameter produces the result false',
							[[],1],
							false
						],
						['Test that the strictEqualityBOOL parameter ia observed correctly',
							[[0,1],'1',false],
							true
						],
						['Test that the strictEqualityBOOL parameter is defaulted to true, as designed',
							[[0,1],'1'],
							false
						],
						['Test that false is returned when the value is not found in the source array',
							[[0,1],2],
							false
						]
					]],
					['Uize.recordMatches',[
						['Test that specifying the value null for the record produces the result false',
							[null,{foo:'bar'}],
							false
						],
						['Test that specifying the value undefined for the record produces the result false',
							[undefined,{foo:'bar'}],
							false
						],
						['Test that specifying the value null for the match object produces the result true',
							[{foo:'bar'},null],
							true
						],
						['Test that specifying the value undefined for the match object produces the result true',
							[{foo:'bar'},undefined],
							true
						],
						['Test that specifying an empty match object produces the result true',
							[{foo:'bar'},{}],
							true
						],
						['Test that specifying a match object that contains properties that aren\'t in the record produces the result false',
							[{foo:'bar'},{hello:'world'}],
							false
						],
						['Test that specifying a match object with a property that is in the record but whose value is not the same produces the result false',
							[{meaningOfLife:42},{meaningOfLife:'dunno'}],
							false
						],
						['Test that specifying a match object with a property that is in the record and whose values is equal but not in a strict equality produces the result false',
							[{meaningOfLife:42},{meaningOfLife:'42'}],
							false
						],
						['Test that specifying a match object with a property that is in the record and whose values is equal in a strict equality produces the result true',
							[{meaningOfLife:42},{meaningOfLife:42}],
							true
						],
						['Test that specifying a match object with multiple properties and that is only a partial match with the record produces the result false',
							[{foo:'bar',hello:'world',meaningOfLife:42},{foo:'bar',hello:'there',meaningOfLife:42}],
							false
						],
						['Test that specifying a match object with multiple properties and that is a complete match with the record produces the result true',
							[{foo:'bar',hello:'world',meaningOfLife:42},{foo:'bar',hello:'world',meaningOfLife:42}],
							true
						],
						['Test that properties that are in the record but that are not in the match object are not considered and do not affect the success of the match',
							[{foo:'bar',hello:'world',meaningOfLife:42},{meaningOfLife:42}],
							true
						]
					]],
					['Uize.findRecordNo',[
						['Test that specifying null for the records results in the default number being returned',
							[null,{},5],
							5
						],
						['Test that specifying undefined for the records results in the default number being returned',
							[undefined,{},5],
							5
						],
						['Test that not specifying a default number results in the value -1 being used for default number',
							[[{foo:'boo'},{foo:'bar'},{foo:'foo'}],{foo:'woo'}],
							-1
						],
						['Test that specifying the value null for default number is treated as a default number of -1',
							[[{foo:'boo'},{foo:'bar'},{foo:'foo'}],{foo:'woo'},null],
							-1
						],
						['Test that specifying the value undefined for default number is treated as a default number of -1',
							[[{foo:'boo'},{foo:'bar'},{foo:'foo'}],{foo:'woo'},undefined],
							-1
						],
						['Test that specifying a string value for detault number results in it being coerced to a number',
							[[{foo:'boo'},{foo:'bar'},{foo:'foo'}],{foo:'woo'},'5'],
							5
						],
						['Test that specifying a boolean value for the default number results in it being coerced to a number',
							[[{foo:'boo'},{foo:'bar'},{foo:'foo'}],{foo:'woo'},true],
							1
						],
						['Test that specifying an object value for the default number results in it being coerced to a number',
							[[{foo:'boo'},{foo:'bar'},{foo:'foo'}],{foo:'woo'},new Uize ({value:5})],
							5
						],
						['Test that specifying an object value for the default number that cannot be coerced to a number results in the value -1 being used for the default number',
							[[{foo:'boo'},{foo:'bar'},{foo:'foo'}],{foo:'woo'},new Uize ({value:'blah'})],
							-1
						],
						['Test that the index of the first matching record is returned when the match matches a record',
							[[{foo:'boo'},{foo:'bar'},{foo:'foo'}],{foo:'bar'}],
							1
						],
						['Test that the value 0 is returned when the value null is specified for the match',
							[[{foo:'boo'},{foo:'bar'},{foo:'foo'}],null],
							0
						]
					]],
					['Uize.findRecord',[
						['Test that specifying null for the records results in the value null being returned',
							[null,{},5],
							null
						],
						['Test that specifying undefined for the records results in the value null being returned',
							[undefined,{},5],
							null
						],
						{
							title:'Test that the first matching record is returned when the match matches a record',
							test:function () {
								var _records = [{foo:'boo'},{foo:'bar'},{foo:'foo'}];
								return this.expectSameAs (_records [1],Uize.findRecord (_records,{foo:'bar'}));
							}
						},
						{
							title:'Test that the first record is returned when the value null is specified for the match',
							test:function () {
								var _records = [{foo:'boo'},{foo:'bar'},{foo:'foo'}];
								return this.expectSameAs (_records [0],Uize.findRecord (_records,null));
							}
						},
						{
							title:'Test that the record for the specified default record number is returned when no matching record is found',
							test:function () {
								var _records = [{foo:'boo'},{foo:'bar'},{foo:'foo'}];
								return this.expectSameAs (_records [2],Uize.findRecord (_records,{foo:'woo'},2));
							}
						}
					]],
					['Uize.getGuid',[
						{
							title:'Test that a string type value is returned, as expected',
							test:function () {return this.expectNonEmptyString (Uize.getGuid ())}
						},
						{
							title:'Test that result is different across ten successive calls',
							test:function () {
								var _callResults = [];
								for (var _callNo = -1; ++_callNo < 10;)
									_callResults.push (Uize.getGuid ())
								;
								return this.expectNoRepeats (_callResults);
							}
						}
					]],
					['Uize.getPathToLibrary',[
					]],
					['Uize.globalEval',[
					]],
					['Uize.isInstance',[
						['Test that calling with no parameters produces the result false',[],false],
						['Test that null is not regarded as a Uize subclass instance',null,false],
						['Test that undefined is not regarded as a Uize subclass instance',undefined,false],
						['Test that a string is not regarded as a Uize subclass instance','hello',false],
						['Test that a number is not regarded as a Uize subclass instance',5,false],
						['Test that a boolean is not regarded as a Uize subclass instance',true,false],
						['Test that a simple object is not regarded as a Uize subclass instance',{},false],
						['Test that an array is not regarded as a Uize subclass instance',[],false],
						['Test that a regular expression is not regarded as a Uize subclass instance',/\d+/,false],
						['Test that a function is not regarded as a Uize subclass instance',function () {},false],
						['Test that a Uize class is not regarded as a Uize subclass instance',Uize,false],
						['Test that a Uize package is not regarded as a Uize subclass instance',Uize.Data,false],
						['Test that a Uize instance is correctly regarded as a Uize subclass instance',new Uize,true]
					]],
					['Uize.clone',[
						/*** test cloning of null values ***/
							['Test that cloning the value null produces the value null',null,null],
							['Test that cloning the value undefined produces the value undefined',undefined,undefined],

						/*** test cloning of string valus ***/
							['Test that cloning an empty string produces an empty string','',''],
							['Test that cloning a non-empty string is handled correctly','solar','solar'],

						/*** test cloning of number values ***/
							['Test that cloning the value 0 produces the value 0',0,0],
							['Test that cloning a negative number is handled correctly',-1,-1],
							['Test that cloning a positive number is handled correctly',1,1],
							['Test that cloning the special number value NaN is handled correctly',NaN,NaN],
							['Test that cloning the special number value Infinity is handled correctly',Infinity,Infinity],
							['Test that cloning the special number value -Infinity is handled correctly',-Infinity,-Infinity],

						/*** test cloning of boolean values ***/
							['Test that cloning the boolean value false produces the value false',false,false],
							['Test that cloning the boolean value true produces the value true',true,true],

						/*** test cloning of instances of JavaScript's built-in objects ***/
							_cloneObjectTest (
								'Test that cloning an instance of the RegExp object is handled correctly',
								RegExp,
								new RegExp ('^\\s+$','gi')
							),
							_cloneObjectTest (
								'Test that cloning an instance of the Date object is handled correctly',
								Date,
								'2001/9/11'
							),
							_cloneObjectTest (
								'Test that cloning an instance of the String object is handled correctly',
								String,
								'solar'
							),
							_cloneObjectTest (
								'Test that cloning an instance of the Number object is handled correctly',
								Number,
								42
							),
							_cloneObjectTest (
								'Test that cloning an instance of the Boolean object is handled correctly',
								Boolean,
								true
							),

						/*** test cloning of one level deep simple objects ***/
							['Test that cloning an empty object produces an empty object',{},{}],
							_cloneObjectTest (
								'Test that the clone of an object is not a reference to that object, but is a new object',
								Object,
								{}
							),
							['Test that cloning a non-empty object produces an identical copy of that object',
								_oneLevelDeepTestObjectForCloning,
								_oneLevelDeepTestObjectForCloning
							],

						/*** test cloning of one level deep arrays ***/
							['Test that cloning an empty array produces an empty array',[[]],[]],
							_cloneObjectTest (
								'Test that the clone of an array is not a reference to that array, but is a new array',
								Array,
								[]
							),
							['Test that cloning a non-empty array produces an identical copy of that array',
								[_oneLevelDeepTestArrayForCloning],
								_oneLevelDeepTestArrayForCloning
							],

						/*** test cloning of complex data structures ***/
							['Test that cloning a complex object data structure is handled correctly',
								[_complexObjectDataStructure],
								_complexObjectDataStructure
							],
							['Test that cloning a complex array data structure is handled correctly',
								[_complexArrayDataStructure],
								_complexArrayDataStructure
							],

						/*** test cloning of value types that should just be copied by reference ***/
							{
								title:'Test that cloning a function simply returns a reference to that function',
								test:function () {
									var _toClone = function () {};
									return this.expectSameAs (_toClone,Uize.clone (_toClone))
								}
							},
							{
								title:'Test that cloning a Uize class instance simply returns a reference to that instance',
								test:function () {
									var _toClone = new Uize;
									return this.expectSameAs (_toClone,Uize.clone (_toClone))
								}
							},

						/*** miscellaneous ***/
							['Test that specifying no parameter is equivalent to cloning the value undefined',
								[],
								undefined
							]
					]],
					['Uize.callOn',[
						{
							title:'Test that specifying null for the object results in no action',
							test:function () {
								var success = true;
								Uize.callOn (null,function () {success = false});
								return success;
							}
						},
						{
							title:'Test that specifying undefined for the object results in no action',
							test:function () {
								var success = true;
								Uize.callOn (undefined,function () {success = false});
								return success;
							}
						},
						{
							title:
								'Test that specifying a value for method that is neither a string nor a function results in no error being produced',
							test:function () {
								var _target = new Uize;
								Uize.callOn (_target);
								Uize.callOn (_target,null);
								Uize.callOn (_target,undefined);
								Uize.callOn (_target,42);
								Uize.callOn (_target,true);
								Uize.callOn (_target,{});
								Uize.callOn (_target,[]);
								return true;
							}
						},
						{
							title:
								'Test that specifying a function as the method and an instance as the target results in the function being called as an instance method on the instance',
							test:function () {
								var
									_target = new Uize,
									_success = false
								;
								Uize.callOn (_target,function () {_success = this == _target});
								return _success;
							}
						},
						{
							title:
								'Test that when the optional arguments parameter is not specified, the arguments are defaulted to an empty array',
							test:function () {
								var
									_target = new Uize,
									_success = false
								;
								Uize.callOn (_target,function () {_success = arguments.length == 0});
								return _success;
							}
						},
						{
							title:
								'Test that when the optional arguments parameter is specified, those arguments are passed in the call correctly',
							test:function () {
								var
									_target = new Uize,
									_success = false
								;
								Uize.callOn (
									_target,
									function () {
										_success =
											arguments.length == 3 &&
											arguments [0] === 'foo' &&
											arguments [1] === 42 &&
											arguments [2] === true
										;
									},
									['foo',42,true]
								);
								return _success;
							}
						},
						{
							title:
								'Test that specifying the target as an instance and the method as a string does not result in an error being produced when the method is not defined on the instance',
							test:function () {
								var
									_target = new Uize,
									_bogusMethodName = 'SOME-BOGUS-METHOD-NAME'
								;
								delete _target [_bogusMethodName];
								Uize.callOn (_target,_bogusMethodName);
								return true;
							}
						},
						{
							title:
								'Test that specifying the target as an instance and the method as a string results in the specified method being called as an instance method on the instance',
							test:function () {
								var
									_target = new Uize,
									_success = false
								;
								_target.someSillyMethodName = function () {
									_success =
										this == _target &&
										arguments.length == 3 &&
										arguments [0] === 'foo' &&
										arguments [1] === 42 &&
										arguments [2] === true
									;
								};
								Uize.callOn (_target,'someSillyMethodName',['foo',42,true]);
								return true;
							}
						},
						{
							title:
								'Test that specifying an array as the target results in the method being called correctly on all elements of the array',
							test:function () {
								var
									_callLog = [],
									_DummyClass = Uize.subclass (),
									_testArguments = ['foo',42,true],
									_subTarget0 = new _DummyClass ({name:'subTarget0'}),
									_subTarget1 = new _DummyClass ({name:'subTarget1'}),
									_subTarget2 = new _DummyClass ({name:'subTarget2'}),
									_target = [_subTarget0,_subTarget1,_subTarget2]
								;
								Uize.callOn (
									_target,
									function () {
										_callLog.push ({
											_name:this.get ('name'),
											_arguments:[].concat.apply ([],arguments)
										});
									},
									_testArguments
								);
								return this.expect (
									[
										{_name:'subTarget0',_arguments:_testArguments},
										{_name:'subTarget1',_arguments:_testArguments},
										{_name:'subTarget2',_arguments:_testArguments}
									],
									_callLog
								);
							}
						},
						{
							title:
								'Test that specifying an object as the target results in the method being called correctly on all property values of the object',
							test:function () {
								var
									_callLog = [],
									_DummyClass = Uize.subclass (),
									_testArguments = ['foo',42,true],
									_subTarget0 = new _DummyClass ({name:'subTarget0'}),
									_subTarget1 = new _DummyClass ({name:'subTarget1'}),
									_subTarget2 = new _DummyClass ({name:'subTarget2'}),
									_target = {foo:_subTarget0,bar:_subTarget1,helloworld:_subTarget2}
								;
								Uize.callOn (
									_target,
									function () {
										_callLog.push ({
											_name:this.get ('name'),
											_arguments:[].concat.apply ([],arguments)
										});
									},
									_testArguments
								);
								return this.expect (
									[
										{_name:'subTarget0',_arguments:_testArguments},
										{_name:'subTarget1',_arguments:_testArguments},
										{_name:'subTarget2',_arguments:_testArguments}
									],
									_callLog
								);
							}
						},
						{
							title:'Test that recursion is handled correctly when the target is a complex data structure',
							test:function () {
								var
									_expectedCallLog = [],
									_actualCallLog = [],
									_DummyClass = Uize.subclass (),
									_testArguments = ['foo',42,true],
									_subTargetNo = -1
								;
								function _getNextSubTarget () {
									var _subTargetName = 'subTarget' + ++_subTargetNo;
									_expectedCallLog.push ({
										_name:_subTargetName,
										_arguments:_testArguments
									});
									return new _DummyClass ({name:_subTargetName});
								}
								var _target = {
									foo:_getNextSubTarget (),
									bar:[ // array nested in an object
										_getNextSubTarget (),
										{ // object nested in an array
											hello:_getNextSubTarget (),
											there:{ // object nested in an object
												silly:_getNextSubTarget (),
												sausage:_getNextSubTarget ()
											},
											world:_getNextSubTarget ()
										},
										[ // array nested in an array
											_getNextSubTarget (),
											_getNextSubTarget ()
										]
									],
									blah:_getNextSubTarget ()
								};
								Uize.callOn (
									_target,
									function () {
										_actualCallLog.push ({
											_name:this.get ('name'),
											_arguments:[].concat.apply ([],arguments)
										});
									},
									_testArguments
								);
								return this.expect (_expectedCallLog,_actualCallLog);
							}
						}
					]],

					['Uize.fire',[
						// NOTE: this method is thoroughly tested by the event system tests (so, no more tests here)
					]],
					['Uize.wire',[
						// NOTE: this method is thoroughly tested by the event system tests (so, no more tests here)
					]],
					['Uize.unwire',[
						// NOTE: this method is thoroughly tested by the event system tests (so, no more tests here)
					]],
					['Uize.registerProperties',[
					]],
					['Uize.get',[
					]],
					['Uize.set',[
					]],
					['Uize.toggle',[
					]],
					['Uize.toString',[
					]],
					['Uize.valueOf',[
					]],
					['Uize.module',[
					]],
					['Uize.subclass',[
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
					title:'Data Module Pattern with Caching Accessor',
					test:function () {
						var _result;

						/*** declare MyNamespace namespace ***/
							Uize.module ({name:'MyNamespace'});

						/*** declare module with data records for engineering employees ***/
							Uize.module ({
								name:'MyNamespace.EngineeringEmployees',
								builder:function () {
									var _cachedData;

									return function (_getCopy) {
										if (_cachedData && !_getCopy) return _cachedData;

										var _data = [
											{firstName:'John',lastName:'Wilkey',department:'engineering'},
											{firstName:'Nick',lastName:'Arendsen',department:'engineering'},
											{firstName:'Mark',lastName:'Strathley',department:'engineering'}
										];
										return _getCopy ? _data : (_cachedData = _data);
									};
								}
							});

						/*** declare module with data records for finance employees ***/
							Uize.module ({
								name:'MyNamespace.FinanceEmployees',
								builder:function () {
									var _cachedData;

									return function (_getCopy) {
										if (_cachedData && !_getCopy) return _cachedData;

										var _data = [
											{firstName:'Marie',lastName:'Stevenson',department:'finance'},
											{firstName:'Craig',lastName:'Pollack',department:'finance'}
										];
										return _getCopy ? _data : (_cachedData = _data);
									};
								}
							});

						/*** declare module that combines data for engineering and finance employees ***/
							Uize.module ({
								name:'MyNamespace.AllEmployees',
								required:[
									'MyNamespace.EngineeringEmployees',
									'MyNamespace.FinanceEmployees'
								],
								builder:function () {
									var _cachedData;

									return function (_getCopy) {
										if (_cachedData && !_getCopy) return _cachedData;

										var _data = [].concat (
											MyNamespace.EngineeringEmployees (true),
											MyNamespace.FinanceEmployees (true)
										);
										return _getCopy ? _data : (_cachedData = _data);
									};
								}
							});

						/*** declare anonymous module that requires all employees module and compares to expected ***/
							Uize.module ({
								required:'MyNamespace.AllEmployees',
								builder:function () {
									_result = Uize.Data.identical (
										MyNamespace.AllEmployees (),
										[
											{firstName:'John',lastName:'Wilkey',department:'engineering'},
											{firstName:'Nick',lastName:'Arendsen',department:'engineering'},
											{firstName:'Mark',lastName:'Strathley',department:'engineering'},
											{firstName:'Marie',lastName:'Stevenson',department:'finance'},
											{firstName:'Craig',lastName:'Pollack',department:'finance'}
										]
									);
								}
							});

						return _result;
					}
				}
			]
		});
	}
});

