/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Comm.Script Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 7
	codeCompleteness: 100
	docCompleteness: 80
*/

/*?
	Introduction
		The =Uize.Comm.Script= class implements support for communication with a server via [[http://en.wikipedia.org/wiki/Cross-site_scripting][cross-site scripting]] through the insertion of script tags into the document.

		*DEVELOPERS:* `Tim Carter`

		In order to implement support for communication through =script= tags, this class overrides the implementation of the =performRequest= instance method inherited from the =Uize.Comm= base class. There are no additional methods provided by this class - all the interface is provided in the =Uize.Comm= superclass.
*/

Uize.module({
	name:'Uize.Comm.Script',
	required:'Uize.Url',
	builder:function(_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var _undefined;

		/*** Constructor ***/
			var
				_class = _superclass.subclass(
					function() {
						for (this._callbackHashName in {_callbacks:1});
						if (!_class._callbacks) _class._callbacks = [];
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Public Methods ***/
			_classPrototype.performRequest = function(_request, _callback) {
				var
					_this = this,
					_callbacks = _class._callbacks,
					_serverHandlesCallback = _this._callbackMode == 'server',
					_scriptNode = document.createElement('script')
				;
				_callbacks.push(
					function(_response) {
						_request['response' + Uize.capFirstChar (_request.returnType)] = _response;
						_callback();
					}
				);

				var _callbackName = 'Uize.Comm.Script.' + _this._callbackHashName + '[' + (_callbacks.length - 1) + ']';

				_scriptNode.src = Uize.Url.resolve([
					_request.url,
					{comm_mode:'script'},
					_serverHandlesCallback ? {callback:_callbackName} : _undefined,
					_request.cache == 'never' ? {rnd:Uize.Url.getCacheDefeatStr()} : _undefined
				]);

				if (!_serverHandlesCallback) {
					var _callbackFn = _class._callbacks[_callbacks.length - 1];
					if (_scriptNode.readyState)
						_scriptNode.onreadystatechange = function () {
							if (_scriptNode.readyState == 'loaded' || _scriptNode.readyState == 'complete') {
								_scriptNode.onreadystatechange = null;
								_callbackFn ();
							}
						}
					;
					else
						_scriptNode.onload = _callbackFn;
				}

				document.body.appendChild(_scriptNode);
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_callbackMode:{
					name:'callbackMode',
					value:'server'
					/*?
						State Properties
							callbackMode
								A string, indicating whether the callback function should be handled by the server or client.

								While traditional xss techniques pass the name of the callback to the server so that it can be included in the response, certain situations may arise where the server is not capable of handling the callback. For example, this may occur when some client code wishes to query a service that is built by a third-party, and thus not under the control of the client developer. In the preceding example, the developer can set the value of =callbackMode= to ='client'= so that =Uize.Comm.Script= handles the callback itself.

								=Uize.Comm.Script= does this by inserting two script nodes into the DOM each time a request is made. The first request queries the server. The second calls the callback. This implementation assumes that the script tags are written synchronously, ie., the first finishes before the second is written out; this is the case for most modern browsers. As a result, the callback only gets executed once all the data from the server is in memory.

								This does place some restrictions on the callback function. Unlike most callbacks in the =Uize.Comm= class and subclasses, the callback in ='client'= mode does not receive any parameters. Once the ='client'= callback is called, the only certainty that exists with regard to the server request is that it completed. It is the responsibility of the callback developer to know the nature of that data.

								Values
									The possible values for the =callbackMode= state property are ='client'= or ='server'=. ='server'= mode means that the callback function will be passed to the server and it is the server's responsibility to call it upon completion of the task. If ='client'= mode is set, =Uize.Comm.Script= will call the callback function after each request is made.

								NOTES
								- the initial value is ='server'=
					 */
				}
			});
		return _class;
	}
});

