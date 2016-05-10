/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.ImagePort Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 2
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.ImagePort= class manages sizing and positioning an image in a view port, using logical (rather than explicit) size and position values.

		*DEVELOPERS:* `Chris van Rensburg`

		The =Uize.Widget.ImagePort= class supports logical sizing behaviors such as fit and fill, and logical positioning behaviors such as left, center, and right aligned, or top, center, and bottom aligned, among others.
*/

Uize.module ({
	name:'Uize.Widget.ImagePort',
	required:[
		'Uize.Dom.Basics',
		'Uize.Dom.Pos',
		'Uize.Math.LogicalPos'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize_Dom_Basics = Uize.Dom.Basics,
				_Uize_Dom_Pos = Uize.Dom.Pos,
				_Uize_Math_LogicalPos = Uize.Math.LogicalPos,

			/*** General Variables ***/
				_isIe = Uize.Dom.Basics.isIe,
				_paramsToDefaultForGetScaledRect = [
					'coordConverter','sizingLowerBound','sizingUpperBound','sizingValue','maxScaling','alignX','alignY'
				],
				_paramsToDefaultForGetSizingAndAlign = ['sizingLowerBound','sizingUpperBound']
		;

		/*** Private Instance Methods ***/
			function _updateUiPosition (m) {
				if (m.isWired) {
					var
						_paramsForGetScaledRect = m._paramsForGetScaledRect,
						_scaledImageCoords = m.getScaledRect (_paramsForGetScaledRect)
					;
					m.setNodeStyle ('image',_scaledImageCoords);
					m.set ({
						_alignApplicableX:
							!!(m.portVsScaledDelta [0] = _paramsForGetScaledRect.portWidth - _scaledImageCoords.width),
						_alignApplicableY:
							!!(m.portVsScaledDelta [1] = _paramsForGetScaledRect.portHeight - _scaledImageCoords.height)
					});
				}
			};

			function _updateAfterPositionChanged () {
				_updateUiPosition (this);
				this.fire ('Position Changed');
			}

		return _superclass.subclass ({
			instanceMethods:{
				updateUi:function () {
					var m = this;
					if (m.isWired) {
						var _shellDims = _Uize_Dom_Pos.getDimensions (m.getNode ());
						if (!m._imageNaturalWidth) {
							var _imageDims = _Uize_Dom_Pos.getDimensions (m.getNode ('image'));
							m._imageNaturalWidth = _imageDims.width;
							m._imageNaturalHeight = _imageDims.height;
						}
						if (m._imageNaturalWidth) {
							m._paramsForGetScaledRect = {
								portWidth:_shellDims.width,
								portHeight:_shellDims.height,
								rectWidth:m._imageNaturalWidth,
								rectHeight:m._imageNaturalHeight
							};
							_isIe && m.setNodeStyle ('image',{msInterpolationMode:'bicubic'});
							_updateUiPosition (m);
						} else {
							setTimeout (function () {m.updateUi ()},0);
						}
					}
				},

				wireUi:function () {
					var m = this;
					if (!m.isWired) {
						m.setNodeStyle ('',{overflow:'hidden'});
						m.setNodeStyle ('image',{position:'absolute'});
						m.portVsScaledDelta = [];

						_superclass.doMy (m,'wireUi');
					}
				}
			},

			dualContextMethods:{
				getScaledRect:function (_params) {
					return _Uize_Math_LogicalPos.getScaledRect (_params,this.get (_paramsToDefaultForGetScaledRect));
				},

				getSizingAndAlign:function (_params) {
					return _Uize_Math_LogicalPos.getSizingAndAlign (_params,this.get (_paramsToDefaultForGetSizingAndAlign));
				}
			},

			stateProperties:{
				_alignApplicableX:'alignApplicableX', // read only
				_alignApplicableY:'alignApplicableY', // read only
				_alignX:{
					name:'alignX',
					onChange:_updateAfterPositionChanged,
					value:.5
				},
				_alignY:{
					name:'alignY',
					onChange:_updateAfterPositionChanged,
					value:.5
				},
				_coordConverter:{
					name:'coordConverter',
					value:Uize.returnX
				},
				_maxScaling:{
					name:'maxScaling',
					onChange:_updateAfterPositionChanged,
					value:Infinity
				},
				_sizingLowerBound:{
					name:'sizingLowerBound',
					onChange:_updateAfterPositionChanged,
					value:'fit'
				},
				_sizingUpperBound:{
					name:'sizingUpperBound',
					onChange:_updateAfterPositionChanged,
					value:'fill'
				},
				_sizingValue:{
					name:'sizingValue',
					onChange:_updateAfterPositionChanged,
					value:1
				}
			}
		});
	}
});

