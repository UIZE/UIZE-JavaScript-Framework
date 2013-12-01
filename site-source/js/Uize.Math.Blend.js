/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Math.Blend Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 6
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Math.Blend= package module supports blending two values to produce a new, interpolated value, with support for blending arbitrarily complex data structures, quantization, and interpolation curve functions (and structures).

		*DEVELOPERS:* `Chris van Rensburg`

		BACKGROUND READING

		For an in-depth discussion on animation in the UIZE JavaScript Framework, and for a discussion on how this module fits into the larger picture, consult the guide [[../guides/javascript-animation-and-effects.html][JavaScript Animation and Effects]] and read through the section `The Engine`.
*/

Uize.module ({
	name:'Uize.Math.Blend',
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,
				_typeObject = 'object',
				_Uize = Uize,

			/*** References for Performance Optimization ***/
				_constrain = _Uize.constrain,
				_isFunction = _Uize.isFunction,
				_clone = _Uize.clone,

			/*** References to Statics Used Internally ***/
				_blendValues
		;

		return _Uize.package ({
			blend:_blendValues = function (_value1,_value2,_blend,_quantization,_curve,_previousValue,_valueUnchanged) {
				if (_value1 === _value2) {
					return _previousValue !== _undefined && _value1 === _previousValue ? _valueUnchanged : _clone (_value1);
				} else {
					if (_isFunction (_curve)) {
						_blend = _curve (_blend);
						_curve = _undefined;
					}
					if (typeof _value1 == _typeObject && _value1 && !(_value1 instanceof RegExp)) {
						var
							_blendedEqualsPrevious = _previousValue && typeof _previousValue == _typeObject,
							_quantizationIsObject = _quantization && typeof _quantization == _typeObject,
							_curveIsObject = _curve && typeof _curve == _typeObject,
							_result = _blendedEqualsPrevious ? _previousValue : _Uize.isArray (_value1) ? [] : {},
							_propertyPreviousValue
						;
						for (var _propertyName in _value1) {
							var _blendedValue = _blendValues (
								_value1 [_propertyName],
								_value2 [_propertyName],
								_blend,
								_quantizationIsObject ? _quantization [_propertyName] : _quantization,
								_curveIsObject ? _curve [_propertyName] : _curve,
								_propertyPreviousValue = _result [_propertyName],
								_valueUnchanged
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
									: (_quantization < 0 ? (_quantization *= -1) : _quantization) && (_blend < 0 || _blend > 1)
										? _value1 + Math.round ((_value2 - _value1) * _blend / _quantization) * _quantization
										: _quantization != Infinity
											? _constrain (
												_value1 + Math.round ((_value2 - _value1) * _blend / _quantization) * _quantization,
												_value1,
												_value2
											)
											: _value1
						;
						return _previousValue !== _undefined && _result === _previousValue ? _valueUnchanged : _result;
					}
				}
				/*?
					Static Methods
						Uize.Math.Blend.blend
							Returns a value, that is the blend between the two specified values, with support for optional quantization, curve, and other advanced features.

							DIFFERENT USAGES

							`Blend Two Number Values`
							.............................................................
							blendedNUM = Uize.Math.Blend.blend (aNUM,bNUM,blendFRACTION);
							.............................................................

							`Blend Two Array Values`
							...................................................................
							blendedARRAY = Uize.Math.Blend.blend (aARRAY,bARRAY,blendFRACTION);
							...................................................................

							`Blend Two Object Values`
							.............................................................
							blendedOBJ = Uize.Math.Blend.blend (aOBJ,bOBJ,blendFRACTION);
							.............................................................

							`Blend Two Compound (Hierarchical) Objects`
							.....................................................................................
							blendedCompoundOBJ = Uize.Math.Blend.blend (aCompoundOBJ,bCompoundOBJ,blendFRACTION);
							.....................................................................................

							`Blend Two Values, with Quantization`
							................................................
							blendedNUMorARRAYorOBJ = Uize.Math.Blend.blend (
								aNUMorARRAYorOBJ,
								bNUMorARRAYorOBJ,
								blendFRACTION,
								quantizationNUMorARRAYorOBJ
							);
							................................................

							`Blend Two Values, with Curve`
							................................................
							blendedNUMorARRAYorOBJ = Uize.Math.Blend.blend (
								aNUMorARRAYorOBJ,
								bNUMorARRAYorOBJ,
								blendFRACTION,
								0,
								curveFUNCorARRAYorOBJ
							);
							................................................

							`Blend Two Values, with Quantization and Curve`
							................................................
							blendedNUMorARRAYorOBJ = Uize.Math.Blend.blend (
								aNUMorARRAYorOBJ,
								bNUMorARRAYorOBJ,
								blendFRACTION,
								quantizationNUMorARRAYorOBJ,
								curveFUNCorARRAYorOBJ
							);
							................................................

							`Blend Two Values, Specifying Previous Value and Values Unchanged Indicator`
							................................................
							blendedNUMorARRAYorOBJ = Uize.Math.Blend.blend (
								aNUMorARRAYorOBJ,
								bNUMorARRAYorOBJ,
								blendFRACTION,
								quantizationNUMorARRAYorOBJ,
								curveFUNCorARRAYorOBJ,
								previousValueNUMorARRAYorOBJ,
								valuesUnchangedOBJ
							);
							................................................

							Blend Two Number Values
								In its most basic usage, this method can be used to blend between two simple number type values.

								SYNTAX
								.............................................................
								blendedNUM = Uize.Math.Blend.blend (aNUM,bNUM,blendFRACTION);
								.............................................................

								The =blendFRACTION= parameter specifies the blend between the values specified by the =aNUM= and =bNUM= parameters and should be a floating point number in the range of =0= to =1=, where a value of =0= will result in returning the value of the =aNUM= parameter, the value of =1= will result in returning the value of the =bNUM= parameter, and the value =.5= will result in returning the average of =aNUM= and =bNUM=.

								EXAMPLES
								.......................................................
								Uize.Math.Blend.blend (5,12,0);        // returns 5
								Uize.Math.Blend.blend (5,12,1);        // returns 12
								Uize.Math.Blend.blend (5,12,.5);       // returns 8.5
								Uize.Math.Blend.blend (100,-20,0);     // returns 100
								Uize.Math.Blend.blend (100,-20.5,1);   // returns -20.5
								Uize.Math.Blend.blend (100,-20.5,.5);  // returns 39.75
								Uize.Math.Blend.blend (10,50,.75);     // returns 40
								.......................................................

								The value of the =blendFRACTION= parameter determines how far the blend is between the first value and the second value, regardless of which value is larger. The values being blended can be positive or negative, and the first value can be larger than the second value.

							Blend Two Array Values
								Two array values can be blended, simply by specifying the array values in place of number values for the first two arguments of this method.

								SYNTAX
								...................................................................
								blendedARRAY = Uize.Math.Blend.blend (aARRAY,bARRAY,blendFRACTION);
								...................................................................

								When array type values are blended, the structure of the two arrays should be the same - they should both have the same number of elements, and the value types of corresponding elements should be the same.

								EXAMPLE
								.........................................................................................
								var
									chocolateRgbTuple = [210,105,30],
									saddleBrownRgbTuple = [139,69,19],
									chocoSaddleRgbTuple = Uize.Math.Blend.blend (chocolateRgbTuple,saddleBrownRgbTuple,.5)
								;
								alert (chocoSaddleRgbTuple);  // alerts: 174.5,87,24.5
								.........................................................................................

								In the above example, we're blending RGB tuple arrays for two different shades of brown to create a new RGB tuple array for our crazy new shade of brown (70s nostalgia, anyone?).

							Blend Two Object Values
								Two object values can be blended, simply by specifying the object values in place of number values for the first two arguments of this method.

								SYNTAX
								.............................................................
								blendedOBJ = Uize.Math.Blend.blend (aOBJ,bOBJ,blendFRACTION);
								.............................................................

								When object type values are blended, the structure of the two objects should be the same - they should both have the same property sets, and the value types of corresponding properties should be the same.

								EXAMPLE
								..............................................................................................
								var
									chocolateRgbTuple = {red:210,green:105,blue:30},
									saddleBrownRgbTuple = {red:139,green:69,blue:19},
									chocoSaddleRgbTuple = Uize.Math.Blend.blend (chocolateRgbTuple,saddleBrownRgbTuple,.5)
								;
								alert (JSON.stringify (chocoSaddleRgbTuple));  // alerts: {"red":174.5,"green":87,"blue":24.5}
								..............................................................................................

								In the above example, we're blending RGB tuple objects for two different shades of brown to create a new RGB tuple object for a new shade of brown.

							Blend Two Compound (Hierarchical) Objects
								Beyond blending flat array or object type values, this method also supports blending arbitarily structured objects or arrays.

								Two compound (hierarchical) object values can be blended, simply by specifying the compound object values in place of number values for the first two arguments of this method.

								SYNTAX
								.....................................................................................
								blendedCompoundOBJ = Uize.Math.Blend.blend (aCompoundOBJ,bCompoundOBJ,blendFRACTION);
								.....................................................................................

								This ability allows us to blend complex data structures such as color theme objects, widget state configurations, or the states for an entire tree of widgets in a user inerface.

								EXAMPLE
								................................................................................................
								var
									greenTheme = {
										color:[240,255,240],
										bgColor:[0,100,0]
									},
									blueTheme = {
										color:[240,248,255],
										bgColor:[25,25,112]
									},
									blueGreenTheme = Uize.Math.Blend.blend (greenTheme,blueTheme,.5)
								;
								alert (JSON.stringify (blueGreenTheme)); // {"color":[240,251.5,247.5],"bgColor":[12.5,62.5,56]}
								................................................................................................

								In the above example, two color theme objects are being blended to created a new color theme object. The color theme objects both have the same structure, being an object with =color= and =bgColor= properties, each of which has an array value that is an RGB color tuple. The blend result is an object with exactly the same structure, but where the number values in the RGB color tuples is a blend between the corresponding values from each of the two color themes being blended.

							Blend Two Values, with Quantization
								Two values can be blended with quantization applied to the blend result, by specifying the optional =quantizationNUMorARRAYorOBJ= fourth argument.

								SYNTAX
								................................................
								blendedNUMorARRAYorOBJ = Uize.Math.Blend.blend (
									aNUMorARRAYorOBJ,
									bNUMorARRAYorOBJ,
									blendFRACTION,
									quantizationNUMorARRAYorOBJ
								);
								................................................

								Quantization can be useful when you wish to blend two integers to produce a new, integer result.

								EXAMPLES
								.................................................................................
								Uize.Math.Blend.blend (11,20,.5,1);                         // returns 16
								Uize.Math.Blend.blend (5,20,.5,2);                          // returns 13
								Uize.Math.Blend.blend (10,100,.5,10);                       // returns 60
								Uize.Math.Blend.blend ([11,5,10],[20,20,100],.5,[1,2,10]);  // returns [16,13,60]
								Uize.Math.Blend.blend ([11,5,10],[20,20,100],.5,3);         // returns [17,14,55]
								Uize.Math.Blend.blend (0,10,1/3,.5);                        // returns 3.5
								Uize.Math.Blend.blend (0,10,1/3,.9);                        // returns 3.6
								Uize.Math.Blend.blend (10,0,1/3,.5);                        // returns 6.5
								.................................................................................

								Beyond using quantization to guarantee integer results, the =quantizationNUMorARRAYorOBJ= parameter can be used to specify quantization in any interval. By specifying an object value for the =quantizationNUMorARRAYorOBJ= parameter, one can even specify a `compound quantization value`.

							Blend Two Values, with Curve
								Two values can be blended with a curve so that the blend can be non-linear, by first specifying the value =0= for the =quantizationNUMorARRAYorOBJ= fourth argument (to disable quantization), and then specifying the optional =quantizationNUMorARRAYorOBJ= fifth argument.

								SYNTAX
								................................................
								blendedNUMorARRAYorOBJ = Uize.Math.Blend.blend (
									aNUMorARRAYorOBJ,
									bNUMorARRAYorOBJ,
									blendFRACTION,
									0,
									curveFUNCorARRAYorOBJ
								);
								................................................

								EXAMPLE
								...............................................................................................
								Uize.Math.Blend.blend (0,10,.5,0,function (value) {return Math.pow (value,2)});  // returns 2.5
								...............................................................................................

								In the above example, we are creating a halfway blend between the values =0= and =10=. With a typical linear blend, we would expect the result =5= to be produced, but in this case we are specifying the curve function =function (value) {return Math.pow (value,2)}= to produce a non-linear blend. Specifically, we are blending the values =0= and =10= using a quadratic curve, which takes the blend value and raises it to the power of =2= (ie. squares it). So, for our =.5= blend we actually end up getting a curve-adjusted =.25= blend, which produces the blend result of =2.5= in this case.

							Blend Two Values, with Quantization and Curve
								SYNTAX
								................................................
								blendedNUMorARRAYorOBJ = Uize.Math.Blend.blend (
									aNUMorARRAYorOBJ,
									bNUMorARRAYorOBJ,
									blendFRACTION,
									quantizationNUMorARRAYorOBJ,
									curveFUNCorARRAYorOBJ
								);
								................................................

							Blend Two Values, Specifying Previous Value and Values Unchanged Indicator

								SYNTAX
								................................................
								blendedNUMorARRAYorOBJ = Uize.Math.Blend.blend (
									aNUMorARRAYorOBJ,
									bNUMorARRAYorOBJ,
									blendFRACTION,
									quantizationNUMorARRAYorOBJ,
									curveFUNCorARRAYorOBJ,
									previousValueNUMorARRAYorOBJ,
									valuesUnchangedOBJ
								);
								................................................

							Parameters
								blendFRACTION
									.

									The value specified for the =blendFRACTION= parameter should be a floating point number in the range of =0= to =1=,, where the =blendFRACTION= parameter should be a floating point number in the range of =0= to =1=, where  a value of =0= will result in returning the value of the =value1INTorOBJorARRAY= parameter, the value of =1= will result in returning the value of the =value2INTorOBJorARRAY= parameter, and the value =.5= will result in returning the average of =value1INTorOBJorARRAY= and =value2INTorOBJorARRAY=.

								quantizationNUMorARRAYorOBJ
									A number or array or object, allowing one to control the quantization for the interpolated values of a fade.

									When the value =0=, =undefined=, or =null= is specified for this property, then the blended value can be a floating point number (or contain floating point numbers, if it's a compound value). This can be a problem for blending values in certain applications where an integer value is desirable, and where a floating point number may be inappropriate. In such cases, a value of =1= can be specified for the =quantization= state property, thereby directing the fade to interpolate its value in increments of one.

									Relative to First Value
										It's important to note that a quantization value of =2= doesn't mean that an interpolated value will always be even (it could also be odd), since quantization determines the step increments from the first of the values being blended.

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

									Compound Quantization Value With Defaulting At Nodes
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

								curveFUNCorARRAYorOBJ
									.

									Simple Curve
										.

									Simple Curve Applying to Compound Blend Values
										.

										EXAMPLE
										...
										var
											chocolateRgbTuple = {red:210,green:105,blue:30},
											saddleBrownRgbTuple = {red:139,green:69,blue:19},
											brownBlendRgbTuple = Uize.Math.Blend.blend (
												chocolateRgbTuple,
												saddleBrownRgbTuple,
												.5,
												0,
												function (value) {return value * value}
											)
										;
										alert (JSON.stringify (brownBlendRgbTuple));  // alerts: {"red":174.5,"green":87,"blue":24.5}
										...

									Compound Curve Value
										.

									Compound Curve Value With Omissions
										.

									Compound Curve Value With Defaulting at Nodes
										.
				*/
			}
		});
	}
});

