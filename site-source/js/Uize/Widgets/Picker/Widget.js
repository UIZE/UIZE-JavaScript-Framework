/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Picker.Widget Class
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
		The =Uize.Widgets.Picker.Widget= module implements a widget class.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Picker.Widget= class...

			..............................................
			<< widget >>

			widgetClass: Uize.Widgets.Picker.VisualSampler
			..............................................
*/

Uize.module ({
	name:'Uize.Widgets.Picker.Widget',
	superclass:'Uize.Widget.Picker',
	required:[
		'Uize.Widget.mV2',
		'Uize.Widgets.Picker.Html',
		'Uize.Widgets.Picker.Css',
		'Uize.Widgets.Button.Square.Widget'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			mixins:Uize.Widget.mV2,

			set:{
				html:Uize.Widgets.Picker.Html,
				selectorButtonWidgetClass:Uize.Widgets.Button.Square.Widget
			},

			staticProperties:{
				cssModule:Uize.Widgets.Picker.Css
			},

			instanceMethods:{
				getDialogWidgetProperties:function () {
					return {
						locale:this.get ('localeInherited'),
						dismissOnShieldClick:'Ok'
					};
				}
			}
		});
	}
});

