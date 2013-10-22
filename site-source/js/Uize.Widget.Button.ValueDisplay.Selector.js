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
						var m = this;

						function _updateUiSelectorState() { m._updateUiSelectorState() }
						m.wire ({
							'Changed.busyInherited':_updateUiSelectorState,
							'Changed.enabledInherited':_updateUiSelectorState,
							'Changed.state':_updateUiSelectorState,
							'Changed.selected':function() { m._updateUiSelectedState() },
							'Changed.valueDetails':function() { m._updateUiSelectorValueDetails() }
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
					m = this,
					_valueDetails = m.get('valueDetails')
				;

				if (m.isWired) {
					if (_valueDetails) {
						_valueDetails.value != null
							&& m._setInputNodeProperties({value:_valueDetails.name})
						;
						_valueDetails.displayName != null
							&& m.setNodeInnerHtml('displayName', _valueDetails.displayName)
						;
					}

					m.displayNode('',_valueDetails);
				}
			};

			_classPrototype._updateUiSelectorState = function() {
				var m = this;

				if (m.isWired) {
					var
						_state = m.get('state'),
						_enabled = m.get ('enabledInherited') && !m.get ('busyInherited')
					;

					m._setInputNodeProperties({
						readOnly:!_enabled,
						disabled:!_enabled
					});

					_Uize_Node_Classes.setState(
						m.getNode(),
						['', m._cssClassTentativeSelected, m._cssClassActive, m._cssClassDisabled],
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
				var m = this;

				if (m.isWired) {
					var _selected = m.get('selected');

					m._setInputNodeProperties({checked:_selected});

					_Uize_Node_Classes.setState(
						m.getNode(),
						m._cssClassSelected,
						_selected
					);
				}
			};

		/*** Public Instance Methods ***/
			_classPrototype.updateUi = function () {
				var m = this;
				if (m.isWired) {
					m._updateUiSelectorValueDetails();
					m._updateUiSelectorState();
					m._updateUiSelectedState();
					_superclass.doMy (m,'updateUi');
				}
			};

			_classPrototype.wireUi = function () {
				var m = this;
				if (!m.isWired) {
					var
						_inputNode = m.getNode('input'),
						_displayNameNode = m.getNode('displayName')
					;

					m.wireNode(
						_inputNode,
						'change',
						function (_event) {
							var _checked = _inputNode.checked;

							// NOTE: in some browsers (like Safari), clicking the input node, not only
							// fires the 'change' event, but also 'click' for the root node, so
							// clicking the checkbox ends up setting selcted to false and then back true
							// because of clickToSelect & clickToDeselect
							if (
								(_checked && !m.get('clickToSelect'))
									|| (!_checked && !m.get('clickToDeselect'))
							) {
								m.set({selected:_checked});

								// Options widget just watches on click of its buttons, so in order for
								// it to know that clicking the radio has changed the value, we need to
								// fire click
								m.fire({name:'Click', domEvent:_event});
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

					_superclass.doMy (m,'wireUi');
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

