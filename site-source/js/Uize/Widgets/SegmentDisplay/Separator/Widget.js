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
	codeCompleteness: 100
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Widgets.SegmentDisplay.Separator.Widget= module implements an abstract base class for a colon style separator widget to be used with segment display widgets to form displays such as time displays.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.SegmentDisplay.Separator.Widget',
	superclass:'Uize.Widget.V2',
	required:[
		'Uize.Widget.mWidthHeight',
		'Uize.Widgets.SegmentDisplay.Separator.Html',
		'Uize.Widgets.SegmentDisplay.Separator.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			mixins:Uize.Widget.mWidthHeight,

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
					segmentColorAsRgbHex:{derived:'segmentColor: "#" + segmentColor'},
					colonHeight:{},
					colonPos:{},
					colonHeightPx:{derived:'colonHeight: colonHeight + "px"'},
					colonPosPx:{derived:'colonPos: colonPos + "px"'}
			},

			htmlBindings:{
				segmentColorAsRgbHex:[
					'colonTop:style.background',
					'colonBottom:style.background'
				],
				colonHeightPx:[
					'colonTop:style.height',
					'colonBottom:style.height'
				],
				colonPosPx:[
					'colonTop:style.top',
					'colonBottom:style.bottom'
				]
			}
		});
	}
});

