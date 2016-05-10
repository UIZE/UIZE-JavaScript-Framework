/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Options.Tabbed Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2006-2016 UIZE
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
	required:'Uize.Dom.Classes',
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize_Dom_Classes = Uize.Dom.Classes
		;

		/*** Private Instance Methods ***/
			function _resolveToValueNo (m,_valueOrValueNo) {
				return Uize.isNumber (_valueOrValueNo) ? _valueOrValueNo : m.getValueNoFromValue (_valueOrValueNo);
			}

			function _getTabBodyNode (m,_valueOrValueNo) {
				return m.getNode ('option' + _resolveToValueNo (m,_valueOrValueNo) + 'TabBody');
			}

			function _tabCanBeSelected (m,_value) {
				return m.tabExists (_value) && m.getOptionButton (_value).get ('enabled');
			}

			function _updateTabBodyClass (m, _valueNo, _currentValueNo) {
				if (_valueNo > -1)
				{
					var _isValue = _valueNo == _currentValueNo,
						_bodyClassActive = m._bodyClassActive,
						_bodyClassInactive = m._bodyClassInactive,
						_tabBody = _getTabBodyNode(m,_valueNo)
					;
					_Uize_Dom_Classes.addClass(_tabBody, _isValue ? _bodyClassActive : _bodyClassInactive);
					_Uize_Dom_Classes.removeClass(_tabBody, _isValue ? _bodyClassInactive : _bodyClassActive);
				}
			}

			function _updateUiTabContent (m) {
				if (m.isWired) {
					var _currentValueNo = m.get ('valueNo');
					if (_tabCanBeSelected (m,_currentValueNo)) {
						m.updateUiTabState (m._lastShownTabBodyNo,_currentValueNo);
						m._lastShownTabBodyNo = _currentValueNo;
					}
					else if (m._mustHaveSelectedTab){
						for (
							var  _valueNo = -1, _values = m.get ('values'), _valuesLength = _values.length;
							++_valueNo < _valuesLength;
						) {
							if (_tabCanBeSelected (m,_valueNo)) {
								m.set ({value:_values [_valueNo]});
								break;
							}
						}
					}
				}
			}

		return _superclass.subclass ({
			omegastructor:function () {
				var m = this;
				m.wire ('Changed.value',function () {_updateUiTabContent (m)});
			},

			instanceMethods:{
				enableTab:function (_value,_mustEnable) {
					this.getOptionButton (_value).set ({enabled:_mustEnable ? 'inherit' : false});
					_updateUiTabContent (this);
				},

				getOptionButton:function (_valueOrValueNo) {
					return this.children ['option' + _resolveToValueNo (this,_valueOrValueNo)];
				},

				getTabBodyNode:function (_valueOrValueNo) {return _getTabBodyNode (this,_valueOrValueNo)},

				tabExists:function (_valueOrValueNo) {
					var _optionButton = this.getOptionButton (_valueOrValueNo);
					return (
						_optionButton && (_optionButton.getNode () || _getTabBodyNode (this,_valueOrValueNo))
							? true
							: false
					);
				},

				updateUiTabState:function (_lastShownTabBodyNo,_currentValueNo) {
					_updateTabBodyClass (this,_lastShownTabBodyNo, _currentValueNo);
					_updateTabBodyClass (this,_currentValueNo, _currentValueNo);
				},

				wireUi:function () {
					var m = this;
					if (!m.isWired) {
						_superclass.doMy (m,'wireUi');
						var _valueNo = m._lastShownTabBodyNo = m.get ('valueNo');
						Uize.forEach (
							m.get ('values'),
							function (_value,_tabNo) {_updateTabBodyClass (m, _tabNo, _valueNo)}
						);
					}
				}
			},

			stateProperties:{
				_bodyClassActive:'bodyClassActive',
				_bodyClassInactive:'bodyClassInactive',
				_mustHaveSelectedTab:{
					name:'mustHaveSelectedTab',
					value:true
				}
			}
		});
	}
});

