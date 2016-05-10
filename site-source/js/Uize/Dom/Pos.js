/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Dom.Pos Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2004-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 6
	codeCompleteness: 95
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Dom.Pos= module provides a set of methods for working with positioning and coordinates of DOM nodes.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Dom.Pos',
	required:'Uize.Dom.Basics',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,
				_Uize = Uize,
				_Math = Math,
				_Uize_Dom_Basics = Uize.Dom.Basics,

			/*** references to static methods and properties used internally ***/
				_getCoords,
				_setCoords,
				_getDimensions,
				_setAbsPos,
				_getEventAbsPos,
				_getDocumentScrollElement,
				_doRectanglesOverlap,

				/*** features pulled in from Uize.Dom.Basics ***/
					_getStyle = _Uize_Dom_Basics.getStyle,
					_doForAll = _Uize_Dom_Basics.doForAll,
					_getById = _Uize_Dom_Basics.getById,
					_isNode = _Uize_Dom_Basics.isNode,
					_isIe = _Uize_Dom_Basics.isIe,
					_setStyle = _Uize_Dom_Basics.setStyle,

			/*** variables for setCoords method ***/
				_coordNames = ['left','top','width','height']
		;

		return _Uize.package ({
			getDocumentScrollElement:_getDocumentScrollElement = function () {
				return document [_Uize_Dom_Basics.isSafari ? 'body' : 'documentElement']
				/*?
					Static Methods
						Uize.Dom.Pos.getDocumentScrollElement
							A utility function that returns the DOM node on which you can scroll the document.

							SYNTAX
							.........................................
							Uize.Dom.Pos.getDocumentScrollElement ();
							.........................................

							This method abstracts the difference between WebKit browsers (Safari, Chrome, etc.) and other browsers as to which DOM node is the one that allows changing the scrolling position of the document.

							EXAMPLE
							.........................................................................................
							Uize.Dom.Pos.getDocumentScrollElement ().scrollTop = 0;  // scroll to the top of the page
							.........................................................................................
				*/
			},

			doRectanglesOverlap:_doRectanglesOverlap = function (
				_aLeft,_aTop,_aWidth,_aHeight,_bLeft,_bTop,_bWidth,_bHeight
			) {
				return (
					_aWidth - 1 + +_aLeft >= _bLeft && _bWidth - 1 + +_bLeft >= _aLeft &&
					_aHeight - 1 + +_aTop >= _bTop && _bHeight - 1 + +_bTop >= _aTop
				);
				/*?
					Static Methods
						Uize.Dom.Pos.doRectanglesOverlap
							Returns a boolean, indicating whether or not the rectangles specified by the two coordinate sets overlap one another. Two rectangles are considered to overlap if any part of either rectangle is contained by the other.

							SYNTAX
							.................................................................
							rectanglesOverlapBOOL = Uize.Dom.Pos.doRectanglesOverlap (
								aLeftPixelsINT,aTopPixelsINT,aWidthPixelsINT,aHeightPixelsINT,
								bLeftPixelsINT,bTopPixelsINT,bWidthPixelsINT,bHeightPixelsINT
							);
							.................................................................

							TEST FOR OVERLAPPING LINES

							To use this method to test if two lines overlap (rather than two rectangles), you can use dummy values for one of the axes, as in...

							.....................................................
							linesOverlapBOOL = Uize.Dom.Pos.doRectanglesOverlap (
								aPosINT,0,aDimINT,1,bPosINT,0,bDimINT,1
							);
							.....................................................

							By specifying =0= for both the =aTopPixelsINT= and =bTopPixelsINT= parameters, and =1= for both the =aHeightPixelsINT= and =bHeightPixelsINT= parameters, you are essentially guaranteeing that the two rectangles overlap on the vertical axis (since their vertical coordinates are identical), and this has the effect of making the vertical test redundant, so the horizontal values can then be used to test for overlapping of two line segments.

							Of course, you can use this technique to test for overlapping of any two line segments - it doesn't matter if those lines are from a vertical or horizontal axis, since we've collapsed a test in 2D space to being a test in 1D space.

							NOTES
							- any parameter of this method can be an object that implements a =valueOf= interface (such as an instance of a =Uize.Class= subclass that implements the =value= state property)
				*/
			},

			getCoords:_getCoords = function (_node) {
				var
					_x = 0,
					_y = 0,
					_width = 0,
					_height = 0,
					_seen = true,
					_percentSeen = 100,
					_documentElement = _getDocumentScrollElement (),
					_windowDims = _getDimensions (window)
				;
				function _factorInDocScroll () {
					_x += (window.pageXOffset || _documentElement.scrollLeft);
					_y += (window.pageYOffset || _documentElement.scrollTop);
				}
				if (_node == window) {
					_factorInDocScroll ();
					_width = _windowDims.width;
					_height = _windowDims.height;
				} else if (_isNode (_node = _getById (_node))) {
					/*** calculate dimensions ***/
						_width = _node.offsetWidth;
						_height = _node.offsetHeight;
						if (!(_width && _height) && _node.tagName == 'DIV') {
							/* NOTE:
								This is a workaround to handle the fact that a container DIV may report offset dimensions of 0, even though it contain many child nodes.
							*/
							for (
								var _childNodes = _node.childNodes, _childNodeNo = _childNodes.length;
								--_childNodeNo >= 0;
							) {
								if (_childNodes [_childNodeNo].nodeName.charAt (0) != '#') {
									var _childCoords = _getCoords (_childNodes [_childNodeNo]);
									if (_childCoords.width || _childCoords.height) {
										_width = _Math.max (_width,_childCoords.right - _x + 1);
										_height = _Math.max (_height,_childCoords.bottom - _y + 1);
									}
								}
							}
						}

					if (_node.tagName == 'A' && _node.childNodes.length == 1 && _node.childNodes [0].tagName == 'IMG')
						/* NOTE:
							this is a workaround for Mozilla, which doesn't seem to be able to give reliable values for determining coordinates of links that fully enclose IMG tags. In such cases, using the child IMG tag for determining coordinates is reliable. This workaround has no negative effect in IE, so it is not conditionalized
						*/
						_node = _node.childNodes [0]
					;
					var
						 _nodeHidden = function (_node) {
							return _getStyle (_node,'display') == 'none' || _getStyle (_node,'visibility') == 'hidden';
						},
						_nodeVisible = _seen = !_nodeHidden (_node),
						_offsetParent = _node,
						_currentNode = _node,
						_windowWidth = _windowDims.width,
						_windowHeight = _windowDims.height,
						_documentElementScrollLeft = _documentElement.scrollLeft,
						_documentElementScrollTop = _documentElement.scrollTop,
						_documentElementRight = _documentElementScrollLeft + _windowWidth,
						_documentElementBottom = _documentElementScrollTop + _windowHeight
					;
					while (_currentNode.parentNode && typeof _currentNode.parentNode != 'unknown') {
						var
							_currentNodeOffsetLeft = _currentNode.offsetLeft || 0,
							_currentNodeOffsetTop = _currentNode.offsetTop || 0,
							_currentNodeOffsetWidth = _currentNode.offsetWidth,
							_currentNodeOffsetHeight = _currentNode.offsetHeight
						;
						if (_seen && _nodeHidden (_currentNode))
							_seen = false
						;
						if (_currentNode == _offsetParent) {
							_x += _currentNodeOffsetLeft + (parseInt (_getStyle (_currentNode,'borderLeftWidth')) || 0);
							_y += _currentNodeOffsetTop + (parseInt (_getStyle (_currentNode,'borderTopWidth')) || 0);
							_offsetParent = _currentNode.offsetParent;
							_getStyle (_currentNode,'position') == 'fixed' &&
								_factorInDocScroll ()
							;
						}
						if (
							_currentNode != _node &&
							_currentNode != document.body &&
							_currentNode != document.documentElement &&
							(
								_currentNode.scrollWidth > _currentNodeOffsetWidth ||
								_currentNode.scrollHeight > _currentNodeOffsetHeight
								/* NOTE:
									it's not just for container nodes that are scrolled, but also container nodes that are scrollable (that's where the scrollWidth is greater than the offsetWidth)
								*/
							)
						) {
							_x -= _currentNode.scrollLeft;
							_y -= _currentNode.scrollTop;
							if (_isIe) {
								_x += _currentNode.clientLeft;
								_y += _currentNode.clientTop;
							}
							if (_seen)
								_seen = _doRectanglesOverlap (
									_x,_y,_width,_height,
									_currentNodeOffsetLeft,_currentNodeOffsetTop,_currentNodeOffsetWidth,_currentNodeOffsetHeight
								)
							;
						}

						// handle the 2d components of the translate (and related) properties
						var
							_style = _currentNode.style,
							_transformStyle = _style.transform || _style.webkitTransform
							;
						if (_transformStyle) {
							var _components = _transformStyle.toLowerCase().replace(/ /g, '').match(/(translate[a-z0-9]*)\((-?[0-9a-z\.]+),?(-?[0-9a-z\.]+)?.*?\)/);
							if (_components !== null)
								switch (_components[1]) {
									case 'translate':
									case 'translate3d':
										_x += parseInt(_components[2]);
										_y += parseInt(_components[3]);
										break;
									case 'translatex':
										_x += parseInt(_components[2]);
										break;
									case 'translatey':
										_y += parseInt(_components[2]);
										break;
								}
						}

						_currentNode = _currentNode.parentNode;
					}

					/*** test if node is in portion of document scrolled into view ***/
						if (_seen)
							_seen = _doRectanglesOverlap (
								_x,_y,_width,_height,
								_documentElementScrollLeft,_documentElementScrollTop,_windowWidth,_windowHeight
							)
						;

						// if the node is seen, calculate how much of its area is seen
						_percentSeen = _seen ?
							((_Math.min (_x + _width, _documentElementRight) - _Math.min (_Math.max (_x, _documentElementScrollLeft), _documentElementRight))
								* (_Math.min (_y + _height, _documentElementBottom) - _Math.min (_Math.max (_y, _documentElementScrollTop), _documentElementBottom)))
								/ (_width * _height)
								* 100 :
							0
						;
				}
				return {
					x:_x,
					y:_y,
					width:_width,
					height:_height,
					area:_width * _height,
					left:_x,
					top:_y,
					right:_x + _width - 1,
					bottom:_y + _height - 1,
					seen:_seen,
					percentSeen:_percentSeen
				};
				/*?
					Static Methods
						Uize.Dom.Pos.getCoords
							Returns an object, representing the coordinates of the specified node, relative to the top left of the document.

							SYNTAX
							......................................................
							nodeCoordsOBJ = Uize.Dom.Pos.getCoords (nodeSTRorOBJ);
							......................................................

							RETURN
							............................
							{
								x : xPixelsINT,
								y : yPixelsINT,
								width : widthPixelsINT,
								height : heightPixelsINT,
								area : areaPixelsINT,
								left : leftPixelsINT,
								top : topPixelsINT,
								right : rightPixelsINT,
								bottom : bottomPixelsINT,
								seen : seenBOOL
							}
							............................

							The "x" and "left" properties of the return object are equivalent, as are the "y" and "top" properties.

							NOTES
							- compare to the =Uize.Dom.Pos.getDimensions= static method
				*/
			},

			getDimensions:_getDimensions = function (_node) {
				if (_node == window) {
					var _documentElement = document.documentElement;
					return {
						width:window.innerWidth || _documentElement.clientWidth || _documentElement.offsetWidth,
						height:window.innerHeight || _documentElement.clientHeight || _documentElement.offsetHeight
					};
				} else if (_node = _getById (_node)) {
					return {
						width:_node.offsetWidth || parseInt (_getStyle (_node,'width')) || 0,
						height:_node.offsetHeight || parseInt (_getStyle (_node,'height')) || 0
					};
				} else {
					return {width:0,height:0};
				}
				/*?
					Static Methods
						Uize.Dom.Pos.getDimensions
							Returns an object, containing =width= and =height= properties that reflect the displayed dimensions for the specified node.

							SYNTAX
							........................................................
							nodeDimsOBJ = Uize.Dom.Pos.getDimensions (nodeSTRorOBJ);
							........................................................

							RETURN VALUE
							................
							{
								width : INT,
								height : INT
							}
							................
				*/
			},

			setCoords:_setCoords = function (_nodeBlob,_coords) {
				_setStyle (_nodeBlob,_Uize.isArray (_coords) ? _Uize.meldKeysValues (_coordNames,_coords) : _coords);
				/*?
					Static Methods
						Uize.Dom.Pos.setCoords
							Sets the left, top, width, and height coordinates for the specified `node blob`.

							SYNTAX
							...................................................
							Uize.Dom.Pos.setCoords (nodeBLOB,coordsARRAYorOBJ);
							...................................................

							The =coordsARRAYorOBJ= parameter can be an object of the form...

							...........................................
							{
								left: leftINTorSTRorOBJ,     // optional
								top: topINTorSTRorOBJ,       // optional
								width: widthINTorSTRorOBJ,   // optional
								height: heightINTorSTRorOBJ  // optional
							}
							...........................................

							...or an array of the form...

							...........................................................................
							[leftINTorSTRorOBJ,topINTorSTRorOBJ,widthINTorSTRorOBJ,heightINTorSTRorOBJ]
							...........................................................................

							...or...

							....................................
							[leftINTorSTRorOBJ,topINTorSTRorOBJ]
							....................................

							When number type values are specified for =leftINTorSTRorOBJ=, =topINTorSTRorOBJ=, =widthINTorSTRorOBJ=, or =heightINTorSTRorOBJ=, those values will be converted to strings by appending the "px" unit. When string type values are specified, the unit should already be present in the value. =Uize.Class= subclass instances can also be specified, and they will be converted to values by invoking their =valueOf Intrinsic Method=.

							EXAMPLES
							..........................................................................................
							// just left and top coordinates

							Uize.Dom.Pos.setCoords ('nodeId',[0,0]);
							Uize.Dom.Pos.setCoords ('nodeId',['0px','0px']);
							Uize.Dom.Pos.setCoords ('nodeId',[sliderL,sliderT]);
							Uize.Dom.Pos.setCoords ('nodeId',{left:0,top:0});
							Uize.Dom.Pos.setCoords ('nodeId',{left:'0px',top:'0px'});
							Uize.Dom.Pos.setCoords ('nodeId',{left:sliderL,top:sliderT});


							// left, top, width, and height

							Uize.Dom.Pos.setCoords ('nodeId',[0,0,200,100]);
							Uize.Dom.Pos.setCoords ('nodeId',['0px','0px','200px','100px']);
							Uize.Dom.Pos.setCoords ('nodeId',[sliderL,sliderT,sliderW,sliderH]);
							Uize.Dom.Pos.setCoords ('nodeId',{left:0,top:0,width:200,height:100});
							Uize.Dom.Pos.setCoords ('nodeId',{left:'0px',top:'0px',width:'200px',height:'100px'});
							Uize.Dom.Pos.setCoords ('nodeId',{left:sliderL,top:sliderT,width:sliderW,height:sliderH});


							// just width and height

							Uize.Dom.Pos.setCoords ('nodeId',{width:200,height:100});
							Uize.Dom.Pos.setCoords ('nodeId',{width:'200px',height:'100px'});
							Uize.Dom.Pos.setCoords ('nodeId',{width:sliderW,height:sliderH});
							..........................................................................................

							In the above example, =sliderL=, =sliderT=, =sliderW=, and =sliderH= are instances of the =Uize.Widget.Bar.Slider= class.

							NOTES
							- this method can operate on multiple nodes at a time. For more details, see the section on `node blob`
							- see also the =Uize.Dom.Pos.getCoords= static method
				*/
			},

			centerInWindow:function (_nodeBlob) {
				var _windowCoords = _getCoords (window);
				_doForAll (
					_nodeBlob,
					function (_node) {
						var _nodeDims = _getDimensions (_node);
						_setCoords (
							_node,
							{
								left:_windowCoords.x + ((_windowCoords.width - _nodeDims.width) >> 1),
								top:_windowCoords.y + ((_windowCoords.height - _nodeDims.height) >> 1)
							}
						);
					}
				);
				/*?
					Static Methods
						Uize.Dom.Pos.centerInWindow
							Positions the specified absolutely positioned node (or `node blob`) to be centered in the window.

							SYNTAX
							.......................................
							Uize.Dom.Pos.centerInWindow (nodeBLOB);
							.......................................

							This method can be useful for positioning dialogs, loading indicator overlays, splashscreens, etc.

							NOTES
							- this method can operate on multiple nodes at a time. For more details, see the section on `node blob`
							- nodes centered using this method should be absolutely positioned and should not be set to =display:none= at the time of being centered
				*/
			},

			getEventAbsPos:_getEventAbsPos = function (_eventOrPosObj) {
				var _targetTouches = (_eventOrPosObj || (_eventOrPosObj = _Uize_Dom_Basics.mousePos)).targetTouches;
				if (_targetTouches && _targetTouches.length)
					_eventOrPosObj = _targetTouches [0]
				;
				if (_eventOrPosObj.pageX != _undefined) {
					return {left:_eventOrPosObj.pageX,top:_eventOrPosObj.pageY};
				} else {
					var _documentElement = _getDocumentScrollElement ();
					return {
						left:_eventOrPosObj.clientX + _documentElement.scrollLeft,
						top:_eventOrPosObj.clientY + _documentElement.scrollTop
					};
				}
				/*?
					Static Methods
						Uize.Dom.Pos.getEventAbsPos
							Returns an object, representing the coordinates of the specified DOM event, relative to the top left of the document.

							SYNTAX
							...........................................................
							eventAbsPosOBJ = Uize.Dom.Pos.getEventAbsPos (domEventOBJ);
							...........................................................

							RETURN
							........................
							{
								left : leftPixelsINT,
								top : topPixelsINT
							}
							........................

							VARIATION
							................................................
							eventAbsPosOBJ = Uize.Dom.Pos.getEventAbsPos ();
							................................................

							When no =domEventOBJ= parameter is specified, this method returns the absolute coordinates for the mouse's current position. This is useful, because sometimes the reference to an initiating DOM event might get lost through multiple layers of handler code in your application. In such cases, this variation provides a fallback for getting the current mouse coordinates for use in positioning popups, dialogs, etc.
				*/
			},

			setAbsPos:_setAbsPos = function (_nodeBlob,_absPos,_coordMargin) {
				_coordMargin = typeof _coordMargin == 'number'
					? {x:_coordMargin,y:_coordMargin}
					: (_coordMargin || {x:0,y:0})
				;
				var
					_documentElement = _getDocumentScrollElement (),
					_viewDims = _getDimensions (window)
				;
				_doForAll (
					_nodeBlob,
					function (_node) {
						function _getAxisConstrainedPos (_posName,_scrollPosName,_dimName,_axisName) {
							var
								_absPosForAxis = _absPos [_posName],
								_coordMarginForAxis = _coordMargin [_axisName],
								_preferredViewPos = _absPosForAxis - _documentElement [_scrollPosName],
								_coordsMarginPlusNodeDim = _coordMarginForAxis + _nodeDims [_dimName]
							;
							return (
								_absPosForAxis +
								(
									_preferredViewPos + _coordsMarginPlusNodeDim > _viewDims [_dimName]
										? _Math.max (-_coordsMarginPlusNodeDim,-_preferredViewPos)
										: _coordMarginForAxis
								)
							);
						}
						var _nodeDims = _getDimensions (_node);
						_setStyle (
							_node,
							{
								left:_getAxisConstrainedPos ('left','scrollLeft','width','x'),
								top:_getAxisConstrainedPos ('top','scrollTop','height','y'),
								right:'auto',
								bottom:'auto'
							}
						);
					}
				);
				/*?
					Static Methods
						Uize.Dom.Pos.setAbsPos
							Positions the specified absolutely positioned node (or `node blob`) to be adjacent to the specified absolute position coordinates.

							SYNTAX
							................................................................
							Uize.Dom.Pos.setAbsPos (nodeBLOB,absPosOBJ,coordMarginINTorOBJ);
							................................................................

							This method is useful for displaying an absolutely positioned node adjacent to absolute position coordinates, in such a way that the node being positioned is kept within view in the browser window. This comes in handy, for example, when positioning tooltips that track the mouse cursor position. If the default positioning of the node causes some part of it to fall out of view in a given axis, then its position will be flipped to the other side of the absolute position coordinate for that axis, according to the `flipping behavior` described below.

							The absPosOBJ Parameter
								The =absPosOBJ= parameter specifies the center of the region, adjacent to which the node should be positioned.

								The value of this parameter should be an object of the form...

								........................
								{
									left : leftPixelsINT,
									top : topPixelsINT
								}
								........................

							The coordMarginINTorOBJ Parameter
								The optional =coordMarginINTorOBJ= parameter specifies a margin around the coordinates specified in the =absPosOBJ= parameter that should be avoided when positioning the node.

								This parameter is useful for positioning tooltips that should track the cursor position and that should avoid obscuring - or being obscured by - the cursor pointer. The value of this parameter should be either an integer that specifies a margin for both the x and y axes, or an object of the form...

								........................
								{
									x : xMarginPixelsINT,
									y : yMarginPixelsINT
								}
								........................

							Combining absPosOBJ and coordMarginINTorOBJ
								Essentially, the combination of the =absPosOBJ= and =coordMarginINTorOBJ= parameters defines a region, adjacent to which the node should be positioned, and that should be avoided when positioning the node, and where the margin specified by the =coordMarginINTorOBJ= parameter extends the region to either side of the point specified by the =absPosOBJ= paramter on each axis, by the number of pixels specified for each axis in the =coordMarginINTorOBJ= parameter.

							Flipping Behavior
								By default, this method will first try to position the node so that its top edge butts up against the bottom edge of the region defined by the combination of the =absPosOBJ= and =coordMarginINTorOBJ= parameters, and so that its left edge butts up against this region's right edge.

								If, with this positioning, the node is not fully in view vertically, then its position will be flipped on the y axis so that its bottom edge butts up against the top edge of the region. And if, with this positioning, the node is not fully in view horizontally, then its position will be flipped about on the x axis so that its right edge butts up against the left edge of the region.

							VARIATION
							............................................
							Uize.Dom.Pos.setAbsPos (nodeBLOB,absPosOBJ);
							............................................

							When the optional =coordMarginINTorOBJ= parameter is not specified, then its value will be defaulted to ={x:0,y:0}=.

							NOTES
							- compare to the =Uize.Dom.Pos.setAbsPosAdjacentTo= static method
				*/
			},

			setAbsPosAdjacentTo:function (_nodeBlob,_referenceNode,_pivotAxis) {
				_referenceNode = _getById (_referenceNode);
				var
					_referenceNodeCoords = _getCoords (_referenceNode),
					_referenceNodeWidthDiv2 = _referenceNodeCoords.width / 2,
					_referenceNodeHeightDiv2 = _referenceNodeCoords.height / 2,
					_pivotSign = _pivotAxis == 'x' ? -1 : 1
				;
				if (!_referenceNodeWidthDiv2 && !_referenceNodeHeightDiv2)
					_referenceNodeCoords = _getEventAbsPos ()
				;
				_doForAll (
					_nodeBlob,
					function (_node) {
						_setAbsPos (
							_node,
							{
								left:_referenceNodeCoords.left + _referenceNodeWidthDiv2,
								top:_referenceNodeCoords.top + _referenceNodeHeightDiv2
							},
							{x:-_referenceNodeWidthDiv2 * _pivotSign,y:_referenceNodeHeightDiv2 * _pivotSign}
						);
					}
				);
				/*?
					Static Methods
						Uize.Dom.Pos.setAbsPosAdjacentTo
							Positions the specified absolutely positioned node (or `node blob`) to be adjacent to the specified reference node.

							SYNTAX
							..........................................................................
							Uize.Dom.Pos.setAbsPosAdjacentTo (nodeBLOB,referenceNodeOBJ,pivotAxisSTR);
							..........................................................................

							This method is useful for displaying an absolutely positioned node adjacent to a reference node, in such a way that the node being positioned is kept within view in the browser window. This comes in handy for positioning tooltips, droplists, popup palettes, etc. If the default positioning of the node causes some part of it to fall out of view, then the position will be flipped to the other side of the reference node on the specified pivot axis.

							Y Pivot Axis
								When the value ='y'= is specified for the =pivotAxisSTR= parameter, then this method will first try to position the node so that its top edge butts up against the bottom edge of the reference node, and so that its left edge is aligned with the left edge of the reference node. If the node being positioned is not fully in view vertically, then its position will be flipped about the y pivot axis so that its bottom edge butts up against the top edge of the reference node. If the node being positioned is not fully in view horizontally, then its position will be flipped about on the x axis so that its right edge is aligned with the right edge of the reference node. The y pivot axis mode is useful for droplists / dropdown menus.

							X Pivot Axis
								When the value ='x'= is specified for the =pivotAxisSTR= parameter, then this method will first try to position the node so that its left edge butts up against the right edge of the reference node, and so that its top edge is aligned with the top edge of the reference node. If the node being positioned is not fully in view horizontally, then its position will be flipped about the x pivot axis so that its right edge butts up against the left edge of the reference node. If the node being positioned is not fully in view vertically, then its position will be flipped about on the y axis so that its bottom edge is aligned with the bottom edge of the reference node. The x pivot axis mode is useful for submenus of a dropdown menu, or for the top level menus of a vertically arranged menu.

							VARIATION 1
							.............................................................
							Uize.Dom.Pos.setAbsPosAdjacentTo (nodeBLOB,referenceNodeOBJ);
							.............................................................

							When the optional =pivotAxisSTR= parameter is not specified, then its value will be defaulted to ='y'=.

							VARIATION 2
							............................................
							Uize.Dom.Pos.setAbsPosAdjacentTo (nodeBLOB);
							............................................

							When only the =nodeBLOB= parameter is specified, then the current absolute position of the mouse cursor will be used as the reference point for positioning, and the =pivotAxisSTR= parameter will be defaulted to ='y'=.

							NOTES
							- when the value of the =referenceNodeOBJ= parameter is =null=, =undefined=, or is a string value representing the id for a node that is not in the document, or if the node is not displayed when this method is called and its dimensions are reported as 0x0, then this method will use the current absolute position of the mouse cursor as the reference point for positioning
							- compare to the =Uize.Dom.Pos.setAbsPos= static method
				*/
			}
		});
	}
});

