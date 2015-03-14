/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Dialog.Picker.Palette.mSelector
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Mixin
	importance: 4
	codeCompleteness: 50
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.Dialog.Picker.Palette.mSelector= widget mixin lets the user select a value from a modal dialog containing a set of options (i.e. a droplist).

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.Dialog.Picker.Palette.mSelector',
	required:[
		'Uize.Widget.Options.Selector',
		'Uize.Util.Coupler'
	],
	builder:function () {
		'use strict';

		/*** Private Instance Methods ***/
			function _fireSubmissionComplete (_propertiesChanged) {
				this.fireSubmissionComplete (true, _propertiesChanged);
			}

		return function (_class) {
			_class.declare({
				omegastructor:function () {
					var
						m = this,
						_valueWidget = m.children.value
					;
					m.wire(
						'After Show',
						function () { _valueWidget.updateUi() }
					);
					Uize.Util.Coupler({
						instances:[m, _valueWidget],
						properties:['valueNo', 'tentativeValueNo']
					});
				},

				stateProperties:{
					tentativeValueNo:{
						name:'tentativeValueNo',	// read-only
						onChange:_fireSubmissionComplete,
						value:-1
					},
					valueNo:{
						name:'valueNo',	// read-only
						onChange:_fireSubmissionComplete,
						value:-1
					},
					values:{
						name:'values',
						value:[]
					}
				},

				set:{
					pipedProperties:['values'],
					valueWidgetClass:Uize.Widget.Options.Selector,
					shieldOpacity:.01
				}
			});
		};
	}
});
