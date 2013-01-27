/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.ImagePort.Draggable Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2013 UIZE
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

		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function () {
						var _this = this;

						/*** add drag child widget ***/
							var
								_drag = _this.addChild ('drag',Uize.Widget.Drag,{idPrefixConstruction:'same as parent'}),
								_dragStartAlign = [],
								_dragStartSizingValue, _dragMode
							;
							_drag.wire ({
								'Drag Start':
									function (_event) {
										_dragMode = _event.domEvent.ctrlKey ? 'sizing' : 'alignment';
										_this.set ({_inDrag:_true});
										_dragStartSizingValue = _this.get ('sizingValue');
										_dragStartAlign [0] = _this.get ('alignX');
										_dragStartAlign [1] = _this.get ('alignY');
									},
								'Drag Update':
									function (_event) {
										if (_dragMode == 'sizing') {
											_this.set ({
												sizingValue:Uize.constrain (
													_dragStartSizingValue + (0 - _drag.eventDeltaPos [1]) / 100,
													_this._minSizingValue,
													_this._maxSizingValue
												)
											});
										} else {
											var _calculateNewAlignValue = function (_axis) {
												return (
													Uize.constrain (
														_dragStartAlign [_axis] + _drag.eventDeltaPos [_axis] *
															(
																_this.portVsScaledDelta [_axis]
																	? (1 / _this.portVsScaledDelta [_axis])
																	: 0
															),
														0,
														1
													)
												);
											};
											_this.set ({
												alignX:_calculateNewAlignValue (0),
												alignY:_calculateNewAlignValue (1)
											});
										}
									},
								'Drag Done':
									function () {_this.set ({_inDrag:_false})}
							});

						/*** manage cursor state ***/
							function _updateUiCursor () {
								var
									_alignApplicableX = _this.get ('alignApplicableX'),
									_alignApplicableY = _this.get ('alignApplicableY')
								;
								_this.children.drag.set ({
									cursor:
										_this._inZoomMode
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
							_this.wire ({
								'Changed.alignApplicableX':_updateUiCursor,
								'Changed.alignApplicableY':_updateUiCursor,
								'Changed.inZoomMode':_updateUiCursor
							});
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Public Instance Methods ***/
			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					/*** maintain inZoomMode state ***/
						/* NOTE:
							- Unfortunately, must watch for ctrl pressed at document level (can't do it at the root node level).
							- There are issues with some browsers and how they reflect (or don't reflect) changes in the cursor style property of an element that the mouse is already over.
								- Safari seems to only reflect a cursor change on the next mousemove.
								- Opera seems to only reflect a cursor change on a more radical repaint / re-render (not sure exactly what it's logic is).
								- None of the browsers can pick up the key events if the document isn't focused (eg. the location field is focused instead).
						*/
						_this.wireNode (
							document,
							{
								keydown:function (_event) {_event.ctrlKey && _this.set ({_inZoomMode:_true})},
								keyup:function () {_this.set ({_inZoomMode:_false})}
							}
						);

						_superclass.prototype.wireUi.call (_this);
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
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
			});

		return _class;
	}
});

