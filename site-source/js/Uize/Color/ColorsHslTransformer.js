/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Color.ColorsHslTransformer Class
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
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Color.ColorsHslTransformer= module implements a class for transforming the hue, saturation, and lightness of a set of colors in a performant manner.

		*DEVELOPERS:* `Chris van Rensburg`
*/

/* TODO:
	- factor out code for getting min color and getting max color (add some method to Uize.Color.xUtil)
*/

Uize.module ({
	name:'Uize.Color.ColorsHslTransformer',
	superclass:'Uize.Class',
	required:[
		'Uize.Color',
		'Uize.Data.Util'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_blendValues = Uize.blendValues,
				_getColumn = Uize.Data.Util.getColumn,
				_Uize_Color = Uize.Color,
				_min = Uize.min,
				_max = Uize.max,

			/*** General Variables ***/
				_workingColor = _Uize_Color ('hsl(0,0,0)')
		;

		function _mixin (_class) {
			_class.declare ({
				stateProperties:{
					colors:{
						value:[]
					},
					hueRange:{
						value:50
					},
					hueShift:{
						value:0
					},
					saturationRange:{
						value:50
					},
					saturationShift:{
						value:0
					},
					lightnessRange:{
						value:50
					},
					lightnessShift:{
						value:0
					},
					colorsAsTupless:{
						derived:{
							properties:'colors',
							derivation:function (_colors) {
								return Uize.map (
									_colors,
									function (_color) {return _Uize_Color.from (_color).setEncoding ('HSL array').tuple}
								);
							}
						}
					},
					colorsMaxMin:{
						derived:{
							properties:'colorsAsTupless',
							derivation:function (_colorsAsTuples) {
								var
									_tuplesComponent0 = _getColumn (_colorsAsTuples,0),
									_tuplesComponent1 = _getColumn (_colorsAsTuples,1),
									_tuplesComponent2 = _getColumn (_colorsAsTuples,2)
								;
								return {
									_component0Min:_min (_tuplesComponent0),
									_component0Max:_max (_tuplesComponent0),
									_component1Min:_min (_tuplesComponent1),
									_component1Max:_max (_tuplesComponent1),
									_component2Min:_min (_tuplesComponent2),
									_component2Max:_max (_tuplesComponent2)
								};
							}
						}
					},
					transformedColors:{
						derived:{
							properties:[
								'colorsAsTupless', 'colorsMaxMin', 'hueRange', 'hueShift', 'saturationRange', 'saturationShift', 'lightnessRange', 'lightnessShift'
							],
							derivation:function (
								_colorsAsTuples, _colorsMaxMin, _hueRange, _hueShift, _saturationRange, _saturationShift, _lightnessRange, _lightnessShift
							) {
								function _transformComponent (
									_value,_minValue,_maxValue,_componentMin,_componentMax,_range,_shift,_shiftMode
								) {
									if (_range != 50)
										_value = _range > 50
											? _blendValues (
												_value,
												_blendValues (
													_componentMin,
													_componentMax,
													(_value - _minValue) / (_maxValue - _minValue || 1)
												),
												(_range - 50) / 50
											)
											: _blendValues ((_minValue + _maxValue) / 2,_value,_range / 50)
									;
									if (_shift)
										_value = _shiftMode == 'wrap'
											? (((_value + _shift) % _componentMax) + _componentMax) % _componentMax
											: Uize.constrain (_value + _shift,_componentMin,_componentMax)
									;
									return _value;
								}

								return Uize.map (
									_colorsAsTuples,
									function (_colorAsTuple) {
										_Uize_Color.setTuple (
											_workingColor.tuple,
											_transformComponent (
												_colorAsTuple [0],
												_colorsMaxMin._component0Min,_colorsMaxMin._component0Max,
												0,360,
												_hueRange,_hueShift,
												'wrap'
											),
											_transformComponent (
												_colorAsTuple [1],
												_colorsMaxMin._component1Min,_colorsMaxMin._component1Max,
												0,100,
												_saturationRange,_saturationShift
											),
											_transformComponent (
												_colorAsTuple [2],
												_colorsMaxMin._component2Min,_colorsMaxMin._component2Max,
												0,100,
												_lightnessRange,_lightnessShift
											)
										);
										return _workingColor.to ('hex');
									}
								);
							}
						}
					}
				}
			});
		}

		return _superclass.subclass ({
			mixins:_mixin,

			staticMethods:{
				mixin:_mixin
			}
		});
	}
});

