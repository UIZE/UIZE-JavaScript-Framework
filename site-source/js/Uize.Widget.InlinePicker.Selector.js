/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.InlinePicker.Selector Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2011-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 4
	codeCompleteness: 100
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.InlinePicker.Selector= class provides functionality for inline picker widgets that require selection from a set of values (like a radio button list)

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.InlinePicker.Selector',
	required:[
		'Uize.Widget.Options.Selector',
		'Uize.Widget.Button.ValueDisplay.Selector',
		'Uize.Util.Coupler'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Class Constructor ***/
			var _class = _superclass.subclass (
				null,
				function() {
					Uize.Util.Coupler({
						instances:[this, this.children.value],
						properties:['valueNo', 'tentativeValueNo']
					})
				}
			);

		/*** State Properties ***/
			_class.stateProperties ({
				_tentativeValueNo:{	// read-only
					name:'tentativeValueNo',
					value:-1
				},
				_valueNo:{
					name:'valueNo',	// read-only
					value:-1
				},
				_values:{
					name:'values',
					value:[]
				}
			});

		/*** Override Initial Values for Inherited State Properties ***/
			_class.set ({
				pipedProperties:['values'],
				valueDisplayWidgetClass:Uize.Widget.Button.ValueDisplay.Selector,
				valueWidgetClass:Uize.Widget.Options.Selector
			});

		return _class;
	}
});

