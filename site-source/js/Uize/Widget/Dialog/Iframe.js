/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Dialog.Iframe Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2006-2016 UIZE
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

		return _superclass.subclass ({
			alphastructor:function () {
				var m = this;

				/*** initialization ***/
					function _setIframeUrl (_url) {
						if (_url != m._lastSetUrl) {
							m._lastSetUrl = _url;
							var _contentWindow = m.getContentWindow ();
							_contentWindow && _contentWindow.location
								? _contentWindow.location.replace (_url)
								: (m.getNode ('content').src = _url)
							;
						}
					}
					m.wire ({
						'Before Show':
							function () {_setIframeUrl (Uize.isFunction (m._url) ? m._url () : m._url)},
						'After Hide':
							function () {m._resetUrl && _setIframeUrl ('about:blank')}
					});
			},

			instanceMethods:{
				getContentWindow:function () {
					var _contentNode = this.getNode ('content');
					return _contentNode ? _contentNode.contentWindow : null;
				}
			},

			stateProperties:{
				_resetUrl:{
					name:'resetUrl',
					value:true
				},
				_url:{
					name:'url',
					value:'' /* QUESTION: is it really necessary to initialize this property to an empty string? */
				}
			}
		});
	}
});

