/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Droplist Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=e" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Class
	importance: 7
	codeCompleteness: 50
	testCompleteness: 0
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.Picker.Selector= widget provides the functionality for picker widgets that require selection from a set of values.

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.Picker.Selector',
	required:[
		'Uize.Widget.Options',
		'Uize.Widget.SelectorOption',
		'Uize.Util.Coupler'
	],
	builder:function (_superclass) {
		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false,
				_null = null,
				_undefined,
				_roundDictionary = {
					nearest:'round',
					up:'ceil',
					down:'floor'
				}
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					_null,
					function () {
						var
							_this = this,
							_options = _this.addChild(
								'options',
								Uize.Widget.Options,
								{
									optionWidgetClass:Uize.Widget.SelectorOption,
									allowClickWhenSelected:_true,
									html:_true,		// options markup is driven by a JST
									built:_false/*,	// default is that the options will be building markup
									tentativeValue:_this.get('tentativeValue'),
									value:_this.get('value'),
									tentativeValueNo:_this._tentativeValueNo,
									valueNo:_this._valueNo,
									values:_this._values*/
								}
							)
						;

						// sync properties between Selector & Options
						new Uize.Util.Coupler({
							instances:[_this, _options],
							properties:['tentativeValue', 'value', 'values']
						});

						// manually sync properties between Selector & Options
						/*function _syncProperties(_properties) {
							function _wireWidgets(_propertyName) {
								var _eventName = 'Changed.' + _propertyName;

								function _wireWidget(_target, _source) {
									_source.wire(
										_eventName,
										function() { _target.set(_propertyName, _source.get(_propertyName)) }
									)
								}

								_wireWidget(_this, _options);
								_wireWidget(_options, _this);
							}

							for (var _propertyName in _properties)
								_wireWidgets(_propertyName)
							;
						}

						_syncProperties({tentativeValue:1, value:1, values:1});*/

						_options.wire('Click',function() { _this.set({isDirty:_true}) } );

						_this.wire(
							'Changed.value',
							function() {
								_this._conformValue();
								_this._updateValueNo ();
								_this.set ({_tentativeValueNo:_this._valueNo,tentativeValue:_this.get('value')});
					}
						);
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._conformValue = function() {
				var
					_this = this,
					_valueConformer = _this.get('valueConformer')
				;

				// make sure value is valid after changing values by setting it on a conformed value
				// if the value is valid, the value won't change.
				_valueConformer && _this.set({value:_valueConformer(_this.get('value'))});
			};

			_classPrototype._getValueNoFromValue = function(_value) {
				var
					_this = this,
					_values = _this._values
				;

				return _values.length
					? Uize.findRecordNo (
						_values,
						{
							name:_value != _undefined ? _value : _this.get('value')
						}
					)
					: -1
				;
			};

			_classPrototype._updateValueNo = function () {
				this.set ({_valueNo:this._getValueNoFromValue()})
			};

		/*** Public Instance Methods ***/
			_classPrototype.getValueObject = function(_valueNo) {
				var _this = this;
				return (
					(_valueNo = _valueNo != _undefined ? _valueNo : _this._getValueNoFromValue (_this.get ('value'))) > -1
						? _this._values[_valueNo]
						: _null
				);
			};

			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					_this._updateValueNo ();
					_superclass.prototype.wireUi.call (_this);
				}
			};

		/*** Register Properties ***/
			_class.registerProperties({
				_isMultiSelect:{	// currently not implemented
					name:'isMultiSelect',
					value:_false
				},
				_tentativeValueNo:{ // readonly
					name:'tentativeValueNo',
					value:-1
				},
				_valueConformerPreset:'valueConformerPreset',
				_valueMap:{
					name:'valueMap',
					value:{}
				},
				_valueNo:{	// read only
					name:'valueNo',
					value:-1
				},
				_values:{
					name:'values',
					onChange:_classPrototype._conformValue,
					value:[]
				}
			});

		/*** Override default properties ***/
			_class.set({
				valueConformer:function(_value) {
					var
						_this = this,
						_valueConformerPreset = _this._valueConformerPreset,
						_newValue = _value
					;

					if (_valueConformerPreset) {
						var
							_valueConformerType = _valueConformerPreset.type,
							_valueConformerProperties = _valueConformerPreset.properties || {}
						;

						if (_valueConformerType == 'inValues') {
							var _values = _this._values;

							// set value to something valid if changing values results in nothing selected
							_newValue = _this._getValueNoFromValue(_value) > -1
								? _value
								: (_values.length ? _values[0].name : _null)
							;
						}
						else if (_valueConformerType == 'increment') {
							var
								_valueIncrement = _valueConformerProperties.increment,
								_roundDirection = _valueConformerProperties.roundDirection
							;

							if (_valueIncrement && _valueIncrement != 1) {
								// ensure valid round direction (update properties if necessary)
								_valueConformerProperties.roundDirection = _roundDirection =
									_roundDirection && _roundDictionary[_roundDirection] ? _roundDirection : 'nearest';

								/* NOTE:
									workaround for a REALLY ridiculous math inaccuracy in JavaScript when certain numbers are involved in multiplications. For example, .07 * 100 gives you 7.000000000000001 !!!
								*/
								function _fixJsMathInaccuracy(_value) { return Math.round(_value * Math.pow(10,14)) / Math.pow(10,14) }
								_newValue = Uize.isNumber(+_value)
									? (
										_fixJsMathInaccuracy(
											Math[_roundDictionary[_roundDirection]](
												_fixJsMathInaccuracy(_value / _valueIncrement)
											)
											* _valueIncrement
										)
									)
									: _value
								;
							}
						}
					}

					return _newValue;
				}
			});

		return _class;
	}
});

