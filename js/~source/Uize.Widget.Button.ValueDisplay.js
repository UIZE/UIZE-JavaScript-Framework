/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Button.ValueDisplay Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2011 UIZE
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
		The =Uize.Widget.Button.ValueDisplay= widget provides the base functionality for button widget that wants to display details about a value.

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.Button.ValueDisplay',
	builder:function (_superclass) {
		/*** Class Constructor ***/
			var _class = _superclass.subclass ();

		/*** Register Properties ***/
			_class.registerProperties ({
				_defaultValueDetails:'defaultValueDetails',
				_value:'value',
				_valueDetails:{
					name:'valueDetails',
					conformer:function(_valueDetails) { return _valueDetails || this._defaultValueDetails }
				}
			});

		return _class;
	}
});

