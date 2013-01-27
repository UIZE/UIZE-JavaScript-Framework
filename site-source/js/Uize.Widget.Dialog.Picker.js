/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Dialog.Picker
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 80
	docCompleteness: 10
*/

/*?
	Introduction
		The =Uize.Widget.Dialog.Picker= widget acts as a base class for various value picker dialogs, such as date picker dialogs, color picker dialogs, etc.

		*DEVELOPERS:* `Chris van Rensburg`

		### In a Nutshell
			- intended to be subclassed to create value picker dialogs for specific types of values, such as dates, colors, etc.

			Piped Properties
				- don't need to be declared as state properties, although they will be created in an ad hoc fashion when they are set on the picker dialog instance

				A One Way Conduit
					- these properties only act as a conduit for values
					- they do not have the same conformer behavior as their counterparts in the value widget
					- they are not updated when their counterparts in the value widget change value
					- their values are only piped through to their counterparts in the value widget when the picker dialog instance is about to be shown
*/

Uize.module ({
	name:'Uize.Widget.Dialog.Picker',
	required:'Uize.Widget.Button.Checkbox',
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_false = false,
				_true = true
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function () {
						var _this = this;

						/*** submit value ***/
							function _fireSubmissionComplete (_keepOpen) {
								var
									_valueWidget = _this.children.value,
									_valueDetails = _valueWidget.get('valueDetails'),
									_undefined
								;

								_this._submittedValue = _true;

								_this.fireSubmissionComplete(
									_keepOpen,
									Uize.copyInto(
										{value:_valueWidget.valueOf ()},
										_valueDetails !== _undefined
											? {valueDetails:_valueDetails}
											: _undefined
									)
								);
							}

						/*** add the value child widget ***/
							_this.addChild ('value',_this._valueWidgetClass).wire (
								'Changed.value',
								function () {
									!_this._beforeShow
										// Changed.value will be fired prior to Changed.valueDetails, so break flow so that the valueDetails can be synced before the 'Submission Complete' event is fired
										&& setTimeout(
											function() {
										_fireSubmissionComplete (_this._keepOpen);
										_this._keepOpen || _this.set ({shown:_false});
											},
											0
										)
									;
								}
								/*?
									Child Widget
										value
											.
								*/
							);

						/*** add the keepOpen button ***/
							_this.addChild ('keepOpen',Uize.Widget.Button.Checkbox).wire (
								'Changed.selected',
								function (_event) {_this.set ({_keepOpen:_event.source.get ('selected')})}
								/*?
									Child Widget
										keepOpen Child Widget
											.
								*/
							);

						/*** add event handlers ***/
							function _handleDismiss() {
								_this._submittedValue
									&& _this.fire ({
											name:'Submission Complete',
											result:{value:_this._initialValue}
										})
								;
							}
							_this.wire ({
								Ok:function () {_fireSubmissionComplete ()},
								Cancel:_handleDismiss,
								Close:_handleDismiss,
								'Before Show':function () {
									/* WORKAROUND:
										Ideally, the dialog class would have a state state property to indicate whether or not the dialog is actually shown, versus it just being desired to be shown because the shown state property is set to true.

										Another high level concept is the idea of whether or not the value of a state property is completely reflected, which could also apply to widgets that display images, where a url state property may change in order to change the image, but where the new value may not be completely reflected until the image has completed loading.

										Absent the above facilities, we do a workaround and track that we're in the beforeShow state so that the value change event handler on the value widget's value state property doesn't commit the value and dismiss the dialog.
									*/
									_this._beforeShow = _true;
									_this.children.value.set (_this.get ((_this._pipedProperties || []).concat ('value')));
									_this._initialValue = _this._value;
									_this._beforeShow = _this._submittedValue = _false;
								}
							});

						_this._widgetsAdded = _true;
						_this._updateUiKeepOpenState ();
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._updateUiKeepOpenState = function () {
				this._widgetsAdded && this.children.keepOpen.set ({selected:this._keepOpen})
			};

		/*** Public Instance Methods ***/
			_classPrototype.fireSubmissionComplete = function(_keepOpen, _result) {
				var _this = this;

				_this.get ('shown')
					&& _this.fire ({
						name:'Submission Complete',
						result:_result,
						keepOpen:_keepOpen
						/*?
							Instance Events
								Submission Complete
									.
						*/
					})
				;
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_keepOpen:{
					name:'keepOpen',
					onChange:_classPrototype._updateUiKeepOpenState,
					value:_false
					/*?
						State Properties
							keepOpen
								.

								NOTES
								- the initial value is =false=
					*/
				},
				_valueWidgetClass:'valueWidgetClass',
				_picker:'picker',
				_pipedProperties:'pipedProperties',
					/*?
						State Properties
							pipedProperties
								.

								NOTES
								- the initial value is =undefined=
					*/
				_value:'value'
					/*?
						State Properties
							value
								.

								NOTES
								- the initial value is =undefined=
					*/
			});

		/*** Override Initial Values for Inherited State Properties ***/
			_class.set ({
				shieldOpacity:0
			});

		return _class;
	}
});

