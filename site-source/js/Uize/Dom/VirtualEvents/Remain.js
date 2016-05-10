/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Dom.VirtualEvents.Remain Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 5
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Dom.VirtualEvents.Remain= package implements a set of remain-in-state virtual DOM events, such as the =remainOver()=, =remainDown()=, and =remainOut()= events.

		*DEVELOPERS:* `Chris van Rensburg`

	In a Nutshell
		Remain-in-state virtual DOM events are events that are fired when a node remains in a specific event state for a specified amount of time.

		Requiring a node to remain in a specific event state for a set amount of time before firing an event is a helpful indicator of the user being truly interested in something (as opposed to just "wandering through"). Consider the classic case of the user mousing over a node and then resting the mouse for a certain period of time over that node. You might like to know if the user does this for a specific node, because this may be your indication that the user is interested in what clicking the node might do, and you may wish to present them with a helpful tooltip that is implemented using HTML and that provides them more information about what they're considering clicking on.

		Now, you probably don't want to trigger the display of an elaborate info tooltip based merely upon the user mousing over the node, since this may hamper the page's performance - especially if displaying the tooltip requires an Ajax request - and displaying and hiding chunky tooltips as the user moves the mouse across the page may be a dreadful user experience, in any event. In such cases, it would be really nice to have an event that fires only when the user has actually stopped the mouse over a node. Virtual DOM events to the rescue! Specifically, the =mouseRest= virtual DOM event. This event accepts a duration parameter, to let you tune how long the user needs to keep the mouse rested over the node before the event is fired.

		Beyond the indispensable =mouseRest= virtual DOM event, a plethora of other remain-in-state virtual DOM events are built into the =Uize.Dom.VirtualEvents.Remain= module.

		Remain-in-state Virtual DOM Event Static Methods
			The =Uize.Dom.VirtualEvents.Remain= module provides the following static methods for making remain-in-state virtual DOM events...

			- =Uize.Dom.VirtualEvents.Remain.keyRemainDown=
			- =Uize.Dom.VirtualEvents.Remain.keyRemainUp=
			- =Uize.Dom.VirtualEvents.Remain.mouseRemainDown=
			- =Uize.Dom.VirtualEvents.Remain.mouseRemainOut=
			- =Uize.Dom.VirtualEvents.Remain.mouseRemainOver=
			- =Uize.Dom.VirtualEvents.Remain.mouseRemainUp=
			- =Uize.Dom.VirtualEvents.Remain.mouseRest=
			- =Uize.Dom.VirtualEvents.Remain.remainBlurred=
			- =Uize.Dom.VirtualEvents.Remain.remainFocused=

		Remain-in-state Registered Virtual DOM Events
			The =Uize.Dom.VirtualEvents.Remain= module registers the following event names for `remain-in-state registered virtual DOM events`...

			- =keyRemainDown=
			- =keyRemainUp=
			- =mouseRemainDown=
			- =mouseRemainOut=
			- =mouseRemainOver=
			- =mouseRemainUp=
			- =mouseRest=
			- =remainBlurred=
			- =remainFocused=
*/

