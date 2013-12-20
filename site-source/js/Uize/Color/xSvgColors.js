/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Color.xSvgColors Object Extension
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Extension
	importance: 2
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Color.xSvgColors= extension module extends the =Uize.Color= object by adding SVG 1.0 / CSS 3 color definitions to the =Uize.Color.colors= object.

		*DEVELOPERS:* `Chris van Rensburg`

	Using the Colors
		When you extend the =Uize.Color= object using the =Uize.Color.xSvgColors= extension module, it will then be possible to use the names of the colors defined in this extension when creating instances of the =Uize.Color= object, or when setting the color of =Uize.Color= instances using the =from= instance method.

		EXAMPLE
		..............................................
		Uize.Color ('#ffebcd');
		Uize.Color ('BlanchedAlmond');
		Uize.Color (Uize.Color.colors.blanchedalmond);
		..............................................

		Each of the above three statements would create a new instance of the =Uize.Color= object initialized to the SVG color "BlanchedAlmond". And because the =Uize.Color= module is used by other modules, such as the =Uize.Fx= module, it is possible to use color names when specifying the values of color CSS style properties for fade effects, as in...

		.............................................................................
		Uize.Fx.fadeStyle ('myNodeId',{color:'DarkMagenta'},{color:'LavenderBlush'});
		.............................................................................
*/

