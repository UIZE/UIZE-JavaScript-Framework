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
	required:'Uize.Node.Classes',
	builder:function (_superclass) {
		'use strict';

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function () {
						var m = this;
						m.wire ('Changed.value',function () {m._updateUiTabContent ()});
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

			_classPrototype._updateTabBodyClass = function (_valueNo, _currentValueNo) {
				var m = this;

				if (_valueNo > -1)
				{
					var _isValue = _valueNo == _currentValueNo,
						_bodyClassActive = m._bodyClassActive,
						_bodyClassInactive = m._bodyClassInactive,
						_tabBody = m._getTabBodyNode(_valueNo)
					;

					Uize.Node.Classes.addClass(_tabBody, _isValue ? _bodyClassActive : _bodyClassInactive);
					Uize.Node.Classes.removeClass(_tabBody, _isValue ? _bodyClassInactive : _bodyClassActive);
				}
			};

			_classPrototype._updateUiTabContent = function () {
				var m = this;
				if (m.isWired) {
					var _currentValueNo = m.get ('valueNo');
					if (m._tabCanBeSelected (_currentValueNo)) {
						m.updateUiTabState (m._lastShownTabBodyNo,_currentValueNo);
						m._lastShownTabBodyNo = _currentValueNo;
					}
					else if (m._mustHaveSelectedTab){
						for (
							var  _valueNo = -1, _values = m.get ('values'), _valuesLength = _values.length;
							++_valueNo < _valuesLength;
						) {
							if (m._tabCanBeSelected (_valueNo)) {
								m.set ({value:_values [_valueNo]});
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
				var m = this;
				if (!m.isWired) {
					_superclass.doMy (m,'wireUi');
					var _valueNo = m._lastShownTabBodyNo = m.get ('valueNo');
					Uize.forEach (
						m.get ('values'),
						function (_value,_tabNo) {m._updateTabBodyClass (_tabNo, _valueNo)}
					);
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_bodyClassActive:'bodyClassActive',
				_bodyClassInactive:'bodyClassInactive',
				_mustHaveSelectedTab:{
					name:'mustHaveSelectedTab',
					value:true
				}
			});

		return _class;
	}
});

