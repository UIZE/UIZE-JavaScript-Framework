/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.SegmentDisplay.Separator.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
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
		The =Uize.Widgets.SegmentDisplay.Separator.Widget= module implements a widget class for a separator for the hours, minutes, and seconds components of a digital clock display.

		*DEVELOPERS:*

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.SegmentDisplay.Separator.Widget= class...

			..............................................................
			<< widget >>

			widgetClass: Uize.Widgets.SegmentDisplay.Separator.VisualSampler
			..............................................................
*/

Uize.module ({
	name:'Uize.Widgets.SegmentDisplay.Separator.Widget',
	superclass:'Uize.Widget.V2',
	required:[
		'Uize.Widgets.SegmentDisplay.Separator.Html',
		'Uize.Widgets.SegmentDisplay.Separator.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			set:{
				html:Uize.Widgets.SegmentDisplay.Separator.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.SegmentDisplay.Separator.Css
			},

			stateProperties:{
				_segmentColor:{
					name:'segmentColor',
					value:'3f6'
				},

				/*** derived properties for HTML bindings ***/
					segmentColorAsRgbHex:{
						derived:'segmentColor: "#" + segmentColor'
					}
			},

			htmlBindings:{
				segmentColorAsRgbHex:[
					'colonTop:style.background',
					'colonBottom:style.background'
				]
			}
		});
	}
});

