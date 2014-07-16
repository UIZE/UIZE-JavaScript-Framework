/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.SegmentDisplay.Matrix3x5.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
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
		The =Uize.Widgets.SegmentDisplay.Matrix3x5.Widget= class implements a 3x5 matrix display widget, complete with HTML and CSS, and with configurable segment width, segment color, and dim segment opacity.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.SegmentDisplay.Matrix3x5.Widget= class...

			................................................................
			<< widget >>

			widgetClass: Uize.Widgets.SegmentDisplay.Matrix3x5.VisualSampler
			................................................................
*/

Uize.module ({
	name:'Uize.Widgets.SegmentDisplay.Matrix3x5.Widget',
	superclass:'Uize.Widget.SegmentDisplay.Matrix3x5',
	required:[
		'Uize.Widget.mV2',
		'Uize.Widget.mWidthHeight',
		'Uize.Widgets.SegmentDisplay.Matrix3x5.Html',
		'Uize.Widgets.SegmentDisplay.Matrix3x5.Css'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Utility Functions ***/
			function _calculateSegmentsPosAndDim (_dim,_segmentGap,_totalSegments) {
				var
					_distriburableDim = _dim - (_totalSegments - 1) * _segmentGap,
					_pos = 0
				;
				return Uize.map (
					_totalSegments,
					function (_value,_key) {
						var
							_segmentDim = Math.round (_distriburableDim / (_totalSegments - _key)),
							_segmentPosAndDim = {
								pos:_pos,
								dim:_segmentDim
							}
						;
						_pos += _segmentDim + _segmentGap;
						_distriburableDim -= _segmentDim;
						return _segmentPosAndDim;
					}
				);
			}

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
				cssModule:Uize.Widgets.SegmentDisplay.Matrix3x5.Css
			},

			set:{
				width:20,
				height:34,
				html:Uize.Widgets.SegmentDisplay.Matrix3x5.Html
			},

			stateProperties:{
				_segmentColor:{
					name:'segmentColor',
					value:'000'
				},
				_segmentGap:{
					name:'segmentGap',
					value:1
				},

				/*** derived properties for HTML bindings ***/
					segmentColorAsRgbHex:{
						derived:'segmentColor: "#" + segmentColor'
					},

					colPositions:{
						derived:function (width,segmentGap) {return _calculateSegmentsPosAndDim (width,segmentGap,3)}
					},
					col0Left:{derived:'colPositions: colPositions [0].pos + "px"'},
					col0Width:{derived:'colPositions: colPositions [0].dim + "px"'},
					col1Left:{derived:'colPositions: colPositions [1].pos + "px"'},
					col1Width:{derived:'colPositions: colPositions [1].dim + "px"'},
					col2Left:{derived:'colPositions: colPositions [2].pos + "px"'},
					col2Width:{derived:'colPositions: colPositions [2].dim + "px"'},

					rowPositions:{
						derived:function (height,segmentGap) {return _calculateSegmentsPosAndDim (height,segmentGap,5)}
					},
					row0Top:{derived:'rowPositions: rowPositions [0].pos + "px"'},
					row0Height:{derived:'rowPositions: rowPositions [0].dim + "px"'},
					row1Top:{derived:'rowPositions: rowPositions [1].pos + "px"'},
					row1Height:{derived:'rowPositions: rowPositions [1].dim + "px"'},
					row2Top:{derived:'rowPositions: rowPositions [2].pos + "px"'},
					row2Height:{derived:'rowPositions: rowPositions [2].dim + "px"'},
					row3Top:{derived:'rowPositions: rowPositions [3].pos + "px"'},
					row3Height:{derived:'rowPositions: rowPositions [3].dim + "px"'},
					row4Top:{derived:'rowPositions: rowPositions [4].pos + "px"'},
					row4Height:{derived:'rowPositions: rowPositions [4].dim + "px"'}
			},

			htmlBindings:{
				segmentColorAsRgbHex:Uize.map ('ABCDEFGHIJKLMNO'.split (''),'"segment" + value + ":style.background"'),

				row0Top:[
					'segmentA:style.top',
					'segmentB:style.top',
					'segmentC:style.top'
				],
				row0Height:[
					'segmentA:style.height',
					'segmentB:style.height',
					'segmentC:style.height'
				],

				row1Top:[
					'segmentD:style.top',
					'segmentE:style.top',
					'segmentF:style.top'
				],
				row1Height:[
					'segmentD:style.height',
					'segmentE:style.height',
					'segmentF:style.height'
				],

				row2Top:[
					'segmentG:style.top',
					'segmentH:style.top',
					'segmentI:style.top'
				],
				row2Height:[
					'segmentG:style.height',
					'segmentH:style.height',
					'segmentI:style.height'
				],

				row3Top:[
					'segmentJ:style.top',
					'segmentK:style.top',
					'segmentL:style.top'
				],
				row3Height:[
					'segmentJ:style.height',
					'segmentK:style.height',
					'segmentL:style.height'
				],

				row4Top:[
					'segmentM:style.top',
					'segmentN:style.top',
					'segmentO:style.top'
				],
				row4Height:[
					'segmentM:style.height',
					'segmentN:style.height',
					'segmentO:style.height'
				],

				col0Left:[
					'segmentA:style.left',
					'segmentD:style.left',
					'segmentG:style.left',
					'segmentJ:style.left',
					'segmentM:style.left'
				],
				col0Width:[
					'segmentA:style.width',
					'segmentD:style.width',
					'segmentG:style.width',
					'segmentJ:style.width',
					'segmentM:style.width'
				],

				col1Left:[
					'segmentB:style.left',
					'segmentE:style.left',
					'segmentH:style.left',
					'segmentK:style.left',
					'segmentN:style.left'
				],
				col1Width:[
					'segmentB:style.width',
					'segmentE:style.width',
					'segmentH:style.width',
					'segmentK:style.width',
					'segmentN:style.width'
				],

				col2Left:[
					'segmentC:style.left',
					'segmentF:style.left',
					'segmentI:style.left',
					'segmentL:style.left',
					'segmentO:style.left'
				],
				col2Width:[
					'segmentC:style.width',
					'segmentF:style.width',
					'segmentI:style.width',
					'segmentL:style.width',
					'segmentO:style.width'
				]
			}
		});
	}
});

