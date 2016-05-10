/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Swap.Themes Class Extension
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widget.Swap.Themes= module defines themes for the =Uize.Widget.Swap= widget class.

		*DEVELOPERS:* `Chris van Rensburg`

		Using the Themes
			The =Uize.Widget.Swap.Themes= module returns an object, being a lookup of theme names to theme settings objects.

			Each property of the themes lookup object is an effect theme, where the name of the property is the effect theme name, and where the value is an object containing values for various state properties of the =Uize.Widget.Swap= class.

			Consider the value of the =fadeOutFadeIn= theme...

			............................
			{
				crossFade:true,
				crossFadeSize:0,
				crossFadeAlign:.5,
				dissolve:true,
				viewContentAlignX:'none',
				viewContentAlignY:'none',
				viewSeedSizeX:1,
				viewSeedSizeY:1,
				viewSeedAlignX:.5,
				viewSeedAlignY:.5
			}
			............................

			To use this theme, simply use it to set the state properties of the =Uize.Widget.Swap= instance using the =set= instance method, as follows...

			........................................
			var themes = Uize.Widget.Swap.Themes ();
			mySwap.set (themes.fadeOutFadeIn);
			........................................
*/

Uize.module ({
	name:'Uize.Widget.Swap.Themes',
	required:'Uize.Widget.Swap.ThemeValuePack',
	builder:function (_class) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_true = true,
				_false = false,
				_none = 'none'
		;

		return function () {
			return Uize.map (
				{
					crossFade:[
						/*         crossFade */ _false,
						/*     crossFadeSize */ 0,
						/*    crossFadeAlign */ .5,
						/*          dissolve */ _true,
						/* viewContentAlignX */ _none,
						/* viewContentAlignY */ _none,
						/*     viewSeedSizeX */ 1,
						/*     viewSeedSizeY */ 1,
						/*    viewSeedAlignX */ .5,
						/*    viewSeedAlignY */ .5
						/*?
							Themes
								crossFade
									A classic crossfade effect, where the new item fades in on top of the current item.
					*/
					],
					fadeOutFadeIn:[
						/*         crossFade */ _true,
						/*     crossFadeSize */ 0,
						/*    crossFadeAlign */ .5,
						/*          dissolve */ _true,
						/* viewContentAlignX */ _none,
						/* viewContentAlignY */ _none,
						/*     viewSeedSizeX */ 1,
						/*     viewSeedSizeY */ 1,
						/*    viewSeedAlignX */ .5,
						/*    viewSeedAlignY */ .5
						/*?
							Themes
								fadeOutFadeIn
									The current item fades out fully before the new item fades in. Fade out time for the current item and fade in time for the new item are equal and are both half the overal duration for the swap effect.
						*/
					],
					fadeOutPauseThenFadeIn:[
						/*         crossFade */ _true,
						/*     crossFadeSize */ -.5,
						/*    crossFadeAlign */ .1,
						/*          dissolve */ _true,
						/* viewContentAlignX */ _none,
						/* viewContentAlignY */ _none,
						/*     viewSeedSizeX */ 1,
						/*     viewSeedSizeY */ 1,
						/*    viewSeedAlignX */ 0,
						/*    viewSeedAlignY */ 0
						/*?
							Themes
								fadeOutPauseThenFadeIn
									The current item fades out very quickly, there is a slight pause, and then the new item fades in (slower than the fade out of the current item, but still 4/10 the overal duration for the swap effect).
						*/
					],
					fadeWipeFromLeft:[
						/*         crossFade */ _false,
						/*     crossFadeSize */ 0,
						/*    crossFadeAlign */ .5,
						/*          dissolve */ _true,
						/* viewContentAlignX */ _none,
						/* viewContentAlignY */ _none,
						/*     viewSeedSizeX */ 0,
						/*     viewSeedSizeY */ 1,
						/*    viewSeedAlignX */ 0,
						/*    viewSeedAlignY */ 0
						/*?
							Themes
								fadeWipeFromLeft
									The new item is revealed with a horizontal wipe reveal that starts from the left edge and that also fades in as it progresses.
						*/
					],
					fadeWipeFromRight:[
						/*         crossFade */ _false,
						/*     crossFadeSize */ 0,
						/*    crossFadeAlign */ .5,
						/*          dissolve */ _true,
						/* viewContentAlignX */ _none,
						/* viewContentAlignY */ _none,
						/*     viewSeedSizeX */ 0,
						/*     viewSeedSizeY */ 1,
						/*    viewSeedAlignX */ 1,
						/*    viewSeedAlignY */ 0
						/*?
							Themes
								fadeWipeFromRight
									The new item is revealed with a horizontal wipe reveal that starts from the right edge and that also fades in as it progresses.
						*/
					],
					fadeWipeHorizontalFromCenter:[
						/*         crossFade */ _false,
						/*     crossFadeSize */ 0,
						/*    crossFadeAlign */ .5,
						/*          dissolve */ _true,
						/* viewContentAlignX */ _none,
						/* viewContentAlignY */ _none,
						/*     viewSeedSizeX */ 0,
						/*     viewSeedSizeY */ 1,
						/*    viewSeedAlignX */ .5,
						/*    viewSeedAlignY */ 0
						/*?
							Themes
								fadeWipeHorizontalFromCenter
									The new item is revealed with a horizontal wipe reveal that starts from the center and that expands outwards towards the left and right edges and that also fades in as it progresses.
						*/
					],
					fadeWipeFromTop:[
						/*         crossFade */ _false,
						/*     crossFadeSize */ 0,
						/*    crossFadeAlign */ .5,
						/*          dissolve */ _true,
						/* viewContentAlignX */ _none,
						/* viewContentAlignY */ _none,
						/*     viewSeedSizeX */ 1,
						/*     viewSeedSizeY */ 0,
						/*    viewSeedAlignX */ 0,
						/*    viewSeedAlignY */ 0
						/*?
							Themes
								fadeWipeFromTop
									The new item is revealed with a horizontal wipe reveal that starts from the top edge and that also fades in as it progresses.
						*/
					],
					fadeWipeFromBottom:[
						/*         crossFade */ _false,
						/*     crossFadeSize */ 0,
						/*    crossFadeAlign */ .5,
						/*          dissolve */ _true,
						/* viewContentAlignX */ _none,
						/* viewContentAlignY */ _none,
						/*     viewSeedSizeX */ 1,
						/*     viewSeedSizeY */ 0,
						/*    viewSeedAlignX */ 0,
						/*    viewSeedAlignY */ 1
						/*?
							Themes
								fadeWipeFromBottom
									The new item is revealed with a horizontal wipe reveal that starts from the bottom edge and that also fades in as it progresses.
						*/
					],
					fadeWipeVerticalFromCenter:[
						/*         crossFade */ _false,
						/*     crossFadeSize */ 0,
						/*    crossFadeAlign */ .5,
						/*          dissolve */ _true,
						/* viewContentAlignX */ _none,
						/* viewContentAlignY */ _none,
						/*     viewSeedSizeX */ 1,
						/*     viewSeedSizeY */ 0,
						/*    viewSeedAlignX */ 0,
						/*    viewSeedAlignY */ .5
						/*?
							Themes
								fadeWipeVerticalFromCenter
									The new item is revealed with a vertical wipe reveal that starts from the center and that expands outwards towards the top and bottom edges and that also fades in as it progresses.
						*/
					],
					fadeSlideInFromLeft:[
						/*         crossFade */ _false,
						/*     crossFadeSize */ 0,
						/*    crossFadeAlign */ .5,
						/*          dissolve */ _true,
						/* viewContentAlignX */ 1,
						/* viewContentAlignY */ _none,
						/*     viewSeedSizeX */ 0,
						/*     viewSeedSizeY */ 1,
						/*    viewSeedAlignX */ 0,
						/*    viewSeedAlignY */ 0
						/*?
							Themes
								fadeSlideInFromLeft
									The new item slides in from the left edge and also fades in as it slides into place to eventually fully cover the current item.
						*/
					],
					fadeSlideInFromRight:[
						/*         crossFade */ _false,
						/*     crossFadeSize */ 0,
						/*    crossFadeAlign */ .5,
						/*          dissolve */ _true,
						/* viewContentAlignX */ 0,
						/* viewContentAlignY */ _none,
						/*     viewSeedSizeX */ 0,
						/*     viewSeedSizeY */ 1,
						/*    viewSeedAlignX */ 1,
						/*    viewSeedAlignY */ 0
						/*?
							Themes
								fadeSlideInFromRight
									The new item slides in from the right edge and also fades in as it slides into place to eventually fully cover the current item.
						*/
					],
					fadeSlideInFromTop:[
						/*         crossFade */ _false,
						/*     crossFadeSize */ 0,
						/*    crossFadeAlign */ .5,
						/*          dissolve */ _true,
						/* viewContentAlignX */ _none,
						/* viewContentAlignY */ 1,
						/*     viewSeedSizeX */ 1,
						/*     viewSeedSizeY */ 0,
						/*    viewSeedAlignX */ 0,
						/*    viewSeedAlignY */ 0
						/*?
							Themes
								fadeSlideInFromTop
									The new item slides in from the top edge and also fades in as it slides into place to eventually fully cover the current item.
						*/
					],
					fadeSlideInFromBottom:[
						/*         crossFade */ _false,
						/*     crossFadeSize */ 0,
						/*    crossFadeAlign */ .5,
						/*          dissolve */ _true,
						/* viewContentAlignX */ _none,
						/* viewContentAlignY */ 0,
						/*     viewSeedSizeX */ 1,
						/*     viewSeedSizeY */ 0,
						/*    viewSeedAlignX */ 0,
						/*    viewSeedAlignY */ 1
						/*?
							Themes
								fadeSlideInFromBottom
									The new item slides in from the bottom edge and also fades in as it slides into place to eventually fully cover the current item.
						*/
					],
					fadeSlideInFromTopLeft:[
						/*         crossFade */ _false,
						/*     crossFadeSize */ 0,
						/*    crossFadeAlign */ .5,
						/*          dissolve */ _true,
						/* viewContentAlignX */ 1,
						/* viewContentAlignY */ 1,
						/*     viewSeedSizeX */ 0,
						/*     viewSeedSizeY */ 0,
						/*    viewSeedAlignX */ 0,
						/*    viewSeedAlignY */ 0
						/*?
							Themes
								fadeSlideInFromTopLeft
									The new item slides in from the top left corner and also fades in as it slides into place to eventually fully cover the current item.
						*/
					],
					fadeSlideInFromTopRight:[
						/*         crossFade */ _false,
						/*     crossFadeSize */ 0,
						/*    crossFadeAlign */ .5,
						/*          dissolve */ _true,
						/* viewContentAlignX */ 0,
						/* viewContentAlignY */ 1,
						/*     viewSeedSizeX */ 0,
						/*     viewSeedSizeY */ 0,
						/*    viewSeedAlignX */ 1,
						/*    viewSeedAlignY */ 0
						/*?
							Themes
								fadeSlideInFromTopRight
									The new item slides in from the top right corner and also fades in as it slides into place to eventually fully cover the current item.
						*/
					],
					fadeSlideInFromBottomLeft:[
						/*         crossFade */ _false,
						/*     crossFadeSize */ 0,
						/*    crossFadeAlign */ .5,
						/*          dissolve */ _true,
						/* viewContentAlignX */ 1,
						/* viewContentAlignY */ 0,
						/*     viewSeedSizeX */ 0,
						/*     viewSeedSizeY */ 0,
						/*    viewSeedAlignX */ 0,
						/*    viewSeedAlignY */ 1
						/*?
							Themes
								fadeSlideInFromBottomLeft
									The new item slides in from the bottom left corner and also fades in as it slides into place to eventually fully cover the current item.
						*/
					],
					fadeSlideInFromBottomRight:[
						/*         crossFade */ _false,
						/*     crossFadeSize */ 0,
						/*    crossFadeAlign */ .5,
						/*          dissolve */ _true,
						/* viewContentAlignX */ 0,
						/* viewContentAlignY */ 0,
						/*     viewSeedSizeX */ 0,
						/*     viewSeedSizeY */ 0,
						/*    viewSeedAlignX */ 1,
						/*    viewSeedAlignY */ 1
						/*?
							Themes
								fadeSlideInFromBottomRight
									The new item slides in from the bottom right corner and also fades in as it slides into place to eventually fully cover the current item.
						*/
					],
					fadeSlideOutSlideInLeft:[
						/*         crossFade */ _true,
						/*     crossFadeSize */ 0,
						/*    crossFadeAlign */ .5,
						/*          dissolve */ _true,
						/* viewContentAlignX */ 1,
						/* viewContentAlignY */ _none,
						/*     viewSeedSizeX */ 0,
						/*     viewSeedSizeY */ 1,
						/*    viewSeedAlignX */ 0,
						/*    viewSeedAlignY */ 0
						/*?
							Themes
								fadeSlideOutSlideInLeft
									The current item slides out towards the left edge, fading out as it goes, and then the new item slides in from the left edge, fading in as it goes. Slide out time for the current item and slide in time for the new item are equal and are both half the overal duration for the swap effect.
						*/
					],
					fadeSlideOutSlideInRight:[
						/*         crossFade */ _true,
						/*     crossFadeSize */ 0,
						/*    crossFadeAlign */ .5,
						/*          dissolve */ _true,
						/* viewContentAlignX */ 0,
						/* viewContentAlignY */ _none,
						/*     viewSeedSizeX */ 0,
						/*     viewSeedSizeY */ 1,
						/*    viewSeedAlignX */ 1,
						/*    viewSeedAlignY */ 0
						/*?
							Themes
								fadeSlideOutSlideInRight
									The current item slides out towards the right edge, fading out as it goes, and then the new item slides in from the right edge, fading in as it goes. Slide out time for the current item and slide in time for the new item are equal and are both half the overal duration for the swap effect.
						*/
					],
					fadeSlideOutSlideInTop:[
						/*         crossFade */ _true,
						/*     crossFadeSize */ 0,
						/*    crossFadeAlign */ .5,
						/*          dissolve */ _true,
						/* viewContentAlignX */ _none,
						/* viewContentAlignY */ 1,
						/*     viewSeedSizeX */ 1,
						/*     viewSeedSizeY */ 0,
						/*    viewSeedAlignX */ 0,
						/*    viewSeedAlignY */ 0
						/*?
							Themes
								fadeSlideOutSlideInTop
									The current item slides out towards the top edge, fading out as it goes, and then the new item slides in from the top edge, fading in as it goes. Slide out time for the current item and slide in time for the new item are equal and are both half the overal duration for the swap effect.
						*/
					],
					fadeSlideOutSlideInBottom:[
						/*         crossFade */ _true,
						/*     crossFadeSize */ 0,
						/*    crossFadeAlign */ .5,
						/*          dissolve */ _true,
						/* viewContentAlignX */ _none,
						/* viewContentAlignY */ 0,
						/*     viewSeedSizeX */ 1,
						/*     viewSeedSizeY */ 0,
						/*    viewSeedAlignX */ 0,
						/*    viewSeedAlignY */ 1
						/*?
							Themes
								fadeSlideOutSlideInBottom
									The current item slides out towards the bottom edge, fading out as it goes, and then the new item slides in from the bottom edge, fading in as it goes. Slide out time for the current item and slide in time for the new item are equal and are both half the overal duration for the swap effect.
						*/
					],
					fadeSlideOutSlideInTopLeft:[
						/*         crossFade */ _true,
						/*     crossFadeSize */ 0,
						/*    crossFadeAlign */ .5,
						/*          dissolve */ _true,
						/* viewContentAlignX */ 1,
						/* viewContentAlignY */ 1,
						/*     viewSeedSizeX */ 0,
						/*     viewSeedSizeY */ 0,
						/*    viewSeedAlignX */ 0,
						/*    viewSeedAlignY */ 0
						/*?
							Themes
								fadeSlideOutSlideInTopLeft
									The current item slides out towards the top left corner, fading out as it goes, and then the new item slides in from the top left corner, fading in as it goes. Slide out time for the current item and slide in time for the new item are equal and are both half the overal duration for the swap effect.
						*/
					],
					fadeSlideOutSlideInTopRight:[
						/*         crossFade */ _true,
						/*     crossFadeSize */ 0,
						/*    crossFadeAlign */ .5,
						/*          dissolve */ _true,
						/* viewContentAlignX */ 0,
						/* viewContentAlignY */ 1,
						/*     viewSeedSizeX */ 0,
						/*     viewSeedSizeY */ 0,
						/*    viewSeedAlignX */ 1,
						/*    viewSeedAlignY */ 0
						/*?
							Themes
								fadeSlideOutSlideInTopRight
									The current item slides out towards the top right corner, fading out as it goes, and then the new item slides in from the top right corner, fading in as it goes. Slide out time for the current item and slide in time for the new item are equal and are both half the overal duration for the swap effect.
						*/
					],
					fadeSlideOutSlideInBottomLeft:[
						/*         crossFade */ _true,
						/*     crossFadeSize */ 0,
						/*    crossFadeAlign */ .5,
						/*          dissolve */ _true,
						/* viewContentAlignX */ 1,
						/* viewContentAlignY */ 0,
						/*     viewSeedSizeX */ 0,
						/*     viewSeedSizeY */ 0,
						/*    viewSeedAlignX */ 0,
						/*    viewSeedAlignY */ 1
						/*?
							Themes
								fadeSlideOutSlideInBottomLeft
									The current item slides out towards the bottom left corner, fading out as it goes, and then the new item slides in from the bottom left corner, fading in as it goes. Slide out time for the current item and slide in time for the new item are equal and are both half the overal duration for the swap effect.
						*/
					],
					fadeSlideOutSlideInBottomRight:[
						/*         crossFade */ _true,
						/*     crossFadeSize */ 0,
						/*    crossFadeAlign */ .5,
						/*          dissolve */ _true,
						/* viewContentAlignX */ 0,
						/* viewContentAlignY */ 0,
						/*     viewSeedSizeX */ 0,
						/*     viewSeedSizeY */ 0,
						/*    viewSeedAlignX */ 1,
						/*    viewSeedAlignY */ 1
						/*?
							Themes
								fadeSlideOutSlideInBottomRight
									The current item slides out towards the bottom right corner, fading out as it goes, and then the new item slides in from the bottom right corner, fading in as it goes. Slide out time for the current item and slide in time for the new item are equal and are both half the overal duration for the swap effect.
						*/
					],
					wipeOutWipeInLeft:[
						/*         crossFade */ _true,
						/*     crossFadeSize */ 0,
						/*    crossFadeAlign */ .5,
						/*          dissolve */ _false,
						/* viewContentAlignX */ _none,
						/* viewContentAlignY */ _none,
						/*     viewSeedSizeX */ 0,
						/*     viewSeedSizeY */ 1,
						/*    viewSeedAlignX */ 0,
						/*    viewSeedAlignY */ 0
						/*?
							Themes
								wipeOutWipeInLeft
									The current item wipes out towards the left edge, and then the new item wipes in from the left edge. Wipe out time for the current item and wipe in time for the new item are equal and are both half the overal duration for the swap effect.
						*/
					],
					wipeOutWipeInRight:[
						/*         crossFade */ _true,
						/*     crossFadeSize */ 0,
						/*    crossFadeAlign */ .5,
						/*          dissolve */ _false,
						/* viewContentAlignX */ _none,
						/* viewContentAlignY */ _none,
						/*     viewSeedSizeX */ 0,
						/*     viewSeedSizeY */ 1,
						/*    viewSeedAlignX */ 1,
						/*    viewSeedAlignY */ 0
						/*?
							Themes
								wipeOutWipeInRight
									The current item wipes out towards the right edge, and then the new item wipes in from the right edge. Wipe out time for the current item and wipe in time for the new item are equal and are both half the overal duration for the swap effect.
						*/
					],
					wipeOutWipeInTop:[
						/*         crossFade */ _true,
						/*     crossFadeSize */ 0,
						/*    crossFadeAlign */ .5,
						/*          dissolve */ _false,
						/* viewContentAlignX */ _none,
						/* viewContentAlignY */ _none,
						/*     viewSeedSizeX */ 1,
						/*     viewSeedSizeY */ 0,
						/*    viewSeedAlignX */ 0,
						/*    viewSeedAlignY */ 0
						/*?
							Themes
								wipeOutWipeInTop
									The current item wipes out towards the top edge, and then the new item wipes in from the top edge. Wipe out time for the current item and wipe in time for the new item are equal and are both half the overal duration for the swap effect.
						*/
					],
					wipeOutWipeInBottom:[
						/*         crossFade */ _true,
						/*     crossFadeSize */ 0,
						/*    crossFadeAlign */ .5,
						/*          dissolve */ _false,
						/* viewContentAlignX */ _none,
						/* viewContentAlignY */ _none,
						/*     viewSeedSizeX */ 1,
						/*     viewSeedSizeY */ 0,
						/*    viewSeedAlignX */ 0,
						/*    viewSeedAlignY */ 1
						/*?
							Themes
								wipeOutWipeInBottom
									The current item wipes out towards the bottom edge, and then the new item wipes in from the bottom edge. Wipe out time for the current item and wipe in time for the new item are equal and are both half the overal duration for the swap effect.
						*/
					],
					wipeOutWipeInTopLeft:[
						/*         crossFade */ _true,
						/*     crossFadeSize */ 0,
						/*    crossFadeAlign */ .5,
						/*          dissolve */ _false,
						/* viewContentAlignX */ _none,
						/* viewContentAlignY */ _none,
						/*     viewSeedSizeX */ 0,
						/*     viewSeedSizeY */ 0,
						/*    viewSeedAlignX */ 0,
						/*    viewSeedAlignY */ 0
						/*?
							Themes
								wipeOutWipeInTopLeft
									The current item wipes out towards the top left corner, and then the new item wipes in from the top left corner. Wipe out time for the current item and wipe in time for the new item are equal and are both half the overal duration for the swap effect.
						*/
					],
					wipeOutWipeInTopRight:[
						/*         crossFade */ _true,
						/*     crossFadeSize */ 0,
						/*    crossFadeAlign */ .5,
						/*          dissolve */ _false,
						/* viewContentAlignX */ _none,
						/* viewContentAlignY */ _none,
						/*     viewSeedSizeX */ 0,
						/*     viewSeedSizeY */ 0,
						/*    viewSeedAlignX */ 1,
						/*    viewSeedAlignY */ 0
						/*?
							Themes
								wipeOutWipeInTopRight
									The current item wipes out towards the top right corner, and then the new item wipes in from the top right corner. Wipe out time for the current item and wipe in time for the new item are equal and are both half the overal duration for the swap effect.
						*/
					],
					wipeOutWipeInBottomLeft:[
						/*         crossFade */ _true,
						/*     crossFadeSize */ 0,
						/*    crossFadeAlign */ .5,
						/*          dissolve */ _false,
						/* viewContentAlignX */ _none,
						/* viewContentAlignY */ _none,
						/*     viewSeedSizeX */ 0,
						/*     viewSeedSizeY */ 0,
						/*    viewSeedAlignX */ 0,
						/*    viewSeedAlignY */ 1
						/*?
							Themes
								wipeOutWipeInBottomLeft
									The current item wipes out towards the bottom left corner, and then the new item wipes in from the bottom left corner. Wipe out time for the current item and wipe in time for the new item are equal and are both half the overal duration for the swap effect.
						*/
					],
					wipeOutWipeInBottomRight:[
						/*         crossFade */ _true,
						/*     crossFadeSize */ 0,
						/*    crossFadeAlign */ .5,
						/*          dissolve */ _false,
						/* viewContentAlignX */ _none,
						/* viewContentAlignY */ _none,
						/*     viewSeedSizeX */ 0,
						/*     viewSeedSizeY */ 0,
						/*    viewSeedAlignX */ 1,
						/*    viewSeedAlignY */ 1
						/*?
							Themes
								wipeOutWipeInBottomRight
									The current item wipes out towards the bottom right corner, and then the new item wipes in from the bottom right corner. Wipe out time for the current item and wipe in time for the new item are equal and are both half the overal duration for the swap effect.
						*/
					],
					wipeOutWipeInHorizontalCenter:[
						/*         crossFade */ _true,
						/*     crossFadeSize */ 0,
						/*    crossFadeAlign */ .5,
						/*          dissolve */ _false,
						/* viewContentAlignX */ _none,
						/* viewContentAlignY */ _none,
						/*     viewSeedSizeX */ 0,
						/*     viewSeedSizeY */ 1,
						/*    viewSeedAlignX */ .5,
						/*    viewSeedAlignY */ 0
						/*?
							Themes
								wipeOutWipeInHorizontalCenter
									The current item wipes out horizontally from the left and right edges towards a sliver in the center, and then the new item wipes in horizontally from the same sliver in the center and expands outwards towards the left and right edges.
						*/
					],
					wipeOutWipeInVerticalCenter:[
						/*         crossFade */ _true,
						/*     crossFadeSize */ 0,
						/*    crossFadeAlign */ .5,
						/*          dissolve */ _false,
						/* viewContentAlignX */ _none,
						/* viewContentAlignY */ _none,
						/*     viewSeedSizeX */ 1,
						/*     viewSeedSizeY */ 0,
						/*    viewSeedAlignX */ 0,
						/*    viewSeedAlignY */ .5
						/*?
							Themes
								wipeOutWipeInVerticalCenter
									The current item wipes out vertically from the top and bottom edges towards a sliver in the center, and then the new item wipes in vertically from the same sliver in the center and expands outwards towards the top and bottom edges.
						*/
					],
					horizontalCrossSlideFromLeft:[
						/*         crossFade */ _true,
						/*     crossFadeSize */ 1,
						/*    crossFadeAlign */ 0,
						/*          dissolve */ _false,
						/* viewContentAlignX */ 1,
						/* viewContentAlignY */ _none,
						/*     viewSeedSizeX */ 0,
						/*     viewSeedSizeY */ 1,
						/*    viewSeedAlignX */ .5,
						/*    viewSeedAlignY */ 1
						/*?
							Themes
								horizontalCrossSlideFromLeft
									The new item slides in horizontally from the center towards the right edge at the same as it grows from a sliver to occupy the entire port, while the current item slides out towards the left edge as it shrinks down to a sliver, crossing paths as they go to produce a kind of sliding doors illusion.
						*/
					],
					horizontalCrossSlideFromRight:[
						/*         crossFade */ _true,
						/*     crossFadeSize */ 1,
						/*    crossFadeAlign */ 0,
						/*          dissolve */ _false,
						/* viewContentAlignX */ 0,
						/* viewContentAlignY */ _none,
						/*     viewSeedSizeX */ 0,
						/*     viewSeedSizeY */ 1,
						/*    viewSeedAlignX */ .5,
						/*    viewSeedAlignY */ 1
						/*?
							Themes
								horizontalCrossSlideFromRight
									The new item slides in horizontally from the center towards the left edge at the same as it grows from a sliver to occupy the entire port, while the current item slides out towards the right edge as it shrinks down to a sliver, crossing paths as they go to produce a kind of sliding doors illusion.
						*/
					],
					verticalCrossSlideFromTop:[
						/*         crossFade */ _true,
						/*     crossFadeSize */ 1,
						/*    crossFadeAlign */ 0,
						/*          dissolve */ _false,
						/* viewContentAlignX */ _none,
						/* viewContentAlignY */ 1,
						/*     viewSeedSizeX */ 1,
						/*     viewSeedSizeY */ 0,
						/*    viewSeedAlignX */ 1,
						/*    viewSeedAlignY */ .5
						/*?
							Themes
								verticalCrossSlideFromTop
									The new item slides in vertically from the center towards the bottom edge at the same as it grows from a sliver to occupy the entire port, while the current item slides out towards the top edge as it shrinks down to a sliver, crossing paths as they go to produce a kind of sliding doors illusion.
						*/
					],
					verticalCrossSlideFromBottom:[
						/*         crossFade */ _true,
						/*     crossFadeSize */ 1,
						/*    crossFadeAlign */ 0,
						/*          dissolve */ _false,
						/* viewContentAlignX */ _none,
						/* viewContentAlignY */ 0,
						/*     viewSeedSizeX */ 1,
						/*     viewSeedSizeY */ 0,
						/*    viewSeedAlignX */ 1,
						/*    viewSeedAlignY */ .5
						/*?
							Themes
								verticalCrossSlideFromBottom
									The new item slides in vertically from the center towards the top edge at the same as it grows from a sliver to occupy the entire port, while the current item slides out towards the bottom edge as it shrinks down to a sliver, crossing paths as they go to produce a kind of sliding doors illusion.
						*/
					],
					closeToCenterOpenFromCenter:[
						/*         crossFade */ _true,
						/*     crossFadeSize */ 0,
						/*    crossFadeAlign */ .5,
						/*          dissolve */ _false,
						/* viewContentAlignX */ _none,
						/* viewContentAlignY */ _none,
						/*     viewSeedSizeX */ 0,
						/*     viewSeedSizeY */ 0,
						/*    viewSeedAlignX */ .5,
						/*    viewSeedAlignY */ .5
						/*?
							Themes
								closeToCenterOpenFromCenter
									The current item wipes out to a point in the center, and then the new item wipes in from the same point in the center. Wipe out time for the current item and wipe in time for the new item are equal and are both half the overal duration for the swap effect.
						*/
					],
					poofPauseThenOpenFromCenter:[
						/*         crossFade */ _true,
						/*     crossFadeSize */ -.4,
						/*    crossFadeAlign */ .15,
						/*          dissolve */ _true,
						/* viewContentAlignX */ _none,
						/* viewContentAlignY */ _none,
						/*     viewSeedSizeX */ .25,
						/*     viewSeedSizeY */ 0,
						/*    viewSeedAlignX */ .5,
						/*    viewSeedAlignY */ .5
						/*?
							Themes
								poofPauseThenOpenFromCenter
									The current item wipes out very quickly to a point in the center, fading out as it progresses, then there is a slight pause, and then the new item wipes in from the same point in the center (slower than the wipe out of the current item, but still less than half the overal duration for the swap effect), fading in as it progresses.
						*/
					],
					centerOpenCloseCrossFade:[
						/*         crossFade */ _true,
						/*     crossFadeSize */ .75,
						/*    crossFadeAlign */ .25,
						/*          dissolve */ _true,
						/* viewContentAlignX */ _none,
						/* viewContentAlignY */ _none,
						/*     viewSeedSizeX */ 0,
						/*     viewSeedSizeY */ 0,
						/*    viewSeedAlignX */ .5,
						/*    viewSeedAlignY */ .5
						/*?
							Themes
								centerOpenCloseCrossFade
									The current item wipes out to a point in the center, fading out as it progresses, at the same time as the new item wipes in from the same point in the center, fading in as it progresses. The wipe out and wipe in cross over each other, producing a pleasing effect.
						*/
					]
				},
				Uize.Widget.Swap.ThemeValuePack.from
			);
		};
	}
});

