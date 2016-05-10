/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Button Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2004-2016 UIZE
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
		The =Uize.Widget.Button= class implements the button widget - the most basic and atomic widget that is used in the implementation of many other widgets.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.Button',
	required:[
		'Uize.Dom.Util',
		'Uize.Dom.Pos',
		'Uize.Dom.Basics'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,
				_true = true,
				_false = false,

			/*** General Variables ***/
				_class,
				_overButton,

				/*** state precedence mechanism ***/
					_statePrecedenceMaps = {},
					_stateNamesToBitMasks = {
						grayed:16,
						'':8,
						over:4,
						active:2,
						playing:1
					},

				/*** regular expressions that you don't want to have to rebuild on every updateUi ***/
					_stateNameMatcher = '(Grayed|Over|Active|Playing)',
					_stateNameMatcherRegExp = new RegExp (_stateNameMatcher),
					_buttonClassMatchRegExp = new RegExp ('(?:(?:(\\S+)\\s+\\1' + _stateNameMatcher + '))','g'),
						// used to find all matches of "className className[STATE]"
					_stateClassRemoverRegExp = new RegExp ('\\S*' + _stateNameMatcher + '\\b','g'),
						// used in a replace to remove all "className[STATE]"
					_classStateQualifierRegExp = /\b(disabled|over|active|playing)\b/,
						// used in a replace to update state qualifier (for simple class-based buttons)
					_buttonClassReplacerRegExpCache = {},

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
			function _isClickable (m,_ignoreSelected) {
				return !!(
					m.get ('enabledInherited') && !m.get ('busyInherited') &&
					(_ignoreSelected || !m._selected || m._clickToDeselect || m._allowClickWhenSelected)
				);
			}

			function _updateUiText () {
				var m = this;
				m._text != _undefined && m.isWired && m.setNodeInnerHtml ('text',m._text);
				/*?
					DOM Nodes
						text DOM Node
							An optional node whose contents will be replaced with the value of the =text= state property, if this property's value is not =null= or =undefined=.

							The =innerHTML= value of the =text DOM Node= will be updated to reflect the value of the =text= state property whenever the value of this property is changed, is not =null= or =undefined=, and the instance is wired up.

							NOTES
							- this DOM node is optional
				*/
			}

			function _updateUiState () {
				var m = this;
				if (m.isWired) {
					var
						_rootNode = m._rootNode,
						_enabledInherited = m.get ('enabledInherited'),
						_busyInherited = m.get ('busyInherited'),
						_stateCombinationNo =
							/* grayed state  */ (!_enabledInherited ? 16 : 0) |
							/* default state */ (!m._state || _busyInherited ? 8 : 0) |
							/* over state    */ (m == _overButton ? 4 : 0) |
							/* active state  */ (m._state == 'down' || m._selected ? 2 : 0) |
							/* playing state */ (m._playing ? 1 : 0)
						,
						_firstShownState = m._statePrecedenceMap [_stateCombinationNo]
					;
					/*?
						DOM Nodes
							Root Node
								The root node is the DOM node with the name =''= (empty string), and is required for this widget class.

								If the =mode= state property is set to the value ='classes'=, then the =className= property of this node is updated to reflect the state of the instance's =playing=, =selected=, and =state= state properties. In such cases, the value used to set the =className= property is constructed by using the values of the =state=, =selected=, =playing=, =busyInherited=, =enabledInherited=, =classNamingForStates=, and =statePrecedenceMap= state properties.

								NOTES
								- this DOM node is required
					*/
					if (_firstShownState == _undefined) {
						for (
							var
								_stateNo = -1,
								_statePrecedence = m._statePrecedence,
								_statePrecedenceLength = _statePrecedence.length
							;
							++_stateNo < _statePrecedenceLength;
						) {
							var _stateName = _statePrecedence [_stateNo];
							if (_stateCombinationNo & _stateNamesToBitMasks [_stateName]) {
								_firstShownState = _stateName;
								break;
							}
						}
						m._statePrecedenceMap [_stateCombinationNo] = _firstShownState;
					}
					if (m._mode == 'classes') {
						var
							_oldClass = _rootNode.className,
							_newClass = ''
						;
						if (m._classNamingForStates == 'disambiguated') {
							var _buttonClass = m._buttonClass;
							if (_buttonClass == _undefined) {
								var _buttonClassMatches = _oldClass.match (_buttonClassMatchRegExp);
								if (_buttonClassMatches) {
									_buttonClass = _buttonClassMatches [_buttonClassMatches.length - 1].split (' ',2) [0];
								} else {
									// find the last class name that doesn't have a state name at the end
									_buttonClassMatches = _oldClass.replace (_stateClassRemoverRegExp,'').match (/(\S+)\s*$/);
									if (_buttonClassMatches)
										_buttonClass = _buttonClassMatches [_buttonClassMatches.length - 1]
									;
								}
								if (m._buttonClass = _buttonClass = _buttonClass || '')
									m._buttonClassReplacerRegExp =
										_buttonClassReplacerRegExpCache [_buttonClass] ||
										(_buttonClassReplacerRegExpCache [_buttonClass] =
											new RegExp (_buttonClass + '(\\s+' + _buttonClass + _stateNameMatcher + ')?')
										)
								;
							}
							var _newClassStateQualifierSuffix = _firstShownState
								? ' ' + _buttonClass + Uize.capFirstChar (_firstShownState)
								: ''
							;
							_newClass = _buttonClass
								? _oldClass.replace (
									m._buttonClassReplacerRegExp,_buttonClass + _newClassStateQualifierSuffix
								)
								: _oldClass.replace (_stateNameMatcherRegExp,'') + _newClassStateQualifierSuffix
							;
						} else {
							var _newClassStateQualifier = _firstShownState == 'grayed' ? 'disabled' : _firstShownState;
							_newClass = _classStateQualifierRegExp.test (_oldClass)
								? _oldClass.replace (_classStateQualifierRegExp,_newClassStateQualifier)
								: _oldClass + (_newClassStateQualifier ? ' ' : '') + _newClassStateQualifier
							;
						}
						if (_newClass != _oldClass) _rootNode.className = _newClass;
					} else if (m._mode == 'frames') {
						m._framesNode.style.top = '-' + (m._frameOrder._frameOrderMap [_firstShownState] * m._framesParentNodeDims.height) + 'px';
					}
					if (m._tooltip && Uize.Tooltip) {
						var _newTooltipShown = m._state == 'over' && _enabledInherited && !m._selected;
						_newTooltipShown != m._tooltipShown &&
							Uize.Tooltip.showTooltip (m._tooltip,m._tooltipShown = _newTooltipShown)
						;
					}
					/*** reflect busy state ***/
						m.get ('busyInherited')
							? m.setNodeStyle (_rootNode,{cursor:'wait'})
							: Uize.Dom.Util.showClickable (_rootNode,_isClickable (m))
						;

					/*** set attributes ***/
						m.setNodeProperties (_rootNode, {disabled:!_enabledInherited});
				}
			}

			function _setStateAndFireEvent (_domEvent) {
				var m = this;
				if (m.isWired) {
					var
						_domEventType = _domEvent.type,
						_isClickEvent = _domEventType == 'click'
					;

					/*** deferred wiring of other events (for performance) ***/
						if (!m._allEventsWired) {
							m._allEventsWired = _true;
							var _boundSetStateAndFireEvent = function (_domEvent) {_setStateAndFireEvent.call (m,_domEvent)};
							m.wireNode (
								m._rootNode,
								{
									mouseout:_boundSetStateAndFireEvent,
									mousedown:_boundSetStateAndFireEvent,
									mouseup:_boundSetStateAndFireEvent,
									dblclick:_boundSetStateAndFireEvent
								}
							);
						}

					if (_isClickEvent) _domEvent.cancelBubble = _true;
					if (_isClickable (m,_domEventType == 'dblclick')) {
						var _eventInfo = _eventInfoMap [_domEventType];
						m.set ({_state:_eventInfo [0]});
						m.fire ({name:_eventInfo [1],domEvent:_domEvent});
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
							m._action && m._action (_domEvent);
							(m._selected ? m._clickToDeselect : m._clickToSelect) && m.toggle ('selected');
						}
					}
				}
			}

		return _class = _superclass.subclass ({
			omegastructor:function () {
				var m = this;

				function _boundUpdateUiState () {
					if (m.isWired) {
						_isClickable (m) || m.set ({_state:''});
						_updateUiState.call (m);
					}
				}
				m.wire ({
					'Changed.busyInherited':_boundUpdateUiState,
					'Changed.enabledInherited':_boundUpdateUiState
				});
			},

			instanceProperties:{
				_tooltipShown:_false
			},

			instanceMethods:{
				setStateAndFireEvent:_setStateAndFireEvent,

				updateUi:function () {
					if (this.isWired) {
						_updateUiState.call (this);
						_updateUiText.call (this);
					}
				},

				wireUi:function () {
					var m = this;
					if (!m.isWired) {
						m._framesNode = _undefined;
						var _rootNode = m._rootNode = m.getNode ();
						if (_rootNode) {
							/*** test if button is in frames mode ***/
								/* IMPORTANT: need a better way of auto-detecting that a button is in frames mode */
								var _childNodes = _rootNode.childNodes;
								if (
									_childNodes.length &&
									(_childNodes.length > 1 || _childNodes [0].nodeType != 3) &&
									(m._framesNode = m.getNode ('frames'))
								) {
									/* NOTE:
										optimized to avoid extra node lookup by id for buttons that are a single node (like a link tag) decorated only with CSS images, or a single node (like a link tag) containing only a single text child node (i.e. a simple text button)
									*/
									m._mode = 'frames';
									m._framesParentNodeDims = Uize.Dom.Pos.getDimensions (m._framesNode.parentNode);
								}

							/*** wire up event handlers ***/
								if (m._followLink && _rootNode.tagName == 'A' && !_rootNode.onclick)
									_rootNode.onclick = Uize.returnTrue
								;
								var _boundSetStateAndFireEvent = function (_domEvent) {_setStateAndFireEvent.call (m,_domEvent)};
								m.wireNode (
									_rootNode,
									{
										mouseover:_boundSetStateAndFireEvent,
										click:_boundSetStateAndFireEvent
									}
								);

							/*** initialize text value if undefined ***/
								m._text == _undefined
									&& m.set ({_text:m.getNodeValue('text')})
								;

							_superclass.doMy (m,'wireUi');
						}
					}
				}
			},

			staticMethods:{
				addChildButton:function (_buttonName,_clickHandler) {
					var
						m = this,
						_button
					;
					function _wireButtonClickEvent () {
						_button.wire (
							'Click',
							function (_event) {
								if (_clickHandler)
									typeof _clickHandler == 'string' ? m.fire (_clickHandler) : _clickHandler (_event)
								;
								m.fire (_event);
							}
						);
					}
					if (m == _class) {
						/*** being used as a static method ***/
							_button = new _class ({idPrefix:_buttonName,name:_buttonName,_followLink:_true});
							_wireButtonClickEvent ();
							(window [_button.instanceId] = _button).wireUi ();
					} else {
						/*** being used as an instance method, stitched in on some other widget class ***/
							_button = m.children [_buttonName];
							if (!_button) {
								_button = m.addChild (_buttonName,_class);
								_wireButtonClickEvent ();
							}
					}
					return _button;
					/*?
						Static Properties
							Uize.Widget.Button.addChildButton
								A function, that can be "stitched in" to other widget classes as an instance method in order to ease adding of child button widgets to instances of those classes, and that is most useful in widget class that add a lot of child buttons.

								SYNTAX
								............................................................................
								myButton = myWidgetInstance.addChildButton (buttonNameSTR,clickHandlerFUNC);
								............................................................................

								In order for the above syntax to work, the =Uize.Widget.Button.addChildButton= function would first need to be "stitched in" as an instance method of the class of which =myWidgetInstance= is an instance. This can be done with a statement such as...

								STITCHING IN
								...............................................................................
								// stitching in as a public method
								MyWidgetClass.prototype.addChildButton = Uize.Widget.Button.addChildButton;

								// stitching in as a private method
								MyWidgetClass.prototype._addChildButton = Uize.Widget.Button.addChildButton;
								............................................................................

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
									...................................................
									myButton = Uize.Widget.Button.addChildButton.call (
										myWidgetInstance,
										buttonNameSTR,
										clickHandlerFUNCorEventNameSTR
									);
									...................................................

									VARIATION
									...................................................................................
									myButton = Uize.Widget.Button.addChildButton.call (myWidgetInstance,buttonNameSTR);
									...................................................................................

								Calling As a Static Method

									SYNTAX
									..................................................
									myLinkButton = Uize.Widget.Button.addChildButton (
										buttonNameSTR,
										clickHandlerFUNCorEventNameSTR
									);
									..................................................

									VARIATION
									.................................................................
									myLinkButton = Uize.Widget.Button.addChildButton (buttonNameSTR);
									.................................................................
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
					onChange:_updateUiState
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
					onChange:_updateUiState
					/*?
						State Properties
							clickToDeselect

								NOTES
								- the initial value is =undefined=
					*/
				},
				_classNamingForStates:{
					name:'classNamingForStates',
					value:'disambiguated' /* simple | disambiguated */
					/*?
						State Properties
							classNamingForStates

								NOTES
								- the initial value is ='disambiguated'=
					*/
				},
				_frameOrder:{
					name:'frameOrder',
					onChange:function () {
						var _frameOrder = this._frameOrder;
						_frameOrder._frameOrderMap || (_frameOrder._frameOrderMap = Uize.reverseLookup (_frameOrder));
					},
					value:['grayed','','over','active','playing']
					/*?
						State Properties
							frameOrder

								NOTES
								- the initial value is =['grayed','','over','active','playing']=
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
				_mode:{
					name:'mode',
					value:'classes'
					/*?
						State Properties
							mode

								NOTES
								- the initial value is ='classes'=
					*/
				},
				_playing:{
					name:'playing',
					onChange:_updateUiState,
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
					onChange:_updateUiState,
					value:_false
					/*?
						State Properties
							selected

								NOTES
								- the initial value is ='false'=
					*/
				},
				_state:{
					name:'state',
					onChange:function () {
						var m = this;
						if (!m._state) {
							if (_overButton == m)
								_overButton = _undefined
							;
						} else if (m._state == 'over') {
							_overButton && _overButton != m && _overButton.set ({_state:''});
							_overButton = m;
						}
						m.isWired && _updateUiState.call (m);
					},
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
					onChange:function () {
						var
							m = this,
							_statePrecedenceAsJoinedStr =
								m._statePrecedence._asJoinedStr ||
								(m._statePrecedence._asJoinedStr = m._statePrecedence.join (','))
						;
						m._statePrecedenceMap =
							_statePrecedenceMaps [_statePrecedenceAsJoinedStr] ||
							(_statePrecedenceMaps [_statePrecedenceAsJoinedStr] = {})
						;
						m.isWired && _updateUiState.call (m);
					},
					value:['playing','active','grayed','over','']
					/*?
						State Properties
							statePrecedence

								NOTES
								- the initial value is =['playing','active','grayed','over','']=
					*/
				},
				_text:{
					name:'text',
					onChange:_updateUiText
					/*?
						State Properties
							text
								A string, whose value will be used to set the value of the =innerHTML= property of the =text DOM Node=.

								The =innerHTML= value of the =text DOM Node= will be updated to reflect the value of the =text= state property whenever the value of this property is changed, is not =null= or =undefined=, and the instance is wired up.

								NOTES
								- the initial value is =undefined=
					*/
				},
				_tooltip:'tooltip'
					/*?
						State Properties
							tooltip
								An object reference to a DOM node, or a string whose value is the =id= for a DOM node, that should be displayed as a tooltip for the instance whenever the user mouses over the =Root Node= and the instance is in a state where clicking on this node would have an action.

								Clicking on the =Root Node= would have an action when the following conditions are met: the =over= state property is set to =true=, the =enabledInherited= state property is set to =true=, the =selected= state property is set to =false=, and the instance is wired.

								NOTES
								- the initial value is =undefined=
								- in order for the value of this property to be honored, the =Uize.Tooltip= module must already be loaded, but the =Uize.Widget.Button= module does not explicitly require the =Uize.Tooltip= module
					*/
			}
		});
	}
});

