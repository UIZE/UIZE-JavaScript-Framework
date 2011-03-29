/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.InlinePicker Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=d" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Class
	importance: 6
	codeCompleteness: 100
	testCompleteness: 0
	docCompleteness: 7
*/

/*?
	Introduction
		The =Uize.Widget.InlinePicker= class acts as a base class for inline value picker widget classes, such as the =Uize.Widget.InlinePicker.Selector= class.

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.InlinePicker',
	superclass:'Uize.Widget.FormElement',
	required:'Uize.Widget.ValueDisplay',
	builder:function (_superclass) {
		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function () {
						var
							_this = this,
							_valueWidget = _this.addChild(
								'value',
								_this._valueWidgetClass,
								_this.get ((_this._pipedProperties || []).concat ('value'))
							),
							_valueDisplayWidget = _this.addChild(
								'valueDisplay',
								_this._valueDisplayWidgetClass || Uize.Widget.ValueDisplay,
								_this._valueDisplayWidgetProperties
							)
						;
						
						_valueWidget.wire({
							'Changed.value':function() { _valueDisplayWidget.set({value:_valueWidget.valueOf()}) },
							'Changed.valueDetails':function() { _valueDisplayWidget.set({valueDetails:_valueWidget.get('valueDetails')}) }
						});
					}
				)
			;

		/*** Register Properties ***/
			_class.registerProperties ({
				_pipedProperties:'pipedProperties',
					/*?
						Set-get Properties
							pipedProperties
								document...

								NOTES
								- the initial value is =undefined=
					*/
				_valueDisplayWidgetClass:'valueDisplayWidgetClass',
				_valueDisplayWidgetProperties:'valueDisplayWidgetProperties',
				_valueFormatter:'valueFormatter',
					/*?
						Set-get Properties
							valueFormatter
								document...
									NOTES
									- the initial value is =undefined=
					*/
				_valueWidgetClass:'valueWidgetClass'
			});

		return _class;
	}
});

