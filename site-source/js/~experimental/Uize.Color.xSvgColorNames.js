/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Color.xSvgColors Object Extension
|   /    / /    |    AUTHOR : Chris van Rensburg (http://www.tomkidding.com)
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=" LineCompacting="TRUE"*/

/*?
	Introduction
		This document describes the =Uize.Color.xSvgColors= module - an extension module that extends the =Uize.Color= object by adding SVG 1.0 / CSS 3 color definitions to the =Uize.Color.colors= object.

	Using the Colors
		When you extend the =Uize.Color= object using the =Uize.Color.xSvgColors= extension module, it will then be possible to use the names of the colors defined in this extension when creating instances of the =Uize.Color= object, or when setting the color of =Uize.Color= instances using the =from= instance method.

		EXAMPLE
		..............................................
		Uize.Color ('#ffebcd');
		Uize.Color ('BlanchedAlmond');
		Uize.Color (Uize.Color.colors.BlanchedAlmond);
		..............................................

		Each of the above three statements would create a new instance of the =Uize.Color= object initialized to the SVG color "BlanchedAlmond". And because the =Uize.Color= module is used by other modules, such as the =Uize.Fx= module, it is possible to use color names when specifying the values of color CSS style properties for fade effects, as in...

		.............................................................................
		Uize.Fx.fadeStyle ('myNodeId',{color:'DarkMagenta'},{color:'LavenderBlush'});
		.............................................................................
*/

Uize.module ({
	name:'Uize.Color.xSvgColors',
	builder:function (_Uize_Color) {
		_Uize_Color.defineColors ({
			AliceBlue:            15792383, // 0xf0f8ff
			AntiqueWhite:         16444375, // 0xfaebd7
			Aquamarine:            8388564, // 0x7fffd4
			Azure:                15794175, // 0xf0ffff
			Beige:                16119260, // 0xf5f5dc
			Bisque:               16770244, // 0xffe4c4
			BlanchedAlmond:       16772045, // 0xffebcd
			BlueViolet:            9055202, // 0x8a2be2
			Brown:                10824234, // 0xa52a2a
			BurlyWood:            14596231, // 0xdeb887
			CadetBlue:             6266528, // 0x5f9ea0
			Chartreuse:            8388352, // 0x7fff00
			Chocolate:            13789470, // 0xd2691e
			Coral:                16744272, // 0xff7f50
			CornflowerBlue:        6591981, // 0x6495ed
			CornSilk:             16775388, // 0xfff8dc
			Crimson:              14423100, // 0xdc143c
			Cyan:                    65535, // 0x00ffff
			DarkBlue:                  139, // 0x00008b
			DarkCyan:                35723, // 0x008b8b
			DarkGoldenrod:        12092939, // 0xb8860b
			DarkGray:             11119017, // 0xa9a9a9
			DarkGreen:               25600, // 0x006400
			DarkGrey:             11119017, // 0xa9a9a9
			DarkKhaki:            12433259, // 0xbdb76b
			DarkMagenta:           9109643, // 0x8b008b
			DarkOliveGreen:        5597999, // 0x556b2f
			DarkOrange:           16747520, // 0xff8c00
			DarkOrchid:           10040012, // 0x9932cc
			DarkRed:               9109504, // 0x8b0000
			DarkSalmon:           15308410, // 0xe9967a
			DarkSeaGreen:          9419919, // 0x8fbc8f
			DarkSlateBlue:         4734347, // 0x483d8b
			DarkSlateGray:         3100495, // 0x2f4f4f
			DarkSlateGrey:         3100495, // 0x2f4f4f
			DarkTurquoise:           52945, // 0x00ced1
			DarkViolet:            9699539, // 0x9400d3
			DeepPink:             16716947, // 0xff1493
			DeepSkyBlue:             49151, // 0x00bfff
			DimGray:               6908265, // 0x696969
			DimGrey:               6908265, // 0x696969
			DodgerBlue:            2003199, // 0x1e90ff
			FireBrick:            11674146, // 0xb22222
			FloralWhite:          16775920, // 0xfffaf0
			ForestGreen:           2263842, // 0x228b22
			Gainsboro:            14474460, // 0xdcdcdc
			GhostWhite:           16316671, // 0xf8f8ff
			Gold:                 16766720, // 0xffd700
			Goldenrod:            14329120, // 0xdaa520
			GreenYellow:          11403055, // 0xadff2f
			Grey:                  8421504, // 0x808080
			Honeydew:             15794160, // 0xf0fff0
			HotPink:              16738740, // 0xff69b4
			IndianRed:            13458524, // 0xcd5c5c
			Indigo:                4915330, // 0x4b0082
			Ivory:                16777200, // 0xfffff0
			Khaki:                15787660, // 0xf0e68c
			Lavender:             15132410, // 0xe6e6fa
			LavenderBlush:        16773365, // 0xfff0f5
			LawnGreen:             8190976, // 0x7cfc00
			LemonChiffon:         16775885, // 0xfffacd
			LightBlue:            11393254, // 0xadd8e6
			LightCoral:           15761536, // 0xf08080
			LightCyan:            14745599, // 0xe0ffff
			LightGoldenrodYellow: 16448210, // 0xfafad2
			LightGray:            13882323, // 0xd3d3d3
			LightGreen:            9498256, // 0x90ee90
			LightGrey:            13882323, // 0xd3d3d3
			LightPink:            16758465, // 0xffb6c1
			LightSalmon:          16752762, // 0xffa07a
			LightSeaGreen:         2142890, // 0x20b2aa
			LightSkyBlue:          8900346, // 0x87cefa
			LightSlateGray:        7833753, // 0x778899
			LightSlateGrey:        7833753, // 0x778899
			LightSteelBlue:       11584734, // 0xb0c4de
			LightYellow:          16777184, // 0xffffe0
			LimeGreen:             3329330, // 0x32cd32
			Linen:                16445670, // 0xfaf0e6
			Magenta:              16711935, // 0xff00ff
			MediumAquamarine:      6737322, // 0x66cdaa
			MediumBlue:                205, // 0x0000cd
			MediumOrchid:         12211667, // 0xba55d3
			MediumPurple:          9662683, // 0x9370db
			MediumSeaGreen:        3978097, // 0x3cb371
			MediumSlateBlue:       8087790, // 0x7b68ee
			MediumSpringGreen:       64154, // 0x00fa9a
			MediumTurquoise:       4772300, // 0x48d1cc
			MediumVioletRed:      13047173, // 0xc71585
			MidnightBlue:          1644912, // 0x191970
			MintCream:            16121850, // 0xf5fffa
			MistyRose:            16770273, // 0xffe4e1
			Moccasin:             16770229, // 0xffe4b5
			NavajoWhite:          16768685, // 0xffdead
			OldLace:              16643558, // 0xfdf5e6
			OliveDrab:             7048739, // 0x6b8e23
			OrangeRed:            16729344, // 0xff4500
			Orchid:               14315734, // 0xda70d6
			PaleGoldenrod:        15657130, // 0xeee8aa
			PaleGreen:            10025880, // 0x98fb98
			PaleTurquoise:        11529966, // 0xafeeee
			PaleVioletRed:        14381203, // 0xdb7093
			PapayaWhip:           16773077, // 0xffefd5
			PeachPuff:            16767673, // 0xffdab9
			Peru:                 13468991, // 0xcd853f
			Pink:                 16761035, // 0xffc0cb
			Plum:                 14524637, // 0xdda0dd
			PowderBlue:           11591910, // 0xb0e0e6
			RosyBrown:            12357519, // 0xbc8f8f
			RoyalBlue:             4286945, // 0x4169e1
			SaddleBrown:           9127187, // 0x8b4513
			Salmon:               16416882, // 0xfa8072
			SandyBrown:           16032864, // 0xf4a460
			SeaGreen:              3050327, // 0x2e8b57
			Seashell:             16774638, // 0xfff5ee
			Sienna:               10506797, // 0xa0522d
			SkyBlue:               8900331, // 0x87ceeb
			SlateBlue:             6970061, // 0x6a5acd
			SlateGray:             7372944, // 0x708090
			SlateGrey:             7372944, // 0x708090
			Snow:                 16775930, // 0xfffafa
			SpringGreen:             65407, // 0x00ff7f
			SteelBlue:             4620980, // 0x4682b4
			Tan:                  13808780, // 0xd2b48c
			Thistle:              14204888, // 0xd8bfd8
			Tomato:               16737095, // 0xff6347
			Turquoise:             4251856, // 0x40e0d0
			Violet:               15631086, // 0xee82ee
			Wheat:                16113331, // 0xf5deb3
			WhiteSmoke:           16119285, // 0xf5f5f5
			YellowGreen:          10145074  // 0x9acd32
		});
		/*?
			The SVG 1.0 Colors
				The =Uize.Color.xSvgColors= module defines over a hundred additional colors, as listed in the table below.

				This is in addition to the seventeen standard CSS 2.1 colors defined in the =Uize.Color= module, which are =white=, =silver=, =gray=, =black=, =navy=, =blue=, =aqua=, =teal=, =green=, =olive=, =lime=, =maroon=, =red=, =orange=, =yellow=, =purple=, and =fuchsia=.

				....................................
				COLOR NAME             |  HEX VALUE
				------------------------------------
				AliceBlue              |   #f0f8ff
				AntiqueWhite           |   #faebd7
				Aquamarine             |   #7fffd4
				Azure                  |   #f0ffff
				Beige                  |   #f5f5dc
				Bisque                 |   #ffe4c4
				BlanchedAlmond         |   #ffebcd
				BlueViolet             |   #8a2be2
				Brown                  |   #a52a2a
				BurlyWood              |   #deb887
				CadetBlue              |   #5f9ea0
				Chartreuse             |   #7fff00
				Chocolate              |   #d2691e
				Coral                  |   #ff7f50
				CornflowerBlue         |   #6495ed
				CornSilk               |   #fff8dc
				Crimson                |   #dc143c
				Cyan                   |   #00ffff
				DarkBlue               |   #00008b
				DarkCyan               |   #008b8b
				DarkGoldenrod          |   #b8860b
				DarkGray               |   #a9a9a9
				DarkGreen              |   #006400
				DarkGrey               |   #a9a9a9
				DarkKhaki              |   #bdb76b
				DarkMagenta            |   #8b008b
				DarkOliveGreen         |   #556b2f
				DarkOrange             |   #ff8c00
				DarkOrchid             |   #9932cc
				DarkRed                |   #8b0000
				DarkSalmon             |   #e9967a
				DarkSeaGreen           |   #8fbc8f
				DarkSlateBlue          |   #483d8b
				DarkSlateGray          |   #2f4f4f
				DarkSlateGrey          |   #2f4f4f
				DarkTurquoise          |   #00ced1
				DarkViolet             |   #9400d3
				DeepPink               |   #ff1493
				DeepSkyBlue            |   #00bfff
				DimGray                |   #696969
				DimGrey                |   #696969
				DodgerBlue             |   #1e90ff
				FireBrick              |   #b22222
				FloralWhite            |   #fffaf0
				ForestGreen            |   #228b22
				Gainsboro              |   #dcdcdc
				GhostWhite             |   #f8f8ff
				Gold                   |   #ffd700
				Goldenrod              |   #daa520
				GreenYellow            |   #adff2f
				Grey                   |   #808080
				Honeydew               |   #f0fff0
				HotPink                |   #ff69b4
				IndianRed              |   #cd5c5c
				Indigo                 |   #4b0082
				Ivory                  |   #fffff0
				Khaki                  |   #f0e68c
				Lavender               |   #e6e6fa
				LavenderBlush          |   #fff0f5
				LawnGreen              |   #7cfc00
				LemonChiffon           |   #fffacd
				LightBlue              |   #add8e6
				LightCoral             |   #f08080
				LightCyan              |   #e0ffff
				LightGoldenrodYellow   |   #fafad2
				LightGray              |   #d3d3d3
				LightGreen             |   #90ee90
				LightGrey              |   #d3d3d3
				LightPink              |   #ffb6c1
				LightSalmon            |   #ffa07a
				LightSeaGreen          |   #20b2aa
				LightSkyBlue           |   #87cefa
				LightSlateGray         |   #778899
				LightSlateGrey         |   #778899
				LightSteelBlue         |   #b0c4de
				LightYellow            |   #ffffe0
				LimeGreen              |   #32cd32
				Linen                  |   #faf0e6
				Magenta                |   #ff00ff
				MediumAquamarine       |   #66cdaa
				MediumBlue             |   #0000cd
				MediumOrchid           |   #ba55d3
				MediumPurple           |   #9370db
				MediumSeaGreen         |   #3cb371
				MediumSlateBlue        |   #7b68ee
				MediumSpringGreen      |   #00fa9a
				MediumTurquoise        |   #48d1cc
				MediumVioletRed        |   #c71585
				MidnightBlue           |   #191970
				MintCream              |   #f5fffa
				MistyRose              |   #ffe4e1
				Moccasin               |   #ffe4b5
				NavajoWhite            |   #ffdead
				OldLace                |   #fdf5e6
				OliveDrab              |   #6b8e23
				OrangeRed              |   #ff4500
				Orchid                 |   #da70d6
				PaleGoldenrod          |   #eee8aa
				PaleGreen              |   #98fb98
				PaleTurquoise          |   #afeeee
				PaleVioletRed          |   #db7093
				PapayaWhip             |   #ffefd5
				PeachPuff              |   #ffdab9
				Peru                   |   #cd853f
				Pink                   |   #ffc0cb
				Plum                   |   #dda0dd
				PowderBlue             |   #b0e0e6
				RosyBrown              |   #bc8f8f
				RoyalBlue              |   #4169e1
				SaddleBrown            |   #8b4513
				Salmon                 |   #fa8072
				SandyBrown             |   #f4a460
				SeaGreen               |   #2e8b57
				Seashell               |   #fff5ee
				Sienna                 |   #a0522d
				SkyBlue                |   #87ceeb
				SlateBlue              |   #6a5acd
				SlateGray              |   #708090
				SlateGrey              |   #708090
				Snow                   |   #fffafa
				SpringGreen            |   #00ff7f
				SteelBlue              |   #4682b4
				Tan                    |   #d2b48c
				Thistle                |   #d8bfd8
				Tomato                 |   #ff6347
				Turquoise              |   #40e0d0
				Violet                 |   #ee82ee
				Wheat                  |   #f5deb3
				WhiteSmoke             |   #f5f5f5
				YellowGreen            |   #9acd32
				..................................
		*/
	}
});

