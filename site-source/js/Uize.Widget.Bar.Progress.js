/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Bar.Progress Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2013 UIZE
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

		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false,
				_null = null
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					function () {
						var _this = this;

						/*** Private Instance Properties ***/
							_this._totalProcesses = _this._totalProcessesTime = 0;
							_this._fade = Uize.Fade ({duration:4000});
							_this._fade.wire (
								'Changed.value',
								function () {_this.set ({value:+_this._fade})}
							);
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._updateUiShown = function () {
				this.showNode ('',this._inProgress);
			};

		/*** Public Instance Methods ***/
			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					_superclass.doMy (_this,'wireUi');

					_this._updateUiShown ();
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_inProgress:{
					name:'inProgress',
					onChange:function () {
						var
							_this = this,
							_nowMs = Uize.now ()
						;
						if (_this._inProgress) _this._startTime = _nowMs;
						if (!_this._inProgress && typeof _this._startTime == 'number') {
							_this._totalProcesses++;
							_this._totalProcessesTime += _nowMs - _this._startTime;
						}
						if (_this.isWired) {
							var _updateShown = function () {
								if (_this._vanishTimeout) {
									clearTimeout (_this._vanishTimeout);
									_this._vanishTimeout = _null;
								}
								_this._updateUiShown ();
							};
							if (_this._inProgress) {
								_this._fade.start ({duration:(_this._totalProcesses > 0 ? _this._totalProcessesTime / _this._totalProcesses : 3000) * _this._paddingFactor});
								_updateShown ();
							} else {
								_this._fade.stop ();
								_this._fade.set ({value:100});
								_this._vanishTimeout = setTimeout (_updateShown,_this._vanishTime);
							}
						}
					},
					value:_false
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
			});

		/*** Override Initial Values for Inherited State Properties ***/
			_class.set ({
				html:Uize.Templates.ProgressBar,
				orientation:'horizontal'
			});

		return _class;
	}
});

