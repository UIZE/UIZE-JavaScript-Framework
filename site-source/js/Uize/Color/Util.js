/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Color.Util Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)1997-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Extension
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Color.Util= module provides miscellaneous utility methods for working with colors.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Color.Util',
	required:[
		'Uize.Color',
		'Uize.Array.Sort'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,
				_blendValues = Uize.blendValues,
				_Uize_Color = Uize.Color,

			/*** General Variables ***/
				_dummyColor1 = _Uize_Color (),
				_dummyColor2 = _Uize_Color (),
				_sacredEmptyObject = {}
		;

		/*** Utility Functions ***/
			function _ensureSettingIsTuple (_setting,_default) {
				if (_setting == _undefined) _setting = _default;
				return Uize.isArray (_setting) ? _setting : [_setting,_setting,_setting,_setting];
			}

		return Uize.package ({
			makeCombinations:function (_color1,_color2,_valuesPerComponent,_componentChaos,_outputEncoding) {
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
						Uize.Color.Util.makeCombinations
							Returns an array of colors, being a series of combinations produced from the two specified colors.

							SYNTAX
							................................................
							colorsARRAY = Uize.Color.Util.makeCombinations (
								color1ANYTYPE,
								color2ANYTYPE,
								valuesPerComponentINTorARRAY
							);
							................................................

							This method uses the two colors specified by the =color1ANYTYPE= and =color2ANYTYPE= parameters to produce a series of combination colors. A series of interpolated values is calculated for each component of the color space, with the first value being the value of the component for color 1, the last value being the value of the component for color 2, and a series of values calculated at intervals between the first value and the last value. Each value out of the series of values for each component is then combined with each other value for every other component, so producing a set of combinations in the color space of color 1.

							The number of values per color component is specified by the =valuesPerComponentINTorARRAY= parameter. If an integer value is specified for this parameter, then there will be the same number of interpolated values for all components of the color space. For example, a value of =3= for the =valuesPerComponentINTorARRAY= parameter means that there will be three values for each of the red, green, and blue channels of the =sRGB= color space, producing a total of =27= combinations.

							An array of integers can also be specified for the =valuesPerComponentINTorARRAY= parameter, in which case a desired number of interpolated values can be specified for each component of the color space. So, for example, the value =[2,3,4]= would specify two interpolated values for the red channel, three for the green channel, and four for the blue channel in the =sRGB= color space, producing a total of =24= combination colors.

							VARIATION 1
							.............................................................................
							colorsARRAY = Uize.Color.Util.makeCombinations (color1ANYTYPE,color2ANYTYPE);
							.............................................................................

							When no =valuesPerComponentINTorARRAY= parameter is specified, then there will be a default of two values per component, producing eight combinations for a three component color space (such as =sRGB=, =HSL=, =HSV=, etc.). The two values that are used for each component will be the value of that component for color 1 and the value of that component for color 2.

							VARIATION 2
							................................................
							colorsARRAY = Uize.Color.Util.makeCombinations (
								color1ANYTYPE,
								color2ANYTYPE,
								valuesPerComponentINTorARRAY,
								componentChaosFLOATorARRAY
							);
							................................................

							When the optional =componentChaosFLOATorARRAY= parameter is specified, a certain amount of chaos can be introduced to the calculation of component values when making the combination colors. The value for =componentChaosFLOATorARRAY= can be a floating point number in the range of =0= to =1=, specifying the amount of chaos to be applied to all components of the color space, or it can be an array of floating point numbers in the range of =0= to =1=, specifying the amount of chaos to be applied to specific components.

							A value of =0= means there will be no chaos, and values for a component will be calculated at regular intervals between the value of that component for color 1 and the value of that component for color 2. A value of =1= means that the calculation of values for a component will be completely chaotic, and chosen at random points between the value of that component for color 1 and the value of that component for color 2. A value of =.5= means that there will be an equal blend between regular intervals and chaos. Any degree of chaos - between none and total - can be introduced into the calculation of combination colors.

							VARIATION 3
							................................................
							colorsARRAY = Uize.Color.Util.makeCombinations (
								color1ANYTYPE,
								color2ANYTYPE,
								valuesPerComponentINTorARRAY,
								componentChaosFLOATorARRAY,
								outputEncodingSTR
							);
							................................................

							By default, this method generates its combination colors as an array of =Uize.Color= object instances. However, the optional =outputEncodingSTR= parameter lets you control the encoding of the color values in the generated array. You can specify any encoding - even an encoding that is not of the same color space as the colors specified by the =color1ANYTYPE= and =color2ANYTYPE= parameters. The output encoding will not, however, affect the color space in which the combination colors are generated, and this is determined by the encoding of the =color1ANYTYPE= parameter.

							EXAMPLE
							..........................................................................
							var webSafeColors = Uize.Color.Util.makeCombinations ('0','f',6,0,'#hex');
							..........................................................................

							In the above example, the =webSafeColors= variable will be an array containing all the [[http://en.wikipedia.org/wiki/Web_colors][web safe colors]], encoded in =#hex= format. The =Uize.Color.Util.makeCombinations= method makes it easy to generate the web safe colors because they are defined as the combination colors with distinct 6 values per channel: =00=, =33=, =66=, =99=, =cc=, and =ff=. Now, if you wanted an array of =Uize.Color= instances instead, you could just specify the value ='color'= for the =outputEncodingSTR= parameter, instead of ='#hex'=.
				*/
			},

			mix:function (_colors,_encoding) {
				var _colorsLength = _colors.length;
				if (!_colorsLength) return _Uize_Color ();
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
				_Uize_Color.setTuple (
					_dummyColor1.tuple,
					_component0Total / _colorsLength,
					_component1Total / _colorsLength,
					_component2Total / _colorsLength,
					_component3Total / _colorsLength
				);
				return _dummyColor1.to (_encoding || 'color');
				/*?
					Static Methods
						Uize.Color.Util.mix
							Returns an instance of the =Uize.Color= object, whose color is initialized to the average of all the colors specified in the colors array.

							SYNTAX
							.............................................
							colorOBJ = Uize.Color.Util.mix (colorsARRAY);
							.............................................

							Color values specified in the =colorsARRAY= array can be specified in any of the many `color encodings` supported by the =Uize.Color= module, so the following statement is perfectly valid...

							EXAMPLE
							...............................................................
							var mixedColor = Uize.Color.Util.mix ([
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
							.........................................................
							colorOBJ = Uize.Color.Util.mix (colorsARRAY,encodingSTR);
							.........................................................

							When the optional =encodingSTR= parameter is specified, rhe resulting mixed color can be encoded in any of the many supported `color encodings`.

							EXAMPLE
							....................................................
							alert (
								Uize.Color.Util.mix (
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
			},

			sort:function (_colors,_referenceColor,_componentWeighting,_encoding) {
				function _returnTupleComponentAsIs (_tuple,_componentNo) {
					return _tuple [_componentNo];
				}
				if (_colors.length > 1) {
					_componentWeighting = _ensureSettingIsTuple (_componentWeighting,1);
					_dummyColor1.from (_referenceColor);
					_encoding
						? _dummyColor1.setEncoding (_encoding)
						: (_encoding = _dummyColor1.encoding)
					;
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
						_colorSpaceTuple = _Uize_Color.colorSpaces [_Uize_Color.encodings [_encoding].colorSpace].tuple,
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
						Uize.Color.Util.sort
							Sorts the specified array of colors according to their proximity to a specified reference color, using the specified sort criteria.

							SYNTAX
							.......................................................................
							colorsARRAY = Uize.Color.Util.sort (colorsARRAY,referenceColorANYTYPE);
							.......................................................................

							This method sorts the colors specified by the =colorsARRAY= parameter, by how close they are to the reference color specified by the =referenceColorANYTYPE= parameter. Colors close to the head of the sorted array will be most like each other and most like the reference color, while colors towards the tail of the sorted array will be most unlike the reference color and will also tend to be most unlike one another. This will make the head of the sorted array appear more orderly, while making the tail appear more chaotic, since colors that are from the reference color may also be far from one another.

							Color values in the array to sort can be specified using any of the `color encodings` supported by the =Uize.Color= object, but they will be sorted in the color space of the reference color, as specified by the =referenceColorANYTYPE= parameter. So, if the array of colors are specified using =sRGB= encodings and the reference color is specified using an =HSL= encoding, then the colors will be sorted in the =HSL= color space.

							EXAMPLE
							............................................................................................
							Uize.Color.Util.sort (colors,'rgb(255,0,0)'); // sort redder colors to the head of the array
							............................................................................................

							VARIATION 1
							....................................
							colorsARRAY = Uize.Color.Util.sort (
								colorsARRAY,
								referenceColorANYTYPE,
								componentWeightingARRAY
							);
							....................................

							By default, the different components are normalized in order to give them equal weighting when calculating the proximity of colors being sorted to the reference color. However, specifying the optional =componentWeightingARRAY= parameter lets you specify a greater or lesser weighting for different components. For example, in the =HSL= color space, one may care more about how close colors are in terms of hue to the reference color than one cares about how close they are in terms of saturation or lightness.

							The array specified by the =componentWeightingARRAY= parameter should contain a weighting factor for each component of the color space of the reference color. Each weighting factor should be a floating point number, where a value of =1= represents normal weighting, and a value of =0= means to effectively ignore the component. Weighting values greater than =1= may be specified. For example, a value for =componentWeightingARRAY= of =[2,1,1]= in the =HSL= color space means that hue is twice as important as saturation and lightness. And, for that matter, values of =[2,2,2]= and =[1,1,1]= for =componentWeightingARRAY= both indicate equal weighting for three components of a color space.

							EXAMPLES
							.......................................................................................
							Uize.Color.Util.sort (colors,'hsl(0,0,0)',[0,0,1]);    // darkest to lightest
							Uize.Color.Util.sort (colors,'hsl(0,0,100)',[0,0,1]);  // lightest to darkest
							Uize.Color.Util.sort (colors,'hsl(0,100,0)',[0,1,0]);  // most to least saturated
							Uize.Color.Util.sort (colors,'hsl(120,0,0)',[1,0,0]);  // hue only, starting with green
							.......................................................................................

							The above examples show different ways that different components in the color space can be completely ignored when sorting, simply by giving them a weight of =0=.

							The "darkest to lightest" example sorts the array so that the darkest colors appear first. This is done by specifying a reference color in the =HSL= color space, with its lightness component set to =0= (i.e. black), and with the components other than lightness given a weight of =0=. The "lightest to darkest" example operates in a similar way, excepting that the reference color for the sort has lightness set to =100= (i.e. white). The "most to least saturated" example specifies weighting of =0= for hue and lightness so that only saturation affects the sort, and the saturation for the reference color is set to =100= (i.e. most saturated first). The "hue only, starting with green" example makes hue the only component of importance, and the hue for the reference color is set to =120= (i.e. green).

							VARIATION 2
							.................................................
							colorsARRAY = Uize.Color.Util.sort (colorsARRAY);
							.................................................

							When no =referenceColorANYTYPE= parameter is specified, then the reference color will be black in the RGB color space, and colors will be sorted on how close they are to black (so, essentially, darkest to lightest).

							NOTES
							- this method modifies the source array specified by the =colorsARRAY= parameter
							- this method returns a reference to the array being sorted
				*/
			}
		});
	}
});

