/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Dom.Fullscreen Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Dom.Fullscreen= package provides features to managing full screen mode for browsers that support the [[https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode][HTML5 fullscreen API]].

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Dom.Fullscreen',
	builder:function () {
		'use strict';

		return Uize.package ({
			getFullscreenElement:function () {
				var _document = document;
				return (
					_document.fullscreenElement ||
					_document.mozFullScreenElement ||
					_document.webkitFullscreenElement ||
					_document.msFullscreenElement
				);
			},

			inFullscreen:function () {
				return !!this.getFullscreenElement ();
			},

			requestFullscreen:function () {
				var _documentElement = document.documentElement;
				return (
					_documentElement.requestFullscreen
						? _documentElement.requestFullscreen ()
					: _documentElement.msRequestFullscreen
						? _documentElement.msRequestFullscreen ()
					: _documentElement.mozRequestFullScreen
						? _documentElement.mozRequestFullScreen ()
					: _documentElement.webkitRequestFullscreen
						? _documentElement.webkitRequestFullscreen (Element.ALLOW_KEYBOARD_INPUT)
					: null
				);
			},

			exitFullscreen:function () {
				if (this.inFullscreen ()) {
					var _document = document;
					return (
						_document.exitFullscreen
							? _document.exitFullscreen ()
						: _document.msExitFullscreen
							? _document.msExitFullscreen ()
						: _document.mozCancelFullScreen
							? _document.mozCancelFullScreen ()
						: _document.webkitExitFullscreen
							? _document.webkitExitFullscreen ()
						: null
					);
				}
			},

			toggleFullscreen:function () {
				this.setFullscreen (!this.inFullscreen ());
			},

			setFullscreen:function (_inFullscreen) {
				_inFullscreen ? this.requestFullscreen () : this.exitFullscreen ();
			}
		});
	}
});

