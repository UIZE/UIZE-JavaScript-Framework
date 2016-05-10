/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.ColorSliders.Vert.Combo.Widget Class
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
		The =Uize.Widgets.ColorSliders.Vert.Combo.Widget= module implements a widget class.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.ColorSliders.Vert.Combo.Widget= class...

			...............................................................
			<< widget >>

			widgetClass: Uize.Widgets.ColorSliders.Vert.Combo.VisualSampler
			...............................................................
*/

Uize.module ({
	name:'Uize.Widgets.ColorSliders.Vert.Combo.Widget',
	superclass:'Uize.Widget.V2',
	required:[
		'Uize.Widgets.ColorSliders.Vert.Combo.Html',
		'Uize.Widgets.ColorSliders.Vert.Combo.Css',
		'Uize.Widgets.Button.Widget',
		'Uize.Widgets.ColorSliders.Vert.Rgb.Widget',
		'Uize.Widgets.ColorSliders.Vert.Hsl.Widget',
		'Uize.Color',
		'Uize.Util.PropertyAdapter'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** General Variables ***/
				_modes = ['hsl','rgb']
		;

		return _superclass.subclass ({
			hasLoc:true,

			alphastructor:function () {
				var m = this;

				Uize.forEach (
					_modes,
					function (_mode) {
						m.addedChildren.once (
							_mode,
							function () {
								Uize.Util.PropertyAdapter ({
									propertyA:m,
									propertyB:m.children [_mode]
								});
							}
						);
					}
				);
			},

			set:{
				html:Uize.Widgets.ColorSliders.Vert.Combo.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.ColorSliders.Vert.Combo.Css
			},

			staticMethods:{
				modes:function (_modes) {
					var m = this;
					Uize.forEach (
						_modes,
						function (_mode) {
							var
								_modeSelectedProperty = _mode + 'Selected',
								_modeButtonName = _mode + 'Button'
							;
							m.declare ({
								children:Uize.pairUp (
									_mode,{},
									_modeButtonName,{
										widgetClass:Uize.Widgets.Button.Widget,
										action:function () {this.parent.set ({mode:_mode})}
									}
								),
								childrenLinked:Uize.pairUp (_mode,_modeSelectedProperty),
								stateProperties:Uize.pairUp (
									_modeSelectedProperty,{derived:'mode: mode == "' + _mode + '"'}
								),
								childBindings:Uize.pairUp (
									_modeSelectedProperty,'->' + _modeButtonName + '.selected',
									'loc_' + _mode,'->' + _modeButtonName + '.text',
									'sliderHeight','->' + _mode + '.sliderHeight'
								),
								htmlBindings:Uize.pairUp (_modeSelectedProperty,_mode + ':show')
							});
						}
					);
				}
			},

			modes:_modes,

			stateProperties:{
				mode:{value:_modes [0]},
				value:{
					value:'fc6',
					conformer:function (_value) {
						return Uize.Color.to (_value,'hex');
					}
				},
				sliderHeight:{value:250},

				/*** derived properties ***/
					valueAsRgbHex:{
						derived:'value: Uize.Color.from (value).to ("#hex")'
					}
			},

			children:{
				rgb:{widgetClass:Uize.Widgets.ColorSliders.Vert.Rgb.Widget},
				hsl:{widgetClass:Uize.Widgets.ColorSliders.Vert.Hsl.Widget}
			},

			htmlBindings:{
				valueAsRgbHex:'swatch:style.backgroundColor'
			}
		});
	}
});

