/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Event.Bus Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2003-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 10
	codeCompleteness: 100
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Event.Bus= module defines a simple event bus class that can be instantiated for managing wiring and unwiring of event handlers and firing of events.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Event.Bus',
	superclass:'Uize.Oop.BasicClass',
	builder:function (_superclass) {
		'use strict';

		var
			/*** references to utility methods of Uize ***/
				_isFunction = Uize.isFunction,
				_isObject = Uize.isObject,

			/*** General Variables ***/
				_sacredEmptyObject = {}
		;

		return _superclass.subclass ({
			instanceMethods:{
				fire:function (_event) {
					/*	NOTES
						- this code is deliberately optimized for performance and not code size, since event firing is a mechanism that is heavily utilized. This will explain some patterns here that may seem slightly out of character, with seemingly redundant code or a lack of typical factoring out.
					*/
					var
						m = this,
						_eventHandlers = m._eventHandlers
					;
					if (_eventHandlers) {
						if (typeof _event != 'object') _event = {name:_event};
						var
							_handlersForThisEvent = _eventHandlers [_event.name],
							_handlersForAnyEvent = _eventHandlers ['*']
						;
						if (_handlersForThisEvent || _handlersForAnyEvent) {
							var
								_handlers = _handlersForAnyEvent && _handlersForThisEvent
									? _handlersForAnyEvent.concat (_handlersForThisEvent)
									: _handlersForAnyEvent || _handlersForThisEvent
								,
								_totalHandlers = _handlers.length
							;
							if (_totalHandlers == 1) {
								_handlers [0]._handler (_event);
							} else if (_totalHandlers == 2) {
								/* NOTE:
									Since we make a copy of the handlers array in the case of multiple handlers (in order to avoid issues where the handlers array may be modified by the handlers themselves), this optimization for two handlers catches most cases of multiple handlers in a complex application. This avoids copying an array and also the overhead of an iterator.
								*/
								var
									_handler0 = _handlers [0]._handler,
									_handler1 = _handlers [1]._handler
								;
								_handler0 (_event);
								_handler1 (_event);
							} else {
								if (!_handlersForAnyEvent || !_handlersForThisEvent)
									_handlers = _handlers.concat ()
								;
								/* NOTE:
									When executing multiple handlers, it is necessary to make a copy of the handlers array, since it is possible that one of the handlers might execute code that affects the handlers array (e.g. by using the removeHandler method).

									What this means is that when an event is fired, all the handlers registered for that event at the time that it fires will be executed. Event handlers for that event that are removed by one of its handlers will still be executed, and event handlers for that event that are added by one of its handlers will not be executed.
								*/
								for (var _handlerNo = -1; ++_handlerNo < _totalHandlers;)
									_handlers [_handlerNo]._handler (_event)
								;
							}
						}
					}
				},

				wire:function (_eventNameOrEventsMap,_handler) {
					var
						m = this,
						_eventHandlers = m._eventHandlers || (m._eventHandlers = {})
					;
					if (_isObject (_eventNameOrEventsMap)) {
						for (var _eventName in _eventNameOrEventsMap)
							m.wire (_eventName,_eventNameOrEventsMap [_eventName])
						;
					} else {
						m.wireUnwireWrapper (
							_eventNameOrEventsMap,
							function (_eventName) {
								(_eventHandlers [_eventName] || (_eventHandlers [_eventName] = [])).push (
									{
										_eventName:_eventName,
										_handler:
											_isFunction (_handler)
												? _handler
												: typeof _handler == 'string'
													? Function (_handler)
													: function (_event) {_handler.fire (_event)},
										_originalHandler:_handler
									}
								);
							}
						);
					}
				},

				unwire:function (_eventNameOrEventsMap,_handler) {
					var
						m = this,
						_eventHandlers = m._eventHandlers
					;
					function _unwire (_eventName,_handler) {
						m.wireUnwireWrapper (
							_eventName,
							function (_eventName) {
								var _handlersForEventName = _eventHandlers [_eventName];
								if (_handlersForEventName) {
									if (_handler) {
										for (var _handlerNo = _handlersForEventName.length; --_handlerNo >= 0;)
											_handlersForEventName [_handlerNo]._originalHandler == _handler &&
												_handlersForEventName.splice (_handlerNo,1)
										;
									}
									(_handler && _handlersForEventName.length) || delete _eventHandlers [_eventName];
								}
							}
						);
					}
					if (_eventHandlers) {
						if (!arguments.length) {
							for (var _eventName in _eventHandlers)
								_unwire (_eventName)
							;
						} else if (_isObject (_eventNameOrEventsMap)) {
							for (var _eventName in _eventNameOrEventsMap)
								_unwire (_eventName,_eventNameOrEventsMap [_eventName])
							;
						} else {
							_unwire (_eventNameOrEventsMap,_handler);
						}
					}
				},

				hasHandlers:function (_eventName) {
					return !!(this._eventHandlers || _sacredEmptyObject) [_eventName];
				},

				wireUnwireWrapper:function (_eventName,_wireUnwire) {_wireUnwire (_eventName)}
			}
		});
	}
});