Uize.module ({
	name:'Uize.Dom.VirtualEvents.Remain',
	required:[
		'Uize.Dom.Basics',
		'Uize.Dom.VirtualEvent'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_package = function () {},
				_true = true,
				_false = false,
				_Uize_Dom_Basics = Uize.Dom.Basics,
				_Uize_Dom_VirtualEvent = Uize.Dom.VirtualEvent
		;

		/*** Public Static Methods ***/
			_package.makeRemainInStateEventMaker = function (
				_eventName,_durationDefault,_timerTriggerEvents,_timerCancelEvents,_triggerEventsResetTimer,_allowRefire
			) {
				return _Uize_Dom_VirtualEvent.register (
					_eventName,
					function (_duration) {
						_duration = Uize.toNumber (_duration,_durationDefault);
						return _Uize_Dom_VirtualEvent.getCached (
							_eventName + '(' + _duration + ')',
							function (_node,_handler,_subWiringsOwnerId) {
								function _wireStateUpdater (_events,_stateUpdater) {
									if (Uize.isArray (_events)) {
										for (var _eventNo = _events.length; --_eventNo > -1;)
											_Uize_Dom_Basics.wire (_node,_events [_eventNo],_stateUpdater,_subWiringsOwnerId)
										;
									} else {
										_Uize_Dom_Basics.wire (_node,_events,_stateUpdater,_subWiringsOwnerId);
									}
								}
								var
									_eventCopy = {},
									_fired = _false,
									_timeout,
									_clearTimeout = function () {_timeout = clearTimeout (_timeout)}
								;
								_wireStateUpdater (
									_timerTriggerEvents,
									function (_event) {
										_triggerEventsResetTimer !== _false && _clearTimeout ();
										if (!_timeout && (!_fired || _allowRefire !== _false)) {
											Uize.copyInto (_eventCopy,_event);
											_timeout = setTimeout (
												function () {
													_fired = _true;
													_handler.call (_node,_eventCopy);
												},
												_duration
											);
										}
									}
								);
								_wireStateUpdater (
									_timerCancelEvents,
									function () {
										_fired = _false;
										_clearTimeout ();
									}
								);
							}
						);
					}
				);
				/*?
					Static Methods
						Uize.Dom.VirtualEvents.Remain.makeRemainInStateEventMaker
							For advanced users, returns a `virtual DOM event maker` function, for a remain-in-state virtual DOM event that is triggered by the specified trigger events and that is canceled by the specified cancel events.

							SYNTAX
							............................................................................
							eventMakerFUNC = Uize.Dom.VirtualEvents.Remain.makeRemainInStateEventMaker (
								eventNameSTR,
								defaultDurationMsINT,
								timerTriggerEventSTRorEventsARRAY,
								timerCancelEventSTRorEventsARRAY,
								triggerEventsResetTimerBOOL,        // optional
								allowRefireBOOL                     // optional
							);
							............................................................................

							eventNameSTR
								A string, specifying the name of the remain-in-state `virtual DOM Event`.

								The `virtual DOM event maker` function returned by this method is automatically registered by the name specified in the =eventNameSTR= parameter, using the =Uize.Dom.VirtualEvent.register= static method.

							defaultDurationMsINT
								An integer, specifying the default duration that should be used if a value is not specified for the =durationMsINT= parameter when the remain-in-state virtual DOM event's maker method is called, or if the value =null= or =undefined= is specified for this parameter.

							timerTriggerEventSTRorEventsARRAY
								A string, specifying a single event, or an array specifying multiple events that should be wired up to trigger the remain-in-state timer.

							timerCancelEventSTRorEventsARRAY
								A string, specifying a single event, or an array specifying multiple events that should be wired up to cancel the remain-in-state timer.

							triggerEventsResetTimerBOOL
								An optional boolean, specifying whether or not the trigger event(s) specified in the =timerTriggerEventSTRorEventsARRAY= parameter should reset the remain-in-state timer.

								If this optional parameter is not specified, then the value =true= will be used as the default.

							allowRefireBOOL
								An optional boolean, specifying whether or not the event should be allowed to be refired after it has already fired once and before a cancel event specified in the =timerCancelEventSTRorEventsARRAY= parameter has been fired.

								If this optional parameter is not specified, then the value =true= will be used as the default.

							EXAMPLE
							...................................................................................................
							Uize.Dom.VirtualEvents.Remain.mouseRest = Uize.Dom.VirtualEvents.Remain.makeRemainInStateEventMaker (
								'mouseRest',                // event name is "mouseRest"
								500,                        // default duration of 500 milliseconds
								['mouseover','mousemove'],  // remain-in-state timer trigger events
								['mouseout','mousedown'],   // remain-in-state timer cancel events
								true,                       // trigger events do reset timer
								false                       // don't allow refiring until cancel occurs again
							);
							...................................................................................................

							The above call to the =Uize.Dom.VirtualEvents.Remain.mouseRest= method would manufacture the =mouseRest= virtual DOM event that is offered in this module. This method is in fact used to make all of the remain-in-state virtual DOM events that are offered in the =Uize.Dom.VirtualEvents.Remain= module. For an exhaustive look at how this method can be used to manufacture `virtual DOM event maker` functions, take a look at the source code for this module.

							NOTES
							- this method is intended for advanced users wishing to create their own unique remain-in-state virtual DOM events, beyond those that are supplied as built-in events in this module
				*/
			};

		/*** Make Remain-in-state Events ***/
			function _makeRemainInStateEventMaker (_eventName) {
				_package [_eventName] = _package.makeRemainInStateEventMaker.apply (0,arguments);
			}

			_makeRemainInStateEventMaker ('keyRemainDown',500,'keydown','keyup',_false);
				/*?
					Static Methods
						Uize.Dom.VirtualEvents.Remain.keyRemainDown
							Returns a `virtual DOM event` object, for an event that is fired when the user presses down on a key on the keyboard for a focused node that supports key events, and then holds down that key for a specified amount of time.

							SYNTAX
							.................................................................................
							virtualDomEventOBJ = Uize.Dom.VirtualEvents.Remain.keyRemainDown (durationMsINT);
							.................................................................................

							When a handler is wired for this `virtual DOM event` on a node that supports key events, a timer is started when the user presses down on a key on the keyboard while that node is focused. If the user holds down the key for the amount of time specified by the =durationMsINT= parameter, then the handler wired for this event will be executed. If, however, the user releases the key before the required amount of time has elapsed, then the timer will be canceled and the handler will not be executed.

							VARIATION
							....................................................................
							virtualDomEventOBJ = Uize.Dom.VirtualEvents.Remain.keyRemainDown ();
							....................................................................

							When no =durationMsINT= parameter is specified, then the value for this parameter is defaulted to =500= (half a second).

							NOTES
							- this `virtual DOM event maker` is registered with the name =keyRemainDown=
							- see related `remain-in-state virtual DOM event static methods`

					Registered Virtual DOM Events
						keyRemainDown
							The registered name for the `virtual DOM event maker` that is implemented in the =Uize.Dom.VirtualEvents.Remain.keyRemainDown= static method.

							SYNTAX
							............................
							keyRemainDown()
							keyRemainDown(durationMsINT)
							............................

							EXAMPLE
							...................................................................................
							Uize.Dom.Basics.wire ('myNode','keyRemainDown(500)',function () {alert ('HELLO')});
							...................................................................................

							NOTES
							- see related `remain-in-state registered virtual DOM events`
				*/

			_makeRemainInStateEventMaker ('keyRemainUp',500,'keyup','keydown');
				/*?
					Static Methods
						Uize.Dom.VirtualEvents.Remain.keyRemainUp
							Returns a `virtual DOM event` object, for an event that is fired when the user releases a key on the keyboard for a focused node that supports key events, and then doesn't press down on a key again for that node for a specified amount of time.

							SYNTAX
							...............................................................................
							virtualDomEventOBJ = Uize.Dom.VirtualEvents.Remain.keyRemainUp (durationMsINT);
							...............................................................................

							When a handler is wired for this `virtual DOM event` on a node that supports key events, a timer is started when the user releases a key on the keyboard while that node is focused. If the user doesn't press down on a key again while that node is focused, for the amount of time specified by the =durationMsINT= parameter, then the handler wired for this event will be executed. If, however, the user *does* press down again on a key before the required amount of time has elapsed, then the timer will be canceled and the handler will not be executed.

							VARIATION
							..................................................................
							virtualDomEventOBJ = Uize.Dom.VirtualEvents.Remain.keyRemainUp ();
							..................................................................

							When no =durationMsINT= parameter is specified, then the value for this parameter is defaulted to =500= (half a second).

							NOTES
							- this `virtual DOM event maker` is registered with the name =keyRemainUp=
							- see related `remain-in-state virtual DOM event static methods`

					Registered Virtual DOM Events
						keyRemainUp
							The registered name for the `virtual DOM event maker` that is implemented in the =Uize.Dom.VirtualEvents.Remain.keyRemainUp= static method.

							SYNTAX
							..........................
							keyRemainUp()
							keyRemainUp(durationMsINT)
							..........................

							EXAMPLE
							.................................................................................
							Uize.Dom.Basics.wire ('myNode','keyRemainUp(500)',function () {alert ('HELLO')});
							.................................................................................

							NOTES
							- see related `remain-in-state registered virtual DOM events`
				*/

			_makeRemainInStateEventMaker ('mouseRemainDown',500,'mousedown',['mouseup','mouseout']);
				/*?
					Static Methods
						Uize.Dom.VirtualEvents.Remain.mouseRemainDown
							Returns a `virtual DOM event` object, for an event that is fired when a user mouses down on a node and doesn't mouse up from that node or mouse out of it for a specified amount of time.

							SYNTAX
							...................................................................................
							virtualDomEventOBJ = Uize.Dom.VirtualEvents.Remain.mouseRemainDown (durationMsINT);
							...................................................................................

							When a handler is wired for this `virtual DOM event` on a node, a timer is started when the user mouses down on the node. If the user doesn't mouse up from the node or mouse out of it for the amount of time specified by the =durationMsINT= parameter, then the handler wired for this event will be executed. If, however, the user *does* mouse up from the node, or if the user mouses out of the node before the required amount of time has elapsed, then the timer will be canceled and the handler will not be executed.

							VARIATION
							......................................................................
							virtualDomEventOBJ = Uize.Dom.VirtualEvents.Remain.mouseRemainDown ();
							......................................................................

							When no =durationMsINT= parameter is specified, then the value for this parameter is defaulted to =500= (half a second).

							NOTES
							- this `virtual DOM event maker` is registered with the name =mouseRemainDown=
							- see related `remain-in-state virtual DOM event static methods`

					Registered Virtual DOM Events
						mouseRemainDown
							The registered name for the `virtual DOM event maker` that is implemented in the =Uize.Dom.VirtualEvents.Remain.mouseRemainDown= static method.

							SYNTAX
							..............................
							mouseRemainDown()
							mouseRemainDown(durationMsINT)
							..............................

							EXAMPLE
							.....................................................................................
							Uize.Dom.Basics.wire ('myNode','mouseRemainDown(500)',function () {alert ('HELLO')});
							.....................................................................................

							NOTES
							- see related `remain-in-state registered virtual DOM events`
				*/

			_makeRemainInStateEventMaker ('mouseRemainOut',500,'mouseout','mouseover');
				/*?
					Static Methods
						Uize.Dom.VirtualEvents.Remain.mouseRemainOut
							Returns a `virtual DOM event` object, for an event that is fired when a user mouses out of a node and doesn't mouse over that node again for a specified amount of time.

							SYNTAX
							..................................................................................
							virtualDomEventOBJ = Uize.Dom.VirtualEvents.Remain.mouseRemainOut (durationMsINT);
							..................................................................................

							When a handler is wired for this `virtual DOM event` on a node, a timer is started when the user mouses out of the node. If the user doesn't mouse over the node again for the amount of time specified by the =durationMsINT= parameter, then the handler wired for this event will be executed. If, however, the user *does* mouse over the node again before the required amount of time has elapsed, then the timer will be canceled and the handler will not be executed.

							VARIATION
							.....................................................................
							virtualDomEventOBJ = Uize.Dom.VirtualEvents.Remain.mouseRemainOut ();
							.....................................................................

							When no =durationMsINT= parameter is specified, then the value for this parameter is defaulted to =500= (half a second).

							NOTES
							- this `virtual DOM event maker` is registered with the name =mouseRemainOut=
							- see related `remain-in-state virtual DOM event static methods`

					Registered Virtual DOM Events
						mouseRemainOut
							The registered name for the `virtual DOM event maker` that is implemented in the =Uize.Dom.VirtualEvents.Remain.mouseRemainOut= static method.

							SYNTAX
							.............................
							mouseRemainOut()
							mouseRemainOut(durationMsINT)
							.............................

							EXAMPLE
							....................................................................................
							Uize.Dom.Basics.wire ('myNode','mouseRemainOut(500)',function () {alert ('HELLO')});
							....................................................................................

							NOTES
							- see related `remain-in-state registered virtual DOM events`
				*/

			_makeRemainInStateEventMaker ('mouseRemainOver',500,['mouseover','mousemove'],['mouseout','mousedown'],_false);
				/*?
					Static Methods
						Uize.Dom.VirtualEvents.Remain.mouseRemainOver
							Returns a `virtual DOM event` object, for an event that is fired when a user mouses over a node and doesn't mouse out of that node or mouse down on it for a specified amount of time.

							SYNTAX
							...................................................................................
							virtualDomEventOBJ = Uize.Dom.VirtualEvents.Remain.mouseRemainOver (durationMsINT);
							...................................................................................

							When a handler is wired for this `virtual DOM event` on a node, a timer is started when the user mouses over the node. If the user doesn't mouse out of the node or mouse down on it for the amount of time specified by the =durationMsINT= parameter, then the handler wired for this event will be executed. If, however, the user *does* mouse out of the node, or if the user mouses down on the node before the required amount of time has elapsed, then the timer will be canceled and the handler will not be executed.

							VARIATION
							......................................................................
							virtualDomEventOBJ = Uize.Dom.VirtualEvents.Remain.mouseRemainOver ();
							......................................................................

							When no =durationMsINT= parameter is specified, then the value for this parameter is defaulted to =500= (half a second).

							NOTES
							- this `virtual DOM event maker` is registered with the name =mouseRemainOver=
							- see related `remain-in-state virtual DOM event static methods`

					Registered Virtual DOM Events
						mouseRemainOver
							The registered name for the `virtual DOM event maker` that is implemented in the =Uize.Dom.VirtualEvents.Remain.mouseRemainOver= static method.

							SYNTAX
							..............................
							mouseRemainOver()
							mouseRemainOver(durationMsINT)
							..............................

							EXAMPLE
							.....................................................................................
							Uize.Dom.Basics.wire ('myNode','mouseRemainOver(500)',function () {alert ('HELLO')});
							.....................................................................................

							NOTES
							- see related `remain-in-state registered virtual DOM events`
				*/

			_makeRemainInStateEventMaker ('mouseRemainUp',500,'mouseup','mousedown');
				/*?
					Static Methods
						Uize.Dom.VirtualEvents.Remain.mouseRemainUp
							Returns a `virtual DOM event` object, for an event that is fired when a user mouses up on a node and doesn't mouse down again on that node for a specified amount of time.

							SYNTAX
							.................................................................................
							virtualDomEventOBJ = Uize.Dom.VirtualEvents.Remain.mouseRemainUp (durationMsINT);
							.................................................................................

							When a handler is wired for this `virtual DOM event` on a node, a timer is started when the user mouses up on the node. If the user doesn't mouse down again on the node for the amount of time specified by the =durationMsINT= parameter, then the handler wired for this event will be executed. If, however, the user *does* mouse down again on the node before the required amount of time has elapsed, then the timer will be canceled and the handler will not be executed.

							VARIATION
							....................................................................
							virtualDomEventOBJ = Uize.Dom.VirtualEvents.Remain.mouseRemainUp ();
							....................................................................

							When no =durationMsINT= parameter is specified, then the value for this parameter is defaulted to =500= (half a second).

							NOTES
							- this `virtual DOM event maker` is registered with the name =mouseRemainUp=
							- see related `remain-in-state virtual DOM event static methods`

					Registered Virtual DOM Events
						mouseRemainUp
							The registered name for the `virtual DOM event maker` that is implemented in the =Uize.Dom.VirtualEvents.Remain.mouseRemainUp= static method.

							SYNTAX
							............................
							mouseRemainUp()
							mouseRemainUp(durationMsINT)
							............................

							EXAMPLE
							...................................................................................
							Uize.Dom.Basics.wire ('myNode','mouseRemainUp(500)',function () {alert ('HELLO')});
							...................................................................................

							NOTES
							- see related `remain-in-state registered virtual DOM events`
				*/

			_makeRemainInStateEventMaker (
				'mouseRest',500,['mouseover','mousemove'],['mouseout','mousedown'],_true,_false
				/*?
					Static Methods
						Uize.Dom.VirtualEvents.Remain.mouseRest
							Returns a `virtual DOM event` object, for an event that is fired once the user has rested the mouse over a node (and doesn't mouse out of that node or mouse down on it) for a specified amount of time.

							SYNTAX
							.............................................................................
							virtualDomEventOBJ = Uize.Dom.VirtualEvents.Remain.mouseRest (durationMsINT);
							.............................................................................

							When a handler is wired for this `virtual DOM event` on a node, a timer is started when the user mouses over the node. If the user rests the mouse and doesn't mouse out of the node or mouse down on it for the amount of time specified by the =durationMsINT= parameter, then the handler wired for this event will be executed. If the user moves the mouse but stays over the node, then the timer is reset and the handler may still be executed if the user once again rests the mouse over the node for the required amount of time. If the user moves the mouse out of the node, or if the user mouses down on the node before the required amount of time has elapsed, then the timer will be canceled and the handler will not be executed.

							VARIATION
							.....................................................................
							virtualDomEventOBJ = Uize.Dom.VirtualEvents.Remain.mouseRemainOut ();
							.....................................................................

							When no =durationMsINT= parameter is specified, then the value for this parameter is defaulted to =500= (half a second).

							Because the =mouserest= event is a `virtual DOM event`, there is no dedicated browser event object that can be supplied to a handler for this event. What *is* supplied to an event handler is a copy of the last =mouseover= or =mousemove= browser event (likely the latter), allowing the handler to at least have access to coordinates that reflect the mouse position when the =mouserest= event is fired.

							NOTES
							- this `virtual DOM event maker` is registered with the name =mouseRest=
							- see related `remain-in-state virtual DOM event static methods`

					Registered Virtual DOM Events
						mouseRest
							The registered name for the `virtual DOM event maker` that is implemented in the =Uize.Dom.VirtualEvents.Remain.mouseRest= static method.

							SYNTAX
							........................
							mouseRest()
							mouseRest(durationMsINT)
							........................

							EXAMPLE
							...............................................................................
							Uize.Dom.Basics.wire ('myNode','mouseRest(500)',function () {alert ('HELLO')});
							...............................................................................

							NOTES
							- see related `remain-in-state registered virtual DOM events`
				*/
			);

			_makeRemainInStateEventMaker ('remainBlurred',500,'blur','focus');
				/*?
					Static Methods
						Uize.Dom.VirtualEvents.Remain.remainBlurred
							Returns a `virtual DOM event` object, for an event that is fired when a node loses focus and remains blurred / unfocused for a specified amount of time.

							SYNTAX
							.................................................................................
							virtualDomEventOBJ = Uize.Dom.VirtualEvents.Remain.remainBlurred (durationMsINT);
							.................................................................................

							When a handler is wired for this `virtual DOM event` on a node, a timer is started when the node loses focus. If the node remains blurred / unfocused for the amount of time specified by the =durationMsINT= parameter, then the handler wired for this event will be executed. If, however, the node regains focus before the required amount of time has elapsed, then the timer will be canceled and the handler will not be executed.

							VARIATION
							....................................................................
							virtualDomEventOBJ = Uize.Dom.VirtualEvents.Remain.remainBlurred ();
							....................................................................

							When no =durationMsINT= parameter is specified, then the value for this parameter is defaulted to =500= (half a second).

							NOTES
							- this `virtual DOM event maker` is registered with the name =remainBlurred=
							- see related `remain-in-state virtual DOM event static methods`

					Registered Virtual DOM Events
						remainBlurred
							The registered name for the `virtual DOM event maker` that is implemented in the =Uize.Dom.VirtualEvents.Remain.remainBlurred= static method.

							SYNTAX
							............................
							remainBlurred()
							remainBlurred(durationMsINT)
							............................

							EXAMPLE
							...................................................................................
							Uize.Dom.Basics.wire ('myNode','remainBlurred(500)',function () {alert ('HELLO')});
							...................................................................................

							NOTES
							- see related `remain-in-state registered virtual DOM events`
				*/

			_makeRemainInStateEventMaker ('remainFocused',500,'focus','blur');
				/*?
					Static Methods
						Uize.Dom.VirtualEvents.Remain.remainFocused
							Returns a `virtual DOM event` object, for an event that is fired when a node stays focused for a specified amount of time.

							SYNTAX
							.................................................................................
							virtualDomEventOBJ = Uize.Dom.VirtualEvents.Remain.remainFocused (durationMsINT);
							.................................................................................

							When a handler is wired for this `virtual DOM event` on a node, a timer is started when the node becomes focused. If the node remains focused for the amount of time specified by the =durationMsINT= parameter, then the handler wired for this event will be executed. If, however, the node loses focus before the required amount of time has elapsed, then the timer will be canceled and the handler will not be executed.

							VARIATION
							....................................................................
							virtualDomEventOBJ = Uize.Dom.VirtualEvents.Remain.remainFocused ();
							....................................................................

							When no =durationMsINT= parameter is specified, then the value for this parameter is defaulted to =500= (half a second).

							NOTES
							- this `virtual DOM event maker` is registered with the name =remainFocused=
							- see related `remain-in-state virtual DOM event static methods`

					Registered Virtual DOM Events
						remainFocused
							The registered name for the `virtual DOM event maker` that is implemented in the =Uize.Dom.VirtualEvents.Remain.remainFocused= static method.

							SYNTAX
							............................
							remainFocused()
							remainFocused(durationMsINT)
							............................

							EXAMPLE
							...................................................................................
							Uize.Dom.Basics.wire ('myNode','remainFocused(500)',function () {alert ('HELLO')});
							...................................................................................

							NOTES
							- see related `remain-in-state registered virtual DOM events`
				*/

		return _package;
	}
});

