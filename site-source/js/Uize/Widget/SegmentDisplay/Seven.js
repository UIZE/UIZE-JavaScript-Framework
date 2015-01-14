/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.SegmentDisplay.Seven Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	docCompleteness: 1
*/

/*?
	Introduction
		The =Uize.Widget.SegmentDisplay.Seven= class implements a seven segment display widget, much like the classic LED or LCD digit displays on calculators.

		*DEVELOPERS:* `Chris van Rensburg`

		###
			http://en.wikipedia.org/wiki/Seven-segment_display
			(for sixteen segment display: http://www.optotek.com/ledimage/azonix.gif)

		Segments Map
			The segments of the seven segment display are arranged as shown in the diagram below...

			..............................
			  ____A/6____
			 |           |
			 |           |      CODE | bit
			F/1         B/5       A  |  6
			 |           |        B  |  5
			 |____G/0____|        C  |  4
			 |           |        D  |  3
			 |           |        E  |  2
			E/2         C/4       F  |  1
			 |           |        G  |  0
			 |____D/3____|
			..............................
*/

Uize.module ({
	name:'Uize.Widget.SegmentDisplay.Seven',
	builder:function (_superclass) {
		'use strict';

		var _class = _superclass.subclass ();

		/*** Set Values for Public Static Properties ***/
			_class.configureDisplay (
				['A','B','C','D','E','F','G'],
				{
					//          ABCDEFG (binary)
					' ':0,   // 0000000
					0:126,   // 1111110
					1:6,     // 0000110
					2:109,   // 1101101
					3:121,   // 1111001
					4:51,    // 0110011
					5:91,    // 1011011
					6:95,    // 1011111
					7:112,   // 1110000
					8:127,   // 1111111
					9:123,   // 1111011
					A:119,   // 1110111
					C:78,    // 1001110
					E:79,    // 1001111
					F:71,    // 1000111
					G:94,    // 1011110
					H:55,    // 0110111
					J:60,    // 0111100
					L:14,    // 0001110
					N:118,   // 1110110
					P:103,   // 1100111
					U:62,    // 0111110
					Y:59,    // 0111011
					a:125,   // 1111101
					b:31,    // 0011111
					c:13,    // 0001101
					d:61,    // 0111101
					e:111,   // 1101111
					h:23,    // 0010111
					i:4,     // 0000100
					j:56,    // 0111000
					l:48,    // 0110000
					n:21,    // 0010101
					o:29,    // 0011101
					q:115,   // 1110011
					r:5,     // 0000101
					t:15,    // 0001111
					u:28,    // 0011100
					'-':1,   // 0000001
					'=':9,   // 0001001
					'_':8,   // 0001000
					'/':37,  // 0100101
					'\\':19, // 0010011
					']':120  // 1111000
				}
			);

		return _class;
	}
});

