/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.MagView Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 100
	docCompleteness: 80
*/

/*
	OPTIONAL
		- Uize.Widget.Beam.js (only if showBeam state property is true)
*/

/*?
	Introduction
		The =Uize.Widget.MagView= class implements a magnifier view widget that supports a configurable number of zoom levels, with animated zoom in / zoom out.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.MagView',
	required:[
		'Uize.Node',
		'Uize.Fade',
		'Uize.Widget.ImagePort'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false,
				_undefined,
				_null = null,
				_Uize_Node = Uize.Node
			;

		/*** General Variables ***/
			var _imagesCached = {};

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					function () {
						var _this = this;

						/*** create the fade instance ***/
							if (Uize.Fade) _this._fade = Uize.Fade ({duration:450,curve:Uize.Fade.celeration (0,1)});

						/*** create the mag image port widget ***/
							_this._magImagePort = _this.addChild (
								'magImagePort',
								Uize.Widget.ImagePort,
								{sizingUpperBound:'fill',sizingLowerBound:0}
								/*?
									Child Widgets
										magImagePort
											An instance of the =Uize.Widget.ImagePort= class, used for displaying the zoomed in image off to the side of the main image.
								*/
							);

						/*** create the beam widget ***/
							if (_this._showBeam)
								_this._beam = _this.addChild ('beam',Uize.Widget.Beam)
							;
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._magInUse = function () {return this.isWired && this._magShown};

			_classPrototype._getLowestAndNextMagPower = function () {
				var
					_currentMagPower = this._magPower,
					_lowestMagPower = _currentMagPower,
					_nextMagPower = _currentMagPower,
					_magPowers = this._magPowers
				;
				if (_magPowers) {
					var _magPowersLength = _magPowers.length;
					if (_magPowersLength) {
						_lowestMagPower = _nextMagPower = Infinity;
						for (var _magPowerNo = -1; ++_magPowerNo < _magPowersLength;) {
							var _magPower = _magPowers [_magPowerNo];
							if (_magPower < _lowestMagPower)
								_lowestMagPower = _magPower
							;
							if (_magPower > _currentMagPower && _magPower < _nextMagPower)
								_nextMagPower = _magPower
							;
						}
						if (_nextMagPower == Infinity) _nextMagPower = _lowestMagPower;
					}
				}
				return {
					_lowestMagPower:_lowestMagPower,
					_nextMagPower:_nextMagPower
				};
			};

			_classPrototype._getMagImageHighResUrl = function (_magPower) {
				var _magImageHighResUrl = this._magImageHighResUrl;
				return (
					Uize.isFunction (_magImageHighResUrl)
						? _magImageHighResUrl.call (this,_magPower)
						: _magImageHighResUrl
				);
			};

			_classPrototype._updateUiUrls = function () {
				var _this = this;
				if (_this._magInUse ()) {
					var _magImageHighResUrl = _this._getMagImageHighResUrl (_this._magPower);
					if (_magImageHighResUrl !== _this._displayedMagImageHighResUrl) {
						/* NOTE: check if image in magImagePort needs to be updated */
						var
							_displayHighRes = function (_mustDisplay) {
								_Uize_Node.show (_this.getNode ('magImageHighRes'),_mustDisplay);
								_this.displayNode ('magImageLowRes',!_mustDisplay);
							},
							_magImageHighResUrlCached = _imagesCached [_magImageHighResUrl]
						;
						if (!_magImageHighResUrlCached) {
							/*** choose placeholder image URL to use while high res is loading ***/
								var
									_placeholderMagImageUrl = _this._magImageLowResUrl,
									_magPowers = _this._magPowers
								;
								if (_magPowers) {
									for (
										var
											_magPowerNo = -1,
											_magPowersLength = _magPowers.length,
											_currentMagPower = _this._magPower,
											_nearestLowerCachedMagPower = 0
										;
										++_magPowerNo < _magPowersLength;
									) {
										var _magPower = _magPowers [_magPowerNo];
										if (_magPower < _currentMagPower && _magPower > _nearestLowerCachedMagPower) {
											var _magImageUrlForLowerPower = _this._getMagImageHighResUrl (_magPower);
											if (_imagesCached [_magImageUrlForLowerPower]) {
												_placeholderMagImageUrl = _magImageUrlForLowerPower;
												_nearestLowerCachedMagPower = _magPower;
											}
										}
									}
								}

						_this.setNodeProperties ('magImageLowRes',{src:_placeholderMagImageUrl});
						_this.displayNode ('highResLoading');
						_displayHighRes (_false);

						/*** loading indicator for loading the high res image ***/
							var _highResLoaded = function () {
								_this.unwireNode ('magImageHighRes');
								_imagesCached [_magImageHighResUrl] = 1;
								_this.displayNode ('highResLoading',_false);
								_displayHighRes (_true);
							};
							_this.wireNode (
								'magImageHighRes',
								{
									load:_highResLoaded,
									error:_highResLoaded,
									abort:_highResLoaded
								}
							);
						}
						_this._displayedMagImageHighResUrl = _magImageHighResUrl;
						_this.setNodeProperties ('magImageHighRes',{src:_magImageHighResUrl});
					}
				}
			};

			_classPrototype._updateUiCalibrateDuringUse = function () {
				var
					_this = this,
					_magPower = _this._magPower,
					_regViewWidth = _this._regViewWidth,
					_regViewHeight = _this._regViewHeight,
					_magRegionWidthFraction = _this._magImagePortWidthDivRegViewWidth / _magPower,
					_magRegionHeightFraction = _this._magImagePortHeightDivRegViewHeight / _magPower,
					_highlightWidth = _this._highlightWidth = _magRegionWidthFraction * _regViewWidth,
					_highlightHeight = _this._highlightHeight = _magRegionHeightFraction * _regViewHeight
				;
				_this._highlightOffsetX = _highlightWidth * _this._cursorAlignX;
				_this._highlightOffsetY = _highlightHeight * _this._cursorAlignY;
				_this._regViewWidthMinusHighlightWidth = _regViewWidth - _highlightWidth;
				_this._regViewHeightMinusHighlightHeight = _regViewHeight - _highlightHeight;
				_this._magImagePortSizingValue = Math.min (1 / _magRegionWidthFraction,1 / _magRegionHeightFraction);

				/*** update the beam ***/
					_this._showBeam &&
						_this._beam.set ({
							thinSize:_this._highlightHeight / _regViewHeight,
							height:_regViewHeight,
							top:_this._regViewY
						})
					;
			};

			_classPrototype._updateUiMagPower = function () {
				var _this = this;
				function _updateAfterMagPowerReflected () {
					_this._lastDisplayedMagPower = _this._magPower;
					_this._updateUiUrls ();

					/*** set the cursor to indicate either zoom in or zoom out ability ***/
						/*
						var _isIe = _Uize_Node.isIe;
						_this.setNodeStyle (
							'highlight',
							{
								cursor:
									_this._getLowestAndNextMagPower ()._nextMagPower > _this._magPower
										? (_isIe ? 'url(' + Uize.pathToResources + 'Uize_Node/zoomin.cur)' : '-moz-zoom-in')
										: (_isIe ? 'url(' + Uize.pathToResources + 'Uize_Node/zoomout.cur)' : '-moz-zoom-out')
							}
						);
						*/
				}
				if (_this._magInUse ()) {
					var _reflectChangedMagPower = function () {
						_this._updateUiCalibrateDuringUse ();
						_this._updateUiDuringUse ();
					};
					if (_this._fade) {
						var _fade = _this._fade;
						_fade.set ({
							startValue:_this._lastDisplayedMagPower,
							endValue:_this._magPower
						});
						var _fadeEventHandlers = {
							'Changed.value':
								function () {
									_this._magPower = +_fade;
									_reflectChangedMagPower ();
								},
							Done:
								function () {
									_fade.unwire (_fadeEventHandlers);
									_updateAfterMagPowerReflected ();
									_this._fadeInProgress = _false;
								}
						};
						_fade.wire (_fadeEventHandlers);
						_this._fadeInProgress = _true;
						_this._fade.start ();
					} else {
						_reflectChangedMagPower ();
						_updateAfterMagPowerReflected ();
					}
				} else {
					_updateAfterMagPowerReflected ();
				}
			};

			_classPrototype._updateUiDuringUse = function () {
				var
					_this = this,
					_alignX = Uize.constrain ((_this._eventAbsPos.left - _this._regViewX - _this._highlightOffsetX) / _this._regViewWidthMinusHighlightWidth,0,1),
					_alignY = Uize.constrain ((_this._eventAbsPos.top - _this._regViewY - _this._highlightOffsetY) / _this._regViewHeightMinusHighlightHeight,0,1),
					_highlightLeft = _this._regViewX + _this._regViewWidthMinusHighlightWidth * _alignX,
					_highlightRight = _highlightLeft + _this._highlightWidth
				;
				_this._showBeam &&
					_this._beam.set ({
						thinAlign:_alignY,
						left:_highlightRight,
						width:_this._regViewX + _this._regViewWidth - _highlightRight
					})
				;
				_this._magImagePort.set ({
					alignX:_alignX,
					alignY:_alignY,
					sizingValue:_this._magImagePortSizingValue
				});
				_this.setNodeStyle (
					'highlight',
					{
						left:_highlightLeft,
						top:_this._regViewY + _this._regViewHeightMinusHighlightHeight * _alignY,
						width:_this._highlightWidth - 2,
						height:_this._highlightHeight - 2
					}
				);
			};

		/*** Public Instance Methods ***/
			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					/*** capture dimensions of regular view ***/
						var
							_regViewDims = _Uize_Node.getDimensions (_this.getNode ()),
							_regViewWidth = _this._regViewWidth = _regViewDims.width,
							_regViewHeight = _this._regViewHeight = _regViewDims.height
						;

					/*** wire up the mouseover and mouseout events ***/
						var _displayMagUi = function (_mustDisplay) {
							_this.displayNode (
								['magImagePortShell','highlight',_this._showBeam ? _this._beam.getNode () : _null],
								_mustDisplay
							);
							_this._magShown = _mustDisplay;
						};
						_this.wireNode (
							'',
							'mouseover',
							function (_event) {
								_displayMagUi (_true);

								/*** move highlight, beam, and image port nodes to document root (if not already done) ***/
									if (!_this._nodesMovedToRoot) {
										_this._nodesMovedToRoot = _true;
										var
											_docBody = document.body,
											_moveNodeToRoot = function (_node) {
												_docBody.insertBefore (_node,_docBody.childNodes [0]);
												_Uize_Node.setStyle (
													_node,
													{
														zIndex:100000,
														position:'absolute'
													}
												);
											}
										;
										_moveNodeToRoot (_this.getNode ('magImagePortShell'));
										_moveNodeToRoot (_this.getNode ('highlight'));
										_this._showBeam && _moveNodeToRoot (_this._beam.getNode ());
									}

								/*** perform calibration that persists for the duration of use ***/
									/* NOTE:
										This has to be done here after revealing the shell, otherwise all dimensions of display:none nodes register as zero. The other alternative is to require the width and height to be explicit in the style attribute of the nodes.
									*/
									var
										_regViewCoords = _Uize_Node.getCoords (_this.getNode ()),
										_magImagePortDims = _Uize_Node.getDimensions (_this._magImagePort.getNode ())
									;
									_this._regViewX = _regViewCoords.x;
									_this._regViewY = _regViewCoords.y;
									_this._magImagePortWidth = _magImagePortDims.width;
									_this._magImagePortHeight = _magImagePortDims.height;
									_this._magImagePortWidthDivRegViewWidth = _this._magImagePortWidth / _regViewWidth;
									_this._magImagePortHeightDivRegViewHeight = _this._magImagePortHeight / _regViewHeight;

									/*** update the image port (per state that persists during mouse moves) ***/
										_this.setNodeStyle (
											'magImagePortShell',
											{
												left:_this._regViewX + _regViewWidth,
												top:_this._regViewY
											}
										);

									_this._updateUiCalibrateDuringUse ();

								_this._updateUiUrls ();

								var
									_oldOnmousemove = document.onmousemove,
									_oldOnclick = document.onclick
								;
								function _handleMouseMove () {
									_this._eventAbsPos = _Uize_Node.getEventAbsPos ();
									if (
										_Uize_Node.doRectanglesOverlap (
											_this._eventAbsPos.left,_this._eventAbsPos.top,1,1,
											_this._regViewX,_this._regViewY,_regViewWidth,_regViewHeight
										)
									) {
										_this._updateUiDuringUse ();
									} else {
										_displayMagUi (_false);
										document.onmousemove = _oldOnmousemove;
										document.onclick = _oldOnclick;
										_this._resetMagPowerOnOut &&
											_this.set ({_magPower:_this._getLowestAndNextMagPower ()._lowestMagPower})
										;
									}
								}
								_handleMouseMove ();
								document.onmousemove = _handleMouseMove;
								document.onclick = function () {
									_this._fadeInProgress ||
										_this.set ({_magPower:_this._getLowestAndNextMagPower ()._nextMagPower})
									;
								};
							}
						);

					_superclass.prototype.wireUi.call (_this);
				}
			};
			/*?
				Implied Nodes
					See the list of child widgets for other implied nodes that are not directly controlled by this widget.

					The Root Node
						The root node captures mouse events and tracks the mouse movements in order to determine the region within the main image that the user would like to magnify. The root node should contain the =image= node.

						NOTES
						- this node is required

					highlight
						A =div= node that is sized and positioned as the user mouses over the main image and that serves to highlight the region of the image that will appear magnified in the mag image port.

						NOTES
						- this node is required

					highResLoading
						An optional node (of any type) that will be displayed when the high resolution mag image is loading and then hidden once it has completed loading.

						NOTES
						- this node is optional

					image
						A node that is used to display the main image. This node should be contained inside and should exactly occupy the space in the root node. The node can be either a IMG node, or a DIV node with CSS background set to the image URL.

						NOTES
						- this node is required

					magImagePortShell
						A node (of any type, but likely a DIV) that serves as a container for the magnified view's image port, and that is displayed when the user mouses over the main image and is hidden when the user mouses out of the main image.

						NOTES
						- this node is required

					magImageLowRes
						An image node whose src will be set to the src of the image being magnified, but that will be scaled up to provide a placeholder for the high resolution mag image while it is still loading in.

						NOTES
						- this node is required

					magImageHighRes
						An image node whose src will be set to the value of the =magImageHighResUrl= state property when the mag view mode is activated.

						NOTES
						- this node is required
			*/

		/*** State Properties ***/
			_class.stateProperties ({
				_cursorAlignX:{
					name:'cursorAlignX',
					value:.5
					/*?
						State Properties
							cursorAlignX
								A floating point number in the range of =0= to =1=, specifying the horizontal position of the cursor in relation to the =highlight= box.

								A value of =0= would position the cursor at the left edge of the =highlight=, a value of =1= would position the cursor at the right, and a value of =.5= would position the cursor in the center horizontally. Other values would position the cursor along the continuum from the left edge to the right edge.

								NOTES
								- the initial value is =.5= (centered horizontally)
					*/
				},
				_cursorAlignY:{
					name:'cursorAlignY',
					value:.75
					/*?
						State Properties
							cursorAlignY
								A floating point number in the range of =0= to =1=, specifying the vertical position of the cursor in relation to the =highlight= box.

								A value of =0= would position the cursor at the top edge of the =highlight=, a value of =1= would position the cursor at the bottom, and a value of =.5= would position the cursor in the center vertically. Other values would position the cursor along the continuum from the top edge to the bottom edge.

								NOTES
								- the initial value is =.75= (three quarters of the way down, vertically)
					*/
				},
				_magImageLowResUrl:'magImageLowResUrl',
					/*?
						State Properties
							magImageLowResUrl
								A string, specifying the URL for the low resolution image.

								NOTES
								- the initial value is =undefined=
					*/
				_magImageHighResUrl:{
					name:'magImageHighResUrl',
					onChange:_classPrototype._updateUiUrls
						/*?
							State Properties
								magImageHighResUrl
									A string, specifying the URL of the high resolution image, or a function that should return the URL of the high resolution image.

									NOTES
									- the initial value is =undefined=
						*/
				},
				_magPower:{
					name:'magPower',
					value:1,
					onChange:_classPrototype._updateUiMagPower
					/*?
						State Properties
							magPower
								A number, specifying the current magnification power.

								NOTES
								- the initial value is =1=
					*/
				},
				_magPowers:{
					name:'magPowers',
					onChange:function () {this.set ({_magPower:this._magPowers [0]})}
					/*?
						State Properties
							magPowers
								An array, specifying the magnification powers that should be available.

								NOTES
								- the initial value is =undefined=
					*/
				},
				_resetMagPowerOnOut:{
					name:'resetMagPowerOnOut',
					value:_true
					/*?
						State Properties
							resetMagPowerOnOut
								A boolean, specifying whether or not the current magnification power should be reset to the lowest available magnification power when the user mouses out of the image.

								NOTES
								- the initial value is =true=
					*/
				},
				_showBeam:{
					name:'showBeam',
					value:_false
				}
			});

		return _class;
	}
});

