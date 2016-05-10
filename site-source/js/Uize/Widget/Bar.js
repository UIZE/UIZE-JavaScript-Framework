/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Bar Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2016 UIZE
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
	required:[
		'Uize.Dom.Basics',
		'Uize.Dom.Pos'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,
				_Uize_Dom_Basics = Uize.Dom.Basics,
				_Uize_Dom_Pos = Uize.Dom.Pos
		;

		/*** Private Instance Methods ***/
			function _conformValue (_value) {
				var
					m = this,
					_minValue = m._minValidValue == _undefined ? m._minValue : m._minValidValue,
					_increments = m._increments
				;
				return (
					Uize.constrain (
						_increments ? (_minValue + Math.round ((_value - _minValue) / _increments) * _increments) : _value,
						_minValue,
						m._maxValidValue == _undefined ? m._maxValue : m._maxValidValue
					)
				);
			}

			function _updateUi () {
				var m = this;

				function _updateDimsObj (_name,_node) {
					var
						_dimsObjects = m._dimsObjects || (m._dimsObjects = {}),
						_newDimsObject = _Uize_Dom_Pos.getDimensions (_node)
					;
					if (!_dimsObjects [_name] || (_newDimsObject.width && _newDimsObject.height))
						_dimsObjects [_name] = _newDimsObject
					;
					return _dimsObjects [_name];
				}

				if (m.isWired) {
					var
						_orientationNo = m._orientationNo,
						_trackDimsObj = _updateDimsObj ('track',m._trackNode),
						_trackDims = [_trackDimsObj.width,_trackDimsObj.height],
						_knobNode = m._knobNode,
						_knobDimsObj = _updateDimsObj ('knob',_knobNode),
						_knobDims = [_knobDimsObj.width,_knobDimsObj.height],
						_scaleFunc = m._scaleFunc,
						_minValueScaled = _scaleFunc (m._minValue),
						_maxValueScaled = _scaleFunc (m._maxValue),
						_valueScaled = _scaleFunc (m._value),
						_knobVirtualPos = Math.round (
							(_valueScaled - _minValueScaled) /
							(_maxValueScaled - _minValueScaled) * (_trackDims [_orientationNo] - _knobDims [_orientationNo])
						),
						_knobPos = _orientationNo ? _trackDims [1] - _knobDims [1] - _knobVirtualPos : _knobVirtualPos,
						_knobCenter = Math.round (_knobPos + _knobDims [_orientationNo] / 2),
						_value = Uize.isNumber (m._decimalPlacesToDisplay)
							? m._value.toFixed (m._decimalPlacesToDisplay)
							: m._value
					;
					if (_knobNode) {
						_knobNode.style [_orientationNo ? 'top' : 'left'] = _knobPos + 'px';
						_knobNode.title = _value;
					}
					m._fullNode &&
						_Uize_Dom_Basics.setClipRect (
							m._fullNode,
							_orientationNo ? _knobCenter : 0,
							_orientationNo ? _trackDims [0] : _knobCenter,
							_trackDims [1],
							0
						)
					;
					m._emptyNode &&
						_Uize_Dom_Basics.setClipRect (
							m._emptyNode,
							0,
							_trackDims [0],
							_orientationNo ? _knobCenter : _trackDims [1],
							_orientationNo ? 0 : _knobCenter
						)
					;
					m._valueNode &&
						_Uize_Dom_Basics.setInnerHtml (
							m._valueNode,
							Uize.isNumber (m._decimalPlacesToDisplay)
								? m._value.toFixed (m._decimalPlacesToDisplay)
								: m._value
						)
					;
				}
			}

			function _conformValueAndUpdateUi () {
				var m = this;
				m.set ({_value:_conformValue.call (m,m._value)});
				_updateUi.call (m);
			}

		return _superclass.subclass ({
			instanceMethods:{
				updateUi:_updateUi,

				wireUi:function () {
					var m = this;
					if (!m.isWired) {
						m._trackNode = m.getNode ('track');
							/*?
								DOM Nodes
									track
										The =track= DOM node acts as a "guide" in which a bar's knob is to move. This node should be transparent when using the optional =full= and =empty= DOM nodes, in order for those nodes to be visible to the user. When not using those nodes, the track image can be set in the CSS style for this node or can be a child node.

										NOTES
										- this DOM node is required
							*/
						m._knobNode = m.getNode ('knob');
							/*?
								DOM Nodes
									knob
										The =knob= DOM node acts as an indicator for a bar's current value and - for sliders - is wired up for drag-and-drop and provides the user a way to change the value. This node must be a child node of the =track= DOM node.

										NOTES
										- this DOM node is required
							*/
						m._fullNode = m.getNode ('full');
							/*?
								DOM Nodes
									full
										The optional =full= DOM node acts as an indicator for the "full" side of a bar. For vertical bars, the full side is on the bottom side of the knob. For horizontal bars, the full side is on the left side of the knob.

										To display correctly, this node should occupy the same space in the layout as the optional =empty= DOM node and must have the same dimension on the axis of the knob's motion (i.e. height for vertical bars, and width for horizontal bars) as the =track= DOM node. It's not necessary that this node occupy the same space in the layout as the =track= DOM node - the full/empty indicators could be off to the side, outside of the bar's track. However, in many cases you'll see bars with the full/empty indicators right over the track.

										NOTES
										- this DOM node is optional
										- compare to the =empty= DOM node
							*/
						m._emptyNode = m.getNode ('empty');
							/*?
								DOM Nodes
									empty
										The optional =empty= DOM node acts as an indicator for the "empty" side of a bar. For vertical bars, the empty side is on the top side of the knob. For horizontal bars, the empty side is on the right side of the knob.

										To display correctly, this node should occupy the same space in the layout as the optional =full= DOM node and must have the same dimension on the axis of the knob's motion (i.e. height for vertical bars, and width for horizontal bars) as the =track= DOM node. It's not necessary that this node occupy the same space in the layout as the =track= DOM node - the full/empty indicators could be off to the side, outside of the bar's track. However, in many cases you'll see bars with the full/empty indicators right over the track.

										NOTES
										- this DOM node is optional
										- compare to the =full= DOM node
							*/
						m._valueNode = m.getNode ('value');
							/*?
								DOM Nodes
									value
										The optional =value= DOM node provides a convenient way to display a bar's current value. When this node is present, its innerHTML will be set to the bar's value, every time it changes.

										NOTES
										- this DOM node is optional
							*/

						_superclass.doMy (m,'wireUi');
					}
				}
			},

			stateProperties:{
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
				_orientationNo:{
					derived:'orientation: orientation == "vertical" ? 1 : 0',
					onChange:_updateUi
				},
				// this function can show the value in differe scale: eg, log(x+1), 1-1/x, x^2, etc.
				_scaleFunc:{
					name:'scaleFunc',
					value:Uize.returnX
					/*?
						State Properties
							scaleFunc
								[DOCUMENT]
					*/
				},
				_value:{
					name:'value',
					conformer:_conformValue,
					onChange:_updateUi,
					value:0
					/*?
						State Properties
							value
								[DOCUMENT]
					*/
				}
			}
		});
	}
});

