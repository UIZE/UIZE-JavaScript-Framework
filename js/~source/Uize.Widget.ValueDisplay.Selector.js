/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.ValueDisplay.Selector Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=d" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Class
	importance: 2
	codeCompleteness: 100
	testCompleteness: 0
	docCompleteness: 10
*/

/*?
	Introduction
		The =Uize.Widget.ValueDisplay.Selector= widget provides the base functionality for displaying a value within selection UI.

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.ValueDisplay.Selector',
	required:'Uize.Node.Classes',
	builder:function (_superclass) {
		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function () {
						var _this = this;

						function _updateUiState() { _this._updateUiState() }
						_this.wire ({
							'Changed.busyInherited':_updateUiState,
							'Changed.enabledInherited':_updateUiState,
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

				_this.isWired
					&& _valueDetails
					&& _valueDetails.displayName != null
					&& _this.setNodeInnerHtml('displayName', _valueDetails.displayName)
				;
			};
			
			_classPrototype._updateUiSelected = function() {
				var _this = this;
				
				_this._setInputNodeProperties({checked:_this._selected});
				
				Uize.Node.Classes.setState(
					_this.getNode(),
					['', _this._cssClassTentativeSelected, _this._cssClassSelected],
					(_this._selected ? 2 : _this._tentativeSelected && 1) || 0
				);
			};

			_classPrototype._updateUiState = function () {
				var
					_this = this,
					_enabled = _this.get ('enabledInherited') && !_this.get ('busyInherited')
				;

				_this._setInputNodeProperties({readOnly:!_enabled,disabled:!_enabled});
			};

		/*** Public Instance Methods ***/
			_classPrototype.updateUi = function () {
				var _this = this;
				if (_this.isWired) {
					_this._updateUiSelectorValueDetails();
					_this._updateUiSelected();
					_this._updateUiState();
					_superclass.prototype.updateUi.call (_this);
				}
			};

			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					var _inputNode = _this.getNode('input');

					_this.wireNode(
						_inputNode,
						'change',
						function () { _this.set({selected:_inputNode.checked}) }
					);

					_superclass.prototype.wireUi.call (_this);
				}
			};

		/*** Register Properties ***/
			_class.registerProperties ({
				_cssClassSelected:'cssClassSelected',
				_cssClassTentativeSelected:'cssClassTentativeSelected',
				_selected:{
					name:'selected',
					onChange:_classPrototype._updateUiSelected,
					value:false
				},
				_tentativeSelected:{
					name:'tentativeSelected',
					onChange:_classPrototype._updateUiSelected,
					value:false
				}
			});

		return _class;
	}
});

