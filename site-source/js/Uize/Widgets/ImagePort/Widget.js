/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.ImagePort.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widgets.ImagePort.Widget= module implements a widget class.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.ImagePort.Widget= class...

			..................................................
			<< widget >>

			widgetClass: Uize.Widgets.ImagePort.VisualSampler
			..................................................
*/

Uize.module ({
	name:'Uize.Widgets.ImagePort.Widget',
	superclass:'Uize.Widget.ImagePort',
	required:[
		'Uize.Widget.mV2',
		'Uize.Widget.mWidthHeight',
		'Uize.Widgets.ImagePort.Html',
		'Uize.Widgets.ImagePort.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			mixins:[
				Uize.Widget.mV2,
				Uize.Widget.mWidthHeight
			],

			set:{
				html:Uize.Widgets.ImagePort.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.ImagePort.Css
			},

			stateProperties:{
				imageUrl:{}
			},

			htmlBindings:{
				imageUrl:'image:src'
			}
		});
	}
});

