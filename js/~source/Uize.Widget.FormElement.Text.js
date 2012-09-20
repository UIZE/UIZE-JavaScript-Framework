/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.FormElement.Text Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

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

		*DEVELOPERS:* `Tim Carter`, `Ben Ilegbodu`, `Vinson Chuong`
*/


Uize.module ({
	name:'Uize.Widget.FormElement.Text',
	required:'Uize.Node',
	builder:function(_superclass) {
		/*** Variables for Scruncher Optimization ***/
			var
				_supportsPlaceholder = typeof document != 'undefined'
					&& 'placeholder' in document.createElement('input')
			;

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
									_placeholder = _this._placeholder,
									_value = _this.get('value'),
									_inputNode = _this.getNode('input')
								;

								if (_this.isWired) {
									if (_placeholder && !_supportsPlaceholder && _this.get('type') != 'password') {
										function _setText (_newText) { _this.setNodeValue (_inputNode, _newText) }

									if (_focused && _value == _placeholder)
										_setText ('');
									else if (!_focused && !_value)
										_setText (_placeholder)
								}

									if (_focused) {
									var
										_inputNodeValue = _this.getNodeValue(_inputNode),
										_valueLength = _inputNodeValue ? _inputNodeValue.length : 0
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
						var
							_valueString = _value + '',
							_valueLength = _value != null ? _valueString.length : 0
						;

						return _valueLength >= _this._minLength && _valueLength <= _this._maxLength;
					}
				];
			};

			_classPrototype._updateUiPlaceholder = function() {
				var _this = this;
				
				if (_this.isWired) {
					var
						_placeholder = _this._placeholder,
						_input = _this.getNode ('input')
					;

					// Set input placeholder
					if (_placeholder) {
						if (_supportsPlaceholder)
							_this.setNodeProperties (_input, {placeholder:_placeholder});
						else if (!_this.get('value') && !_this.get('focused') && _this.get('type') != 'password')
							_this.setNodeValue (_input, _placeholder);
					}
				}
			};

		/*** Public Instance Methods ***/
			_classPrototype.checkIsEmpty = function() {
				return _superclass.prototype.checkIsEmpty.call (this)
					|| this.get('value') == this._placeholder
			};

			_classPrototype.getCaretPosition = function () {
				var
					_this = this,
					_input = _this.getNode ('input')
				;

				if (_this.isWired && _this.get ('focused')) {
					if (Uize.Node.isIe) {
						var _sel = document.selection.createRange ();
						_sel.moveStart ('character', -_this.get ('tentativeValue').length);
						return _sel.text.length;
					} else {
						return _input.selectionStart;
					}
				} else {
					return -1;
				}
			};

			_classPrototype.setCaretPosition = function (_position) {
				var
					_this = this,
					_input = _this.getNode ('input')
				;

				if (_this.isWired && _this.get ('focused')) {
					if (Uize.Node.isIe) {
						var _range = _input.createTextRange ();
						_range.collapse (true);
						_range.moveEnd ('character', _position);
						_range.moveStart ('character', _position);
						_range.select ();
					} else
						_input.setSelectionRange (_position, _position);
				}
			};

			_classPrototype.getMoreValidators = function() { return this._moreValidators };

			_classPrototype.updateUi = function() {
				if (this.isWired) {
					_superclass.prototype.updateUi.call(this);
					this._updateUiPlaceholder();
				}
			};

		/*** Register Properties ***/
			_class.registerProperties ({
				_placeholder:{
					name:'placeholder|defaultValue',
					onChange:_classPrototype._updateUiPlaceholder,
					value:''
				},
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

