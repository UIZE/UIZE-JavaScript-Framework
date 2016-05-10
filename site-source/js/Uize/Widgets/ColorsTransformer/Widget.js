/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.ColorsTransformer.Widget Class
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
		The =Uize.Widgets.ColorsTransformer.Widget= class implements a widget for transforming the hue, saturation, and lightness of a set of colors.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.ColorsTransformer.Widget= class...

			.........................................................
			<< widget >>

			widgetClass: Uize.Widgets.ColorsTransformer.VisualSampler
			.........................................................
*/

Uize.module ({
	name:'Uize.Widgets.ColorsTransformer.Widget',
	superclass:'Uize.Widget.V2',
	required:[
		'Uize.Color',
		'Uize.Widgets.ColorsTransformer.ShiftAndRange.Widget',
		'Uize.Widgets.Buttons.Reset.Widget',
		'Uize.Widgets.ColorsTransformer.Html',
		'Uize.Color.ColorsHslTransformer'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_shiftAndRangeWidgetClass = Uize.Widgets.ColorsTransformer.ShiftAndRange.Widget
		;

		return _superclass.subclass ({
			hasLoc:true,

			mixins:Uize.Color.ColorsHslTransformer.mixin,

			set:{
				html:Uize.Widgets.ColorsTransformer.Html
			},

			stateProperties:{
				sliderTrackLength:{value:300}
			},

			children:{
				hueShiftAndRange:{
					widgetClass:_shiftAndRangeWidgetClass,
					shiftExtent:180
				},
				saturationShiftAndRange:{
					widgetClass:_shiftAndRangeWidgetClass,
					shiftExtent:100
				},
				lightnessShiftAndRange:{
					widgetClass:_shiftAndRangeWidgetClass,
					shiftExtent:100
				},
				reset:{
					widgetClass:Uize.Widgets.Buttons.Reset.Widget,
					action:function () {
						this.parent.set ({
							hueRange:50,
							hueShift:0,
							saturationRange:50,
							saturationShift:0,
							lightnessRange:50,
							lightnessShift:0
						});
					}
				}
			},

			childBindings:{
				hueShift:'hueShiftAndRange.shift',
				hueRange:'hueShiftAndRange.range',
				saturationShift:'saturationShiftAndRange.shift',
				saturationRange:'saturationShiftAndRange.range',
				lightnessShift:'lightnessShiftAndRange.shift',
				lightnessRange:'lightnessShiftAndRange.range',
				loc_hue:'->hueShiftAndRange.heading',
				loc_saturation:'->saturationShiftAndRange.heading',
				loc_lightness:'->lightnessShiftAndRange.heading',
				sliderTrackLength:[
					'->hueShiftAndRange.sliderTrackLength',
					'->saturationShiftAndRange.sliderTrackLength',
					'->lightnessShiftAndRange.sliderTrackLength'
				]
			}
		});
	}
});

