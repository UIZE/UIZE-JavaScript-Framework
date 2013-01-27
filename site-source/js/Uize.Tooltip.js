/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Tooltip Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2006-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 5
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Tooltip= module manages the display of decorated HTML tooltips that follow the mouse as it moves and that are positioned to always be in view.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Tooltip',
	required:[
		'Uize.Node',
		'Uize.Fade'
	],
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_package = function () {},
				_true = true,
				_false = false,
				_undefined,
				_Uize_Node = Uize.Node
			;

		/*** General Variables ***/
			var
				_packageGuid = Uize.getGuid (),
				_tooltips = [],
				_shownTooltip,
				_tooltipBreatherMargin = 16
			;

		/*** Tooltip Display Management Functions ***/
			function _resolveTooltipNode (_tooltipNode) {
				return _Uize_Node.getById (Uize.isFunction (_tooltipNode) ? _tooltipNode () : _tooltipNode);
			}

			function _updateShownTooltipPosition () {_positionTooltip ()}

			function _setTooltip (_tooltip) {
				if (_tooltip != _shownTooltip) {
					if (_tooltip) {
						if (_shownTooltip) {
							_fade.stop ();
							_endFade ();
						}
						if (!_tooltip._manualPositioning) {
							_Uize_Node.wire (document.body,'scroll',_updateShownTooltipPosition,_packageGuid);
							_Uize_Node.wire (document.documentElement,'mousemove',_updateShownTooltipPosition,_packageGuid);
						}
						_shownTooltip = _tooltip;
						_Uize_Node.setStyle (
							_shownTooltip._node,
							{position:'absolute',zIndex:5000,left:-50000,top:-50000}
						);
						_Uize_Node.display (_shownTooltip._node);
						_positionTooltip ();
					} else {
						_fade.get ('duration') > 0 ? _fade.start () : _endFade ();
					}
				} else if (_tooltip) {
					_fade.stop ();
					_Uize_Node.setOpacity (_shownTooltip._node,1);
				}
			}

		/*** Public Static Methods ***/
			_package.showTooltip = function (_tooltipNode,_mustShow,_manualPositioning) {
				if (_tooltipNode = _resolveTooltipNode (_tooltipNode)) {
					if (_mustShow !== _false) {
						_tooltips.push ({
							_node:_tooltipNode,
							_manualPositioning:_manualPositioning
						});
					} else {
						for (var _tooltipNo = _tooltips.length; --_tooltipNo > -1;)
							if (_tooltips [_tooltipNo]._node == _tooltipNode) break
						;
						_tooltipNo > -1 && _tooltips.splice (_tooltipNo,1);
					}
					_setTooltip (_tooltips [_tooltips.length - 1]);
				}
			};

			_package.hideTooltip = function (_tooltipNode) {_package.showTooltip (_tooltipNode,_false)};

			var _positionTooltip = _package.positionTooltip = function (_tooltipNode,_domEvent) {
				_shownTooltip &&
				(
					_tooltipNode === _undefined
						? (_tooltipNode = _shownTooltip._node)
						: _shownTooltip._node == _resolveTooltipNode (_tooltipNode)
				) &&
					_Uize_Node.setAbsPos (_tooltipNode,_Uize_Node.getEventAbsPos (_domEvent),_tooltipBreatherMargin)
				;
			};

		/*** Fadeout Management ***/
			var _fade = _package.fade = Uize.Fade ({duration:0});
			function _endFade () {
				_shownTooltip._manualPositioning || _Uize_Node.unwireEventsByOwnerId (_packageGuid);
				_Uize_Node.display (_shownTooltip._node,_false);
				_Uize_Node.setOpacity (_shownTooltip._node,1);
				_shownTooltip = null;
			}
			_fade.wire ({
				'Changed.value':function () {_Uize_Node.setOpacity (_shownTooltip._node,1 - _fade.get ('progress'))},
				Done:_endFade
			});

		return _package;
	}
});

