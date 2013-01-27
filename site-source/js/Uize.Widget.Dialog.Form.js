/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Dialog.Form Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2006-2013 UIZE
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
		'Uize.Data',
		'Uize.Node.Form'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false,
				_Uize_Node_Form = Uize.Node.Form
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					function () {
						var _this = this;

						_this._isModified = _false;

						/*** add event handler ***/
							function _handleOk(_qualifiedOk) {
								if (!_this._theForm)
									return _this.fire ('Submission Complete');

								var _result = _this.getResult();
								if (_result.isModified)
									_this._formData = _result.formData;

								_result.isQualifiedOk = _qualifiedOk;
								_this.fire ({name:'Submission Complete',result:_result});
								_this._isModified = _false;
							}

							_this.wire ({
								'Ok': function () { _handleOk(_false); },
								'Qualified Ok': function () { _handleOk(_true); },
								'Cancel': function () {
									if (_this._theForm) {
										_this._isModified = _this.getResult().isModified;
									}
								},
								'Before Show': function () {
									_this._theForm && _this._formData && _this._isModified &&
										_Uize_Node_Form.setValues(_this._formData)
									;
								}
							});
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Public Instance Methods ***/
			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					/*** initialization ***/
						var _theForm = _this._theForm = _this.getNode('form');
						if (_theForm && !_this._formData)
							_this._formData = _Uize_Node_Form.getValues(_theForm);

						_superclass.prototype.wireUi.call (_this);
				}
			};

			_classPrototype.getResult = function() {
				var
					_this = this,
					_formData = _Uize_Node_Form.getValues(_this._theForm)
				;
				return {isModified:!Uize.Data.identical(_this._formData, _formData), formData:_formData};
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_formData:{
					name:'formData',
					value:null,
					onChange:function() {
						_Uize_Node_Form.setValues(this._formData);
					}
				}
			});

		return _class;
	}
});

