/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Dialog.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2016 UIZE
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
		The =Uize.Widgets.Dialog.Widget= class implements a very basic widget for a box layout with a heading.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.Dialog.Widget',
	superclass:'Uize.Widget.Dialog',
	required:[
		'Uize.Widget.mV2',
		'Uize.Widget',
		'Uize.Widgets.Button.Widget',
		'Uize.Widget.Dialog.xResizable',
		'Uize.Widgets.Dialog.Html',
		'Uize.Widgets.Dialog.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			mixins:Uize.Widget.mV2,

			hasLoc:true,

			set:{
				html:Uize.Widgets.Dialog.Html,
				children:{
					ok:{flavor:'primary'}
				},
				built:false
			},

			staticProperties:{
				cssModule:Uize.Widgets.Dialog.Css,
				buttonWidgetClass:Uize.Widgets.Button.Widget
			},

			stateProperties:{
				/*** derived properties ***/
					defaultCancelText:{
						derived:'loc_cancelLabel'
					},
					defaultOkText:{
						derived:'loc_okLabel'
					}
			},

			children:{
				contents:{
					widgetClass:Uize.Widget
				}
			},

			cssBindings:{
				resizable:['','resizable']
			}
		});
	}
});

