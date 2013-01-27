/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Drag.Move Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2013 UIZE
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
	required:'Uize.Node',
	builder:function  (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_Uize_Node = Uize.Node
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					function () {
						var
							_this = this,
							_sideNames = [
								['left','right'],
								['top','bottom']
							],
							_dragSides = [],
							_dragSideUnits = [],
							_dragStartNodePos = []
						;
						_this.wire ({
							'Drag Start':
								function () {
									var _node = _this._getNodeToMove ();
									function _captureAxisStartInfo (_axis) {
										function _getPosUnit (_posStr) {
											var _unitMatch = _posStr.match (/(px|%)\s*$/);
											return _unitMatch ? _unitMatch [1] : 'px';
										}
										var
											_axisSideNames = _sideNames [_axis],
											_dragSide = _dragSides [_axis] = _node.style [_axisSideNames [1]] ? 1 : 0,
											_dragSidePosStr = _Uize_Node.getStyle (_node,_axisSideNames [_dragSide]),
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
									var _node = _this._getNodeToMove ();
									function _setAxisPos (_axis) {
										var
											_dragSide = _dragSides [_axis],
											_dragSideUnit = _dragSideUnits [_axis],
											_dragSidePos = (_dragStartNodePos [_axis] + _this.eventDeltaPos [_axis] * (_dragSide ? -1 : 1))
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
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
		_classPrototype._getNodeToMove = function () {
			return this.getNode (this._shellNode) || this.getNode ();
		};

		/*** State Properties ***/
			_class.stateProperties ({
				_shellNode:'shellNode'
			});

		return _class;
	}
});

