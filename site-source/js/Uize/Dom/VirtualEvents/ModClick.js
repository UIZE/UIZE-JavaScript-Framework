/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Dom.VirtualEvents.ModClick Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Dom.VirtualEvents.ModClick= package registers a number of different modifier click virtual DOM events, such as the =ctrlClick()=, =shiftClick()=, and =altClick()= events.

		*DEVELOPERS:* `Chris van Rensburg`

	In a Nutshell
		Click-with-modifier virtual DOM events are events that are fired when a node is clicked with a specific combination of modifier keys pressed.

		These events are useful when you need to trigger different actions when a node is clicked with different modifier keys pressed. For example, you may want clicking on a navigation link to navigate in normal increments, ctrl-clicking on the same link to navigate in finer increments, and shift-clicking on the link to navigate in coarser increments. Now, you can certainly achieve this effect without the help of the click-with-modifier virtual DOM events, simply by wiring a handler to the click event of the navigation link and then inspecting the values of the =ctrlKey= and =shiftKey= properties of the DOM event object in your handler code. However, the virtual DOM events provide a more concise and readable way to express this kind of event wiring.

		Consider the following hypothetical example that wires up different behaviors for clicking (no modifier keys pressed), ctrl-clicking (only ctrl modifier key pressed), shift-clicking (only shift modifier key pressed), and alt-clicking (only alt modifier key pressed)...

		INSTEAD OF...
		........................................................................
		Uize.Dom.Basics.wire (
			'myNode',
			'click',
			function (_event) {
				if (!_event.shiftKey && !_event.ctrlKey && !_event.altKey) {
					doClickAction ();
				} else if (_event.ctrlKey && !_event.shiftKey && !_event.altKey) {
					doCtrlClickAction ();
				} else if (_event.shiftKey && !_event.ctrlKey && !_event.altKey) {
					doShiftClickAction ();
				} else if (_event.altKey && !_event.ctrlKey && !_event.shiftKey) {
					doAltClickAction ();
				}
			}
		);
		........................................................................

		USE...
		........................................
		Uize.Dom.Basics.wire (
			'myNode',
			{
				'click()':doClickAction,
				'ctrlClick()':doCtrlClickAction,
				'shiftClick()':doShiftClickAction,
				'altClick()':doAltClickAction
			}
		);
		........................................

		What you'll notice from the example is that the code using the click-with-modifier virtual DOM events is considerably smaller - and, certainly, also easier to read. The =click= `virtual DOM event` is only fired when the node is clicked with no modifier keys pressed. Likewise, the =ctrlClick= `virtual DOM event` is only fired when only the ctrl modifier key is pressed. The same principle applies to the =shiftClick= and =altClick= virtual DOM events. When using the normal click event, one has to do all the testing for modifier keys oneself, whereas the click-with-modifier virtual DOM events take care of all of this for you.

		IMPORTANT
		Important to note here is that the =click= `virtual DOM event` *must* be specified as ='click()'= - if you were to omit the parentheses then you would be wiring a handler for the standard click DOM event.

		Click-with-modifier Virtual DOM Event Static Methods
			The =Uize.Dom.VirtualEvents.ModClick= module provides the following static methods for making `click-with-modifier virtual DOM events`...

			- =Uize.Dom.VirtualEvents.ModClick.altClick=
			- =Uize.Dom.VirtualEvents.ModClick.click=
			- =Uize.Dom.VirtualEvents.ModClick.ctrlAltClick=
			- =Uize.Dom.VirtualEvents.ModClick.ctrlClick=
			- =Uize.Dom.VirtualEvents.ModClick.shiftAltClick=
			- =Uize.Dom.VirtualEvents.ModClick.shiftClick=
			- =Uize.Dom.VirtualEvents.ModClick.shiftCtrlAltClick=
			- =Uize.Dom.VirtualEvents.ModClick.shiftCtrlClick=

		Click-with-modifier Registered Virtual DOM Events
			The =Uize.Dom.VirtualEvents.ModClick= module registers the following event names for `click-with-modifier virtual DOM events`...

			- =altClick=
			- =click=
			- =ctrlAltClick=
			- =ctrlClick=
			- =shiftAltClick=
			- =shiftClick=
			- =shiftCtrlAltClick=
			- =shiftCtrlClick=
*/

