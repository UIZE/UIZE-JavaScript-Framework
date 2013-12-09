/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.FormDialog Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 100
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.FormDialog= class serves as a thin widget to plumb the value of a =Uize.Widget.Form= widget (or subclass) as the dialog submission value.

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.FormDialog',
	superclass:'Uize.Widget.Dialog',
	required:'Uize.Widget.Form',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				var
					m = this,
					_false = false,
					_form = m.addChild(
						'form',
						m._formWidgetClass,
						{useNormalSubmit:_false}
					)
				;

				_form.wire(
					'Changed.okToSubmit',
					function () {
						_form.get('okToSubmit')
							&& m.handleFormValue(
								function (_info) {
									m.fire ({
										name:'Submission Complete',
										result:_form.get('value'),
										info:_info
									});

									m.set({shown:_false});
								}
							)
						;
					}
				);

				m.wire({
					Ok:function (_event) {
						_form.submit();
						_event.abort = true;
					},
					'Before Show':function () {
						if (m._value)
							_form.set({value:Uize.clone(m._value)})
						;
					},
					'After Show':function () { _form.updateUi() },
					'After Hide':function () { _form.reset() }
				});
			},

			instanceMethods:{
				handleFormValue:function (_callback) { _callback() }
			},

			stateProperties:{
				_formWidgetClass:{
					name:'formWidgetClass',
					value:Uize.Widget.Form
				},
				_value:'value'
			}
		});
	}
});
