/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.SegmentDisplay.Separator.Matrix3x5.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 5
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Widgets.SegmentDisplay.Separator.Matrix3x5.Widget= module implements a widget class for a separator for the hours, minutes, and seconds components of a 3x5 matrix digital clock display.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.SegmentDisplay.Separator.Matrix3x5.Widget= class...

			..........................................................................
			<< widget >>

			widgetClass: Uize.Widgets.SegmentDisplay.Separator.Matrix3x5.VisualSampler
			..........................................................................
*/

Uize.module ({
	name:'Uize.Widgets.SegmentDisplay.Separator.Matrix3x5.Widget',
	superclass:'Uize.Widgets.SegmentDisplay.Separator.Widget',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			stateProperties:{
				_segmentGap:{
					name:'segmentGap',
					value:1
				},

				/*** derived properties for HTML bindings ***/
					colonHeight:{
						derived:'height,segmentGap: Math.round ((height - 4 * segmentGap) / 5)'
					},
					colonPos:{
						derived:'colonHeight,segmentGap: colonHeight + segmentGap'
					}
			},

			set:{
				width:6,
				height:34
			}
		});
	}
});

