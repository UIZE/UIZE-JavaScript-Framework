/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.SelectorOption Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=d" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 100
	testCompleteness: 0
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.SelectorOption= widget provides the functionality for a selector option used in =Uize.Widget.Picker.SelectorOld= widgets

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.SelectorOption',
	superclass:'Uize.Widget.Button',
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
							'Changed.selected':function() { _this._updateUiSelected() }
						});

					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._setInputNodeProperties = function (_nodeProperties) {
				this.isWired && this.setNodeProperties('input', _nodeProperties)
			};
			_classPrototype._updateUiSelected = function() {
				this._setInputNodeProperties({checked:this.get('selected')})
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

		return _class;
	}
});

