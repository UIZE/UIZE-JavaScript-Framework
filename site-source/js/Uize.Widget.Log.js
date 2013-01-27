/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Log Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 2
	codeCompleteness: 25
	docCompleteness: 50
*/

/*?
	Introduction
		The =Uize.Widget.Log= class implements a basic log interface.

		*DEVELOPERS:* `Chris van Rensburg`

	In a Nutshell
		Logging a Message
			Logging a message can be accomplished quite easily, simply by calling the =log= instance method.

			EXAMPLE
			.....................................
			myLog.log ('This is my log message');
			.....................................

			Messages that are logged by calling the =log= instance method will be displayed in the =messages= implied node of the instance. If the =showTimestamp= state property is set to the value =true=, then `log message timestamping` will be enabled for logged messages. If a message is logged before the instance is wired, then the message will be added to the `queued log messages`.

			Log Messages Displayed Literally
				The text of a log message is displayed literally / exactly.

				That is, if a log message's text contains any HTML code, that HTML code will be displayed literally - you cannot use HTML markup to format your log messages. This is to ensure that HTML that may be contained in the values of parameters or properties that are logged do not break the layout of the log's HTML or the document in any way.

				EXAMPLE
				............................................
				myLog.log ('This is my <b>log</b> message');
				............................................

				LOG OUTPUT
				...................................................
				2010-07-05 22:34:30 : This is my <b>log</b> message
				...................................................

				You might wish to use a log to display the =innerHTML= of some DOM node whose contents you care to observe, or you may wish to display the value of some variable or property that may possibly contain HTML markup. In such cases, you don't want to mere act of logging some text to destroy the layout of the page containing the log, or execute some arbitrary JavaScript code because the text you happen to be sending to the log contains a =script= tag inside it somewhere.

			Log Message Timestamping
				The =Uize.Widget.Log= module implements a message timestamping feature, which allows messages to be automatically timestamped at the time that they are logged.

				Log message timestamping is activated by setting the =showTimestamp= state property to =true=. When timestamping is enabled, each logged message will be prefixed with a timestamp that indicates when it was logged. The timestamp format is determined by the =timestampFormat= state property, which can specify any date format string supported by the =Uize.Date.Formatter= module.

				To illustrate the timestamping feature, consider the following examples...

				EXAMPLE 1: No Timestamping
					In the following example, `log message timestamping` has been disabled by explicitly setting the =showTimestamp= state property to =false=.

					EXAMPLE
					................................................
					myLog = Uize.Widget.Log ({showTimestamp:false});
					myLog.wireUi ();
					myLog.log ('This is my log message');
					................................................

					LOG OUTPUT
					......................
					This is my log message
					......................

				EXAMPLE 2: Timestamping With Default Format
					In the following example, `log message timestamping` is enabled by simply not overriding the initial value of =true= for the =showTimestamp= state property.

					EXAMPLE
					.....................................
					myLog = Uize.Widget.Log ();
					myLog.wireUi ();
					myLog.log ('This is my log message');
					.....................................

					LOG OUTPUT
					.....................................
					22:34:30.519 : This is my log message
					.....................................

				EXAMPLE 3: Timestamping With Custom Format
					In the following example, `log message timestamping` is enabled and a custom timestamp format is being specified using the =timestampFormat= state property.

					EXAMPLE
					....................................................................................
					myLog = Uize.Widget.Log ({timestampFormat:'{YYYY}-{MM}-{DD} {hh}:{mm}:{ss}.{zzz}'});
					myLog.wireUi ();
					myLog.log ('This is my log message');
					.....................................................................................

					LOG OUTPUT
					................................................
					2010-07-05 22:34:30.519 : This is my log message
					................................................

					The default timestamp format shows hours, minutes, seconds, and milliseconds. In this example we are adding year, month, and day of month to the timestamp by prepending the date format segment ={YYYY}-{MM}-{DD}=.

		Clearing the Log
			All logged messages that are displayed in the =messages= implied node can be easily cleared, either by the user clicking the clear button (the =clear Child Widget=), or by an application calling the =clear= instance method.

			EXAMPLE
			...............
			myLog.clear ();
			...............

		Queued Log Messages
			Any messages that are logged while an instance is not yet wired are added to a queue of logged messages that will be displayed when the instance is wired.

			EXAMPLE
			.....................................
			myLog = Uize.Widget.Log ();
			myLog.log ('This is my log message');
			myLog.wireUi ();
			.....................................

			LOG OUTPUT
			............................................
			2010-07-05 22:34:30 : This is my log message
			............................................

			In the above example, even though the log instance is not yet wired when the =log= instance method is called, wiring the instance will result in the logged message being displayed because it was added to the Queued Log Messages.

		Log Widget Markup
			For an example of HTML markup that is compatible with the =Uize.Widget.Log= class, see the template module =Uize.Templates.Log=.
*/

