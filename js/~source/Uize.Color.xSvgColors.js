/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Color.xSvgColors Object Extension
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Extension
	importance: 2
	codeCompleteness: 100
	testCompleteness: 0
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Color.xSvgColors= extension module extends the =Uize.Color= object by adding SVG 1.0 / CSS 3 color definitions to the =Uize.Color.colors= object.

		*DEVELOPERS:* `Chris van Rensburg`

	Using the Colors
		When you extend the =Uize.Color= object using the =Uize.Color.xSvgColors= extension module, it will then be possible to use the names of the colors defined in this extension when creating instances of the =Uize.Color= object, or when setting the color of =Uize.Color= instances using the =from= instance method.

		EXAMPLE
		..................................................
		new Uize.Color ('#ffebcd');
		new Uize.Color ('BlanchedAlmond');
		new Uize.Color (Uize.Color.colors.blanchedalmond);
		..................................................

		Each of the above three statements would create a new instance of the =Uize.Color= object initialized to the SVG color "BlanchedAlmond". And because the =Uize.Color= module is used by other modules, such as the =Uize.Fx= module, it is possible to use color names when specifying the values of color CSS style properties for fade effects, as in...

		.............................................................................
		Uize.Fx.fadeStyle ('myNodeId',{color:'DarkMagenta'},{color:'LavenderBlush'});
		.............................................................................
*/

