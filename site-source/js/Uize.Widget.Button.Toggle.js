/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Button.Toggle Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2006-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	docCompleteness: 3
*/

/*?
	Introduction
		The =Uize.Widget.Button.Toggle= class extends its superclass by letting the user repeatedly click in order to cycle through a set of two or more values.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.Button.Toggle',
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var _null = null;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			var _updateUiTextAndTitle = _classPrototype._updateUiTextAndTitle = function () {
				var _this = this;
				if (_this.isWired) {
					var
						_valueObject = _this._valueObject,
						_text = '',
						_title = ''
					;
					if (_valueObject) {
						var _nextValueObject = _this._values [_this._getNextValueNo ()];
						_text = Uize.substituteInto (
							_this._textTemplate,
							_this._textShowNext ? _nextValueObject : _valueObject
						);
						_title = Uize.substituteInto (
							_this._titleTemplate,
							_this._titleShowNext ? _nextValueObject : _valueObject
						);
					}
					_this.set ('text',_text);
					_this.setNodeProperties ('',{title:_title});
				}
			};

			_classPrototype._getNextValueNo = function () {
				var
					_values = this._values,
					_valueNo = this._valueNo
				;
				return _values ? (typeof _valueNo == 'number' ? (_valueNo + 1) % _values.length : 0) : _null;
			};

		/*** Public Instance Methods ***/
			_classPrototype.toggleButton = function () {this.set ({_valueNo:this._getNextValueNo ()})};

			_classPrototype.updateUi = function () {
				var _this = this;
				if (_this.isWired) {
					_this._updateUiTextAndTitle ();
					_superclass.prototype.updateUi.call (_this);
				}
			};

			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					_this.wire ('Click',function () {_this.toggleButton ()});
					_superclass.prototype.wireUi.call (_this);
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_textShowNext:{
					name:'textShowNext',
					onChange:_updateUiTextAndTitle,
					value:true
				},
				_textTemplate:{
					name:'textTemplate',
					onChange:_updateUiTextAndTitle,
					value:'Switch to [#displayName]'
				},
				_titleShowNext:{
					name:'titleShowNext',
					onChange:_updateUiTextAndTitle,
					value:false
				},
				_titleTemplate:{
					name:'titleTemplate',
					onChange:_updateUiTextAndTitle,
					value:'Currently [#displayName]'
				},
				_value:{
					name:'value',
					onChange:function () {
						this._values && this.set ({_valueNo:Uize.findRecordNo (this._values,{value:this._value},0)});
					},
					value:_null
				},
				_valueNo:{
					name:'valueNo',
					onChange:function () {
						var _this = this;
						_this.set ({
							_valueObject:_this._values && _this._valueNo != _null ? _this._values [_this._valueNo] : _null
						});
						_this.set ({_value:_this._valueObject ? _this._valueObject.value : _null});
						_this._updateUiTextAndTitle ();
					},
					value:_null
				},
				_valueObject:{
					name:'valueObject',
					value:_null
				},
				_values:{
					name:'values',
					onChange:function () {
						var _this = this;
						if (_this._values) {
							_this._valueNo = _null;
							_this.set ({_valueNo:0});
						} else {
							_this._updateUiTextAndTitle ();
						}
					},
					value:_null
				}
			});

		return _class;
	}
});

