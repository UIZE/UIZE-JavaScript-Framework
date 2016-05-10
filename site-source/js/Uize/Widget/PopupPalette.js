/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.PopupPalette Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2016 UIZE
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

		*DEVELOPERS:* `Chris van Rensburg`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.PopupPalette',
	required:[
		'Uize.Dom.Basics',
		'Uize.Dom.Pos',
		'Uize.Fade',
		'Uize.Widget.Button'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_true = true,
				_false = false,
				_Uize_Dom = Uize.Dom,
				_addChildButton = Uize.Widget.Button.addChildButton,

			/*** General Variables ***/
				_instances = {}
		;

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
					_mouseDownOnPalette
						? (_mouseDownOnPalette = _false)
						: _hideAllExclusiveExcept ()
					;
					Uize.isFunction (_oldOnmousedown) && _oldOnmousedown (_event || event);
				};
			}

		/*** Private Instance Methods ***/
			function _updateSelectorSelectedState (m) {m._selector.set ({selected:m._shown})}

			function _shouldTouchTimeouts (m) {
				return m._shown && (m._showWhenOver !== _false || m._hideWhenOut !== _false);
			}

			function _over (m) {
				_shouldTouchTimeouts (m) && _clearDismissTimeout (m);
				m.fire('Over');
			}

			function _out (m) {
				_shouldTouchTimeouts (m) && _setDismissTimeout (m);
				m.fire('Out');
			}

			function _showPalette (m,_mustShow) {
				m.displayNode ('palette',_mustShow);
				_mustShow && m.setNodeStyle ('palette',{filter:''});
				m.fire ({name:'Palette ' + (_mustShow ? 'Shown' : 'Dismissed'), bubble:_true});
			}

			function _clearDismissTimeout (m) {
				if (m._dismissTimeout) {
					clearTimeout (m._dismissTimeout);
					m._dismissTimeout = null;
				}
			}

			function _setDismissTimeout (m) {
				var _hideTimeout = !Uize.isNumber(m._hideWhenOut) ? 250 : m._hideWhenOut;

				_clearDismissTimeout (m);

				function _hide() { m.set ({_shown:_false}) }

				_hideTimeout
					? (
						m._dismissTimeout = setTimeout (
							_hide,
							!Uize.isNumber(m._hideWhenOut) ? 250 : m._hideWhenOut
						)
					)
					: _hide()
				;
			}

		return _superclass.subclass ({
			omegastructor:function () {
				var m = this;

				/*** set up the fade instance ***/
					m.fade = Uize.Fade ({
						duration:750,
						curve:Uize.Fade.celeration (0,1)
					});
					m.fade.wire ({
						'Changed.value':
							function (_event) {m.setNodeOpacity ('palette',_event.newValue)},
						Done:
							function () {_showPalette (m,m._shown)}
					});
					/*?
						Instance Properties
							fade
								An instance of the =Uize.Fade= class that is used to animate the optional fade in and out effect when the popup palette is shown or hidden.

								Because this instance is exposed through a public property, you can use this reference to modify the behavior of the fade in/out effect.
					*/

				/*** create the selector button ***/
					var
						_selector = m._selector = _addChildButton.call (
							m,
							'selector',
							function () {m.toggle ('shown')}
						),
						_delayTimeout
					;
					_selector.set ({clickToDeselect:_true});
					_updateSelectorSelectedState (m);
					function _handleSelectorOverOut (_event) {
						var
							_isOver = _event.name == 'Over',
							_showWhenOver = m._showWhenOver
						;

						function _show() { m.set ({_shown:_true}) }

						if (_isOver) {
							if (_showWhenOver === _true || _showWhenOver === 0)
								_show();
							else if (_showWhenOver > 0)
								_delayTimeout = setTimeout(_show, _showWhenOver);

							_over(m);
						} else {
							clearTimeout(_delayTimeout);
							_out(m);
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
					_instances [m.instanceId] = m;
			},

			instanceMethods:{
				kill:function () {
					delete _instances [this.instanceId];
					_superclass.doMy (this,'kill');
				},

				wireUi:function () {
					var m = this;
					if (!m.isWired) {
						/*** capture mousedown event for palette ***/
							m.wireNode (
								'palette',
								{
									mousedown:_setMouseDownOnPaletteTrue,
									mouseup:
										function (_event) {
											m._hideOnClick && _event.target != m.getNode ('palette') &&
												/* NOTE:
													There is an issue/behavior in Firefox where clicking on the scrollbar for a scrollable div fires the click event for that div. Other browser do not behave that way. Without this additional check, using a scrollable div for a droplist style popup palette would dismiss the palette - not the desired effect!
												*/
												m.set ({_shown:_false})
											;
										},
									mouseover:function () {_over (m)},
									mouseout:function () {_out (m)}
								}
							);

						/*** wire up palette close button ***/
							m.wireNode ('paletteClose','click',function () {m.set ({_shown:_false})});

						/*** move palette to child of root, if positioning is absolute ***/
							if (m._positioning != 'none') {
								var
									_docBody = document.body,
									_paletteNode = m.getNode ('palette')
								;
								if (_paletteNode && _paletteNode.parentNode != _docBody) {
									/* IMPORTANT:
										There is a problem in Firefox where moving palettes to the root of the DOM like this adds entries to the browser's history for palettes that contain iframes - go figure!
									*/
									_docBody.insertBefore (_paletteNode,_docBody.childNodes [0]);
									m.setNodeStyle (
										_paletteNode,
										{
											zIndex:10000,
											position:'absolute',
											left:'',
											top:'',
											right:'',
											bottom:'',
											width:m.getNodeStyle (_paletteNode, 'width')
										}
									);
								}
							}

						_superclass.doMy (m,'wireUi');
					}
				}
			},

			stateProperties:{
				_exclusive:{
					name:'exclusive',
					value:_true
				},
				_hideWhenOut:{
					name:'hideWhenOut',
					value:_false	// false - no hover, true - hover, Number - mouseout delay
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
							m = this,
							_shown = m._shown,
							_positioning = m._positioning
						;
						m._selector && _updateSelectorSelectedState (m);
						if (m.isWired) {
							_clearDismissTimeout (m);
							if (_shown) {
								m.fire ('Before Palette Shown');
								m._exclusive && _hideAllExclusiveExcept (m);
								if (_positioning != 'none') {
									var
										_paletteNode = m.getNode ('palette'),
										_nodeToPositionAdjacentTo =
											Uize.isFunction (_positioning)
												? _positioning(_paletteNode)
												: m._selector.getNode (),
										_displayHiddenForPositioning = function (_before) {
											m.showNode ('palette',!_before);
											m.displayNode ('palette',_before);
										}
									;
									if (_Uize_Dom.Basics.isNode(_nodeToPositionAdjacentTo)) {
										_displayHiddenForPositioning (_true);
										_Uize_Dom.Pos.setAbsPosAdjacentTo (_paletteNode, _nodeToPositionAdjacentTo);
										_displayHiddenForPositioning (_false);
									}
								}
							}
							/*** start opacity fade ***/
								if (m.fade.get ('duration') > 0) {
									_shown && m.displayNode ('palette');
									m.fade.start ({
										startValue:_shown ? 0 : 1,
										endValue:_shown ? 1 : 0
									});
								} else {
									_showPalette (m,_shown);
								}
						}
					},
					value:_false
				},
				_showWhenOver:{
					name:'showWhenOver',
					value:_false	// false - no hover, true - hover, Number - hover delay
				}
			}
		});
	}
});

