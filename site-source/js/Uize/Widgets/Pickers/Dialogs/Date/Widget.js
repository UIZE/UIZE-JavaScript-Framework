/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Pickers.Dialogs.Date.Widget
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 4
	codeCompleteness: 100
	docCompleteness: 80
*/

/*?
	Introduction
		The =Uize.Widgets.Pickers.Dialogs.Date.Widget= widget lets the user select a date from a modal dialog containing a calendar widget, with support for valid date ranges.

		*DEVELOPERS:* `Chris van Rensburg`

		### In a Nutshell
			- intended to be used by =Uize.Widgets.Pickers.Date.Widget= class, but can be used on its own...
				- provide example
			- uses an instance of the =Uize.Widgets.Calendar.Widget= class in its implementation to let users pick a date
*/

Uize.module ({
	name:'Uize.Widgets.Pickers.Dialogs.Date.Widget',
	required:'Uize.Widgets.Calendar.Widget',
	superclass:'Uize.Widgets.Dialog.Picker.Widget',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			hasLoc:true,

			set:{
				valueWidgetClass:Uize.Widgets.Calendar.Widget,
				pipedProperties:[
					'displayFormat',
						/*?
							State Properties
								displayFormat
									.

									NOTES
									- this value of this property is piped through to the =displayFormat= state property of the =Uize.Widgets.Calendar.Widget= value widget
									- the initial value is =undefined=
						*/
					'maxValue',
						/*?
							State Properties
								minValue
									.

									NOTES
									- see the companion =maxValue= state property
									- this value of this property is piped through to the =maxValue= state property of the =Uize.Widgets.Calendar.Widget= value widget
									- the initial value is =undefined=
						*/
					'minValue'
						/*?
							State Properties
								maxValue
									.

									NOTES
									- see the companion =minValue= state property
									- this value of this property is piped through to the =minValue= state property of the =Uize.Widgets.Calendar.Widget= value widget
									- the initial value is =undefined=
						*/
				]
			}
		});
	}
});

