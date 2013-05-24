/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Button.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2004-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 8
	codeCompleteness: 100
	docCompleteness: 80
*/

/*?
	Introduction
		The =Uize.Widgets.Button.Widget= class implements the button widget - the most basic and atomic widget that is used in the implementation of many other widgets.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.Button.Widget',
	superclass:'Uize.Widget.V2',
	required:[
		'Uize.Widgets.Button.Html',
		'Uize.Widgets.Button.Css'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_undefined,
				_true = true,
				_false = false
			;

		/*** General Variables ***/
			var
				_overButton,

				/*** state precedence mechanism ***/
					_statePrecedenceMaps = {},
					_stateNamesToBitMasks = {
						disabled:16,
						'':8,
						over:4,
						active:2,
						playing:1
					},

				/*** events map ***/
					_eventInfoMap = {
						mouseover:['over','Over'],
						mouseout:['','Out'],
						mousedown:['down','Down'],
						mouseup:['over','Up'],
						click:['over','Click'],
						dblclick:['over','Double Click']
					}
			;

		/*** Private Instance Methods ***/
			function _updateUiText () {
				var _this = this;
				_this.isWired && _this._text != _undefined &&
					_this.setNodeInnerHtml (_this.getNode ('text') || _this.getNode (),_this._text)
				;
				/*?
					Implied Nodes
						text Implied Node
							An optional node whose contents will be replaced with the value of the =text= state property, if this property's value is not =null= or =undefined=.

							The =innerHTML= value of the =text Implied Node= will be updated to reflect the value of the =text= state property whenever the value of this property is changed, is not =null= or =undefined=, and the instance is wired up.

							NOTES
							- this implied node is optional
				*/
			}

			function _updateUiDisplayedTipText () {
				var _this = this;
				_this.isWired && _this._displayedTipText != _undefined &&
					_this.setNodeProperties ('',{title:_this._displayedTipText})
				;
				/*?
					Implied Nodes
						text Implied Node
							An optional node whose contents will be replaced with the value of the =text= state property, if this property's value is not =null= or =undefined=.

							The =innerHTML= value of the =text Implied Node= will be updated to reflect the value of the =text= state property whenever the value of this property is changed, is not =null= or =undefined=, and the instance is wired up.

							NOTES
							- this implied node is optional
				*/
			}

			function _updateDisplayState () {
				var _this = this;
				if (_this._created) {
					var
						_enabledInherited = _this.get ('enabledInherited'),
						_busyInherited = _this.get ('busyInherited'),
						_stateCombinationNo =
							/* disabled state  */ (!_enabledInherited ? 16 : 0) |
							/* default state */ (!_this._state || _busyInherited ? 8 : 0) |
							/* over state    */ (_this == _overButton ? 4 : 0) |
							/* active state  */ (_this._state == 'down' || _this._selected ? 2 : 0) |
							/* playing state */ (_this._playing ? 1 : 0)
						,
						_displayState = _this._statePrecedenceMap [_stateCombinationNo]
					;
					if (_displayState == _undefined) {
						for (
							var
								_stateNo = -1,
								_statePrecedence = _this._statePrecedence,
								_statePrecedenceLength = _statePrecedence.length
							;
							++_stateNo < _statePrecedenceLength;
						) {
							var _stateName = _statePrecedence [_stateNo];
							if (_stateCombinationNo & _stateNamesToBitMasks [_stateName]) {
								_displayState = _stateName;
								break;
							}
						}
						_this._statePrecedenceMap [_stateCombinationNo] = _displayState;
					}
					_this.set ({_displayState:_this._flavor + (_displayState && ('-' + _displayState))});

					if (_this.isWired && _this._tooltip && Uize.Tooltip) {
						var _newTooltipShown = _this._state == 'over' && _enabledInherited && !_this._selected;
						_newTooltipShown != _this._tooltipShown &&
							Uize.Tooltip.showTooltip (_this._tooltip,_this._tooltipShown = _newTooltipShown)
						;
					}
				}
			}

		var _class = _superclass.subclass ({
			omegastructor:function () {
				var _this = this;
				_this._created = _true;

				function _setStateAndUpdateDisplayState () {
					_this._isClickable () || _this.set ({_state:''});
					_updateDisplayState.call (_this);
				}
				_this.wire ({
					'Changed.busyInherited':_setStateAndUpdateDisplayState,
					'Changed.enabledInherited':_setStateAndUpdateDisplayState
				});
				_updateDisplayState.call (_this);

				_this.onChange (
					function (tipText,enabledInherited,busyInherited) {
						return tipText == _undefined ? _undefined : enabledInherited && !busyInherited ? tipText : '';
					},
					function (_displayedTipText) {
						_this.set ({_displayedTipText:_displayedTipText});
					}
				);
			},

			instanceProperties:{
				_tooltipShown:_false
			},

			instanceMethods:{
				_isClickable:function (_ignoreSelected) {
					var _this = this;
					return !!(
						_this.get ('enabledInherited') && !_this.get ('busyInherited') &&
						(_ignoreSelected || !_this._selected || _this._clickToDeselect || _this._allowClickWhenSelected)
					);
				},

				_setStateAndFireEvent:function (_domEvent) {
					var _this = this;
					if (_this.isWired) {
						var
							_domEventType = _domEvent.type,
							_isClickEvent = _domEventType == 'click',
							_isClickable = _this._isClickable (_domEventType == 'dblclick')
						;

						/*** deferred wiring of other events (for performance) ***/
							if (!_this._allEventsWired) {
								_this._allEventsWired = _true;
								var _setStateAndFireEvent = function (_domEvent) {_this._setStateAndFireEvent (_domEvent)};
								_this.wireNode (
									_this._rootNode,
									{
										mouseout:_setStateAndFireEvent,
										mousedown:_setStateAndFireEvent,
										mouseup:_setStateAndFireEvent,
										dblclick:_setStateAndFireEvent
									}
								);
							}

						if (_isClickEvent) _domEvent.cancelBubble = _true;
						if (_isClickable) {
							var _eventInfo = _eventInfoMap [_domEventType];
							_this.set ({_state:_eventInfo [0]});
							_this.fire ({name:_eventInfo [1],domEvent:_domEvent});
							/*?
								Instance Events
									Click
										An instance event that is fired when the user clicks the instance's =Root Node=.

										This event is fired after the related =Up= instance event. When this event is fired, the value of the =state= state property will be ='over'=. The event object for this event will have a =domEvent= property that is a reference to the browser event object associated to the event on the DOM node. This =domEvent= object can be used to determine what modifier keys were being used, along with other properties of the event.

										NOTES
										- see the companion =Double Click=, =Down=, =Out=, =Over=, and =Up= instance events

									Double Click
										An instance event that is fired when the user double clicks the instance's =Root Node=.

										This event is fired after the related =Up= and =Click= instance events. When this event is fired, the value of the =state= state property will be ='over'=. The event object for this event will have a =domEvent= property that is a reference to the browser event object associated to the event on the DOM node. This =domEvent= object can be used to determine what modifier keys were being used, along with other properties of the event.

										NOTES
										- see the companion =Click=, =Down=, =Out=, =Over=, and =Up= instance events

									Down
										An instance event that is fired when the user mouses down on the instance's =Root Node=.

										When this event is fired, the value of the =state= state property will be ='down'=. The event object for this event will have a =domEvent= property that is a reference to the browser event object associated to the event on the DOM node. This =domEvent= object can be used to determine what modifier keys were being used, along with other properties of the event.

										NOTES
										- see the companion =Click=, =Double Click=, =Out=, =Over=, and =Up= instance events

									Out
										An instance event that is fired when the user mouses out of the instance's =Root Node=.

										When this event is fired, the value of the =state= state property will be =''= (empty string). The event object for this event will have a =domEvent= property that is a reference to the browser event object associated to the event on the DOM node. This =domEvent= object can be used to determine what modifier keys were being used, along with other properties of the event.

										NOTES
										- see the companion =Click=, =Double Click=, =Down=, =Over=, and =Up= instance events

									Over
										An instance event that is fired when the user mouses over the instance's =Root Node=.

										When this event is fired, the value of the =state= state property will be ='over'=. The event object for this event will have a =domEvent= property that is a reference to the browser event object associated to the event on the DOM node. This =domEvent= object can be used to determine what modifier keys were being used, along with other properties of the event.

										NOTES
										- see the companion =Click=, =Double Click=, =Down=, =Out=, and =Up= instance events

									Up
										An instance event that is fired when the user mouses up after first having moused down on the instance's =Root Node=.

										This event is fired before the related =Click= instance event. When this event is fired, the value of the =state= state property will be ='over'=. The event object for this event will have a =domEvent= property that is a reference to the browser event object associated to the event on the DOM node. This =domEvent= object can be used to determine what modifier keys were being used, along with other properties of the event.

										NOTES
										- see the companion =Click=, =Double Click=, =Down=, =Out=, and =Over= instance events
							*/
							if (_isClickEvent) {
								Uize.isFunction (_this._action) && _this._action ();
								(_this._selected ? _this._clickToDeselect : _this._clickToSelect) &&
									_this.set ({_selected:!_this._selected})
								;
							}
						}
					}
				},

				updateUi:function () {
					if (this.isWired) {
					 	_updateUiText.call (this);
						_updateUiDisplayedTipText.call (this);
					}
				},

				wireUi:function () {
					var _this = this;
					if (!_this.isWired) {
						var _rootNode = _this._rootNode = _this.getNode ();
						if (_rootNode) {
							/*** wire up event handlers ***/
								if (_this._followLink && _rootNode.tagName == 'A' && !_rootNode.onclick)
									_rootNode.onclick = Uize.returnTrue
								;
								var _setStateAndFireEvent = function (_domEvent) {_this._setStateAndFireEvent (_domEvent)};
								_this.wireNode (
									_rootNode,
									{
										mouseover:_setStateAndFireEvent,
										click:_setStateAndFireEvent
									}
								);

							_superclass.doMy (_this,'wireUi');
						}
					}
				}
			},

			staticProperties:{
				cssModule:Uize.Widgets.Button.Css
			},

			staticMethods:{
				addChildButton:function (_buttonName,_clickHandler) {
					var
						_this = this,
						_button
					;
					function _wireButtonClickEvent () {
						_button.wire (
							'Click',
							function (_event) {
								if (_clickHandler)
									typeof _clickHandler == 'string' ? _this.fire (_clickHandler) : _clickHandler (_event)
								;
								_this.fire (_event);
							}
						);
					}
					if (Uize.isInstance (_this)) {
						/* NOTE: being used as an instance method, stitched in on some other widget class */
						_button = _this.children [_buttonName];
						if (!_button) {
							_button = _this.addChild (_buttonName,_class);
							_wireButtonClickEvent ();
						}
					} else {
						/* NOTE: being used as a static method */
						_button = new _this ({idPrefix:_buttonName,name:_buttonName,_followLink:_true});
						_wireButtonClickEvent ();
						(window [_button.instanceId] = _button).wireUi ();
					}
					return _button;
					/*?
						Static Properties
							Uize.Widgets.Button.Widget.addChildButton
								A function, that can be "stitched in" to other widget classes as an instance method in order to ease adding of child button widgets to instances of those classes, and that is most useful in widget class that add a lot of child buttons.

								SYNTAX
								............................................................................
								myButton = myWidgetInstance.addChildButton (buttonNameSTR,clickHandlerFUNC);
								............................................................................

								In order for the above syntax to work, the =Uize.Widgets.Button.Widget.addChildButton= function would first need to be "stitched in" as an instance method of the class of which =myWidgetInstance= is an instance. This can be done with a statement such as...

								STITCHING IN
								....................................................................................
								// stitching in as a public method
								MyWidgetClass.prototype.addChildButton = Uize.Widgets.Button.Widget.addChildButton;

								// stitching in as a private method
								MyWidgetClass.prototype._addChildButton = Uize.Widgets.Button.Widget.addChildButton;
								....................................................................................

								VARIATION 1
								........................................................................
								myButton = myWidgetInstance.addChildButton (buttonNameSTR,eventNameSTR);
								........................................................................

								When the =eventNameSTR= parameter is specified in place of the =clickHandlerFUNC= parameter, then clicking the added child button will fire an event of the name specified by the =eventNameSTR= parameter on the instance to which the child button was added, rather than executing click handler code.

								VARIATION 2
								...........................................................
								myButton = myWidgetInstance.addChildButton (buttonNameSTR);
								...........................................................

								When only the =buttonNameSTR= parameter is specified, then no custom event will be fired and no click hander function will be executed. Instead, only the button's ='Click'= instance event will be relayed to the widget instance to which the child button was added. Any handler code for this ='Click'= event fired on the button's parent would then have to use the event object's =source= property to determine which button was clicked.

								Calling Without Stitching In

									SYNTAX
									...........................................................
									myButton = Uize.Widgets.Button.Widget.addChildButton.call (
										myWidgetInstance,
										buttonNameSTR,
										clickHandlerFUNCorEventNameSTR
									);
									...........................................................

									VARIATION
									...........................................................................................
									myButton = Uize.Widgets.Button.Widget.addChildButton.call (myWidgetInstance,buttonNameSTR);
									...........................................................................................

								Calling As a Static Method

									SYNTAX
									..........................................................
									myLinkButton = Uize.Widgets.Button.Widget.addChildButton (
										buttonNameSTR,
										clickHandlerFUNCorEventNameSTR
									);
									..........................................................

									VARIATION
									.........................................................................
									myLinkButton = Uize.Widgets.Button.Widget.addChildButton (buttonNameSTR);
									.........................................................................
					*/
				}
			},

			stateProperties:{
				_action:'action',
					/*?
						State Properties
							action

								NOTES
								- the initial value is =undefined=
					*/
				_allowClickWhenSelected:{
					name:'allowClickWhenSelected',
					onChange:_updateDisplayState
					/*?
						State Properties
							allowClickWhenSelected

								NOTES
								- the initial value is =undefined=
					*/
				},
				_clickToSelect:'clickToSelect',
					/*?
						State Properties
							clickToSelect

								NOTES
								- the initial value is =undefined=
					*/
				_clickToDeselect:{
					name:'clickToDeselect',
					onChange:_updateDisplayState
					/*?
						State Properties
							clickToDeselect

								NOTES
								- the initial value is =undefined=
					*/
				},
				_displayState:{
					name:'displayState'
					/*?
						State Properties
							displayState

								NOTES
								- the initial value is =''= (empty string)
					*/
				},
				_followLink:{
					name:'followLink',
					value:_false
					/*?
						State Properties
							followLink

								NOTES
								- the initial value is =false=
					*/
				},
				_playing:{
					name:'playing',
					onChange:_updateDisplayState,
					value:_false
					/*?
						State Properties
							playing

								NOTES
								- the initial value is ='false'=
					*/
				},
				_selected:{
					name:'selected',
					onChange:_updateDisplayState,
					value:_false
					/*?
						State Properties
							selected

								NOTES
								- the initial value is ='false'=
					*/
				},
				_size:{
					name:'size',
					value:'medium'
				},
				_state:{
					name:'state',
					onChange:[
						function () {
							var _this = this;
							if (!_this._state) {
								if (_overButton == _this)
									_overButton = _undefined
								;
							} else if (_this._state == 'over') {
								_overButton && _overButton != _this && _overButton.set ({_state:''});
								_overButton = _this;
							}
						},
						_updateDisplayState
					],
					value:''
					/*?
						State Properties
							state
								A string, indicating the mouseover or mousedown state of the instance.

								Possible values for this property are...

								- =''= (empty string) - the default state, when the user is neither mousing over or mousing down on the instance's =Root Node=
								- ='over'= - indicates that the user is mousing over the instance's =Root Node=
								- ='down'= - indicates that the user is mousing down on the instance's =Root Node=

								NOTES
								- the initial value is =''= (an empty string)
								- this state property should not be confused with the related =playing= and =selected= state properties
								- while the instance is not wired, the value of this property will remain =''= (empty string)
					*/
				},
				_statePrecedence:{
					name:'statePrecedence',
					onChange:[
						function () {
							var
								_this = this,
								_statePrecedenceAsJoinedStr =
									_this._statePrecedence._asJoinedStr ||
									(_this._statePrecedence._asJoinedStr = _this._statePrecedence.join (','))
							;
							_this._statePrecedenceMap =
								_statePrecedenceMaps [_statePrecedenceAsJoinedStr] ||
								(_statePrecedenceMaps [_statePrecedenceAsJoinedStr] = {})
							;
						},
						_updateDisplayState
					],
					value:['playing','active','disabled','over','']
					/*?
						State Properties
							statePrecedence

								NOTES
								- the initial value is =['playing','active','disabled','over','']=
					*/
				},
				_text:{
					name:'text',
					onChange:_updateUiText
					/*?
						State Properties
							text
								A string, whose value will be used to set the value of the =innerHTML= property of the =text Implied Node=.

								The =innerHTML= value of the =text Implied Node= will be updated to reflect the value of the =text= state property whenever the value of this property is changed, is not =null= or =undefined=, and the instance is wired up.

								NOTES
								- the initial value is =undefined=
					*/
				},
				_displayedTipText:{
					name:'displayedTipText',
					onChange:_updateUiDisplayedTipText
				},
				_tipText:'tipText',
					/*?
						State Properties
							tipText
								.
					*/
				_tooltip:'tooltip',
					/*?
						State Properties
							tooltip
								An object reference to a DOM node, or a string whose value is the =id= for a DOM node, that should be displayed as a tooltip for the instance whenever the user mouses over the =Root Node= and the instance is in a state where clicking on this node would have an action.

								Clicking on the =Root Node= would have an action when the following conditions are met: the =over= state property is set to =true=, the =enabledInherited= state property is set to =true=, the =selected= state property is set to =false=, and the instance is wired.

								NOTES
								- the initial value is =undefined=
								- in order for the value of this property to be honored, the =Uize.Tooltip= module must already be loaded, but the =Uize.Widgets.Button.Widget= module does not explicitly require the =Uize.Tooltip= module
					*/
				_flavor:{
					name:'flavor',
					value:'normal', // values can be 'normal' | 'primary' | 'positive' | 'negative'
					onChange:_updateDisplayState
				}
			},

			set:{
				html:Uize.Widgets.Button.Html
			},

			stateToCssBindings:{
				displayState:'value',
				busyInherited:['','busy'],
				size:'value'
			}
		});

		/*?
			Implied Nodes
				Root Node
					The root node is the implied node with the name =''= (empty string), and is required for this widget class.

					The =className= property of this node is updated to reflect the state of the instance's =playing=, =selected=, and =state= state properties. In such cases, the value used to set the =className= property is constructed by using the values of the =state=, =selected=, =playing=, =busyInherited=, =enabledInherited=, and =statePrecedenceMap= state properties.

					NOTES
					- this implied node is required
		*/

		return _class;
	}
});

