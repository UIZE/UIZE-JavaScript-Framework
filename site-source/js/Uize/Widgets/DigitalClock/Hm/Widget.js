/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.DigitalClock.Hm.Widget Class
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
		The =Uize.Widgets.DigitalClock.Hm.Widget= class implements a simple digital clock widget for displaying the time in hours, minutes, and seconds.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.DigitalClock.Hm.Widget= class...

			........................................................
			<< widget >>

			widgetClass: Uize.Widgets.DigitalClock.Hm.VisualSampler
			........................................................
*/

Uize.module ({
	name:'Uize.Widgets.DigitalClock.Hm.Widget',
	superclass:'Uize.Widgets.DigitalClock.Base.Widget',
	required:[
		'Uize.Widgets.DigitalClock.Hm.Html',
		'Uize.Widgets.DigitalClock.Hm.Css',
		'Uize.Widgets.SegmentDisplay.Seven.Widget',
		'Uize.Widgets.SegmentDisplay.Separator.Seven.Widget'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** General Variables for Scruncher Optimization ***/
				_digitWidgetProperties = {widgetClass:Uize.Widgets.SegmentDisplay.Seven.Widget}
		;

		return _superclass.subclass ({
			instanceMethods:{
				remapDigitValue:function (_digit,_value) {
					return _digit > 1 && _value == '1' ? 'l' : _value;
				}
			},

			staticProperties:{
				cssModule:Uize.Widgets.DigitalClock.Hm.Css
			},

			set:{
				html:Uize.Widgets.DigitalClock.Hm.Html
			},

			children:{
				hoursTens:_digitWidgetProperties,
				hoursOnes:_digitWidgetProperties,
				minutesTens:_digitWidgetProperties,
				minutesOnes:_digitWidgetProperties,
				hmSeparator:{widgetClass:Uize.Widgets.SegmentDisplay.Separator.Seven.Widget}
			}
		});
	}
});

