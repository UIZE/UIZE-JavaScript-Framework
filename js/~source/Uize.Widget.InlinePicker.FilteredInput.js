/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.InlinePicker.FilteredInput Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=e" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Class
	importance: 6
	codeCompleteness: 100
	testCompleteness: 0
	docCompleteness: 7
*/

/*?
	Introduction
		The =Uize.Widget.InlinePicker.FilteredInput= class implements an inline filtered input picker.

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.InlinePicker.FilteredInput',
	required:[
		'Uize.Widget.FilteredInput',
		'Uize.Widget.ValueDisplay.Selector'
	],
	builder:function (_superclass) {
		/*** Class Constructor ***/
			var _class = _superclass.subclass ();

		/*** Register Properties ***/
			_class.registerProperties ({
				_filter:'filter',
				_filters:'filters',
				_fullLinks:'fullLinks',
				_inputWidgetClass:'inputWidgetClass',
				_inputWidgetProperties:'inputWidgetProperties'
			});

		/*** Override Initial Values for Inherited Set-Get Properties ***/
			_class.set ({
				pipedProperties:['inputWidgetClass', 'inputWidgetProperties', 'filter', 'filters', 'fullLinks'],
				valueDisplayWidgetClass:Uize.Widget.ValueDisplay.Selector,
				valueWidgetClass:Uize.Widget.FilteredInput
			});

		return _class;
	}
});

