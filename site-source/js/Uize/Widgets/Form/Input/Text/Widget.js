/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Form.Input.Text.Widget Class
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
		The =Uize.Widgets.Form.Input.Text.Widget= module implements a widget class.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Form.Input.Text.Widget= class...

			.......................................................
			<< widget >>

			widgetClass: Uize.Widgets.Form.Input.Text.VisualSampler
			.......................................................
*/

Uize.module ({
	name:'Uize.Widgets.Form.Input.Text.Widget',
	superclass:'Uize.Widget.V2',
	required:[
		'Uize.Widgets.Form.Input.Text.Html',
		'Uize.Widgets.Form.Input.Text.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			set:{
				html:Uize.Widgets.Form.Input.Text.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.Form.Input.Text.Css
			},

			stateProperties:{
				value:{value:''}
			},

			htmlBindings:{
				value:''
			},

			eventBindings:{
				'#:keyup':function (_event) {
					this.set ({value:_event.target.value});
				}
			}
		});
	}
});

