/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.FilteredInput Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=c" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Class
	importance: 6
	codeCompleteness: 0
	testCompleteness: 0
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.FilteredInput= widget provides functionality for...

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.FilteredInput',
	required:[
		'Uize.Widget.FilterGroups',
		'Uize.Util.Coupler'
	],
	builder:function (_superclass) {
		/*** Variables for Scruncher Optimization ***/
			var
				_null = null
			;
			
		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					_null,
					function() {
						var
							_this = this,
							_Uize = Uize,
							
							_inputWidget = _this.addChild(
								'input',
								_this._inputWidgetClass,
								_Uize.copyInto(
									{},
									_this._filter ? {filter:_this._filter} : _null,
									_this._inputWidgetProperties
								)
							),
							_filterGroupsWidget = _this.addChild(
								'filterGroups',
								_Uize.Widget.FilterGroups,
								_Uize.copyInto(
									{},
									_this._filters ? {values:_this._filters} : _null,
									_this._filter ? {value:_this._filter} : _null
								)
							)
						;

						new Uize.Util.Coupler({
							instances:[_inputWidget, _this],
							properties:['value']
						});
						
						// sync any changes to the input's valueDetails
						_inputWidget.wire(
							'Changed.valueDetails',
							function() { _this.set({_valueDetails:_inputWidget.get('valueDetails')}) }
						);
						
						// pass along filter changes to the input widget
						_filterGroupsWidget.wire(
							'Changed.value',
							function() { _inputWidget.set({filter:_filterGroupsWidget.valueOf()})}
						);
					}
				)
			;

		/*** Register Properties ***/
			_class.registerProperties ({
				_filter:'filter',
				_filters:'filters',
				_inputWidgetClass:'inputWidgetClass',
				_inputWidgetProperties:'inputWidgetProperties',
				_value:{
					name:'value',
					value:null
				},
				_valueDetails:'valueDetails'
			});

		return _class;
	}
});

