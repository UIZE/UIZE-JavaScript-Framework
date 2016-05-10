/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.SegmentDisplay.Seven.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2016 UIZE
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
		'Uize.Widgets.SegmentDisplay.mSegmentColor',
		'Uize.Widgets.SegmentDisplay.Seven.Html',
		'Uize.Widgets.SegmentDisplay.Seven.Css'
	],
	builder:function (_superclass) {
		'use strict';

		/*** build object for segment state derived properties ***/
			var _segmentStateDerivedProperties = {};
			_superclass.forEachSegment (
				function (_segmentNo,_segmentCode,_segmentMask) {
					_segmentStateDerivedProperties ['segmentState' + _segmentCode] = {
						derived:'segmentsState: !!(segmentsState & ' + _segmentMask + ')'
					};
				}
			);

		/*** build objects for HTML bindings declaration ***/
			var
				_segmentBgStyleHtmlBindings = [],
				_segmentThicknessHtmlBindings = [],
				_segmentThicknessDiv2HtmlBindings = []
			;
			Uize.forEach (
				{A:0,B:1,C:1,D:0,E:1,F:1,G:0},
				function (_isVert,_segmentCode) {
					var _segmentName = 'segment' + _segmentCode;
					_segmentBgStyleHtmlBindings.push (
						_segmentName + 'Bar:style.background',
						_segmentName + 'EndA:style.border' + (_isVert ? 'Bottom' : 'Right') + 'Color',
						_segmentName + 'EndB:style.border' + (_isVert ? 'Top' : 'Left') + 'Color'
					);
					_segmentThicknessHtmlBindings.push (_segmentName + ':style.' + (_isVert ? 'width' : 'height'));
					_segmentThicknessDiv2HtmlBindings.push (
						_segmentName + 'EndA:style.borderWidth',
						_segmentName + 'EndB:style.borderWidth'
					);
				}
			);

		return _superclass.subclass ({
			mixins:[
				Uize.Widget.mV2,
				Uize.Widget.mWidthHeight,
				Uize.Widgets.SegmentDisplay.mSegmentColor
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

			stateProperties:Uize.copyInto (
				_segmentStateDerivedProperties,
				{
					_segmentThickness:{
						name:'segmentThickness',
						value:16
					},
					_segmentGap:{
						name:'segmentGap',
						value:1
					},
					_segmentAbutMode:{
						name:'segmentAbutMode',
						value:0 // 0 (traditional) | 1 (flat end abut)
					},

					/*** derived properties for HTML bindings ***/
						horzSegmentEndPos:{
							derived:'segmentGap,segmentAbutMode,segmentThickness: segmentGap - segmentAbutMode * segmentThickness'
						},
						horzSegmentBarPos:{
							derived:'horzSegmentEndPos,segmentThickness: horzSegmentEndPos + segmentThickness'
						},
						vertSegmentTopEndPos:{
							derived:'segmentGap,segmentStateA,segmentAbutMode,segmentThickness: segmentGap - !segmentStateA * segmentAbutMode * segmentThickness'
						},
						vertSegmentTopBarPos:{
							derived:'vertSegmentTopEndPos,segmentThickness: vertSegmentTopEndPos + segmentThickness'
						},
						vertSegmentMiddleEndPos:{
							derived:'segmentGap,segmentStateG,segmentAbutMode,segmentThicknessDiv2: segmentGap - segmentThicknessDiv2 - !segmentStateG * segmentAbutMode * segmentThicknessDiv2'
						},
						vertSegmentMiddleBarPos:{
							derived:'vertSegmentMiddleEndPos,segmentThickness: vertSegmentMiddleEndPos + segmentThickness'
						},
						vertSegmentBottomEndPos:{
							derived:'segmentGap,segmentStateD,segmentAbutMode,segmentThickness: segmentGap - !segmentStateD * segmentAbutMode * segmentThickness'
						},
						vertSegmentBottomBarPos:{
							derived:'vertSegmentBottomEndPos,segmentThickness: vertSegmentBottomEndPos + segmentThickness'
						},
						segmentGTop:{
							derived:'height,segmentThickness: height / 2 - segmentThickness / 2'
						},
						segmentThicknessDiv2:{
							derived:'segmentThickness: segmentThickness / 2'
						}
				}
			),

			htmlBindings:{
				segmentBgStyle:_segmentBgStyleHtmlBindings,
				segmentThickness:_segmentThicknessHtmlBindings,
				segmentGTop:'segmentG:style.top',
				horzSegmentEndPos:[
					'segmentAEndA:style.left',
					'segmentAEndB:style.right',
					'segmentDEndA:style.left',
					'segmentDEndB:style.right',
					'segmentGEndA:style.left',
					'segmentGEndB:style.right'
				],
				vertSegmentTopEndPos:[
					'segmentBEndA:style.top',
					'segmentFEndA:style.top'
				],
				vertSegmentTopBarPos:[
					'segmentBBar:style.top',
					'segmentFBar:style.top'
				],
				vertSegmentBottomEndPos:[
					'segmentCEndB:style.bottom',
					'segmentEEndB:style.bottom'
				],
				vertSegmentBottomBarPos:[
					'segmentCBar:style.bottom',
					'segmentEBar:style.bottom'
				],
				segmentThicknessDiv2:_segmentThicknessDiv2HtmlBindings,
				horzSegmentBarPos:[
					'segmentABar:style.left',
					'segmentABar:style.right',
					'segmentDBar:style.left',
					'segmentDBar:style.right',
					'segmentGBar:style.left',
					'segmentGBar:style.right'
				],
				vertSegmentMiddleEndPos:[
					'segmentBEndB:style.bottom',
					'segmentCEndA:style.top',
					'segmentEEndA:style.top',
					'segmentFEndB:style.bottom'
				],
				vertSegmentMiddleBarPos:[
					'segmentBBar:style.bottom',
					'segmentCBar:style.top',
					'segmentEBar:style.top',
					'segmentFBar:style.bottom'
				]
			}
		});
	}
});

