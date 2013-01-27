/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Node.VirtualEvent Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2013 UIZE
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
		The =Uize.Node.VirtualEvent.Edge= module implements virtual DOM events that can be used to detect when the mouse enters / exits nodes at specific edges.

		*DEVELOPERS:* `Chris van Rensburg`

		In a Nutshell
			The virtual DOM events provided in the =Uize.Node.VirtualEvent.Edge= module make it easy to wire up DOM nodes so that different things occur depending on at which edge the user enters a DOM node.

			So, for example, you could perform a different action when the user mouses over a node from the left side than when the user mouses over the same node from the right side.

			How It Works
				Edge virtual DOM events are implemented for a node by comparing the coordinates of the mouse - at the time that a =mouseover= or =mouseout= real DOM event occurs for a node - to the coordinates of the node itself.

				Based upon where the mouse is at the time that the =mouseover= or =mouseout= event is handled, an edge is determined based upon into which of four triangular divisions of the node the coordinates fall. The node is divided into four triangular segments by diagonal lines that run from top left to bottom right and from top right to bottom left. If the mouse coordinates fall into the leftmost triangular segment, then the left edge is chosen. If the coordinates fall into the topmost segment, then the top edge is chosen. If they fall into the rightmost segment, then the right edge is chosen. Finally, if they fall into the bottommost segment, then the bottom edge is chosen. If the edge at which a =mouseover= or =mouseout= event occurs corresponds to an edge for which a mouse-enter-at-edge or mouse-exit-at-edge virtual DOM event is wired, then the handler for that event will be executed.

				Limitations
					In the overwhelming majority of cases, the rather simple mechanism involved in determining the edge of entry or exit works quite reliably and is very accurate.

					However, there are some situations where the edge determination logic can produce what could be considered faulty results. One case is where one is connecting to a machine remotely through a system such as Microsoft's [[http://en.wikipedia.org/wiki/Remote_Desktop_Protocol][Remote Desktop Protocol]], where latencies can be introduced into the delivery of mouse events (that originate remotely) to the machine being controlled. While this is a somewhat rare case, the result is that a =mouseover= or =mouseout= event can be fired long after the mouse has already crossed an edge boundary of a node. Without having tracked mouse movement over time, where the mouse is at the time that the =mouseover= or =mouseout= event is first fired can provide a misleading indication of how the mouse got there. It could appear closest to the top edge, but it may have gotten there by entering from the left.

					Another (more likely) case where edge determination can become confused is when a node for which a mouse-enter-at-edge or mouse-exit-at-edge virtual DOM event is wired is being partially overlapped by another node, and where it is possible to enter or exit the wired node by transitioning between the wired node and the obscuring node. Neither of the two cases mentioned sufficiently detract from the value of the edge virtual DOM events, however.

			SEE A DEMO

			To see a demonstration of the edge virtual DOM events in action, visit the interactive [[../examples/edge-virtual-dom-events.html][Edge Virtual DOM Events]] example.

			Once you are done checking out the example, return to this reference to get the full scoop on all the virtual DOM events defined by this module.

			BACKGROUND READING

			For an in-depth discussion on virtual DOM events, see the reference for the =Uize.Node.VirtualEvent= module.

		Built-in Virtual DOM Events
			The =Uize.Node.VirtualEvent.Edge= module provides two main categories of built-in virtual DOM events: `mouse-enter-at-edge virtual DOM events` and `mouse-exit-at-edge virtual DOM events`.

			Mouse-enter-at-edge Virtual DOM Events
				Mouse-enter-at-edge virtual DOM events are events that are fired when the mouse enters a node at a specific edge (left, right, top, or bottom).

				Mouse-enter-at-edge Virtual DOM Event Static Methods
					The =Uize.Node.VirtualEvent.Edge= module provides the following static methods for making `mouse-enter-at-edge virtual DOM events`...

					- =Uize.Node.VirtualEvent.Edge.mouseEnterLeft=
					- =Uize.Node.VirtualEvent.Edge.mouseEnterRight=
					- =Uize.Node.VirtualEvent.Edge.mouseEnterTop=
					- =Uize.Node.VirtualEvent.Edge.mouseEnterBottom=

				Mouse-enter-at-edge Registered Virtual DOM Event
					The =Uize.Node.VirtualEvent.Edge= module registers the following event names for `mouse-enter-at-edge virtual DOM events`...

					- =mouseEnterLeft=
					- =mouseEnterRight=
					- =mouseEnterTop=
					- =mouseEnterBottom=

			Mouse-exit-at-edge Virtual DOM Events
				Mouse-exit-at-edge virtual DOM events are events that are fired when the mouse exits a node at a specific edge (left, right, top, or bottom).

				Mouse-exit-at-edge Virtual DOM Event Static Methods
					The =Uize.Node.VirtualEvent.Edge= module provides the following static methods for making `mouse-exit-at-edge virtual DOM events`...

					- =Uize.Node.VirtualEvent.Edge.mouseExitLeft=
					- =Uize.Node.VirtualEvent.Edge.mouseExitRight=
					- =Uize.Node.VirtualEvent.Edge.mouseExitTop=
					- =Uize.Node.VirtualEvent.Edge.mouseExitBottom=

				Mouse-exit-at-edge Registered Virtual DOM Event
					The =Uize.Node.VirtualEvent.Edge= module registers the following event names for `mouse-exit-at-edge virtual DOM events`...

					- =mouseExitLeft=
					- =mouseExitRight=
					- =mouseExitTop=
					- =mouseExitBottom=
