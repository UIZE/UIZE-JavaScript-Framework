/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Button.Toggle.OnOff.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2004-2013 UIZE
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

		var _class = _superclass.subclass ({
			alphastructor:function () {
				var _this = this;
				_this.onChange ('selected',function (_selected) {_this.set ({text:_selected ? 'On' : 'Off'})});
			},

			set:{
				html:Uize.Widgets.Button.Toggle.OnOff.Html,
				clickToSelect:true,
				clickToDeselect:true
			},

			staticProperties:{
				cssModule:Uize.Widgets.Button.Toggle.OnOff.Css
			}
		});

		return _class;
	}
});

