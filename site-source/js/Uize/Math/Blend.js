/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Math.Blend Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2016 UIZE
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
								Two values can be blended with a curve so that the blend can be non-linear, by first specifying the value =0= for the =quantizationNUMorARRAYorOBJ= fourth argument (to disable quantization), and then specifying the optional =curveFUNCorARRAYorOBJ= fifth argument.

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

								In the above example, we are creating a halfway blend between the values =0= and =10=. With a typical linear blend, we would expect the result =5= to be produced, but in this case we are specifying the curve function =function (value) {return Math.pow (value,2)}= to produce a non-linear blend. Specifically, we are blending the values =0= and =10= using a quadratic curve, which takes the blend value and raises it to the power of =2= (i.e. squares it). So, for our =.5= blend we actually end up getting a curve-adjusted =.25= blend, which produces the blend result of =2.5=.

								In addition to simple curve functions, the =curveFUNCorARRAYorOBJ= parameter also allows us to specify compound curve values using curve arrays or objects. For more information, consult the reference for the =curveFUNCorARRAYorOBJ= parameter.

							Blend Two Values, with Quantization and Curve
								Two values can be blended with both quantization and a curve, by specifying values for both of the optional =quantizationNUMorARRAYorOBJ= and =curveFUNCorARRAYorOBJ= arguments.

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

								EXAMPLE
								.............................................................................................
								Uize.Math.Blend.blend (0,10,.5,1,function (value) {return Math.pow (value,2)});  // returns 3
								.............................................................................................

								In the above example, we are creating a halfway blend between the values =0= and =10=, using a quadratic curve function to make the blend non-linear, and using a quantization of =1= to ensure that an integer value is returned. With just the quadratic curve function, this statement would return the value =2.5=, but the quantization value of =1= causes the value to be rounded to the nearest value that is an integer multiple of the quantization value =1= from the first of the two values being blended (=0=, in this example). That nearest quantized value happens to be =3=.

							Blend Two Values, Specifying Previous Value and Values Unchanged Indicator
								In an advanced usage of this method, the optional =previousValueNUMorARRAYorOBJ= and =valuesUnchangedOBJ= arguments can be specified in order to have a special value returned when the blend would produce the same result as the specified previous value.

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

								This form of the method is used primarily in the =Uize.Fade= class as a means of identifying when the value being faded over time does not change from one fade update to the next, which tends to happen more often when quantization is being used and a fade has fewer quantization intervals between its start and end values than fade updates that will be performed (for example, if you're fading from =0= to =5= with quantization of =1= over a period of ten seconds. In particular, this facility can lead to significant performance optimizations when the values being faded are compound values, such as CSS style property objects.

								In order to use this facility, one must keep track of the previous value for a blend and provide it to the =Uize.Math.Blend.blend= method using the =previousValueNUMorARRAYorOBJ= parameter. One should specify a value that is guaranteed to be unique for the =valuesUnchangedOBJ= parameter, so that one can compare the result returned from the method to this value. In order to avoid possible collisions with legitimate values, it is best to specify a reference to an object in the local scope - essentially, a value that is only known to the caller of the =Uize.Math.Blend.blend= method.

								Just to reiterate, this is an advanced and special form of the method and it's unlikely you will ever find the need to use it. If you're still curious, the best place to see a real world usage of this form is in the code for the =Uize.Fade= module.

							Parameters
								blendFRACTION
									A floating point number in the range of =0= to =1=, specifying where the blended value should lie between the two values being blended.

									When the value =0= is specified for this parameter, the value of the =value1INTorOBJorARRAY= parameter will be returned as the blend result. When the value =1= is specified, the value of the =value2INTorOBJorARRAY= parameter will be returned as the blend result. And when the value =.5= is specified, the blend result will fall halfway between the values of the =value1INTorOBJorARRAY= and =value2INTorOBJorARRAY= parameters, which will result in an equal mix when the curve function is linear. Similarly, when the value =.25= is specified, the blend result value will fall a quarter of the way between the values of the =value1INTorOBJorARRAY= and =value2INTorOBJorARRAY= parameters.

								quantizationNUMorARRAYorOBJ
									A number or array or object, allowing one to control the quantization for the blend result.

									When the value =0=, =undefined=, or =null= is specified for this parameter, then the blended value can be a floating point number (or contain floating point numbers, if it's a compound value). This can be a problem for blending values in certain applications where an integer value is desirable, and where a floating point number may be inappropriate. In such cases, a value of =1= can be specified for the =quantizationNUMorARRAYorOBJ= parameter, thereby directing the =Uize.Math.Blend.blend= method to produce blend results in increments of one.

									Relative to First Value
										It's important to note that a quantization value of =2= doesn't mean that a blend result will always be even (it could also be odd), since quantization determines the step increments from the first of the values being blended.

										So, if the first value was =0=, then a quantization of =2= would produce blend results like =0=, =2=, =4=, etc. (i.e. even numbers). But if the first value was =1=, then blend results like =1=, =3=, =5=, etc. (i.e. odd numbers) would be produced.

										Similarly, a quantization value of =1= doesn't guarantee that a blend result will always be an integer. If the first value was =1=, then a quantization of =1= would produce blend results like =1=, =2=, =3=, etc. (i.e. integers). However, if the first value was =1.5=, then a quantization of =1= would produce blend results like =1.5=, =2.5=, =3.5=, etc. (definitely *not* integers).

										This is generally not an obstacle for applications that desire integer interpolated values, because in those cases both of the values being blended are almost certain to be integers, and a quantization value of =1= will have the desired effect under such conditions.

									Simple Quantization
										It is possible to specify a single quantization number that should apply to all components of a compound value (e.g. a color object with red, green, and blue properties).

										EXAMPLE
										..........................................
										var blendedColor = Uize.Math.Blend.blend (
											{red:255,green:128,blue:0},   // orange
											{red:179,green:136,blue:255}, // violet
											.5,
											1
										);
										..........................................

										In the above example, a new blended color is being created by blending between the colors orange and violet. The values to blend are specified using an object with =red=, =green=, and =blue= properties that specify the values for each of the three channels that constitute an RGB color. This approach leverages the =Uize.Math.Blend.blend= method's ability to interpolate arbitrarily complex, compound values. Now, the value for each of the red, green, and blue channels must be an integer - there is no meaning to floating point values for these channels.

										So, if quantization is not specified when calling this method, then an RGB color with floating point channel values would be produced, and this might not be appropriate for the code that is being supplied the new blended color, or that code would have to do its own rounding. Specifying a value of =1= for the =quantizationNUMorARRAYorOBJ= parameter ensures that the values for all the channels of the blended color will be interpolated in steps of =1= and would, therefore, always be integers.

									Compound Quantization Value
										It is possible to specify a compound value for the =quantizationNUMorARRAYorOBJ= parameter, just as with the =aNUMorARRAYorOBJ= and =bNUMorARRAYorOBJ= parameters used to specify the two values being blended.

										In fact, you can specify a quantization value that matches the structure of the values being blended and that specifies granular quantization for all components of a compound value blend.

										EXAMPLE
										..........................................
										var blendedColor = Uize.Math.Blend.blend (
											{red:255,green:128,blue:0},   // orange
											{red:179,green:136,blue:255}, // violet
											.5,
											{
												red:5,   // medium resolution
												green:1, // highest resolution
												blue:10  // low resolution
											}
										);
										..........................................

										In the above example, a value is being specified for the =quantizationNUMorARRAYorOBJ= parameter that matches the structure of the two values being blended, being an object with =red=, =green=, and =blue= properties just as with the RGB color tuple objects being blended.

										This allows different quantization to be specified for the different subcomponents of the compound value that is produced from blending the two compound values. When performing blends using this compound quantization and different blend amounts, the value of the green channel would change with the highest resolution (while always being an integer), while the red channel value would change with less precision (in steps of =5=) and the blue channel value would change with the least precision (steps of =10=).

										Given the above blend amount of =.5=, the statement would produce the result ={red:215,green:132,blue:130}=, whereas the same blend with a simple quantization of =1= would produce the result ={red:217,green:132,blue:128}=.

									Compound Quantization Value With Omissions
										When specifying a compound =quantization= value, it is possible to omit quantization for certain components of the structured value, and the quantization for such components will be defaulted to =0=.

										EXAMPLE
										..................................................................
										var blendedColorAndOpacity = Uize.Math.Blend.blend (
											{
												color:{red:255,green:128,blue:0},  // orange
												opacity:0                          // completely transparent
											},
											{
												color:{red:179,green:136,blue:255}, // violet
												opacity:1                           // completely opaque
											},
											.5,
											{color:1}
										);
										..................................................................

										In the above example, a blend of two structured values containing color and opacity information is being performed. Specifically, we are creating a halfway blend between fully transparent orange and fully opaque violet. This will produce the result ={color:{red:217,green:132,blue:128},opacity:.5}=

										We are specifying a compound =quantization= value in this example. By specifying the value =1= for =color=, and not an entire subtree object with quantization values for =red=, =green=, and =blue=, the quantization of =1= applies to all three color channels. And by omitting a quantization value for =opacity=, the quantization for this component of the interpolated compound value defaults to =0= (i.e. no quantization / floating point precision).

										So, a compound =quantization= value may have "terminations" and "omissions", both of which lead to defaulting behaviors. Omissions are essentially terminations with defaulting to =0=. So, in effect, omitting a subtree is equivalent to "terminating" the subtree by specifying the simple value =0=.

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

										In the above example, a fade instance is created for fading two colors, =colorA= and =colorB=, where =colorA= is faded between orange and violet, and where =colorB= is faded between pure red and pure blue. A compound value is specified for =quantization=, where the structure mostly matches the structure of the start and end values, but with the key distinction that a simple number is specified for =colorB=, rather than an object with =red=, =green=, and =blue= properties as with =colorA=. This has the effect of defaulting the quantization for all components of the =colorB= subtree (i.e. =red=, =green=, and =blue=) in the interpolated compound value to =1=.

									Floating Point Quantization Values
										There's nothing to say that values for the =quantizationNUMorARRAYorOBJ= parameter have to be integers.

										You can just as well specify a floating point value for quantization. For example, a blend with a first value of =0= and with a quantization of =.5= would produce the blend results like =0=, =.5=, =1=, =1.5=, =2=, =2.5=, etc.

										This could be useful in cases where a floating point blend result is acceptable, but where you wish to limit the number of value changes that occur for performance reasons when blends are repeatedly performed over a period of time (such as in an animation process). In such cases, setting a quantization to anything other than =0= would provide a throttling effect that would reduce the number of value updates that would occur.

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
									A function, array, or object, allowing one to control the curve(s) that should be applied when blending the values specified by the =value1INTorOBJorARRAY= and =value2INTorOBJorARRAY= parameters.

									Simple Curve
										In the simplest usage, a curve function can be specified when blending two number values.

										EXAMPLE
										.............................................................
										function quadratic (value) {return value * value}

										Uize.Math.Blend.blend (0,100,0,0,quadratic);   // returns 0
										Uize.Math.Blend.blend (0,100,.1,0,quadratic);  // returns 1
										Uize.Math.Blend.blend (0,100,.2,0,quadratic);  // returns 4
										Uize.Math.Blend.blend (0,100,.3,0,quadratic);  // returns 9
										Uize.Math.Blend.blend (0,100,.4,0,quadratic);  // returns 16
										Uize.Math.Blend.blend (0,100,.5,0,quadratic);  // returns 25
										Uize.Math.Blend.blend (0,100,.6,0,quadratic);  // returns 36
										Uize.Math.Blend.blend (0,100,.7,0,quadratic);  // returns 49
										Uize.Math.Blend.blend (0,100,.8,0,quadratic);  // returns 64
										Uize.Math.Blend.blend (0,100,.9,0,quadratic);  // returns 81
										Uize.Math.Blend.blend (0,100,1,0,quadratic);   // returns 100
										.............................................................

										In the above example, various blends are being created between the numbers =0= and =100=, using a quadratic curve function. As you can tell from the results returned for the various blends, the blend result is not linear between =0= and =100= - instead, it follows a quadratic curve. For instance, the blend between =0= and =100= at the halfway point is not =50= (as it would be with a linear blend), but is instead =25=.

									Simple Curve Applying to Compound Blend Values
										When blending two compound (hierarchical) objects, a simple curve function can be specified for the =curveFUNCorARRAYorOBJ= parameter and this curve function will be applied when blending values for all nodes of the two hierarchical objects.

										EXAMPLE
										..............................................................
										Uize.Math.Blend.blend (
											{red:210,green:105,blue:30},             // chocolate brown
											{red:139,green:69,blue:19},              // saddle brown
											.5,
											0,
											function (value) {return value * value}  // quadratic curve
										);
										..............................................................

										RESULT
										..............................
										{red:174.5,green:87,blue:24.5}
										..............................

										In the above example, you will notice that the quadratic curve function has been applied when producing blended values for the =red=, =green=, and =blue= properties of the two color tuple objects being blended.

									Compound Curve Value
										In the same way that one can specify a `compound quantization value` when blending two compound (hierarchical) objects, one can also specify a compound curve value in order to apply different curves to different parts of the structure of two hierarchical objects being blended.

										EXAMPLE
										.............................................................................
										Uize.Math.Blend.blend (
											{red:210,green:105,blue:30},                            // chocolate brown
											{red:139,green:69,blue:19},                             // saddle brown
											.5,
											0,
											{
												red:function (value) {return Math.pow (value,2)},    // quadratic curve
												green:function (value) {return Math.pow (value,3)},  // cubic curve
												blue:function (value) {return Math.pow (value,4)}    // quartic curve
											}
										);
										.............................................................................

										In the above example, two color tuple objects are being blended. To achieve different blend curves for the red, green, and blue components of the color, a compound curve value is specified.

										By specifying a curve value that is an object with the same structure as the object values being blended, the curve functions specified for the properties of the compound curve value object are applied when creating blend values for each of the corresponding properties of the two object values being blended. So, the curve function specified for the =red= property of the curve value object is used when producing a blend value for the =red= property of the color tuples being blended.

										RESULT
										.....................................
										{red:192.25,green:100.5,blue:29.3125}
										.....................................

									Compound Curve Value With Omissions
										When a compound curve value is specified, its structure can be a subset of the structure of the two hierarchical objects being blended.

										EXAMPLE
										............................................................................
										Uize.Math.Blend.blend (
											{red:210,green:105,blue:30},                           // chocolate brown
											{red:139,green:69,blue:19},                            // saddle brown
											.5,
											0,
											{
												red:function (value) {return Math.pow (value,2)},   // quadratic curve
												green:function (value) {return Math.pow (value,3)}  // cubic curve
											}
										);
										............................................................................

										In the above example, two color tuple objects are being blended. Each tuple object contains =red=, =green=, and =blue= properties for the three channels of an RGB color value.

										Now, in order to achieve non-linear blending for the =red= and =green= properties, we are specifying a `compound curve value` with curve functions specified for the =red= and =green= properties of the object. Because we are ok with the blend of the =blue= channel's value being linear, we can omit specifying a curve function for the =blue= property in the compound curve value - the blend will be defaulted to linear for this property.

										RESULT
										..................................
										{red:192.25,green:100.5,blue:24.5}
										..................................

									Compound Curve Value With Defaulting at Nodes
										When a `compound curve value` has no curve function explicitly specified for a property of the two hierarchical objects being blended, the curve function will be defaulted to the curve function of the parent node in the compound curve value.

										EXAMPLE
										.................................................................................
										Uize.Math.Blend.blend (
											{
												textColor:{red:255,green:222,blue:173},                  // navajo white
												bgColor:{red:210,green:105,blue:30}                      // chocolate brown
											},
											{
												textColor:{red:255,green:240,blue:230},                  // linen white
												bgColor:{red:139,green:69,blue:19}                       // saddle brown
											},
											.5,
											0,
											{
												textColor:function (value) {return Math.pow (value,2)},  // quadratic curve
												bgColor:function (value) {return Math.pow (value,3)}     // cubic curve
											}
										);
										.................................................................................

										In the above example, two sets of color values are being blended, each set containing two RGB color tuple objects.

										Now, because we wish to blend the =textColor= and =bgColor= color values with different curves, we specify a `compound curve value` object containing =textColor= and =bgColor= properties. Because we want the curve for each of the colors to be applied to all three RGB color channels, we specify just a curve function for each of the =textColor= and =bgColor= properties.

										Because no curve functions are specified explicitly for the =red=, =green=, and =blue= properties in the =textColor= and =bgColor= properties of the compound curve value, the curve functions are "inherited" for all the deeper nodes that exist in the corresponding spots in the structures of the hierarchical values being blended - in this case, the color channel properties.

										RESULT
										..................
										{
											textColor:{
												red:255,
												green:226.5,
												blue:187.25
											},
											bgColor:{
												red:201.125,
												green:100.5,
												blue:28.625
											}
										}
										..................
				*/
			}
		});
	}
});

