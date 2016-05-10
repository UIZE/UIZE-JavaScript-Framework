/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Resizer.Marquee Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.Resizer.Marquee= class implements a resizer / selection marquee, with support for drag handles on corners and sides and drag-to-move.

		*DEVELOPERS:* `Chris van Rensburg`, `Tim Carter`
*/

Uize.module ({
	name:'Uize.Widget.Resizer.Marquee',
	required:[
		'Uize.Dom.Basics',
		'Uize.Dom.Pos'
	],
	builder:function  (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_true = true,
				_false = false,
				_Uize_Dom_Basics = Uize.Dom.Basics,
				_Uize_Dom_Pos = Uize.Dom.Pos,

			/*** General Variables ***/
				_centerAlign = [.5,.5],
				_sacredEmptyObject = {}
		;

		/*** Private Instance Methods ***/
			function _updateUiHandlesDisplayed (m) {
				if (m.isWired) {
					var
						_inDrag = m.get ('inDrag'),
						_creatingNew = m.get ('creatingNew'),
						_fixedX = m.get ('fixedX'),
						_fixedY = m.get ('fixedY'),
						_activeHandleEffectivePointIdX = m.get ('activeHandleEffectivePointIdX'),
						_activeHandleEffectivePointIdY = m.get ('activeHandleEffectivePointIdY'),
						_pointIdsMap = m.Class.pointIdsMap
					;
					for (var _handleName in _pointIdsMap) {
						if (_handleName != 'move') {
							var _pointIds = _pointIdsMap [_handleName];
							m.displayNode (
								_handleName,
								(
									!_creatingNew &&
									(!_fixedX || _pointIds [0] == .5) &&
									(!_fixedY || _pointIds [1] == .5) &&
									(
										!m._hideOtherHandlesInDrag || !_inDrag ||
										(
											_pointIds [0] == _activeHandleEffectivePointIdX &&
											_pointIds [1] == _activeHandleEffectivePointIdY
										)
									)
								)
							);
						}
					}
				}
			}

			function _updateUiHandlesPositions (m) {
				/* NOTE:
					one might be tempted to optimize this code so that the positioning of the handles is not updated while they are not visible, so I tried this, but it actually turned out to incur greater re-rendering cost in IE -- go figure!
				*/
				if (m.isWired) {
					var
						_left = m.get ('left'),
						_top = m.get ('top'),
						_widthMinus1 = m.get ('width') - 1,
						_heightMinus1 = m.get ('height') - 1,
						_pointIdsMap = m.Class.pointIdsMap,
						_handlesAlign = m._handlesAlign || _sacredEmptyObject
					;
					for (var _handleName in _pointIdsMap) {
						if (_handleName != 'move') {
							var
								_pointIds = _pointIdsMap [_handleName],
								_handleNode = m.getNode (_handleName),
								_handleDims = _Uize_Dom_Pos.getDimensions (_handleNode),
								_handleAlign = _handlesAlign [_handleName] || _centerAlign
							;
							_Uize_Dom_Basics.setStyle (
								_handleNode,
								{
									left:_left + _pointIds [0] * _widthMinus1 - (_handleDims.width - 1) * _handleAlign [0],
									top:_top + _pointIds [1] * _heightMinus1 - (_handleDims.height - 1) * _handleAlign [1]
								}
							);
						}
					}
				}
			}

			function _updateUiRotate (m) {
				var _canRotate = !!m._canRotate;

				if (m.isWired && _canRotate) {
					var _rotateNode = m.getNode ('rotate');
					m.displayNode (_rotateNode, _canRotate);
					m.children.rotate.set ({node:_rotateNode});
				}
			}

		return _superclass.subclass ({
			alphastructor:function () {
				var m = this;

				/*** watch for state changes that would require updating displayed handles ***/
					function _updateUiHandlesDisplayedAndPositions () {
						_updateUiHandlesDisplayed (m);
						_updateUiHandlesPositions (m);
					}
					m.wire ({
						'Changed.inDrag':_updateUiHandlesDisplayedAndPositions,
						'Changed.creatingNew':_updateUiHandlesDisplayedAndPositions,
						'Changed.fixedX':_updateUiHandlesDisplayedAndPositions,
						'Changed.fixedY':_updateUiHandlesDisplayedAndPositions,
						'Changed.activeHandleEffectivePointIdX':_updateUiHandlesDisplayedAndPositions,
						'Changed.activeHandleEffectivePointIdY':_updateUiHandlesDisplayedAndPositions
					});
			},

			instanceMethods:{
				updateUi:function () {
					var m = this;
					if (m.isWired) {
						/* NOTE:
							For some inexplicable reason, calling updateUi on the superclass here improves the responsiveness of the marquee. This maintains the order of updating that existed prior to factoring out the common Uize.Widget.Resizer code from the old and defunct Uize.Widget.Marquee class. Something about updating the handles before updating the box (performed in the superclass) does not produce a favorable effect.
						*/
						_superclass.doMy (m,'updateUi');

						_updateUiHandlesPositions (m);
						_updateUiRotate (m);
					}
				},

				wireUi:function () {
					var m = this;
					if (!m.isWired) {
						/*** wire up the marquee shell ***/
							if (m._shellLive) {
								var
									_shell = m.getNode ('shell'),
									_initiateDrag = function (_event) {
										if (m.get ('enabledInherited')) {
											_event || (_event = event);
											var
												_handleName = m.get ('aspectRatio') == null ? 'northWest' : 'southEast',
													/* NOTE:
														because we have the don't-swap-sides hack for when an aspect ratio is set, we can only create marquee by dragging from top left to bottom right, and so we start drag with the bottom right handle
													*/
												_shellCoords = _Uize_Dom_Pos.getCoords (_shell),
												_eventAbsPos = _Uize_Dom_Pos.getEventAbsPos (_event)
											;
											m.set ({creatingNew:_true});
											m.setPositionDuringDrag (
												_eventAbsPos.left - _shellCoords.left,
												_eventAbsPos.top - _shellCoords.top,
												m.get ('minWidth'),
												m.get ('minHeight')
											);
											return m.children [_handleName].initiate (_event);
										}
									}
								;
								_Uize_Dom_Basics.setStyle (_shell,{cursor:'crosshair'});
								m.wireNode (_shell,{mousedown:_initiateDrag,touchstart:_initiateDrag});
							}

						_superclass.doMy (m,'wireUi');

						_updateUiHandlesDisplayed (m);
					}
				}
			},

			stateProperties:{
				_canRotate:{ // if true, show the rotation button
					name:'canRotate',
					onChange:function () {
						var m = this;

						if (m._canRotate && !m.children.rotate)
							Uize.require (
								'Uize.Widget.Drag',
								function (_Uize_Widget_Drag) {
									var
										_initialRotation,
										_centerX, _centerY, // the center of the visible marquee (i.e. the dashed line + handles)
										_initialRotationOffset // the angle created by the line segment center-button center and the line f(x) = _center.x
									;

									m.set ({rotation:0});

									m.addChild ('rotate', _Uize_Widget_Drag).wire ({
										'Before Drag Start':function (_event) {
											var
												_buttonCoords = _Uize_Dom_Pos.getCoords (m.getNode ('rotate')),
												_centerCoords = _Uize_Dom_Pos.getCoords (m.getNode (m.get ('areaNodes') [0]))
													// assume that an area node always exists
											;

											_initialRotation = m.get ('rotation');
											_centerX = _centerCoords.x + _centerCoords.width / 2;
											_centerY = _centerCoords.y + _centerCoords.height / 2;
											_initialRotationOffset = Math.atan (
												Math.abs (
													(_centerY - (_buttonCoords.y + _buttonCoords.height / 2)) /
													((_buttonCoords.x + _buttonCoords.width / 2) - _centerX)
												)
											) * 180 / Math.PI;

											if (_buttonCoords.x < _centerX)
												_initialRotationOffset = 180 - _initialRotationOffset;
											if (_buttonCoords.y > _centerY)
												_initialRotationOffset *= -1;

											m.set ({inDrag:_true});
											m.fire (_event);
										},
										'Drag Update':function (_event) {
											if (!m._updatingRotationPosition) {
												m._updatingRotationPosition = _true;

												var
													_mouseCoords = _event.source.get ('eventPos'),
													_angle = Math.atan (
														Math.abs (
															(_centerY - _mouseCoords [1]) /
															(_mouseCoords [0] - _centerX)
														)
													)
												;

												// _angle stores the value of the angle created by the two lines:
												// 1. the line segment with endpoints at the mouse coordinates and the _center
												// 2. f(x) = _center [0]
												//
												// Math.abs is used because we don't care about the relative position of the triangle
												// created by the angle and related lines. We just need that angular value. We deal
												// with the orientation of the angle below.
												//
												// Imagine a plane with the center at _center. If line segment 1 (see the top of this comment)
												// is completely within Quadrant I, its angle will be a value between 0 and 90. Additionally,
												// _mouseCoords [0] >= _center [0] and _mouseCoords [1] <= _center [1].
												//
												// Now, assume that line segment 1 is in Quadrant II. The _angle will be for the triangle
												// whose right angle is to the left of the _center. However, for the rotation we care about
												// the angle that is 180 - _angle: the angle that helps define the arc from the Quadrant I
												// to line segment 1.
												//
												// In Quadrant III both conditions are satisfied. We'll subtract the angle from 180 because
												// our arc is now going from Quadrant IV to Quadrant III. Additionally, since the angle is
												// the inverse of the angle defined in the paragraph above we have to reverse the sign.
												//
												// In Quadrant IV the angle is just the opposite of the angle in Quadrant I, so we reverse
												// the sign.
												//
												// This would be easier to explain if I knew how to create ASCII art.
												if (_mouseCoords [0] < _centerX)
													_angle = Math.PI - _angle;
												if (_mouseCoords [1] > _centerY)
													_angle *= -1;

												m.set ({
													rotation:
														_initialRotation +
														_initialRotationOffset +
														_angle * -180 / Math.PI
												});

												m._updatingRotationPosition = _false;
											}
										},
										'Drag Done':function (_event) {
											m.set ({inDrag:_false});
											m.fire (_event);
										}
									});

									_updateUiRotate (m);
								}
							);
						else _updateUiRotate (m);
					}
				},
				_handlesAlign:'handlesAlign',
				_handleCssClass:'handleCssClass',
				_hideOtherHandlesInDrag:{
					name:'hideOtherHandlesInDrag',
					value:_true
				},
				_rotateCssClass:'rotateCssClass',
				_shellLive:{
					name:'shellLive',
					value:_true
				}
			},

			set:{
				areaNodes:['move','border'],
				html:{
					process:function (input) {
						function _getHandleHtml (_handleName) {
							return (
								'<img id="' + input.idPrefix + '-' + _handleName + '" src="' + input.blankGif + '"' + (input.handleCssClass ? (' class="' + input.handleCssClass + '"') : '') + ' style="position:absolute; z-index:1000; display:none;' + (input.handleCssClass ? '' : ' width:19px; height:19px; background:#888; border:1px solid #fff; opacity:.5; filter:alpha(opacity=50);') + '"/>'
							);
						}
						return (
							'<div id="' + input.idPrefix + '-border" style="position:absolute; left:0px; top:0px; width:200px; height:200px; border:1px solid #000; background:url(' + input.blankGif + '); z-index:999;">' +
							'<a href="javascript://" id="' + input.idPrefix + '-rotate"' + (input.rotateCssClass ? (' class="' + input.rotateCssClass + '"') : '') + ' style="display:none;position:absolute;' + (input.rotateCssClass ? '' : 'right:-30px;top:-30px;width:18px;height:18px;background:#000') + ';"></a>' +
							'</div>' +
							'<a id="' + input.idPrefix + '-move" href="javascript://" style="display:block; position:absolute; left:0px; top:0px; width:200px; height:200px; border:1px dashed #fff; z-index:1000; background:url(' + input.blankGif + ');"></a>' +
							_getHandleHtml ('northWest') +
							_getHandleHtml ('north') +
							_getHandleHtml ('northEast') +
							_getHandleHtml ('west') +
							_getHandleHtml ('east') +
							_getHandleHtml ('southWest') +
							_getHandleHtml ('south') +
							_getHandleHtml ('southEast')
						);
					}
				},
				nodeMap:{shell:''}
			}
		});
	}
});

