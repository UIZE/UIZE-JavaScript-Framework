/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.EggTimer Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 2
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.EggTimer= class implements a countdown timer widget (or egg timer), where digits flip at intervals using a JavaScript animation effect.

		*DEVELOPERS:* `Jan Borgersen`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.EggTimer',
	required:'Uize.Widget.Count',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			alphastructor:function () {
				var m = this;

				/*** Private Instance Properties ***/
					m._timeout = null;
					m._running = false;
					m._callAdvance = function () {m.advance ()};
			},

			instanceMethods:{
				advance:function () {
					var m = this;
					if( m._running ) {
						m.children.seconds.down();
						m._timeout = setTimeout( m._callAdvance, 1000 );
					}
				},

				resetTo:function (_timeObject) {
					var m = this;
					m._running = false;
					m.set ({startTime:_timeObject});
					m._showSeconds && m.children.seconds.setCount( _timeObject.seconds );
					m._showMinutes && m.children.minutes.setCount( _timeObject.minutes );
					m._showHours && m.children.hours.setCount( _timeObject.hours );
					m._showDays && m.children.days.setCount( _timeObject.days );
				},

				reset:function () {
					this.resetTo(this._startTime);
				},

				resume:function () {
					var m = this;
					m._running = true;
					m._timeout = setTimeout( m._callAdvance, 1000 );
				},

				stop:function () {
					this._running = false;
				},

				wireUi:function () {
					var m = this;
					if (!m.isWired) {
						var
							_idPrefix = m.get ('idPrefix'),
							_newCount = function (_name, _count, _limit) {
								var _countWidget = m.addChild (
									_name,
									Uize.Widget.Count,
									{
										digits: 2,
										limit: _limit,
										numbersImagesPath:m._numbersImagesPath,
										numbersFiletype:m._numbersFiletype
									}
								);
								_countWidget.wireUi();
								_countWidget.setCount( _count );
								return _countWidget;
							},
							_zero = function () {
								if( (!m._showMinutes || (m._showMinutes && !m.children.minutes.getCount()))
									&& (!m._showHours || (m._showHours && !m.children.hours.getCount()))
									&& (!m._showDays || (m._showDays && !m.children.days.getCount())) ) {
									m._running = false;
									m.fire('zero');
									if(m._redirectUrl != '')
										document.location.href=m._redirectUrl;
								}
							}
						;
						m._showSeconds &&
							_newCount ('seconds',m._startTime.seconds,59)
								.wire ({
									zero:_zero,
									limit:function () {m._showMinutes && m.children.minutes.down ()}
								})
						;
						m._showMinutes &&
							_newCount ('minutes',m._startTime.minutes,59)
								.wire ('limit',function () {m._showHours && m.children.hours.down ()})
						;
						m._showHours &&
							_newCount ('hours',m._startTime.hours,23)
							.wire ('limit',function () {m._showDays && m.children.days.down ()})
						;
						m._showDays &&
							_newCount ('days',m._startTime.days,99)
						;

						_superclass.doMy (m,'wireUi');
						if( m._autoStart )
							m.resume();
					}
				}
			},

			stateProperties:{
				_autoStart:{
					name:'autoStart',
					value:false
				},
				_startTime:{
					name:'startTime',
					value:{ days: 0, hours: 0, minutes: 0, seconds: 0 }
				},
				_limit:{
					name:'limit',
					value:{ days: 0, hours: 0, minutes: 0, seconds: 0 }
				},
				_showDays:{
					name:'showDays',
					value:true
				},
				_showHours:{
					name:'showHours',
					value:true
				},
				_showMinutes:{
					name:'showMinutes',
					value:true
				},
				_showSeconds:{
					name:'showSeconds',
					value:true
				},
				_redirectUrl:{
					name:'redirectUrl',
					value:''
				},
				_direction:{
					name:'direction',
					value:'down'
				},
				_numbersImagesPath:{
					name:'numbersImagesPath',
					value:''
				},
				_numbersFiletype:{
					name:'numbersFiletype',
					value:'gif'
				}
			}
		});
	}
});

