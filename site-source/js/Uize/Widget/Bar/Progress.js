/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Bar.Progress Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 3
	codeCompleteness: 100
	docCompleteness: 7
*/

/*?
	Introduction
		The =Uize.Widget.Bar.Progress= class implements a progress bar that estimates the duration of operations using the known durations of past operations.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.Bar.Progress',
	required:[
		'Uize.Fade',
		'Uize.Templates.ProgressBar'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Private Instance Methods ***/
			function _updateUiShown () {
				this.isWired && this.showNode ('',this._inProgress);
			}

		return _superclass.subclass ({
			alphastructor:function () {
				var m = this;

				/*** Private Instance Properties ***/
					m._totalProcesses = m._totalProcessesTime = 0;
					(m._fade = Uize.Fade ({duration:4000})).wire (
						'Changed.value',
						function (_event) {m.set ({value:_event.newValue})}
					);
			},

			instanceMethods:{
				updateUi:_updateUiShown
			},

			stateProperties:{
				_inProgress:{
					name:'inProgress',
					onChange:function () {
						var
							m = this,
							_nowMs = Uize.now ()
						;
						if (m._inProgress) m._startTime = _nowMs;
						if (!m._inProgress && typeof m._startTime == 'number') {
							m._totalProcesses++;
							m._totalProcessesTime += _nowMs - m._startTime;
						}
						if (m.isWired) {
							var _updateShown = function () {
								if (m._vanishTimeout) {
									clearTimeout (m._vanishTimeout);
									m._vanishTimeout = null;
								}
								_updateUiShown.call (m);
							};
							if (m._inProgress) {
								m._fade.start ({duration:(m._totalProcesses > 0 ? m._totalProcessesTime / m._totalProcesses : 3000) * m._paddingFactor});
								_updateShown ();
							} else {
								m._fade.stop ();
								m._fade.set ({value:100});
								m._vanishTimeout = setTimeout (_updateShown,m._vanishTime);
							}
						}
					},
					value:false
					/*?
						State Properties
							inProgress
								[DOCUMENT]
					*/
				},
				_paddingFactor:{
					name:'paddingFactor',
					value:1.5
					/*?
						State Properties
							paddingFactor
								[DOCUMENT]
					*/
				},
				_vanishTime:{
					name:'vanishTime',
					value:250
					/*?
						State Properties
							vanishTime
								[DOCUMENT]
					*/
				}
			},

			set:{
				html:Uize.Templates.ProgressBar,
				orientation:'horizontal'
			}
		});
	}
});

