/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.ColorCube.Draggable Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2006-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.ColorCube.Draggable= class extends its superclass by adding the ability to stretch the grid's color gradient by clicking and dragging.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.ColorCube.Draggable',
	required:[
		'Uize.Node',
		'Uize.Widget.Drag',
		'Uize.Color'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false,
				_Uize_Node = Uize.Node
			;

		/*** General Variables ***/
			var _dummyColor = Uize.Color ();

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (),
				_classPrototype = _class.prototype
			;

		/*** Utility Functions ***/
			function _getColorAtRelativePoint (_cornerColors,_blendX,_blendY) {
				/* IMPORTANT:
					this code is very similar to code inside the superclass, so maybe refactor the superclass to provide a service that can be used in this class
				*/
				var
					_colorTopLeftTuple = _cornerColors.colorTopLeft.tuple,
					_colorTopRightTuple = _cornerColors.colorTopRight.tuple,
					_colorBottomLeftTuple = _cornerColors.colorBottomLeft.tuple,
					_colorBottomRightTuple = _cornerColors.colorBottomRight.tuple
				;
				function _blendColorComponent (_componentNo) {
					function _blendValues (_value1,_value2,_blendLevel) {
						return _value1 + (_value2 - _value1) * _blendLevel;
					}
					return (
						_blendValues (
							_blendValues (_colorTopLeftTuple [_componentNo],_colorTopRightTuple [_componentNo],_blendX),
							_blendValues (_colorBottomLeftTuple [_componentNo],_colorBottomRightTuple [_componentNo],_blendX),
							_blendY
						)
					);
				}
				_dummyColor.encoding = _cornerColors.colorTopLeft.encoding;
				Uize.Color.setTuple (
					_dummyColor.tuple,
					_blendColorComponent (0),_blendColorComponent (1),_blendColorComponent (2)
				);
				return _dummyColor.to ();
			}

		/*** Public Instance Methods ***/
			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					var
						_shell = _this.getNode (),
						_drag = Uize.Widget.Drag ({node:_shell}),
						_xSideNames = ['Left','Right'],
						_ySideNames = ['Top','Bottom'],
						_eventStartPos = _drag.eventStartPos,
						_eventDeltaPos = _drag.eventDeltaPos,
						_eventPos = _drag.eventPos,
						_cubeCoords, _cubeCoordsArray,
						_cornerColorsAtDragStart = {}
					;
					_Uize_Node.showClickable (_shell);
					_drag.wire ({
						'Drag Start':
							function (_event) {
								_this.set ({_inDrag:_true});
								_cubeCoords = _Uize_Node.getCoords (_shell);
								_cubeCoordsArray = [_cubeCoords.left,_cubeCoords.top,_cubeCoords.right,_cubeCoords.bottom];
								function _initCornerColorAtDragStart (_cornerName) {
									(
										_cornerColorsAtDragStart [_cornerName] ||
										(_cornerColorsAtDragStart [_cornerName] = Uize.Color ())
									).from (_this.get (_cornerName));
								}
								_initCornerColorAtDragStart ('colorTopLeft');
								_initCornerColorAtDragStart ('colorTopRight');
								_initCornerColorAtDragStart ('colorBottomLeft');
								_initCornerColorAtDragStart ('colorBottomRight');
							},
						'Drag Update':
							function (_event) {
								var
									_scaledCornerSides = [],
									_newPropertyValues = {},
									_newPropertyPoints = {},
									_fixedCornerSides = []
								;
								function _setScaledCornerSides (_axisNo) {
									_fixedCornerSides [_axisNo] = _eventDeltaPos [_axisNo] > 0 ? 0 : 1;
									var
										_fixedCornerPos = _cubeCoordsArray [_fixedCornerSides [_axisNo] * 2 + _axisNo],
										_fixedCornerSide = _fixedCornerSides [_axisNo],
										_fluidCornerSide = 1 - _fixedCornerSide
									;
									_scaledCornerSides [_fixedCornerSide * 2 + _axisNo] = _fixedCornerSide;
									_scaledCornerSides [_fluidCornerSide * 2 + _axisNo] = _fixedCornerSide + (_fluidCornerSide - _fixedCornerSide) * (_eventPos [_axisNo] - _fixedCornerPos) / (_eventStartPos [_axisNo] - _fixedCornerPos);
								}
								_setScaledCornerSides (0);
								_setScaledCornerSides (1);
								function _setCornerColor (_xSide,_ySide) {
									var _propertyName = 'color' + _ySideNames [_ySide] + _xSideNames [_xSide];
									_newPropertyValues [_propertyName] =
										_xSide == _fixedCornerSides [0] && _ySide == _fixedCornerSides [1]
											? _cornerColorsAtDragStart [_propertyName].to ()
											: _getColorAtRelativePoint (
												_cornerColorsAtDragStart,
												(_xSide - _scaledCornerSides [0]) / (_scaledCornerSides [2] - _scaledCornerSides [0]),
												(_ySide - _scaledCornerSides [1]) / (_scaledCornerSides [3] - _scaledCornerSides [1])
											)
									;
								}
								_setCornerColor (0,0);
								_setCornerColor (0,1);
								_setCornerColor (1,0);
								_setCornerColor (1,1);
								_this.set (_newPropertyValues);
								_this.fire ('Colors Changed');
							},
						'Drag Done':
							function () {_this.set ({_inDrag:_false})}
					});
					_this.addChild ('drag',_drag);

					_superclass.prototype.wireUi.call (_this);
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_inDrag:{
					name:'inDrag',
					value:_false
				}
			});

		return _class;
	}
});

