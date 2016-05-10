/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Pickers.Date.Widget Class
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
		The =Uize.Widgets.Pickers.Date.Widget= module implements a widget class.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Pickers.Date.Widget= class...

			....................................................
			<< widget >>

			widgetClass: Uize.Widgets.Pickers.Date.VisualSampler
			....................................................
*/

Uize.module ({
	name:'Uize.Widgets.Pickers.Date.Widget',
	superclass:'Uize.Widgets.Picker.Widget',
	required:'Uize.Widgets.Buttons.Date.Widget',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			stateProperties:{
				_displayFormat:{
					name:'displayFormat',
					value:'{YYYY}-{MM}-{DD}'
					/*?
						State Properties
							displayFormat
								A string, specifying the format for displaying the selected date value in the instance's =input= DOM node.

								The default =valueFormatter= set for this class uses the =Uize.Date.Formatter.format= static method of the =Uize.Date.Formatter= module to format date values. Formatting options supported by the =displayFormat= property correspond to those supported by the =formatSTR= parameter of the =Uize.Date.Formatter.format= method. If you specify your own value for the =valueFormatter= state property that is inherited from the =Uize.Widget.Picker= base class, then the value of the =displayFormat= property will only be applicable if your custom value formatter actually uses it.

								NOTES
								- the initial value is ='{YYYY}-{MM}-{DD}'=
					*/
				}
			},

			set:{
				value:undefined,
				dialogWidgetClass:'Uize.Widgets.Pickers.Dialogs.Date.Widget',
					/*?
						State Properties
							dialogWidgetClass
								A string, specifying the name of the date picker dialog class that should be used for selecting a date.

								NOTES
								- the initial value is ='Uize.Widgets.Pickers.Dialogs.Date.Widget'=
					*/
				selectorButtonWidgetClass:Uize.Widgets.Buttons.Date.Widget,
				pipedProperties:[
					'displayFormat',
						/*?
							State Properties
								displayFormat
									A string,...

									NOTES
									- the value of this property is piped through to the =displayFormat= state property of the date picker dialog instance
									- the initial value is =undefined=
						*/
					'maxValue',
						/*?
							State Properties
								minValue
									A string or instance of JavaScript's =Date= object, representing the earliest date that can be selected by the user (i.e. the minimum value for the =value= state property).

									Values specified for this property can be of the =dateSTRorOBJ= value type supported by the =Uize.Date.resolve= method of the =Uize.Date= module.

									NOTES
									- see the companion =maxValue= state property
									- the value of this property is piped through to the =minValue= state property of the date picker dialog instance
									- the initial value is =undefined=
						*/
					'minValue'
						/*?
							State Properties
								maxValue
									A string or instance of JavaScript's =Date= object, representing the latest date that can be selected by the user (i.e. the maximum value for the =value= state property).

									Values specified for this property can be of the =dateSTRorOBJ= value type supported by the =Uize.Date.resolve= method of the =Uize.Date= module.

									NOTES
									- see the companion =minValue= state property
									- the value of this property is piped through to the =maxValue= state property of the date picker dialog instance
									- the initial value is =undefined=
						*/
				],
				valueFormatter:function (_value) {return Uize.Date.Formatter.format (_value,this._displayFormat)}
			}
		});
	}
});

