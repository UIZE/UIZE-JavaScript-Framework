/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Curve Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 6
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Curve= module provides a namespace and services for curve related modules, and provides a number of useful built-in curve function generators.

		*DEVELOPERS:* `Chris van Rensburg`, with thanks to `Robert Penner` for his easing equations work

		The =Uize.Curve= module defines a namespace for other curve related modules (such as the =Uize.Curve.Rubber= and =Uize.Curve.Mod= modules), that provides some basic services that are useful for creating such curve related modules, and that also provides a number of the more commonly used curve function generators as built-ins.

		In a Nutshell
			The =Uize.Curve= module provides built-in curve function generators for power easing curves, "sweetened" power easing curves, sinusoidal easing curves, circular easing curves, exponential easing curves, and basic straight line curves.

			This module also provides curve function modifiers for making ease-out, ease-in-out, and ease-in-the-middle curve functions from ease-in curve functions, as well as a method for making ease-in, ease-out, ease-in-out, and ease-in-the-middle curve function generators from an ease-in curve function generator. Finally, miscellaneous services are provided that are useful for other curve related modules, such as the =Uize.Curve.linear= curve function, =Uize.Curve.resolve= static method, etc.

			BACKGROUND READING

			For an in-depth discussion on animation in the UIZE JavaScript Framework, and for a discussion on how this module fits into the larger picture, consult the explainer [[../explainers/javascript-animation-and-effects.html][JavaScript Animation and Effects]] and read through the section `Curves`.
*/

