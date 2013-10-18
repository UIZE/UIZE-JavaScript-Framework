/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Comm.Ajax Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2004-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 9
	codeCompleteness: 95
	docCompleteness: 80
*/

/*?
	Introduction
		The =Uize.Comm.Ajax= class implements support for [[http://en.wikipedia.org/wiki/Ajax_(programming)][Ajax]] (Asynchronous JavaScript And XML) communication through the XMLHttpRequest (XHR) object.

		*DEVELOPERS:* `Jan Borgersen`, `Chris van Rensburg`, `Ben Ilegbodu`, `Tim Carter`, original code donated by `Zazzle Inc.`

		In order to implement support for communication through the XMLHttpRequest object, this class overrides the implementation of the =performRequest= instance method inherited from the =Uize.Comm= base class. There are no additional methods or properties provided by this class - all the interface is provided in the =Uize.Comm= superclass.
*/

Uize.module ({
	name:'Uize.Comm.Ajax',
	required:'Uize.Url',
	builder:function (_superclass) {
		'use strict';

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (),
				_classPrototype = _class.prototype
			;

		/*** General Variables ***/
			var _nop = Uize.nop;

		/*** Public Instance Methods ***/
			_classPrototype.performRequest = function (_request,_callback) {
				var
					m = this,
					_returnType = _request.returnType,
					_returnTypeIsObject = _returnType == 'object',
					_origUrl = Uize.Url.fromParams (_request.url),
					_requestUrl = Uize.Url.resolve (
						_request.url,
						Uize.copyInto (
							{
								rnd:_request.cache == 'never' ? Uize.Url.getCacheDefeatStr () : null
							},
							_origUrl.comm_mode ? null : {comm_mode:'ajax'},
							_origUrl.output ? null : {output:'js'}
						)
					),
					_requestData = _request.data || '',
					_requestMethod = _request.requestMethod,
					_requestMethodIsPost = _requestMethod == 'POST',
					_xmlHttpRequest = m._xmlHttpRequest || (
						m._xmlHttpRequest = window.XMLHttpRequest
							? new XMLHttpRequest
							: new ActiveXObject ('Microsoft.XMLHTTP')
					);

				_xmlHttpRequest.onreadystatechange = function () {
					if (_xmlHttpRequest.readyState == 4) {
						_xmlHttpRequest.onreadystatechange = _nop;

						if (_xmlHttpRequest.status == 200) {
							var _responseText = _xmlHttpRequest.responseText;
							if (_returnTypeIsObject || _returnType == 'xml')
								_request.responseXml = _xmlHttpRequest.responseXML
							;
							if (_returnTypeIsObject || _returnType == 'text')
								_request.responseText = _responseText
							;
							if (_returnTypeIsObject || _returnType == 'json')
								_request.responseJson = _responseText
									? Function ('var a=[' + _responseText + '];return a.pop()') ()
									: null
							;
							_xmlHttpRequest.abort ();
							_callback ();
						}
						else {
							//alert ('There was a problem retrieving the data:\n' + m._xmlHttpRequest.statusText);
							_xmlHttpRequest.abort ();
						}
					}
				};
				if (_requestMethodIsPost && !_requestData) {
					var _queryPos = _requestUrl.indexOf ('?');
					_requestData = _requestUrl.substr (_queryPos + 1);
					_requestUrl = _requestUrl.slice (0,_queryPos);
				}
				m._xmlHttpRequest.open (_requestMethod,_requestUrl,true);
				if (_requestMethodIsPost) {
					// don't set the content-type request header if it's multipart/form-data; the built-in FormData object will take care of that
					_request.contentType != 'multipart/form-data' &&
						m._xmlHttpRequest.setRequestHeader (
							'Content-type',
							_request.contentType || 'application/x-www-form-urlencoded'
						)
					;
					//m._xmlHttpRequest.setRequestHeader ('Content-length', _requestData.length);
				}
				m._xmlHttpRequest.send (_requestData);
			};

		return _class;
	}
});

