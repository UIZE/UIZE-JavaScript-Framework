/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Fx.Scroll Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Fx.Scroll= module provides easy functionality to animate the scrolling of the document.

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Fx.Scroll',
	required:[
		'Uize.Dom.Basics',
		'Uize.Dom.Pos',
		'Uize.Fade'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,
				_Uize_Dom = Uize.Dom,
				_Uize_Dom_Basics = _Uize_Dom.Basics,
				_Uize_Dom_Pos = _Uize_Dom.Pos,
				_getCoords = _Uize_Dom_Pos.getCoords,
				_getDimensions = _Uize_Dom_Pos.getDimensions,
				_Uize_Fade = Uize.Fade
		;

		return Uize.package ({
			scrollToNode:function (_targetNode, _scrollParams) {
				var
					_document = document,
					_bodyNode = _document.body,
					_documentElement = _document.documentElement,
					_getNodeHeight = function (_node) {return _getDimensions(_node).height}
				;

				_targetNode = _Uize_Dom_Basics.getById(_targetNode) || _bodyNode;
				_scrollParams = _scrollParams || {};

				var
					_scrollableContainerNode = _targetNode,
					_overflowScrollLookup = {auto:1,scroll:1}
				;

				// First find the ancestor node of _targetNode that is scrollable.  This is determined by
				// a node whose overflow-y is either 'auto' or 'scroll' OR
				// a node whose height is less than of its child node (which is an ancestor of _targetNode).
				// We need to check this instead of just scrolling the entire page because the node we want to
				// scroll to could be inside of a scrollable div.
				while (_scrollableContainerNode != null && _scrollableContainerNode != _bodyNode) {
					_scrollableContainerNode = _scrollableContainerNode.parentNode;

					if (_scrollableContainerNode.parentNode != _documentElement) {
						if (_Uize_Dom_Basics.getStyle(_scrollableContainerNode, 'overflowY') in _overflowScrollLookup)
							break;
						if (_getNodeHeight(_scrollableContainerNode) > _getNodeHeight(_scrollableContainerNode.parentNode)) {
							_scrollableContainerNode = _scrollableContainerNode.parentNode;
							break;
						}
					}
				}

				var
					_scrollableContainerNodeCoords = _getCoords(_scrollableContainerNode),
					_targetNodeCoords = _getCoords(_targetNode),
					_scrollableBodyNode = _Uize_Dom_Pos.getDocumentScrollElement(),
					_window = window,
					_windowDimensions = _getDimensions(_window),
					_windowScrollX = _scrollableBodyNode.scrollLeft,
					_windowScrollY = _scrollableBodyNode.scrollTop,
					_windowWidth = _windowDimensions.width,
					_windowHeight = _windowDimensions.height,
					_commonFadeProperties = {
						curve:_scrollParams.curve !== _undefined ? _scrollParams.curve : _Uize_Fade.celeration(0.25, 0.5),	// if curve is undefined then choose default
						duration:_scrollParams.duration != _undefined ? _scrollParams.duration : 750, // if duration is null or undefined then choose default
						quantization:1
					},
					_scrollableContainerNodeIsBodyNode = _scrollableContainerNode == _bodyNode,
					_bodyNodeDone = false,
					_scrollableContainerNodeDone = false
				;

				function _isNodeVisible(_nodeCoords, _windowIsContainer) {
					var
						_nodeLeft = _nodeCoords.x,
						_nodeTop = _nodeCoords.y,
						_nodeWidth = _nodeCoords.width,
						_nodeHieght = _nodeCoords.height,

						_containerScrollX = _windowIsContainer ? _windowScrollX : _scrollableContainerNode.scrollLeft,
						_containerScrollY = _windowIsContainer ? _windowScrollY : _scrollableContainerNode.scrollTop,
						_containerWidth = _windowIsContainer ? _windowWidth : _scrollableContainerNodeCoords.width,
						_containerHeight = _windowIsContainer ? _windowHeight : _scrollableContainerNodeCoords.height
					;

					// There are two forms of node visibility: full & partial
					// full - the node must be wholly within the window view port
					// partial - the top-left corner of the node must be within the
					//           window view port, but the entire node does not have to be
					return _Uize_Dom_Pos.doRectanglesOverlap(
							_nodeLeft, _nodeTop, _nodeWidth, 1,
							_containerScrollX, _containerScrollY, _containerWidth, _containerHeight
						)
						&& (
							!_scrollParams.fullVisibility
								|| (_nodeLeft + _nodeWidth <= _containerScrollX + _containerWidth
									&& _nodeTop + _nodeHieght <= _containerScrollY + _containerHeight
								)
						)
					;
				}

				function _wireAndStartFade(_node, _endValue, _doneFunc, _shouldFade) {
					function _done() {
						_doneFunc();
						_scrollableContainerNodeDone
							&& _bodyNodeDone
							&& _scrollParams.callback
							&& _scrollParams.callback()
						;
					}

					if (_shouldFade) {
						var _fade = new _Uize_Fade(
							Uize.copyInto(
								{
									startValue:_node.scrollTop,
									endValue:_endValue
								},
								_commonFadeProperties
							)
						);

						_fade.wire({
							'Changed.value':function () { _node.scrollTop = +_fade; },
							Done:_done
						});

						_fade.start();
					}
					else
						_done();
				}

				// At this point we have our scrollable container.  Either it is a regular DOM node (such as a DIV)
				// or it is the document body. In the case where the scrollable container is not the document body,
				// we want to animate a scroll of the difference between the yPos of the targetNode and the scrollable
				// container, but only if the target node isn't already visible.  The logic being that in the
				// case where we need to scroll up to get to the target node, the position of the targetNode is actually
				// higher than that of the scrollable container, it is just being clipped.
				_wireAndStartFade(
					_scrollableContainerNode,
					_scrollableContainerNode.scrollTop + _targetNodeCoords.y - _scrollableContainerNodeCoords.y,
					function () { _scrollableContainerNodeDone = true },
					!_scrollableContainerNodeIsBodyNode && (_scrollParams.scrollToTop || !_isNodeVisible(_targetNodeCoords))
				);

				// It may also be the case that the scrollable container is also not in view.  So not only do we need to
				// scroll within the scrollable container, but also need to scroll the scrollable container into view.
				// In the case where the scrollable container and the body node are one in the same, we just want to scroll the
				// page to where the targetNode is.  Otherwise, we want to scroll to the scrollable container
				var _scrollNodeCoords = _scrollableContainerNodeIsBodyNode ? _targetNodeCoords : _scrollableContainerNodeCoords;
				_wireAndStartFade(
					_scrollableBodyNode,
					_scrollNodeCoords.y + Uize.toNumber(_scrollParams.offset, 0),
					function () { _bodyNodeDone = true },
					_scrollParams.scrollToTop || !_isNodeVisible(_scrollNodeCoords, true)
				);
				/*?
					Static Methods
						Uize.Fx.Scroll.scrollToNode
							Scrolls the window/document vertically to bring a specified target node into view at the top of the window.

							SYNTAX
							..............................
							Uize.Fx.Scroll.scrollToNode (
								targetNodeSTRorOBJ,
								scrollParamsOBJ
							);
							..............................

							VARIATION
							..............................
							Uize.Fx.Scroll.scrollToNode (targetNodeSTRorOBJ);
							..............................

							This method walks up the node parentage hierarchy in order to determine the closest ancestor to the target node that either is a scrollable container or is the root document that should be scrolled. In the event that the scrollable container is also not in view, the entire page is scrolled to bring that container node into view, while simultaneously scrolling the contents of the container to bring the target node into view within it.

							By default it performs a smooth ease-in/ease-out scroll, but the curve function can be overridden in the =scrollParamsOBJ=.

							targetNodeSTRorOBJ
								The node (or string ID of the node) to which to scroll.

								A "falsy" value for =targetNodeSTRorOBJ= will resolve to the document root.

							scrollParamsOBJ
								An object, specifying additional override params to control the scroll animation.

								curveOBJ
									Overrides the default ease-in/ease-out curve used for animating the scroll.

								durationINT
									Overrides the default duration (750) of the scroll animation in milliseconds.

								fullVisibilityBOOL
									Determines whether or not the =targetNodeSTRorOBJ= to which we are scrolling needs to be fully contained within the window in order to prevent scrolling to the top of the =targetNodeSTRorOBJ=. Default value is =false=.

									A value of =false= means that as long as a single pixel of the =targetNodeSTRorOBJ= is within view, no scrolling will happen. A value of =true= means that unless the entire =targetNodeSTRorOBJ= is within view, scrolling will happen.

								scrollToTopBOOL
									When =true=, forces a scroll of the element to the top of the viewport, even if the entire element is already fully visible.

								callbackFUNC
									A callback function to be called once scrolling complete.

								offsetINT
									Specifies an optional vertical pixel offset from the top of the =targetNodeSTRorOBJ=.

							EXAMPLE
							......
							Uize.Fx.Scroll.scrollToNode(
								'foo',
								{
									curve:Uize.Curve.easeInPow(.5),
									duration:1500,
									callback:function () { alert('finished') }
								}
							......
				*/
			}
		});
	}
});

