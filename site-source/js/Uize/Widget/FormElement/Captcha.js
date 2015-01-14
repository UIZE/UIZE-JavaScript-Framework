/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.FormElement.Captcha Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2015 UIZE
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
		The =Uize.Widget.FormElement.Captcha= class encapsulates the logic required to display and use a captcha.

		*DEVELOPERS:* `Tim Carter`, original code contributed by `Zazzle Inc.`

		An Abstract Class
			The =Uize.Widget.FormElement.Captcha= class, like its superclass =Uize.Widget= is primarily an abstract class that provides a standardized interface for the subclasses, which contain the majority of the implementation logic. Because there is no generalized API for the different captcha implementations available (reCaptcha, EZ-Gimpy, etc.), the subclasses must do most of the work to set up the UI, validate user input, and display any messages to the user.

		TODO:
			Once the refactoring of =Uize.Widget.FormElement= is completed, the validation and value interface for this class should be folded into that, perhaps as a subclass.
*/

Uize.module ({
	name:'Uize.Widget.FormElement.Captcha',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			instanceMethods:{
				initializeCaptcha:function () {
					/*?
						Instance Methods
							initializeCaptcha
								Loads and processes any data needed in order to display the captcha. This could include sourcing in external JS scripts, creating an external JS object, inserting the UI, etc. This is an empty method in =Uize.Widget.FormElement.Captcha= and should be overridden by any subclasses.

								SYNTAX
								..............................
								myWidget.initializeCaptcha ();
								..............................
					 */
				}
			}
		});
	}
});

