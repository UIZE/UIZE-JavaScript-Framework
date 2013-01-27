/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.SegmentDisplay Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2013 UIZE
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
	required:'Uize.Node.Classes',
	builder:function (_superclass) {
		'use strict';

		var
			_class = _superclass.subclass (),
			_classPrototype = _class.prototype
		;

		/*** Variables for Performance Optimization ***/
			var _Uize_Node_Classes_setState = Uize.Node.Classes.setState;

		/*** Private Instance Methods ***/
			_classPrototype._updateUiSegmentsState = function () {
				var _this = this;
				if (_this.isWired) {
					var
						_lastSegmentsState = _this._lastSegmentsState,
						_segmentsState = _this._segmentsState
					;
					_this.forEachSegment (
						function (_segmentNo,_segmentCode,_segmentMask) {
							var _segmentNewState = _segmentsState & _segmentMask;
							if (_lastSegmentsState == null || _segmentNewState != (_lastSegmentsState & _segmentMask))
								_Uize_Node_Classes_setState (
									_this.getNode ('segment' + _segmentCode),
									[_this._cssClassSegmentOff,_this._cssClassSegmentOn],
									!!_segmentNewState
								)
							;
						}
					);
					_this._lastSegmentsState = _segmentsState;
				}
			};

		/*** Public Instance Methods ***/
			_classPrototype.forEachSegment = function (_function) {
				for (
					var
						_segmentNo = -1,
						_segmentCodes = this.Class.segmentCodes,
						_segmentCodesLength = _segmentCodes.length,
						_segmentMask = 1 << _segmentCodesLength
					;
					++_segmentNo < _segmentCodesLength;
				)
					_function.call (this,_segmentNo,_segmentCodes [_segmentNo],_segmentMask = _segmentMask >> 1)
				;
			};

			_classPrototype.getSegmentState = function (_segmentNo) {
				return !!(this._segmentsState & (this.Class._firstSegmentMask >> _segmentNo));
			};

			_classPrototype.getSegmentsStateAsHex = function (_reverse) {
				return this.Class.getSegmentsStateAsHex (this._segmentsState,_reverse);
			};

			_classPrototype.invertAllSegmentsState = function () {
				this.set ({_segmentsState:this._segmentsState ^ this.Class._allSegmentsMask});
			};

			_classPrototype.setSegmentState = function (_segmentNo,_state) {
				this.getSegmentState (_segmentNo) != _state && this.toggleSegmentState (_segmentNo);
			};

			_classPrototype.setAllSegmentsState = function (_state) {
				this.set ({_segmentsState:_state ? this.Class._allSegmentsMask : 0});
			};

			_classPrototype.toggleSegmentState = function (_segmentNo) {
				this.set ({_segmentsState:this._segmentsState ^ (this.Class._firstSegmentMask >> _segmentNo)});
			};

			_classPrototype.updateUi = function () {
				this._updateUiSegmentsState ();
			};

			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					_this._lastSegmentsState = null;

					_superclass.prototype.wireUi.call (_this);
				}
			};

		/*** Private Static Methods ***/
			_class._conformSegmentsState = function (_segmentsState) {
				return Math.max (Math.round (_segmentsState),0) & this._allSegmentsMask;
			};

		/*** Public Static Methods ***/
			_class.configureDisplay = function (_segmentCodes,_valueToSegmentsStateLookup) {
				var segmentCodesLength = (this.segmentCodes = _segmentCodes).length;
				this.segmentsStateToValueLookup =
					Uize.reverseLookup (this.valueToSegmentsStateLookup = _valueToSegmentsStateLookup)
				;
				this._allSegmentsMask = (1 << segmentCodesLength) - 1;
				this._firstSegmentMask = 1 << (segmentCodesLength - 1);
				this._toHexExtraByteBit = 1 << (Math.ceil (segmentCodesLength / 8) * 8);
				/*?
					###
						Public Static Properties
							segmentCodes
								.

							segmentsStateToValueLookup
								.

							valueToSegmentsStateLookup
								.
				*/
			};

			_class.getSegmentsStateAsHex = function (_segmentsState,_reverse) {
				_segmentsState = this._conformSegmentsState (_segmentsState);
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
			};

			_class.getSegmentsStateFromValue = function (_value) {
				if ((_value += '').length == 1) {
					var
						_valueToSegmentsStateLookup = this.valueToSegmentsStateLookup,
						_segmentsState = _valueToSegmentsStateLookup [_value]
					;
					if (_segmentsState == null) _segmentsState = _valueToSegmentsStateLookup [_value.toLowerCase ()];
					if (_segmentsState == null) _segmentsState = _valueToSegmentsStateLookup [_value.toUpperCase ()];
					return _segmentsState || 0;
				} else {
					return this._conformSegmentsState (_value);
				}
			};

			_class.getValueFromSegmentsState = function (_segmentsState) {
				return (
					this.segmentsStateToValueLookup [_segmentsState = this._conformSegmentsState (_segmentsState)] ||
					this.getSegmentsStateAsHex (_segmentsState)
				);
			};

		/*** State Properties ***/
			_class.stateProperties ({
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
					conformer:function (_value) {return this.Class._conformSegmentsState (_value)},
					onChange:[
						function () {this.set ({_value:this.Class.getValueFromSegmentsState (this._segmentsState)})},
						_classPrototype._updateUiSegmentsState
					]
				},
				_value:{
					name:'value',
					conformer:function (_value) {
						return this.Class.getValueFromSegmentsState (this.Class.getSegmentsStateFromValue (_value));
					},
					onChange:function () {this.set ({_segmentsState:this.Class.getSegmentsStateFromValue (this._value)})}
				}
			});

		return _class;
	}
});

