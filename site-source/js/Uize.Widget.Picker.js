/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Picker Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2013 UIZE
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
		'Uize.Node.Event'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var _null = null;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					_null,
					function () {
						var _this = this;

						function _pickValue () {
							_this.set({focused:false});
							var
								_mooringNode = _this.getMooringNode(),
								_mooringNodeDims = Uize.Node.getDimensions (_mooringNode)
							;
							function _possiblyFocus () {
								_this._allowManualEntry && _this.set({focused:true})
							}
							_this.callInherited ('useDialog') ({
								component:_this._dialogComponent
									? Uize.copyInto(_this._dialogComponent, {value:_this.get('value')})
									: _null,
								widgetClassName:_this._dialogWidgetClass,
								widgetProperties:
									Uize.copyInto (
										{
											name:_this._dialogName || 'dialog' + _this._dialogWidgetClass.replace (/\./g,''),
											picker:_this,
											mooringNode:_mooringNode,
											offsetX:_mooringNodeDims.width >> 1,
											offsetY:_mooringNodeDims.height >> 1
										},
										_this.getDialogWidgetProperties(),
										_this.get ((_this._pipedProperties || []).concat ('value'))
									),
								submitHandler:function (_valueInfo,_event) {
									_this.handleDialogSubmit(_valueInfo);
									_event && _event.keepOpen || _possiblyFocus ();
								},
								dismissHandler:_possiblyFocus
							});
						}

						/*** watch focus by user ***/
							_this.wire (
								'Changed.focused',
								function () { _this.get('focused') && !_this._allowManualEntry && _pickValue () }
							);

						/*** watch click on input node ***/
							_this.wireNode (
								'input',
								'mousedown',
								function (_event) {
									if (!_this._allowManualEntry) {
										Uize.Node.Event.abort (_event);
										_pickValue ();
									}
								}
							);

						/*** add selector button */
							_this.addChild (
								'selector',
								_this._selectorButtonWidgetClass || Uize.Widget.Button.ValueDisplay,
								_this._selectorButtonWidgetProperties
							).wire ('Click',_pickValue);
								/*?
									Child Widgets
										selector
											.
								*/
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Public Methods ***/
			_classPrototype.getDialogWidgetProperties = function() { return _null };

			_classPrototype.getMooringNode = function() {
				return this.children.selector.getNode () || this.getNode ('input')
			};

			_classPrototype.handleDialogSubmit = function(_valueInfo) {
				var
					_this = this,
					_value = _valueInfo.value,
					_valueDetails = _valueInfo.valueDetails,
					_undefined
				;

				_this.set(
					Uize.copyInto(
						{},
						_valueDetails !== _undefined ? {valueDetails:_valueDetails} : _undefined,
						_value !== _undefined
							? ({
								value:_value != _null
									? (_this._valueFormatter ? _this._valueFormatter.call (_this,_value) : _value)
									: ''
							}) : _undefined
					)
				);
			};

		/*** State Properties ***/
			_class.stateProperties ({
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
					onChange:function() {
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
			});

		/*** Override Initial Values for Inherited State Properties ***/
			_class.set ({
				value:_null
			});

		return _class;
	}
});

