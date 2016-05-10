/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.SegmentDisplay.mSegmentColor Mixin
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
	docCompleteness: 1
*/

/*?
	Introduction
		The =Uize.Widgets.SegmentDisplay.mSegmentColor= module implements a mixin for mixin in segment color features into a segment display widget class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.SegmentDisplay.mSegmentColor',
	required:'Uize.Color',
	builder:function () {
		'use strict';

		return function (_class) {
			_class.stateProperties ({
				segmentColor:{
					value:'3f6'
				},
				segmentOpacity:{
					value:1
				},
				segmentBgStyle:{
					derived:{
						properties:'segmentColor,segmentOpacity',
						derivation:function (_segmentColor,_segmentOpacity) {
							_segmentColor = Uize.Color (_segmentColor);
							if (_segmentOpacity == 1) {
								return _segmentColor.to ('#hex');
							} else {
								var _colorTuple = _segmentColor.tuple;
								_colorTuple [3] = _segmentOpacity;
								return 'rgba(' + _colorTuple.join (',') + ')';
							}
						}
					}
				}
			});
		};
	}
});

