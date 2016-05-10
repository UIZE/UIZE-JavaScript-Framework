/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.ImagePort.Draggable Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 3
	codeCompleteness: 90
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.ImagePort.Draggable= class extends its superclass by letting the user change logical sizing and positioning by clicking and dragging.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.ImagePort.Draggable',
	required:'Uize.Widget.Drag',
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_true = true,
				_false = false
		;

		return _superclass.subclass ({
			omegastructor:function () {
				var m = this;

				/*** add drag child widget ***/
					var
						_drag = m.addChild ('drag',Uize.Widget.Drag,{idPrefixConstruction:'same as parent'}),
						_dragStartAlign = [],
						_dragStartSizingValue, _dragMode
					;
					_drag.wire ({
						'Drag Start':
							function (_event) {
								_dragMode = _event.domEvent.ctrlKey ? 'sizing' : 'alignment';
								m.set ({_inDrag:_true});
								_dragStartSizingValue = m.get ('sizingValue');
								_dragStartAlign [0] = m.get ('alignX');
								_dragStartAlign [1] = m.get ('alignY');
							},
						'Drag Update':
							function (_event) {
								if (_dragMode == 'sizing') {
									m.set ({
										sizingValue:Uize.constrain (
											_dragStartSizingValue + (0 - _drag.eventDeltaPos [1]) / 100,
											m._minSizingValue,
											m._maxSizingValue
										)
									});
								} else {
									var _calculateNewAlignValue = function (_axis) {
										return (
											Uize.constrain (
												_dragStartAlign [_axis] + _drag.eventDeltaPos [_axis] *
													(
														m.portVsScaledDelta [_axis]
															? (1 / m.portVsScaledDelta [_axis])
															: 0
													),
												0,
												1
											)
										);
									};
									m.set ({
										alignX:_calculateNewAlignValue (0),
										alignY:_calculateNewAlignValue (1)
									});
								}
							},
						'Drag Done':
							function () {m.set ({_inDrag:_false})}
					});

				/*** manage cursor state ***/
					function _updateUiCursor () {
						var
							_alignApplicableX = m.get ('alignApplicableX'),
							_alignApplicableY = m.get ('alignApplicableY')
						;
						m.children.drag.set ({
							cursor:
								m._inZoomMode
									? 'n-resize'
									: _alignApplicableX && _alignApplicableY
										? 'move'
										: _alignApplicableX
											? 'w-resize'
											: _alignApplicableY
												? 'n-resize'
												: 'not-allowed'
						});
					}
					m.wire ({
						'Changed.alignApplicableX':_updateUiCursor,
						'Changed.alignApplicableY':_updateUiCursor,
						'Changed.inZoomMode':_updateUiCursor
					});
			},

			instanceMethods:{
				wireUi:function () {
					var m = this;
					if (!m.isWired) {
						/*** maintain inZoomMode state ***/
							/* NOTE:
								- Unfortunately, must watch for ctrl pressed at document level (can't do it at the root node level).
								- There are issues with some browsers and how they reflect (or don't reflect) changes in the cursor style property of an element that the mouse is already over.
									- Safari seems to only reflect a cursor change on the next mousemove.
									- Opera seems to only reflect a cursor change on a more radical repaint / re-render (not sure exactly what it's logic is).
									- None of the browsers can pick up the key events if the document isn't focused (e.g. the location field is focused instead).
							*/
							m.wireNode (
								document,
								{
									keydown:function (_event) {_event.ctrlKey && m.set ({_inZoomMode:_true})},
									keyup:function () {m.set ({_inZoomMode:_false})}
								}
							);

							_superclass.doMy (m,'wireUi');
					}
				}
			},

			stateProperties:{
				_inDrag:{
					name:'inDrag',
					value:_false
				},
				_inZoomMode:{
					name:'inZoomMode',
					value:_false
				},
				_maxSizingValue:{
					name:'maxSizingValue',
					value:Infinity
				},
				_minSizingValue:{
					name:'minSizingValue',
					value:0
				}
			}
		});
	}
});

