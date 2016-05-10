/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.ImageWipe.Themes Class Extension
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2016 UIZE
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
		The =Uize.Widget.ImageWipe.Themes= module defines themes for the =Uize.Widget.ImageWipe= widget class.

		*DEVELOPERS:* `Chris van Rensburg`

		Using the Themes
			The =Uize.Widget.ImageWipe.Themes= module returns an object, being a lookup of theme names to theme settings objects.

			Each property of the themes lookup object is an effect theme, where the name of the property is the effect theme name, and where the value is an object containing values for various state properties of the =Uize.Widget.ImageWipe= class.

			Consider the value of the =facetedFade= theme...

			.......................................................................
			{
				allToFull : 50,
				duration : 3000,
				dissolve : true,
				divisionsX : 4,
				divisionsY : 4,
				firstPaneSizeX : 300,
				firstPaneSizeY : 0,
				alignX : {start:0,end:1,keyedTo:'pane',wraps:5,wrapMode:'triangle'},
				alignY : {start:0,end:1,keyedTo:'pane',wraps:7,wrapMode:'triangle'},
				paneSeedSizeX : 50,
				paneSeedSizeY : 100,
				paneSeedContext : 100,
				paneProgressDelay : 10,
				paneOrderScheme : 'jumbled'
			}
			.......................................................................

			To use this theme, simply use it to set the state properties of the =Uize.Widget.ImageWipe= instance using the =set= instance method, as follows...

			.............................................
			var themes = Uize.Widget.ImageWipe.Themes ();
			myImageWipe.set (themes.facetedFade);
			.............................................
*/

