/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Fade Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 7
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Fade= class is the foundation for animation in the UIZE JavaScript Framework, supporting quantization, curves, compound value fades, and more.

		*DEVELOPERS:* `Chris van Rensburg`

		The =Uize.Fade= class implements automated interpolation of a simple or compound value, between specified start and end values, and with qualities of the fade - such as duration, curve, quantization, etc. - being configurable through the state properties of the class.

		BACKGROUND READING

		For an in-depth discussion on animation in the UIZE JavaScript Framework, and for a discussion on how this module fits into the larger picture, consult the explainer [[../explainers/javascript-animation-and-effects.html][JavaScript Animation and Effects]] and read through the section `The Engine`.
*/

Uize.module ({
	name:'Uize.Fade',
	superclass:'Uize.Class',
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_undefined,
				_typeObject = 'object',
				_constrain = Uize.constrain,
				_now = Uize.now
			;

		/*** General Variables ***/
			var
				_valueUnchanged = {},
				_activeFades = [],
				_anyActiveFades = false,
				_interval
			;

		/*** Utility Functions ***/
			function _updateAnyActiveFades () {
				if ((_anyActiveFades = !!_activeFades.length) != !!_interval)
					_interval = _anyActiveFades ? setInterval (_advance,10) : clearInterval (_interval)
				;
			}

			function _advance () {
				for (var _activeFadeNo = -1, _activeFade; ++_activeFadeNo < _activeFades.length;)
					(_activeFade = _activeFades [_activeFadeNo])._inProgress
						? _activeFade._advance ()
						: _activeFades.splice (_activeFadeNo--,1)
				;
				_updateAnyActiveFades ();
			}

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (),
				_classPrototype = _class.prototype,
				_nonInheritableStatics = _class.nonInheritableStatics
			;

		/*** Private Instance Methods ***/
			_classPrototype._updateValue = function () {
				var
					_this = this,
					_value = _blendValues (
						_this._startValue,
						_this._endValue,
						_this._progress,
						_this._quantization,
						_this._curve,
						_this._value
					)
				;
				if (_value != _valueUnchanged)
					_value != _this._value ? _this.set ({_value:_value}) : _this.fire ('Changed.value')
				;
			};

			_classPrototype._advance = function () {
				var _completion = Math.min ((_now () - this._startTime) / this._duration,1);
				this.set ({_progress:this._reverse ? 1 - _completion : _completion});
				if (_completion == 1) {
					this.stop ();
					this.fire ('Done');
						/*?
							Instance Events
								Done
									Fired each time the fade ends.

									NOTES
									- see also the =Start= instance event.
						*/
				}
			};

		/*** Public Instance Methods ***/
			_classPrototype.stop = function () {
				this.set ({_inProgress:false});
				/*?
					Instance Methods
						stop
							Stops the fade automation.

							SYNTAX
							...................
							myInstance.stop ();
							...................

							NOTES
							- if the fade automation is not in progress, then this method has no effect
							- this method has no return value
							- see also the =start= instance method
				*/
			};

			_classPrototype.start = function (_properties) {
				this.stop ();
				this.set (Uize.copyInto ({_inProgress:true},_properties));
				/*?
					Instance Methods
						start
							Starts the fade automation.

							SYNTAX
							....................
							myInstance.start ();
							....................

							VARIATION
							.....................................
							myInstance.start (fadePropertiesOBJ);
							.....................................

							When the optional =fadePropertiesOBJ= parameter is specified, the state properties specified in the =fadePropertiesOBJ= object will be set before the fade is started. This is a convenience offered because one often might want to start a fade immediately after setting its =startValue= and =endValue= properties (and sometimes other properties, such as =curve=, =quantization=, etc.).

							EXAMPLE

							The following statement...

							.......................................................
							myFade.start ({startValue:0,endValue:50,duration:2500);
							.......................................................

							...is equivalent to...

							.....................................................
							myFade.stop ();
							myFade.set ({startValue:0,endValue:50,duration:2500);
							myFade.start ();
							.....................................................

							NOTES
							- Before the automation is started, it is stopped. So, if automation is in progress when this method is called, it will be reset and started over.
							- each time that automation is started using this method, the =Start= instance event is fired
							- this method has no return value
							- see also the =stop= instance method
				*/
			};

		/*** Public Static Methods ***/
			var _blendValues = _class.blendValues = function (_value1,_value2,_blend,_quantization,_curve,_previousValue) {
				if (_value1 === _value2) {
					return _previousValue !== _undefined && _value1 === _previousValue ? _valueUnchanged : _value1;
				} else {
					if (Uize.isFunction (_curve)) {
						_blend = _curve (_blend);
						_curve = _undefined;
					}
					if (typeof _value1 == _typeObject && _value1 && !(_value1 instanceof RegExp)) {
						var
							_blendedEqualsPrevious = _previousValue && typeof _previousValue == _typeObject,
							_quantizationIsObject = _quantization && typeof _quantization == _typeObject,
							_curveIsObject = _curve && typeof _curve == _typeObject,
							_result = _blendedEqualsPrevious ? _previousValue : Uize.isArray (_value1) ? [] : {},
							_propertyPreviousValue
						;
						for (var _propertyName in _value1) {
							var _blendedValue = _blendValues (
								_value1 [_propertyName],
								_value2 [_propertyName],
								_blend,
								_quantizationIsObject ? _quantization [_propertyName] : _quantization,
								_curveIsObject ? _curve [_propertyName] : _curve,
								_propertyPreviousValue = _result [_propertyName]
							);
							if (_blendedEqualsPrevious)
								_blendedEqualsPrevious =
									_blendedValue == _valueUnchanged ||
									(typeof _blendedValue != _typeObject && _blendedValue == _propertyPreviousValue)
							;
							if (_blendedValue != _valueUnchanged)
								_result [_propertyName] = _blendedValue
							;
						}
						return _blendedEqualsPrevious ? _valueUnchanged : _result;
					} else {
						var _result = !_blend
							? _value1
							: _blend == 1
								? _value2
								: !_quantization
									? _value1 + (_value2 - _value1) * _blend
									: _blend > 0 && _blend < 1
										? _constrain (
											_value1 + Math.round ((_value2 - _value1) * _blend / _quantization) * _quantization,
											_value1,
											_value2
										)
										: _value1 + Math.round ((_value2 - _value1) * _blend / _quantization) * _quantization
						;
						return _previousValue !== _undefined && _result === _previousValue ? _valueUnchanged : _result;
					}
				}
				/*?
					Static Methods
						Uize.Fade.blendValues
							Returns a value, that is the blend between the two specified values.

							SYNTAX
							............................................................
							blendedINTorOBJorARRAY = Uize.Fade.blendValues (
								value1INTorOBJorARRAY,value2INTorOBJorARRAY,blendFRACTION
							);
							............................................................

							In its simplest use, this method can be used to blend between two simple number type values, where the =blendFRACTION= parameter should be a floating point number in the range of =0= to =1=, where  a value of =0= will result in returning the value of the =value1INTorOBJorARRAY= parameter, the value of =1= will result in returning the value of the =value2INTorOBJorARRAY= parameter, and the value =.5= will result in returning the average of =value1INTorOBJorARRAY= and =value2INTorOBJorARRAY=.

							Beyond blending simple number values, this method can also be used to blend arbitrarily complex data structures, such as two arrays of numbers, or two RGB color objects whose properties are color channel values, or two arrays containing multiple objects whose properties are numbers, and even more complex structures.

							EXAMPLE
							...............................................................................
							Uize.Fade.blendValues ({red:255,green:255,blue:255},{red:0,green:0,blue:0},.5);
							...............................................................................

							To illustrate the ability to blend complex values, the above statement of code would return the object ={red:127.5,green:127.5,blue:127.5}=, corresponding to mid gray.
				*/
			};
			_nonInheritableStatics.blendValues = 1;

			_class.celeration = function (_acceleration,_deceleration) {
				/* NOTES
					- speed is: endValue - startValue / duration
						such that, startValue + ((endValue - startValue) / duration) * duration == endValue

					- when there is acceleration and deceleration, sustainSpeed is calculated by...
						(acceleration * sustainSpeed / 2) + ((1 - acceleration - deceleration) * sustainSpeed) + (deceleration * sustainSpeed / 2) == simpleSpeed

						therefore, sustainSpeed * (acceleration / 2 + (1 - acceleration - deceleration) + deceleration / 2) == simpleSpeed

						therefore, sustainSpeed == simpleSpeed / (acceleration / 2 + (1 - acceleration - deceleration) + deceleration / 2)

						therefore, sustainSpeed == simpleSpeed / ((acceleration + 2 * (1 - acceleration - deceleration) + deceleration) / 2)

						therefore, sustainSpeed == simpleSpeed / ((acceleration + 2 - 2 * acceleration - 2 * deceleration + deceleration) / 2)

						therefore, sustainSpeed == simpleSpeed / ((2 - acceleration - deceleration) / 2)

						therefore, sustainSpeed == 2 * simpleSpeed / (2 - acceleration - deceleration)

						where...
							simpleSpeed == speed when there are no acceleration and deceleration phases
							acceleration == fraction of duration spent accelerating (0 to 1), head aligned
							deceleration == fraction of duration spent decelerating (0 to 1), tail aligned
							(1 - acceleration - deceleration) == fraction of duration spent at sustainSpeed
				*/
				var
					_sustain = 1 - (_acceleration = _acceleration || 0) - (_deceleration = _deceleration || 0),
					_sustainSpeed = 2 / (1 + _sustain),
					_accelerationRate = _acceleration ? _sustainSpeed / _acceleration : 0,
					_accelerationRateDiv2 = _accelerationRate / 2,
					_decelerationRate = _deceleration ? -_sustainSpeed / _deceleration : 0,
					_decelerationRateDiv2 = _decelerationRate / 2,
					_accelerationSquared = _acceleration * _acceleration,
					_decelerationElapsed
				;
				return (
					_sustain >= 1
						? Uize.returnX
						:
							function (_value) {
								return (
									(
										_value =
											(
												_acceleration
													? _constrain (_value * _value,0,_accelerationSquared) * _accelerationRateDiv2
													: 0
											) +
											(_sustain ? _sustainSpeed * _constrain (_value - _acceleration,0,_sustain) : 0) +
											(
												_deceleration
													? (
														(
															_sustainSpeed +
															(
																_decelerationElapsed = _constrain (
																	_value - _acceleration - _sustain,0,_deceleration
																)
															) * _decelerationRateDiv2
														) * _decelerationElapsed
													)
													: 0
											)
									) > 1 ? 1 : _value
								);
							}
				);
				/*?
					Static Methods
						Uize.Fade.celeration
							Produces a curve function that may contain an acceleration phase, deceleration phase, or both acceleration and deceleration phases.

							SYNTAX
							...............................................................................
							curveFUNC = Uize.Fade.celeration (acceleration0to1FLOAT,deceleration0to1FLOAT);
							...............................................................................

							Parameters
								acceleration0to1FLOAT
									A floating point value in the range of 0 to 1, specifying the fraction of the curve function that should should be an acceleration phase.

									When the value =0= is specified, the resulting curve function will contain no acceleration phase. When the value =1= is specified, the acceleration phase will occupy the entire curve. When the value =.5= is specified, the acceleration phase will occupy the first half of the curve. The default value for this parameter is =0=.

								deceleration0to1FLOAT
									A floating point value in the range of 0 to 1, specifying the fraction of the curve function that should should be a deceleration phase.

									When the value =0= is specified, the resulting curve function will contain no deceleration phase. When the value =1= is specified, the deceleration phase will occupy the entire curve. When the value =.5= is specified, the deceleration phase will occupy the second half of the curve. The default value for this parameter is =0=.

							Sustain Phase
								The values of the =acceleration0to1FLOAT= and =deceleration0to1FLOAT= parameters do not need to add up to =1=, but their sum should not exceed =1=.

								If the values of =acceleration0to1FLOAT= and =deceleration0to1FLOAT= do not add up to =1=, then there will be a sustain phase between the acceleration and deceleration phases. During the sustain phase, the rate of change will remain constant.

							Variations
								VARIATION 1
								.........................................................
								curveFUNC = Uize.Fade.celeration (acceleration0to1FLOAT);
								.........................................................

								When the optional =deceleration0to1FLOAT= parameter is not specified, its value will be defaulted to =0= and the resulting curve function will contain no deceleration phase.

								VARIATION 2
								....................................
								curveFUNC = Uize.Fade.celeration ();
								....................................

								When no parameters are specified, then a reference to =Uize.Curve.linear= (a linear curve function) will be returned - the resulting curve function will contain no acceleration or deceleration phases. The same linear curve function will be produced if the value =0= is specified for both the =acceleration0to1FLOAT= and =deceleration0to1FLOAT= parameters.

							NOTES
							- see also the =curve= state property
				*/
			};
			_nonInheritableStatics.celeration = 1;

		/*** State Properties ***/
			function _setCurveFromAccelerationDeceleration () {
				this.set ({
					_curve:
						this._acceleration || this._deceleration
							? _class.celeration (this._acceleration,this._deceleration)
							: null
				});
			}
			function _forceValueUpdate () {
				this._value = null;
				this._updateValue ();
			}
			_class.stateProperties ({
				_acceleration:{
					name:'acceleration', // DEPRECATED (see documentation)
					onChange:_setCurveFromAccelerationDeceleration
				},
				_curve:{
					name:'curve',
					onChange:_forceValueUpdate
					/*?
						State Properties
							curve
								A function reference, being a curve function that will be used to control value interpolation for a fade process.

								This property lets you specify a curve function in order to achieve a wide variety of different kinds of non-linear fade effects, including motion effects like bounce, springiness, wobble, elasticity. etc.

								When setting a value for the =curve= property, you can provide your own hand-rolled curve function, or you can pick from the many convenient curve function generators provided in the =Uize.Curve= and =Uize.Curve.Rubber= modules. Even more complex curve functions can be generated using the versatile curve function modifiers provided in the =Uize.Curve.Mod= module.

								Compound Curve Value
									As with the =quantization= state property, a compound value can be specified for the =curve= state property.

								NOTES
								- the initial value is =undefined=
								- when this property is set to =null=, value interpolation will be linear
					*/
				},
				_deceleration:{
					name:'deceleration', // DEPRECATED (see documentation)
					onChange:_setCurveFromAccelerationDeceleration
				},
				_duration:{
					name:'duration',
					value:2000
					/*?
						State Properties
							duration
								An integer, representing the time (in milliseconds) that the fade process should take to complete.

								NOTES
								- the initial value is =2000= (ie. two seconds)
								- the actual duration of the fade process is not affected by the value of the =curve= state property
					*/
				},
				_endValue:{
					name:'endValue',
					onChange:_forceValueUpdate,
					value:100
					/*?
						State Properties
							endValue
								The value (or set of values) that should be reached at the end of the fade process.

								NOTES
								- the initial value is =100=
								- see also the =startValue= state property
					*/
				},
				_inProgress:{
					name:'inProgress',
					onChange:function () {
						var _this = this;
						if (_this._inProgress) {
							_this._startTime = _now ();
							_this.fire ('Start');
								/*?
									Instance Events
										Start
											Fired each time the fade starts.

											NOTES
											- see also the =Done= instance event.
								*/
							_this._value = _this._progress = null;
								/* NOTES:
									- this is to make sure there are always initial change events for these properties. However, maybe with the model of registering handlers on these properties, it shouldn't be necessary (or maybe it's not even appropriate) to coerce this change in this place. Maybe it's OK for the user of this class to only be informed when the value or progress actually changes.
								*/
							_this._advance ();

							_activeFades.push (_this);
							_updateAnyActiveFades ();
						}
					},
					value:false
					/*?
						State Properties
							inProgress
								A boolean value, indicating whether or not the fade operation is in progress.

								To monitor when a fade is in progress, one can register an event handler on the =Changed.inProgress= instance event.

								NOTES
								- the initial value is =undefined=
								- this property is read-only
					*/
				},
				_progress:{
					name:'progress',
					onChange:_classPrototype._updateValue,
					value:0
					/*?
						State Properties
							progress
								A floating point value in the range of 0 to 1, specifying the fraction of the full fade process that is complete. A value of =0= indicates that the fade is at the start, a value of =1= indicates that the fade is at the end, and a value of =.5= indicates that the fade is halfway through.

								NOTES
								- the initial value is =0=
					*/
				},
				_reverse:'reverse',
					/*?
						State Properties
							reverse
								A boolean value, specifying whether or not the fade process should operate in reverse.

								Because this flag complements the value of the =progress= state property, the =progress= property will have a value of =1= when the fade starts and =0= when the fade is done. This may also mean that the nature of the fade will not be exactly reversed and may actually be different if there is asymmetry resulting from the specific value of the =curve= state property.

								NOTES
								- the initial value is =undefined=
					*/
				_startValue:{
					name:'startValue',
					onChange:_forceValueUpdate,
					value:0
					/*?
						State Properties
							startValue
								The value (or set of values) at which the fade process should start.

								NOTES
								- the initial value is =0=
								- see also the =endValue= state property
					*/
				},
				_quantization:'quantization',
				/*?
					State Properties
						quantization
							A number or array or object, allowing one to control the quantization for the interpolated values of a fade.

							When the value =0=, =undefined=, or =null= is specified for this property, then the fade's interpolated value can be a floating point number (or contain floating point numbers, if it's a compound value). This can be a problem for fading values in certain applications where an integer value is desirable, and where a floating point number may be inappropriate. In such cases, a value of =1= can be specified for the =quantization= state property, thereby directing the fade to interpolate its value in increments of one.

							Relative to Start Value
								It's important to note that a quantization value of =2= doesn't mean that an interpolated value will always be even (it could also be odd), since quantization determines the step increments from the start value of a fade.

								So, if a fade's start value was =0=, then a quantization of =2= would produce the interpolated values =0=, =2=, =4=, etc. (ie. even numbers). But if that same fade had started at a value of =1=, then it would produce the interpolated values =1=, =3=, =5=, etc. (ie. odd numbers).

								Similarly, a quantization value of =1= doesn't guarantee that an interpolated value will always be an integer. A fade with a start value of =1= and a quantization of =1= would produce the interpolated values =1=, =2=, =3=, etc. (ie. integers). However, a fade starting with =1.5= and with a quantization of =1= would produce the interpolated values =1.5=, =2.5=, =3.5=, etc. (definitely *not* integers). This is generally not an obstacle for applications that desire integer interpolated values, because in those cases the start and end values are almost certain to be integers, and a quantization value of =1= will have the desired effect under such conditions.

							Simple Quantization
								It is possible to specify a single quantization number that should apply to all components of a compound value (eg. a color object with red, green, and blue properties).

								EXAMPLE
								...................................................
								var colorFade = Uize.Fade ({
									startValue:{red:255,green:128,blue:0}, // orange
									endValue:{red:179,green:136,blue:255}, // violet
									quantization:1,
									duration:2000
								});
								...................................................

								In the above example, a fade instance is created for fading a color between orange and violet, over a duration of =2000= milliseconds (two seconds). The =startValue= state property is used to specify the starting color of orange, while the =endValue= property is used to specify the ending color of violet.

								The start and end values are specified using an object with =red=, =green=, and =blue= properties that specify the values for each of the three channels that comprise an RGB color. This approach leverages the =Uize.Fade= class' ability to interpolate arbitrarily complex, compound values. Now, the value for each of the red, green, and blue channels must be an integer - there is no meaning to floating point values for these channels.

								So, if =quantization= is left to its initial value of =undefined=, then RGB colors with floating point channel values would be interpolated, and this might not be appropriate for the code that handles the fade's update, or that code would have to do its own rounding. Additionally, the value of the fade's =value= state property would likely change more frequently, putting more load on update handler code. Specifying a value of =1= for the =quantization= property ensures that the values for all the channels of the color will be interpolated in steps of =1= and would, therefore, always be integers.

							Compound Quantization Value
								It is possible to specify a compound value for the =quantization= state property, just as with the =startValue= and =endValue= properties.

								In fact, you can specify a quantization value that matches the structure of the start and end values and that specifies granular quantization for all components of a compound value fade.

								EXAMPLE
								...................................................
								var colorFade = Uize.Fade ({
									startValue:{red:255,green:128,blue:0}, // orange
									endValue:{red:179,green:136,blue:255}, // violet
									quantization:{
										red:5,   // medium resolution
										green:1, // highest resolution
										blue:10  // low resolution
									},
									duration:2000
								});
								...................................................

								In the above example, a value is being specified for =quantization= that matches the structure of the start and end values. This allows different quantization to be specified for the different subcomponents of the compound value that is interpolated from the compound start and end values. During the fade, the value of the green channel would change with the highest resolution (while always being an integer), while the red channel value would change with less precision (in steps of =5=) and the blue channel value would change with the least precision (steps of =10=).

							Compound Quantization Value With Omissions
								When specifying a compound =quantization= value, it is possible to omit quantization for certain components of the structure value, and the quantization for such components will be defaulted to =0=.

								EXAMPLE
								...................................................
								var colorFade = Uize.Fade ({
									startValue:{
										color:{red:255,green:128,blue:0}, // orange
										opacity:0
									},
									endValue:{
										color:{red:179,green:136,blue:255}, // violet
										opacity:1
									},
									quantization:{color:1},
									duration:2000
								});
								...................................................

								In the above example, a fade instance is created for fading a color between orange and violet and an opacity value between =0= to =1=, over a duration of =2000= milliseconds (two seconds). A compound =quantization= value is specified. By specifying the value =1= for =color=, and not an entire subtree object with quantization values for =red=, =green=, and =blue=, the quantization of =1= applies to all three color channels. And by omitting a quantization value for =opacity=, the quantization for this component of the interpolated compound value defaults to =0= (ie. no quantization / floating point precision).

								So, you see, a compound =quantization= value may have "terminations" and "omissions", both of which lead to defaulting behaviors. Omissions are essentially terminations with defaulting to =0=. So, in effect, omitting a subtree is equivalent to "terminating" the subtree by specifying the simple value =0=.

							Quantization Defaulting At Nodes
								When specifying a compound value for =quantization=, it is possible to "terminate" the tree structure at any node of the tree by specifying a number in place of a subtree object/array.

								This has the effect of imposing the quantization value specified for that node on all components of the subtree when interpolating the fade value. This is a convenience that allows defaulting at different levels of a compound =quantization= value.

								EXAMPLE
								.......................................................
								var colorFade = Uize.Fade ({
									startValue:{
										colorA:{red:255,green:128,blue:0},   // orange
										colorB:{red:255,green:0,blue:0}      // pure red
									},
									endValue:{
										colorA:{red:179,green:136,blue:255}, // violet
										colorB:{red:0,green:0,blue:255}      // pure blue
									},
									quantization:{
										colorA:{
											red:5,   // medium resolution
											green:1, // highest resolution
											blue:10  // low resolution
										},
										colorB:1    // highest resolution
									},
									duration:2000
								});
								.......................................................

								In the above example, a fade instance is created for fading two colors, =colorA= and =colorB=, where =colorA= is faded between orange and violet, and where =colorB= is faded between pure red and pure blue. A compound value is specified for =quantization=, where the structure mostly matches the structure of the start and end values, but with the key distinction that a simple number is specified for =colorB=, rather than an object with =red=, =green=, and =blue= properties as with =colorA=. This has the effect of defaulting the quantization for all components of the =colorB= subtree (ie. =red=, =green=, and =blue=) in the interpolated compound value to =1=.

							Floating Point Quantization Values
								There's nothing to say that values for the =quantization= state property have to be integers.

								You can just as well specify a floating point value for quantization. For example, a fade starting with =0= and with a quantization of =.5= would produce the interpolated values =0=, =.5=, =1=, =1.5=, =2=, =2.5=, etc. This could be useful in cases where a floating point interpolated value is acceptable, but where one wishes to limit the number of value changes that occur for performance reasons. In such cases, setting a quantization to anything other than =0= would provide a throttling effect that would reduce the number of value updates that would occur.

								EXAMPLE
								..............................
								var opacityFade = Uize.Fade ({
									startValue:0,
									endValue:1,
									quantization:.02,
									duration:2000
								});
								..............................

								In the above example, a fade instance is created for fading an opacity value between =0= and =1=. Opacity is a floating point value, where =0= represents completely transparent and =1= represents completely opaque. Setting a quantization of =.02= for the fade ensures that there will be a maximum of 50 value updates (1 / .02) over the duration of the fade (there may be fewer, depending on CPU load).

							NOTES
							- the initial value is =undefined=
				*/
				_value:{
					name:'value',
					value:0
					/*?
						State Properties
							value
								The value (or set of values) at the current point in a fade that is in progress, as interpolated between the values of the =startValue= and =endValue= state properties.

								NOTES
								- the initial value is =0=
					*/
				}
			});

		/*?
			Deprecated Features
				acceleration State Property (DEPRECATED 2009-07-10)
					A floating point value in the range of 0 to 1, specifying the fraction of the fade should be an acceleration phase.

					This state property has been deprecated in favor of the more versatile =curve= state property and the =Uize.Fade.celeration= static method.

					INSTEAD OF...
					....................................................
					myInstance.set ({acceleration:.25,deceleration:.5});
					....................................................

					USE...
					.......................................................
					myInstance.set ({curve:Uize.Fade.celeration (.25,.5)});
					.......................................................

					Setting a value for =acceleration= will have the effect of creating a curve function using the =Uize.Fade.celeration= static method and then setting the curve function created as the value of the =curve= property.

					The =curve= state property is much more versatile than the `acceleration State Property (DEPRECATED 2009-07-10)` and `deceleration State Property (DEPRECATED 2009-07-10)`, and lets you specify a curve function in order to achieve a wide variety of different kinds of non-linear fade effects, including effects like bounce, springiness, wobble, elasticity. etc. When setting a value for the =curve= property, you can provide your own hand-rolled curve function, or you can pick from the many convenient curve function generators provided in the =Uize.Curve= and =Uize.Curve.Rubber= modules. Even more complex curve functions can be generated using the versatile curve function modifiers provided in the =Uize.Curve.Mod= module.

					NOTES
					- the initial value is =undefined=
					- the sum of the `acceleration State Property (DEPRECATED 2009-07-10)` and `deceleration State Property (DEPRECATED 2009-07-10)` must not exceed =1=
					- see also the `deceleration State Property (DEPRECATED 2009-07-10)`
					- see the =curve= state property and the =Uize.Fade.celeration= static method

				deceleration State Property (DEPRECATED 2009-07-10)
					A floating point value in the range of 0 to 1, specifying the fraction of the fade should be a deceleration phase.

					This state property has been deprecated in favor of the more versatile =curve= state property and the =Uize.Fade.celeration= static method.

					INSTEAD OF...
					....................................................
					myInstance.set ({acceleration:.25,deceleration:.5});
					....................................................

					USE...
					.......................................................
					myInstance.set ({curve:Uize.Fade.celeration (.25,.5)});
					.......................................................

					Setting a value for =deceleration= will have the effect of creating a curve function using the =Uize.Fade.celeration= static method and then setting the curve function created as the value of the =curve= property.

					The =curve= state property is much more versatile than the deprecated `acceleration State Property (DEPRECATED 2009-07-10)` and `deceleration State Property (DEPRECATED 2009-07-10)`, and lets you specify a curve function in order to achieve a wide variety of different kinds of non-linear fade effects, including effects like bounce, springiness, wobble, elasticity. etc. When setting a value for the =curve= property, you can provide your own hand-rolled curve function, or you can pick from the many convenient curve function generators provided in the =Uize.Curve= and =Uize.Curve.Rubber= modules. Even more complex curve functions can be generated using the versatile curve function modifiers provided in the =Uize.Curve.Mod= module.

					NOTES
					- the initial value is =undefined=
					- the sum of the `acceleration State Property (DEPRECATED 2009-07-10)` and `deceleration State Property (DEPRECATED 2009-07-10)` must not exceed =1=
					- see also the `acceleration State Property (DEPRECATED 2009-07-10)`
					- see the =curve= state property and the =Uize.Fade.celeration= static method
		*/

		return _class;
	}
});

