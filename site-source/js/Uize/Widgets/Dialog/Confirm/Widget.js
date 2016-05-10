/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Dialog.Confirm.Widget Class
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
		The =Uize.Widgets.Dialog.Confirm.Widget= module implements a widget class.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Dialog.Confirm.Widget= class...

			......................................................
			<< widget >>

			widgetClass: Uize.Widgets.Dialog.Confirm.VisualSampler
			......................................................
*/

Uize.module ({
	name:'Uize.Widgets.Dialog.Confirm.Widget',
	superclass:'Uize.Widgets.Dialog.Widget',
	required:[
		'Uize.Widgets.FlavoredMessage.Widget',
		'Uize.Widgets.Dialog.Confirm.Css'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** references to methods used internally ***/
				_handleConfirm
		;

		return _superclass.subclass ({
			hasLoc:true,

			staticProperties:{
				cssModule:Uize.Widgets.Dialog.Confirm.Css
			},

			instanceMethods:{
				handleConfirm:_handleConfirm = function (_event) {
					this.fire ({name:'Submission Complete',result:_event.name == 'Ok'});
				}
			},

			stateProperties:{
				_message:{
					name:'message',
					value:''
				},
				_mode:{
					name:'mode',
					value:'confirm'
				},
				_state:{
					name:'state',
					value:'info'
					/* NOTES: states that are supported
						- info (e.g. "i" in blue circle)
						- warning (e.g. "!" in orange triangle)
						- error (e.g. "!" in red triangle, or "x" in red circle)
						- confirm (e.g. "?" in gray speech bubble)
						- success (e.g. green check mark, or check mark in a circle)
					*/
				},

				/*** derived properties ***/
					defaultTitle:{
						derived:'mode,loc_confirmTitle,loc_alertTitle: mode == "confirm" ? loc_confirmTitle : loc_alertTitle'
					}
			},

			childBindings:{
				_message:'->contents.message',
				_state:'->contents.flavor'
			},

			children:{
				contents:{widgetClass:Uize.Widgets.FlavoredMessage.Widget}
			},

			eventBindings:{
				':Ok':_handleConfirm,
				':Cancel':_handleConfirm,
				':Close':_handleConfirm
			},

			cssBindings:{
				_mode:'value'
			}
		});
	}
});

