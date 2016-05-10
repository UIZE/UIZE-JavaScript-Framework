/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Dialog.mPicker
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Mixin
	importance: 5
	codeCompleteness: 80
	docCompleteness: 10
*/

/*?
	Introduction
		The =Uize.Widget.Dialog.mPicker= widget mixin mixes base functionality for various value picker dialogs, such as date picker dialogs, color picker dialogs, etc.

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
	name:'Uize.Widget.Dialog.mPicker',
	required:'Uize.Widget.Button.Checkbox',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_false = false,
				_true = true
		;

		/*** Private Instance Methods ***/
			function _updateUiKeepOpenState (m) {
				m.pickerWidgetsAdded && m.children.keepOpen.set ({selected:m.keepOpen});
			}

		return function (_class) {
			_class.declare({
				omegastructor:function () {
					var m = this;

					/*** submit value ***/
						function _fireSubmissionComplete (_keepOpen) {
							var
								_valueWidget = m.children.value,
								_valueDetails = _valueWidget.get('valueDetails'),
								_undefined
							;

							m.submittedValue = _true;

							m.fireSubmissionComplete(
								_keepOpen,
								Uize.copyInto(
									{value:_valueWidget.valueOf ()},
									_valueDetails !== _undefined
										? {valueDetails:_valueDetails}
										: _undefined,
									m.pipedProperties && _valueWidget.get(m.pipedProperties)
								)
							);
						}

					/*** add the value child widget ***/
						m.addChild ('value',m.valueWidgetClass).wire (
							'Changed.value',
							function () {
								!m.beforeShow
									// Changed.value will be fired prior to Changed.valueDetails, so break flow so that the valueDetails can be synced before the 'Submission Complete' event is fired
									&& setTimeout(
										function () {
											_fireSubmissionComplete (m.keepOpen);
											m.keepOpen || m.set ({shown:_false});
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
						m.addChild ('keepOpen',Uize.Widget.Button.Checkbox).wire (
							'Changed.selected',
							function (_event) {m.set ({_keepOpen:_event.source.get ('selected')})}
							/*?
								Child Widget
									keepOpen Child Widget
										.
							*/
						);

					/*** add event handlers ***/
						function _handleDismiss() {
							if (m.submittedValue) {
								m.children.value.set({value: m.initialValue});
								_fireSubmissionComplete(_false);
							}
						}
						m.wire ({
							Ok:function () {_fireSubmissionComplete ()},
							Cancel:_handleDismiss,
							Close:_handleDismiss,
							'Before Show':function () {
								/* WORKAROUND:
									Ideally, the dialog class would have a state state property to indicate whether or not the dialog is actually shown, versus it just being desired to be shown because the shown state property is set to true.

									Another high level concept is the idea of whether or not the value of a state property is completely reflected, which could also apply to widgets that display images, where a url state property may change in order to change the image, but where the new value may not be completely reflected until the image has completed loading.

									Absent the above facilities, we do a workaround and track that we're in the beforeShow state so that the value change event handler on the value widget's value state property doesn't commit the value and dismiss the dialog.
								*/
								m.beforeShow = _true;
								m.children.value.set (m.get ((m.pipedProperties || []).concat ('value')));
								m.initialValue = m.value;
								m.beforeShow = m.submittedValue = _false;
							}
						});

					m.pickerWidgetsAdded = _true;
					_updateUiKeepOpenState (m);
				},

				instanceMethods:{
					fireSubmissionComplete:function (_keepOpen, _result) {
						var m = this;

						m.get ('shown')
							&& m.fire ({
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
					}
				},

				stateProperties:{
					keepOpen:{
						name:'keepOpen',
						onChange:function () {_updateUiKeepOpenState (this)},
						value:_false
						/*?
							State Properties
								keepOpen
									.

									NOTES
									- the initial value is =false=
						*/
					},
					valueWidgetClass:'valueWidgetClass',
					picker:'picker',
					pipedProperties:'pipedProperties',
						/*?
							State Properties
								pipedProperties
									.

									NOTES
									- the initial value is =undefined=
						*/
					value:'value'
						/*?
							State Properties
								value
									.

									NOTES
									- the initial value is =undefined=
						*/
				},

				set:{
					shieldOpacity:0.01
				}
			});
		};
	}
});
