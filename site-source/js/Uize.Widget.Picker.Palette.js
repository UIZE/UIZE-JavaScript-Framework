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
			var _Uize_Node = Uize.Node;

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

					if (_previousValueDisplayShellWidth && _valueDisplayShellNodeWidth < _previousValueDisplayShellWidth)
						_this.setNodeStyle(
							_valueDisplayShellNode,
							{
								minWidth:_valueDisplayShellNodeMaxWidth
									? Math.min(_previousValueDisplayShellWidth, _valueDisplayShellNodeMaxWidth)
									: _previousValueDisplayShellWidth
							}
						);
					else if (_valueDisplayShellNodeWidth)
						_this._previousValueDisplayShellWidth = _valueDisplayShellNodeWidth;
				}
			};

		/*** Public Methods ***/
			_classPrototype.getDialogWidgetProperties = function() {
				var
					_mooringNode = this.children.selector.getNode () || this.getNode ('input'),
					_undefined
				;

				return {
					offsetX:'adjacent',	// we want the dialog to show up next to the selector button to look like a droplist palette
					offsetY:'adjacent',
					minWidth:_mooringNode
						? Uize.Node.getDimensions(_mooringNode).width
						: _undefined
				};
			};

			_classPrototype.handleDialogSubmit = function(_valueInfo) {
				var
					_this = this,
					_undefined
				;

				function _createSetObject(_propertyName) {
					var _propertyValue = _valueInfo[_propertyName];
					return _propertyValue !== _undefined ? Uize.pairUp(_propertyName, _propertyValue) : _undefined
				}

				_this.set(
					Uize.copyInto(
						{},
						_createSetObject('tentativeValueDetails'),
						_createSetObject('tentativeValue')
					)
				);

				_superclass.prototype.handleDialogSubmit.call(_this, _valueInfo);
			};

			_classPrototype.updateUi = function () {
				var _this = this;
				if (_this.isWired) {
					_this._updateUiSelector();
					_superclass.prototype.updateUi.call (_this);
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_syncTentativeValue:{
					name:'syncTentativeValue',
					value:true
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

		return _class;
	}
});

