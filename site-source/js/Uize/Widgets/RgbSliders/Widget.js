/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.RgbSliders.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2015 UIZE
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

		/*** Private Instance Methods ***/
			function _updateValueFromSliders () {
				var
					m = this,
					_children = m.children
				;
				m._settingSliders ||
					m.set ({_value:m._color.from ([_children.sliderR,_children.sliderG,_children.sliderB]).to ('hex')})
				;
			}

		return _superclass.subclass ({
			alphastructor:function () {
				this._color = Uize.Color ();
			},

			stateProperties:{
				_sliderHeight:{
					name:'sliderHeight',
					value:286
				},
				_value:{
					name:'value',
					conformer:function (_value) {return Uize.Color.to (_value,'hex')},
					onChange:function () {
						var
							m = this,
							_colorTuple = m._color.from (m._value).tuple
						;
						m._settingSliders = true;
						m.set ({
							children:{
								sliderR:{value:_colorTuple [0]},
								sliderG:{value:_colorTuple [1]},
								sliderB:{value:_colorTuple [2]}
							}
						});
						m._settingSliders = false;
					},
					value:'000000'
				},

				/*** derived properties ***/
					_sliderHeightPx:{
						name:'sliderHeightPx',
						derived:'sliderHeight: sliderHeight + "px"'
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

			children:{
				sliderR:{
					widgetClass:Uize.Widgets.Slider.Widget,
					minValue:0,
					maxValue:255,
					orientation:'vertical',
					trackLength:'100%',
					fullColor:'#f00'
				},
				sliderG:{
					widgetClass:Uize.Widgets.Slider.Widget,
					minValue:0,
					maxValue:255,
					orientation:'vertical',
					trackLength:'100%',
					fullColor:'#0f0'
				},
				sliderB:{
					widgetClass:Uize.Widgets.Slider.Widget,
					minValue:0,
					maxValue:255,
					orientation:'vertical',
					trackLength:'100%',
					fullColor:'#00f'
				}
			},

			htmlBindings:{
				valueAsHexRgb:['swatch:html','swatch:style.background'],
				sliderHeightPx:[
					'sliderR:style.height',
					'sliderG:style.height',
					'sliderB:style.height'
				]
			},

			eventBindings:{
				'sliderR:Changed.value':_updateValueFromSliders,
				'sliderG:Changed.value':_updateValueFromSliders,
				'sliderB:Changed.value':_updateValueFromSliders
			}
		});
	}
});

