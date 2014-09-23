/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.ColorsTransformer.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2014 UIZE
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
		'Uize.Widgets.Slider.Widget',
		'Uize.Widgets.Buttons.Reset.Widget',
		'Uize.Widgets.ColorsTransformer.Html',
		'Uize.Widgets.ColorsTransformer.Css',
		'Uize.Widget.mChildBindings',
		'Uize.Color.ColorsHslTransformer'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			mixins:[
				Uize.Color.ColorsHslTransformer.mixin,
				Uize.Widget.mChildBindings
			],

			set:{
				html:Uize.Widgets.ColorsTransformer.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.ColorsTransformer.Css
			},

			children:Uize.copyInto (
				Uize.map (
					{
						hueRangeSlider:[0,100,50],
						hueShiftSlider:[-180,180,0],
						saturationRangeSlider:[0,100,50],
						saturationShiftSlider:[-100,100,0],
						lightnessRangeSlider:[0,100,50],
						lightnessShiftSlider:[-100,100,0]
					},
					function (_arguments) {
						return {
							widgetClass:Uize.Widgets.Slider.Widget,
							increments:0,
							orientation:'horizontal',
							fullColor:'#fff',
							emptyColor:'#fff',
							trackLength:470,
							minValue:_arguments [0],
							maxValue:_arguments [1],
							value:_arguments [2]
						};
					}
				),
				{
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
				}
			),

			childBindings:{
				hueRange:'hueRangeSlider.value',
				hueShift:'hueShiftSlider.value',
				saturationRange:'saturationRangeSlider.value',
				saturationShift:'saturationShiftSlider.value',
				lightnessRange:'lightnessRangeSlider.value',
				lightnessShift:'lightnessShiftSlider.value'
			}
		});
	}
});

