/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Button.ValueDisplay.Selector Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=e" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Class
	importance: 7
	codeCompleteness: 100
	testCompleteness: 0
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.Button.ValueDisplay.Selector= widget provides the functionality for displaying an option value within an options selector

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.Button.ValueDisplay.Selector',
	required:[
		'Uize.Widget.ValueDisplay.Selector',
		'Uize.Util.Coupler'
	],
	builder:function (_superclass) {
		/*** Class Constructor ***/
			var _class = _superclass.subclass (
				null,
				function() {
					var
						_this = this,
						_selectorValueDisplay = _this.children.valueDisplay
					;
					
					new Uize.Util.Coupler({
						instances:[_this, _selectorValueDisplay],
						properties:['selected']
					});
					
					_this.wire(
						'Changed.state',
						function() { _selectorValueDisplay.set({tentativeSelected:_this.get('state') == 'over'}) }
					);
				}
			);

		/*** Override Initial Values for Inherited Set-Get Properties ***/
			_class.set ({
				valueDisplayWidgetClass:Uize.Widget.ValueDisplay.Selector
			});

		return _class;
	}
});

