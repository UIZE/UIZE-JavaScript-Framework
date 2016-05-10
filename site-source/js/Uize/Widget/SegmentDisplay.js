/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.SegmentDisplay Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	docCompleteness: 1
*/

/*?
	Introduction
		The =Uize.Widget.SegmentDisplay= base class can be subclassed to create segment display widget classes for supporting different numbers of segments.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.SegmentDisplay',
	required:'Uize.Dom.Classes',
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Performance Optimization ***/
				_Uize_Dom_Classes_setState = Uize.Dom.Classes.setState
		;

		/*** Private Instance Methods ***/
			function _updateUiSegmentsState () {
				var m = this;
				if (m.isWired) {
					var
						_lastSegmentsState = m._lastSegmentsState,
						_segmentsState = m._segmentsState
					;
					m.forEachSegment (
						function (_segmentNo,_segmentCode,_segmentMask) {
							var _segmentNewState = _segmentsState & _segmentMask;
							if (_lastSegmentsState == null || _segmentNewState != (_lastSegmentsState & _segmentMask))
								_Uize_Dom_Classes_setState (
									m.getNode ('segment' + _segmentCode),
									[m._cssClassSegmentOff,m._cssClassSegmentOn],
									!!_segmentNewState
								)
							;
						}
					);
					m._lastSegmentsState = _segmentsState;
				}
			}

		/*** Private Static Methods ***/
			function _conformSegmentsState (_Class,_segmentsState) {
				return Math.max (Math.round (_segmentsState),0) & _Class._allSegmentsMask;
			}

		return _superclass.subclass ({
			dualContextMethods:{
				forEachSegment:function (_function) {
					for (
						var
							m = this,
							_segmentNo = -1,
							_segmentCodes = Uize.getClass (m).segmentCodes,
							_segmentCodesLength = _segmentCodes.length,
							_segmentMask = 1 << _segmentCodesLength
						;
						++_segmentNo < _segmentCodesLength;
					)
						_function.call (m,_segmentNo,_segmentCodes [_segmentNo],_segmentMask = _segmentMask >> 1)
					;
				}
			},

			instanceMethods:{
				getSegmentState:function (_segmentNo) {
					return !!(this._segmentsState & (this.Class._firstSegmentMask >> _segmentNo));
				},

				getSegmentsStateAsHex:function (_reverse) {
					return this.Class.getSegmentsStateAsHex (this._segmentsState,_reverse);
				},

				invertAllSegmentsState:function () {
					this.set ({_segmentsState:this._segmentsState ^ this.Class._allSegmentsMask});
				},

				setSegmentState:function (_segmentNo,_state) {
					this.getSegmentState (_segmentNo) != _state && this.toggleSegmentState (_segmentNo);
				},

				setAllSegmentsState:function (_state) {
					this.set ({_segmentsState:_state ? this.Class._allSegmentsMask : 0});
				},

				toggleSegmentState:function (_segmentNo) {
					this.set ({_segmentsState:this._segmentsState ^ (this.Class._firstSegmentMask >> _segmentNo)});
				},

				updateUi:_updateUiSegmentsState,

				wireUi:function () {
					var m = this;
					if (!m.isWired) {
						m._lastSegmentsState = null;

						_superclass.doMy (m,'wireUi');
					}
				}
			},

			staticMethods:{
				configureDisplay:function (_segmentCodes,_valueToSegmentsStateLookup) {
					var
						_Class = this,
						_segmentCodesLength = (_Class.segmentCodes = _segmentCodes).length
					;
					_Class.segmentsStateToValueLookup =
						Uize.reverseLookup (_Class.valueToSegmentsStateLookup = _valueToSegmentsStateLookup)
					;
					_Class._allSegmentsMask = (1 << _segmentCodesLength) - 1;
					_Class._firstSegmentMask = 1 << (_segmentCodesLength - 1);
					_Class._toHexExtraByteBit = 1 << (Math.ceil (_segmentCodesLength / 8) * 8);
					/*?
						###
							Static Properties
								segmentCodes
									.

								segmentsStateToValueLookup
									.

								valueToSegmentsStateLookup
									.
					*/
				},

				getSegmentsStateAsHex:function (_segmentsState,_reverse) {
					_segmentsState = _conformSegmentsState (this,_segmentsState);
					if (_reverse) {
						for (var _leftBitMask = this._firstSegmentMask, _rightBitMask = 1; _leftBitMask > _rightBitMask;) {
							if (!!(_segmentsState & _leftBitMask) ^ !!(_segmentsState & _rightBitMask))
								_segmentsState = _segmentsState ^ _leftBitMask ^ _rightBitMask
							;
							_leftBitMask = _leftBitMask >> 1;
							_rightBitMask = _rightBitMask << 1;
						}
					}
					return '0x' + (_segmentsState | this._toHexExtraByteBit).toString (16).slice (1);
				},

				getSegmentsStateFromValue:function (_value) {
					if ((_value += '').length == 1) {
						var
							_valueToSegmentsStateLookup = this.valueToSegmentsStateLookup,
							_segmentsState = _valueToSegmentsStateLookup [_value]
						;
						if (_segmentsState == null) _segmentsState = _valueToSegmentsStateLookup [_value.toLowerCase ()];
						if (_segmentsState == null) _segmentsState = _valueToSegmentsStateLookup [_value.toUpperCase ()];
						return _segmentsState || 0;
					} else {
						return _conformSegmentsState (this,_value);
					}
				},

				getValueFromSegmentsState:function (_segmentsState) {
					return (
						this.segmentsStateToValueLookup [_segmentsState = _conformSegmentsState (this,_segmentsState)] ||
						this.getSegmentsStateAsHex (_segmentsState)
					);
				}
			},

			stateProperties:{
				_cssClassSegmentOff:{
					name:'cssClassSegmentOff',
					value:'sevenSegSegmentOff'
				},
				_cssClassSegmentOn:{
					name:'cssClassSegmentOn',
					value:'sevenSegSegmentOn'
				},
				_segmentsState:{
					name:'segmentsState',
					conformer:function (_value) {return _conformSegmentsState (this.Class,_value)},
					onChange:[
						function () {this.set ({_value:this.Class.getValueFromSegmentsState (this._segmentsState)})},
						_updateUiSegmentsState
					]
				},
				_value:{
					name:'value',
					conformer:function (_value) {
						return this.Class.getValueFromSegmentsState (this.Class.getSegmentsStateFromValue (_value));
					},
					onChange:function () {this.set ({_segmentsState:this.Class.getSegmentsStateFromValue (this._value)})}
				}
			}
		});
	}
});

