/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.ImagePort Class
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
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.ImagePort= class manages sizing and positioning an image in a view port, using logical (rather than explicit) size and position values.

		*DEVELOPERS:* `Chris van Rensburg`

		The =Uize.Widget.ImagePort= class supports logical sizing behaviors such as fit and fill, and logical positioning behaviors such as left, center, and right aligned, or top, center, and bottom aligned, among others.
*/

Uize.module ({
	name:'Uize.Widget.ImagePort',
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

		/*** Utility Functions ***/
			function _getAlignForAxis (_pos,_dim,_portDim,_alignPin0,_alignPin1) {
				if (typeof _alignPin0 != 'number') _alignPin0 = parseFloat (_alignPin0) || 0;
				if (typeof _alignPin1 != 'number') _alignPin1 = parseFloat (_alignPin1) || 1;
				_pos = +_pos + _alignPin0 * _dim;
				_dim *= (_alignPin1 - _alignPin0);
				return _dim == _portDim ? .5 : _pos / (_portDim - _dim);
			}

		/*** Private Instance Methods ***/
			_classPrototype._updateUiPosition = function () {
				var _this = this;
				if (_this.isWired) {
					var
						_paramsForGetScaledRect = _this._paramsForGetScaledRect,
						_scaledImageCoords = _this.getScaledRect (_paramsForGetScaledRect)
					;
					_this.setNodeStyle ('image',_scaledImageCoords);
					_this.set ({
						_alignApplicableX:
							!!(_this.portVsScaledDelta [0] = _paramsForGetScaledRect.portWidth - _scaledImageCoords.width),
						_alignApplicableY:
							!!(_this.portVsScaledDelta [1] = _paramsForGetScaledRect.portHeight - _scaledImageCoords.height)
					});
				}
			};

		/*** Public Instance Methods ***/
			_classPrototype.updateUi = function () {
				var _this = this;
				if (_this.isWired) {
					var _shellDims = _Uize_Node.getDimensions (_this.getNode ());
					if (!_this._imageNaturalWidth) {
						var _imageDims = _Uize_Node.getDimensions (_this.getNode ('image'));
						_this._imageNaturalWidth = _imageDims.width;
						_this._imageNaturalHeight = _imageDims.height;
					}
					_this._paramsForGetScaledRect = {
						portWidth:_shellDims.width,
						portHeight:_shellDims.height,
						rectWidth:_this._imageNaturalWidth,
						rectHeight:_this._imageNaturalHeight
					};
					Uize.Node.isIe && _this.setNodeStyle ('image',{msInterpolationMode:'bicubic'});
					_this._updateUiPosition ();
				}
			};

			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					_this.setNodeStyle ('',{overflow:'hidden'});
					_this.setNodeStyle ('image',{position:'absolute'});
					_this.portVsScaledDelta = [];

					_superclass.prototype.wireUi.call (_this);
				}
			};

		/*** Public Instance-Static Methods ***/
			_classPrototype.getScaledRect = _class.getScaledRect = function (_params) {
				function _getDefaultedProperty (_propertyName) {
					return _params [_propertyName] !== _undefined ? _params [_propertyName] : _this.get (_propertyName);
				}
				var
					_this = this,
					_portWidth = _params.portWidth,
					_portHeight = _params.portHeight,
					_rectWidth = _params.rectWidth,
					_rectHeight = _params.rectHeight,
					_coordConverter = _getDefaultedProperty ('coordConverter'),
					_fillScaleFactorWidth = _portWidth / _rectWidth,
					_fillScaleFactorHeight = _portHeight / _rectHeight,
					_fitFillScaleFactors = {
						fit:Math.min (_fillScaleFactorWidth,_fillScaleFactorHeight),
						fill:Math.max (_fillScaleFactorWidth,_fillScaleFactorHeight)
					},
					_scaleFactorLowerBound = _fitFillScaleFactors [_getDefaultedProperty ('sizingLowerBound')] || 0,
					_scaleFactorUpperBound = _fitFillScaleFactors [_getDefaultedProperty ('sizingUpperBound')] || 0,
					_scaleFactor = Math.min (_scaleFactorLowerBound + (_scaleFactorUpperBound - _scaleFactorLowerBound) * _getDefaultedProperty ('sizingValue'),_getDefaultedProperty ('maxScaling')),
					_scaledWidth = _rectWidth * _scaleFactor,
					_scaledHeight = _rectHeight * _scaleFactor
				;
				return {
					left:_coordConverter ((_portWidth - _scaledWidth) * _getDefaultedProperty ('alignX')),
					top:_coordConverter ((_portHeight - _scaledHeight) * _getDefaultedProperty ('alignY')),
					width:_coordConverter (_scaledWidth),
					height:_coordConverter (_scaledHeight)
				};
			};

			_classPrototype.getSizingAndAlign = _class.getSizingAndAlign = function (_params) {
				function _getScaledArea (_sizing) {
					return _sizing == 'fit' ? _fitArea : (_sizing == 'fill' ? _fillArea : 0);
				}
				function _getDefaultedProperty (_propertyName) {
					return _params [_propertyName] !== _undefined ? _params [_propertyName] : _this.get (_propertyName);
				}
				var
					_this = this,
					_portWidth = _params.portWidth,
					_portHeight = _params.portHeight,
					_rectWidth = _params.rectWidth,
					_rectHeight = _params.rectHeight,
					_rectArea = _rectWidth * _rectHeight,
					_fillScaleFactorWidth = _portWidth / _rectWidth,
					_fillScaleFactorHeight = _portHeight / _rectHeight,
					_fitScaleFactor = Math.min (_fillScaleFactorWidth,_fillScaleFactorHeight),
					_fillScaleFactor = Math.max (_fillScaleFactorWidth,_fillScaleFactorHeight),
					_fitFillAreas = {
						fit:_fitScaleFactor * _fitScaleFactor * _rectArea,
						fill:_fillScaleFactor * _fillScaleFactor * _rectArea
					},
					_scaledAreaLowerBound = _fitFillAreas [_getDefaultedProperty ('sizingLowerBound')] || 0,
					_scaledAreaUpperBound = _fitFillAreas [_getDefaultedProperty ('sizingUpperBound')] || 0
				;
				return {
					sizingValue:
						Math.sqrt (_rectArea - _scaledAreaLowerBound) /
						Math.sqrt (_scaledAreaUpperBound - _scaledAreaLowerBound)
					,
					alignX:_getAlignForAxis (_params.rectX,_rectWidth,_portWidth),
					alignY:_getAlignForAxis (_params.rectY,_rectHeight,_portHeight)
				};
			};

		/*** State Properties ***/
			function _updateAfterPositionChanged () {
				this._updateUiPosition ();
				this.fire ('Position Changed');
			}

			_class.stateProperties ({
				_alignApplicableX:'alignApplicableX', // read only
				_alignApplicableY:'alignApplicableY', // read only
				_alignX:{
					name:'alignX',
					onChange:_updateAfterPositionChanged,
					value:.5
				},
				_alignY:{
					name:'alignY',
					onChange:_updateAfterPositionChanged,
					value:.5
				},
				_coordConverter:{
					name:'coordConverter',
					value:function (_number) {return _number}
				},
				_maxScaling:{
					name:'maxScaling',
					onChange:_updateAfterPositionChanged,
					value:Infinity
				},
				_sizingLowerBound:{
					name:'sizingLowerBound',
					onChange:_updateAfterPositionChanged,
					value:'fit'
				},
				_sizingUpperBound:{
					name:'sizingUpperBound',
					onChange:_updateAfterPositionChanged,
					value:'fill'
				},
				_sizingValue:{
					name:'sizingValue',
					onChange:_updateAfterPositionChanged,
					value:1
				}
			});

		return _class;
	}
});

