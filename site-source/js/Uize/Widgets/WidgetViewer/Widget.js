/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.WidgetViewer.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2014 UIZE
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
		The =Uize.Widgets.WidgetViewer.Widget= class implements a widget base class for the visual samplers and visual tests viewers.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.WidgetViewer.Widget',
	superclass:'Uize.Widget.V2',
	required:[
		'Uize.Widgets.WidgetViewer.Html',
		'Uize.Widgets.WidgetViewer.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticProperties:{
				cssModule:Uize.Widgets.WidgetViewer.Css
			},

			set:{
				html:Uize.Widgets.WidgetViewer.Html
			},

			stateProperties:{
				_modules:'modules',
				_value:'value'
			},

			eventBindings:{
				'#selector:change':function () {
					this.set ({value:this.getNodeValue ('selector')});
				},
				value:'selector:value'
			},

			htmlBindings:{
				loc_selectorLabel:'selectorLabel:value'
			}
		});
	}
});

