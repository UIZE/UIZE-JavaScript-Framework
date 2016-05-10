/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Button.Toggle Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2006-2016 UIZE
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

		var
			/*** Variables for Scruncher Optimization ***/
				_null = null
		;

		/*** Private Instance Methods ***/
			function _updateUiTextAndTitle (m) {
				if (m.isWired) {
					var
						_valueObject = m._valueObject,
						_text = '',
						_title = ''
					;
					if (_valueObject) {
						var _nextValueObject = m._values [_getNextValueNo (m)];
						_text = Uize.substituteInto (
							m._textTemplate,
							m._textShowNext ? _nextValueObject : _valueObject
						);
						_title = Uize.substituteInto (
							m._titleTemplate,
							m._titleShowNext ? _nextValueObject : _valueObject
						);
					}
					m.set ('text',_text);
					m.setNodeProperties ('',{title:_title});
				}
			}

			function _onChangeUpdateUiTextAndTitle () {_updateUiTextAndTitle (this)}

			function _getNextValueNo (m) {
				var
					_values = m._values,
					_valueNo = m._valueNo
				;
				return _values ? (typeof _valueNo == 'number' ? (_valueNo + 1) % _values.length : 0) : _null;
			}

		return _superclass.subclass ({
			instanceMethods:{
				toggleButton:function () {this.set ({_valueNo:_getNextValueNo (this)})},

				updateUi:function () {
					var m = this;
					if (m.isWired) {
						_updateUiTextAndTitle (m);
						_superclass.doMy (m,'updateUi');
					}
				},

				wireUi:function () {
					var m = this;
					if (!m.isWired) {
						m.wire ('Click',function () {m.toggleButton ()});
						_superclass.doMy (m,'wireUi');
					}
				}
			},

			stateProperties:{
				_textShowNext:{
					name:'textShowNext',
					onChange:_onChangeUpdateUiTextAndTitle,
					value:true
				},
				_textTemplate:{
					name:'textTemplate',
					onChange:_onChangeUpdateUiTextAndTitle,
					value:'Switch to [#displayName]'
				},
				_titleShowNext:{
					name:'titleShowNext',
					onChange:_onChangeUpdateUiTextAndTitle,
					value:false
				},
				_titleTemplate:{
					name:'titleTemplate',
					onChange:_onChangeUpdateUiTextAndTitle,
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
						var m = this;
						m.set ({
							_valueObject:m._values && m._valueNo != _null ? m._values [m._valueNo] : _null
						});
						m.set ({_value:m._valueObject ? m._valueObject.value : _null});
						_updateUiTextAndTitle (m);
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
						var m = this;
						if (m._values) {
							m._valueNo = _null;
							m.set ({_valueNo:0});
						} else {
							_updateUiTextAndTitle (m);
						}
					},
					value:_null
				}
			}
		});
	}
});

