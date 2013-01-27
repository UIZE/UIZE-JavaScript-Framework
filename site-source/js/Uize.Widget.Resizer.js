/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Resizer Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2006-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*
	HOOKS FOR SUBCLASSING
		- areaNodes state property
		- creatingNew state property
		- pointIdsMap static property
		- activeHandleEffectivePointIdX
		- activeHandleEffectivePointIdY
*/

/* Module Meta Data
	type: Class
	importance: 6
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.Resizer= class implements resizing logic, with support for fixed aspect ratio, constraining to container, minimum dimensions, and more.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.Resizer',
	required:[
		'Uize.Node',
		'Uize.Widget.Drag'
	],
	builder:function  (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false,
				_Uize_Node = Uize.Node,
				_isIe = _Uize_Node.isIe
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					function () {
						/*** Private Instance Properties ***/
							this._lastAreaWidth = {};
					}
				),
				_classPrototype = _class.prototype
			;

		/*** General Variables ***/
			var
				_ieQuirkyBoxes = _isIe && document.compatMode != 'CSS1Compat',
				_pointIdsMap = {
					northWest:[0,0],
					north:[.5,0],
					northEast:[1,0],
					west:[0,.5],
					move:['both','both'],
					east:[1,.5],
					southWest:[0,1],
					south:[.5,1],
					southEast:[1,1]
				}
			;

		/*** Private Instance Methods ***/
			_classPrototype._canResizeAxis = function (_axis,_pointIds) {
				var _pointIdForAxis = _pointIds [_axis];
				return _pointIdForAxis != .5 && (_pointIdForAxis == 'both' || !(_axis ? this._fixedY : this._fixedX));
			};

			_classPrototype._updateHandlesEnabled = function () {
				var _this = this;
				if (_this.isWired) {
					for (var _handleName in _pointIdsMap) {
						var _pointIds = _pointIdsMap [_handleName];
						_this.children [_handleName].set ({
							enabled:
								_this._canResizeAxis (0,_pointIds) || _this._canResizeAxis (1,_pointIds) ? 'inherit' : _false
						});
					}
				}
			};

			_classPrototype._updateShellBounds = function () {
				var _this = this;
				if (_this.isWired && !(_this._bounds = _this._constrainBounds)) {
					var _shellDims = _Uize_Node.getDimensions (_this.getNode ('shell'));
					if (_shellDims.width && _shellDims.height)
						_this._bounds = [0,0,_shellDims.width - 1,_shellDims.height - 1]
					;
				}
			};

			_classPrototype._updateShellBoundsAndConformDims = function () {
				var _this = this;
				_this._updateShellBounds ();
				var _bounds = _this._bounds;
				if (_bounds) {
					_this._maxDims = [_bounds [2] - _bounds [0] + 1,_bounds [3] - _bounds [1] + 1];
					_this._conformDims ();
				}
			};

			var _conformDims = _classPrototype._conformDims = function () {
				var _this = this;
				if (_this.isWired && (!_this._inDrag || _this._creatingNew)) {
					_this._updateShellBounds ();
					if (_this._bounds) {
						var
							_constrain = _this._constrain,
							_bounds = _this._bounds,
							_maxDims = _this._maxDims,
							_left = _this._left,
							_top = _this._top,
							_width = _this._width,
							_height = _this._height,
							_conformedWidth,
							_conformedHeight,
							_aspectRatio = _this._aspectRatio
						;
						if (_aspectRatio != null) {
							/* TO DO:
								- if dimensions don't match explicit aspect ratio...
									- calculate volume of new rect and "split the difference" to make new width and height that conform to aspect ratio
									- determine dimensions, having the explicit aspect ratio, that would *fit* into the bounds
									- if either of the resizer axes are larger than fit rect, set both resizer dimensions to fit rect
							*/
							_conformedWidth = _width;
							_conformedHeight = _height;
						} else {
							_conformedWidth =
								Uize.constrain (_width,_this._minWidth,_constrain ? _maxDims [0] : Infinity);
							_conformedHeight =
								Uize.constrain (_height,_this._minHeight,_constrain ? _maxDims [1] : Infinity);
						}
						var
							_conformedLeft =
								_constrain ? Uize.constrain (_left,_bounds [0],_bounds [2] - _conformedWidth + 1) : _left,
							_conformedTop =
								_constrain ? Uize.constrain (_top,_bounds [1],_bounds [3] - _conformedHeight + 1) : _top
						;
						if (
							_conformedLeft != _left || _conformedTop != _top ||
							_conformedWidth != _width || _conformedHeight != _height
						)
							_this.set ({
								_left:_conformedLeft,
								_top:_conformedTop,
								_width:_conformedWidth,
								_height:_conformedHeight
							})
						;
					}
				}
			};

		/*** Public Instance Methods ***/
			_classPrototype.setPositionDuringDrag = function (_left,_top,_width,_height) {
				var _this = this;
				if (_left != _this._left || _top != _this._top || _width != _this._width || _height != _this._height) {
					_this.set ({
						left:_left,
						top:_top,
						width:_width,
						height:_height
					});
					_this.fire ('Position Changed');
				}
			};

			_classPrototype.getCoords = function () {
				var _this = this;
				return {left:_this._left,top:_this._top,width:_this._width,height:_this._height};
			};

			_classPrototype.updateUi = function () {
				var _this = this;
				if (_this.isWired) {
					Uize.forEach (
						_this._areaNodes,
						function _setAreaDims (_areaNode) {
							function _getBorderWidth (_side) {
								return parseInt (_Uize_Node.getStyle (_area,'border' + _side + 'Width')) || 0;
							}
							var _area = _this.getNode (_areaNode);
							if (_area) {
								var _newAreaWidth = Math.max (
									_this._width - (_ieQuirkyBoxes ? 0 : _getBorderWidth ('Left') + _getBorderWidth ('Right')),0
								);
								if (_isIe)
									_newAreaWidth == _this._lastAreaWidth [_areaNode]
										? _this.displayNode ('jiggler',_this._jigglerShown = !_this._jigglerShown)
										: (_this._lastAreaWidth [_areaNode] = _newAreaWidth)
								;
								_Uize_Node.setStyle (
									_area,
									{
										left:_this._left,
										top:_this._top,
										width:_newAreaWidth,
										height:Math.max (_this._height - (_ieQuirkyBoxes ? 0 : _getBorderWidth ('Top') + _getBorderWidth ('Bottom')),0)
									}
								);
							}
						}
					);
				}
			};

			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					/*** wire up the drag handles ***/
						var
							_bounds,
							_shellCenter,
							_pointIds,
							_dragStartCoords,
							_Uize_Widget_Drag = Uize.Widget.Drag,
							_wireHandle = function (_handleName) {
								_pointIds = _pointIdsMap [_handleName];
								var _dragHandle = _this.addChild (
									_handleName,
									_Uize_Widget_Drag,
									{
										cursor:_handleName == 'move'
											? _handleName
											: _handleName.charAt (0) + (_handleName.match (/[A-Z]|$/)) [0] + '-resize',
										dragRestTime:_this._dragRestTime,
										node:_this.getNode (_handleName),
										resizerInfo:{
											_handleName:_handleName,
											_pointIds:_pointIds
										}
									}
								);
								_dragHandle.wire ({
									'Before Drag Start':
										function (_event) {_this.fire (_event)},
									'Drag Start':
										function (_event) {
											_this._activeHandle = _event.source;
											_this.set ({_inDrag:_true});
											_this._updateShellBoundsAndConformDims ();
											_bounds = _this._bounds;
											_shellCenter = [_bounds [2] / 2,_bounds [3] / 2];
											_dragStartCoords = [
												_this._left,
												_this._top,
												_this._left + _this._width - 1,
												_this._top + _this._height -1
											];
											_this.fire (_event);
										},
									'Drag Update':
										function () {
											var
												_aspectRatio = _this._aspectRatio,
												_resizerInfo = _this._activeHandle.resizerInfo,
												_pointIds = _resizerInfo._pointIds,
												_effectivePointIds = _pointIds.concat (),
												_newCoords = _dragStartCoords.concat ()
											;
											function _updateAxisCoords (_axis) {
												if (_this._canResizeAxis (_axis,_pointIds)) {
													var
														_pointIdForAxis = _pointIds [_axis],
														_offset = _dragHandle.eventDeltaPos [_axis]
													;
													if (_pointIdForAxis == 'both') {
														if (_this._constrain)
															_offset = Uize.constrain (
																_offset,
																_bounds [_axis] - _newCoords [_axis],
																_bounds [_axis + 2] - _newCoords [_axis + 2]
															)
														;
														_newCoords [_axis] += _offset;
														_newCoords [_axis + 2] += _offset;
													} else {
														var _coordNo = _axis + _pointIdForAxis * 2;
														_newCoords [_coordNo] += _offset;
														if (_this._constrain)
															_newCoords [_coordNo] = Uize.constrain (
																_newCoords [_coordNo],
																_bounds [_axis],
																_bounds [_axis + 2]
															)
														;
														if (_aspectRatio == null && _newCoords [_axis] > _newCoords [_axis + 2]) {
															/* NOTE:
																for now we don't swap the coordinates around when they cross over if an aspect ratio is set, since we haven't dealt with the weird calculation issues that arise and lead to strange behaviors where the resizer moves around
															*/
															var _temp = _newCoords [_axis];
															_newCoords [_axis] = _newCoords [_axis + 2];
															_newCoords [_axis + 2] = _temp;
															_effectivePointIds [_axis] = 1 - _effectivePointIds [_axis];
														}
													}
												}
											}
											_updateAxisCoords (0);
											_updateAxisCoords (1);
											var
												_newDims = [
													Math.max (_newCoords [2] - _newCoords [0] + 1,_this._minWidth),
													Math.max (_newCoords [3] - _newCoords [1] + 1,_this._minHeight)
												],
												_newCenter = [
													(_newCoords [0] + _newCoords [2]) / 2,
													(_newCoords [1] + _newCoords [3]) / 2
												]
											;

											/*** handle explicit aspect ratio ***/
												if (_aspectRatio != null) {
													if (_newDims [0] / _newDims [1] != _aspectRatio) {
														var
															_dimsFromAspectRatio = [
																_newDims [1] * _aspectRatio,
																_newDims [0] / _aspectRatio
															],
															_setDimWithConstraint = function (_axis,_maxDim) {
																_newDims [_axis] = _dimsFromAspectRatio [_axis];
																if (_this._constrain) {
																	_newDims [_axis] = Math.min (_newDims [_axis],_maxDim);
																	_newDims [1 - _axis] =
																		_newDims [_axis] * Math.pow (_aspectRatio,_axis * 2 - 1)
																	;
																}
															},
															_updateDimByCenterPoint = function (_axis) {
																_setDimWithConstraint (
																	_axis,
																	(
																		_newCenter [_axis] <
																		_shellCenter [_axis]
																			? (_newCenter [_axis] + .5)
																			: _bounds [_axis + 2] - _newCenter [_axis]
																	) * 2
																);
															},
															_updateDimByCornerPoint = function (_axis) {
																_setDimWithConstraint (
																	_axis,
																	(
																		_pointIds [_axis]
																			? _bounds [_axis + 2] - _newCoords [_axis]
																			: _newCoords [_axis + 2]
																	) + 1
																);
															}
														;
														if (_pointIds [0] == .5) {
															_updateDimByCenterPoint (0);
														} else if (_pointIds [1] == .5) {
															_updateDimByCenterPoint (1);
														} else if (_newDims [1] * _dimsFromAspectRatio [0] > _newDims [0] * _dimsFromAspectRatio [1]) {
															_updateDimByCornerPoint (0);
														} else {
															_updateDimByCornerPoint (1);
														}
													}
													var _updateNewCoord = function (_axis) {
														if (!_pointIds [_axis]) {
															_newCoords [_axis] = _newCoords [_axis + 2] - _newDims [_axis] + 1;
														} else if (_pointIds [_axis] == .5) {
															_newCoords [_axis] = _newCenter [_axis] - (_newDims [_axis] - 1) / 2;
														}
													};
													_updateNewCoord (0);
													_updateNewCoord (1);
												}

											_this.set ({
												activeHandleEffectivePointIdX:_effectivePointIds [0],
												activeHandleEffectivePointIdY:_effectivePointIds [1]
											});
											_this.setPositionDuringDrag (_newCoords [0],_newCoords [1],_newDims [0],_newDims [1]);
										},
									'Drag Rest':
										function (_event) {_this.fire (_event)},
									'Drag Done':
										function (_event) {
											_this.set ({_inDrag:_false});
											_this.fire (_event);
											_this.set ({_creatingNew:_false});
											_this.updateUi ();
										}
								});
							}
						;
						for (var _handleName in _pointIdsMap)
							_wireHandle (_handleName)
						;
						_this._updateHandlesEnabled ();

					/*** insert the jiggler node for repaint issue in IE ***/
						if (_isIe) {
							var _areaNode = _this.getNode (_this._areaNodes [0]);
							if (_areaNode) {
								var _jiggler = document.createElement ('div');
								_jiggler.id = _this.get ('idPrefix') + '-jiggler';
								_Uize_Node.setStyle (_jiggler,{position:'absolute'});
								_areaNode.appendChild (_jiggler);
							}
						}

					_superclass.prototype.wireUi.call (_this);

					_this._updateShellBoundsAndConformDims ();
				}
			};

		/*** Public Static Properties ***/
			_class.pointIdsMap = _pointIdsMap;

		/*** State Properties ***/
			var
				_updateUi = 'updateUi',
				_fixedOnChange = [_updateUi,_classPrototype._updateHandlesEnabled],
				_conformDimsAndUpdateUi = [_conformDims,_updateUi]
			;
			_class.stateProperties ({
				_activeHandleEffectivePointIdX:'activeHandleEffectivePointIdX',
				_activeHandleEffectivePointIdY:'activeHandleEffectivePointIdY',
				_areaNodes:{
					name:'areaNodes',
					value:['']
				},
				_aspectRatio:{
					name:'aspectRatio',
					onChange:_updateUi,
					value:null
				},
				_constrain:{
					name:'constrain',
					value:_true,
					onChange:_conformDims
				},
				_constrainBounds:{
					name:'constrainBounds',
					value:null,
					onChange:_classPrototype._updateShellBoundsAndConformDims
				},
				_creatingNew:{
					name:'creatingNew',
					value:_false
				},
				_dragRestTime:{
					name:'dragRestTime',
					onChange:function () {Uize.callOn (this.children,'set',[{dragRestTime:this._dragRestTime}])},
					value:250
				},
				_fixedX:{
					name:'fixedX',
					onChange:_fixedOnChange,
					value:_false
				},
				_fixedY:{
					name:'fixedY',
					onChange:_fixedOnChange,
					value:_false
				},
				_height:{
					name:'height',
					onChange:_conformDimsAndUpdateUi,
					value:200
				},
				_inDrag:{
					name:'inDrag',
					value:_false
				},
				_left:{
					name:'left',
					onChange:_conformDimsAndUpdateUi,
					value:0
				},
				_minHeight:{
					name:'minHeight',
					value:10,
					onChange:_conformDims
				},
				_minWidth:{
					name:'minWidth',
					value:10,
					onChange:_conformDims
				},
				_top:{
					name:'top',
					onChange:_conformDimsAndUpdateUi,
					value:0
				},
				_width:{
					name:'width',
					onChange:_conformDimsAndUpdateUi,
					value:200
				}
			});

		return _class;
	}
});

