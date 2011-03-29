/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Comm.Ajax Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2004-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=c" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Class
	importance: 9
	codeCompleteness: 95
	testCompleteness: 0
	docCompleteness: 80
*/

/*?
	Introduction
		The =Uize.Comm.Ajax= class implements support for [[http://en.wikipedia.org/wiki/Ajax_(programming)][Ajax]] (Asynchronous JavaScript And XML) communication through the XMLHttpRequest (XHR) object.

		*DEVELOPERS:* `Jan Borgersen`, `Chris van Rensburg`, `Ben Ilegbodu`, original code donated by `Zazzle Inc.`

		In order to implement support for communication through the XMLHttpRequest object, this class overrides the implementation of the =performRequest= instance method inherited from the =Uize.Comm= base class. There are no additional methods or properties provided by this class - all the interface is provided in the =Uize.Comm= superclass.
*/

Uize.module ({
	name:'Uize.Comm.Ajax',
	required:'Uize.Url',
	builder:function (_superclass) {
		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (),
				_classPrototype = _class.prototype
			;

		/*** Global Variables ***/
			var _doNothing = new Function;

		/*** Public Instance Methods ***/
			_classPrototype.performRequest = function (_request,_callback) {
				var
					_this = this,
					_returnType = _request.returnType,
					_returnTypeIsObject = _returnType == 'object',
					_requestUrl = Uize.Url.resolve (
						_request.url,
						{
							comm_mode:'ajax',
							output:'js',
							rnd:_request.cache == 'never' ? Uize.Url.getCacheDefeatStr () : null
						}
					),
					_requestData = _request.data || '',
					_requestMethod = _request.requestMethod,
					_requestMethodIsPost = _requestMethod == 'POST'
				;
				if (!_this._xmlHttpRequest)
					_this._xmlHttpRequest = window.XMLHttpRequest
						? new XMLHttpRequest
						: new ActiveXObject ('Microsoft.XMLHTTP')
					;
				_this._xmlHttpRequest.onreadystatechange = function () {
					if (_this._xmlHttpRequest.readyState == 4) {
						_this._xmlHttpRequest.onreadystatechange = _doNothing;
						if (_this._xmlHttpRequest.status == 200) {
							var _responseText = _this._xmlHttpRequest.responseText;
							if (_returnTypeIsObject || _returnType == 'xml')
								_request.responseXml = _this._xmlHttpRequest.responseXML
							;
							if (_returnTypeIsObject || _returnType == 'text')
								_request.responseText = _responseText
							;
							if (_returnTypeIsObject || _returnType == 'json')
								_request.responseJson = _responseText
									? (new Function ('var a=[' + _responseText + '];return a.pop()')) ()
									: null
							;
							_this._xmlHttpRequest.abort ();
							_callback ();
						} else {
							//alert ('There was a problem retrieving the data:\n' + _this._xmlHttpRequest.statusText);
							_this._xmlHttpRequest.abort ();
						}
					}
				};
				if (_requestMethodIsPost && !_requestData) {
					var _queryPos = _requestUrl.indexOf ('?');
					_requestData = _requestUrl.substr (_queryPos + 1);
					_requestUrl = _requestUrl.slice (0,_queryPos);
				}
				_this._xmlHttpRequest.open (_requestMethod,_requestUrl,true);
				if (_requestMethodIsPost) {
					_this._xmlHttpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
					_this._xmlHttpRequest.setRequestHeader('Content-length', _requestData.length);
				}
				_this._xmlHttpRequest.send (_requestData);
			};

		return _class;
	}
});