Uize.module ({
	name:'Uize.Widget.ImageWipe.Themes',
	required:'Uize.Widget.ImageWipe.ThemeValuePack',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_true = true,
				_false = false,
				_outsideIn = 'outside in',
				_insideOut = 'inside out',
				_normal = 'normal',
				_reverse = 'reverse',
				_duration2000 = 2000,
				_duration3000 = 3000,
				_start0End1KeyedToRow = {start:0,end:1,keyedTo:'row'},
				_start0End1KeyedToPane = {start:0,end:1,keyedTo:'pane'},
				_start1End0KeyedToPane = {start:1,end:0,keyedTo:'pane'},
				_start1EndPoint5KeyedToPane = {start:1,end:.5,keyedTo:'pane'}
		;

		return function () {
			return Uize.map (
				{
					blindsVerticalFromOutside:[
						/*         allToFull */ 0,
						/*          duration */ _duration3000,
						/*          dissolve */ _false,
						/*        divisionsX */ 16,
						/*        divisionsY */ 1,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ _start0End1KeyedToPane,
						/*            alignY */ 0,
						/*     paneSeedSizeX */ 0,
						/*     paneSeedSizeY */ 100,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 10,
						/*   paneOrderScheme */ _outsideIn
						/*?
							Themes
								blindsVerticalFromOutside
									Vertical blinds that start out from the left and right edges and close progressively towards the center. All blinds from left to right are the same width.
						*/
					],
					blindsVerticalFromInside:[
						/*         allToFull */ 0,
						/*          duration */ _duration3000,
						/*          dissolve */ _false,
						/*        divisionsX */ 16,
						/*        divisionsY */ 1,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ _start1End0KeyedToPane,
						/*            alignY */ 0,
						/*     paneSeedSizeX */ 0,
						/*     paneSeedSizeY */ 100,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 10,
						/*   paneOrderScheme */ _insideOut
						/*?
							Themes
								blindsVerticalFromInside
									Vertical blinds that start out from the center and close progressively towards the left and right edges. All blinds from left to right are the same width.
						*/
					],
					blindsVerticalFromLeft:[
						/*         allToFull */ 0,
						/*          duration */ _duration3000,
						/*          dissolve */ _false,
						/*        divisionsX */ 16,
						/*        divisionsY */ 1,
						/*    firstPaneSizeX */ 10,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ _start1EndPoint5KeyedToPane,
						/*            alignY */ 0,
						/*     paneSeedSizeX */ 0,
						/*     paneSeedSizeY */ 100,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 10,
						/*   paneOrderScheme */ _normal
						/*?
							Themes
								blindsVerticalFromLeft
									Vertical blinds that start out from the left edge and close progressively towards the right edge. Blinds start out narrow from the left edge and grow in width towards the right edge.
						*/
					],
					blindsVerticalFromRight:[
						/*         allToFull */ 0,
						/*          duration */ _duration3000,
						/*          dissolve */ _false,
						/*        divisionsX */ 16,
						/*        divisionsY */ 1,
						/*    firstPaneSizeX */ 10,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ _start1EndPoint5KeyedToPane,
						/*            alignY */ 0,
						/*     paneSeedSizeX */ 0,
						/*     paneSeedSizeY */ 100,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 10,
						/*   paneOrderScheme */ _reverse
						/*?
							Themes
								blindsVerticalFromRight
									Vertical blinds that start out from the right edge and close progressively towards the left edge. Blinds start out wide from the right edge and shrink in width towards the left edge.
						*/
					],
					blindsVerticalFromRightEven:[
						/*         allToFull */ 0,
						/*          duration */ _duration3000,
						/*          dissolve */ _false,
						/*        divisionsX */ 16,
						/*        divisionsY */ 1,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ _start0End1KeyedToPane,
						/*            alignY */ 0,
						/*     paneSeedSizeX */ 0,
						/*     paneSeedSizeY */ 100,
						/*   paneSeedContext */ 100,
						/* paneProgressDelay */ 15,
						/*   paneOrderScheme */ _reverse
						/*?
							Themes
								blindsVerticalFromRightEven
									Vertical blinds that start out from the right edge and close progressively towards the left edge. All blinds from left to right are the same width, but they reveal from right-to-left at the right edge and progressively shift over - from right to left - so that they reveal from left-to-right at the left edge.
						*/
					],
					blindsVerticalBackSlash:[
						/*         allToFull */ 0,
						/*          duration */ 2500,
						/*          dissolve */ _false,
						/*        divisionsX */ 16,
						/*        divisionsY */ 1,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ _start0End1KeyedToPane,
						/*            alignY */ _start0End1KeyedToPane,
						/*     paneSeedSizeX */ 0,
						/*     paneSeedSizeY */ 0,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 0,
						/*   paneOrderScheme */ _normal
						/*?
							Themes
								blindsVerticalBackSlash
									Vertical blinds that originate along a diagonal backslash arrangment, where the blind at the left edge reveals from the top and the blind at the right edge reveals from the bottom, and blinds inbetween originate along a diagonal line that spans from top left to bottom right. All blinds from left to right are the same width.
						*/
					],
					blindsVerticalForwardSlash:[
						/*         allToFull */ 0,
						/*          duration */ 2500,
						/*          dissolve */ _false,
						/*        divisionsX */ 16,
						/*        divisionsY */ 1,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ _start0End1KeyedToPane,
						/*            alignY */ _start1End0KeyedToPane,
						/*     paneSeedSizeX */ 0,
						/*     paneSeedSizeY */ 0,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 0,
						/*   paneOrderScheme */ _normal
						/*?
							Themes
								blindsVerticalForwardSlash
									Vertical blinds that originate along a diagonal forward slash arrangment, where the blind at the left edge reveals from the bottom and the blind at the right edge reveals from the top, and blinds inbetween originate along a diagonal line that spans from bottom left to top right. All blinds from left to right are the same width.
						*/
					],
					blindsVerticalArrowLeft:[
						/*         allToFull */ 0,
						/*          duration */ _duration3000,
						/*          dissolve */ _false,
						/*        divisionsX */ 16,
						/*        divisionsY */ 1,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ 1,
						/*            alignY */ .5,
						/*     paneSeedSizeX */ 0,
						/*     paneSeedSizeY */ 0,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 10,
						/*   paneOrderScheme */ _reverse
						/*?
							Themes
								blindsVerticalArrowLeft
									Vertical blinds that originate from the right edge in an arrow formation pointing to the left and that close progressively towards the left edge. All blinds from left to right are the same width.
						*/
					],
					blindsVerticalArrowRight:[
						/*         allToFull */ 0,
						/*          duration */ _duration3000,
						/*          dissolve */ _false,
						/*        divisionsX */ 16,
						/*        divisionsY */ 1,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ 0,
						/*            alignY */ .5,
						/*     paneSeedSizeX */ 0,
						/*     paneSeedSizeY */ 0,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 10,
						/*   paneOrderScheme */ _normal
						/*?
							Themes
								blindsVerticalArrowRight
									Vertical blinds that originate from the left edge in an arrow formation pointing to the right and that close progressively towards the right edge. All blinds from left to right are the same width.
						*/
					],
					blindsVerticalZoom:[
						/*         allToFull */ 0,
						/*          duration */ _duration2000,
						/*          dissolve */ _false,
						/*        divisionsX */ 16,
						/*        divisionsY */ 1,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ .5,
						/*            alignY */ .5,
						/*     paneSeedSizeX */ 5,
						/*     paneSeedSizeY */ 0,
						/*   paneSeedContext */ 100,
						/* paneProgressDelay */ 10,
						/*   paneOrderScheme */ _outsideIn
						/*?
							Themes
								blindsVerticalZoom
									Vertical blinds that zoom out from the center - growing in height as they travel - to stack up against the left and right sides at the same time. All blinds from left to right are the same width.
						*/
					],
					blindsVerticalGrowFromCenter:[
						/*         allToFull */ 0,
						/*          duration */ _duration2000,
						/*          dissolve */ _false,
						/*        divisionsX */ 16,
						/*        divisionsY */ 1,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ .5,
						/*            alignY */ .5,
						/*     paneSeedSizeX */ 0,
						/*     paneSeedSizeY */ 0,
						/*   paneSeedContext */ 50,
						/* paneProgressDelay */ 0,
						/*   paneOrderScheme */ _normal
						/*?
							Themes
								blindsVerticalGrowFromCenter
									A formation of vertical blinds that grows out from the center towards all four edges, growing to become a solid rectangle. All blinds from left to right are the same width.
						*/
					],
					blindsHorizontalFromOutside:[
						/*         allToFull */ 0,
						/*          duration */ _duration3000,
						/*          dissolve */ _false,
						/*        divisionsX */ 1,
						/*        divisionsY */ 16,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ 0,
						/*            alignY */ _start0End1KeyedToPane,
						/*     paneSeedSizeX */ 100,
						/*     paneSeedSizeY */ 0,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 10,
						/*   paneOrderScheme */ _outsideIn
						/*?
							Themes
								blindsHorizontalFromOutside
									Horizontal blinds that start out from the top and bottom edges and close progressively towards the center. All blinds from top to bottom are the same height.
						*/
					],
					blindsHorizontalFromInside:[
						/*         allToFull */ 0,
						/*          duration */ _duration3000,
						/*          dissolve */ _false,
						/*        divisionsX */ 1,
						/*        divisionsY */ 16,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ 0,
						/*            alignY */ _start1End0KeyedToPane,
						/*     paneSeedSizeX */ 100,
						/*     paneSeedSizeY */ 0,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 10,
						/*   paneOrderScheme */ _insideOut
						/*?
							Themes
								blindsHorizontalFromInside
									Horizontal blinds that start out from the center and close progressively towards the top and bottom edges. All blinds from top to bottom are the same height.
						*/
					],
					blindsHorizontalFromTop:[
						/*         allToFull */ 0,
						/*          duration */ _duration3000,
						/*          dissolve */ _false,
						/*        divisionsX */ 1,
						/*        divisionsY */ 16,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ 0,
						/*            alignY */ _start0End1KeyedToPane,
						/*     paneSeedSizeX */ 100,
						/*     paneSeedSizeY */ 0,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 10,
						/*   paneOrderScheme */ _normal
						/*?
							Themes
								blindsHorizontalFromTop
									Horizontal blinds that start out from the top edge and close progressively towards the bottom edge. All blinds from top to bottom are the same height, but they reveal from top-to-bottom at the top edge and progressively shift over - from top to bottom - so that they reveal from bottom-to-top at the bottom edge.
						*/
					],
					blindsHorizontalFromBottom:[
						/*         allToFull */ 0,
						/*          duration */ _duration3000,
						/*          dissolve */ _false,
						/*        divisionsX */ 1,
						/*        divisionsY */ 16,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ 0,
						/*            alignY */ _start0End1KeyedToPane,
						/*     paneSeedSizeX */ 100,
						/*     paneSeedSizeY */ 0,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 10,
						/*   paneOrderScheme */ _reverse
						/*?
							Themes
								blindsHorizontalFromBottom
									Horizontal blinds that start out from the bottom edge and close progressively towards the top edge. All blinds from bottom to top are the same height, but they reveal from bottom-to-top at the bottom edge and progressively shift over - from bottom to top - so that they reveal from top-to-bottom at the top edge.
						*/
					],
					blindsHorizontalTornado:[
						/*         allToFull */ 0,
						/*          duration */ _duration3000,
						/*          dissolve */ _false,
						/*        divisionsX */ 1,
						/*        divisionsY */ 16,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ _start0End1KeyedToPane,
						/*            alignY */ _start0End1KeyedToPane,
						/*     paneSeedSizeX */ 0,
						/*     paneSeedSizeY */ 0,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 10,
						/*   paneOrderScheme */ _normal
						/*?
							Themes
								blindsHorizontalTornado
									Horizontal blinds that start out from the top edge and close progressively towards the bottom edge. Blinds reveal in a tornado like configuration.
						*/
					],
					blindsHorizontalZoom:[
						/*         allToFull */ 0,
						/*          duration */ _duration2000,
						/*          dissolve */ _false,
						/*        divisionsX */ 1,
						/*        divisionsY */ 16,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ .5,
						/*            alignY */ .5,
						/*     paneSeedSizeX */ 0,
						/*     paneSeedSizeY */ 5,
						/*   paneSeedContext */ 100,
						/* paneProgressDelay */ 10,
						/*   paneOrderScheme */ _outsideIn
						/*?
							Themes
								blindsHorizontalZoom
									Horizontal blinds that zoom out from the center - growing in width as they travel - to stack up against the top and bottom sides at the same time. All blinds from top to bottom are the same height.
						*/
					],
					blindsHorizontalGrowFromCenter:[
						/*         allToFull */ 0,
						/*          duration */ _duration2000,
						/*          dissolve */ _false,
						/*        divisionsX */ 1,
						/*        divisionsY */ 16,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ .5,
						/*            alignY */ .5,
						/*     paneSeedSizeX */ 0,
						/*     paneSeedSizeY */ 0,
						/*   paneSeedContext */ 50,
						/* paneProgressDelay */ 0,
						/*   paneOrderScheme */ _normal
						/*?
							Themes
								blindsHorizontalGrowFromCenter
									A formation of horizontal blinds that grows out from the center towards all four edges, growing to become a solid rectangle. All blinds from top to bottom are the same height.
						*/
					],
					verticalStackingAgainstLeft:[
						/*         allToFull */ 0,
						/*          duration */ _duration2000,
						/*          dissolve */ _true,
						/*        divisionsX */ 16,
						/*        divisionsY */ 1,
						/*    firstPaneSizeX */ 0,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ {start:1,end:0.9,keyedTo:'pane'},
						/*            alignY */ 0,
						/*     paneSeedSizeX */ 0,
						/*     paneSeedSizeY */ 100,
						/*   paneSeedContext */ 80,
						/* paneProgressDelay */ 100,
						/*   paneOrderScheme */ _normal
						/*?
							Themes
								verticalStackingAgainstLeft
									Vertical rectangles that stack in a frantic manner, shooting out from the right side and stacking up progressively against the left side and filling in towards the right side. Stacking rectangles are initially narrow, but get progressively larger as the stacking progresses, making the effect appear to slow down towards the end.
						*/
					],
					verticalStackingAgainstRight:[
						/*         allToFull */ 0,
						/*          duration */ _duration2000,
						/*          dissolve */ _true,
						/*        divisionsX */ 16,
						/*        divisionsY */ 1,
						/*    firstPaneSizeX */ 200,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ {start:.1,end:0,keyedTo:'pane'},
						/*            alignY */ 0,
						/*     paneSeedSizeX */ 0,
						/*     paneSeedSizeY */ 100,
						/*   paneSeedContext */ 80,
						/* paneProgressDelay */ 100,
						/*   paneOrderScheme */ _reverse
						/*?
							Themes
								verticalStackingAgainstRight
									Vertical rectangles that stack in a frantic manner, shooting out from the left side and stacking up progressively against the right side and filling in towards the left side. Stacking rectangles are initially narrow, but get progressively larger as the stacking progresses, making the effect appear to slow down towards the end.
						*/
					],
					trapezoidClockwise:[
						/*         allToFull */ 0,
						/*          duration */ _duration2000,
						/*          dissolve */ _false,
						/*        divisionsX */ 1,
						/*        divisionsY */ 16,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ _start0End1KeyedToPane,
						/*            alignY */ .5,
						/*     paneSeedSizeX */ 0,
						/*     paneSeedSizeY */ 0,
						/*   paneSeedContext */ 100,
						/* paneProgressDelay */ 0,
						/*   paneOrderScheme */ _normal
						/*?
							Themes
								trapezoidClockwise
									A trapezoid that grows out from a horizontal sliver in the center and rotates clockwise as it grows to eventually occupy the entire wipe port.
						*/
					],
					trapezoidCounterClockwise:[
						/*         allToFull */ 0,
						/*          duration */ _duration2000,
						/*          dissolve */ _false,
						/*        divisionsX */ 16,
						/*        divisionsY */ 1,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ .5,
						/*            alignY */ _start0End1KeyedToPane,
						/*     paneSeedSizeX */ 0,
						/*     paneSeedSizeY */ 0,
						/*   paneSeedContext */ 100,
						/* paneProgressDelay */ 0,
						/*   paneOrderScheme */ _normal
						/*?
							Themes
								trapezoidCounterClockwise
									A trapezoid that grows out from a vertical sliver in the center and rotates counter-clockwise as it grows to eventually occupy the entire wipe port.
						*/
					],
					openingV:[
						/*         allToFull */ 0,
						/*          duration */ _duration2000,
						/*          dissolve */ _false,
						/*        divisionsX */ 16,
						/*        divisionsY */ 1,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ .5,
						/*            alignY */ {start:0,end:1,keyedTo:'pane',wraps:2,wrapMode:'triangle'},
						/*     paneSeedSizeX */ 5,
						/*     paneSeedSizeY */ 20,
						/*   paneSeedContext */ 100,
						/* paneProgressDelay */ 0,
						/*   paneOrderScheme */ _normal
						/*?
							Themes
								openingV
									A "V" shape that grows out from a vertical sliver in the center and spreads open to the left and the right as it grows to eventually occupy the entire wipe port.
						*/
					],
					tornado:[
						/*         allToFull */ 0,
						/*          duration */ _duration2000,
						/*          dissolve */ _false,
						/*        divisionsX */ 1,
						/*        divisionsY */ 16,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 200,
						/*            alignX */ _start0End1KeyedToPane,
						/*            alignY */ _start0End1KeyedToPane,
						/*     paneSeedSizeX */ 0,
						/*     paneSeedSizeY */ 100,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 5,
						/*   paneOrderScheme */ _normal
						/*?
							Themes
								tornado
									A tornado like shape that enters from the top left and grows down towards the bottom right, eventually expanding to occupy the entire wipe port.
						*/
					],
					wBlinds:[
						/*         allToFull */ 0,
						/*          duration */ _duration2000,
						/*          dissolve */ _false,
						/*        divisionsX */ 16,
						/*        divisionsY */ 1,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ _start0End1KeyedToPane,
						/*            alignY */ {start:0,end:1,keyedTo:'column',wraps:2,wrapMode:'triangle'},
						/*     paneSeedSizeX */ 0,
						/*     paneSeedSizeY */ {start:0,end:100,keyedTo:'column',wraps:2,wrapMode:'triangle'},
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 0,
						/*   paneOrderScheme */ _normal
						/*?
							Themes
								wBlinds
									Vertical blinds that first appear in a configuration roughly resembling the letter "W", that then grow in height and width until they coalesce together to occupy the entire wipe port.
						*/
					],
					diamondVertical:[
						/*         allToFull */ 0,
						/*          duration */ _duration3000,
						/*          dissolve */ _false,
						/*        divisionsX */ 16,
						/*        divisionsY */ 1,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ _start1End0KeyedToPane,
						/*            alignY */ .5,
						/*     paneSeedSizeX */ 0,
						/*     paneSeedSizeY */ 0,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 10,
						/*   paneOrderScheme */ _insideOut
						/*?
							Themes
								diamondVertical
									Vertical blinds that originate in the center in a diamond configuration, that then grow in height and width until they coalesce together to occupy the entire wipe port.
						*/
					],
					diamondHorizontal:[
						/*         allToFull */ 0,
						/*          duration */ _duration3000,
						/*          dissolve */ _false,
						/*        divisionsX */ 1,
						/*        divisionsY */ 16,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ .5,
						/*            alignY */ _start1End0KeyedToPane,
						/*     paneSeedSizeX */ 0,
						/*     paneSeedSizeY */ 0,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 10,
						/*   paneOrderScheme */ _insideOut
						/*?
							Themes
								diamondHorizontal
									Horizontal blinds that originate in the center in a diamond configuration, that then grow in width and height until they coalesce together to occupy the entire wipe port.
						*/
					],
					matrix:[
						/*         allToFull */ 0,
						/*          duration */ _duration2000,
						/*          dissolve */ _false,
						/*        divisionsX */ 4,
						/*        divisionsY */ 4,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ {start:0,end:1,keyedTo:'column'},
						/*            alignY */ _start0End1KeyedToRow,
						/*     paneSeedSizeX */ 0,
						/*     paneSeedSizeY */ 0,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 0,
						/*   paneOrderScheme */ _normal
						/*?
							Themes
								matrix
									A four-by-four matrix of equal sized panes that all grow in width and height together at the same rate until they coalesce together to occupy the entire wipe port.
						*/
					],
					matrixZoomBottomRight:[
						/*         allToFull */ 0,
						/*          duration */ 4000,
						/*          dissolve */ _false,
						/*        divisionsX */ 4,
						/*        divisionsY */ 4,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ 1,
						/*            alignY */ 1,
						/*     paneSeedSizeX */ 0,
						/*     paneSeedSizeY */ 0,
						/*   paneSeedContext */ 100,
						/* paneProgressDelay */ 20,
						/*   paneOrderScheme */ _normal
						/*?
							Themes
								matrixZoomBottomRight
									Panes that zoom out, one by one, from the bottom right corner to take their place at their final size in a matrix of equal sized panes that coalesce together to occupy the entire wipe port.
						*/
					],
					matrixZoomTopLeft:[
						/*         allToFull */ 0,
						/*          duration */ 4000,
						/*          dissolve */ _false,
						/*        divisionsX */ 4,
						/*        divisionsY */ 4,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ 0,
						/*            alignY */ 0,
						/*     paneSeedSizeX */ 0,
						/*     paneSeedSizeY */ 0,
						/*   paneSeedContext */ 100,
						/* paneProgressDelay */ 20,
						/*   paneOrderScheme */ _reverse
						/*?
							Themes
								matrixZoomTopLeft
									Panes that zoom out, one by one, from the top left corner to take their place at their final size in a matrix of equal sized panes that coalesce together to occupy the entire wipe port.
						*/
					],
					matrixZoomCenter:[
						/*         allToFull */ 0,
						/*          duration */ 4000,
						/*          dissolve */ _false,
						/*        divisionsX */ 4,
						/*        divisionsY */ 4,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ .5,
						/*            alignY */ .5,
						/*     paneSeedSizeX */ 0,
						/*     paneSeedSizeY */ 0,
						/*   paneSeedContext */ 100,
						/* paneProgressDelay */ 20,
						/*   paneOrderScheme */ _outsideIn
						/*?
							Themes
								matrixZoomCenter
									Panes that zoom out, one by one, from the center to take their place at their final size in a matrix of equal sized panes that coalesce together to occupy the entire wipe port. Panes alternate between zooming out in the direction of the top left and zooming out in the direction of the bottom right.
						*/
					],
					matrixFromOutside:[
						/*         allToFull */ 0,
						/*          duration */ 4000,
						/*          dissolve */ _false,
						/*        divisionsX */ 4,
						/*        divisionsY */ 4,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ _start0End1KeyedToRow,
						/*            alignY */ _start0End1KeyedToRow,
						/*     paneSeedSizeX */ 0,
						/*     paneSeedSizeY */ 0,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 20,
						/*   paneOrderScheme */ _outsideIn
						/*?
							Themes
								matrixFromOutside
									A four-by-four matrix of equal sized panes that grow in width and height until they coalesce together to occupy the entire wipe port, starting with the panes at the top left and top right and progressing towards the panes in the center.
						*/
					],
					matrixJumbled:[
						/*         allToFull */ 0,
						/*          duration */ _duration2000,
						/*          dissolve */ _false,
						/*        divisionsX */ 4,
						/*        divisionsY */ 4,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ 0,
						/*            alignY */ .5,
						/*     paneSeedSizeX */ 100,
						/*     paneSeedSizeY */ 0,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 20,
						/*   paneOrderScheme */ 'jumbled'
						/*?
							Themes
								matrixJumbled
									A four-by-four matrix of equal sized panes that start out as thin horizontal lines and grow in height until they coalesce together to occupy the entire wipe port, with the growth of the panes randomly staggered in time so not all the panes are growing at the same time or rate.
						*/
					],
					matrixDrifting:[
						/*         allToFull */ 0,
						/*          duration */ _duration2000,
						/*          dissolve */ _false,
						/*        divisionsX */ 4,
						/*        divisionsY */ 4,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ {start:0,end:1,keyedTo:'pane',wraps:20,wrapMode:'triangle'},
						/*            alignY */ {start:0,end:1,keyedTo:'pane',wraps:4,wrapMode:'triangle'},
						/*     paneSeedSizeX */ 0,
						/*     paneSeedSizeY */ 0,
						/*   paneSeedContext */ 100,
						/* paneProgressDelay */ 2,
						/*   paneOrderScheme */ _reverse
						/*?
							Themes
								matrixDrifting
									A series of panes that originate at the same time at randomly positioned points within the wipe port and that migrate and grow at the same rate, to take their place at their final size in a matrix of equal sized panes that coalesce together to occupy the entire wipe port. Because the origin of each pane is random, panes can cross paths as they migrate to their final position.
						*/
					],
					matrixFromTopLeftFade:[
						/*         allToFull */ 0,
						/*          duration */ _duration2000,
						/*          dissolve */ _true,
						/*        divisionsX */ 4,
						/*        divisionsY */ 4,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ 0,
						/*            alignY */ 0,
						/*     paneSeedSizeX */ 100,
						/*     paneSeedSizeY */ 100,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 20,
						/*   paneOrderScheme */ _normal
						/*?
							Themes
								matrixFromTopLeftFade
									A four-by-four matrix of equal sized panes that don't move in position but that progressively fade in over time, starting from the top left pane and progressively fading in from left to right and top to bottom, so that the bottom right pane is the last to completely fade in.
						*/
					],
					matrixFromBottomRightFade:[
						/*         allToFull */ 0,
						/*          duration */ _duration2000,
						/*          dissolve */ _true,
						/*        divisionsX */ 4,
						/*        divisionsY */ 4,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ 0,
						/*            alignY */ 0,
						/*     paneSeedSizeX */ 100,
						/*     paneSeedSizeY */ 100,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 20,
						/*   paneOrderScheme */ _reverse
						/*?
							Themes
								matrixFromBottomRightFade
									A four-by-four matrix of equal sized panes that don't move in position but that progressively fade in over time, starting from the bottom right pane and progressively fading in from right to left and bottom to top, so that the top left pane is the last to completely fade in.
						*/
					],
					matrixFromCornersFade:[
						/*         allToFull */ 0,
						/*          duration */ _duration2000,
						/*          dissolve */ _true,
						/*        divisionsX */ 4,
						/*        divisionsY */ 4,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ 0,
						/*            alignY */ 0,
						/*     paneSeedSizeX */ 100,
						/*     paneSeedSizeY */ 100,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 20,
						/*   paneOrderScheme */ _outsideIn
						/*?
							Themes
								matrixFromCornersFade
									A four-by-four matrix of equal sized panes that don't move in position but that progressively fade in over time, starting from the top left and bottom right panes and progressively fading in from both directions towards the center.
						*/
					],
					matrixTartanFacetedFade:[
						/*         allToFull */ 100,
						/*          duration */ 5000,
						/*          dissolve */ _true,
						/*        divisionsX */ 4,
						/*        divisionsY */ 4,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ {start:0,end:1,keyedTo:'column'},
						/*            alignY */ {start:0,end:1,keyedTo:'row'},
						/*     paneSeedSizeX */ 0,
						/*     paneSeedSizeY */ 0,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 0,
						/*   paneOrderScheme */ _normal
						/*?
							Themes
								matrixTartanFacetedFade
									A four-by-four matrix of equal sized panes that don't move in position but that progressively fade in and grow in size over time, until every pane eventually is completely opaque and occupies the entire wipe port, with a "tartan" effect being produced as their boundaries cross.
						*/
					],
					backSlash:[
						/*         allToFull */ 100,
						/*          duration */ _duration2000,
						/*          dissolve */ _false,
						/*        divisionsX */ 16,
						/*        divisionsY */ 1,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ _start0End1KeyedToPane,
						/*            alignY */ _start0End1KeyedToPane,
						/*     paneSeedSizeX */ 0,
						/*     paneSeedSizeY */ 0,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 0,
						/*   paneOrderScheme */ _normal
						/*?
							Themes
								backSlash
									A backslash shape that cuts the wipe port diagonally from top left to bottom right, and that grows in size to eventually occupy the entire wipe port.
						*/
					],
					forwardSlash:[
						/*         allToFull */ 100,
						/*          duration */ _duration2000,
						/*          dissolve */ _false,
						/*        divisionsX */ 16,
						/*        divisionsY */ 1,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ _start0End1KeyedToPane,
						/*            alignY */ _start1End0KeyedToPane,
						/*     paneSeedSizeX */ 0,
						/*     paneSeedSizeY */ 0,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 0,
						/*   paneOrderScheme */ _reverse
						/*?
							Themes
								forwardSlash
									A forward slash shape that cuts the wipe port diagonally from top right to bottom left, and that grows in size to eventually occupy the entire wipe port.
						*/
					],
					backSlashWithCurl:[
						/*         allToFull */ 100,
						/*          duration */ _duration2000,
						/*          dissolve */ _false,
						/*        divisionsX */ 16,
						/*        divisionsY */ 1,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ _start0End1KeyedToPane,
						/*            alignY */ _start0End1KeyedToPane,
						/*     paneSeedSizeX */ 0,
						/*     paneSeedSizeY */ 0,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 2,
						/*   paneOrderScheme */ _normal
						/*?
							Themes
								backSlashWithCurl
									A backslash shape that cuts the wipe port diagonally from top left to bottom right, and that grows in size to eventually occupy the entire wipe port, growing at a non-linear rate so that the top left side of the wipe port is revealed more rapidly than the bottom right, producing a page curl like effect.
						*/
					],
					twoBackSlashesCoalesce:[
						/*         allToFull */ 0,
						/*          duration */ _duration2000,
						/*          dissolve */ _false,
						/*        divisionsX */ 8,
						/*        divisionsY */ 2,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ .5,
						/*            alignY */ _start0End1KeyedToPane,
						/*     paneSeedSizeX */ 0,
						/*     paneSeedSizeY */ 0,
						/*   paneSeedContext */ 100,
						/* paneProgressDelay */ 0,
						/*   paneOrderScheme */ _normal
						/*?
							Themes
								twoBackSlashesCoalesce
									Two vertical lines that originate centered in the top and bottom halves of the wipe port, and that grow in size and rotate counter-clockwise at the same rate until they eventually coalesce together to occupy the entire wipe port.
						*/
					],
					forwardSlashWithCurl:[
						/*         allToFull */ 100,
						/*          duration */ _duration2000,
						/*          dissolve */ _false,
						/*        divisionsX */ 16,
						/*        divisionsY */ 1,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ _start0End1KeyedToPane,
						/*            alignY */ _start1End0KeyedToPane,
						/*     paneSeedSizeX */ 0,
						/*     paneSeedSizeY */ 0,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 2,
						/*   paneOrderScheme */ _reverse
						/*?
							Themes
								forwardSlashWithCurl
									A forward slash shape that cuts the wipe port diagonally from top right to bottom left, and that grows in size to eventually occupy the entire wipe port, growing at a non-linear rate so that the top right side of the wipe port is revealed more rapidly than the bottom left, producing a page curl like effect.
						*/
					],
					fourSlashesCounterClockwise:[
						/*         allToFull */ 0,
						/*          duration */ _duration2000,
						/*          dissolve */ _false,
						/*        divisionsX */ 4,
						/*        divisionsY */ 4,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ _start1End0KeyedToPane,
						/*            alignY */ _start0End1KeyedToPane,
						/*     paneSeedSizeX */ 0,
						/*     paneSeedSizeY */ 0,
						/*   paneSeedContext */ 100,
						/* paneProgressDelay */ 0,
						/*   paneOrderScheme */ _normal
						/*?
							Themes
								fourSlashesCounterClockwise
									Four small forward slashes that originate in a diagonal formation from bottom left to top right, and that rotate counter-clockwise and grow in size at the same rate until they eventually coalesce together to occupy the entire wipe port.
						*/
					],
					verticalFadeFromTop:[
						/*         allToFull */ 0,
						/*          duration */ _duration2000,
						/*          dissolve */ _true,
						/*        divisionsX */ 1,
						/*        divisionsY */ 16,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ 0,
						/*            alignY */ 0,
						/*     paneSeedSizeX */ 100,
						/*     paneSeedSizeY */ 100,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 10,
						/*   paneOrderScheme */ _normal
						/*?
							Themes
								verticalFadeFromTop
									A series of equal sized horizontal panes that are stacked vertically and that don't move in position but that progressively fade in over time, starting from the top pane and progressively fading in from top to bottom, so that the bottom pane is the last to completely fade in.
						*/
					],
					verticalFadeFromBottom:[
						/*         allToFull */ 0,
						/*          duration */ _duration2000,
						/*          dissolve */ _true,
						/*        divisionsX */ 1,
						/*        divisionsY */ 16,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ 0,
						/*            alignY */ 0,
						/*     paneSeedSizeX */ 100,
						/*     paneSeedSizeY */ 100,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 10,
						/*   paneOrderScheme */ _reverse
						/*?
							Themes
								verticalFadeFromBottom
									A series of equal sized horizontal panes that are stacked vertically and that don't move in position but that progressively fade in over time, starting from the bottom pane and progressively fading in from bottom to top, so that the top pane is the last to completely fade in.
						*/
					],
					verticalFadeFromInside:[
						/*         allToFull */ 0,
						/*          duration */ _duration2000,
						/*          dissolve */ _true,
						/*        divisionsX */ 1,
						/*        divisionsY */ 16,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ 0,
						/*            alignY */ 0,
						/*     paneSeedSizeX */ 100,
						/*     paneSeedSizeY */ 100,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 10,
						/*   paneOrderScheme */ _insideOut
						/*?
							Themes
								verticalFadeFromInside
									A series of equal sized horizontal panes that are stacked vertically and that don't move in position but that progressively fade in over time, starting from the center / inside panes and progressively fading in towards the top and bottom simultaneously, so that the outside (i.e. top and bottom) panes are the last to completely fade in.
						*/
					],
					verticalFadeFromOutside:[
						/*         allToFull */ 0,
						/*          duration */ _duration2000,
						/*          dissolve */ _true,
						/*        divisionsX */ 1,
						/*        divisionsY */ 16,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ 0,
						/*            alignY */ 0,
						/*     paneSeedSizeX */ 100,
						/*     paneSeedSizeY */ 100,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 10,
						/*   paneOrderScheme */ _outsideIn
						/*?
							Themes
								verticalFadeFromOutside
									A series of equal sized horizontal panes that are stacked vertically and that don't move in position but that progressively fade in over time, starting from the outside (i.e. top and bottom) panes and progressively fading in towards the center from both directions simultaneously, so that the center / inside panes are the last to completely fade in.
						*/
					],
					horizontalFadeFromLeft:[
						/*         allToFull */ 0,
						/*          duration */ _duration2000,
						/*          dissolve */ _true,
						/*        divisionsX */ 16,
						/*        divisionsY */ 1,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ 0,
						/*            alignY */ 0,
						/*     paneSeedSizeX */ 100,
						/*     paneSeedSizeY */ 100,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 10,
						/*   paneOrderScheme */ _normal
						/*?
							Themes
								horizontalFadeFromLeft
									A series of equal sized vertical panes that are stacked horizontally and that don't move in position but that progressively fade in over time, starting from the left pane and progressively fading in from left to right, so that the right pane is the last to completely fade in.
						*/
					],
					horizontalFadeFromRight:[
						/*         allToFull */ 0,
						/*          duration */ _duration2000,
						/*          dissolve */ _true,
						/*        divisionsX */ 16,
						/*        divisionsY */ 1,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ 0,
						/*            alignY */ 0,
						/*     paneSeedSizeX */ 100,
						/*     paneSeedSizeY */ 100,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 10,
						/*   paneOrderScheme */ _reverse
						/*?
							Themes
								horizontalFadeFromRight
									A series of equal sized vertical panes that are stacked horizontally and that don't move in position but that progressively fade in over time, starting from the right pane and progressively fading in from right to left, so that the left pane is the last to completely fade in.
						*/
					],
					horizontalFadeFromInside:[
						/*         allToFull */ 0,
						/*          duration */ _duration2000,
						/*          dissolve */ _true,
						/*        divisionsX */ 16,
						/*        divisionsY */ 1,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ 0,
						/*            alignY */ 0,
						/*     paneSeedSizeX */ 100,
						/*     paneSeedSizeY */ 100,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 10,
						/*   paneOrderScheme */ _insideOut
						/*?
							Themes
								horizontalFadeFromInside
									A series of equal sized vertical panes that are stacked horizontally and that don't move in position but that progressively fade in over time, starting from the center / inside panes and progressively fading in towards the left and right simultaneously, so that the outside (i.e. left and right) panes are the last to completely fade in.
						*/
					],
					horizontalFadeFromOutside:[
						/*         allToFull */ 0,
						/*          duration */ _duration2000,
						/*          dissolve */ _true,
						/*        divisionsX */ 16,
						/*        divisionsY */ 1,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ 0,
						/*            alignY */ 0,
						/*     paneSeedSizeX */ 100,
						/*     paneSeedSizeY */ 100,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 10,
						/*   paneOrderScheme */ _outsideIn
						/*?
							Themes
								horizontalFadeFromOutside
									A series of equal sized vertical panes that are stacked horizontally and that don't move in position but that progressively fade in over time, starting from the outside (i.e. left and right) panes and progressively fading in towards the center from both directions simultaneously, so that the center / inside panes are the last to completely fade in.
						*/
					],
					horizontalRibbonFadeFromInside:[
						/*         allToFull */ 0,
						/*          duration */ _duration2000,
						/*          dissolve */ _true,
						/*        divisionsX */ 1,
						/*        divisionsY */ 16,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ {start:0,end:1,keyedTo:'row',wraps:5},
						/*            alignY */ 0,
						/*     paneSeedSizeX */ 0,
						/*     paneSeedSizeY */ 100,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 20,
						/*   paneOrderScheme */ _insideOut
						/*?
							Themes
								horizontalRibbonFadeFromInside
									A series of horizontal panes that are stacked vertically and that fade in while growing in width from random points, starting from the center / inside panes and progressively fading and growing in towards the top and bottom simultaneously, so that the outside (i.e. top and bottom) panes are the last to completely fade and grow in.
						*/
					],
					verticalRibbonFadeFromInside:[
						/*         allToFull */ 0,
						/*          duration */ _duration2000,
						/*          dissolve */ _true,
						/*        divisionsX */ 16,
						/*        divisionsY */ 1,
						/*    firstPaneSizeX */ 100,
						/*    firstPaneSizeY */ 100,
						/*            alignX */ 0,
						/*            alignY */ {start:0,end:1,keyedTo:'column',wraps:5},
						/*     paneSeedSizeX */ 100,
						/*     paneSeedSizeY */ 0,
						/*   paneSeedContext */ 0,
						/* paneProgressDelay */ 20,
						/*   paneOrderScheme */ _insideOut
						/*?
							Themes
								verticalRibbonFadeFromInside
									A series of vertical panes that are stacked horizontally and that fade in while growing in height from random points, starting from the center / inside panes and progressively fading and growing in towards the left and right simultaneously, so that the outside (i.e. left and right) panes are the last to completely fade and grow in.
						*/
					],
					facetedFade:[
						/*         allToFull */ 50,
						/*          duration */ _duration3000,
						/*          dissolve */ _true,
						/*        divisionsX */ 4,
						/*        divisionsY */ 4,
						/*    firstPaneSizeX */ 300,
						/*    firstPaneSizeY */ 0,
						/*            alignX */ {start:0,end:1,keyedTo:'pane',wraps:5,wrapMode:'triangle'},
						/*            alignY */ {start:0,end:1,keyedTo:'pane',wraps:7,wrapMode:'triangle'},
						/*     paneSeedSizeX */ 50,
						/*     paneSeedSizeY */ 100,
						/*   paneSeedContext */ 100,
						/* paneProgressDelay */ 10,
						/*   paneOrderScheme */ 'jumbled'
						/*?
							Themes
								facetedFade
									A series of randomly sized and positioned panes that progressively fade in and grow in size over time, until every pane eventually is completely opaque and occupies the entire wipe port, producing a faceted glass panes wipe effect as they grow in random directions and their boundaries cross.
						*/
					]
				},
				Uize.Widget.ImageWipe.ThemeValuePack.from
			);
		};
	}
});

