/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Picker.FilteredInput Class
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
	codeCompleteness: 50
	testCompleteness: 0
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.Picker.FilteredInput= class implements a filtered input picker widget, using a deferred loaded filtered input picker modal dialog to let the user select from an input.

		*DEVELOPERS:* `Ben Ilegbodu
*/

Uize.module ({
	name:'Uize.Widget.Picker.FilteredInput',
	required:'Uize.Date.Formatter',
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
				selectorButtonWidgetClass:Uize.Widget.ValueDisplay.Selector,
				dialogWidgetClass:'Uize.Widget.Dialog.Picker'
			});

		return _class;
	}
});

