/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Calculator Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 3
	codeCompleteness: 95
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widget.Calculator= class implements a basic calculator with division, multiplication, addition, subtraction, square root, memory, and percent.

		*DEVELOPERS:* `Chris van Rensburg`

	Key Features
		Number Entry Buttons
			The =Uize.Widget.Calculator= class implements a number of button child widgets to allow the user to enter numbers using the calculator's keypad UI.

			These buttons include buttons for the digits =0= through =9= and a button for the "." (period / decimal point) character. Clicking one of the digit buttons is roughly equivalent to pressing that digit's corresponding key on the regular keyboard, with the main difference being that clicking the keypad button appends to the value being entered, rather than inserting a digit at the current cursor position. See the section `Using the Regular Keyboard` for more details.

		Using the Regular Keyboard
			The =Uize.Widget.Calculator= class supports entering of values *and* triggering of operations using the regular keyboard.

			Clicking inside the =entry= child widget's input node will focus it, and then typing keys on the keyboard will "drive" the calculator widget.

			Hot Keys
				The calculator widget supports the following mapping of hot keys to calculator functions...

				- =digits 0 through 9= - Pressing any one of the numerical digit keys - whether on the keyboard's numerical keypad or above the QWERTY section - will permit the entry of a digit at the current cursor position in the input node.

				- =.= - Pressing the "." (period / decimal point) key permits the entry of a decimal point at the current cursor position in the input node, provided that the =point= button is enabled (it will be disabled if the =entry= value already contains a decimal point).

				- =%= - Pressing the "%" (percent) key will trigger the percent function, provided that the =percent= button is enabled.

				- =&#42;= - Pressing the "&#42;" (multiply / star / asterisk) key will trigger the multiplication function, provided that the =multiply= button is enabled.

				- =/= - Pressing the "/" (division / forward slash) key will trigger the division function, provided that the =divide= button is enabled.

				- =+= - Pressing the "+" (addition / plus) key will trigger the addition function, provided that the =add= button is enabled.

				- =-= - Pressing the "-" (minus / dash / hyphen) key will trigger the subtraction function, provided that the =subtract= button is enabled.

				- =Enter= or =&#61;= - Pressing either the "Enter" or "&#61;" (equals) key will complete the pending binary operation (see the section `Operation Completion`), or compound an already completed binary operation (see the section `Compounding Binary Operations`), provided that the =equals= button is enabled.

				- =Esc= or =Spacebar= - Pressing either the "Esc" (escape) or "Spacebar" key will trigger the =clear= function, clearing the currently pending binary operation and the value of the =entry= child widget.

				- =m= - Pressing the "m" key will trigger the memory plus function, provided that the =memoryPlus= button is enabled.

			Button Highlighting
				The =Uize.Widget.Calculator= class implements highlighting of the buttons that correspond to keys that are being pressed on the keyboard, to simulate the buttons being clicked.

				For example, if you focus the =entry= widget's input node and press down on the "7" key, then the =digit7= button widget will highlight as if you were clicking down on it (ie. the value of its =state= state property will be set to ='down'=). The =digit7= button will remain in this highlighted state until the "7" key is released.

				Some keys have less than obvious mappings. For instance, the "Enter" key is mapped to trigger calculation of a result, so pressing the "Enter" key will cause the =equals= button to highlight. This button is likely to have a "&#61;" label, so highlighting of this button when the "&#61;" key is pressed is more understandable. For convenience, though, both the "Enter" and "&#61;" keys trigger this button's function.

			Input Filtering
				The =Uize.Widget.Calculator= class supports input filtering when entering values and triggering calculator functions using the =entry= widget's input field.

				Invalid Key Filtering
					When controlling the calculator widget with the regular keyboard, invalid keys are automatically filtered out.

					For example, when entering values, pressing the alphabetical keys a-z will result in no action (except the "m" key, which is mapped to the calculator's =memoryPlus= function).

				Pasting in Invalid Characters
					It *is* possible to get invalid characters into the =entry= value using the paste function (typically =Ctrl-v=).

					When the =value= of the =entry= widget is not a well formed number, then the calculator will enter the `error state`.

				Filtering of Keys for Calculator Functions
					Keys that are mapped to trigger functions of the calculator are filtered from the input, so that pressing one of these keys will trigger the appropriate function without adding the key's character to the input.

					For example, pressing the "&#42;" (multiply / star / asterisk) key will trigger the multiplication function, but will not add a "&#42;" to the =entry= value.

				Filtering of Keys for Disabled Buttons
					Keys that are mapped to trigger functions that are disabled will be filtered from the input, so that pressing them will have no effect.

					An example of this is the =equals= button, which will be disabled if there is no binary operation to complete or compound. In this state, pressing the "&#61;" key will have no effect and the "&#61;" character will, as always, not find its way into the =entry= value. In a different example, the "." (period / decimal point) key will be filtered out and will not allow a decimal point character into the =entry= value when the =point= button is disabled because the =entry= value already contains a decimal point.

			Value Editing
				Besides the special handling for value entry keys and keys that trigger calculator functions (see `Hot Keys`), and keys that are filtered out as a result of `invalid key filtering`, the =entry= widget's input field permits all other standard operations for a text input.

				This means that you can select the value (=Ctrl-a= on many systems), copy the value to the clipboard (=Ctrl-c= on many systems), paste a value into the input field (=Ctrl-v= on many systems), select portions of the value (=Shift-Left=, =Shift-Right=, =Shift-Home=, =Shift-End=), delete characters using the delete and backspace keys, and so on.

		Entering Negative Numbers
			For convenience, the =Uize.Widget.Calculator= class provides a few different intuitive ways to enter negative numbers.

			The Negate Operator
				The =negate= operator is the fail-safe way to enter negative numbers in the calculator widget.

				To use it for enterting a negative number, you can first enter a positive number and then click the =negate= button to turn it negative. The =negate= operator is one of the `unary operators`, meaning that it acts on the current =entry= value without triggering `operation completion` for pending binary operations. This allows you to perform calculations like three times negative four, as =3 x 4 +/- &#61;=. In this example, the =negate= operator operates on the second operand without triggering completion of the pending multiplication. Similarly, you could perform the calculation, negative three times negative four, as =3 +/- x 4 +/- &#61;=.

				Negating Zero
					The =negate= button can be clicked even when the current =entry= value is =0=.

					The =entry= value will then display as =-0=, but entering the next non-zero digit will replace the leading "0" character.

				Negating Doesn't Complete Value Entry
					Important to note is that using the =negate= operator does not signal completion of value entry.

					So, for example, you could enter the value =-56= with the steps =5 6 +/-= as well as =5 +/- 6=. In the latter case, the negate is performed after the digit =5= is entered, producing the interim value =-5=. Value entry is not completed by the =negate= operator, however, so entering the next digit =6= produces the interim value of =-56=. In this way, the =negate= operator differs from other `unary operators`, such as the =squareRoot= function.

			Subtraction as Negation
				As a convenience, the =subtract= operator - that can also be triggered by pressing the "-" key when the =entry= child widget's input field is focused - can be used in an intuitive way to initiate entry of negative numbers.

				Subtraction After Other Binary Operators
					Using the =subtract= operator during `partial binary operations` - immediately after setting up a binary operation but before entering the second operand - will turn the next value you enter negative.

					For example, performing the calculation =3 x - 4 &#61;= will produce the result =-12=. In this example, because the multiplication operation is already setup when the subtraction operator is invoked, and because the second value for the multiplication operation has not yet been entered, the subtraction operator has the special behavior of initiating entry of a negative number for the second operand. The number will initially display as =-0=, but entering the next non-zero digit will replace the leading "0" character.

				Subtraction After Clear
					Using the =subtract= operator when the calculator is in the cleared state will turn the next value you enter negative.

					For example, after clicking the =clear= button, performing the calculation =- 3 x 4 &#61;= will produce the result =-12=. That's because the =entry= value will be =0= after clearing the calculator, so =- 3 x 4 &#61;= is really equivalent to =0 - 3 x 4 &#61;=, where the subtraction is completed first before the multiplication is performed (remember, this is a calculator, so no [[http://en.wikipedia.org/wiki/Order_of_operations][BODMAS]]), and the subtraction of your positive number from zero turns it negative.

			Pasting in Negative Numbers
				Because the =Uize.Widget.Calculator= class supports `value editing` when the =entry= child widget's input field is focused, negative numbers can also be pasted in by first clearing the =entry= value and then using the paste function (=Ctrl-v= on many systems).

		Binary Operators
			Binary operators are operators that require two operands, an example of which is multiplication.

			The =Uize.Widget.Calculator= class supports the binary operators =add=, =subtract=, =multiply=, and =divide=. Additionally, this class implements a `versatile percent function` that behaves as a binary operator in different ways under different conditions. Binary operations are performed by entering a number (=operandA=), then clicking the a binary =operator= button, entering a second number (=operandB=), then clicking the =equals= button to calculate the result.

			Partial Binary Operations
				The =Uize.Widget.Calculator= class supports partial binary operations, just like most regular physical calculators.

				A partial binary operation is where a value has not yet been entered for the second operand before `operation completion` occurs. In such cases, the value of the first operand is used as a default for the second operand. So, for example, the calculation =3 x &#61;= is equivalent to the calculation =3 x 3 &#61;=. This behavior becomes compelling when `compounding binary operations` (see also `Compounding Partial Binary Operations`).

		Unary Operators
			Unlike `binary operators`, unary operators operate on only a single operand.

			The way that the =Uize.Widget.Calculator= implements unary operators, they operate on the current value of the active operand, without triggering `operation completion` for pending binary operations. This is useful, and also the way that most regular physical calculators behave. This allows you to perform calculations like three times the square root of sixteen, as =3 x 16 &radic; &#61;=. In this example, the =squareRoot= operator operates on the second operand without triggering completion of the pending multiplication. This allows you to compound the unary operation. For example, you could calculate three times the fourth root of sixteen, as =3 x 16 &radic; &radic; &#61;=. For more info, see the section `compounding unary operations`.

			Apart from the =squareRoot= function, another example of a unary operator is the =negate= function, which inverts the sign of the current =entry= value. The =memoryRecall= function could also be considered a kind of unary operator, although it completely replaces the current =entry= value with the current value of the calculator's =memory=.

		Operation Completion
			A pending binary operation (such as =3 x 5=, for example) can be completed in any of the following ways...

			- clicking the =equals= button, or pressing the =&#61;= key when the =entry= child widget's input field is focused (ie. =3 x 5 &#61;=)

			- clicking a binary operator button, or pressing the button's corresponding key (ie. =3 x 5 +=) when the =entry= child widget's input field is focused

			- clicking either the =memoryPlus= or =memoryMinus= button, or pressing the "m" key (for memory plus) when the =entry= child widget's input field is focused

			- clicking the =percent= button, or pressing the "%" key when the =entry= child widget's input field is focused

			When a binary operation is completed, the value of the =activeOperand= state property is set to ='operandA'= and the =operandA= state property is used to store the result of the operation. This leaves the value of the =operandB= property unaltered so that it can be reused on subsequent compoundings of the operation. For more info, see the section `Operation Compounding`.

		Operation Compounding
			The =Uize.Widget.Calculator= class supports compounding of both unary *and* binary operations.

			Compounding Unary Operations
				Compounding a unary operation is just a matter of repeatedly triggering the unary operation.

				Each time a unary operation is performed, the =entry= value is replaced with the result of that operation. So, clicking the =squareRoot= button three times in a row would effectively find the 8th root of a number...

				...........................................................
				((2 ^ 1/2) ^ 1/2) ^ 1/2   =   (2 ^ 1/4) ^ 1/2   =   2 ^ 1/8
				...........................................................

				Some unary operations will have a toggling effect when used repeatedly. An example of this is the =negation= button. Click it twice and you get back to the original number. For such operations, repeating them an even number of times should produce the original number.

			Compounding Binary Operations
				Compounding a binary operation is done by repeatedly triggering the calculator's =equals= operation - just like with a regular physical calculator.

				As soon as a binary operation is completed (see `Operation Completion`), it can then be compounded by clicking the =equals= button again. Upon each successive compounding, the new result is displayed in the =entry= field and is set as the value of the =operandA= state property, leaving the value of the =operandB= property unaltered so that it can be reused on subsequent compoundings of the operation.

				So, for example, setting up the binary operation =3 x 1.25= and then clicking the =equals= button three times would be equivalent to the operation =3 x 1.25 x 1.25 x 1.25 &#61;=. On each successive clicking of the =equals= button you would compound the operation of multiplying the current value in the =entry= widget by the value =1.25=. All binary operations can be compounded in this way. A compelling application of the compounding feature is compounding of percent operations (for more info, see the section `Percent Operation Compounding`).

				Compounding Partial Binary Operations
					Partial binary operations, where a value has not yet been entered for the second operand, can also be compounded.

					In such cases, the value of the first operand is used as a default for the second operand. This is also how most regular physical calculators behave. So, for example, the calculation =3 x &#61; &#61; &#61;= is equivalent to the calculation =3 x 3 &#61; &#61; &#61;=. This is a kind of "poor man's power function", where you can raise a number to a certain positive integer power by entering the value, setting up the pending =multiply= operation, and then clicking the =equals= button power-minus-one times. Using our previous example, you can calculate three to the power of four by setting up =3 x= and then clicking the =equals= button three times.

		Versatile Percent Function
			The =Uize.Widget.Calculator= class implements a versatile =percent= function that supports the following intuitive operations...

			............................................................
			<< table >>

			title: PERCENTAGE OPERATIONS
			data
			:|  CALCULATION  |         DESCRIPTION          |  RESULT  |
			:|   85 % 50 =   |  85 percent of 50            |   42.5   |
			:|   50 x 85 %   |  85 percent of 50            |   42.5   |
			:|   15 + 12 %   |  15 increased by 12 percent  |   16.8   |
			:|   15 - 12 %   |  15 decreased by 12 percent  |   13.2   |
			............................................................

			Percent As Setup For Multiplication
				When there is either no pending binary operation, or when there is a completed binary operation that can be compounded, then the =percent= function has the effect of dividing the current =entry= value by =100= and setting up a =multiply= operation (ie. setting the value of the =operator= state property to ='multiply'=).

				This behavior allows calculations such as...

				.........................................................
				<< title >>

				title: PERCENT AS SETUP FOR MULTIPLICATION
				data
				:|     CALCULATION      |    DESCRIPTION     |  RESULT  |
				:|   85 % 50 =          |  85 percent of 50  |   42.5   |
				:|   10 + 75 = % 50 =   |  85 percent of 50  |   42.5   |
				.........................................................

				In the first calculation, triggering the =percent= function causes the value =85= to be divided by =100=, producing =.85=, and then the =multiply= operation is set up. When the value =50= is entered and the operation is completed using the =equals= function, the value =42.5= is produced.

				In the second calculation, =75= is being added to =10= and then the addition operation is completed with the =equals= function. At that point, using the =percent= function will treat the result of the previous calculation as the start of a new operation - compounding will be terminated, the result of the addition will be divided by =100=, and the =multiply= operation is set up. From that point on, the second calculation is identical to the first calculation.

			Percent With Pending Binary Operations
				When there is a pending binary operation, such as addition, subtraction, or multiplication, then triggering the =percent= function performs special handling and then completes the pending operation.

				Percent With Pending Multiplication
					Handling for a pending multiplication is straighforward: the second operand is regarded as the percentage value and is divided by =100= before carrying out the multiplication.

					..................................................
					<< table >>

					title: PERCENT WITH PENDING MULTIPLICATION
					data
					:|  CALCULATION  |    DESCRIPTION     |  RESULT  |
					:|   50 x 85 %   |  85 percent of 50  |   42.5   |
					..................................................

					In this calculation, triggering the =percent= function causes the value of the second operand, =85=, to be divided by =100=, after which the pending multiplication operation is automatically completed. The completed operation is then set up for convenient compounding (see `Percent Operation Compounding`).

				Percent With Pending Addition
					Handling for a pending addition is somewhat special.

					The current entry value is first divided by =100=, then added to the value =1=, then the pending addition is switched to a pending multiplication, after which this pending multiplication operation is automatically completed.

					............................................................
					<< table >>

					title: PERCENT WITH PENDING ADDITION
					data
					:|  CALCULATION  |         DESCRIPTION          |  RESULT  |
					:|   15 + 12 %   |  15 increased by 12 percent  |   16.8   |
					............................................................

					In this calculaton, triggering the =percent= function causes the value of the second operand, =12=, to be divided by =100= to produce the value =.12=. It is then added to the value =1= to produce the value =1.12=. After this, the pending operation is switched from addition to multiplication, and then the pending multiplication operation is automatically completed. This produces an intuitive way of increasing a value by a desired percentage. It also sets up the completed operation for convenient compounding (see `Percent Operation Compounding`).

				Percent With Pending Subtraction
					Handling for a pending subtraction is similar to handling for a pending addition.

					The current entry value is first divided by =100=, then subtracted from the value =1=, then the pending subtraction is switched to a pending multiplication, after which this pending multiplication operation is automatically completed.

					............................................................
					<< table >>

					title: PERCENT WITH PENDING SUBTRACTION
					data
					:|  CALCULATION  |         DESCRIPTION          |  RESULT  |
					:|   15 - 12 %   |  15 decreased by 12 percent  |   13.2   |
					............................................................

					In this calculaton, triggering the =percent= function causes the value of the second operand, =12=, to be divided by =100= to produce the value =.12=. It is then subtracted from the value =1= to produce the value =.88=. After this, the pending operation is switched from subtraction to multiplication, and then the pending multiplication operation is automatically completed. This produces an intuitive way of decreasing a value by a desired percentage. It also sets up the completed operation for convenient compounding (see `Percent Operation Compounding`).

			Percent Operation Compounding
				When using `percent with pending binary operations`, the =percent= function automatically completes the operation, and this completed operation is then set up for convenient compounding.

				For example, if you wanted to increase the value =100= by =5= percent repeatedly, you could first perform the percent operation =100 + 5 %=. Now, to keep compounding that =5= percent increase, just keep triggering the =equals= function. Every time you do, the current value will be increased again by five percent. For example, the calculation =100 + 5 % &#61; &#61;= will calculate the value =100= increased by five percent, the result increased by five percent, and then that result once again increased by five percent.

				You can do this same thing when there is a `percent with pending subtraction`, as well as when there's a `percent with pending multiplication`.

		Button State Management
			The =Uize.Widget.Calculator= class implements management of the enabled state for its various button child widgets, so that buttons are appropriately disabled when their functions can't be used because of the state of the calculator widget.

			To see this principle in action, enter the value =2.5= and you will notice how the =point= button becomes disabled. You can't have two decimal points in the same number, so the =point= button is disabled as soon as the =entry= value contains its first decimal point. In a more extreme example, try getting the square root of =-1=. This puts the calculator widget into the `error state`, in which all buttons - except those that can be used to enter a new value, or that are not affected by the `error state` (such as the =memoryClear= button) - will be disabled.

			The following button enabling/disabling rules apply...

			- the =equals= button is disabled when there is no pending or completed binary operation (ie. the value of the =operator= state property is =undefined=)

			- all buttons - except those that can be used to enter a new value, or that are not affected by the `error state` (such as the =memoryClear= button) - will be disabled when the calculator widget is in the `error state`

			- the =memoryRecall= and =memoryClear= buttons are disabled when the memory is clear (ie. the value of the =memory= state property is =undefined=), and will be enabled whenever the calculator's memory is storing a value (=memory= is not =undefined=) - regardless of other state of the calculator widget

			- the =clear= and =clearEntry= buttons are always enabled

			Error State
				The calculator widget can be put into an error state by performing certain operations, such as trying to obtain the square root of a negative number.

				When in the Error State as a result of performing an operation, the =entry= child widget will be set to the value ='ERROR'=. In the Error State, all buttons that perform operations using the current =entry= value will be disabled. `Number entry buttons`, and other buttons that would have the effect of replacing the current =entry= value (such as the =clearEntry=, =clear=, and =memoryRecall= buttons), will not be disabled because of the error state. Similarly, any buttons for which the current =entry= value is not relevant (such as the =memoryClear= button) will also not be disabled because of the error state.

				The error state is cleared automatically when next a digit is entered, or when a calculator function is used that would replace the current =entry= value (such as the =clearEntry=, =clear=, and =memoryRecall= functions).

				Invalid Entry Value
					An invalid =entry= value is equivalent to the `error state`, and the calculator widget behaves in the same way in this condition.

					For example, you could replace the contents of the =entry= widget's text input field with the text "HELLO". This constitutes an invalid entry value, and the calculator will behave as if you had tried to obtain the square root of =-1=. The only difference is that it will display "HELLO" instead of "ERROR".

		Reference HTML Implementation
			For a reference implementation of HTML for this widget class, see the JavaScript template =Uize.Templates.Calculator.js.jst=.
*/

Uize.module ({
	name:'Uize.Widget.Calculator',
	required:[
		'Uize.Widget.Button',
		'Uize.Widget.TextInput',
		'Uize.Node.Event'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false,
				_undefined
			;

		/*** General Variables ***/
			var
				_binaryOperatorsMap = {divide:1,multiply:1,subtract:1,add:1},
				_unaryOperatorsMap = {negate:1,percent:1,squareRoot:1},
				_buttonsRequiringValidEntry =
					Uize.copyInto ({memoryPlus:1,memoryMinus:1},_unaryOperatorsMap,_binaryOperatorsMap),
				_entryCharToButtonIdMap = {
					0:'digit0', 1:'digit1', 2:'digit2', 3:'digit3', 4:'digit4', 5:'digit5', 6:'digit6', 7:'digit7', 8:'digit8', 9:'digit9', '.':'point',
					'/':'divide', '*':'multiply', '-':'subtract', '+':'add',
					'=':'equals', ' ':'clear', '%':'percent', m:'memoryPlus'
				},
				_digitButtonsMap = {
					digit0:'0', digit1:'1', digit2:'2', digit3:'3', digit4:'4', digit5:'5', digit6:'6', digit7:'7', digit8:'8', digit9:'9', point:'.'
				},
				_invalidEntryChars = '`~!@#$^&()_{}[]\\|:;"\'<,>?abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
			;

		/*** Utility Functions ***/
			var
				_enabledTrueProperty = {enabled:'inherit'},
				_enabledFalseProperty = {enabled:false}
			;
			function _getEnabledProperty (_enabled) {return _enabled ? _enabledTrueProperty : _enabledFalseProperty}

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function () {
						var _this = this;

						function _updateOperandFromEntry () {
							var _value = _this._isEntryValid () ? +_entry : _undefined;
							_this.set (_this._activeOperand,_value);
							_this.set ({_value:_value});
						}

						/*** add entry form element ***/
							var _entry = _this.addChild ('entry',Uize.Widget.TextInput,{value:_this._value});
							/*?
								Child Widgets
									entry
										An instance of the =Uize.Widget.TextInput= class, that is used both to display the calculator's current value and also to allow the user to enter numbers and trigger operations by `using the regular keyboard`.

										When the calculator is in the `error state`, the =entry= child widget will be set to the value ='ERROR'=. For more information on using the =entry= text input field to drive the calculator, see the section `Using the Regular Keyboard`.
							*/
							function _releaseLastButtonClicked () {
								if (_this._lastButtonClicked) {
									_this._lastButtonClicked.set ({state:''});
									_this._lastButtonClicked = _undefined;
								}
							}
							function _handleKeyEvent (_event) {
								_releaseLastButtonClicked ();
								var
									_domEvent = _event.domEvent,
									_isKeyEscape = Uize.Node.Event.isKeyEscape (_domEvent),
									_keyChar = _isKeyEscape
										? ' '
										: Uize.Node.Event.isKeyEnter (_domEvent)
											? '='
											: String.fromCharCode (Uize.Node.Event.charCode (_domEvent))
								;
								if (_keyChar) {
									var _buttonId = _entryCharToButtonIdMap [_keyChar];
									if (_buttonId) {
										var _button = _this.children [_buttonId];
										if (_button.get ('enabledInherited')) {
											(_this._lastButtonClicked = _button).set ({state:'down'});
											if (!_isKeyEscape && (!_digitButtonsMap [_buttonId] || _mustClearEntry ())) {
												/* NOTE:
													There's a weird issue with FF, where handling and aborting ESC here doesn't result in the entry widget's input field being reset, but we do want the button click simulation to happen as early as possible, otherwise it's not even noticeable.
												*/
												_button.fire ({name:'Click',domEvent:_domEvent});
												_event.abort = _true;
											}
										} else {
											_event.abort = _true;
										}
									} else if (_invalidEntryChars.indexOf (_keyChar) > -1) {
										_event.abort = _true;
									}
								}
							}
							_entry.wire ({
								'Changed.value':function () {
									_updateOperandFromEntry ();
									_this._updateUiOperatorButtonsState ();
								},
								'Key Press':_handleKeyEvent,
								'Key Up':_releaseLastButtonClicked
							});
							function _setEntryValue (_value) {
								_entry.set ({value:isNaN (_value) ? 'ERROR' : (_value + '') || '0'});
								_updateOperandFromEntry (); // setting the value of the entry widget may not trigger a Changed.value event
							}

						/*** add child buttons ***/
							function _addChildButton (_buttonId,_clickHandler) {
								return Uize.Widget.Button.addChildButton.call (
									_this,
									_buttonId,
									function (_event) {
										_clickHandler (_event);
										_entry.focus ();
									}
								);
							}
							function _clearOnNextDigit () {_this.set ({_clearOnNextDigit:_true})}

							/*** add number entry buttons ***/
								function _mustClearEntry () {
									var _entryValue = _entry + '';
									return (
										_this._clearOnNextDigit ||
										!_this._isEntryValid () ||
										_entryValue == '0' ||
										_entryValue == '-0'
									);
								}
								function _digitClickHandler (_event) {
									var
										_digitChar = _digitButtonsMap [_event.source.get ('name')],
										_entryValue = _entry + '',
										_leadingChars = _mustClearEntry () ? (_entryValue == '-0' ? '-' : '') : _entryValue
									;
									_this._activeOperand == 'operandA' && _this._clearOnNextDigit &&
										_this.set ({operator:_undefined})
									;
									_this.set ({_clearOnNextDigit:_false});
									_setEntryValue ((_leadingChars || (_digitChar == '.' ? '0' : '')) + _digitChar);
								}
								for (var _digitButtonId in _digitButtonsMap)
									_addChildButton (_digitButtonId,_digitClickHandler)
									/*?
										Child Widgets
											digit0
												An instance of the =Uize.Widget.Button= class, that lets the user enter the digit "0" into the value in the =entry= child widget.

												For a detailed discussion of the digit child widgets, see the section `Number Entry Buttons`.

												NOTES
												- see the companion =digit1=, =digit2=, =digit3=, =digit4=, =digit5=, =digit6=, =digit7=, =digit8=, =digit9=, and =point= child widgets

											digit1
												An instance of the =Uize.Widget.Button= class, that lets the user enter the digit "1" into the value in the =entry= child widget.

												For a detailed discussion of the digit child widgets, see the section `Number Entry Buttons`.

												NOTES
												- see the companion =digit0=, =digit2=, =digit3=, =digit4=, =digit5=, =digit6=, =digit7=, =digit8=, =digit9=, and =point= child widgets

											digit2
												An instance of the =Uize.Widget.Button= class, that lets the user enter the digit "2" into the value in the =entry= child widget.

												For a detailed discussion of the digit child widgets, see the section `Number Entry Buttons`.

												NOTES
												- see the companion =digit0=, =digit1=, =digit3=, =digit4=, =digit5=, =digit6=, =digit7=, =digit8=, =digit9=, and =point= child widgets

											digit3
												An instance of the =Uize.Widget.Button= class, that lets the user enter the digit "3" into the value in the =entry= child widget.

												For a detailed discussion of the digit child widgets, see the section `Number Entry Buttons`.

												NOTES
												- see the companion =digit0=, =digit1=, =digit2=, =digit4=, =digit5=, =digit6=, =digit7=, =digit8=, =digit9=, and =point= child widgets

											digit4
												An instance of the =Uize.Widget.Button= class, that lets the user enter the digit "4" into the value in the =entry= child widget.

												For a detailed discussion of the digit child widgets, see the section `Number Entry Buttons`.

												NOTES
												- see the companion =digit0=, =digit1=, =digit2=, =digit3=, =digit5=, =digit6=, =digit7=, =digit8=, =digit9=, and =point= child widgets

											digit5
												An instance of the =Uize.Widget.Button= class, that lets the user enter the digit "5" into the value in the =entry= child widget.

												For a detailed discussion of the digit child widgets, see the section `Number Entry Buttons`.

												NOTES
												- see the companion =digit0=, =digit1=, =digit2=, =digit3=, =digit4=, =digit6=, =digit7=, =digit8=, =digit9=, and =point= child widgets

											digit6
												An instance of the =Uize.Widget.Button= class, that lets the user enter the digit "6" into the value in the =entry= child widget.

												For a detailed discussion of the digit child widgets, see the section `Number Entry Buttons`.

												NOTES
												- see the companion =digit0=, =digit1=, =digit2=, =digit3=, =digit4=, =digit5=, =digit7=, =digit8=, =digit9=, and =point= child widgets

											digit7
												An instance of the =Uize.Widget.Button= class, that lets the user enter the digit "7" into the value in the =entry= child widget.

												For a detailed discussion of the digit child widgets, see the section `Number Entry Buttons`.

												NOTES
												- see the companion =digit0=, =digit1=, =digit2=, =digit3=, =digit4=, =digit5=, =digit6=, =digit8=, =digit9=, and =point= child widgets

											digit8
												An instance of the =Uize.Widget.Button= class, that lets the user enter the digit "8" into the value in the =entry= child widget.

												For a detailed discussion of the digit child widgets, see the section `Number Entry Buttons`.

												NOTES
												- see the companion =digit0=, =digit1=, =digit2=, =digit3=, =digit4=, =digit5=, =digit6=, =digit7=, =digit9=, and =point= child widgets

											digit9
												An instance of the =Uize.Widget.Button= class, that lets the user enter the digit "9" into the value in the =entry= child widget.

												For a detailed discussion of the digit child widgets, see the section `Number Entry Buttons`.

												NOTES
												- see the companion =digit0=, =digit1=, =digit2=, =digit3=, =digit4=, =digit5=, =digit6=, =digit7=, =digit8=, and =point= child widgets

											point
												An instance of the =Uize.Widget.Button= class, that lets the user enter the "." (decimal point) character into the value in the =entry= child widget.

												For a detailed discussion of the digit child widgets, see the section `Number Entry Buttons`.

												NOTES
												- see the companion =digit0=, =digit1=, =digit2=, =digit3=, =digit4=, =digit5=, =digit6=, =digit7=, =digit8=, and =digit9= child widgets
									*/
								;

							/*** add operator buttons ***/
								/*** equals button ***/
									function _calculateResult () {
										var
											_result,
											_operandA = _this._operandA,
											_operandB = _this._operandB
										;
										_operandB == _undefined && _this.set ({_operandB:_operandB = _operandA});
										switch (_this._operator) {
											case 'divide':
												_result = _operandA / _operandB;
												break;
											case 'multiply':
												_result = _operandA * _operandB;
												break;
											case 'subtract':
												_result = _operandA - _operandB;
												break;
											case 'add':
												_result = _operandA + _operandB;
												break;
										}
										_this.set ({
											_activeOperand:'operandA',
											_operandA:_result
										});
										_setEntryValue (_result);
										_clearOnNextDigit ();
									}
									function _usePendingCalculation () {
										!_this._clearOnNextDigit && _this._operator && _calculateResult ();
									}
									var _equals = _addChildButton (
										'equals',
										_calculateResult
										/*?
											Child Widgets
												equals
													An instance of the =Uize.Widget.Button= class, that lets the user complete the pending binary operation, or compound a completed binary operation.

													Clicking the =equals= button has the following effects...

													- completes the pending binary operation (see the section `Operation Completion`), or compounds an already completed binary operation (see the section `Compounding Binary Operations`)
													- sets the value of the =activeOperand= state property to ='operandA'=
													- sets the value of the =operandA= state property and the value of the =entry= child widget to the result of the calculation
													- sets the value of the =activeOperand= state property to ='operandA'=
													- sets the value of the =clearOnNextDigit= state property to =true=

													This button's function can also be triggered by a number of other interactions with the calculator widget (for more info, see the section `Operation Completion`).

													NOTES
													- this button will be disabled if the calculator is in the `error state`, or if there is not a pending or completed binary operation (ie. the value of the =operator= state property is =undefined=)
										*/
									);

								/*** memory operators ***/
									function _memoryPlus (_sign) {
										_this._activeOperand == 'operandB' && _this._operator && _calculateResult ();
										_this.set ({_memory:(_this._memory || 0) + _entry * _sign});
										_clearOnNextDigit ();
									}
									_addChildButton (
										'memoryPlus',
										function () {_memoryPlus (1)}
										/*?
											Child Widgets
												memoryPlus
													An instance of the =Uize.Widget.Button= class, that lets the user add a value to the calculator's memory.

													Clicking the =memoryPlus= button has the following effects...

													- completes any pending binary operation (see the section `Operation Completion`)
													- sets the value of the =memory= state property to its current value plus the value of the =entry= child widget
													- sets the value of the =clearOnNextDigit= state property to =true=

													NOTES
													- see the companion =memoryMinus= child widget
													- see the related =memoryRecall= and =memoryClear= child widgets
													- this button will be disabled if the calculator is in the `error state`
										*/
									);
									_addChildButton (
										'memoryMinus',
										function () {_memoryPlus (-1)}
										/*?
											Child Widgets
												memoryMinus
													An instance of the =Uize.Widget.Button= class, that lets the user subtract a value from the calculator's memory.

													Clicking the =memoryMinus= button has the following effects...

													- completes any pending binary operation (see the section `Operation Completion`)
													- sets the value of the =memory= state property to its current value minus the value of the =entry= child widget
													- sets the value of the =clearOnNextDigit= state property to =true=

													NOTES
													- see the companion =memoryPlus= child widget
													- see the related =memoryRecall= and =memoryClear= child widgets
													- this button will be disabled if the calculator is in the `error state`
										*/
									);
									_addChildButton (
										'memoryRecall',
										function () {
											_setEntryValue (_this._memory);
											_clearOnNextDigit ();
										}
										/*?
											Child Widgets
												memoryRecall
													An instance of the =Uize.Widget.Button= class, that lets the user recall the calculator's memory.

													Clicking the =memoryRecall= button has the following effects...

													- sets the value of the =entry= child widget to the value of the =memory= state property
													- sets the value of the =clearOnNextDigit= state property to =true=

													NOTES
													- see the related =memoryPlus=, =memoryMinus=, and =memoryClear= child widgets
													- this button will be disabled if there is no value in the calculator's memory (ie. the value of the =memory= state property is =undefined=)
										*/
									);
									_addChildButton (
										'memoryClear',
										function () {
											_this.set ({_memory:_undefined});
											_clearOnNextDigit ();
										}
										/*?
											Child Widgets
												memoryClear
													An instance of the =Uize.Widget.Button= class, that lets the user clear the calculator's memory.

													Clicking the =memoryClear= button has the following effects...

													- sets the value of the =memory= state property to =undefined=
													- sets the value of the =clearOnNextDigit= state property to =true=

													NOTES
													- see the related =memoryPlus=, =memoryMinus=, and =memoryRecall= child widgets
													- this button will be disabled if there is no value in the calculator's memory (ie. the value of the =memory= state property is =undefined=)
										*/
									);

								/*** binary operators ***/
									function _startEnteringNegativeNumber () {
										if (
											_this._operator
												? _this._clearOnNextDigit && _this._operandB == _undefined
												: !_this._operandA
										) {
											_this.set ({_clearOnNextDigit:_false});
											_setEntryValue ('-0');
											return _true;
										}
									}
									function _binaryOperatorButtonClickHandler (_event) {
										var _buttonId = _event.source.get ('name');
										if (_buttonId != 'subtract' || !_startEnteringNegativeNumber ()) {
											_usePendingCalculation ();
											_this.set ({_operator:_undefined}); // we want onChange to get invoked
											_this.set ({_operator:_buttonId});
										}
									}
									for (var _buttonId in _binaryOperatorsMap)
										_addChildButton (_buttonId,_binaryOperatorButtonClickHandler)
										/*?
											Child Widgets
												add
													An instance of the =Uize.Widget.Button= class, that lets the user set up the addition binary operation.

													Clicking the =add= button has the following effects...

													- completes any pending binary operation (see the section `Operation Completion`)
													- sets the value of the =operator= state property to ='add'=

													This button's function can also be triggered using the "+" (addition / plus character) key on the keyboard (for more info, see the section `Using the Regular Keyboard`).

													NOTES
													- the =add= function is one of the `binary operators`
													- see the related =divide=, =multiply=, and =subtract= child widgets
													- this button will be disabled if the calculator is in the `error state`

												divide
													An instance of the =Uize.Widget.Button= class, that lets the user set up the division binary operation.

													Clicking the =divide= button has the following effects...

													- completes any pending binary operation (see the section `Operation Completion`)
													- sets the value of the =operator= state property to ='divide'=

													This button's function can also be triggered using the "/" (division / forward slash character) key on the keyboard (for more info, see the section `Using the Regular Keyboard`).

													NOTES
													- the =divide= function is one of the `binary operators`
													- see the related =add=, =multiply=, and =subtract= child widgets
													- this button will be disabled if the calculator is in the `error state`

												multiply
													An instance of the =Uize.Widget.Button= class, that lets the user set up the multiplication binary operation.

													Clicking the =multiply= button has the following effects...

													- completes any pending binary operation (see the section `Operation Completion`)
													- sets the value of the =operator= state property to ='multiply'=

													This button's function can also be triggered using the "&#42;" (multiply / star / asterisk character) key on the keyboard (for more info, see the section `Using the Regular Keyboard`).

													NOTES
													- the =multiply= function is one of the `binary operators`
													- see the related =add=, =divide=, and =subtract= child widgets
													- this button will be disabled if the calculator is in the `error state`

												subtract
													An instance of the =Uize.Widget.Button= class, that lets the user set up the subtraction binary operation.

													If a binary operation has already been set up (ie. the value of the =operator= state property is no longer =undefined=) but a value has not yet been entered for the second operand (ie. the =operandB= state property is still set to =undefined=), then clicking this button will make it behave as a negation operation. For more info on this behavior, see the section `Subtraction as Negation`.

													Otherwise, clicking the =subtract= button has the following effects...

													- completes any pending binary operation (see the section `Operation Completion`)
													- sets the value of the =operator= state property to ='subtract'=

													This button's function can also be triggered using the "-" (minus / dash / hyphen character) key on the keyboard (for more info, see the section `Using the Regular Keyboard`).

													NOTES
													- the =subtract= function is one of the `binary operators`
													- see the related =add=, =divide=, and =multiply= child widgets
													- this button will be disabled if the calculator is in the `error state`
										*/
									;

								/*** extended operators ***/
									_addChildButton (
										'negate',
										function () {
											if (!_startEnteringNegativeNumber ()) {
												var _entryValue = _entry + '';
												_setEntryValue (
													_entryValue.indexOf ('-') > -1 ? _entryValue.replace ('-','') : '-' + _entryValue
												);
											}
										}
										/*?
											Child Widgets
												negate
													An instance of the =Uize.Widget.Button= class, that lets the user perform the negation (sign inversion) operation on the current value of the =entry= child widget.

													The negation operation can be used even when the current =entry= value is =0=, producing the value =-0= (for more info, see the section `Entering Negative Numbers`). Using the =negate= operator repeatedly will toggle the sign of the current =entry= value back and forth between positive and negative.

													NOTES
													- the =negate= function is one of the `unary operators`
													- this button will be disabled if the calculator is in the `error state`
										*/
									);
									_addChildButton (
										'percent',
										function () {
											var
												_operator = _this._operator,
												_entryValue = _entry / 100
											;
											_operator && _this._activeOperand == 'operandA' &&
												_this.set ({_operator:_operator = _undefined})
											;
											if (_operator == 'subtract' || _operator == 'add') {
												_entryValue = _operator == 'subtract' ? 1 - _entryValue : 1 + _entryValue;
												_setEntryValue (_this._operandA);
												_this.set ({_operator:'multiply'});
											}
											_setEntryValue (_entryValue);
											_operator ? _calculateResult () : _this.set ({_operator:'multiply'});
										}
										/*?
											Child Widgets
												percent
													An instance of the =Uize.Widget.Button= class, that lets the user perform the percent operation.

													The percent function will behave as either a unary or binary operator, depending on the current state of the calculator (for a detailed explanation of this, see the section `Versatile Percent Function`). This button's function can also be triggered using the "%" (percent character) key on the keyboard. For more info, see the section `Using the Regular Keyboard`.

													NOTES
													- this button will be disabled if the calculator is in the `error state`
										*/
									);
									_addChildButton (
										'squareRoot',
										function () {
											_setEntryValue (Math.sqrt (+_entry));
											_clearOnNextDigit ();
										}
										/*?
											Child Widgets
												squareRoot
													An instance of the =Uize.Widget.Button= class, that lets the user perform the square root operation on the current value of the =entry= child widget.

													If the value of the =entry= child widget is negative, then clicking the =squareRoot= button will put the calculator widget into the `error state`.

													NOTES
													- the =squareRoot= function is one of the `unary operators`
													- this button will be disabled if the calculator is in the `error state`
										*/
									);

								/*** clear buttons ***/
									function _clearEntry () {_setEntryValue (0)}
									function _clear () {
										_clearEntry ();
										_this.set ({
											_operandA:0,
											_operandB:_undefined,
											_operator:_undefined
										});
									}
									_addChildButton (
										'clearEntry',
										_clearEntry
										/*?
											Child Widgets
												clearEntry
													An instance of the =Uize.Widget.Button= class, that lets the user clear the value of the =entry= child widget.

													Clicking the =clearEntry= button has the effect of setting the value of the =entry= child widget to =0=. To clear the currently pending binary operation as well as the current entry in the =entry= child widget, the =clear= button can be used.

													NOTES
													- see the companion =clear= child widget
										*/
									);
									_addChildButton (
										'clear',
										_clear
										/*?
											Child Widgets
												clear
													An instance of the =Uize.Widget.Button= class, that lets the user clear the currently pending binary operation and the value of the =entry= child widget.

													Clicking the =clear= button has the following effects...

													- sets the value of the =entry= child widget to =0=
													- sets the value of the =operandA= state property to =0=
													- sets the value of the =operandB= state property to =undefined=
													- sets the value of the =operator= state property to =undefined=

													This button's function can also be triggered using the =Esc= or =Spacebar= keys on the keyboard (for more info, see the section `Using the Regular Keyboard`). To clear only the current entry in the =entry= child widget, the =clearEntry= button can be used.

													NOTES
													- see the companion =clearEntry= child widget
										*/
									);

									/*** clear, initiated by escape key from entry widget ***/
										_entry.wire ('Cancel',_clear);

						_this._childrenAdded = _true;

						_this._updateUiMemoryButtonsState ();
						_this._updateUiOperatorButtonsState ();
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._isEntryValid = function () {
				return !isNaN ((this.children.entry + '') || '?');
			};

			_classPrototype._updateUiMemoryButtonsState = function () {
				var _this = this;
				if (_this._childrenAdded) {
					var _enabledProperty = _getEnabledProperty (_this._memory != _undefined);
					_this.children.memoryRecall.set (_enabledProperty);
					_this.children.memoryClear.set (_enabledProperty);
				}
			};

			_classPrototype._updateUiPointButtonState = function () {
				var _this = this;
				_this._childrenAdded &&
					_this.children.point.set (
						_getEnabledProperty (_this._clearOnNextDigit || (_this.children.entry + '').indexOf ('.') == -1)
					)
				;
			};

			_classPrototype._updateUiEqualsButtonState = function () {
				var _this = this;
				_this._childrenAdded &&
					_this.children.equals.set (_getEnabledProperty (_this._operator && _this._isEntryValid ()))
				;
			};

			_classPrototype._updateUiOperatorButtonsState = function () {
				var _this = this;
				if (_this._childrenAdded) {
					var
						_children = _this.children,
						_enabledProperty = _getEnabledProperty (_this._isEntryValid ())
					;
					for (var _buttonId in _buttonsRequiringValidEntry)
						_children [_buttonId].set (_enabledProperty)
					;
				}
				_this._updateUiPointButtonState ();
				_this._updateUiEqualsButtonState ();
			};

		/*** Public Instance Methods ***/
			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					/* NOTE:
						Keep the entry field focused, even when you click outside it, as long as you click on the root node of the widget, or one of the nodes on its tree.
					*/
					_this.wireNode ('','click',function () {_this.children.entry.focus ()});
					_superclass.prototype.wireUi.call (_this);
				}
			};

		/*** State Properties ***/
			function _conformToNumber (_value) {return isNaN (_value) ? _undefined : +_value}

			_class.stateProperties ({
				_activeOperand:{
					name:'activeOperand',
					value:'operandA'
					/*?
						State Properties
							activeOperand
								A read-only string, indicating the active operand in the currently pending binary operation.

								Possible values for this property are ='operandA'= and ='operandB'=. The value of this property is automatically updated when the value of the =operator= state property is modified, and its value is automatically set to ='operandA'= whenever a pending binary operation is completed. The value of the =activeOperand= property determines which of the =operandA= and =operandB= state properties will be synchronized to the value of the =entry= child widget.

								NOTES
								- this property is read-only
								- see the related =operandA=, =operandB=, and =operator= state properties
								- the initial value is ='operandA'=
					*/
				},
				_clearOnNextDigit:{
					name:'clearOnNextDigit',
					onChange:_classPrototype._updateUiPointButtonState
					/*?
						State Properties
							clearOnNextDigit
								A read-only boolean, indicating whether or not the very next entered digit should clear the current value of the =entry= child widget.

								The value of this property is automatically set to =true= when certain operations are performed, such as...

								- using any of the unary operators, such as =percent= and =squareRoot=
								- using any of the =memoryPlus=, =memoryMinus=, =memoryRecall=, or =memoryClear= memory functions
								- using any of the binary operators, such as =divide=, =multiply=, =add=, or =subtract=
								- completing a pending binary operation by triggering the =equals= function

								NOTES
								- this property is read-only
								- the initial value is =undefined=
					*/
				},
				_memory:{
					name:'memory',
					onChange:_classPrototype._updateUiMemoryButtonsState
					/*?
						State Properties
							memory
								A number, representing the current value of the calculator's memory function.

								When the memory is cleared, this property will be set to =undefined= - not =0=. This distinguishes between nothing being stored in memory, and the value stored in memory being =0=.

								NOTES
								- the initial value is =undefined=
					*/
				},
				_operandA:{
					name:'operandA',
					conformer:_conformToNumber
					/*?
						State Properties
							operandA
								A read-only number, representing the first operand in the currently pending binary operation.

								When the value of the =activeOperand= state property is set to ='operandA'=, then the value of the =entry= child widget will be reflected in the =operandA= property. This means that the value of =operandA= would update as the user enters a value - either using the buttons of the calculator or the keys of their keyboard.

								NOTES
								- this property is read-only
								- see the comapanion =operandB= state property
								- see the related =activeOperand= and =operator= state properties
								- the initial value is =undefined=
					*/
				},
				_operandB:{
					name:'operandB',
					conformer:_conformToNumber
					/*?
						State Properties
							operandB
								A read-only number, representing the second operand in the currently pending binary operation.

								When the value of the =activeOperand= state property is set to ='operandB'=, then the value of the =entry= child widget will be reflected in the =operandB= property. This means that the value of =operandB= would update as the user enters a value - either using the buttons of the calculator or the keys of their keyboard.

								NOTES
								- this property is read-only
								- see the comapanion =operandA= state property
								- see the related =activeOperand= and =operator= state properties
								- the initial value is =undefined=
					*/
				},
				_operator:{
					name:'operator',
					onChange:[
						function () {
							var _this = this;
							_this.set ({
								_operandB:_undefined,
								_activeOperand:'operand' + (_this._operator ? 'B' : 'A')
							});
							_this._operator && _this.set ({_clearOnNextDigit:_true});
						},
						_classPrototype._updateUiEqualsButtonState
					]
					/*?
						State Properties
							operator
								A string, representing the currently pending binary operation.

								Possible values for this property are: ='divide'=, ='multiply'=, ='subtract'=, ='add'=, and =undefined= (no currently pending binary operation).

								Whenever the value of this property is changed, the value of the =operandB= state property will be set to =undefined=, and the value of the =activeOperand= state property will be set to either ='operandA'= if =operator= is set to =undefined=, or ='operandB'= if =operator= is set to one of the supported string values.

								NOTES
								- see the related =activeOperand=, =operandA=, and =operandB= state properties
								- the initial value is =undefined=
					*/
				},
				_value:{
					name:'value',
					conformer:_conformToNumber,
					onChange:function () {this.set (this._activeOperand,this._value)},
					value:0
					/*?
						State Properties
							value
								A number, representing the result of the calculation performed by the widget.

								NOTES
								- see the related =activeOperand=, =operandA=, and =operandB= state properties
								- the initial value is =0=
					*/
				}
			});

		return _class;
	}
});

