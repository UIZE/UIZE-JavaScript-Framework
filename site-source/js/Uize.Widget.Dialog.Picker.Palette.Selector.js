/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Dialog.Picker.Palette.Selector
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2011-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 4
	codeCompleteness: 50
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.Dialog.Picker.Palette.Selector= widget lets the user select a value from a modal dialog containing a set of options (i.e. a droplist).

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.Dialog.Picker.Palette.Selector',
	required:[
		'Uize.Widget.Options.Selector',
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
			function _fireSubmissionComplete(_propertiesChanged) {
				this.fireSubmissionComplete(true, _propertiesChanged)
			}
			_class.stateProperties ({
				_tentativeValueNo:{
					name:'tentativeValueNo',	// read-only
					onChange:_fireSubmissionComplete,
					value:-1
				},
				_valueNo:{
					name:'valueNo',	// read-only
					onChange:_fireSubmissionComplete,
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
				valueWidgetClass:Uize.Widget.Options.Selector,
				shieldOpacity:.01
			});

		return _class;
	}
});

