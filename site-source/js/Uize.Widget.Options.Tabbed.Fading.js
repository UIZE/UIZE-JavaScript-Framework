/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Options.Tabbed.Fading Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2013 UIZE
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
		The =Uize.Widget.Options.Tabbed.Fading= class extends its superclass by adding a crossfade JavaScript animation effect when switching from tab to tab.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.Options.Tabbed.Fading',
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
						var
							_this = this,
							_fade = _this._fade = _this.fade = Uize.Fade ({duration:1000})
						;
						_fade.wire ({
							'Changed.value':
								function () {
									var _progress = _fade.get ('progress');
									_this.setNodeOpacity (_this._nodeFadingOut,1 - _progress);
									_this.setNodeOpacity (_this._nodeFadingIn,_progress);
								},
							Done:
								function () {_this._cleanUpAfterFade ()}
						});
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._cleanUpAfterFade = function () {
				var _this = this;
				_this.setNodeProperties (_this._nodeFadingOut,{className:_this.get ('bodyClassInactive')});
				_this.setNodeOpacity (_this._nodeFadingOut,1);
				_this.setNodeOpacity (_this._nodeFadingIn,1);
				_this._nodeFadingIn = _this._nodeFadingOut = _null;
			};

		/*** Public Instance Methods ***/
			_classPrototype.updateUiTabState = function (_lastShownTabBodyNo,_currentValueNo) {
				var
					_this = this,
					_fadeInProgress = _this._fade.get ('inProgress')
				;
				if (_currentValueNo == _lastShownTabBodyNo) {
					_fadeInProgress ||
						_superclass.prototype.updateUiTabState.call (_this,_lastShownTabBodyNo,_currentValueNo)
					;
				} else {
					if (_fadeInProgress) {
						_this._fade.stop ();
						_this._cleanUpAfterFade ();
					}
					var _updateTabBodyClass = function (_valueNo) {
						var _node = _valueNo > -1 ? _this.getTabBodyNode (_valueNo) : _null;
						_this.setNodeProperties (_node,{className:_this.get ('bodyClassActive')});
						_this.setNodeOpacity (_node,_valueNo == _currentValueNo ? 0 : 1);
						return _node;
					};
					_this._nodeFadingOut = _updateTabBodyClass (_lastShownTabBodyNo);
					_this._nodeFadingIn = _updateTabBodyClass (_currentValueNo);
					_this._fade.start ();
				}
			};

		return _class;
	}
});

