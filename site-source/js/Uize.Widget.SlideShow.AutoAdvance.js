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
						var _this = this;

						/*** make play button ***/
							(_this._play = _this._addChildButton ('play',function () {_this.toggle ('playing')}))
								.set ({playing:_this._playing})
							;

						/*** pause auto-advance if the user interacts with the slideshow ***/
							function _handleButtonClick (_buttonName) {
								_this.children [_buttonName].wire (
									'Click',function () {_this._playing && _this.stopThenResume ()}
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
				var _this = this;
				if (_this._autoAdvanceTimeout) {
					clearTimeout (_this._autoAdvanceTimeout);
					_this._autoAdvanceTimeout = null;
				}
			};

			_classPrototype._clearResumeTimeout = function () {
				var _this = this;
				if (_this._resumeTimeout) {
					clearTimeout (_this._resumeTimeout);
					_this._resumeTimeout = null;
				}
			};

			_classPrototype._autoAdvance = function () {
				var _this = this;
				_this._clearAutoAdvanceTimeout ();
				_this.advance (1);
			};

		/*** Public Instance Methods ***/
			_classPrototype.wipeDone = function () {
				var _this = this;
				if (_this._playing) {
					_this._clearAutoAdvanceTimeout ();
					_this._autoAdvanceTimeout = setTimeout (function () {_this._autoAdvance ()},_this._interSlideTime);
				}
			};

			_classPrototype.stopThenResume = function () {
				var _this = this;
				_this.set ({_playing:false});
				_this._resumeTimeout = setTimeout (function () {_this.set ({_playing:true})},_this._idleResumeTime);
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
						var _this = this;
						if (_this._playing) {
						if (_this._interSlideTime && _this._interSlideTime < 0) {
							_this.set({ playing: false });
						} else {
							_this._clearResumeTimeout ();
							_this._clearAutoAdvanceTimeout ();
							_this._autoAdvanceTimeout = setTimeout (function () {_this._autoAdvance ()},_this._interSlideTime);
						}
						} else {
							_this._clearAutoAdvanceTimeout ();
							_this._clearResumeTimeout ();
						}
						_this._play && _this._play.set ({playing:_this._playing});
					},
					value:false
				}
			});

		return _class;
	}
});

