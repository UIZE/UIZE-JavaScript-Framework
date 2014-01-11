/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.RgbSliders.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 3
	codeCompleteness: 100
	docCompleteness: 30
*/

/*?
	Introduction
		The =Uize.Widgets.RgbSliders.Widget= class implements an RGB color picker interface, with sliders for adjusting levels for the red, green, and blue channels.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.RgbSliders.Widget= class...

			..................................................
			<< widget >>

			widgetClass: Uize.Widgets.RgbSliders.VisualSampler
			..................................................
*/

Uize.module ({
	name:'Uize.Widgets.RgbSliders.Widget',
	superclass:'Uize.Widget.V2',
	required:[
		'Uize.Color',
		'Uize.Widgets.Slider.Widget',
		'Uize.Widgets.RgbSliders.Html',
		'Uize.Widgets.RgbSliders.Css'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_undefined,
				_true = true,
				_false = false
			;

		return _superclass.subclass ({
			alphastructor:function () {
				var m = this;

				m._color = Uize.Color ();

				/*** Initialization ***/
					function _addSlider (_sliderName,_sliderColor) {
						var _slider = m.addChild (
							_sliderName,
							Uize.Widgets.Slider.Widget,
							{
								minValue:0,
								maxValue:255,
								orientation:'vertical',
								emptyColor:'#fff',
								fullColor:_sliderColor
							}
						);
						_slider.wire (
							'Changed.value',
							function () {
								m._settingSliders ||
									m.set ({_value:m._color.from (m._rgbSliders).to ('hex')})
								;
							}
						);
						return _slider;
					}
					m._rgbSliders = [
						_addSlider ('sliderR','#f00'),_addSlider ('sliderG','#0f0'),_addSlider ('sliderB','#00f')
					];
			},

			stateProperties:{
				_sliderHeight:'sliderHeight',
				_size:{
					name:'size',
					value:'medium'
				},
				_value:{
					name:'value',
					conformer:function (_value) {return Uize.Color.to (_value,'hex')},
					onChange:function () {
						var
							m = this,
							_children = m.children,
							_colorTuple = m._color.from (this._value).tuple
						;
						m._settingSliders = _true;
						_children.sliderR.set ({value:_colorTuple [0]});
						_children.sliderG.set ({value:_colorTuple [1]});
						_children.sliderB.set ({value:_colorTuple [2]});
						m._settingSliders = _false;
					},
					value:'000000'
				},
				_valueAsHexRgb:{
					name:'valueAsHexRgb',
					derived:'value: "#" + value'
				}
			},

			set:{
				html:Uize.Widgets.RgbSliders.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.RgbSliders.Css
			},

			cssBindings:{
				size:'value'
			},

			htmlBindings:{
				valueAsHexRgb:['swatch:html','swatch:style.background']
			}
		});
	}
});

