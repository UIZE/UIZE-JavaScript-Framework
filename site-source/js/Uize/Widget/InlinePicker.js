/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.InlinePicker Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2011-2016 UIZE
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
		The =Uize.Widget.InlinePicker= class acts as a base class for inline value picker widget classes, such as the =Uize.Widget.InlinePicker.Selector= class.

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.InlinePicker',
	superclass:'Uize.Widget.FormElement',
	required:[
		'Uize.Widget.Button.ValueDisplay',
		'Uize.Util.Coupler'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				var
					m = this,

					_valueWidget = m.addChild(
						'value',
						m._valueWidgetClass,
						m.get ((m._pipedProperties || []).concat ('value'))
					),
					_valueDisplayWidget = m.addChild(
						'valueDisplay',
						m._valueDisplayWidgetClass || Uize.Widget.Button.ValueDisplay,
						m._valueDisplayWidgetProperties
					)
				;

				// Sync value & value details back and forth with value widget
				Uize.Util.Coupler({
					instances:[m, _valueWidget],
					properties:['value', 'valueDetails', 'tentativeValue', 'tentativeValueDetails']
				});

				/** One-way sync value & value details to value display widget **/
					function _setValueDisplayWidget(_propertyName, _propertyNameToGet) {
						_valueDisplayWidget.set(_propertyName, m.get(_propertyNameToGet || _propertyName));
					}

					m.wire({
						'Changed.value':function () { _setValueDisplayWidget('value') },
						'Changed.valueDetails':function () { _setValueDisplayWidget('valueDetails') },
						'Changed.tentativeValue':function () { m._syncTentativeValue && _setValueDisplayWidget('value', 'tentativeValue') },
						'Changed.tentativeValueDetails':function () { m._syncTentativeValue && _setValueDisplayWidget('valueDetails', 'tentativeValueDetails') }
					});

					_setValueDisplayWidget('value');
					_setValueDisplayWidget('valueDetails');
			},

			instanceMethods:{
				updateUi:function () {
					var m = this;

					if (m.isWired) {
						m.children.value.updateUi();
						_superclass.doMy (m,'updateUi');
					}
				}
			},

			stateProperties:{
				_pipedProperties:{
					name:'pipedProperties',
					onChange:function () {
						var
							m = this,
							_previousPipedProperties = m._previousPipedProperties,
							_pipedProperties = m._pipedProperties,
							_children = m.children,
							_buildChangedEventName = function (_propertyName) { return 'Changed.' + _propertyName },
							_syncProperty = function (_propertyName) {
								var _valueWidget = _children.value;
								_valueWidget
									&& _valueWidget.set(_propertyName, m.get(_propertyName))
								;
							},
							_pipeChangedEvent = function (_event) {
								var _eventName = _event.name;
								_syncProperty(_eventName.substr(_eventName.indexOf('.') + 1));
							}
						;

						/*** unwire previous piped properties ***/
							Uize.forEach (
								_previousPipedProperties,
								function (_pipedProperty) {
									m.unwire (_buildChangedEventName (_pipedProperty),_pipeChangedEvent);
								}
							);

						/*** wire new piped properties ***/
							Uize.forEach (
								_pipedProperties,
								function (_pipedProperty) {
									m.wire (_buildChangedEventName(_pipedProperty),_pipeChangedEvent);
									_syncProperty(_pipedProperty);
								}
							);

						m._previousPipedProperties = m._pipedProperties;
					}
				},
					/*?
						State Properties
							pipedProperties
								.

								NOTES
								- the initial value is =undefined=
					*/
				_syncTentativeValue:{
					name:'syncTentativeValue',
					value:true
				},
				_tentativeValueDetails:'tentativeValueDetails',
				_valueDetails:{
					name:'valueDetails',
					onChange:function () { this.set({_tentativeValueDetails:this._valueDetails}) }
				},
				_valueDisplayWidgetClass:'valueDisplayWidgetClass',
				_valueDisplayWidgetProperties:'valueDisplayWidgetProperties',
				_valueFormatter:'valueFormatter',
					/*?
						State Properties
							valueFormatter
								.

								NOTES
								- the initial value is =undefined=
					*/
				_valueWidgetClass:'valueWidgetClass'
			}
		});
	}
});