*/

Uize.module ({
	name:'Uize.Node.VirtualEvent.Edge',
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_package = function () {},
				_true = true,
				_false = false
			;

		/*** General Variables ***/
			var _edgeNames = ['left','right','top','bottom'];

		/*** Utility Functions ***/
			function _makeEdgeEventMaker (_isExit,_edgeNo) {
				var
					_edgeName = _edgeNames [_edgeNo],
					_eventName = 'mouse' + (_isExit ? 'Exit' : 'Enter') + Uize.capFirstChar (_edgeName),
					_triggerEventName = _isExit ? 'mouseout' : 'mouseover'
				;
				Uize.Node.VirtualEvent.register (
					_eventName,
					function () {
						return Uize.Node.VirtualEvent.getCached (
							_eventName + '()',
							function (_node,_handler,_subWiringsOwnerId) {
								Uize.Node.wire (
									_node,
									_triggerEventName,
									function (_event) {
										var
											_eventAbsPos = Uize.Node.getEventAbsPos (_event),
											_nodeCoords = Uize.Node.getCoords (this)
										;
										var
											_xRelative =
												(
													_eventAbsPos.left -
													_nodeCoords.left + parseFloat (Uize.Node.getStyle (this,'borderLeftWidth'))
												)
												/ _nodeCoords.width,
											_yRelative =
												(
													_eventAbsPos.top -
													_nodeCoords.top + parseFloat (Uize.Node.getStyle (this,'borderTopWidth'))
												)
												/ _nodeCoords.height,
											_xHalf = _xRelative >= .5 ? 1 : 0, // avoid Math.round method call, for performance
											_yHalf = _yRelative >= .5 ? 1 : 0, // avoid Math.round method call, for performance
											_entryEdge =
												(_xHalf ? 1 - _xRelative : _xRelative) > // relative deviation from X edge
												(_yHalf ? 1 - _yRelative : _yRelative)   // relative deviation from Y edge
													? _yHalf + 2
													: _xHalf
										;
										_entryEdge == _edgeNo && _handler.call (_node,_event);
									},
									_subWiringsOwnerId
								);
							}
						);
					}
				);
			}

		/*** Public Static Methods ***/
			/*** mouseEnter[edge] Virtual DOM Events ***/
				_makeEdgeEventMaker (0,0);
					/*?
						Static Methods
							Uize.Node.VirtualEvent.Edge.mouseEnterLeft
								Returns a `virtual DOM event` object, for an event that is fired whenever the user mouses over a node at the left edge.

								SYNTAX
								...................................................................
								virtualDomEventOBJ = Uize.Node.VirtualEvent.Edge.mouseEnterLeft ();
								...................................................................

								NOTES
								- this `virtual DOM event maker` is registered with the name =mouseEnterLeft=
								- see related `mouse-enter-at-edge virtual DOM event static methods`

						Registered Virtual DOM Events
							mouseEnterLeft
								The registered name for the `virtual DOM event maker` that is implemented in the =Uize.Node.VirtualEvent.Edge.mouseEnterLeft= static method.

								SYNTAX
								................
								mouseEnterLeft()
								................

								EXAMPLE
								................................................................................
								Uize.Node.wire ('myNode','mouseEnterLeft()',function () {alert ('ENTER LEFT')});
								................................................................................

								NOTES
								- see related `mouse-enter-at-edge registered virtual DOM event`
					*/

				_makeEdgeEventMaker (0,1);
					/*?
						Static Methods
							Uize.Node.VirtualEvent.Edge.mouseEnterRight
								Returns a `virtual DOM event` object, for an event that is fired whenever the user mouses over a node at the right edge.

								SYNTAX
								....................................................................
								virtualDomEventOBJ = Uize.Node.VirtualEvent.Edge.mouseEnterRight ();
								....................................................................

								NOTES
								- this `virtual DOM event maker` is registered with the name =mouseEnterRight=
								- see related `mouse-enter-at-edge virtual DOM event static methods`

						Registered Virtual DOM Events
							mouseEnterRight
								The registered name for the `virtual DOM event maker` that is implemented in the =Uize.Node.VirtualEvent.Edge.mouseEnterRight= static method.

								SYNTAX
								.................
								mouseEnterRight()
								.................

								EXAMPLE
								..................................................................................
								Uize.Node.wire ('myNode','mouseEnterRight()',function () {alert ('ENTER RIGHT')});
								..................................................................................

								NOTES
								- see related `mouse-enter-at-edge registered virtual DOM event`
					*/

				_makeEdgeEventMaker (0,2);
					/*?
						Static Methods
							Uize.Node.VirtualEvent.Edge.mouseEnterTop
								Returns a `virtual DOM event` object, for an event that is fired whenever the user mouses over a node at the top edge.

								SYNTAX
								..................................................................
								virtualDomEventOBJ = Uize.Node.VirtualEvent.Edge.mouseEnterTop ();
								..................................................................

								NOTES
								- this `virtual DOM event maker` is registered with the name =mouseEnterTop=
								- see related `mouse-enter-at-edge virtual DOM event static methods`

						Registered Virtual DOM Events
							mouseEnterTop
								The registered name for the `virtual DOM event maker` that is implemented in the =Uize.Node.VirtualEvent.Edge.mouseEnterTop= static method.

								SYNTAX
								...............
								mouseEnterTop()
								...............

								EXAMPLE
								..............................................................................
								Uize.Node.wire ('myNode','mouseEnterTop()',function () {alert ('ENTER TOP')});
								..............................................................................

								NOTES
								- see related `mouse-enter-at-edge registered virtual DOM event`
					*/

				_makeEdgeEventMaker (0,3);
					/*?
						Static Methods
							Uize.Node.VirtualEvent.Edge.mouseEnterBottom
								Returns a `virtual DOM event` object, for an event that is fired whenever the user mouses over a node at the bottom edge.

								SYNTAX
								.....................................................................
								virtualDomEventOBJ = Uize.Node.VirtualEvent.Edge.mouseEnterBottom ();
								.....................................................................

								NOTES
								- this `virtual DOM event maker` is registered with the name =mouseEnterBottom=
								- see related `mouse-enter-at-edge virtual DOM event static methods`

						Registered Virtual DOM Events
							mouseEnterBottom
								The registered name for the `virtual DOM event maker` that is implemented in the =Uize.Node.VirtualEvent.Edge.mouseEnterBottom= static method.

								SYNTAX
								..................
								mouseEnterBottom()
								..................

								EXAMPLE
								....................................................................................
								Uize.Node.wire ('myNode','mouseEnterBottom()',function () {alert ('ENTER BOTTOM')});
								....................................................................................

								NOTES
								- see related `mouse-enter-at-edge registered virtual DOM event`
					*/

			/*** mouseExit[edge] Virtual DOM Events ***/
				_makeEdgeEventMaker (1,0);
					/*?
						Static Methods
							Uize.Node.VirtualEvent.Edge.mouseExitLeft
								Returns a `virtual DOM event` object, for an event that is fired whenever the user mouses out of a node at the left edge.

								SYNTAX
								..................................................................
								virtualDomEventOBJ = Uize.Node.VirtualEvent.Edge.mouseExitLeft ();
								..................................................................

								NOTES
								- this `virtual DOM event maker` is registered with the name =mouseExitLeft=
								- see related `mouse-exit-at-edge virtual DOM event static methods`

						Registered Virtual DOM Events
							mouseExitLeft
								The registered name for the `virtual DOM event maker` that is implemented in the =Uize.Node.VirtualEvent.Edge.mouseExitLeft= static method.

								SYNTAX
								...............
								mouseExitLeft()
								...............

								EXAMPLE
								..............................................................................
								Uize.Node.wire ('myNode','mouseExitLeft()',function () {alert ('EXIT LEFT')});
								..............................................................................

								NOTES
								- see related `mouse-exit-at-edge registered virtual DOM event`
					*/

				_makeEdgeEventMaker (1,1);
					/*?
						Static Methods
							Uize.Node.VirtualEvent.Edge.mouseExitRight
								Returns a `virtual DOM event` object, for an event that is fired whenever the user mouses out of a node at the right edge.

								SYNTAX
								...................................................................
								virtualDomEventOBJ = Uize.Node.VirtualEvent.Edge.mouseExitRight ();
								...................................................................

								NOTES
								- this `virtual DOM event maker` is registered with the name =mouseExitRight=
								- see related `mouse-exit-at-edge virtual DOM event static methods`

						Registered Virtual DOM Events
							mouseExitRight
								The registered name for the `virtual DOM event maker` that is implemented in the =Uize.Node.VirtualEvent.Edge.mouseExitRight= static method.

								SYNTAX
								................
								mouseExitRight()
								................

								EXAMPLE
								................................................................................
								Uize.Node.wire ('myNode','mouseExitRight()',function () {alert ('EXIT RIGHT')});
								................................................................................

								NOTES
								- see related `mouse-exit-at-edge registered virtual DOM event`
					*/

				_makeEdgeEventMaker (1,2);
					/*?
						Static Methods
							Uize.Node.VirtualEvent.Edge.mouseExitTop
								Returns a `virtual DOM event` object, for an event that is fired whenever the user mouses out of a node at the top edge.

								SYNTAX
								.................................................................
								virtualDomEventOBJ = Uize.Node.VirtualEvent.Edge.mouseExitTop ();
								.................................................................

								NOTES
								- this `virtual DOM event maker` is registered with the name =mouseExitTop=
								- see related `mouse-exit-at-edge virtual DOM event static methods`

						Registered Virtual DOM Events
							mouseExitTop
								The registered name for the `virtual DOM event maker` that is implemented in the =Uize.Node.VirtualEvent.Edge.mouseExitTop= static method.

								SYNTAX
								..............
								mouseExitTop()
								..............

								EXAMPLE
								............................................................................
								Uize.Node.wire ('myNode','mouseExitTop()',function () {alert ('EXIT TOP')});
								............................................................................

								NOTES
								- see related `mouse-exit-at-edge registered virtual DOM event`
					*/

				_makeEdgeEventMaker (1,3);
					/*?
						Static Methods
							Uize.Node.VirtualEvent.Edge.mouseExitBottom
								Returns a `virtual DOM event` object, for an event that is fired whenever the user mouses out of a node at the bottom edge.

								SYNTAX
								....................................................................
								virtualDomEventOBJ = Uize.Node.VirtualEvent.Edge.mouseExitBottom ();
								....................................................................

								NOTES
								- this `virtual DOM event maker` is registered with the name =mouseExitBottom=
								- see related `mouse-exit-at-edge virtual DOM event static methods`

						Registered Virtual DOM Events
							mouseExitBottom
								The registered name for the `virtual DOM event maker` that is implemented in the =Uize.Node.VirtualEvent.Edge.mouseExitBottom= static method.

								SYNTAX
								.................
								mouseExitBottom()
								.................

								EXAMPLE
								..................................................................................
								Uize.Node.wire ('myNode','mouseExitBottom()',function () {alert ('EXIT BOTTOM')});
								..................................................................................

								NOTES
								- see related `mouse-exit-at-edge registered virtual DOM event`
					*/

		return _package;
	}
});

