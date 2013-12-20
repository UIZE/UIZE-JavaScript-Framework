/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.SlideShow.AutoAdvance Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2006-2013 UIZE
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

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function () {
						var m = this;

						/*** make play button ***/
							(m._play = m._addChildButton ('play',function () {m.toggle ('playing')}))
								.set ({playing:m._playing})
							;

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
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._addChildButton = Uize.Widget.Button.addChildButton;

			_classPrototype._clearAutoAdvanceTimeout = function () {
				var m = this;
				if (m._autoAdvanceTimeout) {
					clearTimeout (m._autoAdvanceTimeout);
					m._autoAdvanceTimeout = null;
				}
			};

			_classPrototype._clearResumeTimeout = function () {
				var m = this;
				if (m._resumeTimeout) {
					clearTimeout (m._resumeTimeout);
					m._resumeTimeout = null;
				}
			};

			_classPrototype._autoAdvance = function () {
				var m = this;
				m._clearAutoAdvanceTimeout ();
				m.advance (1);
			};

		/*** Public Instance Methods ***/
			_classPrototype.wipeDone = function () {
				var m = this;
				if (m._playing) {
					m._clearAutoAdvanceTimeout ();
					m._autoAdvanceTimeout = setTimeout (function () {m._autoAdvance ()},m._interSlideTime);
				}
			};

			_classPrototype.stopThenResume = function () {
				var m = this;
				m.set ({_playing:false});
				m._resumeTimeout = setTimeout (function () {m.set ({_playing:true})},m._idleResumeTime);
			};

		/*** State Properties ***/
			_class.stateProperties ({
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
							m._clearResumeTimeout ();
							m._clearAutoAdvanceTimeout ();
							m._autoAdvanceTimeout = setTimeout (function () {m._autoAdvance ()},m._interSlideTime);
						}
						} else {
							m._clearAutoAdvanceTimeout ();
							m._clearResumeTimeout ();
						}
						m._play && m._play.set ({playing:m._playing});
					},
					value:false
				}
			});

		return _class;
	}
});

