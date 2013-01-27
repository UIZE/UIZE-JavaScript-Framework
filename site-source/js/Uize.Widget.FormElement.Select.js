/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.FormElement.Select Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2011-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 6
	codeCompleteness: 80
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.FormElement.Select= class serves a wrapper class in order to provide a beter programmable interface to a <select> form element.

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.FormElement.Select',
	builder:function (_superclass) {
		'use strict';

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function() {
						var _this = this;

						_this.wire(
							'Changed.value',
							function() {
								if (_this.isWired) {
									var _selectNode = _this.getNode('input');

									_selectNode
										&& _this.set({_valueNo:_selectNode.selectedIndex})
								}
							}
						);
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._updateUiValues = function() {
				var _this = this;

				if (_this.isWired) {
					var
						_oldValue = _this.get('value'),
						_values = _this._values,
						_selectNode = _this.getNode('input')
					;

					if (_values && _selectNode && _this.get('type') == 'select-one') {
						var _valueFound = false;

						// setting the value to null was commented out to fix bug 9574.
						// it wasn't deleted in case its exclusion caused another bug.
						//_this.set({value:null});
						_this._valueNo = -1;

						// iterate through the values in values object, replacing the Option nodes
						// adding new ones if necessary
						for (
							var
								_valueNo = -1,
								_valuesLength = _values.length,
								_options = _selectNode.options,
								_optionsLength = _options.length
							;
							++_valueNo < _valuesLength;
						) {
							var
								_valueObject = _values[_valueNo],
								_valueObjectName = _valueObject.name,
								_selected = _oldValue == _valueObjectName,
								_optionNode
							;

							if (_valueNo < _optionsLength)// option node already exists
								_optionNode = _options[_valueNo];
							else {
								_optionNode = document.createElement('option');
								try { _selectNode.add(_optionNode, null) }	// standards compliant
								catch(_ex) { _selectNode.add(_optionNode) }
							}

							_this.setNodeProperties(
								_optionNode,
								{
									value:_valueObjectName,
									text:(_valueObject.valueDetails && _valueObject.valueDetails.displayName) || _valueObject.displayName || _valueObjectName,
									selected:_selected
								}
							);

							if (_selected)
								_valueFound = true;
						}

						// Now iterate through options removing any extras
						// NOTE: _optionsLength may not be the actual length of the options array at this point
						// if we added new options past its original length.  But if that's the case, there'll
						// be nothing to remove, so it's ok
						for (var _optionNo = _optionsLength - 1; _optionNo >= _valueNo; _optionNo--)
							_selectNode.remove(_optionNo)
						;

						if (!(_valueFound && _oldValue) && _values.length)
							_this.set({value:_values[0].name});
					}
				}
			};

		/*** Public Instance Methods ***/
			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					_superclass.prototype.wireUi.call (_this);

					var
						_values = _this._values,
						_selectNode = _this.getNode('input')
					;

					if (_values.length)	// values data exists so update the <option>s in the <select> tag
						_this._updateUiValues();
					else if (_selectNode && _this.get('type') == 'select-one') { // build values from <select> tag <option>s
						// iterate through each option and add to values state property
						for (
							var
								_value = _this.get('value'),
								_options = _selectNode.options,
								_optionNo = -1,
								_optionsLength = _options.length
							;
							++_optionNo < _optionsLength;
						) {
							var
								_optionNode = _options[_optionNo],
								_optionValue = _optionNode.value,
								_optionText = _optionNode.text,
								_valueObjectName = _optionValue != null ? _optionValue : _optionText
							;

							_values.push({
								name:_valueObjectName,
								displayName:_optionText
							});

							if (_valueObjectName == _value)
								_optionNode.selected = true;
						}

						// set valueNo to be selectedIndex && sync up the value in case it has changed
						(_this._valueNo = _selectNode.selectedIndex) > -1
							&& _this.set({value:_values[_this._valueNo].name})
						;
					}
				}
			};

		/*** State Properties ***/
			_class.stateProperties({
				_valueNo:{	// readonly
					name:'valueNo',
					value:-1
				},
				_values:{
					name:'values',
					onChange:_classPrototype._updateUiValues,
					value:[]
				}
			});

		return _class;
	}
});

