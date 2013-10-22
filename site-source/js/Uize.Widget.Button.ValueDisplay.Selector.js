/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Button.ValueDisplay.Selector Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2011-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 7
	codeCompleteness: 100
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.Button.ValueDisplay.Selector= widget provides the functionality for displaying an option value within an options selector

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.Button.ValueDisplay.Selector',
	required:'Uize.Node.Classes',
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_Uize_Node_Classes = Uize.Node.Classes
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function () {
						var _this = this;

						function _updateUiSelectorState() { _this._updateUiSelectorState() }
						_this.wire ({
							'Changed.busyInherited':_updateUiSelectorState,
							'Changed.enabledInherited':_updateUiSelectorState,
							'Changed.state':_updateUiSelectorState,
							'Changed.selected':function() { _this._updateUiSelectedState() },
							'Changed.valueDetails':function() { _this._updateUiSelectorValueDetails() }
						});

					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._setInputNodeProperties = function (_nodeProperties) {
				this.isWired && this.setNodeProperties('input', _nodeProperties)
			};

			_classPrototype._updateUiSelectorValueDetails = function() {
				var
					_this = this,
					_valueDetails = _this.get('valueDetails')
				;

				if (_this.isWired) {
					if (_valueDetails) {
						_valueDetails.value != null
							&& _this._setInputNodeProperties({value:_valueDetails.name})
						;
						_valueDetails.displayName != null
							&& _this.setNodeInnerHtml('displayName', _valueDetails.displayName)
						;
					}

					_this.displayNode('',_valueDetails);
				}
			};

			_classPrototype._updateUiSelectorState = function() {
				var _this = this;

				if (_this.isWired) {
					var
						_state = _this.get('state'),
						_enabled = _this.get ('enabledInherited') && !_this.get ('busyInherited')
					;

					_this._setInputNodeProperties({
						readOnly:!_enabled,
						disabled:!_enabled
					});

					_Uize_Node_Classes.setState(
						_this.getNode(),
						['', _this._cssClassTentativeSelected, _this._cssClassActive, _this._cssClassDisabled],
						(!_enabled
							? 3
							: (_state == 'down'
								? 2
								: _state == 'over' && 1) || 0
						)
					);
				}
			};

			_classPrototype._updateUiSelectedState = function () {
				var _this = this;

				if (_this.isWired) {
					var _selected = _this.get('selected');

					_this._setInputNodeProperties({checked:_selected});

					_Uize_Node_Classes.setState(
						_this.getNode(),
						_this._cssClassSelected,
						_selected
					);
				}
			};

		/*** Public Instance Methods ***/
			_classPrototype.updateUi = function () {
				var _this = this;
				if (_this.isWired) {
					_this._updateUiSelectorValueDetails();
					_this._updateUiSelectorState();
					_this._updateUiSelectedState();
					_superclass.doMy (_this,'updateUi');
				}
			};

			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					var
						_inputNode = _this.getNode('input'),
						_displayNameNode = _this.getNode('displayName')
					;

					_this.wireNode(
						_inputNode,
						'change',
						function (_event) {
							var _checked = _inputNode.checked;

							// NOTE: in some browsers (like Safari), clicking the input node, not only
							// fires the 'change' event, but also 'click' for the root node, so
							// clicking the checkbox ends up setting selcted to false and then back true
							// because of clickToSelect & clickToDeselect
							if (
								(_checked && !_this.get('clickToSelect'))
									|| (!_checked && !_this.get('clickToDeselect'))
							) {
								_this.set({selected:_checked});

								// Options widget just watches on click of its buttons, so in order for
								// it to know that clicking the radio has changed the value, we need to
								// fire click
								_this.fire({name:'Click', domEvent:_event});
							}
						}
					);

					// NOTE: in the case where the display name is a <label> tag w/ a for
					// attribute, this could cause double selections on the input tag,
					// one for the overall button click and one for the <label> interaction.
					// Once this widget is wired on the client-side we don't need the <label>
					// interaction to check the input for us any longer
					_displayNameNode
						&& _displayNameNode.removeAttribute('for')
					;

					_superclass.doMy (_this,'wireUi');
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_cssClassActive:'cssClassActive',
				_cssClassDisabled:'cssClassDisabled',
				_cssClassSelected:'cssClassSelected',
				_cssClassTentativeSelected:'cssClassTentativeSelected'
			});

		return _class;
	}
});

