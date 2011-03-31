/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Dialog.Picker.FilteredInput
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=e" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 50
	testCompleteness: 0
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.Dialog.Picker.FilteredInput= widget lets the user select a value from a modal dialog containing a filtered input widget.

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.Dialog.Picker.FilteredInput',
	required:'Uize.Widget.FilteredInput',
	builder:function (_superclass) {
		/*** Class Constructor ***/
			var _class = _superclass.subclass (
				null,
				function() {
					var _this = this;
					
					_this.wire(
						'After Show',
						function() {
							_this._minWidth
								&& _this.setNodeStyle(
									'',
									{minWidth:_this._minWidth}
								)
						}
					);
				}
			);

		/*** Register Properties ***/
			_class.registerProperties ({
				_filter:'filter',
				_filters:'filters',
				_inputWidgetClass:'inputWidgetClass',
				_inputWidgetProperties:'inputWidgetProperties',
				_minWidth:'minWidth'
			});

		/*** Override Initial Values for Inherited Set-Get Properties ***/
			_class.set ({
				valueWidgetClass:Uize.Widget.FilteredInput,
				pipedProperties:['inputWidgetClass', 'inputWidgetProperties', 'filter', 'filters'],
				dismissOnShieldClick:true
			});

		return _class;
	}
});

