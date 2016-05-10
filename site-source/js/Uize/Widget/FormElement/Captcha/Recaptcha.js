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
		The =Uize.Widget.FormElement.Captcha.Recaptcha= class encapsulates the logic required to display and use reCAPTCHA, a captcha implementation developed by a group of researchers at CMU (http://recaptcha.net).

		*DEVELOPERS:* `Tim Carter`, original code contributed by `Zazzle Inc.`

		The =Uize.Widget.FormElement.Captcha.Recaptcha= class is a thin wrapper around the Recaptcha object, a js object that is sourced in by reCAPTCHA.

		NOTES
			- For information about the Recaptcha object, which is a non-Uize object provided by the reCAPTCHA project, visit http://recaptcha.net/apidocs/captcha/client.html#recaptcha-methods.

*/

Uize.module ({
	name:'Uize.Widget.FormElement.Captcha.Recaptcha',
	required:[
		'Uize.Comm.Script',
		'Uize.Dom.Basics',
		'Uize.Dom.Event'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_true = true,
				_false = false,
				_Uize = Uize,
				_Uize_Dom_Basics = _Uize.Dom.Basics,
				_Uize_Dom_Event = _Uize.Dom.Event,
				_isFunction = _Uize.isFunction
		;

		/*** Private Instance Methods ***/
			function _recaptchaObjectCreate (m) {
				var
					_recaptchaInputId = 'recaptcha_response_field',
					_recaptchaObject = m._recaptchaObject
				;

				if (m.isWired) {
					// if the recaptcha node already exists, unwire it
					_Uize_Dom_Basics.unwire (_recaptchaInputId);

					_recaptchaObject
						&& _recaptchaObject.create (
							m._key,
							m.getNode('recaptchaMarkup').id,
							{
								theme:'clean',
								callback:function () {
									function _fire (_eventName, _domEvent) { m.fire ({name:_eventName,domEvent:_domEvent}) }
									function _setValue () {
										m.set ({
											isDirty:_true,
											value:{
												response:_recaptchaObject.get_response (),
												challenge:_recaptchaObject.get_challenge (),
												token:m._validationToken
											}
										});
									}

									_Uize_Dom_Basics.wire (
										_recaptchaInputId,
										{
											// Copied from Uize.Widget.FormElement
											keyup:function (_event) {
												if (m._lastKeyDown == _event.keyCode && _Uize_Dom_Event.isKeyEnter (_event)) {
													_setValue ();
													m.fireOkOnEnter () && _fire ('Ok', _event);
												} else if (_Uize_Dom_Event.isKeyEscape (_event)) {
													_fire ('Cancel', _event);
													_Uize_Dom_Basics.getById (_recaptchaInputId).blur ();
												} else {
													m.set ({
														tentativeValue:_Uize_Dom_Basics.getValue (_recaptchaInputId),
														isFinished:_false
													});
												}

												_fire ('Key Up', _event);
											},
											blur:function () {
												_setValue ();
												m.set ({focused:_false});
											},
											focus:function () { m.set ({focused:_true}) },
											click:function (_event) { _fire ('Click', _event) },
											keydown:function (_event) {
												m._lastKeyDown = _event.keyCode;
												_fire ('Key Down', _event);
											}
										}
									);
								}
							}
						)
					;
				}
			}

		return _superclass.subclass ({
			omegastructor:function () {
				this._commObject = new _Uize.Comm.Script ({callbackMode:'client'});
			},

			instanceMethods:{
				checkIsEmpty:function () {
					var _value = this.valueOf();

					return !_value || !_value.response;
				},

				initializeCaptcha:function () {
					var m = this;
					// check to see if the Recaptcha object has already been sourced in. If not, we'll have to make a script call to load it.
					if (!(m._recaptchaObject = window.Recaptcha) && m._loadingUrl)
						m._commObject.request (
							{
								url:[m._loadingUrl],
								returnType:'json',
								requestMethod:'GET',
								callback:function () {
									(m._recaptchaObject = window.Recaptcha) ?
										_recaptchaObjectCreate (m) :
											m.inform ({
												state:'error',
												message:m.localize('loadingError')
											})
									;
								}
							}
						);
					else _recaptchaObjectCreate (m);

					/*?
						Instance Methods
							initializeCaptcha
								Overridden method that loads the external Recaptcha JS object (if it isn't in the page already) and creates the UI provided by reCAPTCHA.
					*/
				},

				restore:function () {
					var m = this;

					m.set({isValid:_false});
					m.initializeCaptcha();
					_superclass.doMy (m,'wireUi');
				},

				wireUi:function () {
					var m = this;
					if (!m.isWired) {
						m.initializeCaptcha ();

						_superclass.doMy (m,'wireUi');
					}
				}
			},

			stateProperties:{
				_loadingUrl:'loadingUrl',
				/*?
					Set-get properties
						loadingUrl
							A string representing the URL that will load the Recaptcha object and all other necessary JS from reCAPTCHA.
				*/
				_validationUrl:'validationUrl',
				/*?
					Set-get properties
						validationUrl
							A string representing the URL that will contact the reCAPTCHA validation API to determine whether or not the user response was valid.

							NOTES
								The validation url must point to a page that accepts the two parameters 'recaptcha_response_field' and 'recaptcha_challenge_field.' These names match the names of the DOM elements storing the response and challenge in the UI, and are maintained for the sake of consistency.
								The validation url should provide a JSON object in response that at the very least contains an isValid property, which will then be used to set the value of =isValid=.
				*/
				_key:'key',
				/*?
					Set-get properties
						key
							A string representing the public API key provided by reCAPTCHA.
				*/
				_validationToken:{
					name:'validationToken',
					onChange:function () {
						this.isWired
							&& this.setNodeValue ('token', this._validationToken)
						;
					},
					value:''
					/*?
						Set-get properties
							validationToken
								A string containing a nonce returned by the validation service to be returned when the form is submitted.
					*/
				}
			},

			set:{
				isValid:_false, // reCaptcha is never valid at the beginning
				validator:function (_value, _callback) {	// NOTE: this should never be overwritten
					/**
						Because the reCAPTCHA validation API requires a POST request, and because javascript is unable to oblige using standard AJAX techniques (due to cross-site scripting restrictions), the =Uize.Widget.FormElement.Captcha.ReCaptcha= class must incorporate an additional server in the validation request. The =validate= method will provide the server with both the challenge and the user response; that server must then submit a validation request to reCAPTCHA (and provide some additional parameters).

						The server response is then relayed to the javascript widget. The =response= that is passed to the callback function from the =Uize.Comm.Script= call should have an =isValid= property that is used to set the =Uize.Widget.FormElement.Captcha.Recaptcha= =isValid= property.
						For further reading on the reCAPTCHA validation API, please visit http://recaptcha.net/apidocs/captcha/.

						The response from the server is passed to the provided callback function, in case any additional information that might be useful to the parent widget is provided from the server (a nonce, for example).
					*/
					var
						m = this,
						_isValid = m.get('isValid')
					;

					if (m.isWired) {
						var
							_recaptchaObj = m._recaptchaObject,
							_responseField = _recaptchaObj ? _recaptchaObj.get_response () : ''
						;

						// isValid only gets set to true once the user has actually entered a valid term. There's no need to validate
						// again afterwards.
						if (!m.get ('isValid') && _recaptchaObj && _responseField) {
							// assume that the validationUrl can send a response, otherwise how will the isValid property change?
							m._commObject.set ({callbackMode:'server'});
							m._commObject.request ({
								url:[
									m._validationUrl,
									{
										recaptcha_response_field:_responseField,
										recaptcha_challenge_field:_recaptchaObj.get_challenge ()
									}
								],
								returnType:'json',
								requestMethod:'GET',
								callback:function (_response) {
									var _responseIsValid = _response.isValid;

									m.set ({
										isValid:_responseIsValid,
										_validationToken:_response.token
									});

									// if the response was not valid then destroy and create a new instance of the captcha
									// unless there was no value.
									if (!_responseIsValid && _responseField) _recaptchaObjectCreate (m);

									_isFunction (_callback) && _callback ( _responseIsValid );
								}
							});
							_isValid = null;
						} else _isFunction (_callback) && _callback (m.get ('isValid'));
					}

					return _isValid;
				},
				validateWhen:'finished'
			}
		});
	}
});

