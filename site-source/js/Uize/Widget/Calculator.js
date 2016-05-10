/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Calculator Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 3
	codeCompleteness: 95
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widget.Calculator= class implements a calculator widget that uses the =Uize.Widget.Button= widget class for buttons and that doesn't impose any HTML layout or CSS styling.

		*DEVELOPERS:* `Chris van Rensburg`

		The =Uize.Widget.Calculator= class subclasses the =Uize.Widget.CalculatorAbstract= abstract class (which implements all the calculator logic), and is provided primarily for backwards compatibility that is needed by the UIZE site's [[../javascript-widgets.html][Widgets to Go]] page. For a newer calculator widget class that includes encapsulated layout and styling, see the =Uize.Widgets.Calculator.Widget= class.
*/

Uize.module ({
	name:'Uize.Widget.Calculator',
	superclass:'Uize.Widget.CalculatorAbstract',
	required:[
		'Uize.Widget.Button',
		'Uize.Widget.TextInput'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticProperties:{
				buttonWidgetClass:Uize.Widget.Button,
				textInputWidgetClass:Uize.Widget.TextInput
			}
		});
	}
});

