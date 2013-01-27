/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Options.Tabbed Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2006-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.Options.Tabbed= class implements a tabs widget, using a button-based option set where each option button has an associated tab body.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.Options.Tabbed',
	builder:function (_superclass) {
		'use strict';

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function() {
						var _this = this;
						_this.wire ('Changed.value',function () {_this._updateUiTabContent ()});
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._resolveToValueNo = function (_valueOrValueNo) {
				return Uize.isNumber (_valueOrValueNo) ? _valueOrValueNo : this.getValueNoFromValue (_valueOrValueNo);
			};

			_classPrototype._getTabBodyNode = function (_valueOrValueNo) {
				return this.getNode ('option' + this._resolveToValueNo (_valueOrValueNo) + 'TabBody')
			};

			_classPrototype._tabCanBeSelected = function (_value) {
				return this.tabExists (_value) && this.getOptionButton (_value).get ('enabled')
			};

			_classPrototype._updateTabBodyClass = function(_valueNo, _currentValueNo) {
				var _this = this;

				if (_valueNo > -1)
					_this.setNodeProperties (
						_this._getTabBodyNode (_valueNo),
						{className:_valueNo == _currentValueNo ? _this._bodyClassActive : _this._bodyClassInactive}
					)
				;
			};

			_classPrototype._updateUiTabContent = function () {
				var _this = this;
				if (_this.isWired) {
					var _currentValueNo = _this.get ('valueNo');
					if (_this._tabCanBeSelected (_currentValueNo)) {
						_this.updateUiTabState (_this._lastShownTabBodyNo,_currentValueNo);
						_this._lastShownTabBodyNo = _currentValueNo;
					} else {
						for (
							var  _valueNo = -1, _values = _this.get ('values'), _valuesLength = _values.length;
							++_valueNo < _valuesLength;
						) {
							if (_this._tabCanBeSelected (_valueNo)) {
								_this.set ({value:_values [_valueNo]});
								break;
							}
						}
					}
				}
			};

		/*** Public Instance Methods ***/
			_classPrototype.enableTab = function (_value,_mustEnable) {
				this.getOptionButton (_value).set ({enabled:_mustEnable ? 'inherit' : false});
				this._updateUiTabContent ();
			};

			_classPrototype.getOptionButton = function (_valueOrValueNo) {
				return this.children ['option' + this._resolveToValueNo (_valueOrValueNo)];
			};

			_classPrototype.getTabBodyNode = _classPrototype._getTabBodyNode;

			_classPrototype.tabExists = function (_valueOrValueNo) {
				var _optionButton = this.getOptionButton (_valueOrValueNo);
				return (
					_optionButton && (_optionButton.getNode () || this._getTabBodyNode (_valueOrValueNo))
						? true
						: false
				);
			};

			_classPrototype.updateUiTabState = function (_lastShownTabBodyNo,_currentValueNo) {
				this._updateTabBodyClass (_lastShownTabBodyNo, _currentValueNo);
				this._updateTabBodyClass (_currentValueNo, _currentValueNo);
			};

			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					_superclass.prototype.wireUi.call (_this);
					var _valueNo = _this._lastShownTabBodyNo = _this.get ('valueNo');
					Uize.forEach (
						_this.get ('values'),
						function (_value,_tabNo) {_this._updateTabBodyClass (_tabNo, _valueNo)}
					);
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_bodyClassActive:'bodyClassActive',
				_bodyClassInactive:'bodyClassInactive'
			});

		return _class;
	}
});

