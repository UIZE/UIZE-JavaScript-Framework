/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Math.LogicalPos Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 2
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Math.LogicalPos= module provides methods for working with logical positioning of rectangles within a view port.

		*DEVELOPERS:* `Chris van Rensburg`

		The =Uize.Math.LogicalPos= class supports logical sizing behaviors such as fit and fill, and logical positioning behaviors such as left, center, and right aligned, or top, center, and bottom aligned, among others.
*/

Uize.module ({
	name:'Uize.Math.LogicalPos',
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,
				_Math = Math,

			/*** references to statics used internally ***/
				_getScaledRect,

			/*** General Variables ***/
				_paramDefaults = {
					coordConverter:Uize.returnX,
					sizingLowerBound:'fit',
					sizingUpperBound:'fill',
					sizingValue:1,
					maxScaling:Infinity,
					alignX:.5,
					alignY:.5
				}
		;

		/*** Utility Functions ***/
			function _getDefaultedParam (_propertyName,_params,_defaults) {
				return (
					_params [_propertyName] !== _undefined
						? _params [_propertyName]
						: (_defaults || _paramDefaults) [_propertyName]
				);
			}

			function _fitOrFill (_rect,_port,_align,_isFill) {
				if (typeof _rect == 'number')
					_rect = {width:_rect,height:1}
				;
				return _getScaledRect (
					Uize.copyInto (
						{
							rectWidth:_rect.width,
							rectHeight:_rect.height,
							portWidth:_port.width,
							portHeight:_port.height,
							sizingValue:+_isFill
						},
						_align
					)
				);
			}

		return Uize.package ({
			getScaledRect:_getScaledRect = function (_params,_defaults) {
				/* PARAMS:
					- rectWidth
					- rectHeight
					- portWidth
					- portHeight
					- coordConverter
					- sizingLowerBound
					- sizingUpperBound
					- sizingValue
					- maxScaling
					- alignX
					- alignY
				*/
				var
					_portWidth = _params.portWidth,
					_portHeight = _params.portHeight,
					_rectWidth = _params.rectWidth,
					_rectHeight = _params.rectHeight,
					_coordConverter = _getDefaultedParam ('coordConverter',_params,_defaults),
					_fillScaleFactorWidth = _portWidth / _rectWidth,
					_fillScaleFactorHeight = _portHeight / _rectHeight,
					_fitFillScaleFactors = {
						fit:_Math.min (_fillScaleFactorWidth,_fillScaleFactorHeight),
						fill:_Math.max (_fillScaleFactorWidth,_fillScaleFactorHeight)
					},
					_scaleFactorLowerBound =
						_fitFillScaleFactors [_getDefaultedParam ('sizingLowerBound',_params,_defaults)] || 0,
					_scaleFactorUpperBound =
						_fitFillScaleFactors [_getDefaultedParam ('sizingUpperBound',_params,_defaults)] || 0,
					_scaleFactor = _Math.min (
						_scaleFactorLowerBound + (_scaleFactorUpperBound - _scaleFactorLowerBound) * _getDefaultedParam ('sizingValue',_params,_defaults),
						_getDefaultedParam ('maxScaling',_params,_defaults)
					),
					_scaledWidth = _rectWidth * _scaleFactor,
					_scaledHeight = _rectHeight * _scaleFactor
				;
				return {
					left:_coordConverter ((_portWidth - _scaledWidth) * _getDefaultedParam ('alignX',_params,_defaults)),
					top:_coordConverter ((_portHeight - _scaledHeight) * _getDefaultedParam ('alignY',_params,_defaults)),
					width:_coordConverter (_scaledWidth),
					height:_coordConverter (_scaledHeight)
				};
			},

			getSizingAndAlign:function (_params,_defaults) {
				/* PARAMS:
					- rectX
					- rectY
					- rectWidth
					- rectHeight
					- portWidth
					- portHeight
					- sizingLowerBound
					- sizingUpperBound
				*/
				function _getAlignForAxis (_pos,_dim,_portDim,_alignPin0,_alignPin1) {
					if (typeof _alignPin0 != 'number') _alignPin0 = parseFloat (_alignPin0) || 0;
					if (typeof _alignPin1 != 'number') _alignPin1 = parseFloat (_alignPin1) || 1;
					_pos = +_pos + _alignPin0 * _dim;
					_dim *= (_alignPin1 - _alignPin0);
					return _dim == _portDim ? .5 : _pos / (_portDim - _dim);
				}
				var
					_portWidth = _params.portWidth,
					_portHeight = _params.portHeight,
					_rectWidth = _params.rectWidth,
					_rectHeight = _params.rectHeight,
					_rectArea = _rectWidth * _rectHeight,
					_fillScaleFactorWidth = _portWidth / _rectWidth,
					_fillScaleFactorHeight = _portHeight / _rectHeight,
					_fitScaleFactor = _Math.min (_fillScaleFactorWidth,_fillScaleFactorHeight),
					_fillScaleFactor = _Math.max (_fillScaleFactorWidth,_fillScaleFactorHeight),
					_fitFillAreas = {
						fit:_fitScaleFactor * _fitScaleFactor * _rectArea,
						fill:_fillScaleFactor * _fillScaleFactor * _rectArea
					},
					_scaledAreaLowerBound = _fitFillAreas [_getDefaultedParam ('sizingLowerBound',_params,_defaults)] || 0,
					_scaledAreaUpperBound = _fitFillAreas [_getDefaultedParam ('sizingUpperBound',_params,_defaults)] || 0
				;
				return {
					sizingValue:
						_Math.sqrt (_rectArea - _scaledAreaLowerBound) /
						_Math.sqrt (_scaledAreaUpperBound - _scaledAreaLowerBound)
					,
					alignX:_getAlignForAxis (_params.rectX,_rectWidth,_portWidth),
					alignY:_getAlignForAxis (_params.rectY,_rectHeight,_portHeight)
				};
			},

			fit:function (_rect,_port,_align) {
				return _fitOrFill (_rect,_port,_align,0);
			},

			fill:function (_rect,_port,_align) {
				return _fitOrFill (_rect,_port,_align,1);
			}
		});
	}
});