Uize.module ({
	name:'Uize.Dom.VirtualEvents.ModClick',
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

		/*** Utility Functions ***/
			function _makeModifierKeyClickEventMaker (_shift,_ctrl,_alt) {
				var _eventName = (_shift ? 'Shift' : '') + (_ctrl ? 'Ctrl' : '') + (_alt ? 'Alt' : '') + 'Click';
				_package [_eventName = _eventName.charAt (0).toLowerCase () + _eventName.slice (1)] =
					_Uize_Dom_VirtualEvent.register (
						_eventName,
						function () {
							return _Uize_Dom_VirtualEvent.getCached (
								_eventName + '()',
								function (_node,_handler,_subWiringsOwnerId) {
									_Uize_Dom_Basics.wire (
										_node,
										'click',
										function (_event) {
											_event.shiftKey == _shift &&
											_event.ctrlKey == _ctrl &&
											_event.altKey == _alt &&
											!_event.metaKey &&
												_handler.call (_node,_event)
											;
										},
										_subWiringsOwnerId
									);
								}
							);
						}
					)
				;
			}

		/*** Click-with-modifier Events ***/
			_makeModifierKeyClickEventMaker (_false,_false,_false);
				/*?
					Static Methods
						Uize.Dom.VirtualEvents.ModClick.click
							Returns a `virtual DOM event` object, for an event that is fired whenever the user clicks on a node with no modifier keys pressed.

							SYNTAX
							..............................................................
							virtualDomEventOBJ = Uize.Dom.VirtualEvents.ModClick.click ();
							..............................................................

							NOTES
							- this `virtual DOM event maker` is registered with the name =click=
							- see related `click-with-modifier virtual DOM event static methods`

					Registered Virtual DOM Events
						click
							The registered name for the `virtual DOM event maker` that is implemented in the =Uize.Dom.VirtualEvents.ModClick.click= static method.

							SYNTAX
							.......
							click()
							.......

							EXAMPLE
							........................................................................
							Uize.Dom.Basics.wire ('myNode','click()',function () {alert ('HELLO')});
							........................................................................

							NOTES
							- see related `click-with-modifier registered virtual DOM events`
				*/

			_makeModifierKeyClickEventMaker (_true,_false,_false);
				/*?
					Static Methods
						Uize.Dom.VirtualEvents.ModClick.shiftClick
							Returns a `virtual DOM event` object, for an event that is fired whenever the user clicks on a node with only the shift modifier key pressed.

							SYNTAX
							...................................................................
							virtualDomEventOBJ = Uize.Dom.VirtualEvents.ModClick.shiftClick ();
							...................................................................

							NOTES
							- this `virtual DOM event maker` is registered with the name =shiftClick=
							- see related `click-with-modifier virtual DOM event static methods`

					Registered Virtual DOM Events
						shiftClick
							The registered name for the `virtual DOM event maker` that is implemented in the =Uize.Dom.VirtualEvents.ModClick.shiftClick= static method.

							SYNTAX
							............
							shiftClick()
							............

							EXAMPLE
							.............................................................................
							Uize.Dom.Basics.wire ('myNode','shiftClick()',function () {alert ('HELLO')});
							.............................................................................

							NOTES
							- see related `click-with-modifier registered virtual DOM events`
				*/

			_makeModifierKeyClickEventMaker (_false,_true,_false);
				/*?
					Static Methods
						Uize.Dom.VirtualEvents.ModClick.ctrlClick
							Returns a `virtual DOM event` object, for an event that is fired whenever the user clicks on a node with only the ctrl modifier key pressed.

							SYNTAX
							..................................................................
							virtualDomEventOBJ = Uize.Dom.VirtualEvents.ModClick.ctrlClick ();
							..................................................................

							NOTES
							- this `virtual DOM event maker` is registered with the name =ctrlClick=
							- see related `click-with-modifier virtual DOM event static methods`

					Registered Virtual DOM Events
						ctrlClick
							The registered name for the `virtual DOM event maker` that is implemented in the =Uize.Dom.VirtualEvents.ModClick.ctrlClick= static method.

							SYNTAX
							...........
							ctrlClick()
							...........

							EXAMPLE
							............................................................................
							Uize.Dom.Basics.wire ('myNode','ctrlClick()',function () {alert ('HELLO')});
							............................................................................

							NOTES
							- see related `click-with-modifier registered virtual DOM events`
				*/

			_makeModifierKeyClickEventMaker (_false,_false,_true);
				/*?
					Static Methods
						Uize.Dom.VirtualEvents.ModClick.altClick
							Returns a `virtual DOM event` object, for an event that is fired whenever the user clicks on a node with only the alt modifier key pressed.

							SYNTAX
							.................................................................
							virtualDomEventOBJ = Uize.Dom.VirtualEvents.ModClick.altClick ();
							.................................................................

							NOTES
							- this `virtual DOM event maker` is registered with the name =altClick=
							- see related `click-with-modifier virtual DOM event static methods`

					Registered Virtual DOM Events
						altClick
							The registered name for the `virtual DOM event maker` that is implemented in the =Uize.Dom.VirtualEvents.ModClick.altClick= static method.

							SYNTAX
							..........
							altClick()
							..........

							EXAMPLE
							...........................................................................
							Uize.Dom.Basics.wire ('myNode','altClick()',function () {alert ('HELLO')});
							...........................................................................

							NOTES
							- see related `click-with-modifier registered virtual DOM events`
				*/

			_makeModifierKeyClickEventMaker (_false,_true,_true);
				/*?
					Static Methods
						Uize.Dom.VirtualEvents.ModClick.ctrlAltClick
							Returns a `virtual DOM event` object, for an event that is fired whenever the user clicks on a node with only the ctrl and alt modifier keys pressed.

							SYNTAX
							.....................................................................
							virtualDomEventOBJ = Uize.Dom.VirtualEvents.ModClick.ctrlAltClick ();
							.....................................................................

							NOTES
							- this `virtual DOM event maker` is registered with the name =ctrlAltClick=
							- see related `click-with-modifier virtual DOM event static methods`

					Registered Virtual DOM Events
						ctrlAltClick
							The registered name for the `virtual DOM event maker` that is implemented in the =Uize.Dom.VirtualEvents.ModClick.ctrlAltClick= static method.

							SYNTAX
							..............
							ctrlAltClick()
							..............

							EXAMPLE
							...............................................................................
							Uize.Dom.Basics.wire ('myNode','ctrlAltClick()',function () {alert ('HELLO')});
							...............................................................................

							NOTES
							- see related `click-with-modifier registered virtual DOM events`
				*/

			_makeModifierKeyClickEventMaker (_true,_true,_false);
				/*?
					Static Methods
						Uize.Dom.VirtualEvents.ModClick.shiftCtrlClick
							Returns a `virtual DOM event` object, for an event that is fired whenever the user clicks on a node with only the shift and ctrl modifier keys pressed.

							SYNTAX
							.......................................................................
							virtualDomEventOBJ = Uize.Dom.VirtualEvents.ModClick.shiftCtrlClick ();
							.......................................................................

							NOTES
							- this `virtual DOM event maker` is registered with the name =shiftCtrlClick=
							- see related `click-with-modifier virtual DOM event static methods`

					Registered Virtual DOM Events
						shiftCtrlClick
							The registered name for the `virtual DOM event maker` that is implemented in the =Uize.Dom.VirtualEvents.ModClick.shiftCtrlClick= static method.

							SYNTAX
							...................
							shiftCtrlClick()
							...................

							EXAMPLE
							.................................................................................
							Uize.Dom.Basics.wire ('myNode','shiftCtrlClick()',function () {alert ('HELLO')});
							.................................................................................

							NOTES
							- see related `click-with-modifier registered virtual DOM events`
				*/

			_makeModifierKeyClickEventMaker (_true,_false,_true);
				/*?
					Static Methods
						Uize.Dom.VirtualEvents.ModClick.shiftAltClick
							Returns a `virtual DOM event` object, for an event that is fired whenever the user clicks on a node with only the shift and alt modifier keys pressed.

							SYNTAX
							......................................................................
							virtualDomEventOBJ = Uize.Dom.VirtualEvents.ModClick.shiftAltClick ();
							......................................................................

							NOTES
							- this `virtual DOM event maker` is registered with the name =shiftAltClick=
							- see related `click-with-modifier virtual DOM event static methods`

					Registered Virtual DOM Events
						shiftAltClick
							The registered name for the `virtual DOM event maker` that is implemented in the =Uize.Dom.VirtualEvents.ModClick.shiftAltClick= static method.

							SYNTAX
							...............
							shiftAltClick()
							...............

							EXAMPLE
							................................................................................
							Uize.Dom.Basics.wire ('myNode','shiftAltClick()',function () {alert ('HELLO')});
							................................................................................

							NOTES
							- see related `click-with-modifier registered virtual DOM events`
				*/

			_makeModifierKeyClickEventMaker (_true,_true,_true);
				/*?
					Static Methods
						Uize.Dom.VirtualEvents.ModClick.shiftCtrlAltClick
							Returns a `virtual DOM event` object, for an event that is fired whenever the user clicks on a node with only the shift, ctrl, and alt modifier keys pressed.

							SYNTAX
							..........................................................................
							virtualDomEventOBJ = Uize.Dom.VirtualEvents.ModClick.shiftCtrlAltClick ();
							..........................................................................

							NOTES
							- this `virtual DOM event maker` is registered with the name =shiftCtrlAltClick=
							- see related `click-with-modifier virtual DOM event static methods`

					Registered Virtual DOM Events
						shiftCtrlAltClick
							The registered name for the `virtual DOM event maker` that is implemented in the =Uize.Dom.VirtualEvents.ModClick.shiftCtrlAltClick= static method.

							SYNTAX
							...................
							shiftCtrlAltClick()
							...................

							EXAMPLE
							....................................................................................
							Uize.Dom.Basics.wire ('myNode','shiftCtrlAltClick()',function () {alert ('HELLO')});
							....................................................................................

							NOTES
							- see related `click-with-modifier registered virtual DOM events`
				*/

		return _package;
	}
});

