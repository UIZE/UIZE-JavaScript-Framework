/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.SegmentDisplay.Seven.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2014 UIZE
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
		The =Uize.Widgets.SegmentDisplay.Seven.Widget= class implements a seven segment display widget, complete with HTML and CSS, and with configurable segment width, segment color, and dim segment opacity.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.SegmentDisplay.Seven.Widget= class...

			............................................................
			<< widget >>

			widgetClass: Uize.Widgets.SegmentDisplay.Seven.VisualSampler
			............................................................
*/

Uize.module ({
	name:'Uize.Widgets.SegmentDisplay.Seven.Widget',
	superclass:'Uize.Widget.SegmentDisplay.Seven',
	required:[
		'Uize.Widget.mV2',
		'Uize.Widget.mWidthHeight',
		'Uize.Widgets.SegmentDisplay.Seven.Html',
		'Uize.Widgets.SegmentDisplay.Seven.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			mixins:[
				Uize.Widget.mV2,
				Uize.Widget.mWidthHeight
			],

			omegastructor:function () {
				this.set ({
					cssClassSegmentOn:this.cssClass ('segmentOn'),
					cssClassSegmentOff:this.cssClass ('segmentOff')
				});
			},

			staticProperties:{
				cssModule:Uize.Widgets.SegmentDisplay.Seven.Css
			},

			set:{
				width:83,
				height:160,
				html:Uize.Widgets.SegmentDisplay.Seven.Html
			},

			stateProperties:{
				_segmentThickness:{
					name:'segmentThickness',
					value:16
				},
				_segmentColor:{
					name:'segmentColor',
					value:'3f6'
				},
				_segmentGap:{
					name:'segmentGap',
					value:1
				},

				/*** derived properties for HTML bindings ***/
					segmentColorAsRgbHex:{
						derived:'segmentColor: "#" + segmentColor'
					},
					segmentThicknessPx:{
						derived:'segmentThickness: segmentThickness + "px"'
					},
					segmentGapPx:{
						derived:'segmentGap: segmentGap + "px"'
					},
					segmentGTopPx:{
						derived:'height,segmentThickness: height / 2 - segmentThickness / 2 + "px"'
					},
					segmentThicknessDiv2:{
						derived:'segmentThickness: segmentThickness / 2'
					},
					segmentThicknessDiv2Px:{
						derived:'segmentThicknessDiv2: segmentThicknessDiv2 + "px"'
					},
					segmentThicknessPlusSegmentGapPx:{
						derived:'segmentThickness,segmentGap: segmentThickness + segmentGap + "px"'
					},
					segmentGapMinusSegmentThicknessDiv2Px:{
						derived:'segmentGap,segmentThicknessDiv2: segmentGap - segmentThicknessDiv2 + "px"'
					},
					segmentGapPlusSegmentThicknessDiv2Px:{
						derived:'segmentGap,segmentThicknessDiv2: segmentGap + segmentThicknessDiv2 + "px"'
					}
			},

			htmlBindings:{
				segmentColorAsRgbHex:[
					/*** segment A color ***/
						'segmentABar:style.background',
						'segmentALeftEnd:style.borderRightColor',
						'segmentARightEnd:style.borderLeftColor',

					/*** segment B color ***/
						'segmentBBar:style.background',
						'segmentBTopEnd:style.borderBottomColor',
						'segmentBBottomEnd:style.borderTopColor',

					/*** segment C color ***/
						'segmentCBar:style.background',
						'segmentCTopEnd:style.borderBottomColor',
						'segmentCBottomEnd:style.borderTopColor',

					/*** segment D color ***/
						'segmentDBar:style.background',
						'segmentDLeftEnd:style.borderRightColor',
						'segmentDRightEnd:style.borderLeftColor',

					/*** segment E color ***/
						'segmentEBar:style.background',
						'segmentETopEnd:style.borderBottomColor',
						'segmentEBottomEnd:style.borderTopColor',

					/*** segment F color ***/
						'segmentFBar:style.background',
						'segmentFTopEnd:style.borderBottomColor',
						'segmentFBottomEnd:style.borderTopColor',

					/*** segment G color ***/
						'segmentGBar:style.background',
						'segmentGLeftEnd:style.borderRightColor',
						'segmentGRightEnd:style.borderLeftColor'
				],
				segmentThicknessPx:[
					'segmentA:style.height',
					'segmentB:style.width',
					'segmentC:style.width',
					'segmentD:style.height',
					'segmentE:style.width',
					'segmentF:style.width',
					'segmentG:style.height'
				],
				segmentGTopPx:'segmentG:style.top',
				segmentGapPx:[
					'segmentALeftEnd:style.left',
					'segmentARightEnd:style.right',
					'segmentBTopEnd:style.top',
					'segmentCBottomEnd:style.bottom',
					'segmentDLeftEnd:style.left',
					'segmentDRightEnd:style.right',
					'segmentEBottomEnd:style.bottom',
					'segmentFTopEnd:style.top',
					'segmentGLeftEnd:style.left',
					'segmentGRightEnd:style.right'
				],
				segmentThicknessDiv2Px:[
					'segmentALeftEnd:style.borderWidth',
					'segmentARightEnd:style.borderWidth',
					'segmentBTopEnd:style.borderWidth',
					'segmentBBottomEnd:style.borderWidth',
					'segmentCTopEnd:style.borderWidth',
					'segmentCBottomEnd:style.borderWidth',
					'segmentDLeftEnd:style.borderWidth',
					'segmentDRightEnd:style.borderWidth',
					'segmentETopEnd:style.borderWidth',
					'segmentEBottomEnd:style.borderWidth',
					'segmentFTopEnd:style.borderWidth',
					'segmentFBottomEnd:style.borderWidth',
					'segmentGLeftEnd:style.borderWidth',
					'segmentGRightEnd:style.borderWidth'
				],
				segmentThicknessPlusSegmentGapPx:[
					'segmentABar:style.left',
					'segmentABar:style.right',
					'segmentBBar:style.top',
					'segmentCBar:style.bottom',
					'segmentDBar:style.left',
					'segmentDBar:style.right',
					'segmentEBar:style.bottom',
					'segmentFBar:style.top',
					'segmentGBar:style.left',
					'segmentGBar:style.right'
				],
				segmentGapMinusSegmentThicknessDiv2Px:[
					'segmentBBottomEnd:style.bottom',
					'segmentCTopEnd:style.top',
					'segmentETopEnd:style.top',
					'segmentFBottomEnd:style.bottom'
				],
				segmentGapPlusSegmentThicknessDiv2Px:[
					'segmentBBar:style.bottom',
					'segmentCBar:style.top',
					'segmentEBar:style.top',
					'segmentFBar:style.bottom'
				]
			}
		});
	}
});

