/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Color.xUtil Object Extension
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)1997-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Extension
	importance: 2
	codeCompleteness: 90
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Color.xUtil= module is an extension module that extends the =Uize.Color= object by adding various instance and static utility methods.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Color.xUtil',
	required:'Uize.Array.Sort',
	builder:function (_object) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_undefined,
				_objectPrototype = _object.prototype
			;

		/*** General Variables ***/
			var
				_dummyColor1 = new _object,
				_dummyColor2 = new _object,
				_sacredEmptyObject = {}
			;

		/*** Utility Functions ***/
			function _blendValues (_valueA,_valueB,_blendAmount) {
				return _valueA + (_valueB - _valueA) * _blendAmount
			}

			function _ensureSettingIsTuple (_setting,_default) {
				if (_setting == _undefined) _setting = _default;
				return Uize.isArray (_setting) ? _setting : [_setting,_setting,_setting,_setting];
			}

		/*** Public Instance Methods ***/
			_objectPrototype.blend = function (_color1,_color2,_blendAmount) {
				_blendAmount = Uize.toNumber (_blendAmount,.5);
				_dummyColor1.from (_color1);
				_dummyColor2.from (_color2);
				var
					_dummyColor1Tuple = _dummyColor1.tuple,
					_dummyColor2Tuple = _dummyColor2.getTuple (_dummyColor1.encoding)
				;
				_object.setTuple (
					this.tuple,
					_blendValues (_dummyColor1Tuple [0],_dummyColor2Tuple [0],_blendAmount),
					_blendValues (_dummyColor1Tuple [1],_dummyColor2Tuple [1],_blendAmount),
					_blendValues (_dummyColor1Tuple [2],_dummyColor2Tuple [2],_blendAmount),
					_blendValues (_dummyColor1Tuple [3],_dummyColor2Tuple [3],_blendAmount)
				);

				return this;
				/*?
					Instance Methods
						blend
							Blends between the two specified colors using the specified blend amount, and sets the current color of the instance to the new blended color.

							SYNTAX
							...........................................................
							colorOBJ.blend (color1ANYTYPE,color2ANYTYPE,blendFRACTION);
							...........................................................

							The =blendFRACTION= parameter should be a floating point number in the range of =0= to =1=, where  a value of =0= will result in =colorOBJ= being set to the color represented by the =color1ANYTYPE= parameter, the value =1= will result in =colorOBJ= being set to the color represented by the =color2ANYTYPE= parameter, and the value =.5= will result in =colorOBJ= being set to a color that is an equal blend of the colors represented by the =color1ANYTYPE= and =color2ANYTYPE= parameters.

							Different values between =0= and =1= for the =blendFRACTION= parameter give you different blends between color one and color two...

							EXAMPLES
							..............................................................................
							// a range of blends between black and white

							myColor.blend ('000000','ffffff',0);    // myColor now #000000, encoding "hex"
							myColor.blend ('000000','ffffff',.25);  // myColor now #404040, encoding "hex"
							myColor.blend ('000000','ffffff',.5);   // myColor now #808080, encoding "hex"
							myColor.blend ('000000','ffffff',.75);  // myColor now #bfbfbf, encoding "hex"
							myColor.blend ('000000','ffffff',1);    // myColor now #ffffff, encoding "hex"
							..............................................................................

							VARIATION
							.............................................
							colorOBJ.blend (color1ANYTYPE,color2ANYTYPE);
							.............................................

							When no =blendFRACTION= parameter is specified, the value for this parameter is defaulted to =.5=, producing an equal mix between =color1ANYTYPE= and =color2ANYTYPE=.

							EXAMPLE
							................................................................................
							myColor.blend ('black','white');  // myColor now #808080 (gray), encoding "name"
							................................................................................

							Color one and color two - the source colors for the blending operation - can be specified using any of the many supported `color encodings`...

							EXAMPLES
							....................................................................................
							// equal blend of black and white, specified using different encodings

							myColor.blend ('000000','ffffff');      // myColor now #808080, encoding "hex"
							myColor.blend ('black','white');        // myColor now #808080, encoding "name"
							myColor.blend (0x000000,0xffffff);      // myColor now #808080, encoding "RGB int"
							myColor.blend ([0,0,0],[255,255,255]);  // myColor now #808080, encoding "RGB array"
							myColor.blend ('#000','#fff');          // myColor now #808080, encoding "#hex"
							myColor.blend ('#0','#f');              // myColor now #808080, encoding "#hex"
							....................................................................................

							The `color encodings` for color one and color two do not have to be the same...

							EXAMPLES
							..................................................................................
							// equal blend of black and white, using mixed encodings for source colors

							myColor.blend ('#000000',0xffffff);   // myColor now #808080, encoding "#hex"
							myColor.blend ('black','#fff');       // myColor now #808080, encoding "name"
							myColor.blend ([0,0,0],'ffffff');     // myColor now #808080, encoding "RGB array"
							..................................................................................

							To blend the instance's current color value with a different color, simply pass a reference to the color object instance as one of the colors to blend, as in...

							EXAMPLE
							................................................................................
							myColor.blend (myColor,'white',.1);  // blend in some white to lighten the color
							................................................................................

							NOTES
							- see the related =Uize.Color.blend= static method
				*/
			};

			_objectPrototype.equal = function (_color) {
				_dummyColor1.from (_color).setEncoding (this.encoding);
				var
					_tuple = this.tuple,
					_dummyColor1Tuple = _dummyColor1.tuple
				;
				return (
					!Math.round (_tuple [0] - _dummyColor1Tuple [0]) &&
					!Math.round (_tuple [1] - _dummyColor1Tuple [1]) &&
					!Math.round (_tuple [2] - _dummyColor1Tuple [2]) &&
					!Math.round (_tuple [3] - _dummyColor1Tuple [3])
				);
				/*?
					Instance Methods
						equal
							Returns a boolean, indicating whether or not the specified color is equivalent to the color of the instance.

							SYNTAX
							...........................................
							isEqualBOOL = myColor.equal (colorANYTYPE);
							...........................................

							EXAMPLES
							........................................................................
							var fuchsia = Uize.Color ('fuchsia');
							fuchsia.equal (Uize.Color ('fuchsia'));                 // produces true
							fuchsia.equal ('ff00ff');                               // produces true
							fuchsia.equal ('#ff00ff');                              // produces true
							fuchsia.equal ('fuchsia');                              // produces true
							fuchsia.equal ([255,0,255]);                            // produces true
							fuchsia.equal (16711935);                               // produces true
							fuchsia.equal ({red:255,green:0,blue:255});             // produces true
							fuchsia.equal ('rgb(255,0,255)');                       // produces true
							fuchsia.equal ({'HSL array':[300,100,50]});             // produces true
							fuchsia.equal ({hue:300,saturation:100,lightness:50});  // produces true
							fuchsia.equal ('hsl(300,100,50)');                      // produces true
							........................................................................

							In the above example, all the statements produce the result =true=. That's because all the colors that the =fuchsia= color object is being compared to are equivalent to the color "fuchsia" - regardless of the encoding used to specify them.

							MORE EXAMPLES
							..................................................................................
							Uize.Color.blend ('red','black',.5,'color').equal ('maroon');     // produces true
							Uize.Color.mix (['black','red']).equal ('maroon');                // produces true
							Uize.Color.mix (['rgb(0,0,0)','#f00']).equal ('hsl(0,100%,25%)'); // produces true
							..................................................................................

							NOTES
							- see the companion =Uize.Color.equal= static method
				*/
			};

			_objectPrototype.random = function () {
				for (
					var
						_components = _object.colorSpaces [_object.encodings [this.encoding].colorSpace].tuple,
						_componentNo = _components.length,
						_tuple = this.tuple
					;
					--_componentNo >= 0;
				) {
					var
						_component = _components [_componentNo],
						_componentMin = _component.min
					;
					_tuple [_componentNo] = _componentMin + Math.random () * (_component.max - _componentMin);
				}
				return this;
				/*?
					Instance Methods
						random
							Randomizes the color of the instance in the color space of the instance's current encoding.

							SYNTAX
							..................
							myColor.random ();
							..................

							NOTES
							- see the related =Uize.Color.random= static method
				*/
			};

		/*** Public Static Methods ***/
			_object.blend = function (_color1,_color2,_blendAmount,_encoding) {
				return _dummyColor1.blend (_color1,_color2,_blendAmount).to (_encoding || _dummyColor1.encoding);
				/*?
					Static Methods
						Uize.Color.blend
							Blends between the two specified colors using the specified blend amount, and returns the blended color encoded using the specified encoding.

							SYNTAX
							............................................................................
							colorANYTYPE = Uize.Color.blend (color1ANYTYPE,color2ANYTYPE,blendFRACTION);
							............................................................................

							The =blendFRACTION= parameter should be a floating point number in the range of =0= to =1=, where  a value of =0= will result in returning the color represented by the =color1ANYTYPE= parameter, the value =1= will result in returning the color represented by the =color2ANYTYPE= parameter, and the value =.5= will result in returning a color that is an equal blend of the colors represented by the =color1ANYTYPE= and =color2ANYTYPE= parameters.

							Different values between =0= and =1= for the =blendFRACTION= parameter give you different blends between color one and color two...

							EXAMPLES
							....................................................................
							// a range of blends between black and white

							Uize.Color.blend ('000000','ffffff',0);     // returns '000000'
							Uize.Color.blend ('000000','ffffff',.25);   // returns '404040'
							Uize.Color.blend ('000000','ffffff',.5);    // returns '808080'
							Uize.Color.blend ('000000','ffffff',.75);   // returns 'bfbfbf'
							Uize.Color.blend ('000000','ffffff',1);     // returns 'ffffff'
							....................................................................

							VARIATION 1
							........................................................................................
							colorANYTYPE = Uize.Color.blend (color1ANYTYPE,color2ANYTYPE,blendFRACTION,encodingSTR);
							........................................................................................

							The resulting blended color can be encoded in any of the many supported `color encodings`, by using the optional =encodingSTR= parameter, as follows...

							EXAMPLES
							........................................................................
							// equal blend of black and white, different encodings for the result

							Uize.Color.blend ('black','white',.5,'color');       // new Uize.Color
							Uize.Color.blend ('black','white',.5,'hex');         // 808080
							Uize.Color.blend ('black','white',.5,'#hex');        // #808080
							Uize.Color.blend ('black','white',.5,'name');        // gray
							Uize.Color.blend ('black','white',.5,'RGB array');   // [128,128,128]
							Uize.Color.blend ('black','white',.5,'RGB int');     // 8421504
							Uize.Color.blend ('black','white',.5,'RGB string');  // rgb(128,128,128}
							........................................................................

							VARIATION 2
							.............................................................
							colorHexSTR = Uize.Color.blend (color1ANYTYPE,color2ANYTYPE);
							.............................................................

							When no =blendFRACTION= or =encodingSTR= parameters are specified, then the colors specified by the =color1ANYTYPE= and =color2ANYTYPE= parameters will be blended equally and the resulting color will be encoded using the encoding of the first color, as specified by the =color1ANYTYPE= parameter.

							EXAMPLE
							.................................................................................
							var myColorHex = Uize.Color.blend ('fuchsia','olive');  // myColorHex is 'c04080'
							.................................................................................

							Color one and color two - the source colors for the blending operation - can be specified using any of the many supported `color encodings`...

							EXAMPLES
							...................................................................................
							// equal blend of black and white, specified using different encodings

							Uize.Color.blend ('000000','ffffff');                // returns '808080'
							Uize.Color.blend ('black','white');                  // returns 'gray'
							Uize.Color.blend (0x000000,0xffffff);                // returns 8421504
							Uize.Color.blend ([0,0,0],[255,255,255]);            // returns [127.5,127.5,127.5]
							Uize.Color.blend ('#000','#fff');                    // returns '#808080'
							Uize.Color.blend ('#0','#f');                        // returns '#808080'
							Uize.Color.blend ('hsl(0,0%,0%)','hsl(0,0%,100%)');  // returns 'hsl(0,0%,50%)'
							...................................................................................

							The `color encodings` for color one and color two do not have to be the same...

							EXAMPLES
							..........................................................................
							// equal blend of black and white, using mixed encodings for source colors

							Uize.Color.blend ('#000000',0xffffff);   // returns '#808080'
							Uize.Color.blend ('black','#fff');       // returns 'gray'
							Uize.Color.blend ([0,0,0],'ffffff');     // returns [127.5,127.5,127.5]
							..........................................................................

							In the above example, notice how the encoding of the first color is used for encoding the result.

							NOTES
							- see the related =blend= instance method
				*/
			};

			_object.equal = function (_color1,_color2) {
				return _dummyColor2.from (_color1).equal (_color2);
				/*?
					Static Methods
						Uize.Color.equal
							Returns a boolean, indicating whether or not the two specified colors are equivalent.

							SYNTAX
							..............................................................
							areEqualBOOL = Uize.Color.equal (color1ANYTYPE,color2ANYTYPE);
							..............................................................

							EXAMPLES
							............................................................................
							Uize.Color.equal ('fuchsia',Uize.Color ('fuchsia'));                 // true
							Uize.Color.equal ('ff00ff','#ff00ff');                               // true
							Uize.Color.equal ([255,0,255],'hsl(300,100,50)');                    // true
							Uize.Color.equal (16711935,{red:255,green:0,blue:255});              // true
							Uize.Color.equal ('rgb(255,0,255)',{'HSL array':[300,100,50]});      // true
							Uize.Color.equal ('fuchsia',{hue:300,saturation:100,lightness:50});  // true
							............................................................................

							In the above example, all the statements produce the result =true=. That's because all of the colors specified for the =color1ANYTYPE= and =color2ANYTYPE= parameters are equivalent to the color "fuchsia" - regardless of the encoding used to specify them.

							MORE EXAMPLES
							...............................................................................
							Uize.Color.equal (Uize.Color.blend ('red','black'),'maroon');  // produces true
							Uize.Color.equal (Uize.Color.blend ('white','black'),'gray');  // produces true
							Uize.Color.equal (Uize.Color.blend ('red','blue'),'purple');   // produces true
							...............................................................................

							NOTES
							- see the companion =equal= instance method
				*/
			};

			_object.makeCombinations = function (_color1,_color2,_valuesPerComponent,_componentChaos,_outputEncoding) {
				/*** default and conform settings ***/
					_valuesPerComponent = _ensureSettingIsTuple (_valuesPerComponent,2);
					_componentChaos = _ensureSettingIsTuple (_componentChaos,0);
					_outputEncoding = _outputEncoding || 'color';

				_dummyColor1.from (_color1);
				_dummyColor2.from (_color2);
				var
					_result = [],
					_dummyColor1Tuple = _dummyColor1.tuple,
					_dummyColor2Tuple = _dummyColor2.getTuple (_dummyColor1.encoding),
					_component0Divisions = _valuesPerComponent [0],
					_component1Divisions = _valuesPerComponent [1],
					_component2Divisions = _valuesPerComponent [2],
					_color = Uize.Color (_dummyColor1),
					_colorTuple = _color.tuple
				;

				function _blendComponent (_componentNo,_blendAmount) {
					_colorTuple [_componentNo] = _blendValues (
						_dummyColor1Tuple [_componentNo],
						_dummyColor2Tuple [_componentNo],
						_componentChaos [_componentNo]
							? _blendValues (_blendAmount,Math.random (),_componentChaos [_componentNo])
							: _blendAmount
					);
				}
				for (var _component0ValueNo = -1; ++_component0ValueNo < _component0Divisions;) {
					for (var _component1ValueNo = -1; ++_component1ValueNo < _component1Divisions;) {
						for (var _component2ValueNo = -1; ++_component2ValueNo < _component2Divisions;) {
							_blendComponent (0,_component0ValueNo / (_component0Divisions - 1));
							_blendComponent (1,_component1ValueNo / (_component1Divisions - 1));
							_blendComponent (2,_component2ValueNo / (_component2Divisions - 1));
							_result.push (_color.to (_outputEncoding));
						}
					}
				}
				return _result;
				/*?
					Static Methods
						Uize.Color.makeCombinations
							Returns an array of colors, being a series of combinations produced from the two specified colors.

							SYNTAX
							...........................................
							colorsARRAY = Uize.Color.makeCombinations (
								color1ANYTYPE,
								color2ANYTYPE,
								valuesPerComponentINTorARRAY
							);
							...........................................

							This method uses the two colors specified by the =color1ANYTYPE= and =color2ANYTYPE= parameters to produce a series of combination colors. A series of interpolated values is calculated for each component of the color space, with the first value being the value of the component for color 1, the last value being the value of the component for color 2, and a series of values calculated at intervals between the first value and the last value. Each value out of the series of values for each component is then combined with each other value for every other component, so producing a set of combinations in the color space of color 1.

							The number of values per color component is specified by the =valuesPerComponentINTorARRAY= parameter. If an integer value is specified for this parameter, then there will be the same number of interpolated values for all components of the color space. For example, a value of =3= for the =valuesPerComponentINTorARRAY= parameter means that there will be three values for each of the red, green, and blue channels of the =sRGB= color space, producing a total of =27= combinations.

							An array of integers can also be specified for the =valuesPerComponentINTorARRAY= parameter, in which case a desired number of interpolated values can be specified for each component of the color space. So, for example, the value =[2,3,4]= would specify two interpolated values for the red channel, three for the green channel, and four for the blue channel in the =sRGB= color space, producing a total of =24= combination colors.

							VARIATION 1
							........................................................................
							colorsARRAY = Uize.Color.makeCombinations (color1ANYTYPE,color2ANYTYPE);
							........................................................................

							When no =valuesPerComponentINTorARRAY= parameter is specified, then there will be a default of two values per component, producing eight combinations for a three component color space (such as =sRGB=, =HSL=, =HSV=, etc.). The two values that are used for each component will be the value of that component for color 1 and the value of that component for color 2.

							VARIATION 2
							...........................................
							colorsARRAY = Uize.Color.makeCombinations (
								color1ANYTYPE,
								color2ANYTYPE,
								valuesPerComponentINTorARRAY,
								componentChaosFLOATorARRAY
							);
							...........................................

							When the optional =componentChaosFLOATorARRAY= parameter is specified, a certain amount of chaos can be introduced to the calculation of component values when making the combination colors. The value for =componentChaosFLOATorARRAY= can be a floating point number in the range of =0= to =1=, specifying the amount of chaos to be applied to all components of the color space, or it can be an array of floating point numbers in the range of =0= to =1=, specifying the amount of chaos to be applied to specific components.

							A value of =0= means there will be no chaos, and values for a component will be calculated at regular intervals between the value of that component for color 1 and the value of that component for color 2. A value of =1= means that the calculation of values for a component will be completely chaotic, and chosen at random points between the value of that component for color 1 and the value of that component for color 2. A value of =.5= means that there will be an equal blend between regular intervals and chaos. Any degree of chaos - between none and total - can be introduced into the calculation of combination colors.

							VARIATION 3
							...........................................
							colorsARRAY = Uize.Color.makeCombinations (
								color1ANYTYPE,
								color2ANYTYPE,
								valuesPerComponentINTorARRAY,
								componentChaosFLOATorARRAY,
								outputEncodingSTR
							);
							...........................................

							By default, this method generates its combination colors as an array of =Uize.Color= object instances. However, the optional =outputEncodingSTR= parameter lets you control the encoding of the color values in the generated array. You can specify any encoding - even an encoding that is not of the same color space as the colors specified by the =color1ANYTYPE= and =color2ANYTYPE= parameters. The output encoding will not, however, affect the color space in which the combination colors are generated, and this is determined by the encoding of the =color1ANYTYPE= parameter.

							EXAMPLE
							.....................................................................
							var webSafeColors = Uize.Color.makeCombinations ('0','f',6,0,'#hex');
							.....................................................................

							In the above example, the =webSafeColors= variable will be an array containing all the [[http://en.wikipedia.org/wiki/Web_colors][web safe colors]], encoded in =#hex= format. The =Uize.Color.makeCombinations= method makes it easy to generate the web safe colors because they are defined as the combination colors with distinct 6 values per channel: =00=, =33=, =66=, =99=, =cc=, and =ff=. Now, if you wanted an array of =Uize.Color= instances instead, you could just specify the value ='color'= for the =outputEncodingSTR= parameter, instead of ='#hex'=.
				*/
			};

			_object.mix = function (_colors,_encoding) {
				var _colorsLength = _colors.length;
				if (!_colorsLength) return new _object;
				var
					_component0Total = 0,
					_component1Total = 0,
					_component2Total = 0,
					_component3Total = 0,
					_primaryEncoding = _dummyColor1.from (_colors [0]).encoding
				;
				for (var _colorNo = _colorsLength; --_colorNo >= 0;) {
					var _dummyColor1Tuple = _dummyColor1.from (_colors [_colorNo]).getTuple (_primaryEncoding);
					_component0Total += _dummyColor1Tuple [0];
					_component1Total += _dummyColor1Tuple [1];
					_component2Total += _dummyColor1Tuple [2];
					_component3Total += _dummyColor1Tuple [3];
				}
				_colorsLength = _colorsLength || 1;
				_object.setTuple (
					_dummyColor1.tuple,
					_component0Total / _colorsLength,
					_component1Total / _colorsLength,
					_component2Total / _colorsLength,
					_component3Total / _colorsLength
				);
				return _dummyColor1.to (_encoding || 'color');
				/*?
					Static Methods
						Uize.Color.mix
							Returns an instance of the =Uize.Color= object, whose color is initialized to the average of all the colors specified in the colors array.

							SYNTAX
							........................................
							colorOBJ = Uize.Color.mix (colorsARRAY);
							........................................

							Color values specified in the =colorsARRAY= array can be specified in any of the many `color encodings` supported by the =Uize.Color= module, so the following statement is perfectly valid...

							EXAMPLE
							...............................................................
							var mixedColor = Uize.Color.mix ([
								'#f5f5dc',                    // beige
								[255,0,0],                    // red
								'fuchsia',                    // fuchsia
								'Rgb(64,224,208)',            // turquoise
								{red:255,green:255,blue:0},   // yellow
								0x808080,                     // gray
								Uize.Color (245,255,250)      // mintcream
							]);
							alert (mixedColor.to ());        // displays the text "#cf9e98"
							...............................................................

							The above example would produce a =Uize.Color= object set to the color with the =hex= RGB equivalent of =#cf9e98=. The expression =mixedColor.to ()= produces the output ='#cf9e98'= because the first color in the list is specified using the =#hex= encoding.

							Primary Encoding
								When mixing a series of colors, the color encoding of the first color in the series is used as the primary encoding for the mixing process.

								This means that the =Uize.Color= object instance that is returned by this method will be set to that encoding. It also means that any color in the list that may be specified using an encoding that implies a color space other than that of the primary encoding will be automatically converted to the color space of the primary encoding.

							VARIATION
							....................................................
							colorOBJ = Uize.Color.mix (colorsARRAY,encodingSTR);
							....................................................

							When the optional =encodingSTR= parameter is specified, rhe resulting mixed color can be encoded in any of the many supported `color encodings`.

							EXAMPLE
							....................................................
							alert (
								Uize.Color.mix (
									[
										'#f5f5dc',                    // beige
										[255,0,0],                    // red
										'fuchsia',                    // fuchsia
										'Rgb(64,224,208)',            // turquoise
										{red:255,green:255,blue:0},   // yellow
										0x808080,                     // gray
										Uize.Color (245,255,250)      // mintcream
									],
									'RGB string'
								)
							);
							....................................................

							In the above example, the =alert= statement would display the text "rgb(207,158,152)".
				*/
			};

			_object.random = function (_encoding) {
				return _dummyColor1.setEncoding (_encoding).random ().to (_encoding);
				/*?
					Static Methods
						Uize.Color.random
							Generates a random color with the specified encoding.

							SYNTAX
							...............................................
							colorANYTYPE = Uize.Color.random (encodingSTR);
							...............................................

							EXAMPLE
							................................................................................
							Uize.Node.setStyle (
								'myNodeId',
								{color:Uize.Color.random ('#hex'),backgroundColor:Uize.Color.random ('#hex')}
							);
							................................................................................

							In the above example, the text color and background color for the DOM node with the id "myNodeId" are being randomized.

							VARIATION
							......................................
							colorRgbHexSTR = Uize.Color.random ();
							......................................

							When no =encodingSTR= parameter is specified, the default value ='hex'= will be used and the method will return a string value, being a hex formatted random RGB color value.

							NOTES
							- when the value ='color'= is specified for the =encodingSTR= parameter, then this method will return an instance of the =Uize.Color= object with its encoding set to ='hex'= (ie. in the =sRGB= color space)
							- see the related =random= instance method
				*/
			};

			var _returnTupleComponentAsIs = Function ('tuple,componentNo','return tuple [componentNo]');
			_object.sort = function (_colors,_referenceColor,_componentWeighting) {
				if (_colors.length > 1) {
					_componentWeighting = _ensureSettingIsTuple (_componentWeighting,1);
					var
						_getNormalizedComponent =
							_componentWeighting [0] == 1 &&
							_componentWeighting [1] == 1 &&
							_componentWeighting [2] == 1 &&
							(_componentWeighting [3] == 1 || _componentWeighting [3] === _undefined)
								? _returnTupleComponentAsIs
								: function (_tuple,_componentNo) {
									return (
										_componentWeighting [_componentNo] *
										(_tuple [_componentNo] - _componentMins [_componentNo]) / _componentRanges [_componentNo]
									);
								},
						_encoding = _dummyColor1.from (_referenceColor).encoding,
						_colorSpaceTuple = _object.colorSpaces [_object.encodings [_encoding].colorSpace].tuple,
						_componentMins = [
							_colorSpaceTuple [0].min,
							_colorSpaceTuple [1].min,
							_colorSpaceTuple [2].min,
							(_colorSpaceTuple [3] || _sacredEmptyObject).min
						],
						_componentRanges = [
							_colorSpaceTuple [0].max - _componentMins [0],
							_colorSpaceTuple [1].max - _componentMins [1],
							_colorSpaceTuple [2].max - _componentMins [2],
							(_colorSpaceTuple [3] || _sacredEmptyObject).max - _componentMins [3]
						],
						_dummyColor1Tuple = _dummyColor1.tuple,
						_dummyColor1Component0Normalized = _getNormalizedComponent (_dummyColor1Tuple,0),
						_dummyColor1Component1Normalized = _getNormalizedComponent (_dummyColor1Tuple,1),
						_dummyColor1Component2Normalized = _getNormalizedComponent (_dummyColor1Tuple,2),
						_getDistanceBetweenCoords = function (_aX,_aY,_bX,_bY) {
							return Math.sqrt ((_bX - _aX) * (_bX - _aX) + (_bY - _aY) * (_bY - _aY));
						}
					;
					Uize.Array.Sort.sortBy (
						_colors,
						function (_color) {
							var _dummyColor2Tuple = _dummyColor2.from (_color).getTuple (_encoding);
							return _getDistanceBetweenCoords (
								0,
								_dummyColor1Component2Normalized,
								_getDistanceBetweenCoords (
									_dummyColor1Component0Normalized,
									_dummyColor1Component1Normalized,
									_getNormalizedComponent (_dummyColor2Tuple,0),
									_getNormalizedComponent (_dummyColor2Tuple,1)
								),
								_getNormalizedComponent (_dummyColor2Tuple,2)
							);

							/* for sort with components as primary, secondary, and tertiary keys
							return (
								Math.round (
									Math.abs (
										_getNormalizedComponent (_dummyColor2Tuple,2) - _dummyColor1Component2Normalized
									) * 999
								) * 1000000 +
								Math.round (
									Math.abs (
										_getNormalizedComponent (_dummyColor2Tuple,1) - _dummyColor1Component1Normalized
									) * 999
								) * 1000 +
								Math.round (
									Math.abs (
										_getNormalizedComponent (_dummyColor2Tuple,0) - _dummyColor1Component0Normalized
									) * 999
								)
							);
							*/
						}
					)
				}
				return _colors;
				/*?
					Static Methods
						Uize.Color.sort
							Sorts the specified array of colors according to their proximity to a specified reference color, using the specified sort criteria.

							SYNTAX
							..................................................................
							colorsARRAY = Uize.Color.sort (colorsARRAY,referenceColorANYTYPE);
							..................................................................

							This method sorts the colors specified by the =colorsARRAY= parameter, by how close they are to the reference color specified by the =referenceColorANYTYPE= parameter. Colors close to the head of the sorted array will be most like each other and most like the reference color, while colors towards the tail of the sorted array will be most unlike the reference color and will also tend to be most unlike one another. This will make the head of the sorted array appear more orderly, while making the tail appear more chaotic, since colors that are from the reference color may also be far from one another.

							Color values in the array to sort can be specified using any of the `color encodings` supported by the =Uize.Color= object, but they will be sorted in the color space of the reference color, as specified by the =referenceColorANYTYPE= parameter. So, if the array of colors are specified using =sRGB= encodings and the reference color is specified using an =HSL= encoding, then the colors will be sorted in the =HSL= color space.

							EXAMPLE
							.......................................................................................
							Uize.Color.sort (colors,'rgb(255,0,0)'); // sort redder colors to the head of the array
							.......................................................................................

							VARIATION 1
							...............................
							colorsARRAY = Uize.Color.sort (
								colorsARRAY,
								referenceColorANYTYPE,
								componentWeightingARRAY
							);
							...............................

							By default, the different components are normalized in order to give them equal weighting when calculating the proximity of colors being sorted to the reference color. However, specifying the optional =componentWeightingARRAY= parameter lets you specify a greater or lesser weighting for different components. For example, in the =HSL= color space, one may care more about how close colors are in terms of hue to the reference color than one cares about how close they are in terms of saturation or lightness.

							The array specified by the =componentWeightingARRAY= parameter should contain a weighting factor for each component of the color space of the reference color. Each weighting factor should be a floating point number, where a value of =1= represents normal weighting, and a value of =0= means to effectively ignore the component. Weighting values greater than =1= may be specified. For example, a value for =componentWeightingARRAY= of =[2,1,1]= in the =HSL= color space means that hue is twice as important as saturation and lightness. And, for that matter, values of =[2,2,2]= and =[1,1,1]= for =componentWeightingARRAY= both indicate equal weighting for three components of a color space.

							EXAMPLES
							.................................................................................
							Uize.Color.sort (colors,'hsl(0,0,0)',[0,0,1]);    // darkest to lightest
							Uize.Color.sort (colors,'hsl(0,0,100)',[0,0,1]);  // lightest to darkest
							Uize.Color.sort (colors,'hsl(0,100,0)',[0,1,0]);  // most to least saturated
							Uize.Color.sort (colors,'hsl(120,0,0)',[1,0,0]);  // hue only, starting with green
							.................................................................................

							The above examples show different ways that different components in the color space can be completely ignored when sorting, simply by giving them a weight of =0=.

							The "darkest to lightest" example sorts the array so that the darkest colors appear first. This is done by specifying a reference color in the =HSL= color space, with its lightness component set to =0= (ie. black), and with the components other than lightness given a weight of =0=. The "lightest to darkest" example operates in a similar way, excepting that the reference color for the sort has lightness set to =100= (ie. white). The "most to least saturated" example specifies weighting of =0= for hue and lightness so that only saturation affects the sort, and the saturation for the reference color is set to =100= (ie. most saturated first). The "hue only, starting with green" example makes hue the only component of importance, and the hue for the reference color is set to =120= (ie. green).

							VARIATION 2
							............................................
							colorsARRAY = Uize.Color.sort (colorsARRAY);
							............................................

							When no =referenceColorANYTYPE= parameter is specified, then the reference color will be black in the RGB color space, and colors will be sorted on how close they are to black (so, essentially, darkest to lightest).

							NOTES
							- this method modifies the source array specified by the =colorsARRAY= parameter
							- this method returns a reference to the array being sorted
				*/
			};

	}
});

