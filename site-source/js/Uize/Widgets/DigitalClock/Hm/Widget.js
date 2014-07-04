/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.DigitalClock.Hm.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2014 UIZE
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
	superclass:'Uize.Widget.V2',
	required:[
		'Uize.Widget.mChildBindings',
		'Uize.Widgets.DigitalClock.Hm.Html',
		'Uize.Widgets.DigitalClock.Hm.Css',
		'Uize.Widgets.SegmentDisplay.Seven.Widget',
		'Uize.Widgets.SegmentDisplay.Separator.Widget',
		'Uize.Date.Formatter'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** General Variables for Scruncher Optimization ***/
				_digitWidgetProperties = {widgetClass:Uize.Widgets.SegmentDisplay.Seven.Widget}
		;

		return _superclass.subclass ({
			mixins:Uize.Widget.mChildBindings,

			omegastructor:function () {
				var m = this;
				function _updateTime () {m.set ({_value:Uize.now ()})}
				_updateTime ();
				m._updateInterval = setInterval (_updateTime,1000);
			},

			staticProperties:{
				cssModule:Uize.Widgets.DigitalClock.Hm.Css
			},

			set:{
				html:Uize.Widgets.DigitalClock.Hm.Html
			},

			stateProperties:{
				_value:'value',
				_hoursMode:{
					name:'hoursMode',
					value:'12'
				},
				hhMmSs:{
					derived:function (value,hoursMode) {
						return Uize.Date.Formatter.format (value,hoursMode == '12' ? '{hh12}{mm}{ss}' : '{hh}{mm}{ss}');
					}
				},
				hoursTensValue:{derived:'hhMmSs: hhMmSs.charAt (0) == "0" ? "" : hhMmSs.charAt (0)'},
				hoursOnesValue:{derived:'hhMmSs: hhMmSs.charAt (1)'},
				minutesTensValue:{derived:'hhMmSs: hhMmSs.charAt (2)'},
				minutesOnesValue:{derived:'hhMmSs: hhMmSs.charAt (3)'}
			},

			children:{
				hoursTens:_digitWidgetProperties,
				hoursOnes:_digitWidgetProperties,
				minutesTens:_digitWidgetProperties,
				minutesOnes:_digitWidgetProperties,
				hmSeparator:{widgetClass:Uize.Widgets.SegmentDisplay.Separator.Widget}
			},

			childBindings:{
				hoursTensValue:'->hoursTens.value',
				hoursOnesValue:'->hoursOnes.value',
				minutesTensValue:'->minutesTens.value',
				minutesOnesValue:'->minutesOnes.value'
			}
		});
	}
});

