/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Picker Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 6
	codeCompleteness: 100
	docCompleteness: 7
*/

/*?
	Introduction
		The =Uize.Widget.Picker= class acts as a base class for value picker widget classes, such as the =Uize.Widget.Picker.Date= class.

		*DEVELOPERS:* `Chris van Rensburg`, `Ben Ilegbodu`

		### In a Nutshell
			- deferred loading of picker dialog, including loading of JavaScript modules, building and insertion of HTML markup for widget, and wiring up of picker dialog widget, so that many picker instances can be created on a page without adding siginificant load to the page.
			- dialog is moored to =selector= button's root node, with =offsetX= and =offsetY= values that are half the width and height of the selector button's root node, respectively, so that the top left corner of the diaog should be positioned by the center of the selector button.
			- picker dialog is shared among multiple picker instances
				- when the picker dialog is launched, the values of the piped properties are relayed to the picker dialog widget, which are in turn piped through to the counterpart properties of the picker widget, allowing multiple =Uize.Widget.Picker= instances to share the same dialog widget. Whenever the dialog is launched for a specific picker instance, the dialog's state is synchronized to the state of the picker instance.
			- widget class for dialog is configurable. This allows a subclass specific to your own Web application to be used, which is likely to be a subclass of =Uize.Widget.Dialog.Picker=
*/

Uize.module ({
	name:'Uize.Widget.Picker',
	superclass:'Uize.Widget.FormElement',
	required:[
		'Uize.Widget.Button.ValueDisplay',
		'Uize.Dom.Pos',
		'Uize.Dom.Event'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_null = null
		;

		return _superclass.subclass ({
			omegastructor:function () {
				var
					m = this,
					_pickValue = function () { m.pickValue() }
				;

				/*** watch focus by user ***/
					m.wire (
						'Changed.focused',
						function () { m.get('focused') && !m._allowManualEntry && _pickValue () }
					);

				/*** add selector button */
					m.addChild (
						'selector',
						m._selectorButtonWidgetClass || Uize.Widget.Button.ValueDisplay,
						m._selectorButtonWidgetProperties
					).wire ('Click',_pickValue);
						/*?
							Child Widgets
								selector
									.
						*/
			},

			instanceMethods:{
				getDialogWidgetProperties:function () { return _null },

				getMoreDialogEventHandlers:function () { return _null },

				getMooringNode:function () {
					return this.children.selector.getNode () || this.getNode ('input');
				},

				handleDialogSubmit:function (_valueInfo) {
					var
						m = this,
						_value = _valueInfo.value,
						_valueDetails = _valueInfo.valueDetails,
						_undefined
					;

					m.set(
						Uize.copy(
							_valueDetails !== _undefined ? {valueDetails:_valueDetails} : _undefined,
							_value !== _undefined
								? ({
									value:_value != _null
										? (m._valueFormatter ? m._valueFormatter.call (m,_value) : _value)
										: ''
								}) : _undefined
						)
					);
				},

				pickValue:function () {
					var m = this;

					m.set({focused:false});

					var
						_mooringNode = m.getMooringNode(),
						_mooringNodeDims = Uize.Dom.Pos.getDimensions (_mooringNode)
					;

					function _possiblyFocus () {
						m._allowManualEntry && m.set({focused:true});
					}

					m.callInherited ('useDialog') ({
						component:m._dialogComponent
							? Uize.copyInto(m._dialogComponent, {value:m.get('value')})
							: _null,
						widgetClassName:m._dialogWidgetClass,
						widgetProperties:
							Uize.copyInto (
								{
									name:m._dialogName || 'dialog' + m._dialogWidgetClass.replace (/\./g,''),
									picker:m,
									mooringNode:_mooringNode,
									offsetX:_mooringNodeDims.width >> 1,
									offsetY: _mooringNodeDims.height >> 1,
									preventPageScrollWhenShown: m._dialogPreventScrollWhenShown
								},
								m.getDialogWidgetProperties(),
								m.get ((m._pipedProperties || []).concat ('value', 'valueDetails'))
							),
						submitHandler:function (_valueInfo,_event) {
							m.handleDialogSubmit(_valueInfo);
							_event && _event.keepOpen || _possiblyFocus ();
						},
						dismissHandler:_possiblyFocus,
						widgetEventHandlers:m.getMoreDialogEventHandlers()
					});
				},

				wireUi:function () {
					var m = this;
					if (!m.isWired) {
						m.wireNode (
							'input',
							'mousedown',
							function (_event) {
								if (!m._allowManualEntry) {
									Uize.Dom.Event.abort (_event);
									m.pickValue ();
								}
							}
						);

						_superclass.doMy (m,'wireUi');
					}
				}
			},

			stateProperties:{
				_allowManualEntry:{
					name:'allowManualEntry',
					value:true
					/*?
						State Properties
							allowManualEntry
								.

								NOTES
								- the initial value is =true=
					*/
				},
				_dialogComponent:'dialogComponent',
				_dialogName:'dialogName',
				_dialogWidgetClass:'dialogWidgetClass',
					/*?
						State Properties
							dialogWidgetClass
								.

								NOTES
								- the initial value is =undefined=
					*/
				_dialogPreventScrollWhenShown: {
					name: 'dialogPreventScrollWhenShown',
					value: false
				},
				_pipedProperties:'pipedProperties',
					/*?
						State Properties
							pipedProperties
								.

								NOTES
								- the initial value is =undefined=
					*/
				_selectorButtonWidgetClass:'selectorButtonWidgetClass',
				_selectorButtonWidgetProperties:'selectorButtonWidgetProperties',
				_valueDetails:{
					name:'valueDetails',
					onChange:function () {
						var _selector = this.children.selector;

						_selector
							&& _selector.set({valueDetails:this._valueDetails});
					}
				},
				_valueFormatter:'valueFormatter'
					/*?
						State Properties
							valueFormatter
								.

								NOTES
								- the initial value is =undefined=
					*/
			},

			set:{
				value:_null
			}
		});
	}
});

