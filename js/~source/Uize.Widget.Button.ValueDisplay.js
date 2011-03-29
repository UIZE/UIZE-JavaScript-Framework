/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Button.ValueDisplay Class
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
	codeCompleteness: 100
	testCompleteness: 0
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.Button.ValueDisplay= widget provides the base functionality for connecting a =Uize.Widget.Button= widget (or subclass) to a =Uize.Widget.ValueDisplay= widget (or subclass).

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.Button.ValueDisplay',
	required:[
		'Uize.Widget.ValueDisplay',
		'Uize.Util.Coupler'
	],
	builder:function (_superclass) {
		/*** Class Constructor ***/
			var _class = _superclass.subclass (
				null,
				function() {
					var
						_this = this,
						_valueDisplay = _this.addChild(
							'valueDisplay',
							_this._valueDisplayWidgetClass || Uize.Widget.ValueDisplay,
							_this._valueDisplayWidgetProperties
						)
					;

					new Uize.Util.Coupler({
						instances:[_this, _valueDisplay],
						properties:['value', 'valueDetails']
					});
				}
			);

		/*** Register Properties ***/
			_class.registerProperties ({
				_value:'value',
				_valueDetails:'valueDetails',
				_valueDisplayWidgetClass:'valueDisplayWidgetClass',
				_valueDisplayWidgetProperties:'valueDisplayWidgetProperties'
			});

		return _class;
	}
});