Uize.module ({
	name:'Uize.Curve',
	builder:function () {
		'use strict';

		var _package = function () {};

		/*** Variables for Scruncher Optimization ***/
			var _undefined;

		/*** Public Static Methods ***/
			var
				_blendFloats = _package.blendFloats = function (_valueA,_valueB,_blend) {
					return _valueA + (_valueB - _valueA) * _blend
					/*?
						Static Methods
							Uize.Curve.blendFloats
								Returns a floating point number, that is the blend between the two specified floating point numbers, using the specified blend amount.

								SYNTAX
								...............................................................................
								blendedFLOAT = Uize.Curve.blendFloats (value1FLOAT,value2FLOAT,blend0to1FLOAT);
								...............................................................................

								When the value =0= is specified for the =blend0to1FLOAT= parameter, the value of the =value1FLOAT= parameter will be returned. When the value =1= is specified for =blend0to1FLOAT=, then the value of =value2FLOAT= will be returned. And when the value =.5= is specified for =blend0to1FLOAT=, then the returned value will be an equal blend between the values of =value1FLOAT= and =value2FLOAT=. The blend between the values of =value1FLOAT= and =value2FLOAT=, as specified by the =blend0to1FLOAT= parameter, is a simple linear interpolation.

								NOTES
								- compare to the =Uize.Curve.makeBlender= static method
					*/
				},
				_linear = _package.linear = Uize.returnX,
					/*?
						Static Methods
							Uize.Curve.linear
								A simple linear curve function (ie. *NOT* a curve function generator) that merely returns the value that is passed into it.

								SYNTAX
								................................................
								valueANYTYPE = Uize.Curve.linear (valueANYTYPE);
								................................................

								This method / curve function is useful for curve function modifiers that expect curve functions as parameters. One is not likely to call this method directly, but instead supply it - by reference - as a parameter to other methods.

								NOTES
								- compare to the =Uize.Curve.line= static method
					*/
				_makeEaseOut = _package.makeEaseOut = function (_curveFunction) {
					return function (_value) {return 1 - _curveFunction (1 - _value)}
					/*?
						Static Methods
							Uize.Curve.makeEaseOut
								Returns an ease-out curve function, that is the 180 degree rotated version of the specified ease-in curve function.

								SYNTAX
								............................................................
								easeOutCurveFUNC = Uize.Curve.makeEaseOut (easeInCurveFUNC);
								............................................................

								Assuming that the curve function specified by the =easeInCurveFUNC= parameter is truly for an ease-in curve function, then the curve function that is returned by this method will effectively be an ease-out curve function.

								NOTES
								- see the related =Uize.Curve.makeEaseInOut=, =Uize.Curve.makeEaseMiddle=, and =Uize.Curve.makeEasingCurveGenerators= static methods
					*/
				},
				_makeEaseInOut = _package.makeEaseInOut = function (_curveFunction) {
					return function (_value) {
						return ((_value *= 2) < 1 ? _curveFunction (_value) : 2 - _curveFunction (2 - _value)) / 2;
					}
					/*?
						Static Methods
							Uize.Curve.makeEaseInOut
								Returns an ease-in-out curve function, that uses the specified ease-in curve function to produce a two phase curve that has an ease-in phase followed by an ease-out phase.

								SYNTAX
								................................................................
								easeInOutCurveFUNC = Uize.Curve.makeEaseInOut (easeInCurveFUNC);
								................................................................

								Assuming that the curve function specified by the =easeInCurveFUNC= parameter is truly for an ease-in curve function, then the curve function that is returned by this method will effectively be an ease-in-out curve function.

								NOTES
								- see the related =Uize.Curve.makeEaseOut=, =Uize.Curve.makeEaseMiddle=, and =Uize.Curve.makeEasingCurveGenerators= static methods
					*/
				},
				_makeEaseMiddle = _package.makeEaseMiddle = function (_curveFunction) {
					return function (_value) {
						return ((_value *= 2) < 1 ? 1 - _curveFunction (1 - _value) : 1 + _curveFunction (_value - 1)) / 2;
					}
					/*?
						Static Methods
							Uize.Curve.makeEaseMiddle
								Returns an ease-in-the-middle curve function, that uses the specified ease-in curve function to produce a two phase curve that has an ease-out phase followed by an ease-in phase.

								SYNTAX
								..................................................................
								easeMiddleCurveFUNC = Uize.Curve.makeEaseMiddle (easeInCurveFUNC);
								..................................................................

								Assuming that the curve function specified by the =easeInCurveFUNC= parameter is truly for an ease-in curve function, then the curve function that is returned by this method will effectively be an ease-in-the-middle curve function.

								NOTES
								- see the related =Uize.Curve.makeEaseOut=, =Uize.Curve.makeEaseInOut=, and =Uize.Curve.makeEasingCurveGenerators= static methods
					*/
				},
				_makeEasingCurveGenerators = _package.makeEasingCurveGenerators = function (
					_methodNameSuffix,_easeInCurveGenerator,_context
				) {
					var _paramless = {};
					if (!_context) _context = _package;
					_methodNameSuffix = Uize.capFirstChar (_methodNameSuffix);

					function _makeCurveGenerator (_easeType,_easingCurveGeneratorMaker) {
						_context ['ease' + _easeType + _methodNameSuffix] = function () {
							return (
								arguments.length
									? _easingCurveGeneratorMaker (_easeInCurveGenerator.apply (0,arguments))
									:
										_paramless [_easeType] ||
										(
											_paramless [_easeType] =
												_easingCurveGeneratorMaker (
													_paramless.In || (_paramless.In = _easeInCurveGenerator ()))
												)
							)
						};
					}
					_makeCurveGenerator ('In',_linear);
					_makeCurveGenerator ('Out',_makeEaseOut);
					_makeCurveGenerator ('InOut',_makeEaseInOut);
					_makeCurveGenerator ('Middle',_makeEaseMiddle);
					/*?
						Static Methods
							Uize.Curve.makeEasingCurveGenerators
								Makes static methods for generating an ease-in curve function, ease-out curve function, ease-in-out curve function, and ease-in-the-middle curve function, using the specified ease-in curve function generator.

								SYNTAX
								......................................
								Uize.Curve.makeEasingCurveGenerators (
									methodNameSuffixSTR,
									easeInCurveGeneratorFUNC,
									contextOBJ
								);
								......................................

								This method is provided as a convenience to make it easier to spawn easing curve function generators for different types of curves. The =Uize.Curve= module, itself, uses this method to create its many curve function generator methods, as does the =Uize.Curve.Rubber= module.

								Parameters
									The =Uize.Curve.makeEasingCurveGenerators= method supports the following parameters...

									methodNameSuffixSTR
										A string, specifying the suffix of the method names for the four static methods that are created.

										The static methods created by this method are named with the prefixes "easeIn", "easeOut", "easeInOut", and "easeMiddle". When creating easing curve function generators in a context that will have other curve function generators, the suffix allows you to distinguish between the curve function generators for different types of curves. The first letter of the specified suffix is uppercased before appending it to the method name prefixes.

										For example, with the methods =Uize.Curve.easeInSine=, =Uize.Curve.easeOutSine=, =Uize.Curve.easeInOutSine=, and =Uize.Curve.easeMiddleSine=, the value used for =methodNameSuffixSTR= would be ='Sine'= (or ='sine'=). With the methods =Uize.Curve.easeInExpo=, =Uize.Curve.easeOutExpo=, =Uize.Curve.easeInOutExpo=, and =Uize.Curve.easeMiddleExpo=, the value used for =methodNameSuffixSTR= would be ='Expo'= (or ='expo'=).

									easeInCurveGeneratorFUNC
										A function, being the curve function generator for the ease-in curve function from which you would like to derive the ease-in, ease-out, ease-in-out, and ease-middle curve function generator static methods.

									contextOBJ
										An object, specifying the context for the curve function generators.

										This parameter is optional - when a value is not specified for it, its value will be defaulted to =Uize.Curve=. Using this parameter, you could assign the curve function generators to a module other than =Uize.Curve=. For example, the =Uize.Curve.Rubber= module uses the =Uize.Curve.makeEasingCurveGenerators= method to create its curve function generators and specifies a reference to =Uize.Curve.Rubber= as the value for the =contextOBJ= parameter.

										TIP

										If you wish to assign the curve function generators on the actual ease-in curve function generator, then you can specify the curve function generator as the value for the =contextOBJ= parameter and then specify the value =''= (empty string) for the =methodNameSuffixSTR= parameter.

								Examples
									The following examples illustrate different uses of the =Uize.Curve.makeEasingCurveGenerators= method...

									EXAMPLE 1
									..............................................................
									Uize.Curve.makeEasingCurveGenerators (
										'Power',
										function (power) {
											if (power == null) power = 2;
											return function (value) {return Math.pow (value,power)};
										}
									);

									// now you can call the newly created static methods...

									Uize.Curve.easeInPower ();
									Uize.Curve.easeInPower (2);
									Uize.Curve.easeOutPower (3);
									Uize.Curve.easeInOutPower (2.5);
									Uize.Curve.easeMiddlePower (3.1);
									..............................................................

									In the above example, the traditional approach is being used to create easing curve function generators that are accessed off of the =Uize.Curve= module (the default context). Because the value ='Power'= is specified for the =methodNameSuffixSTR= parameter, the created methods names are =easeInPower=, =easeOutPower=, =easeInOutPower=, and =easeMiddlePower=.

									EXAMPLE 2
									................................................................
									function powerCurve (power) {
										if (power == null) power = 2;
										return function (value) {return Math.pow (value,power)};
									};
									Uize.Curve.makeEasingCurveGenerators ('',powerCurve,powerCurve);

									// now you can call the newly created static methods...

									powerCurve.easeIn ();   // equivalent to powerCurve (2)
									powerCurve.easeIn (2);  // equivalent to powerCurve (2)
									powerCurve.easeOut (3);
									powerCurve.eastInOut (2.5);
									powerCurve.easeMiddle (3.1);
									................................................................

									In the above example, the ease-in curve function generator is being used as the context for the easing curve function generators. This is done by specifying the =powerCurve= function not only as the value for the =easeInCurveGeneratorFUNC= parameter, but also as the value for the =contextOBJ= parameter. Then, specifying the value =''= (empty string) for the =methodNameSuffixSTR= parameter means that the methods accessed off of =powerCurve= are named simply =easeIn=, =easeOut=, =easeInOut=, and =easeMiddle=.

								Caching of Paramless Versions
									As an optimization, the =Uize.Curve.makeEasingCurveGenerators= method caches the results of the paramless calls to the curve functions generators that it creates.

									This means that the statement =Uize.Curve.easeOutPow ()= will always return a reference to the same curve function - for a quadratic ease-out curve. In contrast, the statement =Uize.Curve.easeOutPow (3)= will always return different curve functions - even though they will always do the same thing (ie. produce a cubic ease-out curve).

								NOTES
								- see the related =Uize.Curve.makeEaseOut=, =Uize.Curve.makeEaseInOut=, and =Uize.Curve.makeEaseMiddle= static methods
					*/
				}
			;

			_package.makeBlender = function (_curveFunction) {
				_curveFunction = _package.resolve (_curveFunction);
				return function (_valueA,_valueB,_blend) {return _blendFloats (_valueA,_valueB,_curveFunction (_blend))};
				/*?
					Static Methods
						Uize.Curve.makeBlender
							Return a blender function, that will use the specified curve function when blending between two values.

							SYNTAX
							........................................................
							blenderFUNC = Uize.Curve.makeBlender (curveFUNCorFLOAT);
							........................................................

							The blender function that is returned by this method has the same signature as the =Uize.Curve.blendFloats= static method and accepts three parameters: =value1FLOAT=, =value2FLOAT=, and =blend0to1FLOAT=.

							EXAMPLE
							..................................................................................
							var
								bouncyBlender = Uize.Curve.makeBlender (Uize.Curve.Rubber.easeOutBounce (4,2)),
								middleOfBounceValue = bouncyBlender (0,255,.5)  // result is 90.4438142188662
							;
							..................................................................................

							In the above example, the =middleOfBounceValue= variable will be left with the value =90.4438142188662=, being the value halfway between =0= and =255= on an extra bouncy ease-out bounce curve with four bounces.

							NOTES
							- compare to the =Uize.Curve.blendFloats= static method
							- numerical values for the =curveFUNCorFLOAT= parameter are resolved to curve functions using the =Uize.Curve.resolve= static method
				*/
			};

			_package.resolve = function (_curveFunction,_defaultCurveFunction,_sweet,_polarity) {
				if (_curveFunction == _undefined) _curveFunction = _defaultCurveFunction;
				return (
					Uize.isFunction (_curveFunction) || Uize.isArray (_curveFunction)
						? _curveFunction
						: !_curveFunction || _curveFunction * _curveFunction == 1
							? _linear
							: _package [
								(_curveFunction * (_polarity || 1) < 0 ? 'easeIn' : 'easeOut') + (_sweet ? 'Sweet' : '') + 'Pow'
							] (
								Math.abs (_curveFunction)
							)
				)
				/*?
					Static Methods
						Uize.Curve.resolve
							Resolves the specified curve function or power curve value to a curve function and returns it.

							SYNTAX
							...................................................................................
							curveFUNC = Uize.Curve.resolve (
								curveFUNCorFLOAT,         // value to be resolved to a curve function (optional)
								defaultCurveFUNCorFLOAT,  // default curve function or power (optional)
								sweetBOOL,                // use sweetened power curve functions (optional)
								polarityINT               // polarity, in case negating is desired (optional)
							);
							...................................................................................

							This method can be useful when implementing your own curve function generators - for either complex curves or for curve function modifiers - and when such curve function generators wish to support the numerical shorthand for specifying power curve functions for parameters that are curve functions.

							A good example of this is the =Uize.Curve.Mod.bend= static method of the =Uize.Curve.Mod= module. This method accepts a curve and then bends it horizontally and/or vertically, using specified curves for both horizontal and vertical bending. In most simple cases, power curve functions are effective for achieving smooth / regular bending. The =Uize.Curve.Mod.bend= method supports numerical values for its =horzBendFLOATorFUNC= and =vertBendFLOATorFUNC= parameters (a convenience provided to applications that wish to use the method), and its implementation uses the =Uize.Curve.resolve= method to resolve these numerical values to actual curve functions.

							Parameters
								The =Uize.Curve.resolve= method supports the following parameters...

								curveFUNCorFLOAT
									A curve function, or a number that should be used to generate a power curve function.

									Handling for different types of values is as follows...

									- *function* - When a function is specified, it will simply be returned as is.

									- *array* - When an array is specified, it will simply be returned as is.

									- *positive number* - When a positive number is specified, then an ease-out power curve function will be returned of that power. For example, the statement =Uize.Curve.resolve (3)= would be equivalent to the statement =Uize.Curve.easeOutPow (3)= (provided the value =true= is *not* specified for the optional =sweetBOOL= parameter, and the value =-1= is *not* specified for the optional =polarityINT= parameter).

									- *negative number* - When a negative number is specified, then an ease-in power curve function will be returned of the negative of that power. For example, the statement =Uize.Curve.resolve (-3)= would be equivalent to the statement =Uize.Curve.easeInPow (3)= (provided the value =true= is *not* specified for the optional =sweetBOOL= parameter, and the value =-1= is *not* specified for the optional =polarityINT= parameter).

									- *-1, 0, or 1* - When either of the values =-1=, =0=, or =1= is specified, then a reference to =Uize.Curve.linear= (a linear curve function) will be returned.

									- *not defined* - When either of the values =null= or =undefined= is specified, then the =curveFUNCorFLOAT= parameter will be defaulted to the value of the optional =defaultCurveFUNCorFLOAT= parameter.

								defaultCurveFUNCorFLOAT
									A curve function, or a number that should be used to generate a power curve function, that should be used as the default curve if the value =null= or =undefined= is specified for the =curveFUNCorFLOAT= parameter.

									When the optional =defaultCurveFUNCorFLOAT= parameter is specified, a curve other than a linear curve can be used as the default. When the =defaultCurveFUNCorFLOAT= parameter is not specified, =Uize.Curve.linear= (a linear curve function) will be used as the default curve.

								sweetBOOL
									A boolean, specifying whether or not the "sweetened" versions of the power curve functions should be used when a number is specified for the =curveFUNCorFLOAT= parameter.

									- =false= - When the value =false= is specified, the =Uize.Curve.easeInPow= static method will be used for resolving negative number values of =curveFUNCorFLOAT=, and the =Uize.Curve.easeOutPow= static method will be used for resolving positive number values of =curveFUNCorFLOAT=.

									- =true= - When the value =true= is specified, the =Uize.Curve.easeInSweetPow= static method will be used for resolving negative number values of =curveFUNCorFLOAT=, and the =Uize.Curve.easeOutSweetPow= static method will be used for resolving positive number values of =curveFUNCorFLOAT=.

									When the optional =sweetBOOL= parameter is not specified, its value will be defaulted to =false=.

								polarityINT
									An integer, specifying whether or not numerical values for the =curveFUNCorFLOAT= parameter should be negated (ie. multiplied by =-1=).

									- =1= - When the value =1= is specified, numerical values for =curveFUNCorFLOAT= will be unaltered.

									- =-1= - When the value =-1= is specified, numerical values for =curveFUNCorFLOAT= will be negated.

									When the optional =polarityINT= parameter is not specified, its value will be defaulted to =1=.

							Variations
								VARIATION 1
								...................................................................................
								curveFUNC = Uize.Curve.resolve (curveFUNCorFLOAT,defaultCurveFUNCorFLOATsweetBOOL);
								...................................................................................

								When the optional =polarityINT= parameter is not specified, its value will be defaulted to =1= and there will be no polarity inversion when a number is specified for the =curveFUNCorFLOAT= parameter.

								VARIATION 2
								..........................................................................
								curveFUNC = Uize.Curve.resolve (curveFUNCorFLOAT,defaultCurveFUNCorFLOAT);
								..........................................................................

								When the optional =sweetBOOL= parameter is not specified, its value will be defaulted to =false= and the standard power curve function generators =Uize.Curve.easeInPow= and =Uize.Curve.easeOutPow= will be used when a number is specified for the =curveFUNCorFLOAT= parameter.

								VARIATION 3
								..................................................
								curveFUNC = Uize.Curve.resolve (curveFUNCorFLOAT);
								..................................................

								When the optional =defaultCurveFUNCorFLOAT= parameter is not specified, its value will be defaulted to =Uize.Curve.linear= and a linear curve function will be returned when the values =null= or =undefined= are specified for the =curveFUNCorFLOAT= parameter.

								VARIATION 4
								..................................
								curveFUNC = Uize.Curve.resolve ();
								..................................

								When no parameters are specified, then a linear curve function (a reference to =Uize.Curve.linear=) will be returned.
				*/
			};

			/*** Curve Function Generators ***/
				var _optimizedPowerCurveMap = {
					.5:Math.sqrt,
					1:_linear,
					2:function (_value) {return _value * _value * (_value > 0 || -1)},
					3:function (_value) {return _value * _value * _value},
					4:function (_value) {return _value * _value * _value * _value * (_value > 0 || -1)},
					5:function (_value) {return _value * _value * _value * _value * _value}
				};
				_makeEasingCurveGenerators (
					'pow',
					function (_power) {
						return (
							_optimizedPowerCurveMap [_power || (_power = 2)] ||
							function (_value) {return Math.pow (_value * (_value > 0 || -1),_power) * (_value > 0 || -1)}
						);
					},
					_package
					/*?
						Static Methods
							Uize.Curve.easeInPow
								Power easing in - accelerating from zero velocity, where the power can be specified.

								SYNTAX
								..............................................
								curveFUNC = Uize.Curve.easeInPow (powerFLOAT);
								..............................................

								This method returns optimized curve functions for the powers =.5= (square root), =1= (linear), =2= (squared / quadratic), =3= (cubic), =4= (quartic), and =5= (quintic).

								NOTES
								- compare to the =Uize.Curve.easeInSweetPow= curve function generator
								- see also the companion =Uize.Curve.easeOutPow=, =Uize.Curve.easeInOutPow=, and =Uize.Curve.easeMiddlePow= static methods

							Uize.Curve.easeOutPow
								Power easing out - decelerating to zero velocity, where the power can be specified.

								SYNTAX
								...............................................
								curveFUNC = Uize.Curve.easeOutPow (powerFLOAT);
								...............................................

								This method returns optimized curve functions for the powers =.5= (square root), =1= (linear), =2= (squared / quadratic), =3= (cubic), =4= (quartic), and =5= (quintic).

								NOTES
								- compare to the =Uize.Curve.easeOutSweetPow= curve function generator
								- see also the companion =Uize.Curve.easeInPow=, =Uize.Curve.easeInOutPow=, and =Uize.Curve.easeMiddlePow= static methods

							Uize.Curve.easeInOutPow
								Power easing in/out - acceleration until halfway, then deceleration, where the power can be specified.

								SYNTAX
								.................................................
								curveFUNC = Uize.Curve.easeInOutPow (powerFLOAT);
								.................................................

								This method returns optimized curve functions for the powers =.5= (square root), =1= (linear), =2= (squared / quadratic), =3= (cubic), =4= (quartic), and =5= (quintic).

								NOTES
								- compare to the =Uize.Curve.easeInOutSweetPow= curve function generator
								- see also the companion =Uize.Curve.easeInPow=, =Uize.Curve.easeOutPow=, and =Uize.Curve.easeMiddlePow= static methods

							Uize.Curve.easeMiddlePow
								Power easing in the middle - deceleration until halfway, then acceleration, where the power can be specified.

								SYNTAX
								..................................................
								curveFUNC = Uize.Curve.easeMiddlePow (powerFLOAT);
								..................................................

								This method returns optimized curve functions for the powers =.5= (square root), =1= (linear), =2= (squared / quadratic), =3= (cubic), =4= (quartic), and =5= (quintic).

								NOTES
								- compare to the =Uize.Curve.easeMiddleSweetPow= curve function generator
								- see also the companion =Uize.Curve.easeInPow=, =Uize.Curve.easeOutPow=, and =Uize.Curve.easeInOutPow= static methods
					*/
				);

				_makeEasingCurveGenerators (
					'sweetPow',
					function (_power) {
						return function (_value) {
							var
								_inPow = _package.easeInPow (_power),
								_inverseInPow = _package.easeInPow (1 / _power)
							;
							return (_inPow (_value) + 1 - _inverseInPow (1 - _value)) / 2;
						}
					},
					_package
					/*?
						Static Methods
							Uize.Curve.easeInSweetPow
								Sweetened power easing in - accelerating from zero velocity, where the power can be specified.

								SYNTAX
								...................................................
								curveFUNC = Uize.Curve.easeInSweetPow (powerFLOAT);
								...................................................

								A standard power curve is "sweetened" by blending it equally with the 180 degree rotated version of its corresponding inverse power curve, producing a curve that is closer to being circular.

								NOTES
								- compare to the =Uize.Curve.easeInPow= curve function generator
								- see also the companion =Uize.Curve.easeOutSweetPow=, =Uize.Curve.easeInOutSweetPow=, and =Uize.Curve.easeMiddleSweetPow= static methods

							Uize.Curve.easeOutSweetPow
								Sweetened power easing out - decelerating to zero velocity, where the power can be specified.

								SYNTAX
								....................................................
								curveFUNC = Uize.Curve.easeOutSweetPow (powerFLOAT);
								....................................................

								A standard power curve is "sweetened" by blending it equally with the 180 degree rotated version of its corresponding inverse power curve, producing a curve that is closer to being circular.

								NOTES
								- compare to the =Uize.Curve.easeOutPow= curve function generator
								- see also the companion =Uize.Curve.easeInSweetPow=, =Uize.Curve.easeInOutSweetPow=, and =Uize.Curve.easeMiddleSweetPow= static methods

							Uize.Curve.easeInOutSweetPow
								Sweetened power easing in/out - acceleration until halfway, then deceleration, where the power can be specified.

								SYNTAX
								......................................................
								curveFUNC = Uize.Curve.easeInOutSweetPow (powerFLOAT);
								......................................................

								A standard power curve is "sweetened" by blending it equally with the 180 degree rotated version of its corresponding inverse power curve, producing a curve that is closer to being circular.

								NOTES
								- compare to the =Uize.Curve.easeInOutPow= curve function generator
								- see also the companion =Uize.Curve.easeInSweetPow=, =Uize.Curve.easeOutSweetPow=, and =Uize.Curve.easeMiddleSweetPow= static methods

							Uize.Curve.easeMiddleSweetPow
								Sweetened power easing in the middle - deceleration until halfway, then acceleration, where the power can be specified.

								SYNTAX
								.......................................................
								curveFUNC = Uize.Curve.easeMiddleSweetPow (powerFLOAT);
								.......................................................

								A standard power curve is "sweetened" by blending it equally with the 180 degree rotated version of its corresponding inverse power curve, producing a curve that is closer to being circular.

								NOTES
								- compare to the =Uize.Curve.easeMiddlePow= curve function generator
								- see also the companion =Uize.Curve.easeInSweetPow=, =Uize.Curve.easeOutSweetPow=, and =Uize.Curve.easeInOutSweetPow= static methods
					*/
				);

				_makeEasingCurveGenerators (
					'expo',
					function () {return function (_value) {return _value && Math.pow (2,10 * (_value - 1))}},
					_package
					/*?
						Static Methods
							Uize.Curve.easeInExpo
								Exponential easing in - accelerating from zero velocity.

								SYNTAX
								.....................................
								curveFUNC = Uize.Curve.easeInExpo ();
								.....................................

								NOTES
								- see also the companion =Uize.Curve.easeOutExpo=, =Uize.Curve.easeInOutExpo=, and =Uize.Curve.easeMiddleExpo= static methods
								- thanks to `Robert Penner` for his original implementation

							Uize.Curve.easeOutExpo
								Exponential easing out - decelerating to zero velocity.

								SYNTAX
								......................................
								curveFUNC = Uize.Curve.easeOutExpo ();
								......................................

								NOTES
								- see also the companion =Uize.Curve.easeInExpo=, =Uize.Curve.easeInOutExpo=, and =Uize.Curve.easeMiddleExpo= static methods
								- thanks to `Robert Penner` for his original implementation

							Uize.Curve.easeInOutExpo
								Exponential easing in/out - accelerating until halfway, then decelerating.

								SYNTAX
								........................................
								curveFUNC = Uize.Curve.easeInOutExpo ();
								........................................

								NOTES
								- see also the companion =Uize.Curve.easeInExpo=, =Uize.Curve.easeOutExpo=, and =Uize.Curve.easeMiddleExpo= static methods
								- thanks to `Robert Penner` for his original implementation

							Uize.Curve.easeMiddleExpo
								Exponential easing in the middle - decelerating until halfway, then accelerating.

								SYNTAX
								.........................................
								curveFUNC = Uize.Curve.easeMiddleExpo ();
								.........................................

								NOTES
								- see also the companion =Uize.Curve.easeInExpo=, =Uize.Curve.easeOutExpo=, and =Uize.Curve.easeInOutExpo= static methods
								- thanks to `Robert Penner` for his original implementation
					*/
				);

				_makeEasingCurveGenerators (
					'circular',
					function (_power) {
						return (
							_power == 1
								? _linear
								: _power == _undefined || _power == 2
									?
										function (_value) {
											return 1 - Math.sqrt (Math.abs (_value = 1 - _value * _value)) * (_value > 0 || -1)
										}
									:
										function (_value) {
											return 1 - Math.pow (Math.abs (_value = 1 - Math.pow (_value,_power)),1 / _power) * (_value > 0 || -1);
										}
						);
					},
					_package
					/*?
						Static Methods
							Uize.Curve.easeInCircular
								Circular easing in - accelerating from zero velocity.

								SYNTAX
								.........................................
								curveFUNC = Uize.Curve.easeInCircular ();
								.........................................

								VARIATION
								....................................................
								curveFUNC = Uize.Curve.easeInCircular (powerFLOAT);
								....................................................

								When the optional =powerFLOAT= parameter is specified, a curve function can be generated that is not perfectly circular but still has the property of being symmetrical with respect to the diagonal that runs from bottom left to top right. When the =powerFLOAT= parameter is not specified, the value =2= is used as its default. Values higher than =2= will produce curves that bend down towards the bottom right corner, and positive values lower than =2= will produce curves that bend upwards towards the top left corner (=0= being the most extreme). The value =1= will produce a linear curve, and values between =1= and =2= will produce curves that are between perfectly linear and perfectly circular.

								NOTES
								- see also the companion =Uize.Curve.easeOutCircular=, =Uize.Curve.easeInOutCircular=, and =Uize.Curve.easeMiddleCircular= static methods
								- thanks to `Robert Penner` for his original implementation

							Uize.Curve.easeOutCircular
								Circular easing out - decelerating to zero velocity.

								SYNTAX
								..........................................
								curveFUNC = Uize.Curve.easeOutCircular ();
								..........................................

								VARIATION
								....................................................
								curveFUNC = Uize.Curve.easeOutCircular (powerFLOAT);
								....................................................

								When the optional =powerFLOAT= parameter is specified, a curve function can be generated that is not perfectly circular but still has the property of being symmetrical with respect to the diagonal that runs from bottom left to top right. When the =powerFLOAT= parameter is not specified, the value =2= is used as its default. Values higher than =2= will produce curves that bend upwards towards the top left corner, and positive values lower than =2= will produce curves that bend downwards towards the bottom right corner (=0= being the most extreme). The value =1= will produce a linear curve, and values between =1= and =2= will produce curves that are between perfectly linear and perfectly circular.

								NOTES
								- see also the companion =Uize.Curve.easeInCircular=, =Uize.Curve.easeInOutCircular=, and =Uize.Curve.easeMiddleCircular= static methods
								- thanks to `Robert Penner` for his original implementation

							Uize.Curve.easeInOutCircular
								Circular easing in/out - acceleration until halfway, then deceleration.

								SYNTAX
								............................................
								curveFUNC = Uize.Curve.easeInOutCircular ();
								............................................

								VARIATION
								......................................................
								curveFUNC = Uize.Curve.easeInOutCircular (powerFLOAT);
								......................................................

								When the optional =powerFLOAT= parameter is specified, a curve function can be generated that is not perfectly circular but still has the property of being symmetrical with respect to the diagonal that runs from bottom left to top right. When the =powerFLOAT= parameter is not specified, the value =2= is used as its default. Values higher than =2= and positive values lower than =2= will produce curves that bend more extremely towards the corners. The value =1= will produce a linear curve, and values between =1= and =2= will produce curves that are between perfectly linear and perfectly circular.

								NOTES
								- see also the companion =Uize.Curve.easeInCircular=, =Uize.Curve.easeInCircular=, and =Uize.Curve.easeMiddleCircular= static methods
								- thanks to `Robert Penner` for his original implementation

							Uize.Curve.easeMiddleCircular
								Circular easing in the middle - deceleration until halfway, then acceleration.

								SYNTAX
								.............................................
								curveFUNC = Uize.Curve.easeMiddleCircular ();
								.............................................

								VARIATION
								.......................................................
								curveFUNC = Uize.Curve.easeMiddleCircular (powerFLOAT);
								.......................................................

								When the optional =powerFLOAT= parameter is specified, a curve function can be generated that is not perfectly circular but still has the property of being symmetrical with respect to the diagonal that runs from bottom left to top right. When the =powerFLOAT= parameter is not specified, the value =2= is used as its default. Values higher than =2= and positive values lower than =2= will produce curves that bend more extremely towards the corners. The value =1= will produce a linear curve, and values between =1= and =2= will produce curves that are between perfectly linear and perfectly circular.

								NOTES
								- see also the companion =Uize.Curve.easeInCircular=, =Uize.Curve.easeOutCircular=, and =Uize.Curve.easeInOutCircular= static methods
								- thanks to `Robert Penner` for his original implementation
					*/
				);

				_makeEasingCurveGenerators (
					'sine',
					function () {
						var _piDiv2 = Math.PI / 2;
						return function (_value) {return 1 - Math.cos (_value * _piDiv2)};
					},
					_package
					/*?
						Static Methods
							Uize.Curve.easeInSine
								Sinusoidal easing in - accelerating from zero velocity.

								SYNTAX
								.....................................
								curveFUNC = Uize.Curve.easeInSine ();
								.....................................

								NOTES
								- see also the companion =Uize.Curve.easeOutSine=, =Uize.Curve.easeInOutSine=, and =Uize.Curve.easeMiddleSine= static methods
								- thanks to `Robert Penner` for his original implementation

							Uize.Curve.easeOutSine
								Sinusoidal easing out - decelerating to zero velocity.

								SYNTAX
								......................................
								curveFUNC = Uize.Curve.easeOutSine ();
								......................................

								NOTES
								- see also the companion =Uize.Curve.easeInSine=, =Uize.Curve.easeInOutSine=, and =Uize.Curve.easeMiddleSine= static methods
								- thanks to `Robert Penner` for his original implementation

							Uize.Curve.easeInOutSine
								Sinusoidal easing in/out - accelerating until halfway, then decelerating.

								SYNTAX
								........................................
								curveFUNC = Uize.Curve.easeInOutSine ();
								........................................

								NOTES
								- see also the companion =Uize.Curve.easeInSine=, =Uize.Curve.easeOutSine=, and =Uize.Curve.easeMiddleSine= static methods
								- thanks to `Robert Penner` for his original implementation

							Uize.Curve.easeMiddleSine
								Sinusoidal easing in the middle - decelerating until halfway, then accelerating.

								SYNTAX
								.........................................
								curveFUNC = Uize.Curve.easeMiddleSine ();
								.........................................

								NOTES
								- see also the companion =Uize.Curve.easeInSine=, =Uize.Curve.easeOutSine=, and =Uize.Curve.easeInOutSine= static methods
								- thanks to `Robert Penner` for his original implementation
					*/
				);

				_package.line = function (_startValue,_endValue) {
					if (_endValue == _undefined) {
						if (_startValue == _undefined) {
							_startValue = 0;
							_endValue = 1;
						} else {
							_endValue = _startValue;
						}
					}
					var _delta = _endValue - _startValue;
					return (
						!_startValue && _endValue == 1
							? _linear
							: _delta
								? function (_value) {return _startValue + _delta * _value}
								: function () {return _startValue}

					);
					/*?
						Static Methods
							Uize.Curve.line
								Returns a curve function, being a linear curve between the specified start and end values.

								SYNTAX
								....................................................................
								curveFUNC = Uize.Curve.line (startValue0to1FLOAT,endValue0to1FLOAT);
								....................................................................

								This method allows you to create curve functions that don't observe the `Start At 0, End At 1` rule of curve functions, so it is not always appropriate for use in controlling fades. This method is more useful for creating value ranges that can be supplied to curve function modifiers that accept value ranges for parameters. Consider the following example of using the =Uize.Curve.Mod.blend= static method...

								EXAMPLE
								........................................................................
								Uize.Curve.Mod.blend (
									Uize.Curve.easeOutPow (4),  // ease-out power curve function
									Uize.Curve.saw (20,.5),     // sawtooth curve function with 20 teeth
									Uize.Curve.line (.25,.75)   // line starting at .25 and ending at .75
								)
								........................................................................

								In the above example, a quartic ease-out power curve function is being blended with a sawtooth curve function with twenty teeth. The =Uize.Curve.line= method is being used to create a value range from =.25= to =.75= to control the blend between the two curve functions across the range of input values. At the input value of =0=, the blend between the curves will be =.25=. At the input value of =1=, the blend between the curves will be =.75=. At the input value of =.5=, the blend between the curves will be =.5= (the midpoint value of the line curve).

								VARIATION 1
								..................................................
								curveFUNC = Uize.Curve.line (startValue0to1FLOAT);
								..................................................

								When no =endValue0to1FLOAT= parameter is specified (or if the same value is specified for both the =startValue0to1FLOAT= and =endValue0to1FLOAT= parameters), then the curve function returned will be for a flat line that is always at the specified start value (ie. it starts at the start value and ends at the start value).

								VARIATION 2
								...............................
								curveFUNC = Uize.Curve.line ();
								...............................

								When no parameters are specified (or if the value =0= is specified for the =startValue0to1FLOAT= parameter and the value =1= is specified for the =endValue0to1FLOAT= parameter), then a reference to =Uize.Curve.linear= (a linear curve function) will be returned.

								NOTES
								- compare to the =Uize.Curve.linear= static method
					*/
				};

				_package.saw = function (_repeats,_amount) {
					return (
						_repeats == 1 || !(_amount = Uize.toNumber (_amount,1))
							? _linear
							: function (_value) {
								return _blendFloats (_value,_value && ((_value * _repeats) % 1 || 1),_amount)
							}
					);
					/*?
						Static Methods
							Uize.Curve.saw
								Returns a sawtooth curve function, where the number of teeth and the amount of the sawtooth effect can be specified.

								SYNTAX
								........................................................
								curveFUNC = Uize.Curve.saw (repeatsINT,amount0to1FLOAT);
								........................................................

								PARAMETERS

								- =repeatsINT= - controls the number of "teeth" in the sawtooth curve.

								- =amount0to1FLOAT= - a floating point number in the range of =0= to =1=. Specifying the value =0= for this parameter will produce a curve function for a simple linear curve, specifying the value =1= will produce a curve function where each tooth reaches all the way from =0= up to =1=, and specifying  the value =.5= will produce an equal blend between a linear curve and a harsh sawtooth pattern. Any other values will produce different blends between fully linear and fully sawtooth.

								VARIATION
								........................................
								curveFUNC = Uize.Curve.saw (repeatsINT);
								........................................

								When no =amount0to1FLOAT= parameter is specified, the value =1= is used as the default. This produces a harsh sawtooth curve function, with each tooth using the full vertical range of =0= to =1=.
					*/
				};

		return _package;
	}
});

