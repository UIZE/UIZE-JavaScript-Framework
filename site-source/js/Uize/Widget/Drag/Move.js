/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Drag.Move Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2016 UIZE
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
		The =Uize.Widget.Drag.Move= class wires a drag-and-drop behavior to a node to let the user move its position, with support for different position units.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.Drag.Move',
	required:'Uize.Dom.Basics',
	builder:function  (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize_Dom_Basics = Uize.Dom.Basics
		;

		/*** Private Instance Methods ***/
			function _getNodeToMove (m) {
				return m.getNode (m._shellNode) || m.getNode ();
			}

		return _superclass.subclass ({
			alphastructor:function () {
				var
					m = this,
					_sideNames = [
						['left','right'],
						['top','bottom']
					],
					_dragSides = [],
					_dragSideUnits = [],
					_dragStartNodePos = []
				;
				m.wire ({
					'Drag Start':
						function () {
							var _node = _getNodeToMove (m);
							function _captureAxisStartInfo (_axis) {
								function _getPosUnit (_posStr) {
									var _unitMatch = _posStr.match (/(px|%)\s*$/);
									return _unitMatch ? _unitMatch [1] : 'px';
								}
								var
									_axisSideNames = _sideNames [_axis],
									_dragSide = _dragSides [_axis] = _node.style [_axisSideNames [1]] ? 1 : 0,
									_dragSidePosStr = _Uize_Dom_Basics.getStyle (_node,_axisSideNames [_dragSide]),
									_dragSideUnit = _getPosUnit (_dragSidePosStr)
								;
								_dragStartNodePos [_axis] = _dragSideUnit == '%' ? (parseFloat (_dragSidePosStr) / 100 * _node.offsetParent ['offset' + (_axis ? 'Height' : 'Width')]) : parseFloat (_dragSidePosStr);
								_dragSideUnits [_axis] = _getPosUnit (_node.style [_axisSideNames [_dragSide]]);
							}
							_captureAxisStartInfo (0);
							_captureAxisStartInfo (1);
						},
					'Drag Update':
						function () {
							var _node = _getNodeToMove (m);
							function _setAxisPos (_axis) {
								var
									_dragSide = _dragSides [_axis],
									_dragSideUnit = _dragSideUnits [_axis],
									_dragSidePos = (_dragStartNodePos [_axis] + m.eventDeltaPos [_axis] * (_dragSide ? -1 : 1))
								;
								if (_dragSideUnit == '%')
									_dragSidePos = _dragSidePos / _node.offsetParent ['offset' + (_axis ? 'Height' : 'Width')] * 100
								;
								_node.style [_sideNames [_axis] [_dragSide]] = _dragSidePos + _dragSideUnit;
							}
							_setAxisPos (0);
							_setAxisPos (1);
						}
				});
			},

			stateProperties:{
				_shellNode:'shellNode'
			}
		});
	}
});

