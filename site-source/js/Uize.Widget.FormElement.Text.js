/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.FormElement.Text Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2013 UIZE
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
		The =Uize.Widget.FormElement.Text= class is a subclass of =Uize.Widget.FormElement= to provide specific functionality for text input form elements.

		*DEVELOPERS:* `Tim Carter`, `Ben Ilegbodu`, `Vinson Chuong`
*/

Uize.module ({
	name:'Uize.Widget.FormElement.Text',
	required:'Uize.Node',
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_supportsPlaceholder = typeof document != 'undefined'
					&& 'placeholder' in document.createElement('input'),
				_undefined
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass(
					null,
					function () {
						var m = this;

						m.wire(
							'Changed.focused',
							function (_event) {
								if (m.isWired) {
									var
										_focused = _event.newValue,
										_placeholder = m._placeholder,
										_value = m.valueOf()
									;

									if (_placeholder && !_supportsPlaceholder) {
										var _newText;
										if (_focused && _value == _placeholder)
											_newText = '';
										else if (!_focused && !_value)
											_newText = _placeholder
										;
										_newText != _undefined && m.setNodeValue ('input', _newText);
									}

									_focused
										&& _value
										&& m.setCaretPosition(_value.length);
								}
							}
						);

						m._updateMoreValidators();
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._updateMoreValidators = function () {
				var m = this;

				m._moreValidators = [
					function (_value) {
						var
							_valueString = _value + '',
							_valueLength = _value != null ? _valueString.length : 0
						;

						return _valueLength >= m._minLength && _valueLength <= m._maxLength;
					}
				];
			};

			_classPrototype._updateUiPlaceholder = function () {
				this.isWired
					&& _supportsPlaceholder
					&& this.setNodeProperties('input', {placeholder:this._placeholder})
				;
			};

		/*** Public Instance Methods ***/
			_classPrototype.checkIsEmpty = function () {
				return _superclass.doMy (this,'checkIsEmpty') || this.valueOf() == this._placeholder;
			};

			_classPrototype.getCaretPosition = function () {
				var
					m = this,
					_caretPosition = -1
				;

				if (m.isWired && m.get ('focused')) {
					var _input = m.getNode ('input');
					if ('selectionStart' in _input)
						_caretPosition = _input.selectionStart;
					else if (_input.createTextRange) {
						var _sel = _input.createTextRange ();
						_sel.moveStart ('character', -m.get ('tentativeValue').length);
						_caretPosition = _sel.text.length;
					}
				}
				
				return _caretPosition;
			};
			
			_classPrototype.select = function(_startPosition, _endPosition) {
				var m = this;
				
				if (m.isWired) {
					var
						_input = m.getNode ('input'),
						_value = m.valueOf()
					;
					
					m.set('focused', true);
					
					if (_value) {
						if (_startPosition == _undefined)
							_input.select();
						else {
							_endPosition = _endPosition == _undefined ? _value.length : _endPosition;
							
							if (_input.setSelectionRange)
								_input.setSelectionRange (_startPosition, _endPosition);
							else if (_input.createTextRange) {
								var _range = _input.createTextRange ();
								_range.collapse (true);
								_range.moveEnd ('character', _endPosition);
								_range.moveStart ('character', _startPosition);
								_range.select ();
							}
						}
					}
				}
			};

			_classPrototype.setCaretPosition = function (_position) { this.select(_position, _position) };

			_classPrototype.getMoreValidators = function () { return this._moreValidators };

			_classPrototype.updateUi = function () {
				if (this.isWired) {
					this._updateUiPlaceholder();
					_superclass.doMy (this,'updateUi');
				}
			};

			_classPrototype.wireUi = function () {
				var m = this;

				if (!m.isWired) {
					var
						_placeholder = m._placeholder,
						_input = m.getNode ('input')
					;

					// Set input placeholder
					if (_placeholder) {
						if (_supportsPlaceholder)
							m.setNodeProperties (_input, {placeholder:_placeholder});
						else
							m.set ('value', _placeholder);
					}

					_superclass.doMy (m,'wireUi');
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
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

