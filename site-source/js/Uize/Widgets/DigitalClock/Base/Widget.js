/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.DigitalClock.Base.Widget Class
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
		The =Uize.Widgets.DigitalClock.Base.Widget= class implements an abstract base class for digital clock widgets.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.DigitalClock.Base.Widget',
	superclass:'Uize.Widget.V2',
	required:'Uize.Date.Formatter',
	builder:function (_superclass) {
		'use strict';

		var
			/*** General Variables ***/
				_msPerHour = 60 * 60 * 1000,
				_date = new Date,
				_machineTimeZone =
					(
						(_date.getHours () * 60 + _date.getMinutes ()) -
						(_date.getUTCHours () * 60 + _date.getUTCMinutes ())
					) / 60
		;

		/*** Utility Functions ***/
			function _twoDigit (_value) {return isNaN (_value) ? '??' : (_value < 10 ? '0' : '') + _value}

		return _superclass.subclass ({
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
				_timeZone:'timeZone',
				_hoursMode:{
					name:'hoursMode',
					value:'auto'
				},
				_hoursModeResolved:{
					name:'hoursModeResolved',
					derived:{
						properties:'hoursMode',
						derivation:function (_hoursMode) {
							return (
								_hoursMode == '24' ||
								(_hoursMode == 'auto' && !/AM|PM/.test ((new Date).toLocaleTimeString ()))
									? '24'
									: '12'
							);
						}
					}
				},
				_referenceTime:{
					name:'referenceTime'
				},
				hhMmSs:{
					derived:{
						properties:'value,timeZone,hoursModeResolved,referenceTime',
						derivation:function (_value,_timeZone,_hoursModeResolved,_referenceTime) {
							if (_hoursModeResolved == 'timer') {
								var
									_elapsed = _value - _referenceTime,
									_minutesElapsed = Math.floor (_elapsed / 1000 / 60),
									_secondsElapsed = Math.floor ((_elapsed - (_minutesElapsed * 1000 * 60)) / 1000)
								;
								return _twoDigit (_minutesElapsed) + _twoDigit (_secondsElapsed);
							} else {
								return Uize.Date.Formatter.format (
									_timeZone != null
										? (new Date (_value)).getTime () + (_timeZone - _machineTimeZone) * _msPerHour
										: _value,
									_hoursModeResolved == '12' ? '{hh12}{mm}{ss}' : '{hh}{mm}{ss}'
								);
							}
						}
					}
				},
				hoursTensValue:{derived:'hhMmSs: this.remapDigitValue (0,hhMmSs.charAt (0))'},
				hoursOnesValue:{derived:'hhMmSs: this.remapDigitValue (1,hhMmSs.charAt (1))'},
				minutesTensValue:{derived:'hhMmSs: this.remapDigitValue (2,hhMmSs.charAt (2))'},
				minutesOnesValue:{derived:'hhMmSs: this.remapDigitValue (3,hhMmSs.charAt (3))'}
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

