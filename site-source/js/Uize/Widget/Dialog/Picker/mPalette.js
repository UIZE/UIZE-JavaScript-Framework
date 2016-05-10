/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Dialog.Picker.mPalette
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015-2016 UIZE
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
		The =Uize.Widget.Dialog.Picker.mPalette= widget mixin is a thin base class for picker dialog widgets that act as a droplist palette.

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.Dialog.Picker.mPalette',
	required:[
		'Uize.Dom.Basics',
		'Uize.Util.Coupler'
	],
	builder:function () {
		'use strict';

		/*** Private Methods ***/
			function _updateUiMinWidth (m) {
				if (m.isWired && m.minWidth) {
					m.setNodeStyle (
						'',
						{minWidth:m.minWidth}
					);
					Uize.Dom.Basics.isIe
						&& Uize.Dom.Basics.ieMajorVersion <= 7
						&& m.setNodeStyle (
							'valueShell',
							{minWidth:m.minWidth}
						)
					;
				}
			}

		return function (_class) {
			_class.declare({
				omegastructor:function () {
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
							_updateUiMinWidth(m);
						}
					);
				},

				stateProperties:{
					minWidth:{
						name:'minWidth',
						onChange:function () {_updateUiMinWidth (this)}
					},
					tentativeValue:{
						name:'tentativeValue',
						onChange:function () {
							var m = this;

							// Changed.tentativeValue could be fired prior to Changed.tentativeValueDetails, so break flow so that the tentativeValueDetails can be synced before the 'Submission Complete' event is fired
							setTimeout(
								function () {
									m.fireSubmissionComplete (
										true,
										{
											tentativeValue:m.tentativeValue,
											tentativeValueDetails:m.tentativeValueDetails
										}
									);
								},
								0
							);
						},
						value:null
					},
					tentativeValueDetails:'tentativeValueDetails'
				},

				set:{
					dismissOnShieldClick:true
				}
			});
		};
	}
});
