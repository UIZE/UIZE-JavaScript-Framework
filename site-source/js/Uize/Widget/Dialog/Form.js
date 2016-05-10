/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Dialog.Form Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2006-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 3
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.Dialog.Form= class implements support for FORM-based dialogs, where the dialog result is an object with the values of its form inputs.

		*DEVELOPERS:* `Guang-Yu Xu`
*/

Uize.module ({
	name:'Uize.Widget.Dialog.Form',
	required:[
		'Uize.Data.Compare',
		'Uize.Dom.Form'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize_Dom_Form = Uize.Dom.Form
		;

		return _superclass.subclass ({
			alphastructor:function () {
				var m = this;

				m._isModified = false;

				/*** add event handler ***/
					function _handleOk(_qualifiedOk) {
						if (!m._theForm)
							return m.fire ('Submission Complete');

						var _result = m.getResult();
						if (_result.isModified)
							m._formData = _result.formData;

						_result.isQualifiedOk = _qualifiedOk;
						m.fire ({name:'Submission Complete',result:_result});
						m._isModified = false;
					}

					m.wire ({
						'Ok': function () { _handleOk(false); },
						'Qualified Ok': function () { _handleOk(true); },
						'Cancel': function () {
							if (m._theForm) {
								m._isModified = m.getResult().isModified;
							}
						},
						'Before Show': function () {
							m._theForm && m._formData && m._isModified &&
								_Uize_Dom_Form.setValues(m._formData)
							;
						}
					});
			},

			instanceMethods:{
				wireUi:function () {
					var m = this;
					if (!m.isWired) {
						/*** initialization ***/
							var _theForm = m._theForm = m.getNode('form');
							if (_theForm && !m._formData)
								m._formData = _Uize_Dom_Form.getValues(_theForm);

							_superclass.doMy (m,'wireUi');
					}
				},

				getResult:function () {
					var
						m = this,
						_formData = _Uize_Dom_Form.getValues(m._theForm)
					;
					return {isModified:!Uize.Data.Compare.identical(m._formData, _formData), formData:_formData};
				}
			},

			stateProperties:{
				_formData:{
					name:'formData',
					value:null,
					onChange:function () {
						_Uize_Dom_Form.setValues(this._formData);
					}
				}
			}
		});
	}
});

