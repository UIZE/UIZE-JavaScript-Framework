/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Dialog Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2013 UIZE
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
		'Uize.Node',
		'Uize.Widget.Button',
		'Uize.Widget.Drag',
		'Uize.Fade'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false,
				_undefined,
				_Uize_Node = Uize.Node,
				_Uize_Widget = Uize.Widget,
				_Uize_Widget_Drag = _Uize_Widget.Drag
			;

		/*** General Variables ***/
			var
				_sacredEmptyObject = {},
				_zIndexSlots = {},
				_totalShown = 0,
				_browserHasSelectShowThroughIssue = _Uize_Node.ieMajorVersion == 6
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					function () {
						var _this = this;

						/*** Private Instance Properties ***/
							(
								_this._shieldFade = _this.shieldFade = Uize.Fade ({
									curve:Uize.Fade.celeration (0,1),
									duration:750
								})
								/*?
									Instance Properties
										shieldFade
											An instance of the =Uize.Fade= class, that is used to fade the opacity of the =shield= implied node when hiding it.

											This property lets you customize the qualities of the opacity fade for the dialog's =shield=, by letting you set values for the state properties of the =Uize.Fade= instance (such as =duration=, =curve=, etc.).
								*/
							).wire (
								'Changed.value',
								function () {_this.set ({_currentShieldOpacity:+_this._shieldFade})}
							);
							_this.wire ({
								'Drag Start':
									function (_event) {
										if (!_this._draggedSinceShown) {
											_this._draggedSinceShown = _true;
											_this.fire ('First Drag Since Shown');
											/*?
												Instance Events
													First Drag Since Shown
														An instance event that is fired for only the first time that the dialog is dragged after it has been shown.

														NOTES
														- compare to the =Drag Start= instance event
														- see the related =Drag Done= instance event
											*/
											_this._hideShieldOnDrag && _this.set ({_shieldShown:_false});
										}
									},
								'Drag Done':
									function () {
										var _mooringNode = _Uize_Node.getById (_this._mooringNode);
										if (_mooringNode) {
											var
												_mooringCoords = _Uize_Node.getCoords (_mooringNode),
												_rootNode = _this.getNode ()
											;
											_this.set ({
												offsetX:
													parseInt (_Uize_Node.getStyle (_rootNode,'left')) - _mooringCoords.left,
												offsetY:
													parseInt (_Uize_Node.getStyle (_rootNode,'top')) - _mooringCoords.top
											})
										}
									}
							});
					},
					function () {
						var _this = this;

						/*** create the drag widget for the drag-to-move behavior ***/
							var
								_rootNode,
								_dragStartRootNodePos = [0,0]
							;
							(_this._drag = _this.addChild ('drag',_Uize_Widget_Drag,{cursor:'move'}))
								.wire ({
									'Before Drag Start':
										function (_event) {
											_rootNode = _this.getNode ();
											_dragStartRootNodePos [0] = parseInt (_Uize_Node.getStyle (_rootNode,'left'));
											_dragStartRootNodePos [1] = parseInt (_Uize_Node.getStyle (_rootNode,'top'));
										},
									'Changed.inDrag':function () {_this.set ({_inDrag:_this._drag.get ('inDrag')})},
									'Drag Start':_this,
										/*?
											Instance Events
												Drag Start
													An instance event that is fired each time the user starts dragging the dialog (either for moving or resizing).

													NOTES
													- compare to the =First Drag Since Shown= instance event
													- see the related =Drag Done= instance event
										*/
									'Drag Update':
										function (_event) {
											var _eventDeltaPos = _this._drag.eventDeltaPos;
											_Uize_Node.setStyle (
												_rootNode,
												{
													left:_dragStartRootNodePos [0] + _eventDeltaPos [0],
													top:_dragStartRootNodePos [1] + _eventDeltaPos [1]
												}
											);
										},
									'Drag Done':_this
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
											An instance of the =Uize.Widget.Drag= class, that is wired up to the =title Implied Node= to enable drag-to-move for the dialog.

											Setting the =enabled= state property of this child widget to =false= will disable drag-to-move for the dialog.
								*/
							;

						/*** create buttons ***/
							function _dismiss (_dismissalEvent) { _this._dismiss(_dismissalEvent) }
							_this._addChildButton ('close',function () {_dismiss ('Close')});
								/*?
									Child Widgets
										close
											An instance of the =Uize.Widget.Button= class, that lets the user close the dialog.

											When this button is clicked, the =Close= event is fired on the dialog instance.

									Instance Events
										Close
											An instance event that is fired when the user clicks the =close= button.

											NOTES
											- the handler for this event can abort the closing of the dialog by setting the =abort= property of the event object to =true=
								*/
							_this._addChildButton ('qualifiedOk',function () {_dismiss ('Qualified Ok')});
								/*?
									Child Widgets
										qualifiedOk
											An instance of the =Uize.Widget.Button= class, that lets the user submit the dialog with a qualification.

											The =qualifiedOk= button is like a second =ok= button (kind of like an "ok, but with this one condition..." action). Having a second ok-like button is useful in a few cases, bust most dialogs will not provide markup for this button. When this button is clicked, the =Qualified Ok= event is fired on the dialog instance.

									Instance Events
										Qualified Ok
											An instance event that is fired when the user clicks the =qualifiedOk= button.

											NOTES
											- the handler for this event can abort the closing of the dialog by setting the =abort= property of the event object to =true=
								*/
							_this._addChildButton ('ok',function () {_dismiss ('Ok')});
								/*?
									Child Widgets
										ok
											An instance of the =Uize.Widget.Button= class, that lets the user submit the dialog.

											When this button is clicked, the =Ok= event is fired on the dialog instance. The text for this button can be controlled via the =okText= and =defaultOkText= state properties.

									Instance Events
										Ok
											An instance event that is fired when the user clicks the =ok= button.

											NOTES
											- the handler for this event can abort the closing of the dialog by setting the =abort= property of the event object to =true=
								*/
							_this._addChildButton ('cancel',function () {_dismiss ('Cancel')});
								/*?
									Child Widgets
										cancel
											An instance of the =Uize.Widget.Button= class, that lets the user cancel (and close) the dialog.

											When this button is clicked, the =Cancel= event is fired on the dialog instance. The text for this button can be controlled via the =cancelText= and =defaultCancelText= state properties.

									Instance Events
										Cancel
											An instance event that is fired when the user clicks the =cancel= button.

											NOTES
											- the handler for this event can abort the closing of the dialog by setting the =abort= property of the event object to =true=
								*/

						/*** initialization ***/
							_this._syncOkAndCancelText ();
							_this.atEndOfOmegaStructor ();
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._addChildButton = _Uize_Widget.Button.addChildButton;

			_classPrototype._dismiss = function (_dismissalEvent) {
				this.fire (_dismissalEvent).abort || this.set ({_shown:_false})
			};

			var _updateUiPositionIfShown = _classPrototype._updateUiPositionIfShown = _classPrototype.updateUiPositionIfShown = function () {
				var _this = this;
				if (_this.isWired && _this._shown && !_this._inDrag) {
					_Uize_Widget_Drag.resizeShield (_this.getNode ('shield'));
					/*?
						Implied Nodes
							Root Node
								A node that is the root for all of the dialog's HTML, excluding the =shield= implied node.

								When a dialog is shown, its =Root Node= and =shield= implied nodes are displayed. Conversely, when a dialog is hidden, both its =Root Node= and =shield= implied nodes are hidden. When a dialog is dragged to a new position by the user, or if its position is programmatically changed, then the =Root Node= is repositioned through CSS. If the dialog is resized by the user, or if it is resized programmatically by setting values for its =width= and =height= state properties, the dimensions of the =Root Node= are modified through CSS. All chrome for the dialog should therefore be "pinned" to the =Root Node=, so that when the dialog is moved and resized, the chrome goes along for the ride.

							shield
								A node that will be sized to fill the entire browser view port, in order to block events to the page behind the dialog.

								When the dialog is shown, the =shield= implied node is shown along with the =Root Node=. The shield can be set to hide when the user drag or resizes the dialog by setting the =hideShieldOnDrag= state property to =true=. When the dialog is shown, the shield can be hidden by setting the =shieldShown= state property to =false=. Even though the shield won't be visible, it will still block events to the page behind the dialog.

								NOTES
								- see also the =currentShieldOpacity=, =hideShieldOnDrag=, =shieldOpacity=, and =shieldShown= state properties
								- see also the =shieldFade= instance property
					*/
					if (_this._autoPosition) {
						var
							_rootNode = _this.getNode (),
							_mooringNode = _Uize_Node.getById (_this._mooringNode),
							_offsetX = _this._offsetX,
							_offsetY = _this._offsetY
						;
						if (!_mooringNode || _offsetX == _undefined || _offsetY == _undefined)
							_Uize_Node.centerInWindow (_rootNode)
						;
						if (_mooringNode) {
							if (_offsetX == 'adjacent' || _offsetY == 'adjacent') {
								_Uize_Node.setAbsPosAdjacentTo (_rootNode, _mooringNode);
							}
							else {
								var _mooringCoords = _Uize_Node.getCoords (_mooringNode);
								_Uize_Node.setStyle (
									_rootNode,
									Uize.copyInto (
										{},
										_offsetX != _undefined ? {left:_mooringCoords.left + _offsetX} : _undefined,
										_offsetY != _undefined ? {top:_mooringCoords.top + _offsetY} : _undefined
									)
								);
							}
						}
					}
				}
			};

			var _updateUiDimsIfShown = _classPrototype._updateUiDimsIfShown = function () {
				var _this = this;
				_this.isWired && _this._shown && !_this._inDrag &&
					_this.setNodeStyle ('',{width:_this._width,height:_this._height})
				;
			};

			_classPrototype._updateUiShieldOpacity = function () {
				var _this = this;
				_this.isWired && _this._shown && _this.setNodeOpacity ('shield',_this._currentShieldOpacity);
			};

			_classPrototype._updateUiTitle = function () {
				var _this = this;
				if (_this.isWired) {
					var _defaultedTitle = _this._title || _this._defaultTitle;
					_defaultedTitle != _undefined && _this.setNodeInnerHtml ('title',_defaultedTitle || '&nbsp;');
						/*?
							Implied Nodes
								title Implied Node
									A node that acts as the title bar for the dialog and that is wired up by the =drag= child widget to enable drag-to-move for the dialog.

									The text for the dialog's title bar can be controlled via the =title= and =defaultTitle= state properties.

									NOTES
									- if no =title Implied Node= is present in the dialog's HTML, then the dialog will not be movable
									- see also the =defaultTitle= and =title= state properties
						*/
				}
			};

			var _syncOkAndCancelText = _classPrototype._syncOkAndCancelText = function () {
				var
					_this = this,
					_children = _this.children
				;
				function _updateTextForButton (_widget,_defaultedText) {
					_widget && _defaultedText != _undefined && _widget.set ({text:_defaultedText});
				}
				_updateTextForButton (_children.ok,_this._okText || _this._defaultOkText);
				_updateTextForButton (_children.cancel,_this._cancelText || _this._defaultCancelText);
			};

		/*** Public Instance Methods ***/
			/*** Hook Methods for Uize.Widget.Dialog.xResizable ***/
				_classPrototype.atEndOfOmegaStructor = _classPrototype.afterWireUi = Uize.nop;

			_classPrototype.updateUi = function () {
				var _this = this;

				if (_this.isWired) {
					_this._updateUiTitle ();

					_superclass.prototype.updateUi.call(_this);
				}
			};

			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					_this.wireNode (window,'resize',function () {_this._updateUiPositionIfShown ()});
					_this._drag.set ({node:_this.getNode ('title')});

					_this.wireNode(
						'shield',
						'click',
						function() { _this._dismissOnShieldClick && _this._dismiss ('Close') }
					);

					/*** fetch values for defaultTitle, defaultOkText, and defaultCancelText from markup ***/
						var _initializeDefaultProperty = function (_defaultPropertyName,_widget,_impliedNodeName) {
							if (!_this.get (_defaultPropertyName)) {
								var _innerHtml = (_widget.getNode (_impliedNodeName) || _sacredEmptyObject).innerHTML;
								_innerHtml && _this.set (_defaultPropertyName,_innerHtml);
							}
						};
						_initializeDefaultProperty ('defaultTitle',_this,'title');
						_initializeDefaultProperty ('defaultOkText',_this.children.ok,'text');
						_initializeDefaultProperty ('defaultCancelText',_this.children.cancel,'text');

					_superclass.prototype.wireUi.call (_this);

					_this.afterWireUi ();
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
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
					onChange:_classPrototype._updateUiShieldOpacity
					/*?
						State Properties
							currentShieldOpacity
								A read-only floating point number in the range of =0= to =1=, indicating the current opacity level of the dialog's shield.

								NOTES
								- this property is read-only
								- see the related =hideShieldOnDrag=, =shieldOpacity=, and =shieldShown= state properties, and the =shield= implied node
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
					onChange:_classPrototype._updateUiTitle
					/*?
						State Properties
							defaultTitle
								A string, specifying the default text for the =title Implied Node= (ie. the title bar), should the =title= state property be set to =null=, =undefined=, or =''= (an empty string).

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
								An boolean, specifying whether or not clicking =shield= implied node should close the dialog.

								A "chromeless" dialog may be desired in some case in order to display a palette without the visual clutter of title and button bars. In this case, there may not be a =close= button, so clicking outside of the dialog (on the =shield= implied node) would be one way to close the dialog.

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
								An integer, specifying the height of the dialog (ie. the height of its =Root Node=).

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
								A boolean, specifying whether or not the =shield= implied node should be hidden when the dialog is dragged (moved or resized).

								When the user drags a dialog, it is considered that one possible reason is to see what is being obscured by it. This can be the case if the user wishes to reference what is on the page behind the dialog in order to inform what choices they make in the dialog's UI. Therefore, the =hideShieldOnDrag= state property is initially set to =true=. Setting this property to =false= means that the =shield= implied node will remain obscuring the page even when the user drags the dialog.

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
								- see the related =autoPosition=, =offsetX=, and =offsetY= state properties
								- the initial value is =undefined=
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
								- see the related =autoPosition=, =mooringNode=, and =offsetY= state properties
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
								- see the related =autoPosition=, =mooringNode=, and =offsetX= state properties
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
						this._shieldShown && this.set ({_currentShieldOpacity:this._shieldOpacity})
					},
					value:.3
					/*?
						State Properties
							shieldOpacity
								A floating point number in the range of =0= to =1=, specifying the opacity for the =shield= implied node when it is shown.

								NOTES
								- see the related =currentShieldOpacity=, =hideShieldOnDrag=, and =shieldShown= state properties, and the =shield= implied node
								- the initial value is =.3=
					*/
				},
				_shieldShown:{
					name:'shieldShown',
					onChange:function () {
						var _this = this;
						if (_this.isWired && _this._shown) {
							if (_this._shieldShown) {
								if (_browserHasSelectShowThroughIssue && _this.getNode ('shield')) {
									var _ie6SelectHackShield = _this.getNode ('ie6SelectHackShield');
									if (!_this._dismissOnShieldClick && !_this.getNode ('ie6SelectHackShield')) {
										_this.flushNodeCache ('ie6SelectHackShield');
										_this.injectNodeHtml (
											'shield',
											'<iframe src="javascript:\'\'" id="' + _this._idPrefix + '-ie6SelectHackShield" style="position:absolute; left:0; top:0; width:100%; height:100%; filter:alpha(opacity=0);" frameborder="0" scrolling="no"></iframe>',
											'inner bottom'
										);
									}
								}
								_this._currentShieldOpacity = _undefined;
								_this.set ({_currentShieldOpacity:_this._shieldOpacity});
							} else {
								_this._shieldFade.start ({
									startValue:_this._shieldOpacity,
									endValue:.001
								});
							}
						}
					},
					value:_false
					/*?
						State Properties
							shieldShown
								A boolean, specifying whether or not the =shield= implied node is shown.

								Whenever this property is set to =true=, the =shield= implied node will be revealed. When it is set to =false=, the =shield= will be hidden. This property is set to =true= each time the dialog is shown, and it is set to =false= the first time the dialog is dragged after being shown (provided that the =hideShieldOnDrag= state property is set to =true=). You can also programmatically set =shieldShown= to =false= in your dialog code if some action requires that the user be able to see the page behind the dialog.

								NOTES
								- see the related =currentShieldOpacity=, =hideShieldOnDrag=, and =shieldOpacity= state properties, and the =shield= implied node
								- the initial value is =false=
					*/
				},
				_shown:{
					name:'shown',
					onChange:function () {
						var _this = this;
						if (_this.isWired) {
							if (_this._shown) {
								_totalShown++;
								_this._draggedSinceShown = _false;
								typeof _this._okEnabledOnShow == 'boolean' &&
									_this.children.ok.set ({enabled:_this._okEnabledOnShow ? 'inherit' : _false})
								;
								_this.fire ('Before Show');
									/*?
										Instance Events
											Before Show
												An instance event that is fired immediately before the dialog is displayed.

												NOTES
												- when this event is fired, the value of the =shown= state property will be =true=
												- see also the =Before Hide=, =After Show=, and =After Hide= instance events
									*/
								_this.setNodeStyle ('',{position:'absolute'});

								/*** guarantee dialog is on top ***/
									var _highestZIndexSlotNo = -1;
									for (var _zIndexSlotNo in _zIndexSlots)
										_highestZIndexSlotNo = Math.max (_highestZIndexSlotNo,_zIndexSlotNo)
									;
									_zIndexSlots [_this._zIndexSlotNo = ++_highestZIndexSlotNo] = 1;
									_this.setNodeStyle (['','shield'],{zIndex:4000 + _highestZIndexSlotNo * 10});

								/*** position and display ***/
									var _hideWithVisibilityForDimensionGetting = function (_hideWithVisibility) {
										_this.showNode ('',!_hideWithVisibility);
										_this.displayNode ('',_hideWithVisibility);
									};
									_hideWithVisibilityForDimensionGetting (_true);
									_this._updateUiDimsIfShown ();
									_this._updateUiPositionIfShown ();
									_hideWithVisibilityForDimensionGetting (_false);
							} else {
								_totalShown--;
								delete _zIndexSlots [_this._zIndexSlotNo];
								_this.fire ('Before Hide');
									/*?
										Instance Events
											Before Hide
												An instance event that is fired immediately before the dialog is hidden.

												NOTES
												- when this event is fired, the value of the =shown= state property will be =false=
												- see also the =Before Show=, =After Show=, and =After Hide= instance events
									*/
							}
							_this.set ({_shieldShown:_this._shown});
							_this.displayNode (['','shield'],_this._shown);
							_this.fire (_this._shown ? 'After Show' : 'After Hide');
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
					onChange:_classPrototype._updateUiTitle
					/*?
						State Properties
							title
								A string, specifying text that should be displayed in the dialog's =title Implied Node= (ie. the title bar).

								Using this property, the title of a dialog can be changed at any time - even when the dialog is shown. Leaving =title= set to its initial value of =undefined= will result in the dialog's title being determined by the value of the =defaultTitle= state property. If the values for both the =title= and =defaultTitle= state properties are =undefined=, then the =title Implied Node= will retain whatever text was initially in its HTML markup.

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
								An integer, specifying the width of the dialog (ie. the width of its =Root Node=).

								When a dialog is resizable (by using the =Uize.Widget.Dialog.xResizable= extension), the value of the =width= and state property will be updated when the user has completed resizing the dialog. Updating the value of this property programmatically while the dialog is shown will cause it to be resized. Leaving =width= set to its initial value of =undefined= will result in the dialog's width remaining as determined by its initial HTML markup and CSS.

								NOTES
								- see the companion =height= state property
								- the initial value is =undefined=
					*/
				}
			});

		return _class;
	}
});

