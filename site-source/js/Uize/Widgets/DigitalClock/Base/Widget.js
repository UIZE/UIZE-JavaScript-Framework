/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.DigitalClock.Base.Widget Class
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
		The =Uize.Widgets.DigitalClock.Base.Widget= class implements an abstract base class for digital clock widgets.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.DigitalClock.Base.Widget',
	superclass:'Uize.Widget.V2',
	required:[
		'Uize.Widget.mChildBindings',
		'Uize.Date.Formatter'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			mixins:Uize.Widget.mChildBindings,

			omegastructor:function () {
				var m = this;
				function _updateTime () {m.set ({_value:Uize.now ()})}
				_updateTime ();
				m._updateInterval = setInterval (_updateTime,1000);
			},

			instanceMethods:{
				remapDigitValue:function (_digit,_value) {return _value}
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
				hoursTensValue:{derived:function (hhMmSs) {return this.remapDigitValue (0,hhMmSs.charAt (0))}},
				hoursOnesValue:{derived:function (hhMmSs) {return this.remapDigitValue (1,hhMmSs.charAt (1))}},
				minutesTensValue:{derived:function (hhMmSs) {return this.remapDigitValue (2,hhMmSs.charAt (2))}},
				minutesOnesValue:{derived:function (hhMmSs) {return this.remapDigitValue (3,hhMmSs.charAt (3))}}
			},

			children:{
				hoursTens:{},
				hoursOnes:{},
				minutesTens:{},
				minutesOnes:{},
				hmSeparator:{}
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

