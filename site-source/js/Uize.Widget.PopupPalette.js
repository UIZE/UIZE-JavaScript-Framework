/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.PopupPalette Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 6
	codeCompleteness: 100
	docCompleteness: 8
*/

/*?
	Introduction
		The =Uize.Widget.PopupPalette= class manages state for a generic popup palette widget, that can be used as a child widget for droplist style widgets.

		*DEVELOPERS:* `Chris van Rensburg`, original code donated by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.PopupPalette',
	required:[
		'Uize.Node',
		'Uize.Fade',
		'Uize.Widget.Button'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false,
				_null = null,
				_Uize_Node = Uize.Node
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function () {
						var _this = this;

						/*** set up the fade instance ***/
							_this.fade = Uize.Fade ({
								duration:750,
								curve:Uize.Fade.celeration (0,1)
							});
							_this.fade.wire ({
								'Changed.value':
									function () {_this.setNodeOpacity ('palette',_this.fade)},
								Done:
									function () {_this._showPalette (_this._shown)}
							});
							/*?
								Instance Properties
									fade
										An instance of the =Uize.Fade= class that is used to animate the optional fade in and out effect when the popup palette is shown or hidden.

										Because this instance is exposed through a public property, you can use this reference to modify the behavior of the fade in/out effect.
							*/

						/*** create the selector button ***/
							var
								_selector = _this._selector = _this._addChildButton (
									'selector',
									function () {_this.toggle ('shown')}
								),
								_delayTimeout
							;
							_selector.set ({clickToDeselect:_true});
							_this._updateSelectorSelectedState ();
							function _handleSelectorOverOut (_event) {
								var
									_isOver = _event.name == 'Over',
									_showWhenOver = _this._showWhenOver
								;

								function _show() { _this.set ({_shown:_true}) }

								if (_isOver) {
									if (_showWhenOver === _true || _showWhenOver === 0)
										_show();
									else if (_showWhenOver > 0)
										_delayTimeout = setTimeout(_show, _showWhenOver);

									_this._over()
								} else {
									clearTimeout(_delayTimeout);
									_this._out();
								}
							}
							_selector.wire ({
								Down:_setMouseDownOnPaletteTrue,
								Over:_handleSelectorOverOut,
								Out:_handleSelectorOverOut
							});
							/*?
								Child Widgets
									selector
										An instance of =Uize.Widget.Button= that lets the user trigger the popup palette.
							*/

						/*** Initialization ***/
							_instances [_this.instanceId] = _this;
					}
				),
				_classPrototype = _class.prototype,
				_instances = {}
			;

		/*** Private Instance Methods ***/
			_classPrototype._updateSelectorSelectedState = function () {this._selector.set ({selected:this._shown})};

			_classPrototype._shouldTouchTimeouts = function () {
				return this._shown && (this._showWhenOver !== _false || this._hideWhenOut);
			};
			_classPrototype._over = function () {
				this._shouldTouchTimeouts () && this._clearDismissTimeout ();
				this.fire('Over');
			};
			_classPrototype._out = function () {
				this._shouldTouchTimeouts () && this._setDismissTimeout ();
				this.fire('Out');
			};

			_classPrototype._addChildButton = Uize.Widget.Button.addChildButton;

			_classPrototype._showPalette = function (_mustShow) {
				var _this = this;
				_this.displayNode ('palette',_mustShow);
				_mustShow && _this.setNodeStyle ('palette',{filter:''});
				_this.fire ({name:'Palette ' + (_mustShow ? 'Shown' : 'Dismissed'), bubble:_true});
			};

			_classPrototype._clearDismissTimeout = function () {
				var _this = this;
				if (_this._dismissTimeout) {
					clearTimeout (_this._dismissTimeout);
					_this._dismissTimeout = null;
				}
			};

			_classPrototype._setDismissTimeout = function () {
				var _this = this;
				_this._clearDismissTimeout ();
				_this._dismissTimeout = setTimeout (function () {_this.set ({_shown:_false})},250);
			};

		/*** Public Instance Methods ***/
			_classPrototype.kill = function () {
				delete _instances [this.instanceId];
				_superclass.prototype.kill.call (this);
			};

			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					/*** capture mousedown event for palette ***/
						_this.wireNode (
							'palette',
							{
								mousedown:_setMouseDownOnPaletteTrue,
								mouseup:
									function (_event) {
										_this._hideOnClick && _event.target != _this.getNode ('palette') &&
											/* NOTE:
												There is an issue/behavior in Firefox where clicking on the scrollbar for a scrollable div fires the click event for that div. Other browser do not behave that way. Without this additional check, using a scrollable div for a droplist style popup palette would dismiss the palette - not the desired effect!
											*/
											_this.set ({_shown:_false})
										;
									},
								mouseover:function () {_this._over ()},
								mouseout:function () {_this._out ()}
							}
						);

					/*** wire up palette close button ***/
						_this.wireNode ('paletteClose','click',function () {_this.set ({_shown:_false})});

					/*** move palette to child of root, if positioning is absolute ***/
						if (_this._positioning != 'none') {
							var
								_docBody = document.body,
								_paletteNode = _this.getNode ('palette')
							;
							if (_paletteNode && _paletteNode.parentNode != _docBody) {
								/* IMPORTANT:
									There is a problem in Firefox where moving palettes to the root of the DOM like this adds entries to the browser's history for palettes that contain iframes - go figure!
								*/
								_docBody.insertBefore (_paletteNode,_docBody.childNodes [0]);
								_this.setNodeStyle (
									_paletteNode,
									{
										zIndex:10000,
										position:'absolute',
										left:'',
										top:'',
										right:'',
										bottom:'',
										width:_this.getNodeStyle (_paletteNode, 'width')
									}
								);
							}
						}

					_superclass.prototype.wireUi.call (_this);
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_exclusive:{
					name:'exclusive',
					value:_true
				},
				_hideWhenOut:{
					name:'hideWhenOut',
					value:_false
				},
				_hideOnClick:{
					name:'hideOnClick',
					value:_true
				},
				_positioning:{
					name:'positioning',
					value:'none'	// "none", "absolute" or function
				},
				_shown:{
					name:'shown',
					onChange:function () {
						var
							_this = this,
							_shown = _this._shown,
							_positioning = _this._positioning
						;
						_this._selector && _this._updateSelectorSelectedState ();
						if (_this.isWired) {
							_this._clearDismissTimeout ();
							if (_shown) {
								_this.fire ('Before Palette Shown');
								_this._exclusive && _hideAllExclusiveExcept (_this);
								if (_positioning != 'none') {
									var
										_paletteNode = _this.getNode ('palette'),
										_nodeToPositionAdjacentTo =
											Uize.isFunction (_positioning)
												? _positioning(_paletteNode)
												: _this._selector.getNode (),
										_displayHiddenForPositioning = function (_before) {
											_this.showNode ('palette',!_before);
											_this.displayNode ('palette',_before);
										}
									;
									if (_Uize_Node.isNode(_nodeToPositionAdjacentTo)) {
										_displayHiddenForPositioning (_true);
										_Uize_Node.setAbsPosAdjacentTo (_paletteNode, _nodeToPositionAdjacentTo);
										_displayHiddenForPositioning (_false);
									}
								}
							}
							/*** start opacity fade ***/
								if (_this.fade.get ('duration') > 0) {
									_shown && _this.displayNode ('palette');
									_this.fade.start ({
										startValue:_shown ? 0 : 1,
										endValue:_shown ? 1 : 0
									});
								} else {
									_this._showPalette (_shown);
								}
						}
					},
					value:_false
				},
				_showWhenOver:{
					name:'showWhenOver',
					value:_false	// false - no hover, true - hover, Number - hover delay
				}
			});

		/*** Code for Managing Exclusive Display ***/
			function _hideAllExclusiveExcept (_instanceToPermitShown) {
				for (var _instanceName in _instances) {
					var _instance = _instances [_instanceName];
					_instance != _instanceToPermitShown && _instance._exclusive &&
						_instance.set ({_shown:_false})
					;
				}
			}

			function _setMouseDownOnPaletteTrue () {_mouseDownOnPalette = _true}

			if (typeof navigator != 'undefined') {
				var
					_mouseDownOnPalette = _false,
					_oldOnmousedown = document.onmousedown
				;
				document.onmousedown = function (_event) {
					if (!_event) _event = event;
					_mouseDownOnPalette
						? (_mouseDownOnPalette = _false)
						: _hideAllExclusiveExcept ()
					;
					Uize.isFunction (_oldOnmousedown) && _oldOnmousedown (_event);
				};
			}

		return _class;
	}
});

