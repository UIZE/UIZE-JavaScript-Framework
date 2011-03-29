/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Picker.Date Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=e" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Class
	importance: 4
	codeCompleteness: 100
	testCompleteness: 0
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widget.Picker.Date= class implements a date picker widget, using a deferred loaded date picker modal dialog to let the user select a date.

		*DEVELOPERS:* `Chris van Rensburg`

	Key Features
		The =Uize.Widget.Picker.Date= class implements the following key features...

		Valid Date Range
			The =Uize.Widget.Picker.Date= class lets you constrain the date range within which a user can select a date by specifying values for the =minValue= and =maxValue= set-get properties.

			This allows you, for example, to configure date pickers to let users pick...

			- any date in the past, up until today
			- any date from today on into the future
			- a date this week
			- a date this month
			- a date this year
			- a date this century
			- a date between any arbitrary, configurable start and end points

			You can specify the value =undefined=, =null=, or =''= (empty string) for either - or both - of the =minValue= and =maxValue= properties. In other words, the valid date range can have a start point but no end point, an end point but no start point, both a start point *and* an end point, or no bounds whatsoever.

		Configurable Date Display Format
			The way that the currently selected date is displayed in an instance's =input= implied node can be configured using the =displayFormat= set-get property.

			This property lets you specify a format string - the same kind of format string that can be specified when using the =Uize.Date.format= static method of the =Uize.Date= module.

		Deferred Loading of Dialog
			The dialog that is launched to let the user select a date is deferred loaded, so that it does not add to the initial load time of the page.

			Deferred loading of the date picker dialog includes deferred loading of all JavaScript modules needed by the dialog widget, deferred building and insertion of the HTML markup for the widget, and deferred wiring up of the date picker dialog widget. This allows many =Uize.Widget.Picker.Date= instances to be wired up on a page without adding much to the setup time for the page.

		Dialog Sharing
			Multiple instances of the =Uize.Widget.Picker.Date= class share the same date picker dialog instance.

			When the date picker dialog is launched, the values of the =value=, =minValue=, and =maxValue= set-get properties of the =Uize.Widget.Picker.Date= instance are relayed to the date picker dialog instance, allowing multiple =Uize.Widget.Picker.Date= instances to share the same dialog widget. Whenever the dialog is launched for a specific date picker instance, the dialog's state is synchronized to the state of the date picker instance. This improves performance in a number of ways.

		Dialog Mooring
			When the date picker dialog is launched for a specific =Uize.Widget.Picker.Date= instance, the dialog is "moored" to the root node of the instance's =selector= button.

			The value of the =offsetX= and =offsetY= set-get properties of the dialog are set to half the width and height of the selector button's root node, respectively, so that the top left corner of the dialog should be positioned by the center of the selector button. If the window is resized, the dialog will be repositioned so that it remains moored to the same point.

		Custom Dialogs
			The =Uize.Widget.Picker.Date= class lets you specify a custom date picker dialog class that should be used for selecting a date.

			By default, the =Uize.Widget.Picker.Date= class uses the =Uize.Widget.Dialog.Picker.Date= dialog class to allow the user to select a date. This default can be overrided by setting the value of the =dialogWidgetClass= set-get property for an instance of the =Uize.Widget.Picker.Date= class. Alternatively, a subclass of =Uize.Widget.Picker.Date= could set the initial value for the =dialogWidgetClass= property using the subclass' static =set= method. Any custom date picker dialog class is likely to be a subclass of the =Uize.Widget.Dialog.Picker.Date= class.
*/

Uize.module ({
	name:'Uize.Widget.Picker.Date',
	required:'Uize.Date.Formatter',
	builder:function (_superclass) {
		/*** Class Constructor ***/
			var _class = _superclass.subclass ();

		/*** Register Properties ***/
			_class.registerProperties ({
				_displayFormat:{
					name:'displayFormat',
					value:'{YYYY}-{MM}-{DD}'
					/*?
						Set-get Properties
							displayFormat
								A string, specifying the format for displaying the selected date value in the instance's =input= implied node.

								The default =valueFormatter= set for this class uses the =Uize.Date.Formatter.format= static method of the =Uize.Date.Formatter= module to format date values. Formatting options supported by the =displayFormat= property correspond to those supported by the =formatSTR= parameter of the =Uize.Date.Formatter.format= method. If you specify your own value for the =valueFormatter= set-get property that is inherited from the =Uize.Widget.Picker= base class, then the value of the =displayFormat= property will only be applicable if your custom value formatter actually uses it.

								NOTES
								- the initial value is ='{YYYY}-{MM}-{DD}'=
					*/
				}
			});

		/*** Override Initial Values for Inherited Set-Get Properties ***/
			_class.set ({
				dialogWidgetClass:'Uize.Widget.Dialog.Picker.Date',
					/*?
						Set-get Properties
							dialogWidgetClass
								A string, specifying the name of the date picker dialog class that should be used for selecting a date.

								NOTES
								- the initial value is ='Uize.Widget.Dialog.Picker.Date'=
					*/
				pipedProperties:[
					'displayFormat',
						/*?
							Set-get Properties
								displayFormat
									A string,...

									NOTES
									- the value of this property is piped through to the =displayFormat= set-get property of the date picker dialog instance
									- the initial value is =undefined=
						*/
					'maxValue',
						/*?
							Set-get Properties
								minValue
									A string or instance of JavaScript's =Date= object, representing the earliest date that can be selected by the user (ie. the minimum value for the =value= set-get property).

									Values specified for this property can be of the =dateSTRorOBJ= value type supported by the =Uize.Date.resolve= method of the =Uize.Date= module.

									NOTES
									- see the companion =maxValue= set-get property
									- the value of this property is piped through to the =minValue= set-get property of the date picker dialog instance
									- the initial value is =undefined=
						*/
					'minValue'
						/*?
							Set-get Properties
								maxValue
									A string or instance of JavaScript's =Date= object, representing the latest date that can be selected by the user (ie. the maximum value for the =value= set-get property).

									Values specified for this property can be of the =dateSTRorOBJ= value type supported by the =Uize.Date.resolve= method of the =Uize.Date= module.

									NOTES
									- see the companion =minValue= set-get property
									- the value of this property is piped through to the =maxValue= set-get property of the date picker dialog instance
									- the initial value is =undefined=
						*/
				],
				value:null,
				valueFormatter:function (_value) {return Uize.Date.Formatter.format (_value,this._displayFormat)}
			});

		return _class;
	}
});

