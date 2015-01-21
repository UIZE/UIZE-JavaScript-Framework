/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.ColorSliders.Vert.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 5
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Widgets.ColorSliders.Vert.Widget= module implements a widget class.

		*DEVELOPERS:*

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.ColorSliders.Vert.Widget= class...

			.........................................................
			<< widget >>

			widgetClass: Uize.Widgets.ColorSliders.Vert.VisualSampler
			.........................................................
*/

Uize.module ({
	name:'Uize.Widgets.ColorSliders.Vert.Widget',
	superclass:'Uize.Widget.V2',
	required:[
		'Uize.Widgets.ColorSliders.Vert.Html',
		'Uize.Widgets.ColorSliders.Vert.Css',
		'Uize.Color'
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
					m.set ({_value:m._color.from ([_children.slider0,_children.slider1,_children.slider2]).to ('hex')})
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
								slider0:{value:_colorTuple [0]},
								slider1:{value:_colorTuple [1]},
								slider2:{value:_colorTuple [2]}
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
					}
			},

			set:{
				html:Uize.Widgets.ColorSliders.Vert.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.ColorSliders.Vert.Css
			},

			children:Uize.lookup (['slider0','slider1','slider2'],{orientation:'vertical',trackLength:'100%'}),

			htmlBindings:{
				sliderHeightPx:[
					'slider0:style.height',
					'slider1:style.height',
					'slider2:style.height'
				]
			},

			eventBindings:{
				'slider0:Changed.value':_updateValueFromSliders,
				'slider1:Changed.value':_updateValueFromSliders,
				'slider2:Changed.value':_updateValueFromSliders
			}
		});
	}
});

