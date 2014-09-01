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

		/*** build objects for HTML bindings declaration ***/
			var
				_segmentColorAsRgbHexHtmlBindings = [],
				_segmentThicknessPxHtmlBindings = [],
				_segmentThicknessDiv2PxHtmlBindings = []
			;
			Uize.forEach (
				{A:0,B:1,C:1,D:0,E:1,F:1,G:0},
				function (_isVert,_segmentCode) {
					var _segmentName = 'segment' + _segmentCode;
					_segmentColorAsRgbHexHtmlBindings.push (
						_segmentName + 'Bar:style.background',
						_segmentName + 'EndA:style.border' + (_isVert ? 'Bottom' : 'Right') + 'Color',
						_segmentName + 'EndB:style.border' + (_isVert ? 'Top' : 'Left') + 'Color'
					);
					_segmentThicknessPxHtmlBindings.push (_segmentName + ':style.' + (_isVert ? 'width' : 'height'));
					_segmentThicknessDiv2PxHtmlBindings.push (
						_segmentName + 'EndA:style.borderWidth',
						_segmentName + 'EndB:style.borderWidth'
					);
				}
			);

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
				segmentColorAsRgbHex:_segmentColorAsRgbHexHtmlBindings,
				segmentThicknessPx:_segmentThicknessPxHtmlBindings,
				segmentGTopPx:'segmentG:style.top',
				segmentGapPx:[
					'segmentAEndA:style.left',
					'segmentAEndB:style.right',
					'segmentBEndA:style.top',
					'segmentCEndB:style.bottom',
					'segmentDEndA:style.left',
					'segmentDEndB:style.right',
					'segmentEEndB:style.bottom',
					'segmentFEndA:style.top',
					'segmentGEndA:style.left',
					'segmentGEndB:style.right'
				],
				segmentThicknessDiv2Px:_segmentThicknessDiv2PxHtmlBindings,
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
					'segmentBEndB:style.bottom',
					'segmentCEndA:style.top',
					'segmentEEndA:style.top',
					'segmentFEndB:style.bottom'
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

