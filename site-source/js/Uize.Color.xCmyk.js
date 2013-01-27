/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Color.xCmyk Object Extension
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2011-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Extension
	importance: 1
	codeCompleteness: 10
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Color.xCmyk= module extends the =Uize.Color= object by adding a profile for the =CMYK= color space, and by providing encodings for this color space.

		*DEVELOPERS:* `Chris van Rensburg`

		The =Uize.Color.colorSpaces.CMYK= property - defined in this extension - provides a profile for the [[http://en.wikipedia.org/wiki/Cmyk][CMYK]] (Cyan, Magenta, Yellow, Key) color space. The CMYK color model is a subtractive color model used to describe the printing process. Some examples of CMYK formatted colors can be viewed at [[http://www.december.com/html/spec/colorcmyk.html]].

	Color Encodings
		The =Uize.Color.xCmyk= extension implements support for the following color encodings / formats...
*/

Uize.module ({
	name:'Uize.Color.xCmyk',
	builder:function (_Uize_Color) {
		'use strict';

		var _sRgbColorSpace = _Uize_Color.colorSpaces.sRGB;

		/*** Color Profile ***/
			_Uize_Color.colorSpaces.CMYK = {
				fromHsl:function (_tuple) {
					// HSL to RGB first, then RGB to CMYK
					_tuple = _sRgbColorSpace.fromHsl (_tuple);
					var
						_red = _tuple [0] / 255,
						_green = _tuple [1] / 255,
						_blue = _tuple [2] / 255,
						_key = Math.min (1 - _red,1 - _green,1 - _blue),
						_1minusKey = 1 - _key
					;
					return [
						_1minusKey && ((_1minusKey - _red) / _1minusKey * 100),
						_1minusKey && ((_1minusKey - _green) / _1minusKey * 100),
						_1minusKey && ((_1minusKey - _blue) / _1minusKey * 100),
						_key * 100
					];
				},
				toHsl:function (_tuple) {
					// CMYK to RGB first, then RGB to HSL
					var
						_key = _tuple [3] / 100,
						_1minusKey = 1 - _key
					;
					return _sRgbColorSpace.toHsl ([
						(1 - Math.min (1,_tuple [0] / 100 * _1minusKey + _key)) * 255,
						(1 - Math.min (1,_tuple [1] / 100 * _1minusKey + _key)) * 255,
						(1 - Math.min (1,_tuple [2] / 100 * _1minusKey + _key)) * 255
					]);
				}
			};

		/*** Color Encodings ***/
			Uize.copyInto (
				_Uize_Color.encodings,
				{
					'CMYK array':{
						colorSpace:'CMYK',
						from:_Uize_Color.setTupleFromArray,
						to:_Uize_Color.cloneTuple
						/*?
							Color Encodings
								CMYK array
									An array, containing four elements for cyan, magenta, yellow, and key components of the color, whose values may be floating point numbers in the range of =0= to =100= (eg. the color chartreuse is encoded as =[50,0,100,0]=).

									SYNTAX
									..........................................................................
									[ cyan0to100FLOAT, magenta0to100FLOAT, yellow0to100FLOAT, key0to100FLOAT ]
									..........................................................................

									Encoding
										When a color is encoded as =CMYK array=, the resulting array is made up of four number type elements that represent the values of the source color's cyan, magenta, yellow, and key components, respectively.

										...............................
										<< table >>

										title: EXAMPLES
										data
										:| COLOR NAME | CMYK array    |
										:| fuchsia    | [0,100,0,0]   |
										:| yellow     | [0,0,100,0]   |
										:| blue       | [100,100,0,0] |
										:| white      | [0,0,0,0]     |
										...............................

									Decoding
										When a color is decoded from =CMYK array=, the values of the array's four elements may be numbers, strings, or any object that implements a =valueOf= interface (such as an instance of a =Uize.Class= subclass that implements the =value= state property).

										The values will be coerced to number type by invoking the =valueOf Intrinsic Method=.

										EXAMPLES
										.................................................
										[0,100,0,0]           // fuchsia
										['0','100','0','0']   // fuchsia
										[cyanSlider,magentaSlider,yellowSlider,keySlider]
										.................................................

										NOTES
										- string values for the elements of the array *may not* contain a "%" (percent) suffix
						*/
					},
					'CMYK object':{
						colorSpace:'CMYK',
						from:function (_cmykObject,_tuple) {
							_Uize_Color.setTuple (
								_tuple,_cmykObject.cyan,_cmykObject.magenta,_cmykObject.yellow,_cmykObject.key
							);
						},
						to:function (_tuple) {return {cyan:_tuple [0],magenta:_tuple [1],yellow:_tuple [2],key:_tuple [3]}}
						/*?
							Color Encodings
								CMYK object
									An object, containing =cyan=, =magenta=, =yellow=, and =key= properties, whose values may be floating point numbers in the range of =0= to =100= (eg. the color chartreuse is encoded as ={cyan:50,magenta:0,yellow:100,key:0}=).

									SYNTAX
									................................
									{
										cyan    : cyan0to100FLOAT,
										magenta : magenta0to100FLOAT,
										yellow  : yellow0to100FLOAT,
										key     : key0to100FLOAT
									}
									................................

									Encoding
										When a color is encoded as =CMYK object=, the resulting object will contain the four number type properties =cyan=, =magenta=, =yellow=, and =key=, reflecting the values of the source color's cyan, magenta, yellow, and key components, respectively.

										.......................................................
										<< table >>

										title: EXAMPLES
										data
										:| COLOR NAME | CMYK object                           |
										:| fuchsia    | {cyan:0,magenta:100,yellow:0,key:0}   |
										:| yellow     | {cyan:0,magenta:0,yellow:100,key:0}   |
										:| blue       | {cyan:100,magenta:100,yellow:0,key:0} |
										:| white      | {cyan:0,magenta:0,yellow:0,key:0}     |
										.......................................................

									Decoding
										When a color is decoded from =CMYK object=, the values of the object's =cyan=, =magenta=, =yellow=, and =key= properties may be numbers, strings, or any object that implements a =valueOf= interface (such as an instance of a =Uize.Class= subclass that implements the =value= state property).

										The values will be coerced to number type by invoking the =valueOf Intrinsic Method=.

										EXAMPLES
										.........................................................................
										{cyan:0,magenta:100,yellow:0,key:0}           // fuchsia
										{cyan:'0',magenta:'100',yellow:'0',key:'0'}   // fuchsia
										{cyan:cyanSlider,magenta:magentaSlider,yellow:yellowSlider,key:keySlider}
										.........................................................................

										NOTES
										- string values for the properties of the object *may not* contain a "%" (percent) suffix
						*/
					},
					'CMYK string':{
						colorSpace:'CMYK',
						from:_Uize_Color.setTupleFromString,
						to:function (_tuple) {
							function _roundAndConstrainComponent (_componentNo) {
								return Uize.constrain (Math.round (_tuple [_componentNo]),0,100);
							}
							return (
								'cmyk(' +
									_roundAndConstrainComponent (0) + '%,' +
									_roundAndConstrainComponent (1) + '%,' +
									_roundAndConstrainComponent (2) + '%,' +
									_roundAndConstrainComponent (3) + '%' +
								')'
							);
						}
						/*?
							Color Encodings
								CMYK string
									A =Cmyk(...)= formatted 4-tuple string (eg. the color chartreuse is encoded as ='cmyk(50%,0%,100%,0%)'=).

									SYNTAX
									.................................................................
									cmyk([cyan0to100]%,[magenta0to100]%,[yellow0to100]%,[key0to100]%)
									.................................................................

									Encoding
										When a color is encoded as =CMYK string=, the resulting string will always be all lowercase, without any spaces.

										Furthermore, the values for cyan, magenta, yellow, and key components of the tuple will be rounded to the nearest integer and constrained to a range of =0= to =100=, with a "%" (percent symbol) character appended to each.

										.......................................
										<< table >>

										title: EXAMPLES
										data
										:| COLOR NAME | CMYK string           |
										:| fuchsia    | cmyk(0%,100%,0%,0%)   |
										:| yellow     | cmyk(0%,0%,100%,0%)   |
										:| blue       | cmyk(100%,100%,0%,0%) |
										:| white      | cmyk(0%,0%,0%,0%)     |
										.......................................

										NOTES
										- because encoding as =CMYK string= rounds the values for all four components of a color, colors encoded as =CMYK string= may not produce exactly the same original color when decoding the encoded =CMYK string=

									Decoding
										When a color is decoded from =CMYK string=, the string may contain separating spaces, may be in upper, lower, or mixed case (ie. *not* case sensitive), and the "%" (percent symbol) character for the saturation and value values may be omitted.

										FUCHSIA
										............................
										cmyk(0,100,0,0)
										cmyk(0%,100%,0%,0%)
										CMYK(0%,100%,0%,0%)
										Cmyk (0%, 100%, 0%, 0%)
										CMYK ( 0% , 100% , 0% , 0% )
										Cmyk ( 0 , 100 , 0 , 0 )
										............................
						*/
					}
				}
			);
	}
});

