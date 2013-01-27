/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Resizer.Marquee Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2013 UIZE
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

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.Resizer.Marquee',
	required:'Uize.Node',
	builder:function  (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false,
				_Uize_Node = Uize.Node
			;

		/*** General Variables ***/
			var
				_centerAlign = [.5,.5],
				_sacredEmptyObject = {}
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					function () {
						var _this = this;

						/*** watch for state changes that would require updating displayed handles ***/
							function _updateUiHandlesDisplayedAndPositions () {
								_this._updateUiHandlesDisplayed ();
								_this._updateUiHandlesPositions ();
							}
							_this.wire ({
								'Changed.inDrag':_updateUiHandlesDisplayedAndPositions,
								'Changed.creatingNew':_updateUiHandlesDisplayedAndPositions,
								'Changed.fixedX':_updateUiHandlesDisplayedAndPositions,
								'Changed.fixedY':_updateUiHandlesDisplayedAndPositions,
								'Changed.activeHandleEffectivePointIdX':_updateUiHandlesDisplayedAndPositions,
								'Changed.activeHandleEffectivePointIdY':_updateUiHandlesDisplayedAndPositions
							});
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._updateUiHandlesDisplayed = function () {
				var _this = this;
				if (_this.isWired) {
					var
						_inDrag = _this.get ('inDrag'),
						_creatingNew = _this.get ('creatingNew'),
						_fixedX = _this.get ('fixedX'),
						_fixedY = _this.get ('fixedY'),
						_activeHandleEffectivePointIdX = _this.get ('activeHandleEffectivePointIdX'),
						_activeHandleEffectivePointIdY = _this.get ('activeHandleEffectivePointIdY'),
						_pointIdsMap = _class.pointIdsMap
					;
					for (var _handleName in _pointIdsMap) {
						if (_handleName != 'move') {
							var _pointIds = _pointIdsMap [_handleName];
							_this.displayNode (
								_handleName,
								(
									!_creatingNew &&
									(!_fixedX || _pointIds [0] == .5) &&
									(!_fixedY || _pointIds [1] == .5) &&
									(
										!_this._hideOtherHandlesInDrag || !_inDrag ||
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
			};

			_classPrototype._updateUiHandlesPositions = function () {
				/* NOTE:
					one might be tempted to optimize this code so that the positioning of the handles is not updated while they are not visible, so I tried this, but it actually turned out to incur greater re-rendering cost in IE -- go figure!
				*/
				var _this = this;
				if (_this.isWired) {
					var
						_left = _this.get ('left'),
						_top = _this.get ('top'),
						_widthMinus1 = _this.get ('width') - 1,
						_heightMinus1 = _this.get ('height') - 1,
						_pointIdsMap = _class.pointIdsMap,
						_handlesAlign = _this._handlesAlign || _sacredEmptyObject
					;
					for (var _handleName in _pointIdsMap) {
						if (_handleName != 'move') {
							var
								_pointIds = _pointIdsMap [_handleName],
								_handleNode = _this.getNode (_handleName),
								_handleDims = _Uize_Node.getDimensions (_handleNode),
								_handleAlign = _handlesAlign [_handleName] || _centerAlign
							;
							_Uize_Node.setStyle (
								_handleNode,
								{
									left:_left + _pointIds [0] * _widthMinus1 - (_handleDims.width - 1) * _handleAlign [0],
									top:_top + _pointIds [1] * _heightMinus1 - (_handleDims.height - 1) * _handleAlign [1]
								}
							);
						}
					}
				}
			};

		/*** Public Instance Methods ***/
			_classPrototype.updateUi = function () {
				var _this = this;
				if (_this.isWired) {
					/* NOTE:
						For some inexplicable reason, calling updateUi on the superclass here improves the responsiveness of the marquee. This maintains the order of updating that existed prior to factoring out the common Uize.Widget.Resizer code from the old and defunct Uize.Widget.Marquee class. Something about updating the handles before updating the box (performed in the superclass) does not produce a favorable effect.
					*/
					_superclass.prototype.updateUi.call (_this);

					_this._updateUiHandlesPositions ();
				}
			};

			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					/*** wire up the marquee shell ***/
						if (_this._shellLive) {
							var
								_shell = _this.getNode ('shell'),
								_initiateDrag = function (_event) {
									if (_this.get ('enabledInherited')) {
										_event || (_event = event);
										var
											_handleName = _this.get ('aspectRatio') == null ? 'northWest' : 'southEast',
												/* NOTE:
													because we have the don't-swap-sides hack for when an aspect ratio is set, we can only create marquee by dragging from top left to bottom right, and so we start drag with the bottom right handle
												*/
											_shellCoords = _Uize_Node.getCoords (_shell),
											_eventAbsPos = _Uize_Node.getEventAbsPos (_event)
										;
										_this.set ({creatingNew:_true});
										_this.setPositionDuringDrag (
											_eventAbsPos.left - _shellCoords.left,
											_eventAbsPos.top - _shellCoords.top,
											_this.get ('minWidth'),
											_this.get ('minHeight')
										);
										return _this.children [_handleName].initiate (_event);
									}
								}
							;
							_Uize_Node.setStyle (_shell,{cursor:'crosshair'});
							_this.wireNode (_shell,{mousedown:_initiateDrag,touchstart:_initiateDrag});
						}

					_superclass.prototype.wireUi.call (_this);

					_this._updateUiHandlesDisplayed ();
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_handlesAlign:'handlesAlign',
				_hideOtherHandlesInDrag:{
					name:'hideOtherHandlesInDrag',
					value:_true
				},
				_shellLive:{
					name:'shellLive',
					value:_true
				}
			});

		/*** Override Initial Values for Inherited State Properties ***/
			_class.set ({
				areaNodes:['move','border'],
				html:{
					process:function (input) {
						function _getHandleHtml (_handleName) {
							return (
								'<img id="' + input.idPrefix + '-' + _handleName + '" src="' + input.blankGif + '"' + (input.handleCssClass ? (' class="' + input.handleCssClass + '"') : '') + ' style="position:absolute; z-index:1000; display:none;' + (input.handleCssClass ? '' : ' width:19px; height:19px; background:#888; border:1px solid #fff; opacity:.5; filter:alpha(opacity=50);') + '"/>'
							);
						}
						return (
							'<div id="' + input.idPrefix + '-border" style="position:absolute; left:0px; top:0px; width:200px; height:200px; border:1px solid #000; background:url(' + input.blankGif + '); z-index:999;"></div>' +
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
			});

		return _class;
	}
});

