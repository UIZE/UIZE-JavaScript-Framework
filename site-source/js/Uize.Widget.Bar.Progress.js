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
	required:'Uize.Fade',
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
					_superclass.prototype.wireUi.call (_this);

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
				html:{
					process:function (input) {
						/* compiled from...
							<div id="<% .idPrefix %>" style="position:relative; visibility:hidden; left:0px; top:0px; width:<%= input.width || 87 %>px; height:<%= input.height || 12 %>px; background:#888; border:2px solid #888;">
								<div id="<% .idPrefix %>-track" style="position:absolute; left:0px; top:0px; width:100%; height:100%;">
									<img src="<% .pathToResources %>Uize_Widget_Bar_Progress/track-bg.gif" style="position:absolute; left:0px; top:0px; width:100%; height:100%;"/>
									<img id="<% .idPrefix %>-full" src="<% .pathToResources %>Uize_Widget_Bar_Progress/full-bg.gif" style="position:absolute; left:0px; top:0px; width:100%; height:100%;"/>
									<img id="<% .idPrefix %>-knob" src="<% .blankGif %>" style="position:absolute; left:0px; top:0px; width:1px; height:100%; background:#f00;"/>
								</div>
							</div>
						*/
						var output = [];
						output.push("<div id=\"", input.idPrefix, "\" style=\"position:relative; visibility:hidden; left:0px; top:0px; width:", input.width || 87, "px; height:", input.height || 12, "px; background:#888; border:2px solid #888;\">\n	<div id=\"", input.idPrefix, "-track\" style=\"position:absolute; left:0px; top:0px; width:100%; height:100%;\">\n		<img src=\"", input.pathToResources, "Uize_Widget_Bar_Progress/track-bg.gif\" style=\"position:absolute; left:0px; top:0px; width:100%; height:100%;\"/>\n		<img id=\"", input.idPrefix, "-full\" src=\"", input.pathToResources, "Uize_Widget_Bar_Progress/full-bg.gif\" style=\"position:absolute; left:0px; top:0px; width:100%; height:100%;\"/>\n		<img id=\"", input.idPrefix, "-knob\" src=\"", input.blankGif, "\" style=\"position:absolute; left:0px; top:0px; width:1px; height:100%; background:#f00;\"/>\n	</div>\n</div>\n");
						return output.join("");
					}
				},
				orientation:'horizontal'
			});

		return _class;
	}
});

