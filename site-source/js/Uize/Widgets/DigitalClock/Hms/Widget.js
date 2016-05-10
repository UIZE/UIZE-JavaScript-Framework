/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.DigitalClock.Hms.Widget Class
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
		The =Uize.Widgets.DigitalClock.Hms.Widget= class implements a simple digital clock widget for displaying the time in hours, minutes, and seconds.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.DigitalClock.Hms.Widget= class...

			........................................................
			<< widget >>

			widgetClass: Uize.Widgets.DigitalClock.Hms.VisualSampler
			........................................................
*/

Uize.module ({
	name:'Uize.Widgets.DigitalClock.Hms.Widget',
	superclass:'Uize.Widgets.DigitalClock.Hm.Widget',
	required:[
		'Uize.Widgets.DigitalClock.Hms.Html',
		'Uize.Widgets.SegmentDisplay.Separator.Seven.Widget',
		'Uize.Widgets.SegmentDisplay.Seven.Widget'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** General Variables for Scruncher Optimization ***/
				_digitWidgetProperties = {widgetClass:Uize.Widgets.SegmentDisplay.Seven.Widget}
		;

		return _superclass.subclass ({
			set:{
				html:Uize.Widgets.DigitalClock.Hms.Html
			},

			stateProperties:{
				secondsTensValue:{derived:'hhMmSs: hhMmSs.charAt (4)'},
				secondsOnesValue:{derived:'hhMmSs: hhMmSs.charAt (5)'}
			},

			children:{
				msSeparator:{widgetClass:Uize.Widgets.SegmentDisplay.Separator.Seven.Widget},
				secondsTens:_digitWidgetProperties,
				secondsOnes:_digitWidgetProperties
			},

			childBindings:{
				secondsTensValue:'->secondsTens.value',
				secondsOnesValue:'->secondsOnes.value'
			}
		});
	}
});

