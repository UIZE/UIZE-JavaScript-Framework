/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.InlinePicker Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=d" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Class
	importance: 6
	codeCompleteness: 100
	testCompleteness: 0
	docCompleteness: 7
*/

/*?
	Introduction
		The =Uize.Widget.InlinePicker= class acts as a base class for inline value picker widget classes, such as the =Uize.Widget.InlinePicker.Selector= class.

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.InlinePicker',
	superclass:'Uize.Widget.FormElement',
	required:'Uize.Util.Coupler',
	builder:function (_superclass) {
		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function () {
						var
							_this = this,
							
							_valueWidget = _this.addChild(
								'value',
								_this._valueWidgetClass,
								_this.get ((_this._pipedProperties || []).concat ('value'))
							),
							_valueDisplayWidget = _this.addChild(
								'valueDisplay',
								_this._valueDisplayWidgetClass || Uize.Widget.Button.ValueDisplay,
								_this._valueDisplayWidgetProperties
							)
						;

						// Sync value & value details back and forth with value widget
						new Uize.Util.Coupler({
							instances:[_this, _valueWidget],
							properties:['value', 'valueDetails', 'tentativeValue', 'tentativeValueDetails']
						});
						
						/** One-way sync value & value details to value display widget **/
							function _setValueDisplayWidget(_propertyName, _propertyNameToGet) {
								_valueDisplayWidget.set(_propertyName, _this.get(_propertyNameToGet || _propertyName))
							}
							
							_this.wire({
								'Changed.value':function() { _setValueDisplayWidget('value') },
								'Changed.valueDetails':function() { _setValueDisplayWidget('valueDetails') },
								'Changed.tentativeValue':function() { _this._syncTentativeValue && _setValueDisplayWidget('value', 'tentativeValue') },
								'Changed.tentativeValueDetails':function() { _this._syncTentativeValue && _setValueDisplayWidget('valueDetails', 'tentativeValueDetails') }
							});

							_setValueDisplayWidget('value');
							_setValueDisplayWidget('valueDetails');
					}
				)
			;
			
		/*** Public Methods ***/
			_class.prototype.updateUi = function() {
				var _this = this;
				
				if (_this.isWired) {
					_this.children.value.updateUi();
					_superclass.prototype.updateUi.call(_this);
				}
			};

		/*** Register Properties ***/
			_class.registerProperties ({
				_pipedProperties:{
					name:'pipedProperties',
					onChange:function() {
						var
							_this = this,
							_previousPipedProperties = _this._previousPipedProperties,
							_pipedProperties = _this._pipedProperties,
							_children = _this.children
						;
						
						function _buildChangedEventName(_propertyName) { return 'Changed.' + _propertyName }
						function _pipeChangedEvent(_event) {
							var
								_eventName = _event.name,
								_propertyName = _eventName.substr(_eventName.indexOf('.') + 1),
								_valueWidget = _children.value
							;
							_valueWidget
								&& _valueWidget.set(_propertyName, _this.get(_propertyName))
							;
						}
						
						/* unwire previous piped properties */
							if (_previousPipedProperties)
								for (var _previousPipedPropertiesNo = -1; ++_previousPipedPropertiesNo < _previousPipedProperties.length;)
									_this.unwire(
										_buildChangedEventName(_previousPipedProperties[_previousPipedPropertiesNo]),
										_pipeChangedEvent
									)
								;
						
						/* wire new piped properties */
							if (_pipedProperties) {
								function _wireChangedProperty(_propertyName) {
									_this.wire(
										_buildChangedEventName(_propertyName),
										_pipeChangedEvent
									)
								}
								
								for (var _pipedPropertyNo = -1; ++_pipedPropertyNo < _pipedProperties.length;)
									_wireChangedProperty(_pipedProperties[_pipedPropertyNo])
								;
							}
						
						_this._previousPipedProperties = _this._pipedProperties;
					}
				},
					/*?
						Set-get Properties
							pipedProperties
								document...

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
					onChange:function() { this.set({_tentativeValueDetails:this._valueDetails}) }
				},
				_valueDisplayWidgetClass:'valueDisplayWidgetClass',
				_valueDisplayWidgetProperties:'valueDisplayWidgetProperties',
				_valueFormatter:'valueFormatter',
					/*?
						Set-get Properties
							valueFormatter
								document...
									NOTES
									- the initial value is =undefined=
					*/
				_valueWidgetClass:'valueWidgetClass'
			});

		return _class;
	}
});

