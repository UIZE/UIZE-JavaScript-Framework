/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Color.xHsv Object Extension
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Extension
	importance: 3
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Color.xHsv= module extends the =Uize.Color= object by adding a profile for the =HSV= color space, and by providing encodings for this color space.

		*DEVELOPERS:* `Chris van Rensburg`

		The =Uize.Color.colorSpaces.HSV= property - defined in this extension - provides a profile for the [[http://en.wikipedia.org/wiki/HSL_color_space][HSV]] (Hue, Saturation, Value) color space. The HSV color space is essentially an alternate representation / mapping of the =sRGB= color space, but might be considered to be a more intuitive representation of the qualities of color.

	Color Encodings
		The =Uize.Color.xHsv= extension implements support for the following color encodings / formats...
*/

Uize.module ({
	name:'Uize.Color.xHsv',
	builder:function (_Uize_Color) {
		'use strict';

		/*** Color Profile ***/
			_Uize_Color.colorSpaces.HSV = {
				fromHsl:function (_tuple) {
					// http://en.wikipedia.org/wiki/HSL_color_space
					var
						_lightness = _tuple [2] / 100,
						_maxMinLevelDelta = _tuple [1] / 50 * (_lightness < .5 ? _lightness : 1 - _lightness),
						_maxLevel = _lightness + _maxMinLevelDelta / 2
					;
					return [_tuple [0],_maxLevel ? _maxMinLevelDelta / _maxLevel * 100 : 0,_maxLevel * 100];
				},
				toHsl:function (_tuple) {
					// http://en.wikipedia.org/wiki/HSL_color_space
					var
						_maxLevel = _tuple [2] / 100,
						_minLevel = _maxLevel * (1 - _tuple [1] / 100),
						_maxMinLevelDelta = _maxLevel - _minLevel,
						_lightness = (_maxLevel + _minLevel) / 2
					;
					return [
						_tuple [0],
						_maxMinLevelDelta
							? 50 * _maxMinLevelDelta / (_lightness < .5 ? _lightness : (1 - _lightness))
							: 0,
						_lightness * 100
					];
				}
			};

		/*** Color Encodings ***/
			Uize.copyInto (
				_Uize_Color.encodings,
				{
					'HSV array':{
						colorSpace:'HSV',
						from:_Uize_Color.setTupleFromArray,
						to:_Uize_Color.cloneTuple
						/*?
							Color Encodings
								HSV array
									An array, containing three elements for hue, saturation, and value components of the color, whose values may be floating point numbers (eg. the color chartreuse is encoded as =[90,100,100]=).

									SYNTAX
									...........................................................
									[ hue0to360FLOAT, saturation0to100FLOAT, value0to100FLOAT ]
									...........................................................

									Encoding
										When a color is encoded as =HSV array=, the resulting array is made up of three number type elements that represent the values of the source color's hue, saturation, and value components, respectively.

										...............................
										<< table >>

										title: EXAMPLES
										data
										:| COLOR NAME | HSV array     |
										:| fuchsia    | [300,100,100] |
										:| yellow     | [60,100,100]  |
										:| blue       | [240,100,100] |
										:| white      | [0,0,100]     |
										...............................

									Decoding
										When a color is decoded from =HSV array=, the values of the array's three elements may be numbers, strings, or any object that implements a =valueOf= interface (such as an instance of a =Uize.Class= subclass that implements the =value= state property).

										The values will be coerced to number type by invoking the =valueOf Intrinsic Method=.

										EXAMPLES
										........................................
										[300,100,100]         // fuchsia
										['300','100','100']   // fuchsia
										[hueSlider,saturationSlider,valueSlider]
										........................................

										NOTES
										- string values for the saturation and value components in the array *may not* contain a "%" (percent) suffix
						*/
					},
					'HSV object':{
						colorSpace:'HSV',
						from:function (_hsvObject,_tuple) {
							_Uize_Color.setTuple (_tuple,_hsvObject.hue,_hsvObject.saturation,_hsvObject.value);
						},
						to:function (_tuple) {return {hue:_tuple [0],saturation:_tuple [1],value:_tuple [2]}}
						/*?
							Color Encodings
								HSV object
									An object, containing =hue=, =saturation=, and =value= properties, whose values may be floating point numbers (eg. the color chartreuse is encoded as ={hue:90,saturation:100,value:100}=).

									SYNTAX
									................................................................................
									{ hue:hue0to360FLOAT, saturation:saturation0to100FLOAT, value:value0to100FLOAT }
									................................................................................

									Encoding
										When a color is encoded as =HSV object=, the resulting object will contain the three number type properties =hue=, =saturation=, and =value=, reflecting the values of the source color's hue, saturation, and value.

										....................................................
										<< table >>

										title: EXAMPLES
										data
										:| COLOR NAME | HSV object                         |
										:| fuchsia    | {hue:300,saturation:100,value:100} |
										:| yellow     | {hue:60,saturation:100,value:100}  |
										:| blue       | {hue:240,saturation:100,value:100} |
										:| white      | {hue:0,saturation:0,value:100}     |
										....................................................

									Decoding
										When a color is decoded from =HSV object=, the values of the object's =hue=, =saturation=, and =value= properties may be numbers, strings, or any object that implements a =valueOf= interface (such as an instance of a =Uize.Class= subclass that implements the =value= state property).

										The values will be coerced to number type by invoking the =valueOf Intrinsic Method=.

										EXAMPLES
										.............................................................
										{hue:300,saturation:100,value:100}         // fuchsia
										{hue:'300',saturation:'100',value:'100'}   // fuchsia
										{hue:hueSlider,saturation:saturationSlider,value:valueSlider}
										.............................................................

										NOTES
										- string values for the =saturation= and =value= properties of the object *may not* contain a "%" (percent) suffix
						*/
					},
					'HSV string':{
						colorSpace:'HSV',
						from:_Uize_Color.setTupleFromString,
						to:function (_tuple) {
							function _roundAndConstrainComponent (_componentNo,_minValue,_maxValue) {
								return Uize.constrain (Math.round (_tuple [_componentNo]),_minValue,_maxValue);
							}
							return (
								'hsv(' +
									_roundAndConstrainComponent (0,0,360) + ',' +
									_roundAndConstrainComponent (1,0,100) + '%,' +
									_roundAndConstrainComponent (2,0,100) + '%' +
								')'
							);
						}
						/*?
							Color Encodings
								HSV string
									An =Hsv(...)= formatted 3-tuple string (eg. the color chartreuse is encoded as ='hsv(90,100%,100%)'=).

									SYNTAX
									...................................................
									hsv([hue0to360],[saturation0to100]%,[value0to100]%)
									...................................................

									Encoding
										When a color is encoded as =HSV string=, the resulting string will always be all lowercase, without any spaces.

										Furthermore, the values for hue, saturation, and value will be rounded to the nearest integer, the value for hue will be constrained to the range of =0= to =360=, and the values for saturation and value will be constrained to a range of =0= to =100= and a "%" (percent symbol) character will be appended to each.

										.....................................
										<< table >>

										title: EXAMPLES
										data
										:| COLOR NAME |  HSV string         |
										:| fuchsia    |  hsv(300,100%,100%) |
										:| yellow     |  hsv(60,100%,100%)  |
										:| blue       |  hsv(240,100%,100%) |
										:| white      |  hsv(0,0%,100%)     |
										.....................................

										NOTES
										- because encoding as =HSV string= rounds the values for hue, saturation, and value, colors encoded as =HSV string= may not produce exactly the same original color when decoding the encoded =HSV string=

									Decoding
										When a color is decoded from =HSV string=, the string may contain separating spaces, may be in upper, lower, or mixed case (ie. *not* case sensitive), and the "%" (percent symbol) character for the saturation and value values may be omitted.

										FUCHSIA
										.........................
										hsv(300,100,100)
										hsv(300,100%,100%)
										HSV(300,100%,100%)
										Hsv (300, 100%, 100%)
										HSV ( 300 , 100% , 100% )
										Hsv ( 300 , 100 , 100 )
										.........................
						*/
					}
				}
			);
	}
});

