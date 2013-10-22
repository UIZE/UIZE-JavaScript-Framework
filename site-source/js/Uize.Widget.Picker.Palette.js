/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Picker.Palette Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2011-2013 UIZE
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

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.Picker.Palette',
	required:'Uize.Node',
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false,
				_Uize_Node = Uize.Node
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function() {
						var
							_this = this,
							_selector = _this.children.selector
						;

						_this.wire(
							'Changed.valueDetails',
							function() {
								_this.set({_tentativeValueDetails:_this.get('valueDetails')});
								_this._updateUiSelector();
							}
						);

						_this._previousValueDisplayShellWidth = 0;
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Methods ***/
			_classPrototype._getMooringNodeWidth = function() {
				var
					_mooringNode = this.getMooringNode(),
					_undefined
				;

				return _mooringNode ? _Uize_Node.getDimensions(_mooringNode).width : _undefined;
			};

			_classPrototype._updateUiSelector = function() {
				var _this = this;

				// basically we want to the selector button from jumping in size when the value details are updated
				// in the value display, but since we don't know what data can go in it ahead of time, we can only
				// ensure that the button never shrinks in size.
				if (_this.isWired) {
					var
						_valueDisplayShellNode = _this.children.selector.getNode('valueDisplayShell'),
						_valueDisplayShellNodeWidth = _Uize_Node.getDimensions(_valueDisplayShellNode).width,
						_valueDisplayShellNodeMaxWidth = parseInt(_this.getNodeStyle(_valueDisplayShellNode, 'maxWidth')),
						_previousValueDisplayShellWidth = _this._previousValueDisplayShellWidth
					;

					if (_previousValueDisplayShellWidth && _valueDisplayShellNodeWidth < _previousValueDisplayShellWidth) {
						_this.setNodeStyle(
							_valueDisplayShellNode,
							{
								minWidth:_valueDisplayShellNodeMaxWidth
									? Math.min(_previousValueDisplayShellWidth, _valueDisplayShellNodeMaxWidth)
									: _previousValueDisplayShellWidth
							}
						);
					}
					else if (_valueDisplayShellNodeWidth) {
						_this._previousValueDisplayShellWidth = _valueDisplayShellNodeWidth;
						_this.palette
							&& _this.palette.set({minWidth:_this._getMooringNodeWidth()});
					}
				}
			};

		/*** Public Methods ***/
			_classPrototype.getDialogWidgetProperties = function() {
				var
					_this = this,
					_mooringNode = _this.getMooringNode(),
					_undefined
				;

				return Uize.copyInto(
					_superclass.prototype.getDialogWidgetProperties.call(_this) || {},
					{
						parent:_this,
						offsetX:'adjacent',	// we want the dialog to show up next to the selector button to look like a droplist palette
						offsetY:'adjacent',
						minWidth:_this._getMooringNodeWidth()
					}
				);
			};

			_classPrototype.getMoreDialogEventHandlers = function() {
				var
					_this = this,
					_selector = _this.children.selector,
					_undefined
				;

				function _addSyncHandler(_propertyName) {
					return Uize.pairUp(
						'Changed.' + _propertyName,
						function(_event) {
							_this.palette = _event.source;

							var _dialogPropertyValue = _this.palette.get(_propertyName);
							_dialogPropertyValue !== _undefined
								&& _this.set(_propertyName, _dialogPropertyValue)
							;
						}
					);
				}

				return Uize.copyInto(
					_superclass.prototype.getMoreDialogEventHandlers.call(_this) || {},
					_addSyncHandler('tentativeValue'),
					_addSyncHandler('tentativeValueDetails'),
					{
						'Before Show':function(_event) {
							var _palette = _this.palette = _event.source;

							_selector.set({selected:_true});
							_this.set({focused:_true});
							_palette.set({
								minWidth:_this._getMooringNodeWidth()
							});

							if (!_this._movedPalette) {
								_this._movedPalette = _true;

								var
									_paletteRoot = _palette.getNode(),
									_documentBody = document.body
								;

								// Need to move the root and the shield to the body root to ensure that it will be on top of everything,
								// if it already isn't there
								if (_paletteRoot && _paletteRoot.parentNode != _documentBody) {
									var _paletteShield = _palette.getNode('shield');

									// detach from current place in DOM
									_Uize_Node.remove([_paletteRoot, _paletteShield]);

									_paletteShield && _documentBody.appendChild(_paletteShield);
									_documentBody.appendChild(_paletteRoot);
								}
							}
						},
						'After Hide':function() {
							_this.set({focused:_false});
							_selector.set({selected:_false});
							_this.palette = _undefined;
						}
					}
				);
			};

			_classPrototype.updateUi = function () {
				var _this = this;
				if (_this.isWired) {
					_this._updateUiSelector();
					_superclass.doMy (_this,'updateUi');
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_syncTentativeValue:{
					name:'syncTentativeValue',
					value:_true
				},
				_tentativeValueDetails:{
					name:'tentativeValueDetails',
					onChange:[
						/** One-way sync tentative value details to selector button **/
						function() {
							var _this = this;

							_this._syncTentativeValue
								&& _this.children.selector.set({valueDetails:_this._tentativeValueDetails})
							;
						},
						_classPrototype._updateUiSelector
					]
				}
			});

		/*** Override Initial Values for Inherited State Properties ***/
			_class.set ({
				dialogName:'palette'
			});

		return _class;
	}
});

