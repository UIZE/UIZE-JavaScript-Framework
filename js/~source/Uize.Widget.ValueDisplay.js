/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.ValueDisplay Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=c" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Class
	importance: 2
	codeCompleteness: 100
	testCompleteness: 0
	docCompleteness: 10
*/

/*?
	Introduction
		The =Uize.Widget.ValueDisplay= widget provides the base functionality for all value widgets being used to display the value in a richer experience.

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.ValueDisplay',
	builder:function (_superclass) {
		/*** Class Constructor ***/
			var _class = _superclass.subclass ();

		/*** Register Properties ***/
			_class.registerProperties ({
				_value:'value',
				_valueDetails:'valueDetails'
			});

		return _class;
	}
});

