/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.SlideShow.AutoAdvance Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2006-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 3
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.SlideShow.AutoAdvance= extends its superclass by adding a configurable auto-advance behavior so that user interaction is not necesary.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.SlideShow.AutoAdvance',
	required:'Uize.Widget.Button',
	builder:function (_superclass) {
		'use strict';

		/*** Private Instance Methods ***/
			function _clearAutoAdvanceTimeout (m) {
				if (m._autoAdvanceTimeout) {
					clearTimeout (m._autoAdvanceTimeout);
					m._autoAdvanceTimeout = null;
				}
			}

			function _clearResumeTimeout (m) {
				if (m._resumeTimeout) {
					clearTimeout (m._resumeTimeout);
					m._resumeTimeout = null;
				}
			}

			function _autoAdvance (m) {
				_clearAutoAdvanceTimeout (m);
				m.advance (1);
			}

		return _superclass.subclass ({
			omegastructor:function () {
				var m = this;

				/*** make play button ***/
					m._play = m.addChild (
						'play',
						Uize.Widget.Button,
						{
							action:function () {m.toggle ('playing')},
							playing:m._playing
						}
					);

				/*** pause auto-advance if the user interacts with the slideshow ***/
					function _handleButtonClick (_buttonName) {
						m.children [_buttonName].wire (
							'Click',function () {m._playing && m.stopThenResume ()}
						);
					}
					_handleButtonClick ('previous');
					_handleButtonClick ('next');
					_handleButtonClick ('first');
					_handleButtonClick ('last');
			},

			instanceMethods:{
				wipeDone:function () {
					var m = this;
					if (m._playing) {
						_clearAutoAdvanceTimeout (m);
						m._autoAdvanceTimeout = setTimeout (function () {_autoAdvance (m)},m._interSlideTime);
					}
				},

				stopThenResume:function () {
					var m = this;
					m.set ({_playing:false});
					m._resumeTimeout = setTimeout (function () {m.set ({_playing:true})},m._idleResumeTime);
				}
			},

			stateProperties:{
				_idleResumeTime:{
					name:'idleResumeTime',
					value:1000
				},
				_interSlideTime:{
					name:'interSlideTime',
					value:4000
				},
				_playing:{
					name:'playing',
					onChange:function () {
						var m = this;
						if (m._playing) {
						if (m._interSlideTime && m._interSlideTime < 0) {
							m.set({ playing: false });
						} else {
							_clearResumeTimeout (m);
							_clearAutoAdvanceTimeout (m);
							m._autoAdvanceTimeout = setTimeout (function () {_autoAdvance (m)},m._interSlideTime);
						}
						} else {
							_clearAutoAdvanceTimeout (m);
							_clearResumeTimeout (m);
						}
						m._play && m._play.set ({playing:m._playing});
					},
					value:false
				}
			}
		});
	}
});

