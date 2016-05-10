/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Drag.Move.Drop Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 2
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.Drag.Move.Drop= class implements support for adding/removing/wiring widgets as drop targets.

		*DEVELOPERS:* `Tim Carter`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.Drag.Move.Drop',
	required:'Uize.Dom.Pos',
	builder:function  (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize_Dom_Pos = Uize.Dom.Pos,

			/*** General Variables ***/
				_dropTargets = [] // widgets onto which draggable widgets can be dropped
		;

		return _superclass.subclass ({
			staticProperties:{
				dropTargets:_dropTargets
			},

			staticMethods:{
				addDropTarget:function (_widget, _node) {
					_dropTargets.push ({_widget:_widget, _node:_node});

					/**
						Registers the passed-in widget as a potential drop target for any Uize.Widget.Drag.Move.Drop instance. When a drag instance is dragged, the position of the drag instance is checked against the positions of the drop targets and certain events are fired:

						'Drag Enter': fired when the drag instance and drop target's physical positions first intersect.
						'Drag Over': fired when the drag instance is over the drop target.
						'Drag Leave': fired when the drag instance and the drop target's physical positions no longer intersect.
						'Drop': fired when a Drag action terminates while the drag instance and drop target's physical positions intersect.
						'Drag Cancel': fired when a Drag is cancelled.

						Each of these events contains a =dragObject= parameter which points to the drag instance. It is up to each individual drop target to determine whether or not it should respond to the event or dragObject.

						If the _node parameter is specified, that will be the node used to calculate to drop target's current coordinates.
					*/
				},
				removeDropTarget:function (_widget) {
					for (var _dropTargetIndex = _dropTargets.length; --_dropTargetIndex >= 0;) {
						if (_dropTargets [_dropTargetIndex]._widget == _widget) {
							_dropTargets.splice (_dropTargetIndex, 1);
							return;
						}
					}

					/**
						Removes the passed-in widget from the list of potential drop targets for any Uize.Widget.Drag.Move.Drop instance.
					*/
				}
			},

			omegastructor:function() {
				var
					m = this,

					_dropTargetsEntered = m._dropTargetsEntered = {},
					_dropTargetIndex = 0,
					_restTimeout,
					_updateTimeout,
					_processDropTargets = function () {
						/**
						 * foreach drop target:
						 *	if the drop target and drag instance intersect:
						 *		if they've intersected before: fire 'Drag Over'
						 *		else: fire 'Drag Enter'
						 *	elseif they've intersected before:
						 *		fire: 'Drag Leave'
						 *	else: do nothing
						 */
						var
							_dropTargetsLength = _dropTargets.length,
							_coords = _Uize_Dom_Pos.getCoords (m.getNode())
						;
						for (_dropTargetIndex = _dropTargetsLength; --_dropTargetIndex >= 0;) {
							var
								_currDropTarget = _dropTargets [_dropTargetIndex],
								_currDropTargetWidget = _currDropTarget._widget,
								_instanceId = _currDropTargetWidget.instanceId,
								_currDropTargetNodeCoords = _Uize_Dom_Pos.getCoords((_currDropTarget._node || (_currDropTarget._node = _currDropTargetWidget.getNode ()))), // these always have to be re-calculated (and not pre-calculated) because the drop target could also be moving
								_hadEntered = _dropTargetsEntered [_instanceId]
							;

							if (_Uize_Dom_Pos.doRectanglesOverlap (_coords.left, _coords.top, _coords.width, _coords.height, _currDropTargetNodeCoords.left, _currDropTargetNodeCoords.top, _currDropTargetNodeCoords.width, _currDropTargetNodeCoords.height)) {
								_currDropTargetWidget.fire ({
									name:_hadEntered ? 'Drag Over' : 'Drag Enter',
									dragObject:m
								});

								!_hadEntered && (_dropTargetsEntered [_instanceId] = true);

							} else if (_hadEntered) {
								_currDropTargetWidget.fire ({
									name:'Drag Leave',
									dragObject:m
								});

								_dropTargetsEntered [_instanceId] = false;
							}
						}
					}
				;

				m.wire ({
					'Drag Cancel':function (_event) {
						for (_dropTargetIndex = _dropTargets.length; --_dropTargetIndex >= 0;)
							_dropTargets[_dropTargetIndex].fire ({
								name:'Drag Cancel',
								dragObject:m,
								domEvent:_event.domEvent
							})
						;
					},
					'Drag Rest':function () {
						// even if the drag instance is at rest, the drop targets might be moving.
						// so it's necessary to process them even on Drag Rest.
						// NOTE: if the item is no longer being dragged, but the drop targets are still moving,
						//	no interaction will occur. This could be rationalized as intended, or considered
						//	a bug that requires significant refactoring of the Uize drag-drop model.
						function _checkOnRest () {
							_processDropTargets ();
							_restTimeout = setTimeout (
								_checkOnRest,
								200
							);
						}

						_restTimeout = setTimeout (
							_checkOnRest,
							200
						);
					},
					'Drag Update':function () {
						_restTimeout && clearTimeout (_restTimeout);
						_updateTimeout && clearTimeout (_updateTimeout);
						_updateTimeout = setTimeout (
							_processDropTargets,
							0
						);
					},
					'Drag Done':function (_event) {
						_restTimeout && clearTimeout(_restTimeout);
						_updateTimeout && clearTimeout (_updateTimeout);
						var
							_dropTargetsLength = _dropTargets.length,
							_coords = _Uize_Dom_Pos.getCoords (m.getNode()),
							_droppedOn = []
						;

						for (_dropTargetIndex = _dropTargetsLength; --_dropTargetIndex >= 0;) {
							var
								_currDropTarget = _dropTargets [_dropTargetIndex],
								_currDropTargetWidget = _currDropTarget._widget,
								_instanceId = _currDropTargetWidget.instanceId,
								_currDropTargetNodeCoords = _Uize_Dom_Pos.getCoords((_currDropTarget._node || (_currDropTarget._node = _currDropTargetWidget.getNode ())))
							;

							if (_Uize_Dom_Pos.doRectanglesOverlap (_coords.left, _coords.top, _coords.width, _coords.height, _currDropTargetNodeCoords.left, _currDropTargetNodeCoords.top, _currDropTargetNodeCoords.width, _currDropTargetNodeCoords.height)) {
								_currDropTargetWidget.fire ({
									name:'Drop',
									dragObject:m,
									domEvent:_event.domEvent
								});

								_droppedOn.push (_currDropTargetWidget);
							}
							else if (_dropTargetsEntered [_instanceId])
								_currDropTargetWidget.fire ({
									name:'Drag Leave',
									dragObject:m,
									domEvent:_event.domEvent
								})
							;
						}

						// it might be preferable to fire the 'Dropped' event for each dropTarget,
						// but that's probably not necessary right now.
						_droppedOn.length &&
							m.fire ({
								name:'Dropped',
								dropTargets:_droppedOn,
								domEvent:_event.domEvent
							})
						;

						m._dropTargetsEntered = _dropTargetsEntered = {};
					}
				});
			}
		});
	}
});
