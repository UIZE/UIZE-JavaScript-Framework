/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Curve.Rubber Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 5
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Curve.Rubber= module defines various "rubbery" easing curve function generators that emulate qualities of motion, like bounce and elasticity.

		*DEVELOPERS:* `Chris van Rensburg`, with thanks to `Robert Penner` for his easing equations work

		The =Uize.Curve.Rubber= module defines various "rubbery" easing curve function generators, some of which are based on the easing equations work of `Robert Penner`.

		In A Nutshell
			Whereas the =Uize.Curve= module provides some of the most commonly used ease-in, ease-out, ease-in-out, and ease-in-the-middle curve function generators, the =Uize.Curve.Rubber= module offers curve function generators for more exotic types of curves that emulate the complex properties of motion.

			Credit Where Credit Is Due
				Thanks go to `Robert Penner` for his work on [[http://www.robertpenner.com/easing/][his easing equations]], which provided a starting point and inspiration for work that has been done in the =Uize.Curve.Rubber= module.

				In some cases, his original methods have merely been refactored, such as with the =Uize.Curve.Rubber.easeInElastic= method and related elastic easing curve function generators provided in this module. In other cases, the original implementations have been completely replaced, such as with the =Uize.Curve.Rubber.easeInBounce= method and related bounce easing curve function generators provided in this module, with the new implementation being much more versatile than the original. Either way, his excellent work has been an inspiration.

			Using the Curve Function Generators
				Using the curve function generators in the =Uize.Curve.Rubber= module is just as easy as using those contained inside the =Uize.Curve= module.

				Simply call the curve function generator static method, supplying parameter values as needed in order to produce a curve with the desired properties, and then provide that curve function to an instance of the =Uize.Fade= class, an instance of the =Uize.Widget.HoverFader= class, a static method of the =Uize.Fx= module, or any method or instance of a class that uses the =Uize.Fade= class to drive its animation or value interpolation.

				EXAMPLE
				..................................................................................
				page.addChild (
					'hoverFader',
					Uize.Widget.HoverFader,
					{
						defaultStyle:{width:150,marginLeft:90,letterSpacing:2,borderRightColor:'0'},
						hoverStyle:{width:240,marginLeft:0,letterSpacing:9,borderRightColor:'f'},
						fadeIn:{duration:1200,curve:Uize.Curve.Rubber.easeOutElastic (.2)},
						fadeOut:{duration:1000,curve:Uize.Curve.Rubber.easeOutBounce (5,-2,1.5)}
					}
				);
				..................................................................................

				In the above example, an instance of the =Uize.Widget.HoverFader= class is being added as a child widget of the page widget (which is assumed to already exist). For the =fadeIn= state property of the =Uize.Widget.HoverFader= instance, an elastic ease-out curve function is being supplied as a curve. For the =fadeOut= state property, a bounce ease-out curve function is being supplied as a curve. This will make the fade-in to the hover style have an elastic quality to it, and the fade-out to the default style have a bounce quality to it.

			VISUALIZE IT

			To better visualize how the "rubbery" easing curve function generators work and how they affect motion, visit the interactive [[../examples/curve-explorer.html][Curve Explorer]] tool.

			BACKGROUND READING

			For an in-depth discussion on animation in the UIZE JavaScript Framework, and for a discussion on how this module fits into the larger picture, consult the explainer [[../explainers/javascript-animation-and-effects.html][JavaScript Animation and Effects]] and read through the section `Curves`.
*/

Uize.module ({
	name:'Uize.Curve.Rubber',
	builder:function (_host) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_package = function () {},
				_makeEasingCurveGenerators = _host.makeEasingCurveGenerators,
				_resolve = _host.resolve
			;

		/*** Curve Function Generators ***/
			/*** elastic easing ***/
				_makeEasingCurveGenerators (
					'elastic',
					function (_period,_amplitude) {
						/*** paramter defaulting ***/
							if (!_period) _period = .3;
							if (!_amplitude || _amplitude < 1) _amplitude = 1;

						/*** capture some calculation results ***/
							var
								_2piDivPeriod = 2 * Math.PI / _period,
								_someValueOffset = Math.asin (1 / _amplitude) / _2piDivPeriod
							;

						return function (_value) {
							return (
								_value && _value != 1
									? (
										-_amplitude * Math.pow (2,10 * (_value -= 1)) *
										Math.sin ((_value - _someValueOffset) * _2piDivPeriod)
									)
									: _value
							)
						}
					},
					_package
					/*?
						Static Methods
							Uize.Curve.Rubber.easeInElastic
								Elastic easing in - exponentially growing sine wave.

								SYNTAX
								.........................................................................
								curveFUNC = Uize.Curve.Rubber.easeInElastic (periodFLOAT,amplitudeFLOAT);
								.........................................................................

								Parameters
									periodFLOAT
										A floating point number between =0= to =25=, representing the width of a single elastic stretch-past and spring-back cycle as a fraction of the total curve width.

										A value of =.1=, for example, will produce a curve with =10= stretch-past and spring-back cycles, whereas a value of =.2= will produce five such cycles. Ever higher values above =1= make the curve progressively more like an exponential curve. The default value for this parameter is =.3=.

									amplitudeFLOAT
										A floating point number in the range of =1= to =Infinity=.

										Values greater than =1= produce more springy elastic curves with more pronounced peaks and greater overshoot. The default value for this parameter is =1=.

								Variations
									VARIATION 1
									..........................................................
									curveFUNC = Uize.Curve.Rubber.easeInElastic (periodFLOAT);
									..........................................................

									When the optional =amplitudeFLOAT= parameter is not specified, its value will be defaulted to =1=.

									VARIATION 2
									...............................................
									curveFUNC = Uize.Curve.Rubber.easeInElastic ();
									...............................................

									When the optional =periodFLOAT= parameter is not specified, its value will be defaulted to =.3=.

								NOTES
								- see also the companion =Uize.Curve.Rubber.easeOutElastic=, =Uize.Curve.Rubber.easeInOutElastic=, and =Uize.Curve.Rubber.easeMiddleElastic= static methods
								- thanks to `Robert Penner` for his original implementation

							Uize.Curve.Rubber.easeOutElastic
								Elastic easing out - exponentially decaying sine wave.

								SYNTAX
								..........................................................................
								curveFUNC = Uize.Curve.Rubber.easeOutElastic (periodFLOAT,amplitudeFLOAT);
								..........................................................................

								VARIATIONS
								...........................................................
								curveFUNC = Uize.Curve.Rubber.easeOutElastic (periodFLOAT);
								curveFUNC = Uize.Curve.Rubber.easeOutElastic ();
								...........................................................

								For a more in-depth discussion of this method's parameters and variations, consult the reference for the related =Uize.Curve.Rubber.easeInElastic= static method.

								NOTES
								- see also the companion =Uize.Curve.Rubber.easeInElastic=, =Uize.Curve.Rubber.easeInOutElastic=, and =Uize.Curve.Rubber.easeMiddleElastic= static methods
								- thanks to `Robert Penner` for his original implementation

							Uize.Curve.Rubber.easeInOutElastic
								Elastic easing in/out - exponentially building then decaying sine wave.

								SYNTAX
								............................................................................
								curveFUNC = Uize.Curve.Rubber.easeInOutElastic (periodFLOAT,amplitudeFLOAT);
								............................................................................

								VARIATIONS
								.............................................................
								curveFUNC = Uize.Curve.Rubber.easeInOutElastic (periodFLOAT);
								curveFUNC = Uize.Curve.Rubber.easeInOutElastic ();
								.............................................................

								For a more in-depth discussion of this method's parameters and variations, consult the reference for the related =Uize.Curve.Rubber.easeInElastic= static method.

								NOTES
								- see also the companion =Uize.Curve.Rubber.easeInElastic=, =Uize.Curve.Rubber.easeOutElastic=, and =Uize.Curve.Rubber.easeMiddleElastic= static methods
								- thanks to `Robert Penner` for his original implementation

							Uize.Curve.Rubber.easeMiddleElastic
								Elastic easing in the middle - exponentially decaying then building sine wave.

								SYNTAX
								.............................................................................
								curveFUNC = Uize.Curve.Rubber.easeMiddleElastic (periodFLOAT,amplitudeFLOAT);
								.............................................................................

								VARIATIONS
								..............................................................
								curveFUNC = Uize.Curve.Rubber.easeMiddleElastic (periodFLOAT);
								curveFUNC = Uize.Curve.Rubber.easeMiddleElastic ();
								..............................................................

								For a more in-depth discussion of this method's parameters and variations, consult the reference for the related =Uize.Curve.Rubber.easeInElastic= static method.

								NOTES
								- see also the companion =Uize.Curve.Rubber.easeInElastic=, =Uize.Curve.Rubber.easeOutElastic=, and =Uize.Curve.Rubber.easeInOutElastic= static methods
								- thanks to `Robert Penner` for his original implementation
					*/
				);

			/*** overshoot easing ***/
				_makeEasingCurveGenerators (
					'back',
					function (_overshoot) {
						/*** paramter defaulting ***/
							if (_overshoot == null) _overshoot = 1.70158;

						/*** capture some calculation results ***/
							var _overshootPlus1 = _overshoot + 1;

						return function (_value) {return _value * _value * (_overshootPlus1 * _value - _overshoot)};
					},
					_package
					/*?
						Static Methods
							Uize.Curve.Rubber.easeInBack
								Back easing in - backtracking slightly, then reversing direction and moving to target.

								SYNTAX
								..........................................................
								curveFUNC = Uize.Curve.Rubber.easeInBack (overshootFLOAT);
								..........................................................

								The =overshootFLOAT= parameter controls the amount of overshoot, and is typically a value in the range of =0= to =Infinity= (although negative values are also supported). Higher positive values for this parameter will produce greater overshoot. The default value of =1.70158= produces 10% overshoot. A value of =0= produces a cubic easing curve with no overshoot. Negative values lower than =-3= for this parameter will produce increasing amounts of overshoot on the opposite side of output value range.

								VARIATION
								............................................
								curveFUNC = Uize.Curve.Rubber.easeInBack ();
								............................................

								When the optional =overshootFLOAT= parameter is not specified, its value will be defaulted to =1.70158=.

								NOTES
								- see also the companion =Uize.Curve.Rubber.easeOutBack=, =Uize.Curve.Rubber.easeInOutBack=, and =Uize.Curve.Rubber.easeMiddleBack= static methods
								- thanks to `Robert Penner` for his original implementation

							Uize.Curve.Rubber.easeOutBack
								Back easing out - moving towards target, overshooting it slightly, then reversing and coming back to target.

								SYNTAX
								...........................................................
								curveFUNC = Uize.Curve.Rubber.easeOutBack (overshootFLOAT);
								...........................................................

								For an in-depth discussion of the =overshootFLOAT= parameter, consult the reference for the related =Uize.Curve.Rubber.easeInBack= static method.

								VARIATION
								.............................................
								curveFUNC = Uize.Curve.Rubber.easeOutBack ();
								.............................................

								When the optional =overshootFLOAT= parameter is not specified, its value will be defaulted to =1.70158=.

								NOTES
								- see also the companion =Uize.Curve.Rubber.easeInBack=, =Uize.Curve.Rubber.easeInOutBack=, and =Uize.Curve.Rubber.easeMiddleBack= static methods
								- thanks to `Robert Penner` for his original implementation

							Uize.Curve.Rubber.easeInOutBack
								Back easing in/out - backtracking slightly, then reversing direction and moving to target, then overshooting target, reversing, and finally coming back to target.

								SYNTAX
								.............................................................
								curveFUNC = Uize.Curve.Rubber.easeInOutBack (overshootFLOAT);
								.............................................................

								For an in-depth discussion of the =overshootFLOAT= parameter, consult the reference for the related =Uize.Curve.Rubber.easeInBack= static method.

								VARIATION
								...............................................
								curveFUNC = Uize.Curve.Rubber.easeInOutBack ();
								...............................................

								When the optional =overshootFLOAT= parameter is not specified, its value will be defaulted to =1.70158=.

								NOTES
								- see also the companion =Uize.Curve.Rubber.easeInBack=, =Uize.Curve.Rubber.easeOutBack=, and =Uize.Curve.Rubber.easeMiddleBack= static methods
								- thanks to `Robert Penner` for his original implementation

							Uize.Curve.Rubber.easeMiddleBack
								Back easing in the middle - overshooting the middle, backtracking to the middle, then backtracking even further towards the beginning, then finally moving to target.

								SYNTAX
								..............................................................
								curveFUNC = Uize.Curve.Rubber.easeMiddleBack (overshootFLOAT);
								..............................................................

								For an in-depth discussion of the =overshootFLOAT= parameter, consult the reference for the related =Uize.Curve.Rubber.easeInBack= static method.

								VARIATION
								................................................
								curveFUNC = Uize.Curve.Rubber.easeMiddleBack ();
								................................................

								When the optional =overshootFLOAT= parameter is not specified, its value will be defaulted to =1.70158=.

								NOTES
								- see also the companion =Uize.Curve.Rubber.easeInBack=, =Uize.Curve.Rubber.easeOutBack=, and =Uize.Curve.Rubber.easeInOutBack= static methods
								- thanks to `Robert Penner` for his original implementation
					*/
				);

			/*** bounce easing ***/
				var _defaultBouncePeakCurveFunction = _host.easeInSweetPow (1.76);
				_makeEasingCurveGenerators (
					'bounce',
					function (_bounces,_bouncePeakCurveFunction,_bounceWidthRatio,_bounceCurveFunction) {
						/*** parameter defaulting ***/
							if (!_bounces) _bounces = 4;
							_bouncePeakCurveFunction =
								_resolve (_bouncePeakCurveFunction,_defaultBouncePeakCurveFunction,true)
							;
							_bounceWidthRatio = !_bounceWidthRatio
								? 2 // 0, null, or undefined, so default to 2
								: _bounceWidthRatio * _bounceWidthRatio == 1
									? 1.0001 // 1 or -1, so make sure it's not 1, since 1 breaks formula
									: _bounceWidthRatio < 0
										? -1 / _bounceWidthRatio // negative, so negate and invert
										: _bounceWidthRatio
							;
							_bounceCurveFunction = _resolve (_bounceCurveFunction,2);

						/*** pre-calculate profiles for bounces ***/
							function _cumulativeWidth (_bounces) {return (Math.pow (_base,_bounces) - 1) / (_base - 1)}
							var
								_base = _bounceWidthRatio,
								_baseMinus1 = _base - 1,
								_bouncesMinus1 = _bounces - 1,
								_bouncesWidthShown =
									_cumulativeWidth (_bounces) /* combined width of all bounces */ -
									Math.pow (_base,_bouncesMinus1) /* width of widest bounce */ / 2,
								_logBase = Math.log (_base),
								_bounceProfiles = []
							;
							for (var _bounceNo = -1; ++_bounceNo < _bounces;) {
								var
									_bounceStartPos = _cumulativeWidth (_bounceNo),
									_widthDiv2 = (_cumulativeWidth (_bounceNo + 1) /* bounce end pos */ - _bounceStartPos) / 2,
									_bounceMidPos = _bounceStartPos + _widthDiv2
								;
								_bounceProfiles.push ({
									_height:_bouncePeakCurveFunction (_bounceMidPos / _bouncesWidthShown),
									_midPos:_bounceMidPos,
									_widthDiv2:_widthDiv2
								});
							}

						return function (_value) {
							var
								_pos = _value * _bouncesWidthShown,
								_bounceProfile = _bounceProfiles [
									Uize.constrain (Math.floor (Math.log (_pos * _baseMinus1 + 1) / _logBase),0,_bouncesMinus1)
								]
							;
							return _bounceProfile._height * (
								_bounceCurveFunction (1 - Math.abs (_pos - _bounceProfile._midPos) / _bounceProfile._widthDiv2)
							);
						}
					},
					_package
					/*?
						Static Methods
							Uize.Curve.Rubber.easeInBounce
								Bounce, easing in.

								SYNTAX
								.......................................................................................
								curveFUNC = Uize.Curve.Rubber.easeInBounce (
									bouncesINT,                  // number of bounces (optional)
									bouncePeakCurveFUNCorFLOAT,  // bounciness, essentially (optional)
									bounceWidthRatioFLOAT,       // ratio of current bounce width to previous (optional)
									bounceCurveFUNCorFLOAT       // the shape of the curve of a bounce (optional)
								);
								.......................................................................................

								Parameters
									bouncesINT
										An integer, specifying the number of bounces in the curve, with the default number of bounces being =4=.

									bouncePeakCurveFUNCorFLOAT
										A function reference for a curve function, or a numerical value that will be resolved to a power curve function using the =Uize.Curve.resolve= method.

										This paramter can be used to affect the bounciness or springiness of each bounce. Numerical values above =1= will produce progressively bouncier curves as the value of =bouncePeakCurveFUNCorFLOAT= is increased. Numerical values below =-1= will produce progressively more dampened curves as the value of =bouncePeakCurveFUNCorFLOAT= is decreased.

										When determining the height of the peak of an individual bounce, a curve function specified for the =bouncePeakCurveFUNCorFLOAT= parameter will be used to obtain a value, using the position of the midpoint of the bounce along the x-axis as the input value to the bounce peak curve function. Because the specified bounce peak curve is only sampled at the bounce midpoints, bounce peak curves with high amounts of detail will not affect the shape of the bounces, but only the heights of the bounce peaks (so detail will be lost, in other words).

										For a linear curve, the value =1= can be specified for this parameter. The default value for this parameter is =1.76=.

									bounceWidthRatioFLOAT
										A floating point number, specifying the ratio between the width of the current bounce and the width of the previous bounce.

										The default value for this parameter is =2=, which means that each bounce will be twice as wide as the previous bounce. When the value =1= is specified for this parameter, all bounces will have the same width. When negative values are specified for this parameter, then ratio will be resolved to a positive number by negating it and inverting it (dividing it into =1=). In other words, the value =-2= will result in a resolved ratio of =.5=, which will result in each bounce being half the width of the previous bounce. You can think of the values in the negative scale as being the ratio of the width of the current bounce to the width of the next bounce (once negated, of course).

										For values of this parameter greater than =1=, the higher the value, the less noticeable changing the number of bounces with the =bouncesINT= parameter will become. Similarly, on the opposite side of the spectrum, for values of =bounceWidthRatioFLOAT= less than =-1=, the lower the value, the less noticeable changing the number of bounces will become. If each bounce is much smaller or larger than the previous bounce, the bounces at one end of the curve will become very small and barely noticeable.

										NOTE

										It should be noted that for the ease-out version of this curve, and for the the ease-out phase of the ease-in-out and ease-in-the-middle versions of this curve, the bounce width ratio is actually the ratio of the width of the current bounce to the width of the next bounce. This is as a result of the curve being rotated 180 degrees.

									bounceCurveFUNCorFLOAT
										A function reference for a curve function, or a numerical value that will be resolved to a power curve function using the =Uize.Curve.resolve= method.

										The curve specified by the =bounceCurveFUNCorFLOAT= parameter will be used to generate points along the curve of an individual bounce. The specified curve is used to produce both the left and right halves of a bounce curve, on either side of the bounce's midpoint on the x-axis. For the opposite half, the bounce curve is flipped horizontally. The default value for this parameter is =2=, which produces bounces using a quadratic ease-out power curve.

								VARIATION 1
								..............................................................
								curveFUNC = Uize.Curve.Rubber.easeInBounce (
									bouncesINT,bouncePeakCurveFUNCorFLOAT,bounceWidthRatioFLOAT
								);
								..............................................................

								When no =bounceCurveFUNCorFLOAT= parameter is specified, its value will be defaulted to =2=, representing a quadratic ease-out curve function.

								VARIATION 2
								...................................................................................
								curveFUNC = Uize.Curve.Rubber.easeInBounce (bouncesINT,bouncePeakCurveFUNCorFLOAT);
								...................................................................................

								When no =bounceWidthRatioFLOAT= parameter is specified, its value will be defaulted to =2= (each bounce will be twice the width of the previous bounce).

								VARIATION 3
								........................................................
								curveFUNC = Uize.Curve.Rubber.easeInBounce (bouncesINT);
								........................................................

								When no =bouncePeakCurveFUNCorFLOAT= parameter is specified, its value will be defaulted to =1.76=.

								VARIATION 4
								..............................................
								curveFUNC = Uize.Curve.Rubber.easeInBounce ();
								..............................................

								When no =bouncesINT= parameter is specified, its value will be defaulted to =4=.

								NOTES
								- see also the companion =Uize.Curve.Rubber.easeOutBounce=, =Uize.Curve.Rubber.easeInOutBounce=, and =Uize.Curve.Rubber.easeMiddleBounce= static methods

							Uize.Curve.Rubber.easeOutBounce
								Bounce, easing out.

								SYNTAX
								.......................................................................................
								curveFUNC = Uize.Curve.Rubber.easeOutBounce (
									bouncesINT,                  // number of bounces (optional)
									bouncePeakCurveFUNCorFLOAT,  // bounciness, essentially (optional)
									bounceWidthRatioFLOAT,       // ratio of current bounce width to next (optional)
									bounceCurveFUNCorFLOAT       // the shape of the curve of a bounce (optional)
								);
								.......................................................................................

								VARIATIONS
								....................................................................................
								curveFUNC = Uize.Curve.Rubber.easeOutBounce (
									bouncesINT,bouncePeakCurveFUNCorFLOAT,bounceWidthRatioFLOAT
								);

								curveFUNC = Uize.Curve.Rubber.easeOutBounce (bouncesINT,bouncePeakCurveFUNCorFLOAT);

								curveFUNC = Uize.Curve.Rubber.easeOutBounce (bouncesINT);

								curveFUNC = Uize.Curve.Rubber.easeOutBounce ();
								....................................................................................

								For a more in-depth discussion of this method's parameters and variations, consult the reference for the related =Uize.Curve.Rubber.easeInBounce= static method.

								NOTES
								- see also the companion =Uize.Curve.Rubber.easeInBounce=, =Uize.Curve.Rubber.easeInOutBounce=, and =Uize.Curve.Rubber.easeMiddleBounce= static methods

							Uize.Curve.Rubber.easeInOutBounce
								Bounce, easing in/out.

								SYNTAX
								.......................................................................................
								curveFUNC = Uize.Curve.Rubber.easeInOutBounce (
									bouncesINT,                  // number of bounces (optional)
									bouncePeakCurveFUNCorFLOAT,  // bounciness, essentially (optional)
									bounceWidthRatioFLOAT,       // ratio of current bounce width to previous (optional)
									bounceCurveFUNCorFLOAT       // the shape of the curve of a bounce (optional)
								);
								.......................................................................................

								VARIATIONS
								......................................................................................
								curveFUNC = Uize.Curve.Rubber.easeInOutBounce (
									bouncesINT,bouncePeakCurveFUNCorFLOAT,bounceWidthRatioFLOAT
								);

								curveFUNC = Uize.Curve.Rubber.easeInOutBounce (bouncesINT,bouncePeakCurveFUNCorFLOAT);

								curveFUNC = Uize.Curve.Rubber.easeInOutBounce (bouncesINT);

								curveFUNC = Uize.Curve.Rubber.easeInOutBounce ();
								......................................................................................

								For a more in-depth discussion of this method's parameters and variations, consult the reference for the related =Uize.Curve.Rubber.easeInBounce= static method.

								NOTES
								- see also the companion =Uize.Curve.Rubber.easeInBounce=, =Uize.Curve.Rubber.easeOutBounce=, and =Uize.Curve.Rubber.easeMiddleBounce= static methods

							Uize.Curve.Rubber.easeMiddleBounce
								Bounce, easing in the middle.

								SYNTAX
								.......................................................................................
								curveFUNC = Uize.Curve.Rubber.easeMiddleBounce (
									bouncesINT,                  // number of bounces (optional)
									bouncePeakCurveFUNCorFLOAT,  // bounciness, essentially (optional)
									bounceWidthRatioFLOAT,       // ratio of current bounce width to previous (optional)
									bounceCurveFUNCorFLOAT       // the shape of the curve of a bounce (optional)
								);
								.......................................................................................

								VARIATIONS
								.......................................................................................
								curveFUNC = Uize.Curve.Rubber.easeMiddleBounce (
									bouncesINT,bouncePeakCurveFUNCorFLOAT,bounceWidthRatioFLOAT
								);

								curveFUNC = Uize.Curve.Rubber.easeMiddleBounce (bouncesINT,bouncePeakCurveFUNCorFLOAT);

								curveFUNC = Uize.Curve.Rubber.easeMiddleBounce (bouncesINT);

								curveFUNC = Uize.Curve.Rubber.easeMiddleBounce ();
								.......................................................................................

								For a more in-depth discussion of this method's parameters and variations, consult the reference for the related =Uize.Curve.Rubber.easeInBounce= static method.

								NOTES
								- see also the companion =Uize.Curve.Rubber.easeInBounce=, =Uize.Curve.Rubber.easeOutBounce=, and =Uize.Curve.Rubber.easeInOutBounce= static methods
					*/
				);

		return _package;
	}
});

