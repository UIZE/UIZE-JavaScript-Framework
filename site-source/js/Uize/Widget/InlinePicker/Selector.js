/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.InlinePicker.Selector Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2011-2015 UIZE
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

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
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

		return _superclass.subclass ({
			omegastructor:function () {
				Uize.Util.Coupler({
					instances:[this, this.children.value],
					properties:['valueNo', 'tentativeValueNo']
				});
			},

			instanceMethods:{
				getValueObject:function (_name) {
					return Uize.findRecord (this._values,{name:_name == undefined ? this + '' : _name});
				}
			},

			stateProperties:{
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
			},

			set:{
				pipedProperties:['values'],
				valueDisplayWidgetClass:Uize.Widget.Button.ValueDisplay.Selector,
				valueWidgetClass:Uize.Widget.Options.Selector
			}
		});
	}
});

