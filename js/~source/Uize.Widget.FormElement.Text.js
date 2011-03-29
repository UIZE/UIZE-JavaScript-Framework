/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.FormElement.Text Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=d" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Class
	importance: 7
	codeCompleteness: 100
	testCompleteness: 0
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.FormElement.Text= class is a subclass of =Uize.Widget.FormElement= to provide specific functionality for text input form elements.

		*DEVELOPERS:* `Tim Carter`, `Ben Ilegbodu`
*/


Uize.module ({
	name:'Uize.Widget.FormElement.Text',
	builder:function(_superclass) {
		/*** Class Constructor ***/
			var
				_class = _superclass.subclass(
					null,
					function() {
						var _this = this;

						_this.wire(
							'Changed.focused',
							function() {
								var
									_focused = _this.get('focused'),
									_defaultValue = _this._defaultValue,
									_value = _this.get('value')
								;

								if (_defaultValue) {
									function _setValue(_newValue) { _this.set({value:_newValue}) }

									if (_focused && _value == _defaultValue)
										_setValue('');
									else if (!_focused && !_value)
										_setValue(_defaultValue)
								}

								if (_this.isWired && _focused) {
									var
										_inputNode = _this.getNode('input'),
										_valueLength = _inputNode.value ? _inputNode.value.length : 0
									;

									if (_valueLength > 0) {
										if (_inputNode.createTextRange) {
											var _range = _inputNode.createTextRange();
											_range.move('character', _valueLength);
											_range.select();
										}
										else if (_inputNode.setSelectionRange)
											_inputNode.setSelectionRange(_valueLength, _valueLength)
										;
									}
								}
							}
						);

						_this._updateMoreValidators();
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._updateMoreValidators = function() {
				var _this = this;

				_this._moreValidators = [
					function(_value) {
						var _valueLength = _value ? _value.length : 0;

						return _valueLength >= _this._minLength && _valueLength <= _this._maxLength;
					}
				];
			};

		/*** Public Instance Methods ***/
			_classPrototype.checkIsEmpty = function() {
				return _superclass.prototype.checkIsEmpty.call (this)
					|| this.get('value') == this._defaultValue
			};

			_classPrototype.getMoreValidators = function() { return this._moreValidators };

		/*** Register Properties ***/
			_class.registerProperties ({
				_defaultValue:'defaultValue',
				_minLength:{
					name:'minLength',
					onChange:_classPrototype._updateMoreValidators,
					value:0
				},
				_maxLength:{
					name:'maxLength',
					onChange:_classPrototype._updateMoreValidators,
					value:32767
				}
			});

		return _class;
	}
});

