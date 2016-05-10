/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.ColorSliders.Vert.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015-2016 UIZE
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

		*DEVELOPERS:* `Chris van Rensburg`

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
				var m = this;
				if (!m._settingSliders) {
					var _children = m.children;
					Uize.Color.setTuple (m._color.tuple,+_children.channel0,+_children.channel1,+_children.channel2);
					m.set ({_value:m._color});
				}
			}

		return _superclass.subclass ({
			alphastructor:function () {
				(this._color = Uize.Color ()).setEncoding (this.Class.colorEncoding);
			},

			stateProperties:{
				_sliderHeight:{
					name:'sliderHeight',
					value:286
				},
				_value:{
					name:'value',
					conformer:function (_value) {return Uize.Color.to (_value,this.Class.colorEncoding)},
					onChange:function () {
						var
							m = this,
							_colorTuple = m._color.from (m._value).tuple
						;
						m._settingSliders = true;
						m.set ({
							children:{
								channel0:{value:_colorTuple [0]},
								channel1:{value:_colorTuple [1]},
								channel2:{value:_colorTuple [2]}
							}
						});
						m._settingSliders = false;
					},
					value:'000000'
				}
			},

			set:{
				html:Uize.Widgets.ColorSliders.Vert.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.ColorSliders.Vert.Css,
				colorEncoding:'hex'
			},

			children:Uize.lookup (
				['channel0','channel1','channel2'],
				{
					orientation:'vertical',
					trackLength:'100%',
					increments:1
				}
			),

			htmlBindings:{
				sliderHeight:[
					'channel0:style.height',
					'channel1:style.height',
					'channel2:style.height'
				],
				loc_channel0Label:'channel0Label',
				loc_channel0Tooltip:'channel0Label:title',
				loc_channel1Label:'channel1Label',
				loc_channel1Tooltip:'channel1Label:title',
				loc_channel2Label:'channel2Label',
				loc_channel2Tooltip:'channel2Label:title'
			},

			eventBindings:{
				'channel0:Changed.value':_updateValueFromSliders,
				'channel1:Changed.value':_updateValueFromSliders,
				'channel2:Changed.value':_updateValueFromSliders
			}
		});
	}
});

