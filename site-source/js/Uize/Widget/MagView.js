/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.MagView Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 100
	docCompleteness: 80
*/

/*?
	Introduction
		The =Uize.Widget.MagView= class implements a magnifier view widget that supports a configurable number of zoom levels, with animated zoom in / zoom out.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.MagView',
	required:[
		'Uize.Dom.Basics',
		'Uize.Dom.Pos',
		'Uize.Fade',
		'Uize.Widget.ImagePort'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_true = true,
				_false = false,
				_undefined,
				_null = null,
				_Uize_Dom_Basics = Uize.Dom.Basics,
				_Uize_Dom_Pos = Uize.Dom.Pos,

			/*** General Variables ***/
				_imagesCached = {}
		;

		/*** Private Instance Methods ***/
			function _magInUse (m) {return m.isWired && m._magShown}

			function _getLowestAndNextMagPower (m) {
				var
					_currentMagPower = m._magPower,
					_lowestMagPower = _currentMagPower,
					_nextMagPower = _currentMagPower,
					_magPowers = m._magPowers
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
			}

			function _getMagImageHighResUrl (m,_magPower) {
				var _magImageHighResUrl = m._magImageHighResUrl;
				return (
					Uize.isFunction (_magImageHighResUrl)
						? _magImageHighResUrl.call (m,_magPower)
						: _magImageHighResUrl
				);
			}

			function _updateUiUrls (m) {
				if (_magInUse (m)) {
					var _magImageHighResUrl = _getMagImageHighResUrl (m,m._magPower);
					if (_magImageHighResUrl !== m._displayedMagImageHighResUrl) {
						/* NOTE: check if image in magImagePort needs to be updated */
						var
							_displayHighRes = function (_mustDisplay) {
								_Uize_Dom_Basics.show (m.getNode ('magImageHighRes'),_mustDisplay);
								m.displayNode ('magImageLowRes',!_mustDisplay);
							},
							_magImageHighResUrlCached = _imagesCached [_magImageHighResUrl]
						;
						if (!_magImageHighResUrlCached) {
							/*** choose placeholder image URL to use while high res is loading ***/
								var
									_placeholderMagImageUrl = m._magImageLowResUrl,
									_magPowers = m._magPowers
								;
								if (_magPowers) {
									for (
										var
											_magPowerNo = -1,
											_magPowersLength = _magPowers.length,
											_currentMagPower = m._magPower,
											_nearestLowerCachedMagPower = 0
										;
										++_magPowerNo < _magPowersLength;
									) {
										var _magPower = _magPowers [_magPowerNo];
										if (_magPower < _currentMagPower && _magPower > _nearestLowerCachedMagPower) {
											var _magImageUrlForLowerPower = _getMagImageHighResUrl (m,_magPower);
											if (_imagesCached [_magImageUrlForLowerPower]) {
												_placeholderMagImageUrl = _magImageUrlForLowerPower;
												_nearestLowerCachedMagPower = _magPower;
											}
										}
									}
								}

						m.setNodeProperties ('magImageLowRes',{src:_placeholderMagImageUrl});
						m.displayNode ('highResLoading');
						_displayHighRes (_false);

						/*** loading indicator for loading the high res image ***/
							var _highResLoaded = function () {
								m.unwireNode ('magImageHighRes');
								_imagesCached [_magImageHighResUrl] = 1;
								m.displayNode ('highResLoading',_false);
								_displayHighRes (_true);
							};
							m.wireNode (
								'magImageHighRes',
								{
									load:_highResLoaded,
									error:_highResLoaded,
									abort:_highResLoaded
								}
							);
						}
						m._displayedMagImageHighResUrl = _magImageHighResUrl;
						m.setNodeProperties ('magImageHighRes',{src:_magImageHighResUrl});
					}
				}
			}

			function _updateUiCalibrateDuringUse (m) {
				var
					_magPower = m._magPower,
					_regViewWidth = m._regViewWidth,
					_regViewHeight = m._regViewHeight,
					_magRegionWidthFraction = m._magImagePortWidthDivRegViewWidth / _magPower,
					_magRegionHeightFraction = m._magImagePortHeightDivRegViewHeight / _magPower,
					_highlightWidth = m._highlightWidth = _magRegionWidthFraction * _regViewWidth,
					_highlightHeight = m._highlightHeight = _magRegionHeightFraction * _regViewHeight
				;
				m._highlightOffsetX = _highlightWidth * m._cursorAlignX;
				m._highlightOffsetY = _highlightHeight * m._cursorAlignY;
				m._regViewWidthMinusHighlightWidth = _regViewWidth - _highlightWidth;
				m._regViewHeightMinusHighlightHeight = _regViewHeight - _highlightHeight;
				m._magImagePortSizingValue = Math.min (1 / _magRegionWidthFraction,1 / _magRegionHeightFraction);
			}

			function _updateUiDuringUse (m) {
				var
					_alignX = Uize.constrain ((m._eventAbsPos.left - m._regViewX - m._highlightOffsetX) / m._regViewWidthMinusHighlightWidth,0,1),
					_alignY = Uize.constrain ((m._eventAbsPos.top - m._regViewY - m._highlightOffsetY) / m._regViewHeightMinusHighlightHeight,0,1),
					_highlightLeft = m._regViewX + m._regViewWidthMinusHighlightWidth * _alignX,
					_highlightRight = _highlightLeft + m._highlightWidth
				;
				m._magImagePort.set ({
					alignX:_alignX,
					alignY:_alignY,
					sizingValue:m._magImagePortSizingValue
				});
				m.setNodeStyle (
					'highlight',
					{
						left:_highlightLeft,
						top:m._regViewY + m._regViewHeightMinusHighlightHeight * _alignY,
						width:m._highlightWidth - 2,
						height:m._highlightHeight - 2
					}
				);
			}

		return _superclass.subclass ({
			alphastructor:function () {
				var m = this;

				/*** create the fade instance ***/
					if (Uize.Fade) m._fade = Uize.Fade ({duration:450,curve:Uize.Fade.celeration (0,1)});

				/*** create the mag image port widget ***/
					m._magImagePort = m.addChild (
						'magImagePort',
						Uize.Widget.ImagePort,
						{sizingUpperBound:'fill',sizingLowerBound:0}
						/*?
							Child Widgets
								magImagePort
									An instance of the =Uize.Widget.ImagePort= class, used for displaying the zoomed in image off to the side of the main image.
						*/
					);
			},

			instanceMethods:{
				wireUi:function () {
					var m = this;
					if (!m.isWired) {
						/*** capture dimensions of regular view ***/
							var
								_regViewDims = _Uize_Dom_Pos.getDimensions (m.getNode ()),
								_regViewWidth = m._regViewWidth = _regViewDims.width,
								_regViewHeight = m._regViewHeight = _regViewDims.height
							;

						/*** wire up the mouseover and mouseout events ***/
							var _displayMagUi = function (_mustDisplay) {
								m.displayNode (
									['magImagePortShell','highlight'],
									_mustDisplay
								);
								m._magShown = _mustDisplay;
							};
							m.wireNode (
								'',
								'mouseover',
								function (_event) {
									_displayMagUi (_true);

									/*** move highlight, and image port nodes to document root (if not already done) ***/
										if (!m._nodesMovedToRoot) {
											m._nodesMovedToRoot = _true;
											var
												_docBody = document.body,
												_moveNodeToRoot = function (_node) {
													_docBody.insertBefore (_node,_docBody.childNodes [0]);
													_Uize_Dom_Basics.setStyle (
														_node,
														{
															zIndex:100000,
															position:'absolute'
														}
													);
												}
											;
											_moveNodeToRoot (m.getNode ('magImagePortShell'));
											_moveNodeToRoot (m.getNode ('highlight'));
										}

									/*** perform calibration that persists for the duration of use ***/
										/* NOTE:
											This has to be done here after revealing the shell, otherwise all dimensions of display:none nodes register as zero. The other alternative is to require the width and height to be explicit in the style attribute of the nodes.
										*/
										var
											_regViewCoords = _Uize_Dom_Pos.getCoords (m.getNode ()),
											_magImagePortDims = _Uize_Dom_Pos.getDimensions (m._magImagePort.getNode ())
										;
										m._regViewX = _regViewCoords.x;
										m._regViewY = _regViewCoords.y;
										m._magImagePortWidth = _magImagePortDims.width;
										m._magImagePortHeight = _magImagePortDims.height;
										m._magImagePortWidthDivRegViewWidth = m._magImagePortWidth / _regViewWidth;
										m._magImagePortHeightDivRegViewHeight = m._magImagePortHeight / _regViewHeight;

										/*** update the image port (per state that persists during mouse moves) ***/
											m.setNodeStyle (
												'magImagePortShell',
												{
													left:m._regViewX + _regViewWidth,
													top:m._regViewY
												}
											);

										_updateUiCalibrateDuringUse (m);

									_updateUiUrls (m);

									var
										_oldOnmousemove = document.onmousemove,
										_oldOnclick = document.onclick
									;
									function _handleMouseMove () {
										m._eventAbsPos = _Uize_Dom_Pos.getEventAbsPos ();
										if (
											_Uize_Dom_Pos.doRectanglesOverlap (
												m._eventAbsPos.left,m._eventAbsPos.top,1,1,
												m._regViewX,m._regViewY,_regViewWidth,_regViewHeight
											)
										) {
											_updateUiDuringUse (m);
										} else {
											_displayMagUi (_false);
											document.onmousemove = _oldOnmousemove;
											document.onclick = _oldOnclick;
											m._resetMagPowerOnOut &&
												m.set ({_magPower:_getLowestAndNextMagPower (m)._lowestMagPower})
											;
										}
									}
									_handleMouseMove ();
									document.onmousemove = _handleMouseMove;
									document.onclick = function () {
										m._fadeInProgress ||
											m.set ({_magPower:_getLowestAndNextMagPower (m)._nextMagPower})
										;
									};
								}
							);

						_superclass.doMy (m,'wireUi');
					}
				}
				/*?
					DOM Nodes
						See the list of child widgets for other DOM nodes that are not directly controlled by this widget.

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
			},

			stateProperties:{
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
					onChange:function () {_updateUiUrls (this)}
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
					onChange:function () {
						var m = this;
						function _updateAfterMagPowerReflected () {
							m._lastDisplayedMagPower = m._magPower;
							_updateUiUrls (m);

							/*** set the cursor to indicate either zoom in or zoom out ability ***/
								/*
								var _isIe = _Uize_Dom_Basics.isIe;
								m.setNodeStyle (
									'highlight',
									{
										cursor:
											_getLowestAndNextMagPower (m)._nextMagPower > m._magPower
												? (_isIe ? 'url(' + Uize.pathToResources + 'Uize/Node/zoomin.cur)' : '-moz-zoom-in')
												: (_isIe ? 'url(' + Uize.pathToResources + 'Uize/Node/zoomout.cur)' : '-moz-zoom-out')
									}
								);
								*/
						}
						if (_magInUse (m)) {
							var _reflectChangedMagPower = function () {
								_updateUiCalibrateDuringUse (m);
								_updateUiDuringUse (m);
							};
							if (m._fade) {
								var _fade = m._fade;
								_fade.set ({
									startValue:m._lastDisplayedMagPower,
									endValue:m._magPower
								});
								var _fadeEventHandlers = {
									'Changed.value':
										function () {
											m._magPower = +_fade;
											_reflectChangedMagPower ();
										},
									Done:
										function () {
											_fade.unwire (_fadeEventHandlers);
											_updateAfterMagPowerReflected ();
											m._fadeInProgress = _false;
										}
								};
								_fade.wire (_fadeEventHandlers);
								m._fadeInProgress = _true;
								m._fade.start ();
							} else {
								_reflectChangedMagPower ();
								_updateAfterMagPowerReflected ();
							}
						} else {
							_updateAfterMagPowerReflected ();
						}
					}
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
				}
			}
		});
	}
});

