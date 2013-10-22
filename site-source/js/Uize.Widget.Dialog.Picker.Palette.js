/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Dialog.Picker.Palette
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
		The =Uize.Widget.Dialog.Picker.Palette= widget is a thin base class for picker dialog widgets that act as a droplist palette.

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.Dialog.Picker.Palette',
	required:[
		'Uize.Node',
		'Uize.Util.Coupler'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function () {
						var m = this;

						// Sync tentativeValue & tentativeValueDetails back and forth with value widget
						Uize.Util.Coupler({
							instances:[m, m.children.value],
							properties:['tentativeValue', 'tentativeValueDetails']
						});

						m.wire(
							'After Show',
							function () {
								m.children.value.updateUi();
								m._updateUiMinWidth();
							}
						);
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Methods ***/
			_classPrototype._updateUiMinWidth = function () {
				var m = this;

				if (m.isWired && m._minWidth) {
					m.setNodeStyle (
						'',
						{minWidth:m._minWidth}
					);
					Uize.Node.isIe
						&& Uize.Node.ieMajorVersion <= 7
						&& m.setNodeStyle (
							'valueShell',
							{minWidth:m._minWidth}
						)
					;
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_minWidth:{
					name:'minWidth',
					onChange:_classPrototype._updateUiMinWidth
				},
				_tentativeValue:{
					name:'tentativeValue',
					onChange:function () {
						var m = this;

						// Changed.tentativeValue could be fired prior to Changed.tentativeValueDetails, so break flow so that the tentativeValueDetails can be synced before the 'Submission Complete' event is fired
						setTimeout(
							function () {
								m.fireSubmissionComplete (
									true,
									{
										tentativeValue:m._tentativeValue,
										tentativeValueDetails:m._tentativeValueDetails
									}
								)
							},
							0
						);
					},
					value:null
				},
				_tentativeValueDetails:'tentativeValueDetails'
			});

		/*** Override Initial Values for Inherited State Properties ***/
			_class.set ({
				dismissOnShieldClick:true
			});

		return _class;
	}
});

