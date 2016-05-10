/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Picker.Palette Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2011-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 4
	codeCompleteness: 50
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.Picker.Palette= class implements a picker widget, where the modal dialog shows in a palette made to look like a droplist palette

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.Picker.Palette',
	required:[
		'Uize.Dom.Basics',
		'Uize.Dom.Pos'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_true = true,
				_false = false,
				_getDimensions = Uize.Dom.Pos.getDimensions,
				_copyInto = Uize.copyInto
		;

		/*** Private Methods ***/
			function _getMooringNodeWidth (m) {
				var _mooringNode = m.getMooringNode();

				return _mooringNode ? _getDimensions(_mooringNode).width : undefined;
			}

			function _updateUiSelector (m) {
				// basically we want to the selector button from jumping in size when the value details are updated
				// in the value display, but since we don't know what data can go in it ahead of time, we can only
				// ensure that the button never shrinks in size.
				if (m.isWired) {
					var
						_valueDisplayShellNode = m.children.selector.getNode('valueDisplayShell'),
						_valueDisplayShellNodeWidth = _getDimensions(_valueDisplayShellNode).width,
						_valueDisplayShellNodeMaxWidth = parseInt(m.getNodeStyle(_valueDisplayShellNode, 'maxWidth')),
						_previousValueDisplayShellWidth = m._previousValueDisplayShellWidth
					;

					if (_previousValueDisplayShellWidth && _valueDisplayShellNodeWidth < _previousValueDisplayShellWidth) {
						m.setNodeStyle(
							_valueDisplayShellNode,
							{
								minWidth:_valueDisplayShellNodeMaxWidth
									? Math.min(_previousValueDisplayShellWidth, _valueDisplayShellNodeMaxWidth)
									: _previousValueDisplayShellWidth
							}
						);
					}
					else if (_valueDisplayShellNodeWidth) {
						m._previousValueDisplayShellWidth = _valueDisplayShellNodeWidth;
						m.palette
							&& m.palette.set({minWidth:_getMooringNodeWidth(m)});
					}
				}
			}

		return _superclass.subclass ({
			omegastructor:function () {
				var
					m = this
				;

				m.wire(
					'Changed.valueDetails',
					function () {
						m.set({_tentativeValueDetails:m.get('valueDetails')});
						_updateUiSelector(m);
					}
				);

				m._previousValueDisplayShellWidth = 0;
			},

			instanceMethods:{
				getDialogWidgetProperties:function () {
					var
						m = this
					;

					return _copyInto(
						_superclass.doMy(m,'getDialogWidgetProperties') || {},
						{
							parent:m,
							offsetX:'adjacent',	// we want the dialog to show up next to the selector button to look like a droplist palette
							offsetY:'adjacent',
							minWidth:_getMooringNodeWidth(m)
						}
					);
				},

				getMoreDialogEventHandlers:function () {
					var
						m = this,
						_selector = m.children.selector,
						_undefined
					;

					function _addSyncHandler(_propertyName) {
						return Uize.pairUp(
							'Changed.' + _propertyName,
							function (_event) {
								m.palette = _event.source;

								var _dialogPropertyValue = m.palette.get(_propertyName);
								_dialogPropertyValue !== _undefined
									&& m.set(_propertyName, _dialogPropertyValue)
								;
							}
						);
					}

					return _copyInto(
						_superclass.doMy(m,'getMoreDialogEventHandlers') || {},
						_addSyncHandler('tentativeValue'),
						_addSyncHandler('tentativeValueDetails'),
						{
							'Before Show':function (_event) {
								var _palette = m.palette = _event.source;

								_selector.set({selected:_true});
								m.set({focused:_true});
								_palette.set({
									minWidth:_getMooringNodeWidth(m)
								});

								if (!m._movedPalette) {
									m._movedPalette = _true;

									var
										_paletteRoot = _palette.getNode(),
										_documentBody = document.body
									;

									// Need to move the root and the shield to the body root to ensure that it will be on top of everything,
									// if it already isn't there
									if (_paletteRoot && _paletteRoot.parentNode != _documentBody) {
										var _paletteShield = _palette.getNode('shield');

										// detach from current place in DOM
										Uize.Dom.Basics.remove([_paletteRoot, _paletteShield]);

										_paletteShield && _documentBody.appendChild(_paletteShield);
										_documentBody.appendChild(_paletteRoot);
									}
								}
							},
							'After Hide':function () {
								m.set({focused:_false});
								_selector.set({selected:_false});
								m.palette = _undefined;
							}
						}
					);
				},

				updateUi:function () {
					var m = this;
					if (m.isWired) {
						_updateUiSelector(m);
						_superclass.doMy (m,'updateUi');
					}
				}
			},

			stateProperties:{
				_syncTentativeValue:{
					name:'syncTentativeValue',
					value:_true
				},
				_tentativeValueDetails:{
					name:'tentativeValueDetails',
					onChange:function () {
						/** One-way sync tentative value details to selector button **/
						var m = this;

						m._syncTentativeValue
							&& m.children.selector.set({valueDetails:m._tentativeValueDetails})
						;
						_updateUiSelector(m);
					}
				}
			},

			set:{
				dialogName:'palette'
			}
		});
	}
});