Uize.module ({
	name:'Uize.Color.xSvgColors',
	builder:function (_Uize_Color) {
		_Uize_Color.defineColors ({
			aliceblue:            15792383, // 0xf0f8ff
			antiquewhite:         16444375, // 0xfaebd7
			aquamarine:            8388564, // 0x7fffd4
			azure:                15794175, // 0xf0ffff
			beige:                16119260, // 0xf5f5dc
			bisque:               16770244, // 0xffe4c4
			blanchedalmond:       16772045, // 0xffebcd
			blueviolet:            9055202, // 0x8a2be2
			brown:                10824234, // 0xa52a2a
			burlywood:            14596231, // 0xdeb887
			cadetblue:             6266528, // 0x5f9ea0
			chartreuse:            8388352, // 0x7fff00
			chocolate:            13789470, // 0xd2691e
			coral:                16744272, // 0xff7f50
			cornflowerblue:        6591981, // 0x6495ed
			cornsilk:             16775388, // 0xfff8dc
			crimson:              14423100, // 0xdc143c
			cyan:                    65535, // 0x00ffff
			darkblue:                  139, // 0x00008b
			darkcyan:                35723, // 0x008b8b
			darkgoldenrod:        12092939, // 0xb8860b
			darkgray:             11119017, // 0xa9a9a9
			darkgreen:               25600, // 0x006400
			darkgrey:             11119017, // 0xa9a9a9
			darkkhaki:            12433259, // 0xbdb76b
			darkmagenta:           9109643, // 0x8b008b
			darkolivegreen:        5597999, // 0x556b2f
			darkorange:           16747520, // 0xff8c00
			darkorchid:           10040012, // 0x9932cc
			darkred:               9109504, // 0x8b0000
			darksalmon:           15308410, // 0xe9967a
			darkseagreen:          9419919, // 0x8fbc8f
			darkslateblue:         4734347, // 0x483d8b
			darkslategray:         3100495, // 0x2f4f4f
			darkslategrey:         3100495, // 0x2f4f4f
			darkturquoise:           52945, // 0x00ced1
			darkviolet:            9699539, // 0x9400d3
			deeppink:             16716947, // 0xff1493
			deepskyblue:             49151, // 0x00bfff
			dimgray:               6908265, // 0x696969
			dimgrey:               6908265, // 0x696969
			dodgerblue:            2003199, // 0x1e90ff
			firebrick:            11674146, // 0xb22222
			floralwhite:          16775920, // 0xfffaf0
			forestgreen:           2263842, // 0x228b22
			gainsboro:            14474460, // 0xdcdcdc
			ghostwhite:           16316671, // 0xf8f8ff
			gold:                 16766720, // 0xffd700
			goldenrod:            14329120, // 0xdaa520
			greenyellow:          11403055, // 0xadff2f
			grey:                  8421504, // 0x808080
			honeydew:             15794160, // 0xf0fff0
			hotpink:              16738740, // 0xff69b4
			indianred:            13458524, // 0xcd5c5c
			indigo:                4915330, // 0x4b0082
			ivory:                16777200, // 0xfffff0
			khaki:                15787660, // 0xf0e68c
			lavender:             15132410, // 0xe6e6fa
			lavenderblush:        16773365, // 0xfff0f5
			lawngreen:             8190976, // 0x7cfc00
			lemonchiffon:         16775885, // 0xfffacd
			lightblue:            11393254, // 0xadd8e6
			lightcoral:           15761536, // 0xf08080
			lightcyan:            14745599, // 0xe0ffff
			lightgoldenrodyellow: 16448210, // 0xfafad2
			lightgray:            13882323, // 0xd3d3d3
			lightgreen:            9498256, // 0x90ee90
			lightgrey:            13882323, // 0xd3d3d3
			lightpink:            16758465, // 0xffb6c1
			lightsalmon:          16752762, // 0xffa07a
			lightseagreen:         2142890, // 0x20b2aa
			lightskyblue:          8900346, // 0x87cefa
			lightslategray:        7833753, // 0x778899
			lightslategrey:        7833753, // 0x778899
			lightsteelblue:       11584734, // 0xb0c4de
			lightyellow:          16777184, // 0xffffe0
			limegreen:             3329330, // 0x32cd32
			linen:                16445670, // 0xfaf0e6
			magenta:              16711935, // 0xff00ff
			mediumaquamarine:      6737322, // 0x66cdaa
			mediumblue:                205, // 0x0000cd
			mediumorchid:         12211667, // 0xba55d3
			mediumpurple:          9662683, // 0x9370db
			mediumseagreen:        3978097, // 0x3cb371
			mediumslateblue:       8087790, // 0x7b68ee
			mediumspringgreen:       64154, // 0x00fa9a
			mediumturquoise:       4772300, // 0x48d1cc
			mediumvioletred:      13047173, // 0xc71585
			midnightblue:          1644912, // 0x191970
			mintcream:            16121850, // 0xf5fffa
			mistyrose:            16770273, // 0xffe4e1
			moccasin:             16770229, // 0xffe4b5
			navajowhite:          16768685, // 0xffdead
			oldlace:              16643558, // 0xfdf5e6
			olivedrab:             7048739, // 0x6b8e23
			orangered:            16729344, // 0xff4500
			orchid:               14315734, // 0xda70d6
			palegoldenrod:        15657130, // 0xeee8aa
			palegreen:            10025880, // 0x98fb98
			paleturquoise:        11529966, // 0xafeeee
			palevioletred:        14381203, // 0xdb7093
			papayawhip:           16773077, // 0xffefd5
			peachpuff:            16767673, // 0xffdab9
			peru:                 13468991, // 0xcd853f
			pink:                 16761035, // 0xffc0cb
			plum:                 14524637, // 0xdda0dd
			powderblue:           11591910, // 0xb0e0e6
			rosybrown:            12357519, // 0xbc8f8f
			royalblue:             4286945, // 0x4169e1
			saddlebrown:           9127187, // 0x8b4513
			salmon:               16416882, // 0xfa8072
			sandybrown:           16032864, // 0xf4a460
			seagreen:              3050327, // 0x2e8b57
			seashell:             16774638, // 0xfff5ee
			sienna:               10506797, // 0xa0522d
			skyblue:               8900331, // 0x87ceeb
			slateblue:             6970061, // 0x6a5acd
			slategray:             7372944, // 0x708090
			slategrey:             7372944, // 0x708090
			snow:                 16775930, // 0xfffafa
			springgreen:             65407, // 0x00ff7f
			steelblue:             4620980, // 0x4682b4
			tan:                  13808780, // 0xd2b48c
			thistle:              14204888, // 0xd8bfd8
			tomato:               16737095, // 0xff6347
			turquoise:             4251856, // 0x40e0d0
			violet:               15631086, // 0xee82ee
			wheat:                16113331, // 0xf5deb3
			whitesmoke:           16119285, // 0xf5f5f5
			yellowgreen:          10145074  // 0x9acd32
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
				:| aliceblue              |   #f0f8ff   |
				:| antiquewhite           |   #faebd7   |
				:| aquamarine             |   #7fffd4   |
				:| azure                  |   #f0ffff   |
				:| beige                  |   #f5f5dc   |
				:| bisque                 |   #ffe4c4   |
				:| blanchedalmond         |   #ffebcd   |
				:| blueviolet             |   #8a2be2   |
				:| brown                  |   #a52a2a   |
				:| burlywood              |   #deb887   |
				:| cadetblue              |   #5f9ea0   |
				:| chartreuse             |   #7fff00   |
				:| chocolate              |   #d2691e   |
				:| coral                  |   #ff7f50   |
				:| cornflowerblue         |   #6495ed   |
				:| cornsilk               |   #fff8dc   |
				:| crimson                |   #dc143c   |
				:| cyan                   |   #00ffff   |
				:| darkblue               |   #00008b   |
				:| darkcyan               |   #008b8b   |
				:| darkgoldenrod          |   #b8860b   |
				:| darkgray               |   #a9a9a9   |
				:| darkgreen              |   #006400   |
				:| darkgrey               |   #a9a9a9   |
				:| darkkhaki              |   #bdb76b   |
				:| darkmagenta            |   #8b008b   |
				:| darkolivegreen         |   #556b2f   |
				:| darkorange             |   #ff8c00   |
				:| darkorchid             |   #9932cc   |
				:| darkred                |   #8b0000   |
				:| darksalmon             |   #e9967a   |
				:| darkseagreen           |   #8fbc8f   |
				:| darkslateblue          |   #483d8b   |
				:| darkslategray          |   #2f4f4f   |
				:| darkslategrey          |   #2f4f4f   |
				:| darkturquoise          |   #00ced1   |
				:| darkviolet             |   #9400d3   |
				:| deeppink               |   #ff1493   |
				:| deepskyblue            |   #00bfff   |
				:| dimgray                |   #696969   |
				:| dimgrey                |   #696969   |
				:| dodgerblue             |   #1e90ff   |
				:| firebrick              |   #b22222   |
				:| floralwhite            |   #fffaf0   |
				:| forestgreen            |   #228b22   |
				:| gainsboro              |   #dcdcdc   |
				:| ghostwhite             |   #f8f8ff   |
				:| gold                   |   #ffd700   |
				:| goldenrod              |   #daa520   |
				:| greenyellow            |   #adff2f   |
				:| grey                   |   #808080   |
				:| honeydew               |   #f0fff0   |
				:| hotpink                |   #ff69b4   |
				:| indianred              |   #cd5c5c   |
				:| indigo                 |   #4b0082   |
				:| ivory                  |   #fffff0   |
				:| khaki                  |   #f0e68c   |
				:| lavender               |   #e6e6fa   |
				:| lavenderblush          |   #fff0f5   |
				:| lawngreen              |   #7cfc00   |
				:| lemonchiffon           |   #fffacd   |
				:| lightblue              |   #add8e6   |
				:| lightcoral             |   #f08080   |
				:| lightcyan              |   #e0ffff   |
				:| lightgoldenrodyellow   |   #fafad2   |
				:| lightgray              |   #d3d3d3   |
				:| lightgreen             |   #90ee90   |
				:| lightgrey              |   #d3d3d3   |
				:| lightpink              |   #ffb6c1   |
				:| lightsalmon            |   #ffa07a   |
				:| lightseagreen          |   #20b2aa   |
				:| lightskyblue           |   #87cefa   |
				:| lightslategray         |   #778899   |
				:| lightslategrey         |   #778899   |
				:| lightsteelblue         |   #b0c4de   |
				:| lightyellow            |   #ffffe0   |
				:| limegreen              |   #32cd32   |
				:| linen                  |   #faf0e6   |
				:| magenta                |   #ff00ff   |
				:| mediumaquamarine       |   #66cdaa   |
				:| mediumblue             |   #0000cd   |
				:| mediumorchid           |   #ba55d3   |
				:| mediumpurple           |   #9370db   |
				:| mediumseagreen         |   #3cb371   |
				:| mediumslateblue        |   #7b68ee   |
				:| mediumspringgreen      |   #00fa9a   |
				:| mediumturquoise        |   #48d1cc   |
				:| mediumvioletred        |   #c71585   |
				:| midnightblue           |   #191970   |
				:| mintcream              |   #f5fffa   |
				:| mistyrose              |   #ffe4e1   |
				:| moccasin               |   #ffe4b5   |
				:| navajowhite            |   #ffdead   |
				:| oldlace                |   #fdf5e6   |
				:| olivedrab              |   #6b8e23   |
				:| orangered              |   #ff4500   |
				:| orchid                 |   #da70d6   |
				:| palegoldenrod          |   #eee8aa   |
				:| palegreen              |   #98fb98   |
				:| paleturquoise          |   #afeeee   |
				:| palevioletred          |   #db7093   |
				:| papayawhip             |   #ffefd5   |
				:| peachpuff              |   #ffdab9   |
				:| peru                   |   #cd853f   |
				:| pink                   |   #ffc0cb   |
				:| plum                   |   #dda0dd   |
				:| powderblue             |   #b0e0e6   |
				:| rosybrown              |   #bc8f8f   |
				:| royalblue              |   #4169e1   |
				:| saddlebrown            |   #8b4513   |
				:| salmon                 |   #fa8072   |
				:| sandybrown             |   #f4a460   |
				:| seagreen               |   #2e8b57   |
				:| seashell               |   #fff5ee   |
				:| sienna                 |   #a0522d   |
				:| skyblue                |   #87ceeb   |
				:| slateblue              |   #6a5acd   |
				:| slategray              |   #708090   |
				:| slategrey              |   #708090   |
				:| snow                   |   #fffafa   |
				:| springgreen            |   #00ff7f   |
				:| steelblue              |   #4682b4   |
				:| tan                    |   #d2b48c   |
				:| thistle                |   #d8bfd8   |
				:| tomato                 |   #ff6347   |
				:| turquoise              |   #40e0d0   |
				:| violet                 |   #ee82ee   |
				:| wheat                  |   #f5deb3   |
				:| whitesmoke             |   #f5f5f5   |
				:| yellowgreen            |   #9acd32   |
				.........................................
		*/
	}
});

