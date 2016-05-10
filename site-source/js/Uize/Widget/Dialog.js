/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Dialog Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 6
	codeCompleteness: 80
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widget.Dialog= class implements support for inline dialogs, with features like drag-and-drop moving, ok, cancel, and close buttons, and more.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.Dialog',
	required:[
		'Uize.Dom.Basics',
		'Uize.Dom.Pos',
		'Uize.Widget.Button',
		'Uize.Widget.Drag',
		'Uize.Fade'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_true = true,
				_false = false,
				_undefined,
				_Uize_Dom_Basics = Uize.Dom.Basics,
				_Uize_Dom_Pos = Uize.Dom.Pos,
				_Uize_Widget = Uize.Widget,
				_Uize_Widget_Drag = _Uize_Widget.Drag,
				_updateUiDimsIfShown = 'updateUiDimsIfShown',
				_updateUiPositionIfShown = 'updateUiPositionIfShown',

			/*** General Variables ***/
				_class,
				_sacredEmptyObject = {},
				_zIndexSlots = {},
				_totalShown = 0,
				_browserHasSelectShowThroughIssue = _Uize_Dom_Basics.ieMajorVersion == 6
		;

		/*** Private Instance Methods ***/
			function _addChildButton (m,_name,_action) {
				var _button = m.addChild (_name,m.Class.buttonWidgetClass);
				_button.wire ('Click',_action);
				return _button;
			}

			function _dismiss (m,_dismissalEvent) {
				m.fire (_dismissalEvent).abort || m.set ({_shown:_false});
			}

			function _updateUiTitle () {
				var m = this;
				if (m.isWired) {
					var _defaultedTitle = m._title || m._defaultTitle;
					_defaultedTitle != _undefined && m.setNodeInnerHtml ('title',_defaultedTitle || '&nbsp;');
						/*?
							DOM Nodes
								title DOM Node
									A node that acts as the title bar for the dialog and that is wired up by the =drag= child widget to enable drag-to-move for the dialog.

									The text for the dialog's title bar can be controlled via the =title= and =defaultTitle= state properties.

									NOTES
									- if no =title DOM Node= is present in the dialog's HTML, then the dialog will not be movable
									- see also the =defaultTitle= and =title= state properties
						*/
				}
			}

			function _syncOkAndCancelText () {
				var
					m = this,
					_children = m.children
				;
				function _updateTextForButton (_widget,_defaultedText) {
					_widget && _defaultedText != _undefined && _widget.set ({text:_defaultedText});
				}
				_updateTextForButton (_children.ok,m._okText || m._defaultOkText);
				_updateTextForButton (_children.cancel,m._cancelText || m._defaultCancelText);
			}

		return _class = _superclass.subclass ({
			alphastructor:function () {
				var m = this;

				/*** Private Instance Properties ***/
					(
						m._shieldFade = m.shieldFade = Uize.Fade ({
							curve:Uize.Fade.celeration (0,1),
							duration:750
						})
						/*?
							Instance Properties
								shieldFade
									An instance of the =Uize.Fade= class, that is used to fade the opacity of the =shield= DOM node when hiding it.

									This property lets you customize the qualities of the opacity fade for the dialog's =shield=, by letting you set values for the state properties of the =Uize.Fade= instance (such as =duration=, =curve=, etc.).
						*/
					).wire (
						'Changed.value',
						function (_event) {m.set ({_currentShieldOpacity:_event.newValue})}
					);
					m.wire ({
						'Drag Start':
							function () {
								if (!m._draggedSinceShown) {
									m._draggedSinceShown = _true;
									m.fire ('First Drag Since Shown');
									/*?
										Instance Events
											First Drag Since Shown
												An instance event that is fired for only the first time that the dialog is dragged after it has been shown.

												NOTES
												- compare to the =Drag Start= instance event
												- see the related =Drag Done= instance event
									*/
									m._hideShieldOnDrag && m.set ({_shieldShown:_false});
								}
							},
						'Drag Done':
							function () {
								var _mooringNode = _Uize_Dom_Basics.getById (m._mooringNode);
								if (_mooringNode) {
									var
										_mooringCoords = _Uize_Dom_Pos.getCoords (_mooringNode),
										_rootNode = m.getNode ()
									;
									m.set ({
										offsetX:
											parseInt (_Uize_Dom_Basics.getStyle (_rootNode,'left')) - _mooringCoords.left,
										offsetY:
											parseInt (_Uize_Dom_Basics.getStyle (_rootNode,'top')) - _mooringCoords.top
									});
								}
							}
					});
			},

			omegastructor:function () {
				var m = this;

				/*** create the drag widget for the drag-to-move behavior ***/
					var
						_rootNode,
						_dragStartRootNodePos = [0,0]
					;
					(m._drag = m.addChild ('drag',_Uize_Widget_Drag,{cursor:'move'}))
						.wire ({
							'Before Drag Start':
								function () {
									_rootNode = m.getNode ();
									_dragStartRootNodePos [0] = parseInt (_Uize_Dom_Basics.getStyle (_rootNode,'left'));
									_dragStartRootNodePos [1] = parseInt (_Uize_Dom_Basics.getStyle (_rootNode,'top'));
								},
							'Changed.inDrag':function (_event) {m.set ({_inDrag:_event.newValue})},
							'Drag Start':m,
								/*?
									Instance Events
										Drag Start
											An instance event that is fired each time the user starts dragging the dialog (either for moving or resizing).

											NOTES
											- compare to the =First Drag Since Shown= instance event
											- see the related =Drag Done= instance event
								*/
							'Drag Update':
								function () {
									var _eventDeltaPos = m._drag.eventDeltaPos;
									_Uize_Dom_Basics.setStyle (
										_rootNode,
										{
											left:_dragStartRootNodePos [0] + _eventDeltaPos [0],
											top:_dragStartRootNodePos [1] + _eventDeltaPos [1]
										}
									);
								},
							'Drag Done':m
								/*?
									Instance Events
										Drag Done
											An instance event that is fired each time the user finishes dragging the dialog (either when moving or resizing).

											NOTES
											- see the related =Drag Start= instance event
								*/
						})
						/*?
							Child Widgets
								drag
									An instance of the =Uize.Widget.Drag= class, that is wired up to the =title DOM Node= to enable drag-to-move for the dialog.

									Setting the =enabled= state property of this child widget to =false= will disable drag-to-move for the dialog.
						*/
					;

				/*** create buttons ***/
					_addChildButton (m,'close',function () {_dismiss (m,'Close')});
						/*?
							Child Widgets
								close
									A button instance, that lets the user close the dialog.

									When this button is clicked, the =Close= event is fired on the dialog instance.

							Instance Events
								Close
									An instance event that is fired when the user clicks the =close= button.

									NOTES
									- the handler for this event can abort the closing of the dialog by setting the =abort= property of the event object to =true=
						*/
					_addChildButton (m,'qualifiedOk',function () {_dismiss (m,'Qualified Ok')});
						/*?
							Child Widgets
								qualifiedOk
									A button instance, that lets the user submit the dialog with a qualification.

									The =qualifiedOk= button is like a second =ok= button (kind of like an "ok, but with this one condition..." action). Having a second ok-like button is useful in a few cases, but most dialogs will not provide markup for this button. When this button is clicked, the =Qualified Ok= event is fired on the dialog instance.

							Instance Events
								Qualified Ok
									An instance event that is fired when the user clicks the =qualifiedOk= button.

									NOTES
									- the handler for this event can abort the closing of the dialog by setting the =abort= property of the event object to =true=
						*/
					_addChildButton (m,'ok',function () {_dismiss (m,'Ok')});
						/*?
							Child Widgets
								ok
									A button instance, that lets the user submit the dialog.

									When this button is clicked, the =Ok= event is fired on the dialog instance. The text for this button can be controlled via the =okText= and =defaultOkText= state properties.

							Instance Events
								Ok
									An instance event that is fired when the user clicks the =ok= button.

									NOTES
									- the handler for this event can abort the closing of the dialog by setting the =abort= property of the event object to =true=
						*/
					_addChildButton (m,'cancel',function () {_dismiss (m,'Cancel')});
						/*?
							Child Widgets
								cancel
									A button instance, that lets the user cancel (and close) the dialog.

									When this button is clicked, the =Cancel= event is fired on the dialog instance. The text for this button can be controlled via the =cancelText= and =defaultCancelText= state properties.

							Instance Events
								Cancel
									An instance event that is fired when the user clicks the =cancel= button.

									NOTES
									- the handler for this event can abort the closing of the dialog by setting the =abort= property of the event object to =true=
						*/

				/*** initialization ***/
					_syncOkAndCancelText.call (m);
					m.atEndOfOmegaStructor ();
			},

			instanceMethods:{
				/*** Hook Methods for Uize.Widget.Dialog.xResizable ***/
					atEndOfOmegaStructor:Uize.nop,
					afterWireUi:Uize.nop,

				responsiveUpdateUiPositionAndDimensions:function () {
					var
						m = this,
						_rootNode = m.getNode(),
						_nodeToSetDimension = m.getNode(m._nodeToSetDimension)
					;

					// first clean out any max width/height from previous update
					m.setNodeStyle(
						_nodeToSetDimension,
						{
							maxWidth:'',
							maxHeight:''
						}
					);

					// next determine if the dialog is too big
					var
						_windowCoords = _Uize_Dom_Pos.getCoords(window),
						_rootNodeDims = _Uize_Dom_Pos.getDimensions(_rootNode),
						_nodeToSetIsRoot = _nodeToSetDimension == _rootNode,
						_nodeToSetDims = _nodeToSetIsRoot ? _rootNodeDims : _Uize_Dom_Pos.getDimensions(_nodeToSetDimension)
					;

					// set max width/height such that the root node will be 100% in either dimension
					m.setNodeStyle(
						_nodeToSetDimension,
						{
							maxWidth:_rootNodeDims.width > _windowCoords.width ? _windowCoords.width - (_rootNodeDims.width - _nodeToSetDims.width) : '',
							maxHeight:_rootNodeDims.height > _windowCoords.height ? _windowCoords.height - (_rootNodeDims.height - _nodeToSetDims.height) : ''
						}
					);

					// update the root node dims object if we set max width/height above
					if (_rootNodeDims.width > _windowCoords.width || _rootNodeDims.height > _windowCoords.height)
						_rootNodeDims = _Uize_Dom_Pos.getDimensions(_rootNode);

					// lastly center position if small enough or 0,0 if too big
					var
						_leftCentered = _windowCoords.x + ((_windowCoords.width - _rootNodeDims.width) >> 1),
						_topCentered = _windowCoords.y + ((_windowCoords.height - _rootNodeDims.height) >> 1)
					;

					m.setNodeStyle(
						_rootNode,
						{
							left: _leftCentered > 0 ? _leftCentered : 0,
							top: _topCentered > 0 ? _topCentered : 0
						}
					);
				},

				updateUiPositionIfShown:function () {
					var m = this;
					if (m.isWired && m._shown && !m._inDrag) {
						_Uize_Widget_Drag.resizeShield (m.getNode ('shield'));
						/*?
							DOM Nodes
								Root Node
									A node that is the root for all of the dialog's HTML, excluding the =shield= DOM node.

									When a dialog is shown, its =Root Node= and =shield= DOM nodes are displayed. Conversely, when a dialog is hidden, both its =Root Node= and =shield= DOM nodes are hidden. When a dialog is dragged to a new position by the user, or if its position is programmatically changed, then the =Root Node= is repositioned through CSS. If the dialog is resized by the user, or if it is resized programmatically by setting values for its =width= and =height= state properties, the dimensions of the =Root Node= are modified through CSS. All chrome for the dialog should therefore be "pinned" to the =Root Node=, so that when the dialog is moved and resized, the chrome goes along for the ride.

								shield
									A node that will be sized to fill the entire browser view port, in order to block events to the page behind the dialog.

									When the dialog is shown, the =shield= DOM node is shown along with the =Root Node=. The shield can be set to hide when the user drag or resizes the dialog by setting the =hideShieldOnDrag= state property to =true=. When the dialog is shown, the shield can be hidden by setting the =shieldShown= state property to =false=. Even though the shield won't be visible, it will still block events to the page behind the dialog.

									NOTES
									- see also the =currentShieldOpacity=, =hideShieldOnDrag=, =shieldOpacity=, and =shieldShown= state properties
									- see also the =shieldFade= instance property
						*/
						if (m._autoPosition) {
							var
								_rootNode = m.getNode (),
								_mooringNode = _Uize_Dom_Basics.getById (m._mooringNode),
								_offsetX = m._offsetX,
								_offsetY = m._offsetY
							;
							if (!_mooringNode || _offsetX == _undefined || _offsetY == _undefined) {
								m.responsiveUpdateUiPositionAndDimensions();
								//_Uize_Dom_Pos.centerInWindow(_rootNode);
							}
							if (_mooringNode) {
								if (_offsetX == 'adjacent' || _offsetY == 'adjacent') {
									_Uize_Dom_Pos.setAbsPosAdjacentTo (_rootNode, _mooringNode);
								}
								else {
									var
										_mooringCoords = _Uize_Dom_Pos.getCoords(_mooringNode),
										_rightAligned = m._offsetRegistrationCorner.indexOf('right') > -1,
										_bottomAligned = m._offsetRegistrationCorner.indexOf('bottom') > -1,
										_bodyDimensions = _Uize_Dom_Pos.getDimensions(document.body)
									;

									// set styles
									m.setNodeStyle (
										_rootNode, 
										{
											left: _rightAligned ? '' : (_mooringCoords.left + _offsetX),
											right: _rightAligned ? (_bodyDimensions.width - _mooringCoords.left - _offsetX) : '',
											top: _bottomAligned ? '' : (_mooringCoords.top + _offsetY),
											bottom: _bottomAligned ? (_bodyDimensions.height - _mooringCoords.top - _offsetY) : ''
										}
									);
								}
							}
						}
					}
				},

				updateUiDimsIfShown:function () {
					var m = this;
					m.isWired && m._shown && !m._inDrag &&
						m.setNodeStyle (m.getNode(m._nodeToSetDimension),{width:m._width,height:m._height})
					;
				},

				updateUi:function () {
					var m = this;

					if (m.isWired) {
						_updateUiTitle.call (m);

						_superclass.doMy (m,'updateUi');
					}
				},

				wireUi:function () {
					var m = this;
					if (!m.isWired) {
						m.wireNode (window,'resize',function () {m.updateUiPositionIfShown ()});
						m._drag.set ({node:m.getNode ('title')});

						m.wireNode(
							'shield',
							'click',
							function () {
								var _dismissOnShieldClick = m._dismissOnShieldClick;
								_dismissOnShieldClick &&
									_dismiss (m,typeof _dismissOnShieldClick == 'string' ? _dismissOnShieldClick : 'Close')
								;
							}
						);

						/*** fetch values for defaultTitle, defaultOkText, and defaultCancelText from markup ***/
							var _initializeDefaultProperty = function (_defaultPropertyName,_widget,_nodeName) {
								if (!m.get (_defaultPropertyName)) {
									var _innerHtml = (_widget.getNode (_nodeName) || _sacredEmptyObject).innerHTML;
									_innerHtml && m.set (_defaultPropertyName,_innerHtml);
								}
							};
							_initializeDefaultProperty ('defaultTitle',m,'title');
							_initializeDefaultProperty ('defaultOkText',m.children.ok,'text');
							_initializeDefaultProperty ('defaultCancelText',m.children.cancel,'text');

						_superclass.doMy (m,'wireUi');

						m.afterWireUi ();
					}
				}
			},

			stateProperties:{
				_autoPosition:{
					name:'autoPosition',
					value:_true,
					onChange:_updateUiPositionIfShown
					/*?
						State Properties
							autoPosition
								A boolean, indicating whether or not the dialog should be automatically positioned when it is shown, or whenever the browser window is resized.

								When =autoPosition= is set to =true=, the dialog will be automatically positioned each time it is shown and each time the browser window is resized. When the dialog is positioned, the way in which it is positioned is determined by the value of the =mooringNode=, =offsetX=, and =offsetY= state properties.

								If the value of the =mooringNode= state property resolves to a DOM node, then the dialog will be "moored" to the specified mooring node (for a more detailed explanation, see the reference for the =mooringNode= state property). On the other hand, if the value of the =mooringNode= state property is =null=, =undefined=, or does not resolve to a DOM node, then the dialog will be positioned so that it is centered in the browser window.

								NOTES
								- the initial value is =true=
					*/
				},
				_cancelText:{
					name:'cancelText',
					onChange:_syncOkAndCancelText
					/*?
						State Properties
							cancelText
								A string, representing text that should be displayed for the dialog's =cancel= button.

								Using this property, the text of the =cancel= button can be changed at any time - even when the dialog is shown. Setting a non-empty string value for this property has the effect of setting the value of the =text= state property for the =cancel= child widget. Leaving =cancelText= set to its initial value of =undefined= will result in the =cancel= button's text being determined by the value of the =defaultCancelText= state property. If the values for both the =cancelText= and =defaultCancelText= state properties are =undefined=, then the =cancel= button will retain whatever text was initially in its HTML markup.

								NOTES
								- see the companion =defaultCancelText= state property
								- the initial value is =undefined=
					*/
				},
				_currentShieldOpacity:{
					name:'currentShieldOpacity',
					onChange:function () {
						var m = this;
						m.isWired && m._shown && m.setNodeOpacity ('shield',m._currentShieldOpacity);
					}
					/*?
						State Properties
							currentShieldOpacity
								A read-only floating point number in the range of =0= to =1=, indicating the current opacity level of the dialog's shield.

								NOTES
								- this property is read-only
								- see the related =hideShieldOnDrag=, =shieldOpacity=, and =shieldShown= state properties, and the =shield= DOM node
								- the initial value is =undefined=
					*/
				},
				_defaultCancelText:{
					name:'defaultCancelText',
					onChange:_syncOkAndCancelText
					/*?
						State Properties
							defaultCancelText
								A string, specifying the default text for the =cancel= button, should the =cancelText= state property be set to =null=, =undefined=, or =''= (an empty string).

								For a more detailed explanation of the cancel button text fallback mechanism, see the reference for the =cancelText= state property.

								NOTES
								- see the companion =cancelText= state property
								- when the =cancelText= state property is set to a non-empty string, then =defaultCancelText= will have no effect
								- the initial value is =undefined=
					*/
				},
				_defaultOkText:{
					name:'defaultOkText',
					onChange:_syncOkAndCancelText
					/*?
						State Properties
							defaultOkText
								A string, specifying the default text for the =ok= button, should the =okText= state property be set to =null=, =undefined=, or =''= (an empty string).

								For a more detailed explanation of the ok button text fallback mechanism, see the reference for the =okText= state property.

								NOTES
								- see the companion =okText= state property
								- when the =okText= state property is set to a non-empty string, then =defaultOkText= will have no effect
								- the initial value is =undefined=
					*/
				},
				_defaultTitle:{
					name:'defaultTitle',
					onChange:_updateUiTitle
					/*?
						State Properties
							defaultTitle
								A string, specifying the default text for the =title DOM Node= (i.e. the title bar), should the =title= state property be set to =null=, =undefined=, or =''= (an empty string).

								For a more detailed explanation of the title text fallback mechanism, see the reference for the =title= state property.

								NOTES
								- see the companion =title= state property
								- when the =title= state property is set to a non-empty string, then =defaultTitle= will have no effect
								- the initial value is =undefined=
					*/
				},
				_dismissOnShieldClick:{
					name:'dismissOnShieldClick',
					value:_false
					/*?
						State Properties
							dismissOnShieldClick
								A boolean, specifying whether or not clicking the =shield= node should close the dialog, or a string, specifying a dialog dismissal event that should be fired when the dialog is dismissed by clicking on the =shield= node.

								A "chromeless" dialog may be desired in some case in order to display a palette without the visual clutter of title and button bars. In this case, there may not be a =close= button, so clicking outside of the dialog (on the =shield= DOM node) would be one way to close the dialog.

								NOTES
								- the initial value is =false=
					*/
				},
				_height:{
					name:'height',
					onChange:[
						_updateUiDimsIfShown,
						_updateUiPositionIfShown
					]
					/*?
						State Properties
							height
								An integer, specifying the height of the dialog (i.e. the height of its =Root Node=).

								When a dialog is resizable (by using the =Uize.Widget.Dialog.xResizable= extension), the value of the =height= and state property will be updated when the user has completed resizing the dialog. Updating the value of this property programmatically while the dialog is shown will cause it to be resized. Leaving =height= set to its initial value of =undefined= will result in the dialog's height remaining as determined by its initial HTML markup and CSS.

								NOTES
								- see the companion =width= state property
								- the initial value is =undefined=
					*/
				},
				_hideShieldOnDrag:{
					name:'hideShieldOnDrag',
					value:_true
					/*?
						State Properties
							hideShieldOnDrag
								A boolean, specifying whether or not the =shield= DOM node should be hidden when the dialog is dragged (moved or resized).

								When the user drags a dialog, it is considered that one possible reason is to see what is being obscured by it. This can be the case if the user wishes to reference what is on the page behind the dialog in order to inform what choices they make in the dialog's UI. Therefore, the =hideShieldOnDrag= state property is initially set to =true=. Setting this property to =false= means that the =shield= DOM node will remain obscuring the page even when the user drags the dialog.

								NOTES
								- the initial value is =true=
					*/
				},
				_inDrag:{
					name:'inDrag',
					value:_false
					/*?
						State Properties
							inDrag
								A read-only boolean, indicating whether or not the dialog is being dragged (moved or resized).

								NOTES
								- this property is read-only
								- the initial value is =false=
					*/
				},
				_mooringNode:{
					name:'mooringNode',
					onChange:_updateUiPositionIfShown
					/*?
						State Properties
							mooringNode
								A node reference or node ID for a node to which the dialog should be "moored".

								When the value of the =mooringNode= state property resolves to a DOM node *and* the =autoPosition= state property is set to =true=, then the dialog is considered moored to the specified mooring node. On the other hand, if the =autoPosition= state property is set to =false=, then the value of the =mooringNode=, =offsetX=, and =offsetY= state properties will have no effect.

								When in the moored state, the dialog will maintain its offset position relative to the mooring node, as specified by the =offsetX= and =offsetY= state properties - even as the browser window is resized. Each time it is shown or the browser window is resized, the dialog will be re-positioned so that the top left corner of its =Root Node= is offset vertically and horizontally from the top left corner of the mooring node, by the number of pixels specified by the =offsetY= and =offsetX= state properties, respectively.

								NOTES
								- see the related =autoPosition=, =offsetRegistrationCorner=, =offsetX=, and =offsetY= state properties
								- the initial value is =undefined=
					*/
				},
				_nodeToSetDimension: {
					name: 'nodeToSetDimension',
					onChange: [
						_updateUiDimsIfShown,
						_updateUiPositionIfShown
					],
					value:''
					/*?
						State Properties
							nodeToSetDimension
								A node reference or node ID for a node to which the =height= and =width= should be set.

								The default value is the root node. Setting this property is useful when the main content of the dialog is in a child node.

								NOTES
								- see the companion =height= set-get property
								- see the companion =width= set-get property
					*/
				},
				_offsetRegistrationCorner: {
					name: 'offsetRegistrationCorner',
					onChange: _updateUiPositionIfShown,
					value: 'top|left'
					/*?
						State Properties
							offsetRegistrationCorner
								A pipe-separated string, specifying the registration corner of the dialog (i.e. which side of the dialog is moored to =mooringNode=).

								NOTES
								- when the =autoPosition= state property is set to =false=, then =offsetRegistrationCorner= has no effect
								- see the related =autoPosition=, =mooringNode=, and =offsetY= state properties
								- the initial value is ='top|left'=
					*/
				},
				_offsetX:{
					name:'offsetX',
					onChange:_updateUiPositionIfShown,
					value:0
					/*?
						State Properties
							offsetX
								An integer, specifying the offset in pixels from the left edge of the =mooringNode= to the left edge of the dialog's =Root Node=.

								When a dialog is "moored" to a mooring node, the =offsetX= property specifies how it is horizontally positioned in relation to the mooring node (for a more detailed explanation, see the reference for the =mooringNode= state property).

								NOTES
								- when the =autoPosition= state property is set to =false=, then =offsetX= has no effect
								- see the related =autoPosition=, =mooringNode=, =offsetRegistrationCorner=, and =offsetY= state properties
								- the initial value is =0=
					*/
				},
				_offsetY:{
					name:'offsetY',
					onChange:_updateUiPositionIfShown,
					value:0
					/*?
						State Properties
							offsetY
								An integer, specifying the offset in pixels from the top edge of the =mooringNode= to the top edge of the dialog's =Root Node=.

								When a dialog is "moored" to a mooring node, the =offsetY= property specifies how it is vertically positioned in relation to the mooring node (for a more detailed explanation, see the reference for the =mooringNode= state property).

								NOTES
								- when the =autoPosition= state property is set to =false=, then =offsetY= has no effect
								- see the related =autoPosition=, =mooringNode=, =offsetRegistrationCorner=, and =offsetX= state properties
								- the initial value is =0=
					*/
				},
				_okEnabledOnShow:{
					name:'okEnabledOnShow',
					value:_true
					/*?
						State Properties
							okEnabledOnShow
								A boolean, specifying whether the dialog's =ok= button should be enabled or disabled each time the dialog is shown.

								A value of =true= means that the =ok= button will be enabled each time the dialog is shown, a value of =false= means that the =ok= button will be disabled each time the dialog is shown (useful for dialogs that need to perform validation before enabling the =ok= button), and a value of =undefined= means that the =enabled= state of the =ok= button will not be modified upon showing the dialog.

								NOTES
								- the initial value is =true=
					*/
				},
				_okText:{
					name:'okText',
					onChange:_syncOkAndCancelText
					/*?
						State Properties
							okText
								A string, representing text that should be displayed for the dialog's =ok= button.

								Using this property, the text of the =ok= button can be changed at any time - even when the dialog is shown. Setting a non-empty string value for this property has the effect of setting the value of the =text= state property for the =ok= child widget. Leaving =okText= set to its initial value of =undefined= will result in the =ok= button's text being determined by the value of the =defaultOkText= state property. If the values for both the =okText= and =defaultOkText= state properties are =undefined=, then the =ok= button will retain whatever text was initially in its HTML markup.

								NOTES
								- see the companion =defaultOkText= state property
								- the initial value is =undefined=
					*/
				},
				_shieldOpacity:{
					name:'shieldOpacity',
					onChange:function () {
						this._shieldShown && this.set ({_currentShieldOpacity:this._shieldOpacity});
					},
					value:.3
					/*?
						State Properties
							shieldOpacity
								A floating point number in the range of =0= to =1=, specifying the opacity for the =shield= DOM node when it is shown.

								NOTES
								- see the related =currentShieldOpacity=, =hideShieldOnDrag=, and =shieldShown= state properties, and the =shield= DOM node
								- the initial value is =.3=
					*/
				},
				_shieldShown:{
					name:'shieldShown',
					onChange:function () {
						var m = this;
						if (m.isWired && m._shown) {
							if (m._shieldShown) {
								if (_browserHasSelectShowThroughIssue && m.getNode ('shield')) {
									if (!m._dismissOnShieldClick && !m.getNode ('ie6SelectHackShield')) {
										m.flushNodeCache ('ie6SelectHackShield');
										m.injectNodeHtml (
											'shield',
											'<iframe src="javascript:\'\'" id="' + m._idPrefix + '-ie6SelectHackShield" style="position:absolute; left:0; top:0; width:100%; height:100%; filter:alpha(opacity=0);" frameborder="0" scrolling="no"></iframe>',
											'inner bottom'
										);
									}
								}
								m._currentShieldOpacity = _undefined;
								m.set ({_currentShieldOpacity:m._shieldOpacity});
							} else {
								m._shieldFade.start ({
									startValue:m._shieldOpacity,
									endValue:.001
								});
							}
						}
					},
					value:_false
					/*?
						State Properties
							shieldShown
								A boolean, specifying whether or not the =shield= DOM node is shown.

								Whenever this property is set to =true=, the =shield= DOM node will be revealed. When it is set to =false=, the =shield= will be hidden. This property is set to =true= each time the dialog is shown, and it is set to =false= the first time the dialog is dragged after being shown (provided that the =hideShieldOnDrag= state property is set to =true=). You can also programmatically set =shieldShown= to =false= in your dialog code if some action requires that the user be able to see the page behind the dialog.

								NOTES
								- see the related =currentShieldOpacity=, =hideShieldOnDrag=, and =shieldOpacity= state properties, and the =shield= DOM node
								- the initial value is =false=
					*/
				},
				_shown:{
					name:'shown',
					onChange:function () {
						var m = this;
						if (m.isWired) {
							if (m._shown) {
								_totalShown++;
								_class.openDialogs[m.get('name')] = m;
								m._draggedSinceShown = _false;
								typeof m._okEnabledOnShow == 'boolean' &&
									m.children.ok.set ({enabled:m._okEnabledOnShow ? 'inherit' : _false})
								;
								m.fire ('Before Show');
									/*?
										Instance Events
											Before Show
												An instance event that is fired immediately before the dialog is displayed.

												NOTES
												- when this event is fired, the value of the =shown= state property will be =true=
												- see also the =Before Hide=, =After Show=, and =After Hide= instance events
									*/
								m.setNodeStyle ('',{position:'absolute'});

								/*** guarantee dialog is on top ***/
									var _highestZIndexSlotNo = -1;
									for (var _zIndexSlotNo in _zIndexSlots)
										_highestZIndexSlotNo = Math.max (_highestZIndexSlotNo,_zIndexSlotNo)
									;
									_zIndexSlots [m._zIndexSlotNo = ++_highestZIndexSlotNo] = 1;
									m.setNodeStyle (['','shield'],{zIndex:4000 + _highestZIndexSlotNo * 10});

								/*** position and display ***/
									var _hideWithVisibilityForDimensionGetting = function (_hideWithVisibility) {
										m.showNode ('',!_hideWithVisibility);
										m.displayNode ('',_hideWithVisibility);
									};
									_hideWithVisibilityForDimensionGetting (_true);
									m.updateUiDimsIfShown ();
									m.updateUiPositionIfShown ();
									_hideWithVisibilityForDimensionGetting (_false);
							} else {
								_totalShown--;
								delete _class.openDialogs[m.get('name')];
								delete _zIndexSlots [m._zIndexSlotNo];
								m.fire ('Before Hide');
									/*?
										Instance Events
											Before Hide
												An instance event that is fired immediately before the dialog is hidden.

												NOTES
												- when this event is fired, the value of the =shown= state property will be =false=
												- see also the =Before Show=, =After Show=, and =After Hide= instance events
									*/
							}
							m.set ({_shieldShown:m._shown});
							m.displayNode (['','shield'],m._shown);
							m.fire (m._shown ? 'After Show' : 'After Hide');
								/*?
									Instance Events
										After Show
											An instance event that is fired immediately after the dialog is shown.

											NOTES
											- when this event is fired, the value of the =shown= state property will be =true=
											- see also the =Before Show=, =Before Hide=, and =After Hide= instance events

										After Hide
											An instance event that is fired immediately after the dialog is hidden.

											NOTES
											- when this event is fired, the value of the =shown= state property will be =false=
											- see also the =Before Show=, =Before Hide=, and =After Show= instance events
								*/
						}
					},
					value:_false
					/*?
						State Properties
							shown
								A boolean, specifying whether or not the dialog is shown.

								In order to show a dialog, just set the value of this property to =true=. To hide a dialog, set the value of this property to =false=. When a dialog is shown, clicking on its =ok=, =qualifiedOk=, =cancel=, or =close= buttons will result in the =shown= property being set back to =false= (unless the associated =Ok=, =Qualified Ok=, =Cancel=, or =Close= dismiss events are aborted). When the =shown= state of a dialog is changed, the =Before Show=, =After Show=, =Before Hide=, and =After Hide= instance events are fired at various phases of the reveal or hide process.

								NOTES
								- the initial value is =false=
					*/
				},
				_title:{
					name:'title',
					onChange:_updateUiTitle
					/*?
						State Properties
							title
								A string, specifying text that should be displayed in the dialog's =title DOM Node= (i.e. the title bar).

								Using this property, the title of a dialog can be changed at any time - even when the dialog is shown. Leaving =title= set to its initial value of =undefined= will result in the dialog's title being determined by the value of the =defaultTitle= state property. If the values for both the =title= and =defaultTitle= state properties are =undefined=, then the =title DOM Node= will retain whatever text was initially in its HTML markup.

								NOTES
								- see the companion =defaultTitle= state property
								- the initial value is =undefined=
					*/
				},
				_width:{
					name:'width',
					onChange:[
						_updateUiDimsIfShown,
						_updateUiPositionIfShown
					]
					/*?
						State Properties
							width
								An integer, specifying the width of the dialog (i.e. the width of its =Root Node=).

								When a dialog is resizable (by using the =Uize.Widget.Dialog.xResizable= extension), the value of the =width= and state property will be updated when the user has completed resizing the dialog. Updating the value of this property programmatically while the dialog is shown will cause it to be resized. Leaving =width= set to its initial value of =undefined= will result in the dialog's width remaining as determined by its initial HTML markup and CSS.

								NOTES
								- see the companion =height= state property
								- the initial value is =undefined=
					*/
				}
			},

			staticProperties:{
				buttonWidgetClass:Uize.Widget.Button,
				openDialogs:{}
			}
		});
	}
});

