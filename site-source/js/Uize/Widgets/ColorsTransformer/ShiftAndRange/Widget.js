/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.ColorsTransformer.ShiftAndRange.Widget Class
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
		The =Uize.Widgets.ColorsTransformer.ShiftAndRange.Widget= class implements a widget for letting the user adjust shift and range transformtion values for a single color component.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.ColorsTransformer.ShiftAndRange.Widget= class...

			.......................................................................
			<< widget >>

			widgetClass: Uize.Widgets.ColorsTransformer.ShiftAndRange.VisualSampler
			.......................................................................
*/

/* TODO:
	- factor out commonalities in CSS between this widget and the log widget
		- centered title
		- title state property and binding to HTML
		- heading styling to accommodate top right button
*/

Uize.module ({
	name:'Uize.Widgets.ColorsTransformer.ShiftAndRange.Widget',
	superclass:'Uize.Widgets.BoxWithHeading.Widget',
	required:[
		'Uize.Widgets.Slider.Widget',
		'Uize.Widgets.Buttons.Reset.Widget',
		'Uize.Widgets.ColorsTransformer.ShiftAndRange.Html',
		'Uize.Widgets.ColorsTransformer.ShiftAndRange.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			hasLoc:true,

			set:{
				html:Uize.Widgets.ColorsTransformer.ShiftAndRange.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.ColorsTransformer.ShiftAndRange.Css
			},

			stateProperties:{
				shiftExtent:{value:100},
				shift:{value:0},
				range:{value:50},
				heading:{value:''},
				sliderTrackLength:{value:'100%'},

				/*** derived properties ***/
					_shiftSliderMinValue:{derived:'shiftExtent: -shiftExtent'},
					_shiftSliderMaxValue:{derived:'shiftExtent'},
					_shiftSliderMinValueLabel:{derived:'shiftExtent: "-" + shiftExtent'},
					_shiftSliderMaxValueLabel:{derived:'shiftExtent: "+" + shiftExtent'}
			},

			children:Uize.copyInto (
				Uize.map (
					{
						shiftSlider:{},
						rangeSlider:{
							minValue:0,
							maxValue:100
						}
					},
					function (_properties) {
						return Uize.copyInto (
							_properties,
							{
								widgetClass:Uize.Widgets.Slider.Widget,
								increments:0,
								orientation:'horizontal'
							}
						);
					}
				),
				{
					reset:{
						widgetClass:Uize.Widgets.Buttons.Reset.Widget,
						action:function () {
							this.parent.set ({
								shift:0,
								range:50
							});
						}
					}
				}
			),

			childBindings:{
				_shiftSliderMinValue:'shiftSlider.minValue',
				_shiftSliderMaxValue:'shiftSlider.maxValue',
				shift:'shiftSlider.value',
				range:'rangeSlider.value',
				sliderTrackLength:[
					'->shiftSlider.trackLength',
					'->rangeSlider.trackLength'
				]
			},

			htmlBindings:{
				heading:'title',
				loc_shift:'shiftLabel',
				loc_range:'rangeLabel',
				_shiftSliderMinValueLabel:'shiftMinValue',
				_shiftSliderMaxValueLabel:'shiftMaxValue'
			}
		});
	}
});

