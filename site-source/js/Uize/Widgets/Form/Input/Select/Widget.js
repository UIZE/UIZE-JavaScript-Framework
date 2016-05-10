/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Form.Input.Select.Widget Class
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
		The =Uize.Widgets.Form.Input.Select.Widget= module implements a widget class.

		*DEVELOPERS:*

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Form.Input.Select.Widget= class...

			.........................................................
			<< widget >>

			widgetClass: Uize.Widgets.Form.Input.Select.VisualSampler
			.........................................................
*/

Uize.module ({
	name:'Uize.Widgets.Form.Input.Select.Widget',
	superclass:'Uize.Widget.FormElement.Select',
	required:[
		'Uize.Widget.mV2',
		'Uize.Widgets.Form.Input.Select.Html',
		'Uize.Widgets.Form.Input.Select.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			mixins:Uize.Widget.mV2,

			set:{
				html:Uize.Widgets.Form.Input.Select.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.Form.Input.Select.Css
			},

			cssBindings:{
				enabledInherited:['disabled','']
			}
		});
	}
});

