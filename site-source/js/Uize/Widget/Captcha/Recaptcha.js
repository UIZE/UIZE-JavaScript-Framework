/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Recaptcha Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 3
	codeCompleteness: 100
	docCompleteness: 70
*/

/*?
	Introduction
		The =Uize.Widget.Captcha.Recaptcha= class encapsulates the logic required to display and use reCAPTCHA, a captcha implementation developed by a group of researchers at CMU (http://recaptcha.net).

		*DEVELOPERS:* `Tim Carter`, original code contributed by `Zazzle Inc.`

		The =Uize.Widget.Captcha.Recaptcha= class is a thin wrapper around the Recaptcha object, a js object that is sourced in by reCAPTCHA.

		NOTES
			- For information about the Recaptcha object, which is a non-Uize object provided by the reCAPTCHA project, visit http://recaptcha.net/apidocs/captcha/client.html#recaptcha-methods.

*/

Uize.module ({
	name:'Uize.Widget.Captcha.Recaptcha',
	required:'Uize.Comm.Script',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				var m = this;
				m._commObject = Uize.Comm.Script ({callbackMode:'client'});
				m.initializeCaptcha ();
			},

			instanceMethods:{
				initializeCaptcha:function () {
					var m = this;
					// check to see if the Recaptcha object has already been sourced in. If not, we'll have to make a script call to load it.
					if (!(m.recaptchaObject = window.Recaptcha) && m._loadingUrl)
						m._commObject.request (
							{
								url:[m._loadingUrl],
								returnType:'json',
								requestMethod:'GET',
								callback:
								function () {
									(m.recaptchaObject = window.Recaptcha) ?
										m.recaptchaObjectCreate () :
											m.callInherited ('inform') ({
												state:'error',
												message:m.localize('loadingError')
											})
									;
								}
							}
						);
					else m.recaptchaObjectCreate ();

					/*?
						Instance Methods
							initializeCaptcha
								Overridden method that loads the external Recaptcha JS object (if it isn't in the page already) and creates the UI provided by reCAPTCHA.
					*/
				},

				recaptchaObjectCreate:function () {
					var m = this;
					m.recaptchaObject && m.recaptchaObject.create (m._key, m.get('idPrefix'), {theme:'clean'});
					/*?
						Instance Methods
							recaptchaObjectCreate
								Calls the Recaptcha object to create the UI and challenge.

								SYNTAX
								..................................
								myWidget.recaptchaObjectCreate ();
								..................................
					*/
				},

				validate:function ( _params ) {
					var
						m = this,
						_callback = _params.callback,
						_recaptchaObj = m.recaptchaObject
					;

					// assume that the validationUrl can send a response, otherwise how will the isValid property change?
					m._commObject.set ({callbackMode:'server'});
					m._commObject.request ({
						url:[
							m._validationUrl,
							{
								recaptcha_response_field:_recaptchaObj.get_response(),
								recaptcha_challenge_field:_recaptchaObj.get_challenge ()
							}
						],
						returnType:'json',
						requestMethod:'GET',
						callback:function (_response) {
							m.set ({isValid:_response && _response.isValid});

							// if the response was not valid then destroy and create a new instance of the captcha
							if (!m.get('isValid')) m.recaptchaObjectCreate ();

							Uize.isFunction (_callback) && _callback ( _response );
						}
					});
					/*?
						Instance Methods
							validate
								Overridden method that validates the user response to the reCaptcha challenge.

								SYNTAX
								............................
								myWidget.validate (_params);
								............................

								PARAMS
								.......................................................................................
								{
									callback:callbackFUNC	// callback function that executes after the server request
								}
								.......................................................................................

								How It Works
									Because the reCAPTCHA validation API requires a POST request, and because javascript is unable to oblige using standard AJAX techniques (due to cross-site scripting restrictions), the =Uize.Widget.Captcha.ReCaptcha= class must incorporate an additional server in the validation request. The =validate= method will provide the server with both the challenge and the user response; that server must then submit a validation request to reCAPTCHA (and provide some additional parameters).

									The server response is then relayed to the javascript widget. The =response= that is passed to the callback function from the =Uize.Comm.Script= call should have an =isValid= property that is used to set the =Uize.Widget.Captcha.Recaptcha= =isValid= property.
									For further reading on the reCAPTCHA validation API, please visit http://recaptcha.net/apidocs/captcha/.

								NOTES
									The response from the server is passed to the provided callback function, in case any additional information that might be useful to the parent widget is provided from the server (a nonce, for example).
					*/
				}
			},

			stateProperties:{
				_loadingUrl:'loadingUrl',
				/*?
					State properties
						loadingUrl
							A string representing the URL that will load the Recaptcha object and all other necessary JS from reCAPTCHA.
				*/
				_validationUrl:'validationUrl',
				/*?
					State properties
						validationUrl
							A string representing the URL that will contact the reCAPTCHA validation API to determine whether or not the user response was valid.

							NOTES
								The validation url must point to a page that accepts the two parameters 'recaptcha_response_field' and 'recaptcha_challenge_field.' These names match the names of the DOM elements storing the response and challenge in the UI, and are maintained for the sake of consistency.
								The validation url should provide a JSON object in response that at the very least contains an isValid property, which will then be used to set the value of =isValid=.
				*/
				_key:'key'
				/*?
					State properties
						key
							A string representing the public API key provided by reCAPTCHA.
				*/
			}
		});
	}
});
