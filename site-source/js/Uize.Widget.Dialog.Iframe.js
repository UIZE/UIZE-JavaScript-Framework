/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Dialog.Iframe Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2006-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 4
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.Dialog.Form= class extends its superclass with support for =iframe= dialogs, where the dialog's contents is a page loaded into an =iframe=.

		*DEVELOPERS:* `Chris van Rensburg`, `Jan Borgersen`
*/

Uize.module ({
	name:'Uize.Widget.Dialog.Iframe',
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

						/*** initialization ***/
							function _setIframeUrl (_url) {
								if (_url != _this._lastSetUrl) {
									_this._lastSetUrl = _url;
									var _contentWindow = _this.getContentWindow ();
									_contentWindow && _contentWindow.location
										? _contentWindow.location.replace (_url)
										: (_this.getNode ('content').src = _url)
									;
								}
							}
							_this.wire ({
								'Before Show':
									function () {_setIframeUrl (Uize.isFunction (_this._url) ? _this._url () : _this._url)},
								'After Hide':
									function () {_this._resetUrl && _setIframeUrl ('about:blank')}
							});
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Public Instance Methods ***/
			_classPrototype.getContentWindow = function () {
				var _contentNode = this.getNode ('content');
				return _contentNode ? _contentNode.contentWindow : _null;
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_resetUrl:{
					name:'resetUrl',
					value:_true
				},
				_url:{
					name:'url',
					value:'' /* QUESTION: is it really necessary to initialize this property to an empty string? */
				}
			});

		return _class;
	}
});

