/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Comm.Iframe.Upload Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2004-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 4
	codeCompleteness: 100
	docCompleteness: 40
*/

/*?
	Introduction
		The =Uize.Comm.Iframe.Upload= class implements support for file upload by submitting form data to a server and targeting its response back to an IFRAME.

		*DEVELOPERS:* `Ben Ilegbodu`

		In order to implement support for upload through an IFRAME, this class overrides the implementation of the =performRequest= instance method inherited from the =Uize.Comm.Iframe= base class. There are no additional methods or properties provided by this class - all the interface is provided in the =Uize.Comm= superclass.
*/

Uize.module ({
	name:'Uize.Comm.Iframe.Upload',
	required:[
		'Uize.Node',
		'Uize.Url'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (),
				_classPrototype = _class.prototype
			;

		/*** Public Instance Methods ***/
			_classPrototype.performRequest = function (_request,_callback) {
				var
					_this = this,
					_iframe = Uize.Node.getById(_this.iframeId),
					_uploadForm = _request.uploadForm,
					_uploadFormTarget = _uploadForm.target,
					_returnType = _request.returnType,
					_returnTypeIsObject = _returnType == 'object'
				;
				handleResponse = function (_responseResult) {
					if (_returnTypeIsObject || _returnType == 'json')
						_request.responseJson = Uize.clone (_responseResult)
					;
					Uize.Node.isIe && _iframe.contentWindow.history.go (-1);
					_uploadForm.target = _uploadFormTarget;
					_callback ();
				};

				_uploadForm.action = Uize.Url.resolve(
					_uploadForm.action,
					{
						comm_mode:'iframe',
						output:'js',
						rnd:Uize.Url.getCacheDefeatStr ()
					}
				);

				_uploadForm.target = _iframe.name;
				_uploadForm.submit();
			};

		return _class;
	}
});

