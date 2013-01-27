/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Comm.Iframe Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2004-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 100
	docCompleteness: 50
*/

/*?
	Introduction
		The =Uize.Comm.Iframe= class implements support for communication to a server by submitting form data to it and targeting its response to an IFRAME.

		*DEVELOPERS:* `Chris van Rensburg`, `Jan Borgersen`, original code donated by `Zazzle Inc.`

		In order to implement support for communication through an IFRAME, this class overrides the implementation of the =performRequest= instance method inherited from the =Uize.Comm= base class. There are no additional methods or properties provided by this class - all the interface is provided in the =Uize.Comm= superclass.
*/

Uize.module ({
	name:'Uize.Comm.Iframe',
	required:[
		'Uize.Url',
		'Uize.Node'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (),
				_classPrototype = _class.prototype,
				_window = typeof window != 'undefined' ? window : {}
			;

		/*** General Variables ***/
			var _iframeId;

		/*** Public Instance Methods ***/
			_classPrototype.performRequest = function (_request,_callback) {
				var
					_this = this,
					_iframe = Uize.Node.getById (_iframeId),
					_requestUrl = Uize.Url.resolve (
						_request.url,
						{
							comm_mode:'ajax',
							output:'js',
							rnd:_request.cache == 'never' ? Uize.Url.getCacheDefeatStr () : null
						}
					),
					_returnType = _request.returnType,
					_returnTypeIsObject = _returnType == 'object'
				;
				_window.handleResponse = function (_responseResult) {
					if (_returnTypeIsObject || _returnType == 'json')
						_request.responseJson = Uize.clone (_responseResult)
					;
					Uize.Node.isIe && _iframe.contentWindow.history.go (-1);
					_callback ();
				};
				if (_request.requestMethod == 'POST') {
					var
						_form = Uize.Node.getById ('CommIframe_form'),
						_paramsField = Uize.Node.getById ('CommIframe_params'),
						_queryPos = _requestUrl.indexOf ('?')
					;
					_paramsField.value = _queryPos > -1 ? _requestUrl.substr (_queryPos + 1) : '';
					_form.action = _requestUrl.slice (0,_queryPos);
					_form.submit ();
				} else {
					_iframe.src = _requestUrl;
				}
			};

		/*** Initialization ***/
			if (typeof navigator != 'undefined') {
				/* NOTE:
					This puts the iframe in the page, but really the iframe should only be put into the page when the first instance of the class is created. Or, ideally, there should be a unique iframe per instance. The iframe insertion could even be deferred until the first request is performed.
				*/
				_iframeId = _classPrototype.iframeId = 'Uize_Comm_Iframe_iframe' + Uize.Url.getCacheDefeatStr ();
				Uize.Node.injectHtml (
					Uize.Node.getById ('globalContent') || document.body,
					'<form id="CommIframe_form" style="display:none;" target="' + _iframeId + '" method="POST" accept-charset="utf-8">' +
						'<input id="CommIframe_params" name="params" type="hidden"/>' +
					'</form>' +
					'<iframe id="' + _iframeId + '" name="' + _iframeId + '" width="1" height="1" src="' + Uize.pathToResources + 'Uize_Comm_Iframe/blank.html" frameborder="1" style="position:absolute; visibility:hidden;" scrolling="no"></iframe>'
				);
			}

			_window.handleResponse = function () {
				/*
					a dummy version of this function in case the user navigates back to a page using this code and a cached iframe server response tries to call this function (ie. no requests have been made yet)
				*/
			};

		return _class;
	}
});