Uize.module ({
	name:'Uize.Widget.Log',
	required:[
		'Uize.Widget.Button',
		'Uize.Xml',
		'Uize.Date.Formatter'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function () {
						var _this = this;

						/*** add the clear button ***/
							_this.addChild ('clear',Uize.Widget.Button).wire ('Click',function () {_this.clear ()});
							/*?
								Child Widgets
									clear Child Widget
										An instance of the =Uize.Widget.Button= class, which is wired to call the =clear= instance method when it is clicked.

										NOTES
										- see the related =clear= instance method
							*/

						/*** initialize state ***/
							_this._updateClearButtonState ();
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._updateClearButtonState = function () {
				var _clearButton = this.children.clear;
				_clearButton && _clearButton.set ({enabled:this._isEmpty ? false : 'inherit'});
			};

		/*** Public Instance Methods ***/
			_classPrototype.clear = function () {
				var _this = this;
				_this.isWired ? _this.setNodeInnerHtml ('messages','') : (_this._queuedLogMessagesHtml = null);
				_this.set ({_isEmpty:true});
				/*?
					Instance Methods
						clear
							Clears the log messages displayed in the =messages= implied node.

							SYNTAX
							....................
							myInstance.clear ();
							....................

							If the instance is not wired at the time that this method is called, then the `queued log messages` will be cleared. The =clear= instance method is called when the user clicks the =clear Child Widget=.

							NOTES
							- see the related =clear Child Widget=
				*/
			};

			_classPrototype.log = function (_message) {
				var
					_this = this,
					_messageHtml =
						(_this._showTimestamp ? (Uize.Date.Formatter.format (null,_this._timestampFormat) + ' : ') : '') +
						Uize.Xml.toAttributeValue (_message) +
						'<br/>'
				;
				if (_this.isWired) {
					_this.injectNodeHtml ('messages',_messageHtml);
					_this.setNodeProperties ('messages',{scrollTop:1000000});
					/*?
						Implied Nodes
							messages
								A node that is used to display the messages being logged.

								Whenever a new message is logged, the contents of the =messages= implied node is added to. This node may be a =div=, =span=, =p= tag, or any other type that may contain arbitrary HTML. When the =clear= instance method is called, either programmatically or as a result of the user clicking the =clear Child Widget=, the =innerHTML= of the =messages= node will be replaced with nothing.
					*/
				} else {
					(_this._queuedLogMessagesHtml || (_this._queuedLogMessagesHtml = [])).push (_messageHtml);
				}
				_this.set ({_isEmpty:false});
				/*?
					Instance Methods
						log
							Logs the specified message by displaying it in the =messages= implied node.

							SYNTAX
							................................
							myInstance.log (messageTextSTR);
							................................

							If the instance is not wired at the time that this method is called, then the specified log message will be added to the `queued log messages`. For a more detailed discussion on logging, see the section `Logging a Message`.
				*/
			};

			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					_superclass.prototype.wireUi.call (_this);

					_this.setNodeInnerHtml ('messages',(_this._queuedLogMessagesHtml || []).join (''));
					_this.setNodeProperties ('messages',{scrollTop:1000000});
					_this._queuedLogMessagesHtml = null;
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_isEmpty:{
					name:'isEmpty',
					onChange:_classPrototype._updateClearButtonState,
					value:true
					/*?
						State Properties
							isEmpty
								A read-only boolean, indicating whether or not the =messages= implied node contains any logged messages.

								When the value of this property is =true=, then the =clear Child Widget= will be disabled. When the value of this property is =false=, then the =clear Child Widget= will be enabled.

								NOTES
								- this property is read-only
								- the initial value is =true=
					*/
				},
				_showTimestamp:{
					name:'showTimestamp',
					value:true
					/*?
						State Properties
							showTimestamp
								A boolean, specifying whether or not `log message timestamping` should be enabled for logged messages.

								When the value of this property is =true=, then the value of the related =timestampFormat= state property can be used to control how the prepended timestamps are formatted.

								NOTES
								- see the related =timestampFormat= state property
								- the initial value is =true=
					*/
				},
				_timestampFormat:{
					name:'timestampFormat',
					value:'{hh}:{mm}:{ss}.{zzz}'
					/*?
						State Properties
							timestampFormat
								A string, specifying the date format that should be used to format the timestamp that is prepended to logged messages when the =showTimestamp= state property is set to =true=.

								The value of the =timestampFormat= property can be any date format supported by the =Uize.Date.Formatter= module. When the value of the =showTimestamp= state property is =false=, then the =timestampFormat= state property is not applicable.

								NOTES
								- see the related =showTimestamp= state property
								- the initial value is ='{hh}:{mm}:{ss}.{zzz}'=
					*/
				}
			});

		return _class;
	}
});

