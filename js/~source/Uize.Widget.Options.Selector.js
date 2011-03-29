/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Options.Selector Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=d" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Class
	importance: 7
	codeCompleteness: 50
	testCompleteness: 0
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.Options.Selector= widget provides the functionality for specific type of input UI widget that allows for single selection of an option among a discrete set of options, with additional optional sort and search capabilities.

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.Options.Selector',
	required:'Uize.Widget.Button.ValueDisplay.Selector',
	builder:function (_superclass) {
		/*** Class Constructor ***/
			var _class = _superclass.subclass (
				null,
				function() {
					var _this = this;
					
					// TODO: Add sort & search child widgets
					
					_this.wire(
						'Changed.value',
						function() { _this.set({_valueDetails:_this.get('values')[_this.get('valueNo')]}) }
					);
				}
			);

		/*** Register Properties ***/
			_class.registerProperties ({
				_filter:{
					name:'filter',
					onChange:function() {
						//console.log(this._filter);
					},
					value:[]
				},
				// TODO: mode & modes
				_valueDetails:'valueDetails'
			});

		/*** Override Initial Values for Inherited Set-Get Properties ***/
			_class.set ({
				optionWidgetClass:Uize.Widget.Button.ValueDisplay.Selector
			});

		return _class;
	}
});

