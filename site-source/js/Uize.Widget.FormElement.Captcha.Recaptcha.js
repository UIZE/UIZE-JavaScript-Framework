/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Recaptcha Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2011 UIZE
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

		*DEVELOPERS:* `Tim Carter`

		The =Uize.Widget.FormElement.Captcha.Recaptcha= class is a thin wrapper around the Recaptcha object, a js object that is sourced in by reCAPTCHA.

		NOTES
			- For information about the Recaptcha object, which is a non-Uize object provided by the reCAPTCHA project, visit http://recaptcha.net/apidocs/captcha/client.html#recaptcha-methods.

*/

Uize.module ({
	name:'Uize.Widget.FormElement.Captcha.Recaptcha',
	required:[
		'Uize.Comm.Script',
		'Uize.Node',
		'Uize.Node.Event'
	],
	builder:function (_superclass) {
		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false,

				_Uize = Uize,
				_Uize_Node = _Uize.Node,
				_Uize_Node_Event = _Uize_Node.Event
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function () {
						this._commObject = new Uize.Comm.Script ({callbackMode:'client'})
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._recaptchaObjectCreate = function () {
				var
					_this = this,
					_recaptchaInputId = 'recaptcha_response_field',
					_recaptchaObject = _this._recaptchaObject
				;

				if (_this.isWired) {
					// if the recaptcha node already exists, unwire it
					_Uize_Node.unwire (_recaptchaInputId);

					_recaptchaObject
						&& _recaptchaObject.create (
							_this._key,
							_this.getNode('recaptchaMarkup').id,
							{
								theme:'clean',
								callback:function () {
									function _fire (_eventName, _domEvent) { _this.fire ({name:_eventName,domEvent:_domEvent}) }
									function _setValue () {
										_this.set ({
											isDirty:_true,
											value:{
												response:_recaptchaObject.get_response (),
												challenge:_recaptchaObject.get_challenge (),
												token:_this._validationToken
											}
										})
									}

									_Uize_Node.wire (
										_recaptchaInputId,
										{
											// Copied from Uize.Widget.FormElement
											keyup:function (_event) {
												if (_this._lastKeyDown == _event.keyCode && _Uize_Node_Event.isKeyEnter (_event)) {
													_setValue ();
													_this.fireOkOnEnter () && _fire ('Ok', _event);
												} else if (_Uize_Node_Event.isKeyEscape (_event)) {
													_fire ('Cancel', _event);
													_Uize_Node.getById (_recaptchaInputId).blur ();
												} else {
													_this.set ({
														tentativeValue:_Uize_Node.getValue (_recaptchaInputId),
														isFinished:_false
													});
												}

												_fire ('Key Up', _event);
											},
											blur:function (_event) {
												_setValue ();
												_this.set ({focused:_false});
											},
											focus:function (_event) {
												_this.set ({focused:_true})
											},
											click:function (_event) {
												_fire ('Click', _event)
											},
											keydown:function (_event) {
												_this._lastKeyDown = _event.keyCode;
												_fire ('Key Down', _event);
											}
										}
									)
								}
							}
						)
					;
				}
			};

		/*** Public Instance Methods ***/
			_classPrototype.checkIsEmpty = function() {
				var _value = this.valueOf();

				return !_value || !_value.response
			};

			_classPrototype.initializeCaptcha = _classPrototype._initializeCaptcha = function () {
				var _this = this;
				// check to see if the Recaptcha object has already been sourced in. If not, we'll have to make a script call to load it.
				if (!(_this._recaptchaObject = window.Recaptcha) && _this._loadingUrl)
					_this._commObject.request (
						{
							url:[_this._loadingUrl],
							returnType:'json',
							requestMethod:'GET',
							callback:function () {
								(_this._recaptchaObject = window.Recaptcha) ?
									_this._recaptchaObjectCreate () :
										_this.inform ({
											state:'error',
											message:_this.localize('loadingError')
										})
								;
							}
						}
					);
				else _this._recaptchaObjectCreate ();

				/*?
					Instance Methods
						initializeCaptcha
							Overridden method that loads the external Recaptcha JS object (if it isn't in the page already) and creates the UI provided by reCAPTCHA.
				*/
			};

			_classPrototype.restore = function() {
				var _this = this;

				_this.set({isValid:_false});
				_this._initializeCaptcha();
				_superclass.prototype.wireUi.call (_this);
			};

			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					_this._initializeCaptcha ();

					_superclass.prototype.wireUi.call (_this);
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
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
					},
					value:''
					/*?
						Set-get properties
							validationToken
								A string containing a nonce returned by the validation service to be returned when the form is submitted.
					*/
				}
			});

			_class.set ({
				isValid:_false, // reCaptcha is never valid at the beginning
				validator:function (_value, _callback) {	// NOTE: this should never be overwritten
					/**
						Because the reCAPTCHA validation API requires a POST request, and because javascript is unable to oblige using standard AJAX techniques (due to cross-site scripting restrictions), the =Uize.Widget.FormElement.Captcha.ReCaptcha= class must incorporate an additional server in the validation request. The =validate= method will provide the server with both the challenge and the user response; that server must then submit a validation request to reCAPTCHA (and provide some additional parameters).

						The server response is then relayed to the javascript widget. The =response= that is passed to the callback function from the =Uize.Comm.Script= call should have an =isValid= property that is used to set the =Uize.Widget.FormElement.Captcha.Recaptcha= =isValid= property.
						For further reading on the reCAPTCHA validation API, please visit http://recaptcha.net/apidocs/captcha/.

						The response from the server is passed to the provided callback function, in case any additional information that might be useful to the parent widget is provided from the server (a nonce, for example).
					*/
					var
						_this = this,
						_isValid = _this.get('isValid')
					;

					if (_this.isWired) {
						var
							_recaptchaObj = _this._recaptchaObject,
							_responseField = _recaptchaObj ? _recaptchaObj.get_response () : ''
						;

						// isValid only gets set to true once the user has actually entered a valid term. There's no need to validate
						// again afterwards.
						if (!_this.get ('isValid') && _recaptchaObj && _responseField) {
							// assume that the validationUrl can send a response, otherwise how will the isValid property change?
							_this._commObject.set ({callbackMode:'server'});
							_this._commObject.request ({
								url:[
									_this._validationUrl,
									{
										recaptcha_response_field:_responseField,
										recaptcha_challenge_field:_recaptchaObj.get_challenge ()
									}
								],
								returnType:'json',
								requestMethod:'GET',
								callback:function (_response) {
									var _responseIsValid = _response.isValid;

									_this.set ({
										isValid:_responseIsValid,
										_validationToken:_response.token
									});

									// if the response was not valid then destroy and create a new instance of the captcha
									// unless there was no value.
									if (!_responseIsValid && _responseField) _this._recaptchaObjectCreate ();

									Uize.isFunction (_callback) && _callback ( _responseIsValid );
								}
							});
							_isValid = null;
						} else Uize.isFunction (_callback) && _callback (_this.get ('isValid'));
					}

					return _isValid;
				},
				validateWhen:'finished'
			});

		return _class;
	}
});

