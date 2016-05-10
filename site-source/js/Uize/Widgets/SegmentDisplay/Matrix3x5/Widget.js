/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.SegmentDisplay.Matrix3x5.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
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
		'Uize.Widgets.SegmentDisplay.mSegmentColor',
		'Uize.Widgets.SegmentDisplay.Matrix3x5.Html',
		'Uize.Widgets.SegmentDisplay.Matrix3x5.Css'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** General Variables ***/
				_rows = 5,
				_cols = 3,
				_segmentLetters = Uize.map (_rows * _cols,'String.fromCharCode (65 + key)'),
				_segmentStateProperties = {},
				_segmentHtmlBindings = {}
		;

		/*** define state properties and HTML bindings for segment row positions and dimensions ***/
			Uize.forEach (
				_rows,
				function (_value,_rowNo) {
					var _rowCol0LetterNo = _rowNo * 3;

					_segmentStateProperties ['row' + _rowNo + 'Top'] = {
						derived:'rowPositions: rowPositions [' + _rowNo + '].pos'
					};
					_segmentStateProperties ['row' + _rowNo + 'Height'] = {
						derived:'rowPositions: rowPositions [' + _rowNo + '].dim'
					};

					_segmentHtmlBindings ['row' + _rowNo + 'Top'] = Uize.map (
						_cols,
						function (_value,_colNo) {
							return 'segment' + _segmentLetters [_rowCol0LetterNo + _colNo] + ':style.top';
						}
					);
					_segmentHtmlBindings ['row' + _rowNo + 'Height'] = Uize.map (
						_cols,
						function (_value,_colNo) {
							return 'segment' + _segmentLetters [_rowCol0LetterNo + _colNo] + ':style.height';
						}
					);
				}
			);

		/*** define derived state properties and HTML bindings for segment column positions and dimensions ***/
			Uize.forEach (
				_cols,
				function (_value,_colNo) {
					_segmentStateProperties ['col' + _colNo + 'Left'] = {
						derived:'colPositions: colPositions [' + _colNo + '].pos'
					};
					_segmentStateProperties ['col' + _colNo + 'Width'] = {
						derived:'colPositions: colPositions [' + _colNo + '].dim'
					};

					_segmentHtmlBindings ['col' + _colNo + 'Left'] = Uize.map (
						_rows,
						function (_value,_rowNo) {
							return 'segment' + _segmentLetters [_colNo + _rowNo * _cols] + ':style.left';
						}
					);
					_segmentHtmlBindings ['col' + _colNo + 'Width'] = Uize.map (
						_rows,
						function (_value,_rowNo) {
							return 'segment' + _segmentLetters [_colNo + _rowNo * _cols] + ':style.width';
						}
					);
				}
			);

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
				cssModule:Uize.Widgets.SegmentDisplay.Matrix3x5.Css
			},

			set:{
				segmentColor:'000',
				width:20,
				height:34,
				html:Uize.Widgets.SegmentDisplay.Matrix3x5.Html
			},

			stateProperties:{
				_segmentGap:{
					name:'segmentGap',
					value:1
				},

				/*** derived properties for HTML bindings ***/
					colPositions:{
						derived:{
							properties:'width,segmentGap',
							derivation:function (_width,_segmentGap) {
								return _calculateSegmentsPosAndDim (_width,_segmentGap,_cols);
							}
						}
					},
					rowPositions:{
						derived:{
							properties:'height,segmentGap',
							derivation:function (_height,_segmentGap) {
								return _calculateSegmentsPosAndDim (_height,_segmentGap,_rows);
							}
						}
					}
			},

			htmlBindings:{
				segmentBgStyle:Uize.map (_segmentLetters,'"segment" + value + ":style.background"'),
			}
		}).declare ({
			stateProperties:_segmentStateProperties,
			htmlBindings:_segmentHtmlBindings
		});
	}
});

