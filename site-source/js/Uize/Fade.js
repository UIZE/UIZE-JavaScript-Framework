/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Fade Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2016 UIZE
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

		For an in-depth discussion on animation in the UIZE JavaScript Framework, and for a discussion on how this module fits into the larger picture, consult the guide [[../guides/javascript-animation-and-effects.html][JavaScript Animation and Effects]] and read through the section `The Engine`.
*/

Uize.module ({
	name:'Uize.Fade',
	superclass:'Uize.Class',
	required:'Uize.Math.Blend',
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_constrain = Uize.constrain,
				_now = Uize.now,

			/*** General Variables ***/
				_activeFades = [],
				_anyActiveFades = false,
				_interval,
				_valueUnchanged = {},
				_blendValues = Uize.Math.Blend.blend
		;

		/*** Utility Functions ***/
			function _updateAnyActiveFades () {
				if ((_anyActiveFades = !!_activeFades.length) != !!_interval)
					_interval = _anyActiveFades ? setInterval (_advanceActiveFades,10) : clearInterval (_interval)
				;
			}

			function _advanceActiveFades () {
				for (var _activeFadeNo = -1, _activeFade; ++_activeFadeNo < _activeFades.length;)
					(_activeFade = _activeFades [_activeFadeNo])._inProgress
						? _advance (_activeFade)
						: _activeFades.splice (_activeFadeNo--,1)
				;
				_updateAnyActiveFades ();
			}

		/*** Private Instance Methods ***/
			function _updateValue () {
				var
					m = this,
					_value = _blendValues (
						m._startValue,
						m._endValue,
						m._progress,
						m._quantization,
						m._curve,
						m._value,
						_valueUnchanged
					)
				;
				if (_value != _valueUnchanged)
					_value != m._value
						? m.set ({_value:_value})
						: m.fire ({name:'Changed.value',newValue:_value})
				;
			};

			function _advance (m) {
				var _completion = Math.min ((_now () - m._startTime) / m._duration,1);
				m.set ({_progress:m._reverse ? 1 - _completion : _completion});
				if (_completion == 1) {
					m.stop ();
					m.fire ('Done');
						/*?
							Instance Events
								Done
									Fired each time the fade ends.

									NOTES
									- see also the =Start= instance event.
						*/
				}
			};

			function _setCurveFromAccelerationDeceleration () {
				var m = this;
				m.set ({
					_curve:
						m._acceleration || m._deceleration
							? m.Class.celeration (m._acceleration,m._deceleration)
							: null
				});
			}

			function _forceValueUpdate () {
				this._value = null;
				_updateValue.call (this);
			}

		return Uize.mergeInto (
			_superclass.subclass ({
				instanceMethods:{
					stop:function () {
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
					},

					start:function (_properties) {
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
					}
				},

				staticMethods:{
					blendValues:_blendValues,

					celeration:function (_acceleration,_deceleration) {
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
					}
				},

				stateProperties:{
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

									Implemented in the Uize.Math.Blend Module
										Supported for curves in the =Uize.Fade= class is based on support for curves in the =Uize.Math.Blend= module.

										This module provides the underlying value blending engine that is used in fades. For an in-depth discussion of curves and such topics as compound (hierarchical) quantization objects, consult the reference for the =Uize.Math.Blend= module.

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
									- the initial value is =2000= (i.e. two seconds)
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
							var m = this;
							if (m._inProgress) {
								m._startTime = _now ();
								m.fire ('Start');
									/*?
										Instance Events
											Start
												Fired each time the fade starts.

												NOTES
												- see also the =Done= instance event.
									*/
								m._value = m._progress = null;
									/* NOTES:
										- this is to make sure there are always initial change events for these properties. However, maybe with the model of registering handlers on these properties, it shouldn't be necessary (or maybe it's not even appropriate) to coerce this change in this place. Maybe it's OK for the user of this class to only be informed when the value or progress actually changes.
									*/
								_advance (m);

								_activeFades.push (m);
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
						onChange:_updateValue,
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

									Implemented in the Uize.Math.Blend Module
										Supported for quantization in the =Uize.Fade= class is based on support for quantization in the =Uize.Math.Blend= module.

										This module provides the underlying value blending engine that is used in fades. For an in-depth discussion of quantization and such topics as compound (hierarchical) quantization objects, consult the reference for the =Uize.Math.Blend= module.

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
				}
			}),
			{
				nonInheritableStatics:{
					blendValues:1,
					celeration:1
				}
			}
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

					Uize.Fade.blendValues Static Methods (DEPRECATED 2011-11-24)

						..........................................................
						Uize.Fade.blendValues  >> BECOMES >> Uize.Math.Blend.blend
						..........................................................
			*/
		);
	}
});

