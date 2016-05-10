/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Options.Tabbed.Fading Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2016 UIZE
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

		/*** Private Instance Methods ***/
			function _cleanUpAfterFade (m) {
				m.setNodeProperties (m._nodeFadingOut,{className:m.get ('bodyClassInactive')});
				m.setNodeOpacity (m._nodeFadingOut,1);
				m.setNodeOpacity (m._nodeFadingIn,1);
				m._nodeFadingIn = m._nodeFadingOut = null;
			}

		return _superclass.subclass ({
			alphastructor:function () {
				var
					m = this,
					_fade = m._fade = m.fade = Uize.Fade ({duration:1000})
				;
				_fade.wire ({
					'Changed.value':
						function () {
							var _progress = _fade.get ('progress');
							m.setNodeOpacity (m._nodeFadingOut,1 - _progress);
							m.setNodeOpacity (m._nodeFadingIn,_progress);
						},
					Done:
						function () {_cleanUpAfterFade (m)}
				});
			},

			instanceMethods:{
				updateUiTabState:function (_lastShownTabBodyNo,_currentValueNo) {
					var
						m = this,
						_fadeInProgress = m._fade.get ('inProgress')
					;
					if (_currentValueNo == _lastShownTabBodyNo) {
						_fadeInProgress ||
							_superclass.doMy (m,'updateUiTabState',[_lastShownTabBodyNo,_currentValueNo])
						;
					} else {
						if (_fadeInProgress) {
							m._fade.stop ();
							_cleanUpAfterFade (m);
						}
						var _updateTabBodyClass = function (_valueNo) {
							var _node = _valueNo > -1 ? m.getTabBodyNode (_valueNo) : null;
							m.setNodeProperties (_node,{className:m.get ('bodyClassActive')});
							m.setNodeOpacity (_node,_valueNo == _currentValueNo ? 0 : 1);
							return _node;
						};
						m._nodeFadingOut = _updateTabBodyClass (_lastShownTabBodyNo);
						m._nodeFadingIn = _updateTabBodyClass (_currentValueNo);
						m._fade.start ();
					}
				}
			}
		});
	}
});

