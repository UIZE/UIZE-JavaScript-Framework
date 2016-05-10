/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Button.Toggle.OnOff.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2004-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 8
	codeCompleteness: 100
	docCompleteness: 80
*/

/*?
	Introduction
		The =Uize.Widgets.Button.Toggle.OnOff.Widget= class implements a simple on/off toggler button widget class.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Button.Toggle.OnOff.Widget= class...

			...........................................................
			<< widget >>

			widgetClass: Uize.Widgets.Button.Toggle.OnOff.VisualSampler
			...........................................................
*/

Uize.module ({
	name:'Uize.Widgets.Button.Toggle.OnOff.Widget',
	superclass:'Uize.Widgets.Button.Widget',
	required:[
		'Uize.Widgets.Button.Toggle.OnOff.Html',
		'Uize.Widgets.Button.Toggle.OnOff.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			set:{
				html:Uize.Widgets.Button.Toggle.OnOff.Html,
				clickToSelect:true,
				clickToDeselect:true
			},

			stateProperties:{
				text:{
					derived:'selected: selected ? "On" : "Off"'
				},
				selected:{
					name:'value'
				}
			},

			staticProperties:{
				cssModule:Uize.Widgets.Button.Toggle.OnOff.Css
			}
		});
	}
});

