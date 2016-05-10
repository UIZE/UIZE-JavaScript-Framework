/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.CollectionItem.Zooming Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widget.CollectionItem.Zooming= class extends its superclass by adding a zoom and pan behavior that lets the user more closely inspect an item.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.CollectionItem.Zooming',
	required:[
		'Uize.Dom.Basics',
		'Uize.Dom.Pos',
		'Uize.Dom.VirtualEvents.Remain',
		'Uize.Fade'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_true = true,
				_false = false,
				_Uize_Dom_Basics = Uize.Dom.Basics,
				_Uize_Dom_Pos = Uize.Dom.Pos
		;

		/*** Utility Functions ***/
			function _getNodeBorderWidth (_node,_edge) {
				var _stylePropertyPrefix = 'border' + Uize.capFirstChar (_edge);
				return (
					_Uize_Dom_Basics.getStyle (_node,_stylePropertyPrefix + 'Style') == 'none'
						? 0
						: +_Uize_Dom_Basics.getStyle (_node,_stylePropertyPrefix + 'Width').replace (/px/i,'') || 0
				);
			}

		/*** Private Instance Methods ***/
			function _getPreviewZoomUrl (m) {
				var _previewZoomUrl = m._previewZoomUrl;
				return Uize.isFunction (_previewZoomUrl) ? _previewZoomUrl.call (m) : _previewZoomUrl;
			}

			/*** State Updaters for Derived Properties ***/
				function _updatePreviewZoomDisplayed () {
					this.set ({_previewZoomDisplayed:this._inUse && this._zoomPower > 1 && !!this._previewZoomUrl});
					/* NOTE:
						Should really be using _getPreviewZoomUrl method, but this can cause problems when the previewZoomUrl is a function, and the function specified is expecting a non-null value for previewUrl in order to form a URL.
					*/
				}

				function _updatePreviewZoomVisible () {
					this.set ({_previewZoomVisible:this._inUse && this._previewZoomUrlLoaded});
				}

				function _updatePreviewZoomLowResDisplayed () {
					var m = this;
					m.set ({
						_previewZoomLowResDisplayed:
							(m.get ('over') || m._inUse) && m._zoomPower > 1 && !!m._previewZoomUrl
							/* NOTE:
								Should really be using _getPreviewZoomUrl method, but this can cause problems when the previewZoomUrl is a function, and the function specified is expecting a non-null value for previewUrl in order to form a URL.
							*/
					});
				};

				function _updatePreviewZoomLowResVisible () {
					this.set ({_previewZoomLowResVisible:this._inUse && !this._previewZoomUrlLoaded});
				}

				function _updatePreviewZoomUrlLoaded () {
					var
						m = this,
						_previewZoomNode = m.isWired ? m.getNode ('previewZoom') : _false
					;
					m.set ({
						_previewZoomUrlLoaded:
							_previewZoomNode &&
							_previewZoomNode.Uize_Widget_CollectionItem_Zooming_src == _getPreviewZoomUrl (m)
					});
				}

			/*** UI Updaters ***/
				function _updateUiPreviewZoomNodeDisplayed (m,_nodeName,_displayed) {
					if (m.isWired) {
						var _nodeIsHighRes = _nodeName == 'previewZoom';
						if (_displayed) {
							var _previewNode = m.getNode ('preview');

							/*** capture coordinates and dimensions, if necessary ***/
								m._previewShellNodeCoords = _Uize_Dom_Pos.getCoords (
									m.getNode ('previewShell') || (_previewNode ? _previewNode.parentNode : null)
								);

							/*** capture dimensions of preview node ***/
								var _previewNodeDims = m._previewNodeDims = _Uize_Dom_Pos.getDimensions (_previewNode);

								/*** subtract border width for each axis ***/
									_previewNodeDims.width -=
										_getNodeBorderWidth (_previewNode,'left') +
										_getNodeBorderWidth (_previewNode,'right')
									;
									_previewNodeDims.height -=
										_getNodeBorderWidth (_previewNode,'top') +
										_getNodeBorderWidth (_previewNode,'bottom')
									;

							/*** adjust style properties for parent node of previewNode ***/
								var _previewNodeParentNode = _previewNode.parentNode;
								_Uize_Dom_Basics.setStyle (
									_previewNodeParentNode,
									{
										overflow:'hidden',
										height:
											_previewNodeParentNode.offsetHeight -
											_getNodeBorderWidth (_previewNodeParentNode,'top') -
											_getNodeBorderWidth (_previewNodeParentNode,'bottom')
									}
								);

							if (!m.getNode (_nodeName)) {
								m.flushNodeCache (_nodeName);
								var _previewZoomNode = _previewNode.cloneNode (_true);
								_Uize_Dom_Basics.setProperties (
									_previewZoomNode,
									{
										id:m.get ('idPrefix') + '-' + _nodeName,
										title:'' // don't want the browser's tooltip showing when panning around
									}
								);
								/*?
									DOM Nodes
										previewZoom
											A node that is used for displaying the zoomed in preview image.

											If this node does not exist in the document at the time that the zoom in effect for the instance is to be initiated, then it will be automatically cloned from the =preview= DOM node and injected into the =preview= DOM node's parent node, so that it exists as a peer to the =preview= node.

											NOTES
											- see the companion =previewZoomLowRes= DOM node

										previewZoomLowRes
											A node that is used for displaying a low resolution version of the zoomed in preview image.

											If this node does not exist in the document at the time that the zoom in effect for the instance is to be initiated, then it will be automatically cloned from the =preview= DOM node and injected into the =preview= DOM node's parent node, so that it exists as a peer to the =preview= node.

											NOTES
											- see the companion =previewZoom= DOM node
								*/
								_Uize_Dom_Basics.setStyle (
									_previewZoomNode,
									{
										left:0,
										top:0,
										border:'none',
										width:_previewNodeDims.width,
										height:_previewNodeDims.height,
										position:'absolute',
										backgroundImage:''
									}
								);
								_previewNode.parentNode.appendChild (_previewZoomNode);
								(_nodeIsHighRes ? _updateUiPreviewZoomVisible : _updateUiPreviewZoomLowResVisible).call (m);

								/*** wire event handler to watch on loading of high resolution image ***/
									_nodeName == 'previewZoom' &&
										m.wireNode (_nodeName,'load',function () {_updatePreviewZoomUrlLoaded.call (m)})
									;
							}
						}
						m.displayNode (_nodeName,_displayed);
						if (_displayed) {
							var
								_imageUrl = _nodeIsHighRes ? _getPreviewZoomUrl (m) : m._previewUrl,
								_node = m.getNode (_nodeName)
							;
							_imageUrl != _node.Uize_Widget_CollectionItem_Zooming_src && _imageUrl != _node.src &&
								m.setNodeProperties (
									_node,
									{src:_imageUrl,Uize_Widget_CollectionItem_Zooming_src:_imageUrl}
								)
							;
						}
					}
				}

				function _updateUiPreview (m) {
					m.isWired && m._previewUrl && m.setNodeProperties ('preview',{src:m._previewUrl});
				}

				function _updateUiPreviewZoomNodePosition () {
					var m = this;
					if (
						m.isWired && (
							(m._previewZoomLowResDisplayed && m._previewZoomLowResVisible) ||
							(m._previewZoomDisplayed && m._previewZoomVisible)
						)
					) {
						var
							_coords = {},
							_updateCoordsForAxis = function (_axisIsY) {
								var _axisDimName = _axisIsY ? 'height' : 'width';
								_coords [_axisIsY ? 'top' : 'left'] =
									m.get (_axisIsY ? 'alignY' : 'alignX') *
									(
										m._previewShellNodeCoords [_axisDimName] -
										(
											_coords [_axisDimName] =
												m._previewNodeDims [_axisDimName] * m._displayedZoomPower
										)
									)
								;
							}
						;
						_updateCoordsForAxis (0);
						_updateCoordsForAxis (1);
						m.setNodeStyle (m._previewZoomVisible ? 'previewZoom' : 'previewZoomLowRes',_coords);
					}
				}

				function _updateUiPreviewZoomNodeVisible (m,_nodeName,_visible) {
					if (m.isWired) {
						_visible && _updateUiPreviewZoomNodePosition.call (m);
						m.showNode (_nodeName,_visible);
					}
				}

				function _updateUiPreviewZoomLowResVisible () {
					_updateUiPreviewZoomNodeVisible (this,'previewZoomLowRes',this._previewZoomLowResVisible);
				}

				function _updateUiPreviewZoomVisible () {
					_updateUiPreviewZoomNodeVisible (this,'previewZoom',this._previewZoomVisible);
				}


		return _superclass.subclass ({
			omegastructor:function () {
				var m = this;
				m.wire (
					'Changed.over',
					function (_event) {
						if (!_event.newValue) {
							m.isWired && m.unwireNode (document.documentElement,'mousemove');
							m.set ({inUse:_false});
						}
						_updatePreviewZoomLowResDisplayed.call (m);
					}
				);
			},

			instanceMethods:{
				updateUi:function () {
					_updateUiPreview (this);
					_superclass.doMy (this,'updateUi');
				},

				wireUi:function () {
					var m = this;
					if (!m.isWired) {
						var
							_previewNode = m.getNode ('preview'),
							_previewShellNode = m.getNode ('previewShell') || (_previewNode ? _previewNode.parentNode : null)
						;

						/*** set previewUrl from preview node (if it's not already set) ***/
							m._previewUrl || m.set ({_previewUrl:_previewNode.src});

						m.wireNode (
							_previewShellNode,
							Uize.Dom.VirtualEvents.Remain.mouseRest (150),
							function () {
								if (!m.get ('over')) return;
									/* HACK:
										Dragging in Uize.Widget.Collection.Dynamic sets over to false. This hack wouldn't be necessary if mousing down prevented the mouserest event (implemented in Uize.Dom.Basics) being fired, even on subsequent mouse moves.
									*/

								if (m._zoomPower > 1) {
									m.set ({inUse:_true});

									/*** wire up document mousemove event ***/
										var _handleMouseMove = function () {
											var
												_eventAbsPos = _Uize_Dom_Pos.getEventAbsPos (),
												_deadMargin = m._deadMargin
											;
											function _getAlignForAxis (_axisIsY) {
												return (
													Uize.constrain (
														(_eventAbsPos [_axisIsY ? 'top' : 'left'] - (m._previewShellNodeCoords [_axisIsY ? 'y' : 'x'] + _deadMargin)) / (m._previewShellNodeCoords [_axisIsY ? 'height' : 'width'] - _deadMargin * 2),
														0,
														1
													)
												)
											}
											m._previewShellNodeCoords && m.set ({_alignX:_getAlignForAxis (0),_alignY:_getAlignForAxis (1)});
										};
										_handleMouseMove ();
										m.wireNode (document.documentElement,'mousemove',_handleMouseMove);
								}
							}
						);

						_superclass.doMy (m,'wireUi');
					}
				}
			},

			stateProperties:{
				_alignX:{
					name:'alignX',
					onChange:_updateUiPreviewZoomNodePosition,
					value:0
					/*?
						State Properties
							alignX
								A floating point number in the range of =0= to =1=, representing the horizontal alignment of the zoomed in image.

								A value of =0= indicates that the zoomed in image is aligned so that its leftmost side is visible, a value of =1= indicates that the zoomed in image is aligned so that its rightmost side is visible, and a value of =.5= indicates that the zoomed in image is aligned so that its center horizontally is visible. The value of this property is automatically updated during user interaction with the instance (i.e. when the =inUse= state property is set to =true=).

								NOTES
								- the initial value is =0=
								- see the companion =alignY= state property
								- see the related =inUse= state property
					*/
				},
				_alignY:{
					name:'alignY',
					onChange:_updateUiPreviewZoomNodePosition,
					value:0
					/*?
						State Properties
							alignY
								A floating point number in the range of =0= to =1=, representing the vertical alignment of the zoomed in image.

								A value of =0= indicates that the zoomed in image is aligned so that its topmost side is visible, a value of =1= indicates that the zoomed in image is aligned so that its bottommost side is visible, and a value of =.5= indicates that the zoomed in image is aligned so that its center vertically is visible. The value of this property is automatically updated during user interaction with the instance (i.e. when the =inUse= state property is set to =true=).

								NOTES
								- the initial value is =0=
								- see the companion =alignX= state property
								- see the related =inUse= state property
					*/
				},
				_deadMargin:{
					name:'deadMargin',
					value:20
					/*?
						State Properties
							deadMargin
								An integer, specifying the thickness of the margin at the edges of the preview image where moving the mouse will produce no change in the values of either - or both - of the =alignX= and =alignY= state properties.

								When the =deadMargin= property is set to a value greater than =0=, there will be a dead margin around the edges of the preview image. When the mouse moves into this dead margin, further mouse movements may produce no change in the values of the =alignX= and =alignY= state properties. In other words, panning may be inactive inside this margin. When inside the horizontal dead margin (near the left and right edges), horizontal panning becomes inactive. Similarly, when inside the vertical dead margin (near the top and bottom edges), vertical panning becomes inactive.

								The purpose of the dead margin is to allow the user to pan horizontally and vertically around the zoomed in image without having to move the mouse perilously close to the edge of the preview image and risk snapping out of the zoomed in experience because the mouse accidentally moves outside of the preview image. When there is a dead margin set, the effective region for controlling the panning is smaller than the actual preview image port, by twice the amount of the =deadMargin= property's value - for each axis.

								The value that you set for this property should consider the dexterity and mouse coordination ability of a typical user. That said, for smaller preview images it may be necessary to lower the value of this property, so that the active region isn't so small that tiny mouse movements produce large panning movements.

								NOTES
								- the initial value is =20=
					*/
				},
				_displayedZoomPower:{
					name:'displayedZoomPower',
					onChange:_updateUiPreviewZoomNodePosition,
					value:1
					/*?
						State Properties
							displayedZoomPower
								A read-only floating point number, in the range of =1= to the value of the =zoomPower= state property, indicating the currently displayed zoom power.

								When the zoom in effect is initiated, the value of this property will be faded from =1= to the value of the =zoomPower= state property, over the duration specified by the =duration= property of the =zoomFadeProperties= object.

								NOTES
								- the initial value is =1=
								- this property is read-only
								- see the related =showingPreview= state property
					*/
				},
				_inUse:{
					name:'inUse',
					onChange:[
						_updatePreviewZoomVisible,
						_updatePreviewZoomDisplayed,
						_updatePreviewZoomLowResVisible,
						_updatePreviewZoomLowResDisplayed,
						function () {
							var m = this;

							if (m.isWired) {
								if (m._inUse) {
									var _previewZoomUrl = _getPreviewZoomUrl (m);
									if (_previewZoomUrl) {
										if (m._zoomPower > 1) {
											m._zoomShown = _true;

											/*** initiate zoom in fade ***/
												/*** create and set up fade instance (if not already created) ***/
													m._fade ||
														(m._fade = Uize.Fade ()).wire (
															'Changed.value',
															function (_event) {m.set ({_displayedZoomPower:_event.newValue})}
														)
													;

												m._fade.start (
													Uize.copyInto (
														{startValue:1,endValue:m._zoomPower},
														m._zoomFadeProperties
													)
												);
										} else {
											m.setNodeProperties ('preview',{src:_previewZoomUrl});
										}
										m.set ({_showingPreview:_true});
									}
								} else {
									if (m._zoomShown) {
										m._fade.stop ();
										m.set ({_displayedZoomPower:1});
										m._zoomShown = _false;
									} else {
										_updateUiPreview (m);
									}
									m.set ({_showingPreview:_false});
								}
							}
						}
					],
					value:_false
					/*?
						State Properties
							inUse
								A boolean, indicating whether or not the zoom in effect is in use.

								When the user rests their mouse over the instance's preview and triggers the zoom in effect, the value of this property will change to =true=. The value of this property may also be programmatically set to =true= in order to initiate the zoom in effect.

								NOTES
								- the initial value is =false=
								- see the related =showingPreview= state property
					*/
				},
				_previewUrl:{
					name:'previewUrl',
					onChange:[
						_updatePreviewZoomUrlLoaded,
						function () {_updateUiPreview (this)}
					]
					/*?
						State Properties
							previewUrl
								A string, specifying the URL for the preview image.

								If the value of this property is =undefined=, =null=, or =''= (an empty string) at the time that the instance is wired up, then its value will be set automatically from the value of the =src= property of the =preview= DOM node. When the value of this property is changed and the instance is wired, the UI of the instance will be updated to reflect the new value.

								NOTES
								- the initial value is =undefined=
								- see the companion =previewZoomUrl= state property
					*/
				},
				_previewZoomUrl:{
					name:'previewZoomUrl',
					onChange:[_updatePreviewZoomDisplayed,_updatePreviewZoomLowResDisplayed]
					/*?
						State Properties
							previewZoomUrl
								A string or function, specifying the URL of the image that should be used for the zoomed in preview.

								When a function reference is specified for this property, then the function will be called as an instance method on the instance, each time before the zoom in effect is initiated. This gives the function the opportunity to calculate a URL based upon the state of the instance - especially the value of the =previewUrl= state property, which may have been modified since the last time that the zoom in effect was initiated. Consider the following example...

								EXAMPLE
								....................................................................................
								page.addChild (
									'collectionItem',
									Uize.Widget.CollectionItem.Zooming,
									{
										previewZoomUrl:
											function () {return this.get ('previewUrl').replace ('100x100','250x250')},
										zoomPower:2.5
									}
								);
								....................................................................................

								In the above example, the zoomed in preview URL is being derived from the value of the =previewUrl= state property. By specifying a function for =previewZoomUrl=, the code that derives the zoomed in preview URL will be executed each time the zoom in effect is initiated. In this case, the code is expecting the value of the =previewUrl= property to always contain the dimensions string ='100x100'=, which is replaced with the string ='250x250'= to produce the URL for the zoomed in preview.

								NOTES
								- the initial value is =undefined=
								- see the companion =previewUrl= state property
					*/
				},
				_showingPreview:{
					name:'showingPreview',
					value:_false
					/*?
						State Properties
							showingPreview
								A read-only boolean, indicating whether or not the zoomed in preview is being shown.

								NOTES
								- the initial value is =false=
								- this property is read-only
								- see the related =displayedZoomPower= and =inUse= state properties
					*/
				},
				_zoomPower:{
					name:'zoomPower',
					onChange:[_updatePreviewZoomDisplayed,_updatePreviewZoomLowResDisplayed],
					value:1
					/*?
						State Properties
							zoomPower
								A floating point number, specifying the number of times larger the zoomed in image is than the normal preview.

								A NOTE ON RESIZING

								Ideally, for whatever value is specified for this property, the image specified by the =previewZoomUrl= state property should be the same number of times bigger than the image specified by the =previewUrl= state property.

								So, for example, if =zoomPower= is set to the value =2=, and if the image specified by the =previewUrl= property has dimensions of 200x150, then the image specified by =previewZoomUrl= should ideally be 400x300. When this is not the case, then the browser will be scaling the zoomed in image to dimensions that are not its natural dimensions, and the quality of the shrinking or stretching will depend on the image resizing mechanism of the browser. Some browsers do a better job than others, but resizing done in the browser never looks all that great in the best of cases.

								NOTES
								- the initial value is =1=
								- when a value of =1= (the initial value) is specified for this property, there will be no zoom in effect when the user interacts with the instance
					*/
				},
				_zoomFadeProperties:{
					name:'zoomFadeProperties',
					value:{duration:600,curve:Uize.Fade.celeration (0,1)}
					/*?
						State Properties
							zoomFadeProperties
								An object, specifying properties that should be used for the =Uize.Fade= instance that drives the zoom in effect's animation.

								The properties of the =zoomFadeProperties= object can be any of the state properties supported by the =Uize.Fade= class. For example, if you wanted a zoom in animation that had some bounce, then you could specify a value for this property that was an object with a =curve= property whose value was a curve function, as in the following example...

								EXAMPLE
								....................................................................................
								page.addChild (
									'collectionItem',
									Uize.Widget.CollectionItem.Zooming,
									{
										previewZoomUrl:
											function () {return this.get ('previewUrl').replace ('100x100','250x250')},
										zoomPower:2.5,
										zoomFadeProperties:{
											curve:Uize.Curve.Rubber.easeOutBounce (),
											duration:1000
										}
									}
								);
								....................................................................................

								NOTES
								- the initial value is ={duration:600,curve:Uize.Fade.celeration (0,1)}=
					*/
				},

				/*** Private State Properties ***/
					_previewZoomUrlLoaded:{ // whether or not the previewZoomUrl image is loaded in previewZoom node
						onChange:[_updatePreviewZoomVisible,_updatePreviewZoomLowResVisible],
						value:_false
					},
					_previewZoomDisplayed:{ // whether or not the previewZoom node should be displayed
						onChange:function () {
							_updateUiPreviewZoomNodeDisplayed (this,'previewZoom',this._previewZoomDisplayed);
						},
						value:_false
					},
					_previewZoomVisible:{ // whether or not the previewZoom node should be visible
						onChange:_updateUiPreviewZoomVisible,
						value:_false
					},
					_previewZoomLowResDisplayed:{ // whether or not the previewZoomLowRes node should be displayed
						onChange:function () {
							_updateUiPreviewZoomNodeDisplayed (this,'previewZoomLowRes',this._previewZoomLowResDisplayed);
						},
						value:_false
					},
					_previewZoomLowResVisible:{ // whether or not the previewZoomLowRes node should be visible
						onChange:_updateUiPreviewZoomLowResVisible,
						value:_true
					}
			}
		});
	}
});

