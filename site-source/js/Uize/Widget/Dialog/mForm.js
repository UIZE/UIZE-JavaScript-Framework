/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Dialog.mForm Mixin
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Mixin
	importance: 6
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.Dialog.mForm= mixin module implements features to facilitate the creation of form dialogs (dialogs containing forms).

		*DEVELOPERS:* `Rachel Lopatin`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name: 'Uize.Widget.Dialog.mForm',
	required: 'Uize.Widget.Form',
	builder:function () {
		'use strict';

		

		return function (_class) {
			_class.declare ({
				omegastructor: function () {
					var
						m = this,
						_false = false,
						_form = m.addChild(
							'form',
							m.formWidgetClass,
							{ useNormalSubmit: _false }
						)
					;

					_form.wire({
						'Changed.okToSubmit': function () {
							_form.get('okToSubmit')
								&& m.handleFormValue(
									function (_info) {
										m.fire({
											name: 'Submission Complete',
											result: _form.get('value'),
											info: _info
										});

										m.set({ shown: _false });
									}
								)
							;
						},
						'Changed.numWarningsShown': function () {
							// if the dialog changes height, update the position to prevent the case where the bottom of the dialog gets pushed out of view.
							m.updateUiPositionIfShown();
						}
					});

					m.wire({
						Ok: function (_event) {
							_form.submit();
							_event.abort = true;
						},
						'Before Show': function () {
							if (m.value)
								_form.set({ value: Uize.clone(m.value) })
							;
						},
						'After Show': function () { _form.updateUi() },
						'After Hide': function () { _form.reset() }
					});
				},

				instanceMethods: {
					handleFormValue: function (_callback) { _callback() }
				},

				stateProperties: {
					formWidgetClass: {
						name: 'formWidgetClass',
						value: Uize.Widget.Form
					},
					value: 'value'
				}
			});
		};
	}
});

