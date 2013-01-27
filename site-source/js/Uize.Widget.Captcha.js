/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Captcha Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 2
	codeCompleteness: 80
	docCompleteness: 50
*/

/*?
	Introduction
		The =Uize.Widget.Captcha= class encapsulates the logic required to display and use a captcha.

		*DEVELOPERS:* `Tim Carter`

		An Abstract Class
			The =Uize.Widget.Captcha= class, like its superclass =Uize.Widget= is primarily an abstract class that provides a standardized interface for the subclasses, which contain the majority of the implementation logic. Because there is no generalized API for the different captcha implementations available (reCaptcha, EZ-Gimpy, etc.), the subclasses must do most of the work to set up the UI, validate user input, and display any messages to the user.

		TODO:
			Once the refactoring of =Uize.Widget.FormElement= is completed, the validation and value interface for this class should be folded into that, perhaps as a subclass.
*/

Uize.module ({
	name:'Uize.Widget.Captcha',
	builder:function (_superclass) {
		'use strict';

		/*** Constructor ***/
			var
				_class = _superclass.subclass (),
				_classPrototype = _class.prototype
			;

		/*** Public Instance Methods ***/
			_classPrototype.initializeCaptcha = function () {
				/*?
					Instance Methods
						initializeCaptcha
							Loads and processes any data needed in order to display the captcha. This could include sourcing in external JS scripts, creating an external JS object, inserting the UI, etc. This is an empty method in =Uize.Widget.Captcha= and should be overridden by any subclasses.

							SYNTAX
							..............................
							myWidget.initializeCaptcha ();
							..............................
				 */
			};

			_classPrototype.validate = function ( _params ) {
				return this._isValid = false
				/*?
					Instance Methods
						validate
							Validates the user response to the captcha.

							SYNTAX
							..............................
							myWidget.validate ( _params );
							..............................

							PARAMS
							...................................................................................
							{
								callback:callbackFUNC		// a callback function once validation is complete.
							}
							...................................................................................

							NOTES
								No arguments are passed to the callback function. One can get the results of the validation by querying the =isValid= property.
				*/
			};

		/*** Wiring Methods ***/
			_classPrototype.wireUi = function () {
				var
					_this = this
				;

				if (!_this.isWired) {
					_superclass.prototype.wireUi.call (_this)
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_isValid:{
					name:'isValid',
					value:false
					/*?
						State properties
							isValid
								A boolean indicating whether or not the user has correctly solved the captcha challenge. Initially set to false as solving a captcha requires input from the user.
					*/
				},
				_value:'value'
				/*?
					State properties
						value
							An object representing the user response to the captcha's challenge. While generally a string (see reCaptcha's implementation), it can also represent other values, such as an option in a dropdown (ESP-PIX, http://server251.theory.cs.cmu.edu/cgi-bin/esp-pix/esp-pix).
				*/
			});

		return _class;
	}
});
