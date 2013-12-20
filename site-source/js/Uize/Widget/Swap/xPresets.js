/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Swap.xPresets Class Extension
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2013 UIZE
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
		The =Uize.Widget.Swap.xPresets= module extends the =Uize.Widget.Swap= class by adding a wide assortment of very imaginative swap animation effect presets.

		*DEVELOPERS:* `Chris van Rensburg`

		Using the Presets
			The =Uize.Widget.Swap.xPresets= module exposes its swap effect presets through the =Uize.Widget.Swap.presets= static property.

			Each property of the =Uize.Widget.Swap.presets= object is a swap effect preset, where the name of the property is the effect preset name, and where the value is an object containing values for various state properties of the =Uize.Widget.Swap= class.

			Consider the value of the =Uize.Widget.Swap.presets.fadeOutFadeIn= preset...

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

			To use this preset, simply use it to set the state properties of an instance of a =Uize.Widget.Swap= subclass using the =set= instance method, as follows...

			.........................................................
			myImageSwap.set (Uize.Widget.Swap.presets.fadeOutFadeIn);
			.........................................................

			In the above example, =myImageSwap= is an instance of the =Uize.Widget.Swap.Image= class, which is a subclass of the =Uize.Widget.Swap= class.
*/

Uize.module ({
	name:'Uize.Widget.Swap.xPresets',
	builder:function (_class) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false,
				_none = 'none'
			;

		/*** Public Static Properties ***/
			var
				_presetTables = {
					/*?
						Static Properties
							Uize.Widget.Swap.presets
								An object, containing a wide variety of interesting swap effect presets.

								The full list of swap preset effects is listed below...
					*/
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.crossFade
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.fadeOutFadeIn
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.fadeOutPauseThenFadeIn
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.fadeWipeFromLeft
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.fadeWipeFromRight
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.fadeWipeHorizontalFromCenter
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.fadeWipeFromTop
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.fadeWipeFromBottom
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.fadeWipeVerticalFromCenter
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.fadeSlideInFromLeft
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.fadeSlideInFromRight
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.fadeSlideInFromTop
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.fadeSlideInFromBottom
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.fadeSlideInFromTopLeft
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.fadeSlideInFromTopRight
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.fadeSlideInFromBottomLeft
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.fadeSlideInFromBottomRight
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.fadeSlideOutSlideInLeft
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.fadeSlideOutSlideInRight
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.fadeSlideOutSlideInTop
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.fadeSlideOutSlideInBottom
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.fadeSlideOutSlideInTopLeft
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.fadeSlideOutSlideInTopRight
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.fadeSlideOutSlideInBottomLeft
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.fadeSlideOutSlideInBottomRight
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.wipeOutWipeInLeft
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.wipeOutWipeInRight
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.wipeOutWipeInTop
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.wipeOutWipeInBottom
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.wipeOutWipeInTopLeft
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.wipeOutWipeInTopRight
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.wipeOutWipeInBottomLeft
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.wipeOutWipeInBottomRight
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.wipeOutWipeInHorizontalCenter
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.wipeOutWipeInVerticalCenter
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.horizontalCrossSlideFromLeft
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.horizontalCrossSlideFromRight
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.verticalCrossSlideFromTop
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.verticalCrossSlideFromBottom
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.closeToCenterOpenFromCenter
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.poofPauseThenOpenFromCenter
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
							Static Properties
								Uize.Widget.Swap.presets
									Uize.Widget.Swap.presets.centerOpenCloseCrossFade
										The current item wipes out to a point in the center, fading out as it progresses, at the same time as the new item wipes in from the same point in the center, fading in as it progresses. The wipe out and wipe in cross over each other, producing a pleasing effect.
						*/
					]
				},
				_presets = _class.presets = {}
			;

			/*** build preset objects from compact tables ***/
				for (var _presetName in _presetTables) {
					var _presetTable = _presetTables [_presetName];
					_presets [_presetName] = {
						crossFade:_presetTable [0],
						crossFadeSize:_presetTable [1],
						crossFadeAlign:_presetTable [2],
						dissolve:_presetTable [3],
						viewContentAlignX:_presetTable [4],
						viewContentAlignY:_presetTable [5],
						viewSeedSizeX:_presetTable [6],
						viewSeedSizeY:_presetTable [7],
						viewSeedAlignX:_presetTable [8],
						viewSeedAlignY:_presetTable [9]
					};
				}
	}
});