Uize.module ({
	name:'Uize.Color.xSvgColors',
	builder:function (_Uize_Color) {
		'use strict';

		_Uize_Color.defineColors ({
			aliceBlue:            15792383, // 0xf0f8ff
			antiqueWhite:         16444375, // 0xfaebd7
			aquamarine:            8388564, // 0x7fffd4
			azure:                15794175, // 0xf0ffff
			beige:                16119260, // 0xf5f5dc
			bisque:               16770244, // 0xffe4c4
			blanchedAlmond:       16772045, // 0xffebcd
			blueViolet:            9055202, // 0x8a2be2
			brown:                10824234, // 0xa52a2a
			burlyWood:            14596231, // 0xdeb887
			cadetBlue:             6266528, // 0x5f9ea0
			chartreuse:            8388352, // 0x7fff00
			chocolate:            13789470, // 0xd2691e
			coral:                16744272, // 0xff7f50
			cornflowerBlue:        6591981, // 0x6495ed
			cornSilk:             16775388, // 0xfff8dc
			crimson:              14423100, // 0xdc143c
			cyan:                    65535, // 0x00ffff
			darkBlue:                  139, // 0x00008b
			darkCyan:                35723, // 0x008b8b
			darkGoldenrod:        12092939, // 0xb8860b
			darkGray:             11119017, // 0xa9a9a9
			darkGreen:               25600, // 0x006400
			darkGrey:             11119017, // 0xa9a9a9
			darkKhaki:            12433259, // 0xbdb76b
			darkMagenta:           9109643, // 0x8b008b
			darkOliveGreen:        5597999, // 0x556b2f
			darkOrange:           16747520, // 0xff8c00
			darkOrchid:           10040012, // 0x9932cc
			darkRed:               9109504, // 0x8b0000
			darkSalmon:           15308410, // 0xe9967a
			darkSeaGreen:          9419919, // 0x8fbc8f
			darkSlateBlue:         4734347, // 0x483d8b
			darkSlateGray:         3100495, // 0x2f4f4f
			darkSlateGrey:         3100495, // 0x2f4f4f
			darkTurquoise:           52945, // 0x00ced1
			darkViolet:            9699539, // 0x9400d3
			deepPink:             16716947, // 0xff1493
			deepSkyBlue:             49151, // 0x00bfff
			dimGray:               6908265, // 0x696969
			dimGrey:               6908265, // 0x696969
			dodgerBlue:            2003199, // 0x1e90ff
			fireBrick:            11674146, // 0xb22222
			floralWhite:          16775920, // 0xfffaf0
			forestGreen:           2263842, // 0x228b22
			gainsboro:            14474460, // 0xdcdcdc
			ghostWhite:           16316671, // 0xf8f8ff
			gold:                 16766720, // 0xffd700
			goldenrod:            14329120, // 0xdaa520
			greenYellow:          11403055, // 0xadff2f
			grey:                  8421504, // 0x808080
			honeydew:             15794160, // 0xf0fff0
			hotPink:              16738740, // 0xff69b4
			indianRed:            13458524, // 0xcd5c5c
			indigo:                4915330, // 0x4b0082
			ivory:                16777200, // 0xfffff0
			khaki:                15787660, // 0xf0e68c
			lavender:             15132410, // 0xe6e6fa
			lavenderBlush:        16773365, // 0xfff0f5
			lawnGreen:             8190976, // 0x7cfc00
			lemonChiffon:         16775885, // 0xfffacd
			lightBlue:            11393254, // 0xadd8e6
			lightCoral:           15761536, // 0xf08080
			lightCyan:            14745599, // 0xe0ffff
			lightGoldenrodYellow: 16448210, // 0xfafad2
			lightGray:            13882323, // 0xd3d3d3
			lightGreen:            9498256, // 0x90ee90
			lightGrey:            13882323, // 0xd3d3d3
			lightPink:            16758465, // 0xffb6c1
			lightSalmon:          16752762, // 0xffa07a
			lightSeaGreen:         2142890, // 0x20b2aa
			lightSkyBlue:          8900346, // 0x87cefa
			lightSlateGray:        7833753, // 0x778899
			lightSlateGrey:        7833753, // 0x778899
			lightSteelBlue:       11584734, // 0xb0c4de
			lightYellow:          16777184, // 0xffffe0
			limeGreen:             3329330, // 0x32cd32
			linen:                16445670, // 0xfaf0e6
			magenta:              16711935, // 0xff00ff
			mediumAquamarine:      6737322, // 0x66cdaa
			mediumBlue:                205, // 0x0000cd
			mediumOrchid:         12211667, // 0xba55d3
			mediumPurple:          9662683, // 0x9370db
			mediumSeaGreen:        3978097, // 0x3cb371
			mediumSlateBlue:       8087790, // 0x7b68ee
			mediumSpringGreen:       64154, // 0x00fa9a
			mediumTurquoise:       4772300, // 0x48d1cc
			mediumVioletRed:      13047173, // 0xc71585
			midnightBlue:          1644912, // 0x191970
			mintCream:            16121850, // 0xf5fffa
			mistyRose:            16770273, // 0xffe4e1
			moccasin:             16770229, // 0xffe4b5
			navajoWhite:          16768685, // 0xffdead
			oldLace:              16643558, // 0xfdf5e6
			oliveDrab:             7048739, // 0x6b8e23
			orangeRed:            16729344, // 0xff4500
			orchid:               14315734, // 0xda70d6
			paleGoldenrod:        15657130, // 0xeee8aa
			paleGreen:            10025880, // 0x98fb98
			paleTurquoise:        11529966, // 0xafeeee
			paleVioletRed:        14381203, // 0xdb7093
			papayaWhip:           16773077, // 0xffefd5
			peachPuff:            16767673, // 0xffdab9
			peru:                 13468991, // 0xcd853f
			pink:                 16761035, // 0xffc0cb
			plum:                 14524637, // 0xdda0dd
			powderBlue:           11591910, // 0xb0e0e6
			rosyBrown:            12357519, // 0xbc8f8f
			royalBlue:             4286945, // 0x4169e1
			saddleBrown:           9127187, // 0x8b4513
			salmon:               16416882, // 0xfa8072
			sandyBrown:           16032864, // 0xf4a460
			seaGreen:              3050327, // 0x2e8b57
			seashell:             16774638, // 0xfff5ee
			sienna:               10506797, // 0xa0522d
			skyBlue:               8900331, // 0x87ceeb
			slateBlue:             6970061, // 0x6a5acd
			slateGray:             7372944, // 0x708090
			slateGrey:             7372944, // 0x708090
			snow:                 16775930, // 0xfffafa
			springGreen:             65407, // 0x00ff7f
			steelBlue:             4620980, // 0x4682b4
			tan:                  13808780, // 0xd2b48c
			thistle:              14204888, // 0xd8bfd8
			tomato:               16737095, // 0xff6347
			turquoise:             4251856, // 0x40e0d0
			violet:               15631086, // 0xee82ee
			wheat:                16113331, // 0xf5deb3
			whiteSmoke:           16119285, // 0xf5f5f5
			yellowGreen:          10145074  // 0x9acd32
		});
		/*?
			The SVG 1.0 Colors
				The =Uize.Color.xSvgColors= module defines over a hundred additional colors, as listed in the table below.

				This is in addition to the seventeen standard CSS 2.1 colors defined in the =Uize.Color= module, which are =white=, =silver=, =gray=, =black=, =navy=, =blue=, =aqua=, =teal=, =green=, =olive=, =lime=, =maroon=, =red=, =orange=, =yellow=, =purple=, and =fuchsia=.

				.........................................
				<< table >>

				title: SVG 1.0 COLORS
				data
				:| COLOR NAME             |  HEX VALUE  |
				:| aliceBlue              |   #f0f8ff   |
				:| antiqueWhite           |   #faebd7   |
				:| aquamarine             |   #7fffd4   |
				:| azure                  |   #f0ffff   |
				:| beige                  |   #f5f5dc   |
				:| bisque                 |   #ffe4c4   |
				:| blanchedAlmond         |   #ffebcd   |
				:| blueViolet             |   #8a2be2   |
				:| brown                  |   #a52a2a   |
				:| burlyWood              |   #deb887   |
				:| cadetBlue              |   #5f9ea0   |
				:| chartreuse             |   #7fff00   |
				:| chocolate              |   #d2691e   |
				:| coral                  |   #ff7f50   |
				:| cornflowerBlue         |   #6495ed   |
				:| cornSilk               |   #fff8dc   |
				:| crimson                |   #dc143c   |
				:| cyan                   |   #00ffff   |
				:| darkBlue               |   #00008b   |
				:| darkCyan               |   #008b8b   |
				:| darkGoldenrod          |   #b8860b   |
				:| darkGray               |   #a9a9a9   |
				:| darkGreen              |   #006400   |
				:| darkGrey               |   #a9a9a9   |
				:| darkKhaki              |   #bdb76b   |
				:| darkMagenta            |   #8b008b   |
				:| darkOliveGreen         |   #556b2f   |
				:| darkOrange             |   #ff8c00   |
				:| darkOrchid             |   #9932cc   |
				:| darkRed                |   #8b0000   |
				:| darkSalmon             |   #e9967a   |
				:| darkSeaGreen           |   #8fbc8f   |
				:| darkSlateBlue          |   #483d8b   |
				:| darkSlateGray          |   #2f4f4f   |
				:| darkSlateGrey          |   #2f4f4f   |
				:| darkTurquoise          |   #00ced1   |
				:| darkViolet             |   #9400d3   |
				:| deepPink               |   #ff1493   |
				:| deepSkyBlue            |   #00bfff   |
				:| dimGray                |   #696969   |
				:| dimGrey                |   #696969   |
				:| dodgerBlue             |   #1e90ff   |
				:| fireBrick              |   #b22222   |
				:| floralWhite            |   #fffaf0   |
				:| forestGreen            |   #228b22   |
				:| gainsboro              |   #dcdcdc   |
				:| ghostWhite             |   #f8f8ff   |
				:| gold                   |   #ffd700   |
				:| goldenrod              |   #daa520   |
				:| greenYellow            |   #adff2f   |
				:| grey                   |   #808080   |
				:| honeydew               |   #f0fff0   |
				:| hotPink                |   #ff69b4   |
				:| indianRed              |   #cd5c5c   |
				:| indigo                 |   #4b0082   |
				:| ivory                  |   #fffff0   |
				:| khaki                  |   #f0e68c   |
				:| lavender               |   #e6e6fa   |
				:| lavenderBlush          |   #fff0f5   |
				:| lawnGreen              |   #7cfc00   |
				:| lemonChiffon           |   #fffacd   |
				:| lightBlue              |   #add8e6   |
				:| lightCoral             |   #f08080   |
				:| lightCyan              |   #e0ffff   |
				:| lightGoldenrodYellow   |   #fafad2   |
				:| lightGray              |   #d3d3d3   |
				:| lightGreen             |   #90ee90   |
				:| lightGrey              |   #d3d3d3   |
				:| lightPink              |   #ffb6c1   |
				:| lightSalmon            |   #ffa07a   |
				:| lightSeaGreen          |   #20b2aa   |
				:| lightSkyBlue           |   #87cefa   |
				:| lightSlateGray         |   #778899   |
				:| lightSlateGrey         |   #778899   |
				:| lightSteelBlue         |   #b0c4de   |
				:| lightYellow            |   #ffffe0   |
				:| limeGreen              |   #32cd32   |
				:| linen                  |   #faf0e6   |
				:| magenta                |   #ff00ff   |
				:| mediumAquamarine       |   #66cdaa   |
				:| mediumBlue             |   #0000cd   |
				:| mediumOrchid           |   #ba55d3   |
				:| mediumPurple           |   #9370db   |
				:| mediumSeaGreen         |   #3cb371   |
				:| mediumSlateBlue        |   #7b68ee   |
				:| mediumSpringGreen      |   #00fa9a   |
				:| mediumTurquoise        |   #48d1cc   |
				:| mediumVioletRed        |   #c71585   |
				:| midnightBlue           |   #191970   |
				:| mintCream              |   #f5fffa   |
				:| mistyRose              |   #ffe4e1   |
				:| moccasin               |   #ffe4b5   |
				:| navajoWhite            |   #ffdead   |
				:| oldLace                |   #fdf5e6   |
				:| oliveDrab              |   #6b8e23   |
				:| orangeRed              |   #ff4500   |
				:| orchid                 |   #da70d6   |
				:| paleGoldenrod          |   #eee8aa   |
				:| paleGreen              |   #98fb98   |
				:| paleTurquoise          |   #afeeee   |
				:| paleVioletRed          |   #db7093   |
				:| papayaWhip             |   #ffefd5   |
				:| peachPuff              |   #ffdab9   |
				:| peru                   |   #cd853f   |
				:| pink                   |   #ffc0cb   |
				:| plum                   |   #dda0dd   |
				:| powderBlue             |   #b0e0e6   |
				:| rosyBrown              |   #bc8f8f   |
				:| royalBlue              |   #4169e1   |
				:| saddleBrown            |   #8b4513   |
				:| salmon                 |   #fa8072   |
				:| sandyBrown             |   #f4a460   |
				:| seaGreen               |   #2e8b57   |
				:| seashell               |   #fff5ee   |
				:| sienna                 |   #a0522d   |
				:| skyBlue                |   #87ceeb   |
				:| slateBlue              |   #6a5acd   |
				:| slateGray              |   #708090   |
				:| slateGrey              |   #708090   |
				:| snow                   |   #fffafa   |
				:| springGreen            |   #00ff7f   |
				:| steelBlue              |   #4682b4   |
				:| tan                    |   #d2b48c   |
				:| thistle                |   #d8bfd8   |
				:| tomato                 |   #ff6347   |
				:| turquoise              |   #40e0d0   |
				:| violet                 |   #ee82ee   |
				:| wheat                  |   #f5deb3   |
				:| whiteSmoke             |   #f5f5f5   |
				:| yellowGreen            |   #9acd32   |
				.........................................
		*/
	}
});

