/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Pickers.Color.Widget Class
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
		The =Uize.Widgets.Pickers.Color.Widget= module implements a widget class.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Pickers.Color.Widget= class...

			.....................................................
			<< widget >>

			widgetClass: Uize.Widgets.Pickers.Color.VisualSampler
			.....................................................
*/

Uize.module ({
	name:'Uize.Widgets.Pickers.Color.Widget',
	superclass:'Uize.Widgets.Picker.Widget',
	required:'Uize.Widgets.Buttons.ColorSwatch.Widget',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			set:{
				value:'000000',
				dialogWidgetClass:'Uize.Widgets.Pickers.Dialogs.Color.Widget',
					/*?
						State Properties
							dialogWidgetClass
								A string, specifying the name of the color picker dialog class that should be used for selecting a color.

								NOTES
								- the initial value is ='Uize.Widgets.Pickers.Dialogs.Color.Widget'=
					*/
				selectorButtonWidgetClass:Uize.Widgets.Buttons.ColorSwatch.Widget
			},

			childBindings:{
				value:'->selector.value'
			}
		});
	}
});

