/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Node.Event Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*?
	Introduction
		The =Uize.Node.Event= package provides convenient methods for abstracting differences between the DOM node event systems of different browsers.

		*DEVELOPERS:* `Chris van Rensburg`
*/

/* Module Meta Data
	type: Package
	importance: 6
	codeCompleteness: 80
	docCompleteness: 100
*/

Uize.module ({
	name:'Uize.Node.Event',
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var _package = function (_event) {return _event || event};

		/*** Public Static Methods ***/
			_package.abort = function (_event) {
				_package.preventDefault (_event || (_event = event));
				_package.stopPropagation (_event);
				/*?
					Static Methods
						Uize.Node.Event.abort
							Aborts the specified DOM event, preventing the browser's default action for that event from taking place, and also preventing the event from being propagated.

							SYNTAX
							....................................
							Uize.Node.Event.abort (domEventOBJ);
							....................................

							Calling this method has the same effect as calling both the =Uize.Node.Event.preventDefault= and =Uize.Node.Event.stopPropagation= static methods for the specified DOM event.

							NOTES
							- see the related =Uize.Node.Event.preventDefault= and =Uize.Node.Event.stopPropagation= static methods
				*/
			};

			_package.charCode = function (_event) {
				_event || (_event = event);
				if (_event.ctrlKey || _event.altKey || _event.which < 1)
					return 0
				;
				return 'charCode' in _event ? _event.charCode : _package.keyCode (_event);

				/* for keydown / keyup
					var _keyCodeToCharCodeRemap = {
						192:'`', 1192:'~', 1049:'!', 1050:'@', 1051:'#', 1052:'$', 1053:'%', 1054:'^', 1055:'&', 1056:'*', 1057:'(', 1048:')', 109:'-', 1109:'_', 107:'=', 1107:'+', 219:'[', 1219:'{', 221:']', 1221:'}', 220:'\\', 1220:'|', 59:';', 1059:':', 222:'\'', 1222:'"', 226:'\\', 1226:'|', 188:',', 1188:'<', 190:'.', 1190:'>', 191:'/', 1191:'?',

						// numerical keypad
							111:'/', 1111:'/', 106:'*', 1106:'*', 109:'-', 110:'.', 1110:'.'
					};
					function _getKeyEventCharCode (_domEvent) {
						var
							_keyCode = 'which' in _domEvent ? _domEvent.which : _domEvent.keyCode,
							_result = _keyCode
						;
						if (_result > 64 && _result < 91) { // 65-90 are a-z/A-Z
							if (!_domEvent.shiftKey) _result += 32;
						} else if (_result > 95 && _result < 106) { // 96-105 are 0-9 on numerical keypad
							_result -= 48;
						} else if (_result > 111 && _result < 123) { // 112-123 are F1-F12 (the function keys)
							_result = 0;
						} else {
							var _remappedChar = _keyCodeToCharCodeRemap [(_domEvent.shiftKey && 1000) + _result];
							if (_remappedChar) _result = _remappedChar.charCodeAt (0);
						}
						page.setNodeValue ('test',_keyCode + '(Shift: ' + _domEvent.shiftKey + ') -> ' + _result + ' = ' + String.fromCharCode (_result));
						return _result;
					}
				*/
				/*?
					Static Methods
						Uize.Node.Event.charCode
							Returns an integer, indicating the character code of the key being pressed in the =keypress= keyboard event.

							SYNTAX
							.....................................................
							charCodeINT = Uize.Node.Event.charCode (domEventOBJ);
							.....................................................

							In order to get the actual character for the key that is being pressed, you can use the =String.fromCharCode= method, as in...

							..........................................................................
							keyCharSTR = String.fromCharCode (Uize.Node.Event.charCode (domEventOBJ));
							..........................................................................

							NOTES
							- this method is applicable only to the =keypress= event and is not guaranteed to work reliably with the =keydown= and =keyup= events
							- if the key being pressed is a special key that would not produce a character (such as one of the cursor arrow keys), then this method will return the value =0=
							- see the related =Uize.Node.Event.keyCode= static method
							- this method does not modify the DOM event object
				*/
			};

			_package.fix = function (_event) {
				_event || (_event = event);
				_event.target = _package.target (_event);
				_event.relatedTarget = _package.relatedTarget (_event);
				_event.charCode = _package.charCode (_event);
				_event.keyCode = _package.keyCode (_event);
				_event.preventDefault || (_event.preventDefault = _preventDefault);
				_event.stopPropagation || (_event.stopPropagation = _stopPropagation);

				return _event;
				/*?
					Static Methods
						Uize.Node.Event.fix
							Performs some fixes on the specified event object by extending it with DOM standard event object methods and properties, as necessary.

							SYNTAX
							................................................
							domEventOBJ = Uize.Node.Event.fix (domEventOBJ);
							................................................

							This method abstracts the difference between Microsoft Internet Explorer, which supports proprietary properties on the event object, and other browsers that support the DOM standard methods and properties. Among other things, this method will extend the specified DOM event object with the =preventDefault= and =stopPropagation= methods, and the =charCode=, =relatedTarget=, and =target= properties, as necessary.

							NOTES
							- this method may modify the DOM event object
				*/
			};

			Uize.map (
				{
					Backspace:8,Delete:46,Insert:45,
					Enter:13,Escape:27,
					Space:32,Tab:9,
					PageUp:33,PageDown:34,End:35,Home:36,
					LeftArrow:37,RightArrow:39,UpArrow:38,DownArrow:40
				},
				function (_keyCode,_keyName) {
					_package ['isKey' + _keyName] = function (_event) {return _package.keyCode (_event) == _keyCode};
				}
			);
			/*?
				Static Methods
					Uize.Node.Event.isKeyBackspace
						Returns a boolean, indicating whether or not the key being pressed in the keyboard event is the backspace key.

						SYNTAX
						..................................................................
						isKeyBackspaceBOOL = Uize.Node.Event.isKeyBackspace (domEventOBJ);
						..................................................................

						NOTES
						- this method is applicable to the =keydown= and =keyup= events and is not guaranteed to work reliably with the =keypress= event
						- this method does not modify the DOM event object

					Uize.Node.Event.isKeyDownArrow
						Returns a boolean, indicating whether or not the key being pressed in the keyboard event is the down arrow key.

						SYNTAX
						..................................................................
						isKeyDownArrowBOOL = Uize.Node.Event.isKeyDownArrow (domEventOBJ);
						..................................................................

						NOTES
						- this method is applicable to the =keydown= and =keyup= events and is not guaranteed to work reliably with the =keypress= event
						- this method does not modify the DOM event object

					Uize.Node.Event.isKeyDelete
						Returns a boolean, indicating whether or not the key being pressed in the keyboard event is the delete key.

						SYNTAX
						............................................................
						isKeyDeleteBOOL = Uize.Node.Event.isKeyDelete (domEventOBJ);
						............................................................

						NOTES
						- this method is applicable to the =keydown= and =keyup= events and is not guaranteed to work reliably with the =keypress= event
						- this method does not modify the DOM event object

					Uize.Node.Event.isKeyEnd
						Returns a boolean, indicating whether or not the key being pressed in the keyboard event is the end key.

						SYNTAX
						......................................................
						isKeyEndBOOL = Uize.Node.Event.isKeyEnd (domEventOBJ);
						......................................................

						NOTES
						- this method is applicable to the =keydown= and =keyup= events and is not guaranteed to work reliably with the =keypress= event
						- this method does not modify the DOM event object

					Uize.Node.Event.isKeyEnter
						Returns a boolean, indicating whether or not the key being pressed in the keyboard event is the home key.

						SYNTAX
						..........................................................
						isKeyEnterBOOL = Uize.Node.Event.isKeyEnter (domEventOBJ);
						..........................................................

						NOTES
						- this method is applicable to the =keydown= and =keyup= events and is not guaranteed to work reliably with the =keypress= event
						- this method does not modify the DOM event object

					Uize.Node.Event.isKeyEscape
						Returns a boolean, indicating whether or not the key being pressed in the keyboard event is the escape key.

						SYNTAX
						............................................................
						isKeyEscapeBOOL = Uize.Node.Event.isKeyEscape (domEventOBJ);
						............................................................

						NOTES
						- this method is applicable to the =keydown= and =keyup= events and is not guaranteed to work reliably with the =keypress= event
						- this method does not modify the DOM event object

					Uize.Node.Event.isKeyHome
						Returns a boolean, indicating whether or not the key being pressed in the keyboard event is the home key.

						SYNTAX
						........................................................
						isKeyHomeBOOL = Uize.Node.Event.isKeyHome (domEventOBJ);
						........................................................

						NOTES
						- this method is applicable to the =keydown= and =keyup= events and is not guaranteed to work reliably with the =keypress= event
						- this method does not modify the DOM event object

					Uize.Node.Event.isKeyInsert
						Returns a boolean, indicating whether or not the key being pressed in the keyboard event is the insert key.

						SYNTAX
						............................................................
						isKeyInsertBOOL = Uize.Node.Event.isKeyInsert (domEventOBJ);
						............................................................

						NOTES
						- this method is applicable to the =keydown= and =keyup= events and is not guaranteed to work reliably with the =keypress= event
						- this method does not modify the DOM event object

					Uize.Node.Event.isKeyLeftArrow
						Returns a boolean, indicating whether or not the key being pressed in the keyboard event is the left arrow key.

						SYNTAX
						..................................................................
						isKeyLeftArrowBOOL = Uize.Node.Event.isKeyLeftArrow (domEventOBJ);
						..................................................................

						NOTES
						- this method is applicable to the =keydown= and =keyup= events and is not guaranteed to work reliably with the =keypress= event
						- this method does not modify the DOM event object

					Uize.Node.Event.isKeyPageDown
						Returns a boolean, indicating whether or not the key being pressed in the keyboard event is the page down key.

						SYNTAX
						................................................................
						isKeyPageDownBOOL = Uize.Node.Event.isKeyPageDown (domEventOBJ);
						................................................................

						NOTES
						- this method is applicable to the =keydown= and =keyup= events and is not guaranteed to work reliably with the =keypress= event
						- this method does not modify the DOM event object

					Uize.Node.Event.isKeyPageUp
						Returns a boolean, indicating whether or not the key being pressed in the keyboard event is the page up key.

						SYNTAX
						............................................................
						isKeyPageUpBOOL = Uize.Node.Event.isKeyPageUp (domEventOBJ);
						............................................................

						NOTES
						- this method is applicable to the =keydown= and =keyup= events and is not guaranteed to work reliably with the =keypress= event
						- this method does not modify the DOM event object

					Uize.Node.Event.isKeyRightArrow
						Returns a boolean, indicating whether or not the key being pressed in the keyboard event is the right arrow key.

						SYNTAX
						....................................................................
						isKeyRightArrowBOOL = Uize.Node.Event.isKeyRightArrow (domEventOBJ);
						....................................................................

						NOTES
						- this method is applicable to the =keydown= and =keyup= events and is not guaranteed to work reliably with the =keypress= event
						- this method does not modify the DOM event object

					Uize.Node.Event.isKeySpace
						Returns a boolean, indicating whether or not the key being pressed in the keyboard event is the space key.

						SYNTAX
						..........................................................
						isKeySpaceBOOL = Uize.Node.Event.isKeySpace (domEventOBJ);
						..........................................................

						NOTES
						- this method is applicable to the =keydown= and =keyup= events and is not guaranteed to work reliably with the =keypress= event
						- this method does not modify the DOM event object

					Uize.Node.Event.isKeyTab
						Returns a boolean, indicating whether or not the key being pressed in the keyboard event is the tab key.

						SYNTAX
						......................................................
						isKeyTabBOOL = Uize.Node.Event.isKeyTab (domEventOBJ);
						......................................................

						NOTES
						- this method is applicable to the =keydown= and =keyup= events and is not guaranteed to work reliably with the =keypress= event
						- this method does not modify the DOM event object

					Uize.Node.Event.isKeyUpArrow
						Returns a boolean, indicating whether or not the key being pressed in the keyboard event is the up arrow key.

						SYNTAX
						..............................................................
						isKeyUpArrowBOOL = Uize.Node.Event.isKeyUpArrow (domEventOBJ);
						..............................................................

						NOTES
						- this method is applicable to the =keydown= and =keyup= events and is not guaranteed to work reliably with the =keypress= event
						- this method does not modify the DOM event object
			*/

			_package.keyCode = function (_event) {
				return 'which' in (_event || (_event = event)) ? _event.which : _event.keyCode;
				/*?
					Static Methods
						Uize.Node.Event.keyCode
							Returns an integer, indicating the key code of the key being pressed in the =keydown= or =keyup= keyboard event.

							SYNTAX
							...................................................
							keyCodeINT = Uize.Node.Event.keyCode (domEventOBJ);
							...................................................

							Not a Character Code
								It's important to point out that the key code for a keyboard event does not correspond in a predictable or meaningful way to a character that might be produced when a key is pressed in a focused text input field.

								For example, the key code when "Shift-a" is pressed is the same as when just "a" is pressed, even though the former would produce a capital "A" while the latter would produce a lowercase "a". The key code =65=, in this case, merely identifies the "A" key on the keyboard. In other cases, certain keys will produce key codes that don't meaningfully map to characters in the ASCII character set. For example, the key code for the down arrow key is =40=, and =40= is the ASCII character code for the "(" (open parenthesis) character - not a meaningful mapping at all.

							Testing for Certain Keys
								As a convenience, a number of static methods are provided in this module to make it easier to detect certain keys without having to remember the key codes.

								An example is the =Uize.Node.Event.isKeyEnter= method, which tests if the key being pressed down or released is the enter key. Other such methods include: =Uize.Node.Event.isKeyEscape=, =Uize.Node.Event.isKeyDownArrow=, =Uize.Node.Event.isKeyInsert=, =Uize.Node.Event.isKeyTab=, etc.

							NOTES
							- this method is applicable to the =keydown= and =keyup= events and is not guaranteed to work reliably with the =keypress= event
							- see the related =Uize.Node.Event.charCode= static method
							- this method does not modify the DOM event object
				*/
			};

			function _preventDefault () {
				this.preventDefault ? this.preventDefault () : (this.returnValue = false);
				/* NOTES:
					- "preventDefault" is the DOM standard, "returnValue" is IE's proprietary feature
					- this method does not work for the keydown event in Safari (use the keypress event, instead)
				*/
			}
			_package.preventDefault = function (_event) {_preventDefault.call (_event || event)};
				/*?
					Static Methods
						Uize.Node.Event.preventDefault
							Prevents the browser's default action for the specified event from being performed.

							SYNTAX
							.............................................
							Uize.Node.Event.preventDefault (domEventOBJ);
							.............................................

							This method abstracts the difference between Microsoft Internet Explorer, which supports the proprietary =returnValue= property on the event object, and other browsers that support the DOM standard =preventDefault= method of the event object.

							NOTES
							- see the related =Uize.Node.Event.abort= and =Uize.Node.Event.stopPropagation= static methods
							- this method may modify the DOM event object
				*/

			_package.relatedTarget = function (_event) {
				return (
					'relatedTarget' in (_event || (_event = event))
						? _event.relatedTarget
						: (_event.type == 'mouseout' ? _event.toElement : _event.fromElement)
				);
				/* NOTES:
					- "relatedTarget" is the DOM standard, "toElement" and "fromElement" are IE's proprietary features
				*/
				/*?
					Static Methods
						Uize.Node.Event.relatedTarget
							Returns a reference to a DOM node, identifying the secondary target for a =mouseover= or =mouseout= event.

							SYNTAX
							......................................................................
							relatedTargetDomNodeOBJ = Uize.Node.Event.relatedTarget (domEventOBJ);
							......................................................................

							This method is only applicable to / meaningful for the =mouseover= and =mouseout= mouse events, where the value returned for a =mouseover= event will be the DOM node that the mouse exited in order to enter the new node, and where the value returned for a =mouseout= event will be the DOM node that the mouse is entering as it exits the current node.

							..................................................................................................
							<< table >>

							title: Target and Related Target
							data
							:| domEvent.name | Uize.Node.Event.target (domEvent) | Uize.Node.Event.relatedTarget (domEvent)  |
							:|  'mouseover'  |  the node that mouse is entering  |    the node that mouse is leaving         |
							:|  'mouseout'   |  the node that mouse is leaving   |    the node that mouse is entering        |
							..................................................................................................

							This method abstracts the difference between Microsoft Internet Explorer, which supports the proprietary =fromElement= and =toElement= properties on the event object, and other browsers that support the DOM standard =relatedTarget= property.

							NOTES
							- this method is only applicable to the =mouseover= and =mouseout= mouse events
							- see the related =Uize.Node.Event.target= static method
							- this method does not modify the DOM event object
				*/
			};

			function _stopPropagation () {
				this.stopPropagation ? this.stopPropagation () : (this.cancelBubble = true);
				/* NOTES:
					- "stopPropagation" is the DOM standard, "cancelBubble" is IE's proprietary feature
				*/
			}
			_package.stopPropagation = function (_event) {_stopPropagation.call (_event || event)};
				/*?
					Static Methods
						Uize.Node.Event.stopPropagation
							Stops the propagation of the specified DOM event to other nodes in the DOM.

							SYNTAX
							..............................................
							Uize.Node.Event.stopPropagation (domEventOBJ);
							..............................................

							Using this method for an event will prevent the event from being propagated / bubbled up to nodes that are up the parentNode chain for the node that is the target of the event. Consider the following example...

							EXAMPLE
							..........................................................
							Uize.Node.wire (
								myNode,
								'click',
								function (domEvent) {
									Uize.Node.Event.stopPropagation (domEvent);
									alert ('You should see this message.');
								}
							);
							Uize.Node.wire (
								myNode.parentNode,
								'click',
								function (domEvent) {
									if (Uize.Node.Event.target (domEvent) == myNode) {
										alert ('You should NOT be seeing this message!');
									}
								}
							);
							..........................................................

							In the above example, handlers are being wired for the =click= event of the node =myNode= and its parent node. Under normal circumstances, the user clicking on =myNode= would cause the =click= event to be fired first for that node and then for its parent node as the event is bubbled. In this case, however, the handler for =click= on =myNode= is using the =Uize.Node.Event.stopPropagation= method to cancel the bubbling of the event up to the parent node. Therefore, clicking on the node =myNode= should never produce an alert with the message "You should NOT be seeing this message!".

							This method abstracts the difference between Microsoft Internet Explorer, which supports the proprietary =cancelBubble= property on the event object, and other browsers that support the DOM standard =stopPropagation= method of the event object.

							NOTES
							- this method may modify the DOM event object
							- see the related =Uize.Node.Event.abort= and =Uize.Node.Event.preventDefault= static methods
				*/

			_package.target = function (_event) {
				return (_event || (_event = event)).target || _event.srcElement;
				/* NOTES:
					- "target" is the DOM standard, "srcElement" is IE's proprietary feature
				*/
				/*?
					Static Methods
						Uize.Node.Event.target
							Returns a reference to a DOM node, being the node from which the specified DOM event was dispatched.

							SYNTAX
							........................................................
							targetDomNodeOBJ = Uize.Node.Event.target (domEventOBJ);
							........................................................

							This method abstracts the difference between Microsoft Internet Explorer, which supports the proprietary =srcElement= property on the event object, and other browsers that support the DOM standard =target= property.

							NOTES
							- see the related =Uize.Node.Event.relatedTarget= static method
							- this method does not modify the DOM event object
				*/
			};

		return _package;
	}
});

