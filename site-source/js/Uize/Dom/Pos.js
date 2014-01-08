/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Dom.Pos Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2004-2014 UIZE
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
			},

			doRectanglesOverlap:_doRectanglesOverlap = function (
				_aLeft,_aTop,_aWidth,_aHeight,_bLeft,_bTop,_bWidth,_bHeight
			) {
				return (
					_aWidth - 1 + +_aLeft >= _bLeft && _bWidth - 1 + +_bLeft >= _aLeft &&
					_aHeight - 1 + +_aTop >= _bTop && _bHeight - 1 + +_bTop >= _aTop
				);
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
					_x += _documentElement.scrollLeft;
					_y += _documentElement.scrollTop;
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
			},

			getDimensions:_getDimensions = function (_node) {
				if (_node == window) {
					var _documentElement = document.documentElement;
					return {
						width:_documentElement.clientWidth || window.innerWidth || _documentElement.offsetWidth,
						height:_documentElement.clientHeight || window.innerHeight || _documentElement.offsetHeight
					};
				} else if (_node = _getById (_node)) {
					return {
						width:_node.offsetWidth || parseInt (_getStyle (_node,'width')) || 0,
						height:_node.offsetHeight || parseInt (_getStyle (_node,'height')) || 0
					};
				} else {
					return {width:0,height:0};
				}
			},

			setCoords:_setCoords = function (_nodeBlob,_coords) {
				_setStyle (_nodeBlob,_Uize.isArray (_coords) ? _Uize.meldKeysValues (_coordNames,_coords) : _coords);
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
			}
		});
	}
});

