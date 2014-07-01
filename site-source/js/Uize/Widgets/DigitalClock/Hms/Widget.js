/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.DigitalClock.Hms.Widget Class
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
	superclass:'Uize.Widget.V2',
	required:[
		'Uize.Widget.mV2',
		'Uize.Widgets.DigitalClock.Hms.Html',
		'Uize.Widgets.DigitalClock.Hms.Css',
		'Uize.Widgets.SegmentDisplay.Seven.Widget',
		'Uize.Date.Formatter'
	],
	builder:function (_superclass) {
		'use strict';

		var _digits = {hoursTens:0,hoursOnes:1,minutesTens:2,minutesOnes:3,secondsTens:4,secondsOnes:5};

		return _superclass.subclass ({
			omegastructor:function () {
				var m = this;
				function _updateTime () {m.set ({_value:Uize.now ()})}
				_updateTime ();
				m._updateInterval = setInterval (_updateTime,1000);
			},

			stateProperties:{
				_value:'value',
				hhMmSs:{
					derived:function (value) {return Uize.Date.Formatter.format (value,'{hh}{mm}{ss}')},
					onChange:function () {
						var m = this;
						m.once (
							'wired',
							function () {
								var
									_hhMsSs = m.hhMmSs,
									_children = m.children
								;
								for (var _digit in _digits) {
									var _digitValue = _hhMsSs.charAt (_digits [_digit]);
									_children [_digit].set ({
										value:_digit == 'hoursTens' && _digitValue == '0' ? '' : _digitValue
									});
								}
							}
						);
					}
				}
			},

			staticProperties:{
				cssModule:Uize.Widgets.DigitalClock.Hms.Css
			},

			set:{
				html:Uize.Widgets.DigitalClock.Hms.Html
			},

			children:Uize.map (_digits,function () {return {widgetClass:Uize.Widgets.SegmentDisplay.Seven.Widget}})
		});
	}
});

