/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Bar Class
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
	docCompleteness: 25
*/

/*?
	Introduction
		The =Uize.Widget.Bar= class implements a widget for displaying numerical values using a bar, with full and empty indicators and an optional value knob.

		*DEVELOPERS:* `Chris van Rensburg`, `Bryan Hsueh`

		This module supports both horizontally and vertically oriented bars.
*/

Uize.module ({
	name:'Uize.Widget.Bar',
	required:'Uize.Node',
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_undefined,
				_true = true,
				_false = false,
				_Uize_Node = Uize.Node
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._conformValue = function (_value) {
				var
					_this = this,
					_minValue = _this._minValidValue == _undefined ? _this._minValue : _this._minValidValue,
					_increments = _this._increments
				;
				return (
					Uize.constrain (
						_increments ? (_minValue + Math.round ((_value - _minValue) / _increments) * _increments) : _value,
						_minValue,
						_this._maxValidValue == _undefined ? _this._maxValue : _this._maxValidValue
					)
				);
			};

			_classPrototype._updateUi = function () {
				var _this = this;
				if (_this.isWired) {
					var
						_orientationNo = _this._orientationNo,
						_trackDimsObj = _Uize_Node.getDimensions (_this._trackNode),
						_trackDims = [_trackDimsObj.width,_trackDimsObj.height],
						_knobNode = _this._knobNode,
						_knobDimsObj = _Uize_Node.getDimensions (_knobNode),
						_knobDims = [_knobDimsObj.width,_knobDimsObj.height],
						_scaleFunc = _this._scaleFunc,
						_scaleMin = _scaleFunc(_this._minValue),
						_scaleMax = _scaleFunc(_this._maxValue),
						_scaleVal = _scaleFunc(_this._value),
						_knobVirtualPos = Math.round ((_scaleVal - _scaleMin) / (_scaleMax - _scaleMin) * (_trackDims [_orientationNo] - _knobDims [_orientationNo])),
						_knobPos = _orientationNo ? _trackDims [1] - _knobDims [1] - _knobVirtualPos : _knobVirtualPos,
						_knobCenter = Math.round (_knobPos + _knobDims [_orientationNo] / 2),
						_value = Uize.isNumber (_this._decimalPlacesToDisplay)
							? _this._value.toFixed (_this._decimalPlacesToDisplay)
							: _this._value
					;
					if (_knobNode) {
						_knobNode.style [_orientationNo ? 'top' : 'left'] = _knobPos + 'px';
						_knobNode.title = _value;
					}
					_this._fullNode &&
						_Uize_Node.setClipRect (
							_this._fullNode,
							_orientationNo ? _knobCenter : 0,
							_orientationNo ? _trackDims [0] : _knobCenter,
							_trackDims [1],
							0
						)
					;
					_this._emptyNode &&
						_Uize_Node.setClipRect (
							_this._emptyNode,
							0,
							_trackDims [0],
							_orientationNo ? _knobCenter : _trackDims [1],
							_orientationNo ? 0 : _knobCenter
						)
					;
					_this._valueNode &&
						_Uize_Node.setInnerHtml (
							_this._valueNode,
							Uize.isNumber (_this._decimalPlacesToDisplay)
								? _this._value.toFixed (_this._decimalPlacesToDisplay)
								: _this._value
						)
					;
				}
			};

		/*** Public Instance Methods ***/
			_classPrototype.updateUi = _classPrototype._updateUi;

			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					_this._orientationNo = _this._orientation == 'vertical' ? 1 : 0;
					_this._trackNode = _this.getNode ('track');
						/*?
							Implied Nodes
								track
									The =track= implied node acts as a "guide" in which a bar's knob is to move. This node should be transparent when using the optional =full= and =empty= implied nodes, in order for those nodes to be visible to the user. When not using those nodes, the track image can be set in the CSS style for this node or can be a child node.

									NOTES
									- this implied node is required
						*/
					_this._knobNode = _this.getNode ('knob');
						/*?
							Implied Nodes
								knob
									The =knob= implied node acts as an indicator for a bar's current value and - for sliders - is wired up for drag-and-drop and provides the user a way to change the value. This node must be a child node of the =track= implied node.

									NOTES
									- this implied node is required
						*/
					_this._fullNode = _this.getNode ('full');
						/*?
							Implied Nodes
								full
									The optional =full= implied node acts as an indicator for the "full" side of a bar. For vertical bars, the full side is on the bottom side of the knob. For horizontal bars, the full side is on the left side of the knob.

									To display correctly, this node should occupy the same space in the layout as the optional =empty= implied node and must have the same dimension on the axis of the knob's motion (ie. height for vertical bars, and width for horizontal bars) as the =track= implied node. It's not necessary that this node occupy the same space in the layout as the =track= implied node - the full/empty indicators could be off to the side, outside of the bar's track. However, in many cases you'll see bars with the full/empty indicators right over the track.

									NOTES
									- this implied node is optional
									- compare to the =empty= implied node
						*/
					_this._emptyNode = _this.getNode ('empty');
						/*?
							Implied Nodes
								empty
									The optional =empty= implied node acts as an indicator for the "empty" side of a bar. For vertical bars, the empty side is on the top side of the knob. For horizontal bars, the empty side is on the right side of the knob.

									To display correctly, this node should occupy the same space in the layout as the optional =full= implied node and must have the same dimension on the axis of the knob's motion (ie. height for vertical bars, and width for horizontal bars) as the =track= implied node. It's not necessary that this node occupy the same space in the layout as the =track= implied node - the full/empty indicators could be off to the side, outside of the bar's track. However, in many cases you'll see bars with the full/empty indicators right over the track.

									NOTES
									- this implied node is optional
									- compare to the =full= implied node
						*/
					_this._valueNode = _this.getNode ('value');
						/*?
							Implied Nodes
								value
									The optional =value= implied node provides a convenient way to display a bar's current value. When this node is present, its innerHTML will be set to the bar's value, every time it changes.

									NOTES
									- this implied node is optional
						*/

					_superclass.prototype.wireUi.call (_this);
				}
			};

		/*** Public Static Properties ***/
			_class.presets = {};
				/*?
					Static Properties
						Uize.Widget.Bar.presets
							[DOCUMENT]
				*/

		/*** State Properties ***/
			function _conformValueAndUpdateUi () {
				var _this = this;
				_this.set ({_value:_this._conformValue (_this._value)});
				_this._updateUi ();
			}

			_class.stateProperties ({
				_decimalPlacesToDisplay:'decimalPlacesToDisplay',
					/*?
						State Properties
							decimalPlacesToDisplay
								[DOCUMENT]
					*/
				_increments:{
					name:'increments',
					onChange:_conformValueAndUpdateUi,
					value:1
					/*?
						State Properties
							increments
								[DOCUMENT]
					*/
				},
				// if set, this is the min valid value, otherwise, use minValue
				_minValidValue:{
					name:'minValidValue',
					onChange:_conformValueAndUpdateUi
					/*?
						State Properties
							minValidValue
								[DOCUMENT]
					*/
				},
				_minValue:{
					name:'minValue',
					onChange:_conformValueAndUpdateUi,
					value:0
					/*?
						State Properties
							minValue
								[DOCUMENT]
					*/
				},
				// if set, this is the max valid value, otherwise, use maxValue
				_maxValidValue:{
					name:'maxValidValue',
					onChange:_conformValueAndUpdateUi
					/*?
						State Properties
							maxValidValue
								[DOCUMENT]
					*/
				},
				_maxValue:{
					name:'maxValue',
					onChange:_conformValueAndUpdateUi,
					value:100
					/*?
						State Properties
							maxValue
								[DOCUMENT]
					*/
				},
				_orientation:{
					name:'orientation',
					value:'vertical'
					/*?
						State Properties
							orientation
								[DOCUMENT]
					*/
				},
				// this function can show the value in differe scale: eg, log(x+1), 1-1/x, x^2, etc.
				_scaleFunc:{
					name:'scaleFunc',
					value:function (_x) {return _x;}
					/*?
						State Properties
							scaleFunc
								[DOCUMENT]
					*/
				},
				_value:{
					name:'value',
					conformer:_classPrototype._conformValue,
					onChange:_classPrototype._updateUi,
					value:0
					/*?
						State Properties
							value
								[DOCUMENT]
					*/
				}
			});

		return _class;
	}
});

